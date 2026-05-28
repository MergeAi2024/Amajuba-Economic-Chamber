/*
  Minimal Express server to validate and perform profile updates using
  a Supabase service role key. This endpoint enforces allowed fields
  and verifies the caller via the Supabase access token.

  Required environment variables:
    SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY
    SUPABASE_REGISTRATIONS_TABLE (optional, defaults to public.registrations)
*/
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REG_TABLE = (process.env.SUPABASE_REGISTRATIONS_TABLE || 'public.registrations').trim();

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ALLOWED_FIELDS = ['first_name', 'last_name', 'email_address', 'phone_number'];

app.post('/api/update-profile', async (req, res) => {
  try {
    const auth = req.headers.authorization || req.headers.Authorization || '';
    const match = String(auth).match(/^Bearer\s+(.*)$/i);
    if (!match) return res.status(401).json({ message: 'Missing or invalid authorization header.' });

    const accessToken = match[1];

    // Verify token and get user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(accessToken);
    if (userErr || !userData?.user) {
      return res.status(401).json({ message: 'Invalid session or token.' });
    }

    const user = userData.user;
    if (!user.email) {
      return res.status(400).json({ message: 'Authenticated user has no email.' });
    }

    // Validate body contains only allowed fields
    const body = req.body || {};
    const bodyKeys = Object.keys(body);
    const extra = bodyKeys.filter(k => !ALLOWED_FIELDS.includes(k));
    if (extra.length > 0) {
      return res.status(400).json({ message: `Unexpected fields: ${extra.join(', ')}` });
    }

    // Pick allowed fields and basic type validation
    const updates = {};
    for (const key of ALLOWED_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const val = body[key];
        if (val === null || val === undefined) {
          updates[key] = null;
        } else if (typeof val === 'string' || typeof val === 'number') {
          updates[key] = String(val);
        } else {
          return res.status(400).json({ message: `Invalid value for ${key}` });
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No updatable fields provided.' });
    }

    // Find registration record by email
    const { data: reg, error: fetchErr } = await supabaseAdmin
      .from(REG_TABLE)
      .select('id, email_address')
      .eq('email_address', user.email)
      .maybeSingle();

    if (fetchErr) {
      return res.status(500).json({ message: 'Unable to fetch registration record.' });
    }

    if (!reg?.id) {
      return res.status(404).json({ message: 'Registration record not found. Complete membership registration first.' });
    }

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from(REG_TABLE)
      .update(updates)
      .eq('id', reg.id)
      .select()
      .single();

    if (updateErr) {
      return res.status(500).json({ message: 'Failed to update registration record.' });
    }

    return res.status(200).json({ data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`Profile update API listening on http://localhost:${port}`));

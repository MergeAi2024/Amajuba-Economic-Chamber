import express from 'express';
import { createClient } from '@supabase/supabase-js';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REG_TABLE = (process.env.SUPABASE_REGISTRATIONS_TABLE || 'public.registrations').trim();
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO || 'amajubaeconomicchamber.office@gmail.com';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error('Missing EMAIL_USER or EMAIL_PASS environment variables.');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

transporter.verify().catch((err) => {
  console.error('Failed to verify SMTP transporter:', err);
  process.exit(1);
});

const ALLOWED_FIELDS = ['first_name', 'last_name', 'email_address', 'phone_number'];

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide name, email, subject, and message.' });
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof subject !== 'string' || typeof message !== 'string') {
      return res.status(400).json({ message: 'Invalid form data.' });
    }

    await transporter.sendMail({
      from: `Amajuba Economic Chamber Website <${EMAIL_USER}>`,
      replyTo: email,
      to: EMAIL_TO,
      subject: `Contact form message: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    });

    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact form email failed:', err);
    return res.status(500).json({ message: 'Unable to send your message right now. Please try again later.' });
  }
});

app.post('/api/chat', async (req, res) => {
  const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
  const TOGETHER_MODEL = process.env.TOGETHER_MODEL || 'openai/gpt-oss-20b';

  if (!TOGETHER_API_KEY) {
    return res.status(500).json({ message: 'AI service is not configured.' });
  }

  try {
    const { messages } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Invalid request payload.' });
    }

    const togetherResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({
        model: TOGETHER_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await togetherResponse.json();
    if (!togetherResponse.ok) {
      return res.status(502).json({ message: data?.error?.message || 'Together AI request failed.' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ message: 'Unable to reach the AI service.' });
  }
});

app.post('/api/update-profile', async (req, res) => {
  try {
    const auth = req.headers.authorization || req.headers.Authorization || '';
    const match = String(auth).match(/^Bearer\s+(.*)$/i);
    if (!match) return res.status(401).json({ message: 'Missing or invalid authorization header.' });

    const accessToken = match[1];

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(accessToken);
    if (userErr || !userData?.user) {
      return res.status(401).json({ message: 'Invalid session or token.' });
    }

    const user = userData.user;
    if (!user.email) {
      return res.status(400).json({ message: 'Authenticated user has no email.' });
    }

    const body = req.body || {};
    const bodyKeys = Object.keys(body);
    const extra = bodyKeys.filter((k) => !ALLOWED_FIELDS.includes(k));
    if (extra.length > 0) {
      return res.status(400).json({ message: `Unexpected fields: ${extra.join(', ')}` });
    }

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

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

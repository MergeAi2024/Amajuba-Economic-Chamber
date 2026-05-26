import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, Clock3, LoaderCircle, Mail, MapPin, Phone, Save, ShieldCheck, UserRound } from 'lucide-react';
import { supabase, supabaseRegistrationsTable } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type ProfileForm = {
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  alternative_phone_number: string;
  business_name: string;
  business_address: string;
  membership_category: string;
  industry_sector: string;
  number_of_employees: string;
  business_type: string;
};

const emptyProfile = (email: string): ProfileForm => ({
  first_name: '',
  last_name: '',
  email_address: email,
  phone_number: '',
  alternative_phone_number: '',
  business_name: '',
  business_address: '',
  membership_category: '',
  industry_sector: '',
  number_of_employees: '',
  business_type: '',
});

const statusStyles: Record<string, string> = {
  Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  'Not started': 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile(user?.email ?? ''));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('Not started');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!supabase || !user?.email) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setMessage('');

      const { data, error: fetchError } = await supabase
        .from(supabaseRegistrationsTable)
        .select('*')
        .eq('email_address', user.email)
        .maybeSingle();

      if (fetchError) {
        setError('Unable to load your profile right now. Please try again.');
        setLoading(false);
        return;
      }

      setStatus(data?.application_status ?? 'Not started');

      if (data) {
        setProfile({
          first_name: data.first_name ?? '',
          last_name: data.last_name ?? '',
          email_address: data.email_address ?? user.email,
          phone_number: data.phone_number ?? '',
          alternative_phone_number: data.alternative_phone_number ?? '',
          business_name: data.business_name ?? '',
          business_address: data.business_address ?? '',
          membership_category: data.membership_category ?? '',
          industry_sector: data.industry_sector ?? '',
          number_of_employees: data.number_of_employees ?? '',
          business_type: data.business_type ?? '',
        });
      } else {
        setProfile(emptyProfile(user.email));
      }

      setLoading(false);
    };

    void loadProfile();
  }, [user]);

  const updateProfileField = (field: keyof ProfileForm, value: string) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      if (!supabase || !user?.email) {
        throw new Error('Supabase client is not configured.');
      }

      const { data, error: fetchError } = await supabase
        .from(supabaseRegistrationsTable)
        .select('id')
        .eq('email_address', user.email)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (!data?.id) {
        throw new Error('Complete your membership registration first so we can attach your profile.');
      }

      const { error: updateError } = await supabase
        .from(supabaseRegistrationsTable)
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone_number: profile.phone_number,
          alternative_phone_number: profile.alternative_phone_number || null,
          business_name: profile.business_name || null,
          business_address: profile.business_address || null,
          membership_category: profile.membership_category || null,
          industry_sector: profile.industry_sector || null,
          number_of_employees: profile.number_of_employees || null,
          business_type: profile.business_type || null,
        })
        .eq('id', data.id);

      if (updateError) {
        throw updateError;
      }

      setMessage('Profile details saved successfully.');
    } catch (saveError) {
      const nextError = saveError instanceof Error ? saveError.message : 'Unable to save your profile.';
      setError(nextError);
    } finally {
      setSaving(false);
    }
  };

  const statusColor = statusStyles[status] ?? statusStyles['Not started'];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-chamber-blue">Your member dashboard</p>
              <h1 className="mt-4 text-3xl font-extrabold text-chamber-navy">Manage your profile</h1>
              <p className="mt-3 text-sm text-slate-600">
                Review your application status, update your business details, and continue your membership journey.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${statusColor}`}>
                  {status === 'Approved' ? <ShieldCheck size={16} /> : status === 'Pending' ? <Clock3 size={16} /> : <AlertTriangle size={16} />}
                  {status}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  <Mail size={16} className="text-chamber-blue" />
                  {user?.email ?? 'Signed out'}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-chamber-navy">What you can do</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />
                  <p>Update editable profile details and keep your contact information current.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />
                  <p>Track whether your registration is pending, approved, or not yet started.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />
                  <p>Return to the membership form to complete or revise your application.</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-chamber-navy px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Continue registration
                  <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-chamber-navy">Edit profile details</h2>
                <p className="mt-1 text-sm text-slate-500">Saved details are tied to your existing registration record.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {status}
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            {loading ? (
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                <LoaderCircle size={18} className="animate-spin" />
                Loading your profile…
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">First name</label>
                    <input
                      type="text"
                      value={profile.first_name}
                      onChange={(event) => updateProfileField('first_name', event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-chamber-blue focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Last name</label>
                    <input
                      type="text"
                      value={profile.last_name}
                      onChange={(event) => updateProfileField('last_name', event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-chamber-blue focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={profile.email_address}
                      readOnly
                      className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Phone number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="tel"
                        value={profile.phone_number}
                        onChange={(event) => updateProfileField('phone_number', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-chamber-blue focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Alternative phone</label>
                    <input
                      type="tel"
                      value={profile.alternative_phone_number}
                      onChange={(event) => updateProfileField('alternative_phone_number', event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-chamber-blue focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Business name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={profile.business_name}
                        onChange={(event) => updateProfileField('business_name', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-chamber-blue focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Business type</label>
                    <div className="relative">
                      <BriefcaseBusiness className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={profile.business_type}
                        onChange={(event) => updateProfileField('business_type', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-chamber-blue focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Business address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={profile.business_address}
                      onChange={(event) => updateProfileField('business_address', event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-chamber-blue focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Membership category</label>
                    <input
                      type="text"
                      value={profile.membership_category}
                      onChange={(event) => updateProfileField('membership_category', event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-chamber-blue focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Industry / sector</label>
                    <input
                      type="text"
                      value={profile.industry_sector}
                      onChange={(event) => updateProfileField('industry_sector', event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-chamber-blue focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Employees</label>
                    <input
                      type="number"
                      min="0"
                      value={profile.number_of_employees}
                      onChange={(event) => updateProfileField('number_of_employees', event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-chamber-blue focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <UserRound size={16} className="text-chamber-blue" />
                    Signed in as <span className="font-semibold text-slate-700">{user?.email}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full bg-chamber-navy px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? 'Saving…' : 'Save profile'}
                    <Save size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

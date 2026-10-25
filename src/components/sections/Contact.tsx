import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Building2, Check, CircleAlert, ClipboardCopy, Copy, Linkedin, Mail, MapPin, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { profile } from '../../data/profile';
import { copyText } from '../../lib/hooks';
import { Magnetic, Reveal, SectionHeading } from '../ui/primitives';

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!emailRx.test(f.email.trim())) e.email = 'Please enter a valid email address.';
  if (f.subject.trim().length < 3) e.subject = 'Please add a short subject.';
  if (f.message.trim().length < 10) e.message = 'Message should be at least 10 characters.';
  return e;
}

function compose(f: Fields) {
  return `Hello Aftab,\n\n${f.message.trim()}\n\nBest regards,\n${f.name.trim()}\n${f.email.trim()}`;
}

export function Contact() {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<null | { tone: 'ok' | 'error'; text: string }>(null);
  const [copied, setCopied] = useState<'email' | 'message' | null>(null);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const flash = (what: 'email' | 'message') => {
    setCopied(what);
    window.setTimeout(() => setCopied(null), 2200);
  };

  const onCopyEmail = async () => {
    if (await copyText(profile.email)) flash('email');
    else setStatus({ tone: 'error', text: 'Copy failed — please select the address manually.' });
  };

  const onCopyMessage = async () => {
    const e = validate(fields);
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus({ tone: 'error', text: 'Please fix the highlighted fields first.' });
      return;
    }
    const ok = await copyText(`To: ${profile.email}\nSubject: ${fields.subject.trim()}\n\n${compose(fields)}`);
    if (ok) {
      flash('message');
      setStatus({ tone: 'ok', text: 'Message copied to clipboard. Paste it into any email client.' });
    } else setStatus({ tone: 'error', text: 'Copy failed in this browser.' });
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate(fields);
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus({ tone: 'error', text: 'Please fix the highlighted fields.' });
      const first = Object.keys(e)[0];
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    const href = `mailto:${profile.email}?subject=${encodeURIComponent(fields.subject.trim())}&body=${encodeURIComponent(compose(fields))}`;
    window.location.href = href;
    setStatus({
      tone: 'ok',
      text: 'Your email app should open with a prefilled draft. Nothing is sent until you press send there. No email app? Use “Copy message” instead.',
    });
  };

  const fieldProps = (k: keyof Fields) => ({
    id: `cf-${k}`,
    name: k,
    value: fields[k],
    onChange: set(k),
    'aria-invalid': errors[k] ? (true as const) : undefined,
    'aria-describedby': errors[k] ? `cf-${k}-err` : undefined,
    className: 'field',
  });

  const Err = ({ k }: { k: keyof Fields }) =>
    errors[k] ? (
      <p id={`cf-${k}-err`} className="mt-1.5 flex items-center gap-1.5 text-xs text-fault">
        <CircleAlert className="h-3.5 w-3.5" aria-hidden /> {errors[k]}
      </p>
    ) : null;

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-signal/10 blur-[140px]" />
      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 [&>*]:min-w-0">
          <div className="lg:col-span-5">
            <SectionHeading
              id="contact-title"
              index="09"
              eyebrow="Contact"
              title="Have a Technical Challenge in Mind?"
              lead="Let's connect to discuss telecommunications, network engineering, microwave transmission, and opportunities to build reliable infrastructure."
            />

            <Reveal className="mt-10">
              <div className="panel p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver-500">Email</div>
                <a href={`mailto:${profile.email}`} className="mt-1 block break-all text-lg font-semibold text-silver-50 hover:text-signal-soft sm:text-xl">
                  {profile.email}
                </a>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={onCopyEmail} className="btn btn-ghost !min-h-[40px] text-sm" aria-live="polite">
                    {copied === 'email' ? <Check className="h-4 w-4 text-teal" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                    {copied === 'email' ? 'Copied' : 'Copy email'}
                  </button>
                  <Magnetic>
                    <a href={`mailto:${profile.email}`} className="btn btn-primary !min-h-[40px] text-sm" data-cursor="Connect">
                      <Mail className="h-4 w-4" aria-hidden /> Write an email
                    </a>
                  </Magnetic>
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-4">
              <ul className="divide-y divide-line rounded-[var(--radius-panel)] border border-line">
                <li className="flex items-center justify-between gap-4 p-4">
                  <span className="flex items-center gap-3 text-sm text-silver-400">
                    <Building2 className="h-4 w-4 text-signal" aria-hidden /> Affiliation
                  </span>
                  <span className="text-sm text-silver-50">{profile.affiliation}</span>
                </li>
                <li className="flex items-center justify-between gap-4 p-4">
                  <span className="flex items-center gap-3 text-sm text-silver-400">
                    <MapPin className="h-4 w-4 text-signal" aria-hidden /> Deployment base
                  </span>
                  <span className="text-sm text-silver-50">{profile.location}</span>
                </li>
                {profile.linkedinUrl && (
                  <li className="flex items-center justify-between gap-4 p-4">
                    <span className="flex items-center gap-3 text-sm text-silver-400">
                      <Linkedin className="h-4 w-4 text-signal" aria-hidden /> LinkedIn
                    </span>
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-silver-50 hover:text-signal-soft">
                      View profile <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                )}
              </ul>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-7" delay={0.05}>
            <form onSubmit={onSubmit} noValidate className="panel p-6 sm:p-8" aria-describedby="cf-note">
              <h3 className="display text-2xl font-semibold text-silver-50 [font-stretch:105%]">Send a message</h3>
              <p id="cf-note" className="mt-2 text-sm text-silver-400">
                This form doesn't send anything by itself — it prepares a draft in your email app, or copies the message for you.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="cf-name" className="mb-1.5 block text-sm text-silver-300">
                    Name
                  </label>
                  <input type="text" autoComplete="name" required {...fieldProps('name')} />
                  <Err k="name" />
                </div>
                <div>
                  <label htmlFor="cf-email" className="mb-1.5 block text-sm text-silver-300">
                    Email
                  </label>
                  <input type="email" autoComplete="email" inputMode="email" required {...fieldProps('email')} />
                  <Err k="email" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cf-subject" className="mb-1.5 block text-sm text-silver-300">
                    Subject
                  </label>
                  <input type="text" required {...fieldProps('subject')} />
                  <Err k="subject" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cf-message" className="mb-1.5 block text-sm text-silver-300">
                    Message
                  </label>
                  <textarea rows={6} required {...fieldProps('message')} className="field resize-y" />
                  <Err k="message" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="submit" className="btn btn-primary">
                  <Send className="h-4 w-4" aria-hidden /> Open email draft
                </button>
                <button type="button" onClick={onCopyMessage} className="btn btn-ghost">
                  {copied === 'message' ? <Check className="h-4 w-4 text-teal" aria-hidden /> : <ClipboardCopy className="h-4 w-4" aria-hidden />}
                  Copy message
                </button>
              </div>

              <div aria-live="polite" className="min-h-[1px]">
                <AnimatePresence>
                  {status && (
                    <motion.p
                      key={status.text}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`mt-5 flex items-start gap-2 rounded-xl border p-3 text-sm ${status.tone === 'ok' ? 'border-teal/40 bg-teal/[0.06] text-silver-100' : 'border-fault/40 bg-fault/[0.06] text-silver-100'}`}
                    >
                      {status.tone === 'ok' ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-fault" aria-hidden />}
                      {status.text}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

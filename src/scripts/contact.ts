/** Contact form: client-side validation + submit to Web3Forms or the Pages Function. */
import { isBot, normalize, validate, type ContactField } from '../lib/contact-validation';
import { showToast } from './toast';

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');

if (form) {
  const d = form.dataset;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const label = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const idleLabel = label.textContent ?? '';

  const setStatus = (text: string, tone: 'info' | 'success' | 'error') => {
    status.textContent = text;
    status.dataset.tone = tone;
  };

  const showErrors = (fields: ContactField[]) => {
    for (const f of ['name', 'email', 'message'] as const) {
      const input = form.elements.namedItem(f) as HTMLInputElement | HTMLTextAreaElement | null;
      const err = form.querySelector<HTMLElement>(`[data-error-for="${f}"]`);
      const bad = fields.includes(f);
      input?.setAttribute('aria-invalid', String(bad));
      if (err) err.hidden = !bad;
    }
    if (fields.length) (form.elements.namedItem(fields[0]!) as HTMLElement | null)?.focus();
  };

  // Clear a field's error as soon as the visitor fixes it.
  form.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    if (el.getAttribute('aria-invalid') !== 'true') return;
    const payload = normalize(Object.fromEntries(new FormData(form)));
    if (!validate(payload).includes(el.name as ContactField)) {
      el.setAttribute('aria-invalid', 'false');
      const err = form.querySelector<HTMLElement>(`[data-error-for="${el.name}"]`);
      if (err) err.hidden = true;
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = normalize(Object.fromEntries(new FormData(form)));
    const fields = validate(payload);
    showErrors(fields);
    if (fields.length) return;

    if (isBot(payload)) {
      form.reset();
      setStatus(d.msgSuccess ?? '', 'success');
      return;
    }

    const provider = d.provider;
    const notConfigured = provider === 'web3forms' ? !d.accessKey : !d.endpoint;
    if (notConfigured) {
      setStatus(d.msgNotConfigured ?? '', 'error');
      return;
    }

    submit.disabled = true;
    label.textContent = d.msgSending ?? '…';
    setStatus(d.msgSending ?? '', 'info');

    try {
      let ok = false;
      if (provider === 'web3forms') {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({
            access_key: d.accessKey,
            subject: `Portfolio message from ${payload.name}`,
            from_name: 'Portfolio',
            name: payload.name,
            email: payload.email,
            message: payload.message,
            botcheck: '',
          }),
        });
        ok = res.ok && (await res.json().catch(() => ({}))).success === true;
      } else {
        const res = await fetch(d.endpoint!, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const body = await res.json().catch(() => ({}));
        if (body.error === 'validation' && Array.isArray(body.fields)) {
          showErrors(body.fields);
          throw new Error('validation');
        }
        if (body.error === 'not_configured') {
          setStatus(d.msgNotConfigured ?? '', 'error');
          return;
        }
        ok = res.ok && body.ok === true;
      }

      if (!ok) throw new Error('send failed');
      form.reset();
      setStatus(d.msgSuccess ?? '', 'success');
      showToast(d.msgSuccess ?? '', 'success');
    } catch {
      setStatus(d.msgError ?? '', 'error');
    } finally {
      submit.disabled = false;
      label.textContent = idleLabel;
    }
  });
}

export {};

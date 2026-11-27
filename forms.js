(() => {
  // Owner-approved native FormSubmit delivery. Keep reCAPTCHA enabled.
  const directSubmissionsEnabled = true;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (directSubmissionsEnabled) {
    document.querySelectorAll('[data-online-only]').forEach(element => { element.hidden = false; });
    document.querySelectorAll('[data-delivery-note]').forEach(element => {
      element.textContent = 'FormSubmit processes your details and any attachments and sends them to WeaversHBC@gmail.com. Continue through its confirmation to finish. Keep a copy for your records.';
    });
  }

  document.querySelectorAll('[data-website-form]').forEach(form => {
    if (!directSubmissionsEnabled && form.closest('[data-online-only]')) return;
    const application = form.dataset.formKind === 'application';
    const prepared = form.querySelector('[data-prepared]');
    const download = form.querySelector('[data-download]');
    const emailLink = form.querySelector('[data-email]');
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('[type="submit"]');
    const panels = [...form.querySelectorAll('[data-form-panel]')];
    let step = 0;
    let downloadUrl;
    form.noValidate = true;

    if (directSubmissionsEnabled) {
      form.action = form.dataset.directAction;
      form.enctype = 'multipart/form-data';
      submit.textContent = application ? 'Send Application' : 'Send Project Request';
    }
    const submitLabel = submit.textContent;

    function showStep(index, focus = false) {
      step = index;
      panels.forEach((panel, i) => { panel.hidden = i !== step; });
      form.querySelectorAll('[data-step-label]').forEach((label, i) => {
        if (i === step) label.setAttribute('aria-current', 'step');
        else label.removeAttribute('aria-current');
      });
      form.querySelectorAll('[data-next]').forEach(button => { button.hidden = step !== 0; });
      form.querySelectorAll('[data-back]').forEach(button => { button.hidden = step === 0; });
      submit.hidden = step < panels.length - 1;
      if (focus) {
        panels[step].querySelector('[tabindex]')?.focus({ preventScroll: true });
        panels[step].scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
      }
    }

    function validateFiles() {
      let total = 0;
      form.querySelectorAll('input[type="file"]').forEach(field => {
        let message = '';
        for (const file of field.files) {
          total += file.size;
          if (field.dataset.pdfOnly !== undefined && !/\.pdf$/i.test(file.name)) message = 'Choose your completed application as a PDF.';
          else if (!/\.(pdf|jpe?g|png|webp)$/i.test(file.name)) message = 'Choose a PDF, JPG, PNG or WebP file.';
          else if (file.size === 0) message = 'This file is empty. Save it and choose it again.';
          else if (file.size > 9_000_000) message = 'Choose a file smaller than 9 MB.';
        }
        if (total > 9_000_000) message = 'Your attachments total more than 9 MB. Choose smaller files or email additional files separately.';
        field.setCustomValidity(message);
        if (message) field.setAttribute('aria-invalid', 'true');
        else field.removeAttribute('aria-invalid');
        const help = field.closest('.field')?.querySelector('[data-file-status]');
        if (help) help.textContent = message;
      });
    }

    function validate(container) {
      validateFiles();
      const invalid = [...container.querySelectorAll('input, select, textarea')].find(field => !field.disabled && !field.checkValidity());
      if (!invalid) return true;
      if (panels.length) showStep(panels.findIndex(panel => panel.contains(invalid)));
      invalid.reportValidity();
      return false;
    }

    form.querySelectorAll('input[type="file"]').forEach(field => field.addEventListener('change', validateFiles));
    const project = form.querySelector('#project-type');
    const requestedProject = new URLSearchParams(location.search).get('project');
    if (project && [...project.options].some(option => option.value === requestedProject)) project.value = requestedProject;

    const preference = form.querySelector('#contact-preference');
    if (preference) {
      const email = form.querySelector('#email');
      const phone = form.querySelector('#phone');
      const updateContact = () => {
        email.required = preference.value === 'Email';
        phone.required = preference.value !== 'Email';
        form.querySelector('[data-email-label]').textContent = email.required ? 'Your email address *' : 'Your email address (optional)';
        form.querySelector('[data-phone-label]').textContent = phone.required ? 'Your phone number *' : 'Your phone number (optional)';
      };
      preference.addEventListener('change', updateContact);
      updateContact();
    }

    if (panels.length) {
      form.querySelector('[data-form-progress]').hidden = false;
      form.querySelector('[data-next]').addEventListener('click', () => {
        if (validate(panels[step])) showStep(step + 1, true);
      });
      form.querySelector('[data-back]').addEventListener('click', () => showStep(step - 1, true));
      showStep(0);
    }

    form.addEventListener('submit', event => {
      if (panels.length && step === 0) {
        event.preventDefault();
        if (validate(panels[0])) showStep(1, true);
        return;
      }
      if (!validate(form)) { event.preventDefault(); return; }
      if (directSubmissionsEnabled) {
        try { sessionStorage.setItem('whbc-pending-form', JSON.stringify({ kind: application ? 'application' : 'project', time: Date.now() })); } catch {}
        submit.disabled = true;
        submit.textContent = 'Continuing to confirmation…';
        return;
      }

      event.preventDefault();
      const subject = application ? 'WHBC Employment Application' : 'WHBC Project Request';
      const lines = [subject, ''];
      for (const field of form.elements) {
        if (!field.name || field.name.startsWith('_') || field.disabled || /^(submit|button|file)$/.test(field.type)) continue;
        if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) continue;
        const value = field.value.trim();
        if (!value) continue;
        const label = field.labels?.[0]?.textContent.replace(/\s*\*\s*$/, '').trim() || field.name.replaceAll('-', ' ');
        const group = field.closest('.choice-group')?.querySelector('legend')?.textContent;
        lines.push((group || label) + ': ' + value);
      }
      const details = lines.join('\n');
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      downloadUrl = URL.createObjectURL(new Blob([details], { type: 'text/plain;charset=utf-8' }));
      download.href = downloadUrl;
      download.download = application ? 'WHBC_Completed_Application.txt' : 'WHBC_Project_Request.txt';
      const directEmail = 'mailto:WeaversHBC@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(details);
      const attachDetails = application || directEmail.length > 1900;
      emailLink.href = attachDetails
        ? 'mailto:WeaversHBC@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent('Hello Weaver’s,\n\nPlease find my completed ' + (application ? 'application' : 'project request') + ' attached.\n')
        : directEmail;
      form.querySelector('[data-email-help]').textContent = attachDetails
        ? 'Download your completed details, then attach that file in your email app. You can also attach a résumé, photos or plans. Send the email to finish.'
        : 'Open the email below to review and send your project details. Add photos, sketches or plans in your email app. Send the email to finish.';
      status.textContent = 'Your details are prepared. They have not been sent yet.';
      prepared.hidden = false;
      prepared.focus({ preventScroll: true });
      prepared.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'center' });
    });

    window.addEventListener('pageshow', () => {
      submit.disabled = false;
      submit.textContent = submitLabel;
    });
    window.addEventListener('pagehide', () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      downloadUrl = undefined;
      if (prepared) prepared.hidden = true;
      if (status) status.textContent = '';
    });
  });
})();

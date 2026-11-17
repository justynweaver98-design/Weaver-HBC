document.querySelectorAll('[data-website-form]').forEach(form => {
  const prepared = form.querySelector('[data-prepared]');
  const download = form.querySelector('[data-download]');
  const email = form.querySelector('[data-email]');
  const help = form.querySelector('[data-email-help]');
  const application = Boolean(form.querySelector('#signature'));
  let downloadUrl;

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const lines = [application ? 'WHBC Employment Application' : 'WHBC Project Request', ''];
    for (const field of form.elements) {
      if (!field.name || field.disabled || field.type === 'submit') continue;
      if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) continue;
      const value = field.value.trim();
      if (!value) continue;
      const label = field.labels?.[0]?.textContent.replace(/\s*\*\s*$/, '').trim() || field.name.replaceAll('-', ' ');
      const group = field.closest('.choice-group');
      lines.push((group?.querySelector('legend')?.textContent || label) + ': ' + value);
    }
    if (application) {
      const certification = form.querySelector('.form-section:last-of-type p').textContent.trim();
      lines.push('', 'Applicant certification', certification);
    }
    const details = lines.join('\n');
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = URL.createObjectURL(new Blob([details], { type: 'text/plain;charset=utf-8' }));
    download.href = downloadUrl;
    download.download = application ? 'WHBC_Completed_Application.txt' : 'WHBC_Project_Request.txt';

    const subject = application ? 'WHBC Employment Application' : 'WHBC Project Request';
    const directEmail = 'mailto:WeaversHBC@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(details);
    const useAttachment = application || directEmail.length > 1900;
    email.href = useAttachment
      ? 'mailto:WeaversHBC@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent('Hello Weaver’s,\n\nPlease find my completed ' + (application ? 'application' : 'project request') + ' attached.\n')
      : directEmail;
    help.textContent = useAttachment
      ? 'Download your completed details, then open an email and attach the downloaded file. You can also attach a résumé, photos, or plans before sending.'
      : 'Open the email below to review and send your project details. Attach photos, sketches, or plans in your email app.';
    prepared.hidden = false;
    prepared.focus({ preventScroll: true });
    prepared.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  window.addEventListener('pagehide', () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = undefined;
    prepared.hidden = true;
  });

  const requestedProject = new URLSearchParams(window.location.search).get('project');
  const project = form.querySelector('#project-type');
  if (project && Array.from(project.options).some(option => option.value === requestedProject)) {
    project.value = requestedProject;
  }
});

export function CreateDate(date: string | undefined, time?: boolean) {
  if (!date) return '';
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const newDate = new Date(date);
  const year = new Intl.DateTimeFormat('en-au', { day: '2-digit', month: '2-digit', year:'numeric', timeZone }).format(newDate);
  const hours = new Intl.DateTimeFormat('en-au', { minute: '2-digit', hour: '2-digit', timeZone }).format(newDate);
  if (time) return `${year} at ${hours} `;
  return `${year}`;
}

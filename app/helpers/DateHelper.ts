export function CreateDate(date: string | undefined, time?: boolean) {
  if (!date) return '';
  const day = new Date(date).getDate().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
  const month = new Date(date).getMonth().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
  const year = new Date(date).getFullYear();
  const hours = new Date(date).getUTCHours().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
  const mins = new Date(date).getUTCMinutes().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
  if (time) return `${day}/${month}/${year} at ${hours}:${mins} `;
  return `${day}/${month}/${year}`;
}

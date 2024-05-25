export function CreateDate(date: string) {
    const day = new Date(date).getDate().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
    const month = new Date(date).getMonth().toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
    const year = new Date(date).getFullYear();
    return `${day}/${month}/${year}`;
  }
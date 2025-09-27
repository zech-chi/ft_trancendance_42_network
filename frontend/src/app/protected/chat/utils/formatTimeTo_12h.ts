export function formatTimeTo_12h(time: string): string {
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // convert 0 -> 12, 13 -> 1
  return `${hour}:${minute} ${period}`;
}
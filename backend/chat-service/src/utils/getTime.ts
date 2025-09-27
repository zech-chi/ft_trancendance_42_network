export const getTime = (): string => {
  const now = new Date();

  // Define the options for formatting, specifying the Morocco time zone.
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Casablanca",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
  };

  //Create a formatter (using 'sv-SE' locale for YYYY-MM-DD order)
  const formatter = new Intl.DateTimeFormat("sv-SE", options);

  //Format the date and construct the final string
  const parts = formatter.formatToParts(now).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {} as Record<string, string>);

  const time = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
  return time;
};

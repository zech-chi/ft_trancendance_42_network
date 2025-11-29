// this function will format the name of the user to a specific length
export function formatLengthNameUser(name: string, maxLength: number = 20): string {

  if (!name) return "";
  if (name.length <= maxLength) {
    return name;
  }
  // If the name is longer than the max length, truncate it and add ellipsis
  return name.slice(0, maxLength - 3) + '...';
}
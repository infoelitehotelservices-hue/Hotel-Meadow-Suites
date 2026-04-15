export const parseDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") return null; // Skip if empty or invalid
  const [day, month, year] = dateString.split("-").map(Number); // Convert to numbers
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null; // Skip if invalid
  return new Date(Date.UTC(year, month - 1, day)); // Month is 0-indexed in JavaScript
};

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};
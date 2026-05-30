/**
 * Utility function to format any date string or Date object to DD/MM/YYYY format.
 * Includes support for safely parsing ISO timestamps and YYYY-MM-DD input dates.
 */
export const formatDateToDDMMYYYY = (dateInput) => {
  if (!dateInput) return "N/A";
  
  // Try processing YYYY-MM-DD strings directly to prevent timezone shift issues
  if (typeof dateInput === "string") {
    const cleanStr = dateInput.split("T")[0];
    if (cleanStr.includes("-")) {
      const parts = cleanStr.split("-");
      if (parts.length === 3 && parts[0].length === 4) {
        // parts = [YYYY, MM, DD]
        return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
      }
    } else if (cleanStr.includes("/")) {
      const parts = cleanStr.split("/");
      if (parts.length === 3 && parts[0].length === 4) {
        // parts = [YYYY, MM, DD]
        return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
      }
    }
  }

  const dateObj = new Date(dateInput);
  if (!isNaN(dateObj.getTime())) {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  return dateInput;
};

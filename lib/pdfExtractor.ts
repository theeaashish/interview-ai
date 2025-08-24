export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    if (!file) {
      console.warn("No PDF file provided");
      return "";
    }

    if (!file.type || file.type !== "application/pdf") {
      console.warn("File is not a PDF:", file.type);
      return "";
    }

    return `PDF content from ${file.name} (${Math.round(file.size / 1024)} KB)`;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "";
  }
};

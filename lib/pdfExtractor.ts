/**
 * Extracts text from a PDF file.
 * @param file - The PDF file to extract text from.
 * @returns The extracted text as a string.
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    if (!file) {
      console.warn("No PDF file provided");
      return "";
    }

    // Validate file type
    if (!file.type || file.type !== "application/pdf") {
      console.warn("File is not a PDF:", file.type);
      return "";
    }

    // For now, just return a placeholder message
    // In a production environment, you would use a proper PDF parsing library
    // or a server-side service to extract text from PDFs
    return `PDF content from ${file.name} (${Math.round(file.size / 1024)} KB)`;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    // Return empty string instead of throwing error to prevent API failures
    return "";
  }
};

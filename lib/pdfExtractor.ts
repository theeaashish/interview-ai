import pdf from 'pdf-parse';

/**
 * Extracts text from a PDF file.
 * @param file - The PDF file to extract text from.
 * @returns The extracted text as a string.
 */


export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Convert ArrayBuffer to Buffer (required by pdf-parse)
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from the PDF
    const data = await pdf(buffer);

    // Return the extracted text
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
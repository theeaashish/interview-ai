import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

if (!SECRET_KEY) {
  throw new Error("Missing jwt secret key");
}

export async function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export function getUserIdFromToken(token: string): string {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    return decoded.userId;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

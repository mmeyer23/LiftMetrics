import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('liftmetrics');

  // If tokenCookie is not found or its value is not a string, return null
  if (!tokenCookie || typeof tokenCookie.value !== 'string') {
    return null;
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Decode the token
    const decoded = jwt.verify(tokenCookie.value, secret) as JwtPayload;

    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error.message);
    return null;
  }
}

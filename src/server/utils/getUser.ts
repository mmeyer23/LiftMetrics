import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { DecodedToken } from 'types/userTypes';

export async function getUserFromCookie(): Promise<DecodedToken | null> {
  const cookieStore = await cookies();
  console.log('Cookies on the server:', cookieStore);
  const tokenCookie = cookieStore.get('liftmetrics');
  console.log('Token from cookie:', tokenCookie);

  
  if (!tokenCookie || typeof tokenCookie.value !== 'string') {
    console.log('No token found');
    return null;
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

  
    const decoded = jwt.verify(tokenCookie.value, secret) as DecodedToken;

    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

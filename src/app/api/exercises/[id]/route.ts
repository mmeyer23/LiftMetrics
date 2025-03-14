import getDatabase from 'server/utils/db';
import jwt, { JwtPayload } from 'jsonwebtoken'; // Use JWT for authentication (or replace this with your auth method)
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

async function getUserFromToken(cookieStore) {
  const token = cookieStore.get('liftmetrics')?.value;
  if (!token) {
    throw new Error('Authentication required');
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    if (!decoded.userId) {
      throw new Error('Invalid token payload, userId not found');
    }
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const {
    newExerciseName: exerciseName,
    newNumOfReps: numOfReps,
    newWeightUsed: weightUsed,
    newDate: date,
    newNotes: notes,
  } = await req.json();

  const cookieStore = await cookies();
  let userId;
  try {
    userId = await getUserFromToken(cookieStore);
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 401,
    });
  }

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Invalid exercise ID format' }),
      { status: 400 }
    );
  }

  const db = await getDatabase();
  const collection = await db.collection('exercises');

  const exercise = await collection.findOne({ _id: objectId });
  if (!exercise) {
    return new Response(JSON.stringify({ message: 'Exercise not found' }), {
      status: 404,
    });
  }

  if (exercise.userId !== userId) {
    return new Response(
      JSON.stringify({ message: 'Unauthorized to update this exercise' }),
      {
        status: 403,
      }
    );
  }

  const result = await collection.updateOne(
    { _id: objectId },
    {
      $set: {
        exerciseName,
        numOfReps,
        weightUsed,
        date,
        notes,
      },
    }
  );

  if (result.modifiedCount === 1) {
    return new Response(
      JSON.stringify({ message: 'Exercise updated successfully!' }),
      {
        status: 200,
      }
    );
  } else {
    return new Response(
      JSON.stringify({ message: 'Failed to update exercise' }),
      {
        status: 500,
      }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = await params;
  console.log('Exercise ID:' + id);

  const cookieStore = await cookies();
  let userId;
  try {
    userId = await getUserFromToken(cookieStore);
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 401,
    });
  }

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Invalid exercise ID format' }),
      { status: 400 }
    );
  }

  const db = await getDatabase();
  const collection = await db.collection('exercises');

  const exercise = await collection.findOne({ _id: objectId });

  if (!exercise) {
    console.log('No exercise found for ID:', id);
    return new Response(JSON.stringify({ message: 'Exercise not found' }), {
      status: 404,
    });
  }

  if (exercise.userId !== userId) {
    return new Response(
      JSON.stringify({ message: 'Unauthorized access to this exercise' }),
      {
        status: 403,
      }
    );
  }

  return new Response(JSON.stringify({ exercise }), {
    status: 200,
  });
}

import getDatabase from 'server/utils/db';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken'; 
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

export async function POST(req) {
  const cookieStore = await cookies();

  let userId;
  try {
    userId = await getUserFromToken(cookieStore);
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 401,
    });
  }

  const { exerciseName, numOfReps, weightUsed, date, notes } = await req.json();

  const db = await getDatabase();

  const collection = await db.collection('exercises');

  const existingExercise = await collection.findOne({
    exerciseName,
    userId,
  });

  if (existingExercise) {
    return new Response(
      JSON.stringify({ message: 'Exercise already exists for this user' }),
      {
        status: 409,
      }
    );
  }

  const newExercise = {
    exerciseName,
    numOfReps,
    weightUsed,
    date,
    notes,
    userId,
  };

  const result = await collection.insertOne(newExercise);

  if (result.acknowledged) {
    return new Response(
      JSON.stringify({ message: 'Exercise added successfully!' }),
      {
        status: 201,
      }
    );
  } else {
    return new Response(JSON.stringify({ message: 'Failed to add exercise' }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  const cookieStore = await cookies();

  let userId;
  try {
    userId = await getUserFromToken(cookieStore);
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 401,
    });
  }
  const db = await getDatabase();

  const collection = await db.collection('exercises');

  try {
    const results = await collection.find({ userId }).toArray();
    return new Response(JSON.stringify({ exercises: results }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Failed to fetch exercises',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const cookieStore = await cookies();

  let userId;
  try {
    userId = await getUserFromToken(cookieStore);
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 401,
    });
  }
  const url = new URL(req.url);
  const exerciseId = url.searchParams.get('id');

  if (!exerciseId) {
    return new Response(
      JSON.stringify({ message: 'Exercise ID is required' }),
      {
        status: 400,
      }
    );
  }

  let objectId;
  try {
    objectId = new ObjectId(exerciseId);
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Invalid exercise ID format' }),
      { status: 400 }
    );
  }

  const db = await getDatabase();

  const collection = await db.collection('exercises');

  try {
    const exercise = await collection.findOne({ _id: objectId });
    if (!exercise) {
      return new Response(JSON.stringify({ message: 'Exercise not found' }), {
        status: 404,
      });
    }

    if (exercise.userId !== userId) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized to delete this exercise' }),
        {
          status: 403,
        }
      );
    }

    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      return new Response(
        JSON.stringify({ message: 'Exercise deleted successfully' }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'Failed to delete exercise' }),
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Failed to delete exercise',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

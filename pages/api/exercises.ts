import { getCollection } from '../../lib/db'; // Import the getCollection function
import { getUserFromCookie } from '../../lib/getUser'; // Import the function you provided

export default async function handler(req, res) {
  // Step 1: Extract user from the cookie
  const user = await getUserFromCookie(); // We will pass the request object here

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized - No valid token' });
  }

  const userId = user.id; // Assuming `id` is the user identifier in the JWT

  try {
    // Get the exercises collection using the getCollection function
    const exercisesCollection = await getCollection('exercises');

    // Handle POST request to add an exercise
    if (req.method === 'POST') {
      const { exerciseName, sets, reps, weight, restTime, notes } = req.body;

      if (!exerciseName || !sets || !reps || !weight || !restTime || !notes) {
        return res
          .status(400)
          .json({ success: false, message: 'All fields are required' });
      }

      // Save exercise with user ID to the database
      const result = await exercisesCollection.insertOne({
        userId,
        exerciseName,
        sets,
        reps,
        weight,
        restTime,
        notes,
        createdAt: new Date(),
      });

      res
        .status(200)
        .json({ success: true, message: 'Exercise added successfully' });
    }

    // Handle GET request to fetch exercises
    else if (req.method === 'GET') {
      // Fetch exercises only for the authenticated user
      const exercises = await exercisesCollection.find({ userId }).toArray();
      res.status(200).json({ success: true, exercises });
    } else {
      // Method Not Allowed
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error interacting with MongoDB:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to interact with database' });
  }
}

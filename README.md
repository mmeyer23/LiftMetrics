# LiftMetrics

LiftMetrics is a web application designed to help users track and save their personal exercise records. You can log in to your account, add, view, update, and delete your personal exercise records, helping you track your fitness progress over time. This application includes account verification, user-specific data storage, and easy-to-use CRUD (Create, Read, Update, Delete) functionality.

## Features

- **User Authentication**: Secure login system with email and password verification.
- **Exercise Record Management**: Users can create, read, update, and delete their personal exercise records.
- **Personalized Records**: Each user has their own list of exercise records, which are saved securely.
- **Responsive Design**: Built with a focus on responsiveness, allowing you to track your records on any device.

## Technologies Used

- **Frontend**:

  - **Next.js**: React framework for server-side rendering and building the application.
  - **React**: For building interactive UIs and components.
  - **Tailwind CSS**: Utility-first CSS framework for styling.
  - **DaisyUI**: Plugin for Tailwind to provide pre-designed components.
  - **React Icons**: For incorporating icons into the UI.

- **Backend**:

  - **MongoDB**: Used for storing user data and exercise records.
  - **JWT (JSON Web Tokens)**: For user authentication and session management.
  - **bcrypt**: To hash and verify passwords securely.

- **Development**:
  - **TypeScript**: For type safety and better developer experience.
  - **ESLint**: For ensuring code quality and consistency.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/lift-metrics.git
   cd lift-metrics
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   JWT_SECRET=your_jwt_secret_key
    MONGODB_URI=your_mongodb_connection_string
   ```

4. Start development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to http://localhost:3000 to start using LiftMetrics.

## License

LiftMetrics is licensed under the MIT License. See [LICENSE](LICENSE) for more details.

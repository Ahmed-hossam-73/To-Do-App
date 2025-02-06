*To-Do App with React & Firebase*
A simple web app to manage tasks (To-Do App) built using React and Firebase. The project focuses on learning how to use Firebase for real-time data storage, user authentication, and database interaction.

*Description*
This project aims to create a To-Do list application where users can register, log in, and manage their tasks. It uses Firebase Authentication to manage users and Firestore to store tasks, providing a real-time experience where task updates, additions, and deletions are automatically reflected for each user.

*Features*
1. User Authentication: Users can sign up, log in, and log out using Firebase Authentication with email and password.
2. Task Management: Users can add, delete, and mark tasks as complete/incomplete.
3. Real-Time Updates: The tasks list is updated in real-time when changes are made (add, edit, delete).
4. Personalized Experience: Each user only sees their tasks.
5. Responsive Design: The app adapts well for both desktop and mobile screens.
6. Logout: Users can log out from the app.

*Technologies Used*
1. React (Using Hooks: useState, useEffect)
2. Firebase (Authentication, Firestore)
3. React Router (For page navigation: Login, Sign Up, Dashboard)
4. CSS (For basic styling)
5. Material-UI (Improved user interface)
6. Bootstrap (some css and navbar)

*App Pages*
1. Login Page
Users can enter their email and password to log in.
New users can sign up by clicking the Sign Up link.
2. Sign Up Page
New users can create an account by providing their email and password.
3. TodoApp Page
Displays the user's tasks.
Users can add new tasks, mark them as completed, or delete them.
4. Done Page
Displays user tasks that have been completed
5. OnProgress Page
Displays user tasks that are not yet complete

*Installation & Setup*
1. Clone the repository:
git clone https://github.com/your-username/todo-app-react-firebase.git
2. Navigate to the project directory:
cd todo-app-react-firebase
3. Install dependencies:
npm install
<!-- if you want to make your own firebase on this project -->
4. Firebase Configuration:
-Go to the Firebase Console.
-Create a new project.
-Enable Email/Password Authentication in the Firebase Authentication tab.
-Create a Firestore Database and set security rules to allow read/write access only to authenticated users.
-Create a firebase.config.js file in the src directory and add your Firebase project credentials like so:
<!-- code in firebase.js -->
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};
const app = initializeApp(firebaseConfig);
export { app };
5. Run the development server:
npm start
Visit http://localhost:3000 to view the app in action.

*How the App Works*
1. Sign Up: Create an account using your email and password.
2. Login: Log in with your registered email and password.
3. Add Tasks: You can add new tasks that you need to complete.
4. Mark as Complete: When you finish a task, you can mark it as completed.
5. View Completed Tasks: Under the "Done" button, you'll see all the tasks you've completed.
6. View In-Progress Tasks: Under the "On Progress" button, you'll see tasks you're currently working on.
7. Log Out: You can log out from your account anytime using the "Log Out" button.
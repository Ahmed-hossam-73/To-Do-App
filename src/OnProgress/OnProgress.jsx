import { useState, useEffect } from "react";
import { listenUserTodos, deleteTodo, toggleTodoCompletion } from "../TodoApp/firebaseService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "../navbar/Navbar";
import Button from '@mui/material/Button';


const auth = getAuth();

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);


  useEffect(() => {
    // Set up a listener to track changes in the user's authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // If a user is authenticated, set the user state to the current user
        setUser(currentUser);
      } else {
        // If no user is authenticated, set the user state to null
        setUser(null);
      }
    });
  
    // Clean up the authentication state listener when the component unmounts
    return () => unsubscribeAuth(); 
  }, []); // Only run once on component mount (empty dependency array)
  

  useEffect(() => {
    // Check if the user is not logged in
    if (!user) {
      setLoading(false); // Stop loading if no user is authenticated
      return;
    }
  
    // Set up a real-time listener for the user's todos
    const unsubscribe = listenUserTodos((todos) => {
      setTodos(todos); // Update the state with the fetched todos
      setLoading(false); // Stop loading once the todos are fetched
    });
  
    // Clean up the listener when the component unmounts or user changes
    return () => unsubscribe(); 
  }, [user]); // Re-run the effect when the `user` state changes
  
  // Spinners for loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  // handle copleted tasks
  const handleToggleCompletion = async (id, completed) => {
    await toggleTodoCompletion(id, !completed);
  };
  // Delet button
  const Delete = async (id) => {
    await deleteTodo(id);
  };

  return (
    <>
      <Navbar />
      <div className="container text-center">
        <h1>Your To-Do List</h1>
        <ul className="list-group mt-3">
  {todos.some(todo => !todo.completed) ? (
    // Render todos only if there is at least one incomplete task
    todos.map((todo) => (
      !todo.completed && (
        <li key={todo.id} className="list-group-item d-flex justify-content-between bg-dark border-0">
          <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
            {todo.task}
          </span>
          <div>
          <Button variant="contained" color="success" className="btn btn-sm mx-2" onClick={() => handleToggleCompletion(todo.id, todo.completed)}>{todo.completed ? "Undo" : "Complete"}</Button>
          <Button variant="contained" color="error" className="btn btn-sm" onClick={() => Delete(todo.id)} > Delete </Button>
          </div>
        </li>
      )
    ))
  ) : (
    // Show message if there are no incomplete tasks
    <div className="alert alert-info" role="alert">
      No incomplete tasks available.
    </div>
  )}
</ul>
      </div>
    </>
  );
}





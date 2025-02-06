import { useState, useEffect } from "react";
import { listenUserTodos, addTodo, deleteTodo, toggleTodoCompletion } from "./firebaseService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "../navbar/Navbar";
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// create color in Material Ui
const theme = createTheme({
  palette: {
    Dark: {
      main: 'rgba(255, 0, 0, 0)',
      contrastText: 'white',
    },
  },
});

const auth = getAuth();

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true); 
  const [user, setUser] = useState(null);

// to recive data from fire store
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribeAuth(); 
  }, []); 
  
// for real time update
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
  
    const unsubscribe = listenUserTodos((todos) => {
      setTodos(todos); 
      setLoading(false);
    });
    return () => unsubscribe(); 
  }, [user]);
  
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

  // add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (task.trim()) {
      await addTodo(task);
      setTask("");
    }
  };
  // complete task
  const handleToggleCompletion = async (id, completed) => {
    await toggleTodoCompletion(id, !completed);
  };
  // Delete task
  const Delete = async (id) => {
    await deleteTodo(id);
  };

  return (
    <>
      <Navbar />
      <div className="container text-center">
        <h1>Your To-Do List</h1>
        <form onSubmit={handleAddTask} className="my-3">
          <input type="text" className="form-control my-3" placeholder="New Task" value={task} onChange={(e) => setTask(e.target.value)} />
          <ThemeProvider theme={theme}><Button variant="contained" color="Dark"className="btn btn-outline-dark text-white w-100 my-3" type="submit">Add Task</Button></ThemeProvider>

        </form>
        <ul className="list-group mt-3">
          {todos.map((todo) => (
            <li key={todo.id} className="list-group-item d-flex justify-content-between bg-dark border-0">
              <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.task}</span>
              <div>
                <Button variant="contained" color="success" className="btn btn-sm mx-2" onClick={() => handleToggleCompletion(todo.id, todo.completed)} > {todo.completed ? "Undo" : "Complete"} </Button>
                <Button variant="contained" color="error" className="btn btn-sm" onClick={() => Delete(todo.id)} > Delete </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

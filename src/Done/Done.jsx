
import { useState, useEffect, useRef } from "react";
import {
  listenUserTodos,
  deleteTodo,
  toggleTodoCompletion,
} from "../TodoApp/firebaseService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../firebase";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from '@mui/material/styles';


const db = getFirestore(app);
const auth = getAuth();
const updateTodo = async (docId, updatedData) => {
  try {
    const docRef = doc(db, "todos", docId);
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.error("error: ", error);
  }
};
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC107',
    },
    secondary: {
      main: '#DFA805',
    },
  },
  typography: {
    fontFamily: `'Titillium Web', 'sans-serif'`,
  },
});
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};


export default function Done() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTodoId, setActiveTodoId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);
  const [open, setOpen] = useState(false);
  const ediError = useRef(null);
  const bottomRef = useRef(null); // Create a reference for the bottom of the list

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribeAuth();
  }, []);

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

  // Scroll to the bottom when tasks are loaded or updated
  useEffect(() => {
    if (todos.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [todos]);

  const handleToggleCompletion = async (id, currentStatus) => {
    setLoading(true);
    await toggleTodoCompletion(id, !currentStatus);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = async (id) => {
    // Validate: Do not allow an empty task
    if (editTitle.trim() === "") {
      if (ediError.current) {
        ediError.current.textContent =
          "You must put a task or use the old task";
        ediError.current.classList.remove("d-none");
      }
      // Revert to the old title if empty
      setEditTitle(todos.find((todo) => todo.id === id)?.task || "");
      return;
    }

    setLoading(true);
    // Optionally hide the error if it was shown
    if (ediError.current) {
      ediError.current.classList.add("d-none");
    }

    // Update the todo in Firestore
    await updateTodo(id, { task: editTitle, completed: editCompleted });
    // Reset form and close modal
    setActiveTodoId(null);
    setEditTitle("");
    setEditCompleted(false);
    setOpen(false);
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <ul className="list-group mt-3">
  {todos.some(todo => todo.completed) ? (
    // Render only the tasks that are completed
    todos.map((todo) => (
      todo.completed && (
        <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center bg-dark border-0 text-white">
          <span style={{ textDecoration: todo.completed ? "line-through" : "none",fontSize:'20px' }}>
            {todo.task}
          </span>
          <div className="d-flex gap-2">
            <Button
              variant="success"
              className="btn-sm"
              onClick={() => handleToggleCompletion(todo.id, todo.completed)}
            >
              {todo.completed ? "Undo" : "Complete"}
            </Button>
            <Button
              variant="danger"
              className="btn-sm"
              onClick={() => handleDelete(todo.id)}
            >
              Delete
            </Button>
            <Button
              variant="primary"
              className="btn-sm"
              onClick={() => {
                setActiveTodoId(todo.id);
                setEditTitle(todo.task);
                setEditCompleted(todo.completed);
                handleOpen();
              }}
            >
              Edit
            </Button>
          </div>
        </li>
      )
    ))
  ) : (
    // Show message if there are no completed tasks
    <div className="alert alert-info" role="alert">
      No completed tasks available.
    </div>
  )}
</ul>


      )}

      {/* Add the reference to the bottom of the list */}
      <div ref={bottomRef}></div>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style} bgcolor={"white"}>
          {activeTodoId && (
            <div className="edit-form">
              <div className="mt-3 text-center">
                <div className="input-group d-block text-center">
                  <label htmlFor="title" style={{ marginBottom: '20px' }}>New Task</label>
                  <input type="text" className="form-control" placeholder="Edit task title" value={editTitle} id="title" style={{ width: '60%', margin: 'auto', marginBottom: '10p' }} onChange={(e) => setEditTitle(e.target.value)} />
                </div>
                <div className="input-group d-flex justify-content-evenly">
                  <label htmlFor="complete">Completed or not</label>
                  <input type="checkbox" id="complete" checked={editCompleted} onChange={(e) => setEditCompleted(e.target.checked)} />
                </div>
                <ThemeProvider theme={theme}>
                  <Button variant="contained" className="ms-2" sx={{ color: 'white' }} onClick={() => handleSaveClick(activeTodoId)}> Save</Button>
                </ThemeProvider>
                <div ref={ediError} className="editError d-none text-danger"></div>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}





import { useState, useEffect, useRef } from "react";
import { addTodo, listenUserTodos, deleteTodo, toggleTodoCompletion } from "./firebaseService";
import { Button, TextField, Container, Typography, Card, CardContent, Box, Select, MenuItem, InputAdornment, Modal, Fab, Zoom} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Add as AddIcon, Edit as EditIcon, Logout as LogoutIcon, ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../firebase";
import OnProgress from "../OnProgress/OnProgress";
import Done from "../Done/Done";
import Data from "./data"; // Component for 'All' tasks

// Firebase Authentication & Firestore
const auth = getAuth();
const db = getFirestore(app);

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
      main: "#FFC107",
    },
    secondary: {
      main: "#DFA805",
    },
  },
});

export default function TodoApp() {
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("All"); // Dropdown state
  const [formVisible, setFormVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
const [loading, setLoading] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);
  const [user, setUser] = useState(null);
const [todos, setTodos] = useState([]);
  const ediError = useRef(null);
  const bottomRef = useRef(null);

  // Handle task addition
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!task.trim()) return; // Prevent empty tasks
    
    const newTask = {
      task,
      status: status === "All" ? "On Progress" : status,
    };
  
    try {
      await addTodo(task); // Pass only `task` since `addTodo` expects a string
      setTodos((prevTodos) => [...prevTodos, newTask]); // Update state only if Firestore write succeeds
      setTask(""); // Clear input field
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
  
  // Handle form toggle
  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      localStorage.setItem("logout", Date.now());
      await signOut(auth);
      window.location.href = "../login";
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  useEffect(() => {
    const logoutListener = () => {
      signOut(auth)
        .then(() => {
          window.location.href = "../login";
        })
        .catch((error) => {
          console.error("Error during logout:", error);
        });
    };

    window.addEventListener("storage", (event) => {
      if (event.key === "logout") {
        logoutListener();
      }
    });

    return () => {
      window.removeEventListener("storage", logoutListener);
    };
  }, []);

 // Filter tasks based on the selected status
const filteredTasks =
status === "All" ? todos : todos.filter((task) => task.status === status);

// Filter tasks based on search term
const filteredBySearchTerm = filteredTasks.filter((taskItem) => {
// Ensure taskItem.task is a string before calling toLowerCase
return typeof taskItem.task === 'string' && taskItem.task.toLowerCase().includes(searchTerm.toLowerCase());
});
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
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../../public/images06.jpg')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div style={{ position: "fixed", bottom: 16, right: 16 }}>
          <Fab color="primary" aria-label="add" onClick={handleClick}>
            <AddIcon />
          </Fab>

          {open && (
            <>

              <Zoom in={open}>
                <Fab
                  color="secondary"
                  aria-label="option2"
                  style={{ position: "absolute", bottom: 70, right: 2 }}
                  onClick={() => {
                    setFormVisible(!formVisible);
                  }}
                >
                  <EditIcon sx={{ color: "white" }} />
                </Fab>
              </Zoom>
              <Zoom in={open}>
                <Fab color="secondary" aria-label="option3" style={{ position: "absolute", bottom: 1, right: 80 }}>
                  <Button onClick={handleLogout} style={{ color: "white" }}>
                    <LogoutIcon />
                  </Button>
                </Fab>
              </Zoom>
            </>
          )}
        </div>

        <Container maxWidth="sm" className="text-center" sx={{ mt: 5 }}>
          <Card>
            <CardContent sx={{ backgroundColor: "#333333" }}>
              <Typography variant="h4" gutterBottom style={{ color: "#FFC107" }}>
                Your To-Do List
              </Typography>
              {formVisible && (
                <form onSubmit={handleAddTask}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="New Task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    sx={{ mb: 2, backgroundColor: "white", borderRadius: "5px", color: "black" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            displayEmpty
                            IconComponent={ArrowDropDownIcon}
                            sx={{ minWidth: 80, backgroundColor: "white" }}
                          >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="On Progress">On Progress</MenuItem>
                            <MenuItem value="Done">Done</MenuItem>
                            <MenuItem value="Search">Search</MenuItem>
                          </Select>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    sx={{ marginY: 2, color: "white" }}
                  >
                    Add Task
                  </Button>
                </form>
              )}

              <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                {status === "All" && <Data />}
                {status === "On Progress" && <OnProgress />}
                {status === "Done" && <Done />}
                {/* Rendering tasks based on status */}
                {status !== "All" &&
                  <ul className="list-group">
                    {filteredBySearchTerm.length === 0 ? (
                      <h5 className="text-secondary mt-4">There are no tasks available.</h5>
                    ) : (
                      filteredBySearchTerm.map((todo, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center bg-dark border-0 text-white">
                          <span style={{ textDecoration: todo.completed ? "line-through" : "none", fontSize: '20px' }}>
                            {todo.task} {/* Ensure this is a string */}
                          </span>
                          <div className="d-flex gap-2">
                            <Button variant="success" className="btn-sm" onClick={() => handleToggleCompletion(index, todo.completed)}>
                              {todo.completed ? "Undo" : "Complete"}
                            </Button>
                            <Button variant="danger" className="btn-sm" onClick={() => handleDelete(index)}>Delete</Button>
                            <Button variant="primary" className="btn-sm" onClick={() => { setActiveTodoId(index); setEditTitle(todo.task); setEditCompleted(todo.completed); }}>
                              Edit
                            </Button>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>}
              </Box>
            </CardContent>
          </Card>
        </Container>
<Modal open={activeTodoId !== null} onClose={() => setActiveTodoId(null)}>
          <Box sx={{ bgcolor: "white", padding: 2 }}>
            {activeTodoId !== null && (
              <div className="edit-form">
                <div className="mt-3 text-center">
                  <div className="input-group d-block text-center">
                    <label htmlFor="title" style={{ marginBottom: '20px' }}>New Task</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Edit task title"
                      value={editTitle}
                      id="title"
                      style={{ width: '60%', margin: 'auto', marginBottom: '10p' }}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>
                  <div className="input-group d-flex justify-content-evenly">
                    <label htmlFor="complete">Completed or not</label>
                    <input
                      type="checkbox"
                      id="complete"
                      checked={editCompleted}
                      onChange={(e) => setEditCompleted(e.target.checked)}
                    />
                  </div>
                  <ThemeProvider theme={theme}>
                    <Button
                      variant="contained"
                      className="ms-2"
                      sx={{ color: 'white' }}
                      onClick={() => handleSaveClick(activeTodoId)}
                    >
                      Save
                    </Button>
                  </ThemeProvider>
                </div>
              </div>
            )}
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}
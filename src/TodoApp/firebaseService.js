import { getFirestore, collection, query, where, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";

const db = getFirestore(app);
const auth = getAuth(app);

// Listen for user's todos
export const listenUserTodos = (callback) => {
  const user = auth.currentUser ;  // Check if the user is authenticated
  if (!user) {
    console.log("No user authenticated!");
    return; // Exit if no user is authenticated
  }

  const q = query(
    collection(db, "todos"),
    where("userId", "==", user.uid),
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    console.log("Snapshot received!");
    if (querySnapshot.empty) {
      console.log("No data found!");
      return;
    }
    const todos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(todos); // Pass todos to the callback
  }, (error) => {
    console.error("Error listening to Firestore:", error);
  });

  return unsubscribe; // Return the unsubscribe function for cleanup
};

// Add a new todo
export const addTodo = async (task) => {
  const user = auth.currentUser;
  if (!user) return;

  const newTask = {
    userId: user.uid,
    task,
    taskLower: task.toLowerCase(), // Store lowercase version for search
    completed: false,
  };

  try {
    await addDoc(collection(db, "todos"), newTask);
    console.log("Task added successfully!");
  } catch (error) {
    console.error("Error adding task:", error);
  }
};



// Delete a todo
export const deleteTodo = async (id) => {
  try {
    await deleteDoc(doc(db, "todos", id));
    console.log("Task deleted successfully!");
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

// Toggle todo completion status
export const toggleTodoCompletion = async (id, completed) => {
  try {
    await updateDoc(doc(db, "todos", id), { completed });
    console.log("Task completion status updated successfully!");
  } catch (error) {
    console.error("Error updating task completion:", error);
  }
};

// Update todo data
export const updateTodo = async (docId, updatedData) => {
  try {
    const docRef = doc(db, "todos", docId); // Ensure the correct collection name
    await updateDoc(docRef, updatedData); // Use updateDoc for updating fields
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};



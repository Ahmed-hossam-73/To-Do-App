import { getFirestore, collection, query, where, addDoc, deleteDoc, doc, updateDoc, limit, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";

const db = getFirestore(app);
const auth = getAuth(app);


export const listenUserTodos = (callback) => {
  const user = auth.currentUser;  // Check if the user is authenticated
  if (!user) {
    console.log("No user authenticated!");
    return; // Exit if no user is authenticated
  }

  const q = query(
    collection(db, "todos"),
    where("userId", "==", user.uid),
    limit(10)
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

export const addTodo = async (task) => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("User not authenticated.");
    return;
  }

  try {
    await addDoc(collection(db, "todos"), {
      userId: user.uid,
      task: task,
      completed: false,
    });
    console.log("Task added successfully!");
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const deleteTodo = async (id) => {
  try {
    await deleteDoc(doc(db, "todos", id));
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export const toggleTodoCompletion = async (id, completed) => {
  try {
    await updateDoc(doc(db, "todos", id), { completed });
  } catch (error) {
    console.error("Error updating task completion:", error);
  }
};

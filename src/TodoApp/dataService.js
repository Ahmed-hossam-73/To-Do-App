// src/TodoApp/dataService.js

import { db } from './firebaseService'; // Assuming you're using Firestore
import { collection, getDocs } from 'firebase/firestore';

export const getData = async () => {
  const querySnapshot = await getDocs(collection(db, "tasks")); // Replace with your collection name
  const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return tasks;
};

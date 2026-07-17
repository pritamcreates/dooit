import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const StoreContext = createContext();

export function useStore() {
  return useContext(StoreContext);
}

export function StoreProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const local = localStorage.getItem('dooit_tasks');
    return local ? JSON.parse(local) : [];
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Sync tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('dooit_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync tasks from Firestore in real-time if logged in
  useEffect(() => {
    if (!user) {
      return;
    }

    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const tasksList = [];
      snapshot.forEach((doc) => {
        tasksList.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksList);
    });

    return () => unsubscribe();
  }, [user]);

  // Add Task
  const addTask = async (taskData) => {
    const taskId = Date.now().toString();
    const newTask = {
      ...taskData,
      id: taskId,
      comments: 0,
      createdAt: new Date().toISOString(),
    };

    if (user) {
      const taskDocRef = doc(db, 'users', user.uid, 'tasks', taskId);
      await setDoc(taskDocRef, newTask);
    } else {
      setTasks((prev) => [...prev, newTask]);
    }
  };

  // Move Task (Kanban)
  const moveTask = async (taskId, newColId) => {
    if (user) {
      const taskDocRef = doc(db, 'users', user.uid, 'tasks', taskId);
      await updateDoc(taskDocRef, { col: newColId });
    } else {
      setTasks((prev) =>
        prev.map(task =>
          task.id === taskId ? { ...task, col: newColId } : task
        )
      );
    }
  };

  // Toggle Task Status (Complete/Incomplete)
  const toggleTaskStatus = async (taskId) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const newStatus = targetTask.status === 'Done' ? 'Todo' : 'Done';
    const newCol = targetTask.status === 'Done' ? 'todo' : 'done';

    if (user) {
      const taskDocRef = doc(db, 'users', user.uid, 'tasks', taskId);
      await updateDoc(taskDocRef, { status: newStatus, col: newCol });
    } else {
      setTasks((prev) =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, status: newStatus, col: newCol }
            : task
        )
      );
    }
  };

  // Delete Task
  const deleteTask = async (taskId) => {
    if (user) {
      const taskDocRef = doc(db, 'users', user.uid, 'tasks', taskId);
      await deleteDoc(taskDocRef);
    } else {
      setTasks((prev) => prev.filter(task => task.id !== taskId));
    }
  };

  const value = {
    tasks,
    user,
    loading,
    isFocusMode,
    setIsFocusMode,
    addTask,
    moveTask,
    toggleTaskStatus,
    deleteTask
  };

  return (
    <StoreContext.Provider value={value}>
      {!loading && children}
    </StoreContext.Provider>
  );
}

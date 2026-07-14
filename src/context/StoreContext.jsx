import React, { createContext, useContext, useState } from 'react';

const StoreContext = createContext();

export function useStore() {
  return useContext(StoreContext);
}

export function StoreProvider({ children }) {
  // Global Tasks State
  const [tasks, setTasks] = useState([]);

  // Add Task Function
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(), // simple unique ID
      comments: 0,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  // Move Task (for Kanban Drag & Drop)
  const moveTask = (taskId, newColId) => {
    setTasks((prev) => 
      prev.map(task => 
        task.id === taskId ? { ...task, col: newColId } : task
      )
    );
  };

  // Mark Complete
  const toggleTaskStatus = (taskId) => {
    setTasks((prev) =>
      prev.map(task =>
        task.id === taskId 
          ? { ...task, status: task.status === 'Done' ? 'Todo' : 'Done', col: task.status === 'Done' ? 'todo' : 'done' } 
          : task
      )
    );
  };

  // Delete Task
  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter(task => task.id !== taskId));
  };

  const value = {
    tasks,
    addTask,
    moveTask,
    toggleTaskStatus,
    deleteTask
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

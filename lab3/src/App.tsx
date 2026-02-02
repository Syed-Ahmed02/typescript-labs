import { useState } from 'react';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Task, Priority } from './types/task';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (title: string, priority: Priority) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      priority,
      status: 'pending',
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Task Manager</h1>
        <p>Lab 3: TypeScript Debugging Practice</p>
      </header>

      <main className="app-main">
        <TaskForm onAdd={addTask} />
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </main>

      <footer className="app-footer">
        <p>Debug the 4 TypeScript bugs to complete this lab!</p>
      </footer>
    </div>
  );
}

export default App;

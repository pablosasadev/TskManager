import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';
import type { Task } from '../types';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  // Fetch all tasks for the authenticated user
  const loadTasks = async () => {
    try {
      const response = await taskService.getAll();
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await taskService.create({ title, description });
      setTitle('');
      setDescription('');
      loadTasks();
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await taskService.update(task.id, {
        title: task.title,
        description: task.description,
        isCompleted: !task.isCompleted,
      });
      loadTasks();
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await taskService.delete(id);
      loadTasks();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">TskManager</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.fullName}</span>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleCreate} className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet. Create one above.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-white p-4 rounded-lg shadow flex items-start gap-3"
              >
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => handleToggle(task)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      task.isCompleted ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
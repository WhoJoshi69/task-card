import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  taskToEdit: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [group, setGroup] = useState<Task['group']>('Educational');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDuration(taskToEdit.duration);
      setImageUrl(taskToEdit.imageUrl);
      setGroup(taskToEdit.group);
    }
  }, [taskToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      title,
      duration,
      imageUrl,
      completed: false,
      group,
    });
    setTitle('');
    setDuration('');
    setImageUrl('');
    setGroup('Educational');
  };

  const groups: Task['group'][] = ['Educational', 'Entertainment', 'Financial', 'Skin Care'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {taskToEdit ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Group
            </label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value as Task['group'])}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {groups.map((groupOption) => (
                <option key={groupOption} value={groupOption}>
                  {groupOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 1 hour"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {taskToEdit ? 'Save Changes' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
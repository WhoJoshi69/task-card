import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  taskToEdit: Task | null;
  availableGroups: string[];
  onAddGroup: (group: string) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask, taskToEdit, availableGroups, onAddGroup }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('1 hour');
  const [imageUrl, setImageUrl] = useState('');
  const [group, setGroup] = useState<Task['group']>('Educational');
  const [quickLink, setQuickLink] = useState('');
  const [newGroup, setNewGroup] = useState('');

  const getRandomUnsplashImage = () => {
    return `https://source.unsplash.com/random/800x600/?productivity,work,study`;
  };

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDuration(taskToEdit.duration);
      setImageUrl(taskToEdit.imageUrl);
      setGroup(taskToEdit.group);
      setQuickLink(taskToEdit.quickLink || '');
    }
  }, [taskToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      title,
      duration: duration || '1 hour',
      imageUrl: imageUrl || getRandomUnsplashImage(),
      quickLink: quickLink || undefined,
      completed: false,
      group,
    });
    setTitle('');
    setDuration('1 hour');
    setImageUrl('');
    setGroup('Educational');
    setQuickLink('');
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroup.trim()) {
      onAddGroup(newGroup.trim());
      setGroup(newGroup.trim());
      setNewGroup('');
    }
  };

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
              {availableGroups.map((groupOption) => (
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
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Leave empty for random image"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Quick Link (Optional)
            </label>
            <input
              type="url"
              value={quickLink}
              onChange={(e) => setQuickLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              placeholder="New group name"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddGroup}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Add Group
            </button>
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
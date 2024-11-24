import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyCheckin } from '../types';

interface DailyCheckinsProps {
  checkins: DailyCheckin[];
  onToggle: (id: number) => void;
  onAdd: (checkin: Omit<DailyCheckin, 'id'>) => void;
  onDelete: (id: number) => void;
  onEdit: (checkin: DailyCheckin) => void;
}

const DailyCheckins: React.FC<DailyCheckinsProps> = ({
  checkins,
  onToggle,
  onAdd,
  onDelete,
  onEdit,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      onEdit({
        id: editingId,
        title: newTitle,
        completed: checkins.find(c => c.id === editingId)?.completed || false,
      });
      setEditingId(null);
    } else {
      onAdd({
        title: newTitle,
        completed: false,
      });
    }
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-700 w-80">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white font-handwriting">Daily Check-ins</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isAdding || editingId !== null ? (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="mb-4"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="New check-in item..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setNewTitle('');
                }}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </motion.form>
        ) : null}
      </AnimatePresence>

      <div className="space-y-2">
        <AnimatePresence>
          {checkins.map((checkin) => (
            <motion.div
              key={checkin.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 group"
            >
              <input
                type="checkbox"
                checked={checkin.completed}
                onChange={() => onToggle(checkin.id)}
                className="w-5 h-5 rounded-md border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <span
                className={`flex-1 text-white transition-all font-handwriting text-lg ${
                  checkin.completed ? 'line-through opacity-50' : ''
                }`}
              >
                {checkin.title}
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => {
                    setEditingId(checkin.id);
                    setNewTitle(checkin.title);
                    setIsAdding(false);
                  }}
                  className="p-1 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(checkin.id)}
                  className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyCheckins;
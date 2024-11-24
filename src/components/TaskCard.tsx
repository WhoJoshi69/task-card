import React from 'react';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onMarkCompleted: (id: number) => void;
  onNextTask: () => void;
  totalTasks: number;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onMarkCompleted,
  onNextTask,
  totalTasks,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={task.id}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        className="bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-700"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-start mb-6"
        >
          <h2 className="text-3xl font-bold text-white">Your Current Task is</h2>
          <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 text-lg">{task.duration}</span>
          </div>
        </motion.div>

        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold text-white mb-8 font-handwriting"
        >
          {task.title}
        </motion.h3>

        <motion.div
          onClick={() => task.quickLink && window.open(task.quickLink, '_blank')}
          className={`relative mb-8 ${task.quickLink ? 'cursor-pointer' : ''}`}
        >
          <img
            src={task.imageUrl}
            alt={task.title}
            className="w-full h-[400px] object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent rounded-xl" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center mt-8"
        >
          <button
            onClick={() => onMarkCompleted(task.id)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
          >
            <CheckCircle className="w-6 h-6" />
            <span>Mark as completed</span>
          </button>

          <button
            onClick={onNextTask}
            className="flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-colors"
          >
            <span>next task</span>
            <ArrowRight className="w-6 h-6" />
          </button>

          <div className="text-green-400 font-mono text-lg">
            Count: {totalTasks}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskCard;
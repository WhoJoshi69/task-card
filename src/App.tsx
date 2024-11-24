import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ArrowRight, Plus, List } from 'lucide-react';
import TaskCard from './components/TaskCard';
import AddTaskModal from './components/AddTaskModal';
import TaskList from './components/TaskList';
import DailyCheckins from './components/DailyCheckins';
import { Task, DailyCheckin } from './types';
import { motion } from 'framer-motion';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: 1,
        title: "Reading Alchemist Book",
        duration: "1 hour",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
        quickLink: "https://www.goodreads.com/book/show/865.The_Alchemist",
        completed: false,
        group: "Educational"
      }
    ];
  });

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showList, setShowList] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [availableGroups, setAvailableGroups] = useState<string[]>(() => {
    const savedGroups = localStorage.getItem('taskGroups');
    return savedGroups ? JSON.parse(savedGroups) : ['Educational', 'Entertainment', 'Financial', 'Skin Care'];
  });

  const [dailyCheckins, setDailyCheckins] = useState<DailyCheckin[]>(() => {
    const saved = localStorage.getItem('dailyCheckins');
    return saved ? JSON.parse(saved) : [];
  });

  const [showDailyCheckins, setShowDailyCheckins] = useState(true);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskGroups', JSON.stringify(availableGroups));
  }, [availableGroups]);

  useEffect(() => {
    localStorage.setItem('dailyCheckins', JSON.stringify(dailyCheckins));
  }, [dailyCheckins]);

  // Get first incomplete task from each group
  const getFirstIncompleteTasks = () => {
    const firstIncompleteTasks: Task[] = [];

    availableGroups.forEach(group => {
      const firstIncomplete = tasks.find(task => 
        task.group === group && !task.completed
      );
      if (firstIncomplete) {
        firstIncompleteTasks.push(firstIncomplete);
      }
    });

    return firstIncompleteTasks;
  };

  const handleMarkCompleted = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    
    // Reset current index to 0 after marking a task complete
    setCurrentTaskIndex(0);
  };

  const handleNextTask = () => {
    const incompleteTasks = getFirstIncompleteTasks();
    setCurrentTaskIndex(prev => 
      prev < incompleteTasks.length - 1 ? prev + 1 : 0
    );
  };

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    if (taskToEdit) {
      setTasks(prev => prev.map(task => 
        task.id === taskToEdit.id ? { ...taskData, id: taskToEdit.id } : task
      ));
      setTaskToEdit(null);
    } else {
      setTasks(prev => [...prev, { ...taskData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleReorder = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  };

  const handleEditTask = (taskToEdit: Task) => {
    setTaskToEdit(taskToEdit);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleAddGroup = (newGroup: string) => {
    if (!availableGroups.includes(newGroup)) {
      setAvailableGroups(prev => [...prev, newGroup]);
    }
  };

  const handleToggleComplete = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleToggleCheckin = (id: number) => {
    setDailyCheckins(prev => prev.map(checkin => {
      if (checkin.id === id) {
        return {
          ...checkin,
          completed: !checkin.completed,
          lastCompletedDate: !checkin.completed ? new Date().toISOString() : checkin.lastCompletedDate
        };
      }
      return checkin;
    }));
  };

  const handleAddCheckin = (checkin: Omit<DailyCheckin, 'id'>) => {
    setDailyCheckins(prev => [...prev, { ...checkin, id: Date.now() }]);
  };

  const handleDeleteCheckin = (id: number) => {
    setDailyCheckins(prev => prev.filter(checkin => checkin.id !== id));
  };

  const handleEditCheckin = (checkin: DailyCheckin) => {
    setDailyCheckins(prev => prev.map(c => c.id === checkin.id ? checkin : c));
  };

  const incompleteTasks = getFirstIncompleteTasks();
  const currentTask = incompleteTasks[currentTaskIndex];

  return (
    <div className="min-h-screen flex items-center justify-center p-8 gap-6">
      <div className="max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Task Manager</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowList(!showList)}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 transition-colors"
            >
              <List size={24} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {showList ? (
          <TaskList
            tasks={tasks}
            onReorder={handleReorder}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        ) : (
          currentTask && (
            <TaskCard
              task={currentTask}
              onMarkCompleted={handleMarkCompleted}
              onNextTask={handleNextTask}
              totalTasks={incompleteTasks.length}
            />
          )
        )}

        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTaskToEdit(null);
          }}
          onAddTask={handleAddTask}
          taskToEdit={taskToEdit}
          availableGroups={availableGroups}
          onAddGroup={handleAddGroup}
        />
      </div>
      
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: showDailyCheckins ? 0 : 320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full flex items-center"
      >
        <button
          onClick={() => setShowDailyCheckins(!showDailyCheckins)}
          className="bg-gray-800 p-2 rounded-l-xl border-l border-y border-gray-700 -ml-3 z-10 hover:bg-gray-700 transition-colors"
        >
          <ArrowRight
            size={20}
            className={`text-gray-400 transition-transform duration-300 ${
              showDailyCheckins ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        <div className="h-full py-8 pr-8">
          <DailyCheckins
            checkins={dailyCheckins}
            onToggle={handleToggleCheckin}
            onAdd={handleAddCheckin}
            onDelete={handleDeleteCheckin}
            onEdit={handleEditCheckin}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default App;
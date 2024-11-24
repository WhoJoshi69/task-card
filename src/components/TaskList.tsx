import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task } from '../types';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onReorder: (tasks: Task[]) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onReorder, onEdit, onDelete }) => {
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.group]) {
      acc[task.group] = [];
    }
    acc[task.group].push(task);
    return acc;
  }, {} as Record<Task['group'], Task[]>);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceGroup = result.source.droppableId;
    const destinationGroup = result.destination.droppableId;

    const newGroupedTasks = { ...groupedTasks };
    const [movedTask] = newGroupedTasks[sourceGroup].splice(result.source.index, 1);
    newGroupedTasks[destinationGroup].splice(result.destination.index, 0, movedTask);

    const newTasks: Task[] = [];
    Object.values(newGroupedTasks).forEach(groupTasks => {
      newTasks.push(...groupTasks);
    });

    onReorder(newTasks);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([group, groupTasks]) => (
          <div key={group} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 font-handwriting">
              {group}
            </h3>
            <Droppable droppableId={group}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {groupTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center gap-3 bg-gray-700/50 backdrop-blur-sm p-4 rounded-lg border border-gray-600/50 ${
                            task.completed ? 'opacity-50' : ''
                          }`}
                        >
                          <div {...provided.dragHandleProps} className="cursor-grab">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{task.title}</h4>
                            <p className="text-gray-400 text-sm">{task.duration}</p>
                          </div>
                          {task.completed && (
                            <span className="text-green-400 text-sm px-2 py-1 bg-green-400/10 rounded-full">
                              Completed
                            </span>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => onEdit(task)}
                              className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete(task.id)}
                              className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskList;
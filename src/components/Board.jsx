import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { db, updateTaskStatus, deleteTask } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function Board({ openModal }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(tasksData);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore not configured:", e);
      setLoading(false);
    }
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic UI update
    const newStatus = destination.droppableId;
    
    // We update local state first so it feels instant
    setTasks(prev => prev.map(t => {
      if (t.id === draggableId) return { ...t, status: newStatus };
      return t;
    }));

    // Perform the async update
    try {
      await updateTaskStatus(draggableId, newStatus);
    } catch (err) {
      console.error(err);
      // It will revert on next snapshot if error
    }
  };

  const columns = [
    { title: 'To Do', id: 'todo' },
    { title: 'In Progress', id: 'inprogress' },
    { title: 'Done', id: 'done' },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 pt-2">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);

          return (
            <div key={col.id} className="min-w-[300px] w-[320px] bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl flex flex-col p-4 border border-slate-200 dark:border-slate-800/60">
              <div className="flex justify-between items-center mb-4 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{col.title}</h3>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-transparent border-none outline-none cursor-pointer">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex flex-col gap-3 flex-1 overflow-y-auto min-h-[150px] transition-colors rounded-xl p-1 -m-1 ${snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                  >
                    {loading && <div className="text-sm text-slate-400 animate-pulse mt-2">Loading...</div>}
                    
                    <AnimatePresence>
                      {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <TaskCard 
                              task={task} 
                              provided={provided} 
                              isDragging={snapshot.isDragging} 
                            />
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button 
                onClick={() => openModal(col.id)}
                className="mt-4 flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium text-sm p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors bg-transparent border-none outline-none cursor-pointer w-full"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

function TaskCard({ task, provided, isDragging }) {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Design': return 'text-purple-600 bg-purple-100 dark:bg-purple-500/20 dark:text-purple-300';
      case 'Engineering': return 'text-blue-600 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-300';
      case 'Marketing': return 'text-orange-600 bg-orange-100 dark:bg-orange-500/20 dark:text-orange-300';
      default: return 'text-slate-600 bg-slate-200 dark:bg-slate-500/20 dark:text-slate-300';
    }
  };

  const dateStr = task.createdAt && task.createdAt.toDate 
      ? task.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
      : 'Just now';

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        ...provided.draggableProps.style,
      }}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab relative group transition-all ${isDragging ? 'shadow-xl shadow-blue-500/20 ring-2 ring-blue-500 rotate-2' : 'hover:shadow-md'}`}
      >
        <button 
          onClick={(e) => {
             e.stopPropagation();
             if (window.confirm('Delete this task?')) deleteTask(task.id);
          }}
          className="absolute top-3 right-3 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-transparent border-none outline-none cursor-pointer"
        >
          <Trash2 size={16} />
        </button>

        <div className="flex gap-2 mb-2 flex-wrap mt-1">
           <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${getCategoryColor(task.category)}`}>
             {task.category || 'General'}
           </span>
        </div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-3 pr-4 leading-snug break-words">
          {task.title}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex -space-x-2">
            {task.userPhoto ? (
              <img src={task.userPhoto} alt="User" className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] text-slate-500 dark:text-slate-300 font-bold overflow-hidden shadow-sm uppercase">
                 {task.userName ? task.userName.charAt(0) : "?"}
              </div>
            )}
          </div>
          <span className="text-xs text-slate-400 font-medium tracking-wide">{dateStr}</span>
        </div>
      </motion.div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskData } from '../common/modal/taskmodal';
import { Draggable } from '@hello-pangea/dnd';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import DeleteModal from '../common/modal/deletemodal';

interface DraggableTaskProps {
    task: TaskData;
    index: number;
    onEdit: (task: TaskData) => void;
    onDelete: (task: TaskData) => void;
}

export default function DraggableTask({
    task,
    index,
    onEdit,
    onDelete,
}: DraggableTaskProps) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [expand, setExpand] = useState(false);

    const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;

    const MotionDiv = motion.div;

    return (
        <>
            <Draggable draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                    <MotionDiv
                        ref={provided.innerRef}
                        {...(provided.draggableProps as any)}
                        {...(provided.dragHandleProps as any)}
                        className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md space-y-2 relative transition-all ${snapshot.isDragging ? 'ring-2 ring-gray-900' : ''
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-md font-semibold text-gray-600 dark:text-gray-200">
                                    {task.name}
                                </h3>
                                <div className="text-xs text-gray-600 dark:text-gray-300">
                                    <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-full text-xs">
                                        {task.tag}
                                    </span>
                                    <div className="mt-1">📅 {task.deadline}</div>
                                    {task.remarks && <div className="mt-1">📝 {task.remarks}</div>}
                                    {totalSubtasks > 0 && (
                                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            ✅ {completedSubtasks} / {totalSubtasks} subtasks done
                                        </div>
                                    )}
                                </div>
                            </div>
                            {totalSubtasks > 0 && (
                                <button
                                    onClick={() => setExpand(!expand)}
                                    className="text-gray-500 hover:text-gray-500"
                                >
                                    {expand ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                            )}
                        </div>

                        <AnimatePresence>
                            {expand && task.subtasks && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden text-sm text-gray-700 dark:text-gray-200 space-y-2"
                                >
                                    {task.subtasks.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="flex items-center gap-2 pl-1 text-sm bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-md"
                                        >
                                            <input type="checkbox" checked={sub.completed} disabled />
                                            <span className={sub.completed ? 'line-through' : ''}>
                                                {sub.title}
                                            </span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex justify-end gap-2 mt-2 z-20 relative">
                            <button
                                onClick={() => onEdit(task)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => setIsDeleteOpen(true)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </MotionDiv>
                )}
            </Draggable>

            {isDeleteOpen && (
                <DeleteModal
                    isOpen={isDeleteOpen}
                    onClose={() => setIsDeleteOpen(false)}
                    onConfirm={() => onDelete(task)}
                    title="Delete Task"
                    description="Are you sure you want to delete this task?"
                />
            )}
        </>
    );
}

'use client';

import { useDroppable, useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { TaskData } from '../common/modal/taskmodal';

interface Props {
    title: string;
    categoryId: string;
    tasks: TaskData[];
    onAddTask: (categoryId: string) => void;
    onEditTask: (task: TaskData) => void;
    onDeleteTask: (task: TaskData) => void;
    onDeleteCategory: (categoryId: string) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export default function CategoryColumn({
    title,
    categoryId,
    tasks,
    onAddTask,
    onEditTask,
    onDeleteTask,
    onDeleteCategory,
    onToggleSubtask,
}: Props) {
    const { setNodeRef } = useDroppable({ id: categoryId });

    return (
        <div
            ref={setNodeRef}
            className="bg-white dark:bg-gray-850 rounded-xl p-5 min-w-[360px] w-[360px] shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <button
                    onClick={() => onDeleteCategory(categoryId)}
                    className="text-gray-900 transition"
                    title="Delete Category"
                >
                    <FaTrash />
                </button>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-4 mb-4">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => onEditTask(task)}
                        onDelete={() => onDeleteTask(task)}
                        onToggleSubtask={(subtaskId) => onToggleSubtask(task.id, subtaskId)}
                    />
                ))}
            </div>

            {/* Add Task */}
            <button
                onClick={() => onAddTask(categoryId)}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium px-4 py-2 rounded-lg mt-auto transition"
            >
                + Add Task
            </button>
        </div>
    );
}

function TaskCard({
    task,
    onEdit,
    onDelete,
    onToggleSubtask,
}: {
    task: TaskData;
    onEdit: () => void;
    onDelete: () => void;
    onToggleSubtask: (subtaskId: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
    });

    const style = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    const daysLeft = Math.ceil(
        (new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all"
            whileHover={{ scale: 1.01 }}
        >
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 space-y-1">
                    {/* Title & Tag */}
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{task.name}</h3>
                        <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full
                            ${task.tag === 'New' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'}
                            ${task.tag === 'On Going' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}
                            ${task.tag === 'Completed' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}
                            ${task.tag === 'Trash' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'}
                            `}
                        >
                            {task.tag}
                        </span>
                    </div>


                    {/* Deadline */}
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Deadline: {task.deadline}{" "}
                        {task.tag !== 'Completed' && daysLeft < 0 && (
                            <span className="text-red-500">(Overdue)</span>
                        )}
                    </p>

                    {/* Remarks */}
                    {task.remarks && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            {task.remarks}
                        </p>
                    )}

                    {/* Subtasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                        <div className="mt-2 space-y-1 max-h-24 overflow-y-auto pr-1">
                            {task.subtasks.map((sub) => (
                                <label
                                    key={sub.id}
                                    className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300"
                                >
                                    <input
                                        type="checkbox"
                                        checked={sub.completed}
                                        onChange={() => onToggleSubtask(sub.id)}
                                        className="accent-pink-600"
                                    />
                                    <span className={sub.completed ? 'line-through text-gray-400' : ''}>
                                        {sub.title}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-300 text-sm">
                    <span
                        {...listeners}
                        {...attributes}
                        className="cursor-grab active:cursor-grabbing"
                        title="Drag Task"
                    >
                        ☰
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        className="hover:text-blue-500 transition"
                        title="Edit"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="hover:text-red-500 transition"
                        title="Delete"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface TaskData {
    id: string;
    name: string;
    tag: 'New' | 'On Going' | 'Completed' | 'Trash';
    deadline: string;
    remarks?: string;
    categoryId: string | null;
    file?: File | null;
    subtasks?: Subtask[];
}

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: TaskData) => void;
    category: string;
    taskToEdit: TaskData | null;
}

export default function TaskModal({
    isOpen,
    onClose,
    onSave,
    category,
    taskToEdit,
}: TaskModalProps) {
    const [name, setName] = useState('');
    const [tag, setTag] = useState<'New' | 'On Going' | 'Completed' | 'Trash'>('New');
    const [deadline, setDeadline] = useState('');
    const [remarks, setRemarks] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);
    const [subtaskInput, setSubtaskInput] = useState('');

    useEffect(() => {
        if (taskToEdit) {
            setName(taskToEdit.name);
            setTag(taskToEdit.tag);
            setDeadline(taskToEdit.deadline);
            setRemarks(taskToEdit.remarks || '');
            setFile(taskToEdit.file || null);
            setSubtasks(taskToEdit.subtasks || []);
        } else {
            setName('');
            setTag('New');
            setDeadline('');
            setRemarks('');
            setFile(null);
            setSubtasks([]);
        }
    }, [taskToEdit]);

    const handleAddSubtask = () => {
        if (subtaskInput.trim() === '') return;
        setSubtasks((prev) => [...prev, { id: uuidv4(), title: subtaskInput, completed: false }]);
        setSubtaskInput('');
    };

    const handleToggleSubtask = (id: string) => {
        setSubtasks((prev) =>
            prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
        );
    };

    const handleRemoveSubtask = (id: string) => {
        setSubtasks((prev) => prev.filter((s) => s.id !== id));
    };

    const handleSubmit = () => {
        if (!name || !deadline) return;
        const task: TaskData = {
            id: taskToEdit ? taskToEdit.id : uuidv4(),
            name,
            tag,
            deadline,
            remarks,
            file,
            categoryId: category,
            subtasks,
        };
        onSave(task);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-6"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {taskToEdit ? 'Edit Task' : 'New Task'}
                        </h2>

                        {/* Form Fields */}
                        <div className="space-y-4 text-sm">
                            <input
                                type="text"
                                placeholder="Task name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />

                            <select
                                value={tag}
                                onChange={(e) => setTag(e.target.value as TaskData['tag'])}
                                className="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                                <option>New</option>
                                <option>On Going</option>
                                <option>Completed</option>
                            </select>

                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />

                            <textarea
                                placeholder="Remarks (optional)"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                                rows={3}
                            />

                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="text-sm text-gray-600 dark:text-gray-300"
                            />
                        </div>

                        {/* Subtasks */}
                        <div className="space-y-3 pt-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Subtasks
                            </label>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add subtask"
                                    value={subtaskInput}
                                    onChange={(e) => setSubtaskInput(e.target.value)}
                                    className="flex-1 p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSubtask}
                                    className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow hover:bg-gray-800 dark:hover:bg-gray-100 transition rounded-md text-sm"
                                >
                                    +
                                </button>
                            </div>

                            {subtasks.length > 0 && (
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                                    {subtasks.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md text-sm"
                                        >
                                            <label className="flex items-center gap-2 w-full">
                                                <input
                                                    type="checkbox"
                                                    checked={sub.completed}
                                                    onChange={() => handleToggleSubtask(sub.id)}
                                                />
                                                <span className={sub.completed ? 'line-through text-gray-400' : ''}>
                                                    {sub.title}
                                                </span>
                                            </label>
                                            <button
                                                onClick={() => handleRemoveSubtask(sub.id)}
                                                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-base"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow hover:bg-gray-800 dark:hover:bg-gray-100 transition text-sm"
                            >
                                {taskToEdit ? 'Save Changes' : 'Add Task'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

    );
}

'use client';

import { useState } from 'react';
import { TaskData } from '../common/modal/taskmodal';
import { dummyTasks } from '../data/dummydata';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';

export default function OnGoingPage() {
    const [tasks, setTasks] = useState<TaskData[]>(
        dummyTasks.filter((t) => t.tag === 'On Going')
    );
    const [taskToDelete, setTaskToDelete] = useState<TaskData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const confirmDeleteTask = () => {
        if (taskToDelete) {
            setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white transition">
            <h2 className="text-2xl font-bold mb-6 text-gray-600 dark:text-gray-300">
                📝 On Going Tasks
            </h2>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="px-4 py-3">Task Name</th>
                            <th className="px-4 py-3">Deadline</th>
                            <th className="px-4 py-3">Remarks</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center italic text-gray-400">
                                    No on-going tasks 💤
                                </td>
                            </tr>
                        ) : (
                            tasks.map((task) => (
                                <tr
                                    key={task.id}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                        {task.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                        {task.deadline}
                                    </td>
                                    <td className="px-4 py-3 italic text-gray-500 dark:text-gray-400">
                                        {task.remarks || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => {
                                                setTaskToDelete(task);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition"
                                            title="Delete Task"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && taskToDelete && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl"
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                        >
                            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">
                                Delete Task
                            </h3>
                            <p className="mb-5 text-gray-700 dark:text-gray-300">
                                Are you sure you want to delete{' '}
                                <strong>{taskToDelete.name}</strong>?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteTask}
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

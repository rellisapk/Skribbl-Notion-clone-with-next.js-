'use client';

import { useState } from 'react';
import { TaskData } from '../common/modal/taskmodal';
import { dummyTasks } from '../data/dummydata';
import { FaTrashRestore } from 'react-icons/fa';

export default function TrashPage() {
    const [tasks, setTasks] = useState<TaskData[]>(
        dummyTasks.filter((t) => t.tag === 'Trash')
    );

    const restoreTask = (task: TaskData) => {
        setTasks(tasks.filter((t) => t.id !== task.id));
        // Tambahkan logika push ke kategori tertentu kalau dibutuhkan
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white transition">
            <h2 className="text-2xl font-bold mb-6 text-gray-600 dark:text-gray-400">🗑️ Trash</h2>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="px-4 py-3">Task Name</th>
                            <th className="px-4 py-3">Remarks</th>
                            <th className="px-4 py-3 text-center">Restore</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-6 text-center italic text-gray-400 dark:text-gray-500">
                                    No tasks in trash 🧹
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
                                    <td className="px-4 py-3 italic text-gray-500 dark:text-gray-300">
                                        {task.remarks || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => restoreTask(task)}
                                            className="text-green-600 hover:text-green-800 dark:hover:text-green-400 transition"
                                            title="Restore Task"
                                        >
                                            <FaTrashRestore />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

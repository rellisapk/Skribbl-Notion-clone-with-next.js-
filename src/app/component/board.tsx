'use client';

import { useState, useEffect } from 'react';
import { dummyTasks, dummyCategories } from '../data/dummydata';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import CategoryColumn from './categorycolumn';
import TaskModal, { TaskData } from '../common/modal/taskmodal';
import DeleteModal from '../common/modal/deletemodal';
import { motion } from 'framer-motion';

interface Category {
    id: string;
    label: string;
}

export default function Board() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [activeTask, setActiveTask] = useState<TaskData | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<TaskData | null>(null);

    const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string>('');
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        setTasks(dummyTasks);
        setCategories(dummyCategories);
    }, []);

    const openAddTaskModal = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setActiveTask(null);
        setIsModalOpen(true);
    };

    const handleSaveTask = (task: TaskData) => {
        if (activeTask) {
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === task.id ? { ...task, categoryId: selectedCategory } : t
                )
            );
        } else {
            setTasks((prev) => [
                ...prev,
                { ...task, id: uuidv4(), categoryId: selectedCategory },
            ]);
        }
    };

    const handleEditTask = (task: TaskData) => {
        setActiveTask(task);
        setSelectedCategory(task.categoryId || '');
        setIsModalOpen(true);
    };

    const handleDeleteTask = (task: TaskData) => {
        setTaskToDelete(task);
        setIsDeleteTaskOpen(true);
    };

    const confirmDeleteTask = () => {
        if (taskToDelete) {
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === taskToDelete.id
                        ? { ...t, tag: 'Trash' as const, categoryId: null }
                        : t
                )
            );
            setIsDeleteTaskOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            const newId = `cat-${newCategoryName.toLowerCase().replace(/\s+/g, '-')}`;
            setCategories((prev) => [
                ...prev,
                { id: newId, label: newCategoryName.trim() },
            ]);
            setNewCategoryName('');
            setIsAddCategoryOpen(false);
        }
    };

    const handleDeleteCategory = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setIsDeleteCategoryOpen(true);
    };

    const confirmDeleteCategory = () => {
        if (categoryToDelete) {
            setTasks((prev) =>
                prev.map((t) =>
                    t.categoryId === categoryToDelete
                        ? { ...t, tag: 'Trash' as const, categoryId: null }
                        : t
                )
            );
            setCategories((prev) =>
                prev.filter((cat) => cat.id !== categoryToDelete)
            );
            setIsDeleteCategoryOpen(false);
            setCategoryToDelete('');
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const taskId = active.id;
        const targetCategoryId = over.id;

        // Cek apakah yang di-drag adalah task
        const isTask = tasks.some((t) => t.id === taskId);
        if (!isTask) return;

        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        categoryId: targetCategoryId,
                        tag:
                            targetCategoryId.includes('new')
                                ? 'New'
                                : targetCategoryId.includes('on')
                                    ? 'On Going'
                                    : targetCategoryId.includes('completed')
                                        ? 'Completed'
                                        : task.tag,
                    }
                    : task
            )
        );
    };

    const handleToggleSubtask = (taskId: string, subtaskId: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        subtasks: task.subtasks?.map((s) =>
                            s.id === subtaskId ? { ...s, completed: !s.completed } : s
                        ),
                    }
                    : task
            )
        );
    };

    return (
        <div className="bg-white dark:bg-gray-900 flex-1 overflow-x-auto">
            <div className="flex justify-between items-center mb-6">
                <motion.button
                    onClick={() => setIsAddCategoryOpen(true)}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl shadow hover:bg-gray-800 dark:hover:bg-gray-100 transition"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    + Add Category
                </motion.button>
            </div>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="flex gap-6 items-start min-w-fit pb-6">
                    <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                        {categories.map((category) => (
                            <CategoryColumn
                                key={category.id}
                                categoryId={category.id}
                                title={category.label}
                                tasks={tasks.filter((t) => t.categoryId === category.id)}
                                onAddTask={openAddTaskModal}
                                onEditTask={handleEditTask}
                                onDeleteTask={handleDeleteTask}
                                onDeleteCategory={handleDeleteCategory}
                                onToggleSubtask={handleToggleSubtask}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            {/* Modals */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                category={selectedCategory}
                taskToEdit={activeTask}
            />

            <DeleteModal
                isOpen={isDeleteTaskOpen}
                onClose={() => setIsDeleteTaskOpen(false)}
                onConfirm={confirmDeleteTask}
                title="Delete Task"
                description="Are you sure you want to delete this task? It will go to Trash."
            />

            <DeleteModal
                isOpen={isDeleteCategoryOpen}
                onClose={() => setIsDeleteCategoryOpen(false)}
                onConfirm={confirmDeleteCategory}
                title="Delete Category"
                description="All tasks inside this category will go to Trash. Are you sure?"
            />

            {isAddCategoryOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                            Add New Category
                        </h2>
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Category name"
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsAddCategoryOpen(false)}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

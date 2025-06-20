'use client';
import { AnimatePresence, motion } from 'framer-motion';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
}: DeleteModalProps) {
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
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-sm p-6 space-y-5"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                                {title}
                            </h2>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {description}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

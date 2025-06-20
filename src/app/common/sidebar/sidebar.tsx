'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaHome,
    FaTasks,
    FaCheckCircle,
    FaTrash,
    FaSun,
    FaMoon,
    FaBars,
} from 'react-icons/fa';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    const toggleDarkMode = () => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', next);
    };

    const menu = [
        { name: 'Home', icon: <FaHome />, href: '/' },
        { name: 'On Going', icon: <FaTasks />, href: '/ongoing' },
        { name: 'Completed', icon: <FaCheckCircle />, href: '/completed' },
        { name: 'Trash', icon: <FaTrash />, href: '/trash' },
    ];

    return (
        <motion.div
            animate={{ width: isOpen ? 240 : 72 }}
            className="h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 px-4 py-5 shadow-md flex flex-col transition-all duration-300"
        >
            {/* Top Header */}
            <div className="flex items-center justify-between mb-8">
                {isOpen && (
                    <h1 className="text-xl font-semibold tracking-wide text-gray-800 dark:text-white">
                        Skribbl
                    </h1>
                )}
                <button
                    onClick={toggleSidebar}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xl"
                >
                    <FaBars />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-grow">
                {menu.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${pathname === item.href
                                ? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white font-semibold'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        {item.icon}
                        {isOpen && <span>{item.name}</span>}
                    </Link>
                ))}
            </nav>

            {/* Toggle Dark Mode */}
            <button
                onClick={toggleDarkMode}
                className="mt-6 flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition"
            >
                {darkMode ? <FaSun /> : <FaMoon />}
                {isOpen && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
        </motion.div>
    );
}

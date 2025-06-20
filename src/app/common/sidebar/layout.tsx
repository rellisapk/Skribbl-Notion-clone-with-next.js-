import Sidebar from './sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 p-6 bg-white dark:bg-gray-900 overflow-y-auto transition">
                {children}
            </main>
        </div>
    );
}

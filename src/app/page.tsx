import Board from '@/app/component/board';

export default function HomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
          Hi Rileyy 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-base sm:text-lg">
          What are you going to do today?
        </p>
      </div>

      <Board />
    </div>
  );
}

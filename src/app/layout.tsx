import './globals.css';
import Layout from '@/app/common/sidebar/layout';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Skribbl',
  description: 'A Notion-style todo board app built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${inter.className} bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-300`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

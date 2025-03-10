import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <Header />
        <main className='container mx-auto p-10'>{children}</main>
        <footer className='text-gray-400 text-center text-xs py-5'>
          <p>
            Copywright &copy; {new Date().getFullYear()} - All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}

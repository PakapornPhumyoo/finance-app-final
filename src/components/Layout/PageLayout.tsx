// src/components/Layout/PageLayout.tsx
import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className={`flex-1 pt-16 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
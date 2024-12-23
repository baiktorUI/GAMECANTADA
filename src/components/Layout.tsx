import React from 'react';
import { gradients } from '../styles/gradients';

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div 
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: gradients.background }}
    >
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <img 
            src="https://images.unsplash.com/photo-1533794318766-897f4d50cb39?w=200&h=200&fit=crop&crop=center" 
            alt="Logo"
            className="w-32 h-32 rounded-full shadow-2xl"
          />
        </div>
        {children}
      </div>
    </div>
  );
}
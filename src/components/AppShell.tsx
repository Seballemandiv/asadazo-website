import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

const AppShell: React.FC<AppShellProps> = ({ children, className = '' }) => {
  return (
    <div className={`app-shell ${className}`}>
      <Header />
      <main className="app-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppShell;

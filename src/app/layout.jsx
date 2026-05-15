import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'DevHub Terminal — Developer Community Platform',
  description: 'Build, share, and connect. A terminal-aesthetic community platform for developers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#000',
                color: '#00ff41',
                border: '1px solid #00ff41',
                borderRadius: '0',
                fontSize: '12px',
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                boxShadow: '0 0 10px rgba(0,255,65,0.2)',
                padding: '8px 12px',
              },
              success: { iconTheme: { primary: '#00ff41', secondary: '#000' }, style: { borderColor: '#00ff41' } },
              error:   { iconTheme: { primary: '#ff0040', secondary: '#000' }, style: { borderColor: '#ff0040', color: '#ff0040' } },
            }}
          />
          <main className="min-h-screen pb-16">
            {children}
          </main>
          <Navbar />
        </AuthProvider>
      </body>
    </html>
  );
}

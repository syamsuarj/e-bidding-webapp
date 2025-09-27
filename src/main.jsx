import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import SignUp from './components/SignUp.jsx';
import Dashboard from './components/Dashboard.jsx';
import './index.css';

const resolveRoute = () => {
  const normalizedHash = window.location.hash.replace(/^#/, '');
  const normalizedPath = window.location.pathname.replace(/\/+$/, '');

  if (normalizedHash === '/signup' || normalizedPath.endsWith('/signup')) {
    return 'signup';
  }

  if (normalizedHash === '/dashboard' || normalizedPath.endsWith('/dashboard')) {
    return 'dashboard';
  }

  return 'home';
};

const AppRouter = () => {
  const [route, setRoute] = useState(resolveRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(resolveRoute());
    const handlePopState = () => setRoute(resolveRoute());

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (route === 'signup') {
    return <SignUp />;
  }

  if (route === 'dashboard') {
    return <Dashboard />;
  }

  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);

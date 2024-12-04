import React, { useEffect } from 'react';
import { Link, BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Callback from './components/Callback';
import { getAccessToken, redirectToLogin } from './services/authService';
import { UserProvider } from './contexts/UserContext';
import styles from './styles/App.module.css';
import { useUser } from './contexts/UserContext'


const LoginRoute: React.FC = () => {
  const token = getAccessToken();

  useEffect(() => {
    if (!token) {
      console.log("No access token found. Redirecting to login.");
      redirectToLogin();
    }
  }, [token]);

  if (!token) return null;

  return <Outlet />;
};

const AppContent: React.FC = () => {
  const { first_name, last_name, username } = useUser();
  useEffect(() => {
    
    if (window.location.href.includes("callback")) {
      console.log("Processing authentication callback.");
    }
    console.log("Mounting App");
    return () => console.log("App unmounted");

  }, []);
  const token = getAccessToken()
  const isLoggedIn = ( token && username )
  console.log("debug x", isLoggedIn, token, username, first_name, last_name  );

  return (
    <UserProvider>
      <Router>
        <div className={styles.appContainer}>
          <header className={styles.header}>
            <nav className={styles.nav}>
              <Link to="/">Home</Link>
              <Link to="/profile">Profile</Link>
            </nav>
            <div className={styles.logo}>React Cognito Example</div>
            {isLoggedIn && (
              <div className={styles.userDetails}>
                {first_name} {last_name || username }
              </div>
            )}
          </header>
          <main className={"mainContent"}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/callback" element={<Callback />} />
              <Route element={<LoginRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </main>
          <footer className={"footer"}>
            © {new Date().getFullYear()} MyApp. All rights reserved.
          </footer>
        </div>
      </Router>
    </UserProvider>
  );
};
const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;

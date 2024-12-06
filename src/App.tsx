import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Callback from './components/Callback';
import { getAccessToken, makeGetRequest, redirectToLogin } from './services/authService';
import { UserProvider, useUser } from './contexts/UserContext';
import styles from './styles/App.module.css';
import AppHeader from './AppHeader';


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

const App: React.FC = () => {
  useEffect(() => {
    
    if (window.location.href.includes("callback")) {
      console.log("Processing authentication callback.");
    }

  }, []);


  return (
    <UserProvider>
      <App2 />
   </UserProvider>
  );
};

const App2: React.FC = () => {
  const user = useUser()
  const user_str = JSON.stringify(user); // 
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // Simulate fetching user details if logged in
    if (token && !user.username) {
      const fetchProfile = async () => {
        try {
          const response = await makeGetRequest('api/v1/me/');
          user.setUsername(response.data.username);
          user.setfirst_name(response.data.first_name);
          user.setlast_name(response.data.last_name)
        } catch (error) {
          user.setfirst_name(""); // Replace with actual fetch call
          user.setlast_name("");   // Replace with actual fetch call
          user.setUsername(""); // Replace with actual fetch call
        }
      };
      fetchProfile();


    }
  }, [user, user_str]);
  return (

    <Router>
      <div className={styles.appContainer}>        
        <AppHeader />
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<Callback />} />
            <Route element={<LoginRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </main>
        <footer className={styles.footer}>
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </footer>
      </div>
    </Router>
)};

export default App;

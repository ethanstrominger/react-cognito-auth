import React, { useEffect } from 'react';
import { Link, BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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
    console.log("Mounting App");
    return () => console.log("App unmounted");

  }, []);


  return (
    <UserProvider>
      <App2 />
   </UserProvider>
  );
};

const App2: React.FC = () => {
  const { username, first_name, last_name, setUsername, setfirst_name, setlast_name } = useUser()
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // Simulate fetching user details if logged in
    if (token && !username) {
      const fetchProfile = async () => {
        try {
          console.log("setting first_name, last_name")
          const response = await makeGetRequest('api/v1/me/');
          setUsername(response.data.username);
          setfirst_name(response.data.first_name);
          console.log(username, first_name, last_name)
          setlast_name(response.data.last_name)
        } catch (error) {
          setfirst_name(""); // Replace with actual fetch call
          setlast_name("");   // Replace with actual fetch call
          setUsername(""); // Replace with actual fetch call
        }
      };
      fetchProfile();


    }
  }, [username, first_name, last_name, setfirst_name, setlast_name, setUsername]);
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

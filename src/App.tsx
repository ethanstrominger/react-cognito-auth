import React, { useEffect } from 'react';
import { Link, BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Callback from './components/Callback';
import { getAccessToken, redirectToLogin } from './services/authService';
import { UserProvider, useUser } from './contexts/UserContext';
import './styles/App.module.css';


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
  const { username, firstName, lastName } = useUser()
  return (

    <Router>
      <div className={"appContainer"}>        
        <header className={"header"}>
          <div className={"logo"}>MyApp {username} {firstName} {lastName}</div>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>
          </nav>
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
)};

export default App;

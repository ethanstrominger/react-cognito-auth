import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Home from './components/Home';
import Projects from './components/Projects';
import Callback from './components/Callback';
import { getAccessToken, redirectToLogin } from './services/authService';

const PrivateRoute = () => {
  const token = getAccessToken();
  console.log("Private route");
  if (!token) {
    console.log("Redirecting")
    redirectToLogin()
    return null
  }
  return <Outlet/ >
};


const App: React.FC = () => {
  useEffect(() => {
    if (window.location.href.includes("callback")) {
       console.log("Processing callback")
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/projects" element={<Projects />} />
        </Route>
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
};

export default App;

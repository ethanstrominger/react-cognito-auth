import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Projects from './components/Projects';
import Callback from './components/Callback';
import { getAccessToken, redirectToLogin } from './services/authService';


const App: React.FC = () => {
  useEffect(() => {
    const token = getAccessToken();
    console.log("Debug token app", token);
    console.log(window.location);
    if (window.location.href.includes("callback")) {
       console.log("Processing callback")
    } else {
      if (!token) {
        redirectToLogin(); // Redirect to Cognito login
      }
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';

const App = () => (
  <Router>
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<ProtectedRoute element={Chat} />} />
      <Route path="/" element={<Navigate to="/signup" />} />
    </Routes>
  </Router>
);

export default App;

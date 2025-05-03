import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Form from './pages/Form';

import Login from './pages/Login';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        //Проверка авторизован ли пользователь
        const storedAuth = localStorage.getItem('isAuthenticated');
        if (storedAuth) {
          setIsAuthenticated(true);
        }
      }, []);
    
      const handleLogin = () => {
        setIsAuthenticated(true);
      };
    
      const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
      };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/home" element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route path="/add" element={<Form />} />
            </Routes>
        </Router>
    );
};

export default App;
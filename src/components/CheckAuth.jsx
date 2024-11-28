// src/components/AuthCheck.jsx
import React, { useState, useEffect } from 'react';

const AuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/v1/users/auth", {
          credentials: 'include',
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div class="bg-white ">Verificando autenticación...</div>;
  }

  if (isAuthenticated) {
    return <div class="bg-green-200">¡Éxito! Estás autenticado.</div>;
  } else {
    return <div class="bg-blue-500">No estás autenticado. <a href="/login">Iniciar sesión</a></div>;
  }
};

export default AuthCheck;

// src/components/WelcomeMessage.jsx
import React, { useState, useEffect } from 'react';

const WelcomeMessage = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Obtener el nombre del usuario desde localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div>
      {userName ? (
        <h1>¡Bienvenido, {userName}!</h1>
      ) : (
        <h1>Bienvenido!</h1>
      )}
    </div>
  );
};

export default WelcomeMessage;

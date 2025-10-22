import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { initKeycloak, keycloak, getToken } from './services/KeycloakService';
import App from './App';

// Definimos el tipo para el estado 'authenticated'
const TestApp: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false); // El estado ahora tiene el tipo booleano

  useEffect(() => {
    // Inicializar Keycloak
    initKeycloak(setAuthenticated);
  }, []);

  // Si no está autenticado, redirige al login de Keycloak
  if (!authenticated) {
    return <div>Loading...</div>; // Puedes mostrar un "loading" mientras se autentica
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default TestApp;

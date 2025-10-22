import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { initKeycloak, logout, getUsername } from './services/KeycloakService';
import App from './App';

// Definimos los tipos de estado
interface AppState {
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

const TestApp: React.FC = () => {
  const [state, setState] = useState<AppState>({
    authenticated: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Inicializar Keycloak
    initKeycloak((authenticated: boolean) => {
      setState({
        authenticated,
        loading: false,
        error: null
      });
    }).catch((error) => {
      setState({
        authenticated: false,
        loading: false,
        error: 'Error al inicializar Keycloak: ' + error.message
      });
    });
  }, []);

  // Función para manejar el logout
  const handleLogout = () => {
    logout();
  };

  // Si hay un error, mostrarlo
  if (state.error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Error de Autenticación</h2>
        <p>{state.error}</p>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  // Si está cargando, mostrar loading
  if (state.loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Cargando...</h2>
        <p>Inicializando autenticación con Keycloak...</p>
      </div>
    );
  }

  // Si no está autenticado (esto no debería ocurrir con login-required)
  if (!state.authenticated) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>No Autenticado</h2>
        <p>Redirigiendo al login...</p>
      </div>
    );
  }

  // Si está autenticado, mostrar la aplicación
  return (
    <Router>
      <div>
        {/* Header con información del usuario */}
        <header style={{ 
          padding: '10px 20px', 
          backgroundColor: '#f5f5f5', 
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span>Bienvenido, {getUsername() || 'Usuario'}</span>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Rutas de la aplicación */}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default TestApp;

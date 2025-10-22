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

  // Si hay un error, mostrarlo con información detallada
  if (state.error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        margin: '20px',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h2 style={{ color: '#856404' }}>❌ Error de Autenticación con Keycloak</h2>
        <p style={{ color: '#856404', marginBottom: '20px' }}>{state.error}</p>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '5px', 
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <h4>🔍 Pasos para solucionar:</h4>
          <ol style={{ textAlign: 'left' }}>
            <li><strong>Verificar servidor Keycloak:</strong> Asegúrate de que Keycloak esté ejecutándose en <code>http://localhost:8080</code></li>
            <li><strong>Verificar realm:</strong> Confirma que el realm <code>Paradigmas</code> existe</li>
            <li><strong>Verificar cliente:</strong> Confirma que el cliente <code>dashboard</code> está configurado correctamente</li>
            <li><strong>URLs válidas:</strong> Verifica que las URLs de redirect incluyan <code>http://localhost:5174/*</code></li>
            <li><strong>Configuración CORS:</strong> Asegúrate de que Web Origins incluya <code>http://localhost:5174</code></li>
          </ol>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Reintentar
          </button>
          <button 
            onClick={() => console.log('Estado actual:', { state, currentUrl: window.location.href })}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔍 Ver logs en consola
          </button>
        </div>
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

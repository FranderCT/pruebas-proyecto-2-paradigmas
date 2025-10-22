import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getToken, getUserInfo, getUsername, getUserEmail, getUserRoles, isAuthenticated } from './services/KeycloakService'

function App() {
  const [count, setCount] = useState(0)
  const [showUserInfo, setShowUserInfo] = useState(false)

  const userInfo = getUserInfo()
  const token = getToken()

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Keycloak</h1>
      
      {/* Información de autenticación */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Estado de Autenticación</h3>
        <p>✅ Usuario autenticado: {isAuthenticated() ? 'Sí' : 'No'}</p>
        <p>👤 Usuario: {getUsername() || 'No disponible'}</p>
        <p>📧 Email: {getUserEmail() || 'No disponible'}</p>
        <p>🔑 Roles: {getUserRoles().length > 0 ? getUserRoles().join(', ') : 'Ninguno'}</p>
        
        <button 
          onClick={() => setShowUserInfo(!showUserInfo)}
          style={{ margin: '10px' }}
        >
          {showUserInfo ? 'Ocultar' : 'Mostrar'} información detallada
        </button>
        
        {showUserInfo && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '5px',
            textAlign: 'left'
          }}>
            <h4>Información del Token:</h4>
            <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify(userInfo, null, 2)}
            </pre>
            
            <h4 style={{ marginTop: '20px' }}>Token (primeros 50 caracteres):</h4>
            <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
              {token ? token.substring(0, 50) + '...' : 'No disponible'}
            </code>
          </div>
        )}
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

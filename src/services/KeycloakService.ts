// src/services/KeycloakService.ts
import Keycloak from 'keycloak-js';
import { keycloakConfig, keycloakConfigLegacy, keycloakInitOptions } from '../keycloak/keycloak.config';

// Variable para rastrear intentos de inicialización
let keycloak: Keycloak | null = null;
let initializationAttempts = 0;
const MAX_INIT_ATTEMPTS = 2;

// Función para crear instancia de Keycloak con configuración específica
const createKeycloakInstance = (config: any): Keycloak => {
  return new Keycloak(config);
};

// Función para inicializar Keycloak con manejo de errores mejorado
const initKeycloak = (onAuthenticated: (authenticated: boolean) => void): Promise<boolean> => {
  console.log('🔄 Iniciando proceso de autenticación con Keycloak...');
  
  // Intentar primero con la configuración moderna (Keycloak 17+)
  if (!keycloak) {
    keycloak = createKeycloakInstance(keycloakConfig);
    console.log('📡 Usando configuración Keycloak 17+ (sin /auth)');
  }

  return keycloak.init(keycloakInitOptions)
    .then((authenticated: boolean) => {
        console.log(authenticated ? '✅ Usuario autenticado exitosamente' : '❌ Usuario no autenticado');
        
        if (authenticated) {
          console.log('🔐 Token obtenido:', keycloak?.token?.substring(0, 20) + '...');
          
          // Configurar refresh automático del token
          const tokenRefreshInterval = setInterval(() => {
            if (keycloak) {
              keycloak.updateToken(70).then((refreshed: boolean) => {
                if (refreshed) {
                  console.log('🔄 Token renovado exitosamente');
                } else {
                  console.log('ℹ️ Token aún válido');
                }
              }).catch((error) => {
                console.error('❌ Error al renovar token:', error);
                clearInterval(tokenRefreshInterval);
                console.log('🚪 Cerrando sesión debido a error en renovación de token');
                keycloak?.logout();
              });
            }
          }, 60000); // Verificar cada minuto
        }
        
        onAuthenticated(authenticated);
        return authenticated;
    })
    .catch((err: any) => {
        console.error('❌ Error durante la inicialización de Keycloak:', err);
        
        // Si es el primer intento y falló, intentar con configuración legacy
        if (initializationAttempts < MAX_INIT_ATTEMPTS && err.error === 'invalid_request') {
          initializationAttempts++;
          console.log('🔄 Reintentando con configuración legacy (Keycloak < 17)...');
          
          keycloak = createKeycloakInstance(keycloakConfigLegacy);
          return initKeycloak(onAuthenticated);
        }
        
        // Proporcionar información detallada del error
        console.error('🔍 Detalles del error:', {
          error: err.error,
          error_description: err.error_description,
          message: err.message,
          config: keycloak?.authServerUrl || 'No disponible'
        });
        
        onAuthenticated(false);
        throw new Error(`Error de autenticación Keycloak: ${err.error || err.message}`);
    });
};

// Función para obtener el token de Keycloak
const getToken = (): string | undefined => {
    return keycloak?.token;
};

// Función para obtener el refresh token
const getRefreshToken = (): string | undefined => {
    return keycloak?.refreshToken;
};

// Función para verificar si el usuario está autenticado
const isAuthenticated = (): boolean => {
    return !!(keycloak?.authenticated);
};

// Función para obtener los roles del usuario
const getUserRoles = (): string[] => {
    if (keycloak?.tokenParsed && keycloak.tokenParsed.realm_access) {
        return keycloak.tokenParsed.realm_access.roles || [];
    }
    return [];
};

// Función para verificar si el usuario tiene un rol específico
const hasRole = (role: string): boolean => {
    return getUserRoles().includes(role);
};

// Función para cerrar sesión
const logout = (): void => {
    if (keycloak) {
        keycloak.logout({
            redirectUri: window.location.origin
        });
    } else {
        console.warn('⚠️ Keycloak no está inicializado, redirigiendo al inicio');
        window.location.href = window.location.origin;
    }
};

// Función para obtener información del usuario
const getUserInfo = (): any => {
    return keycloak?.tokenParsed;
};

// Función para obtener el nombre de usuario
const getUsername = (): string | undefined => {
    return keycloak?.tokenParsed?.preferred_username;
};

// Función para obtener el email del usuario
const getUserEmail = (): string | undefined => {
    return keycloak?.tokenParsed?.email;
};

// Función para renovar el token manualmente
const updateToken = (minValidity: number = 30): Promise<boolean> => {
    if (!keycloak) {
        return Promise.reject(new Error('Keycloak no está inicializado'));
    }
    return keycloak.updateToken(minValidity);
};

export { 
    keycloak, 
    initKeycloak, 
    getToken, 
    getRefreshToken,
    isAuthenticated,
    getUserRoles,
    hasRole,
    logout, 
    getUserInfo,
    getUsername,
    getUserEmail,
    updateToken
};

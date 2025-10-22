// src/services/KeycloakService.ts
import Keycloak from 'keycloak-js';
import { keycloakConfig, keycloakInitOptions } from '../keycloak/keycloak.config';

const keycloak = new Keycloak(keycloakConfig);

// Función para inicializar Keycloak
const initKeycloak = (onAuthenticated: (authenticated: boolean) => void): Promise<boolean> => {
  return keycloak.init(keycloakInitOptions)
    .then((authenticated: boolean) => {
        console.log(authenticated ? 'Usuario autenticado exitosamente' : 'Usuario no autenticado');
        
        // Configurar refresh automático del token
        if (authenticated) {
          setInterval(() => {
            keycloak.updateToken(70).then((refreshed: boolean) => {
              if (refreshed) {
                console.log('Token renovado exitosamente');
              }
            }).catch(() => {
              console.error('Error al renovar token');
              keycloak.logout();
            });
          }, 60000); // Verificar cada minuto
        }
        
        onAuthenticated(authenticated);
        return authenticated;
    })
    .catch((err: any) => {
        console.error('Error durante la inicialización de Keycloak:', err);
        onAuthenticated(false);
        throw err;
    });
};

// Función para obtener el token de Keycloak
const getToken = (): string | undefined => {
    return keycloak.token;
};

// Función para obtener el refresh token
const getRefreshToken = (): string | undefined => {
    return keycloak.refreshToken;
};

// Función para verificar si el usuario está autenticado
const isAuthenticated = (): boolean => {
    return !!keycloak.authenticated;
};

// Función para obtener los roles del usuario
const getUserRoles = (): string[] => {
    if (keycloak.tokenParsed && keycloak.tokenParsed.realm_access) {
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
    keycloak.logout({
        redirectUri: window.location.origin
    });
};

// Función para obtener información del usuario
const getUserInfo = (): any => {
    return keycloak.tokenParsed;
};

// Función para obtener el nombre de usuario
const getUsername = (): string | undefined => {
    return keycloak.tokenParsed?.preferred_username;
};

// Función para obtener el email del usuario
const getUserEmail = (): string | undefined => {
    return keycloak.tokenParsed?.email;
};

// Función para renovar el token manualmente
const updateToken = (minValidity: number = 30): Promise<boolean> => {
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

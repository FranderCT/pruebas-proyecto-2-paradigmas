// src/services/KeycloakService.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/realms/Paradigmas/account/', // URL de tu Keycloak (ajusta si es necesario)
  realm: 'Paradigmas',              // Nombre de tu realm en Keycloak
  clientId: 'dashboard',            // El Client ID configurado en Keycloak
});

// Función para inicializar Keycloak
const initKeycloak = (onAuthenticated: (authenticated: boolean) => void): void => {
  keycloak.init({ onLoad: 'login-required' }) // `login-required` fuerza a que el usuario se logee
    .then(authenticated => {
        console.log(authenticated ? 'Authenticated' : 'Not authenticated');
        onAuthenticated(authenticated);
    })
    .catch(err => {
        console.error('Error during Keycloak initialization', err);
    });
};

// Función para obtener el token de Keycloak
const getToken = () => {
    return keycloak.token;
};

// Función para cerrar sesión
const logout = () => {
    keycloak.logout();
};

// Función para obtener información del usuario
const getUserInfo = () => {
    return keycloak.tokenParsed;
};

export { keycloak, initKeycloak, getToken, logout, getUserInfo };

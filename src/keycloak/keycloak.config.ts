import Keycloak from 'keycloak-js';

// Configuración centralizada de Keycloak
export const keycloakConfig = {
  url: 'http://localhost:8080', // URL base del servidor Keycloak
  realm: 'Paradigmas', // El nombre de tu realm en Keycloak
  clientId: 'dashboard', // Tu Client ID en Keycloak
};

// Configuración de inicialización
export const keycloakInitOptions = {
  onLoad: 'login-required' as const, // Fuerza el login
  checkLoginIframe: false, // Desactiva iframe para evitar problemas CORS
  pkceMethod: 'S256' as const, // Usa PKCE para mayor seguridad
  enableLogging: true, // Habilita logging para debugging
};

// Instancia de Keycloak (opcional, ya que se usa en KeycloakService)
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

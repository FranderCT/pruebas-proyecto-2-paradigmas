import Keycloak from 'keycloak-js';

// Configuración centralizada de Keycloak
export const keycloakConfig = {
  // Intentar múltiples configuraciones comunes de Keycloak
  url: 'http://localhost:8080', // Para Keycloak 17+ (sin /auth)
  realm: 'Paradigmas',
  clientId: 'dashboard',
};

// Configuración alternativa para versiones anteriores de Keycloak
export const keycloakConfigLegacy = {
  url: 'http://localhost:8080/auth', // Para Keycloak < 17 (con /auth)
  realm: 'Paradigmas',
  clientId: 'dashboard',
};

// Configuración de inicialización optimizada para resolver errores 401
export const keycloakInitOptions = {
  onLoad: 'login-required' as const,
  checkLoginIframe: false, // Evita problemas de CORS y 401
  checkLoginIframeInterval: 5, // Reduce la frecuencia de verificación
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  pkceMethod: 'S256' as const, // PKCE para mayor seguridad
  enableLogging: true,
  // Configuraciones adicionales para evitar errores 401
  flow: 'standard' as const,
  responseMode: 'fragment' as const,
  redirectUri: window.location.origin,
};

// Instancia de Keycloak (opcional, ya que se usa en KeycloakService)
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

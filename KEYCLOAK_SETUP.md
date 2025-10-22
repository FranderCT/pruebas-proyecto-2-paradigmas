# Configuración de Keycloak

Este documento describe cómo configurar Keycloak para que funcione con la aplicación React.

## Requisitos Previos

1. **Keycloak Server**: Asegúrate de tener Keycloak ejecutándose en `http://localhost:8080`
2. **Realm**: Crear un realm llamado `Paradigmas`
3. **Client**: Crear un cliente llamado `dashboard`

## Configuración del Servidor Keycloak

### 1. Ejecutar Keycloak

```bash
# Descargar Keycloak (si no lo tienes)
# https://www.keycloak.org/downloads

# Ejecutar Keycloak en modo desarrollo
./bin/kc.sh start-dev
```

### 2. Acceder a la Consola de Administración

- URL: `http://localhost:8080/admin`
- Crear usuario administrador si es la primera vez

### 3. Crear Realm

1. En la consola de administración, crear un nuevo realm llamado `Paradigmas`
2. Guardar la configuración

### 4. Configurar Cliente

1. Ir a **Clients** > **Create client**
2. Configurar:
   - **Client ID**: `dashboard`
   - **Client type**: `OpenID Connect`
   - **Client authentication**: `Off` (público)
   - **Valid redirect URIs**: `http://localhost:5173/*`
   - **Valid post logout redirect URIs**: `http://localhost:5173`
   - **Web origins**: `http://localhost:5173`

### 5. Configuración Avanzada del Cliente

En la pestaña **Settings** del cliente:
- **Access Type**: `public`
- **Standard Flow Enabled**: `On`
- **Direct Access Grants Enabled**: `On`
- **Valid Redirect URIs**: `http://localhost:5173/*`
- **Web Origins**: `http://localhost:5173`

### 6. Crear Usuario de Prueba

1. Ir a **Users** > **Create new user**
2. Completar información básica
3. En la pestaña **Credentials**, establecer una contraseña
4. Marcar **Temporary** como `Off`

## Configuración de la Aplicación

### Archivos de Configuración

La configuración se encuentra en:
- `src/keycloak/keycloak.config.ts` - Configuración principal
- `src/services/KeycloakService.ts` - Servicio de autenticación

### Variables de Configuración

```typescript
export const keycloakConfig = {
  url: 'http://localhost:8080', // URL del servidor Keycloak
  realm: 'Paradigmas',          // Nombre del realm
  clientId: 'dashboard',        // ID del cliente
};
```

## Funcionalidades Implementadas

### Autenticación
- Login automático (redirect a Keycloak si no está autenticado)
- Logout con redirect
- Renovación automática de tokens

### Información del Usuario
- Obtener información del token JWT
- Acceso a roles del usuario
- Username y email

### Seguridad
- PKCE habilitado para mayor seguridad
- Renovación automática de tokens cada minuto
- Logout automático si falla la renovación

## Troubleshooting

### Error 401 (Unauthorized) - Problema Común
Este error indica problemas de autenticación. Sigue estos pasos:

1. **Verificar configuración del cliente en Keycloak:**
   ```
   - Client ID: dashboard
   - Client type: OpenID Connect
   - Client authentication: OFF (público)
   - Valid redirect URIs: http://localhost:5174/*
   - Valid post logout redirect URIs: http://localhost:5174
   - Web origins: http://localhost:5174
   ```

2. **Verificar URLs en la aplicación:**
   - La aplicación detecta automáticamente si es Keycloak 17+ (sin `/auth`) o versiones anteriores (con `/auth`)
   - URLs probadas automáticamente:
     - `http://localhost:8080` (Keycloak 17+)
     - `http://localhost:8080/auth` (Keycloak < 17)

3. **Verificar puerto de la aplicación:**
   - Si Vite usa puerto 5174 en lugar de 5173, actualiza las URLs en Keycloak
   - Valid redirect URIs: `http://localhost:5174/*`
   - Web origins: `http://localhost:5174`

### Error de CORS
Si encuentras errores de CORS, verifica:
1. **Web Origins** en la configuración del cliente debe incluir `http://localhost:5174`
2. **Valid Redirect URIs** debe incluir `http://localhost:5174/*`
3. Reinicia Keycloak después de cambios de configuración

### Error de Conexión
Si no puede conectar a Keycloak:
1. Verifica que Keycloak esté ejecutándose: `http://localhost:8080`
2. Verifica que el realm `Paradigmas` existe
3. Intenta acceder manualmente a: `http://localhost:8080/realms/Paradigmas`

### Error de Token
Si hay problemas con tokens:
1. Verifica que el cliente es de tipo `public`
2. Verifica que **Standard Flow Enabled** está activado
3. Verifica que **Direct Access Grants Enabled** está activado
4. Revisa los logs detallados en la consola del navegador

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar aplicación en desarrollo
npm run dev

# Verificar tipos TypeScript
npx tsc --noEmit
```

## URLs Importantes

- **Keycloak Admin**: `http://localhost:8080/admin`
- **Keycloak Realm**: `http://localhost:8080/realms/Paradigmas`
- **Aplicación**: `http://localhost:5173`

## Estructura de Archivos

```
src/
├── keycloak/
│   └── keycloak.config.ts      # Configuración de Keycloak
├── services/
│   └── KeycloakService.ts      # Servicio de autenticación
├── PruebaKeycloak.tsx          # Componente principal con autenticación
└── App.tsx                     # Aplicación principal
```
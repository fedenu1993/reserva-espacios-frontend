Este es un proyecto Angular que permite gestionar reservas. Esta guía te ayudará a configurar y ejecutar la aplicación Angular desde cero.

<!-- Requisitos Previos -->
Asegúrate de tener instalados los siguientes programas en tu máquina:

    Node.js (versión >= 14)
    Angular CLI (instalado globalmente)

<!-- Instalación de Dependencias -->
Ejecuta el siguiente comando para instalar las dependencias:

    npm install

<!-- Configuración del Entorno -->
Configura la URL del backend en el archivo src/environments/environment.ts. Asegúrate de que tenga el siguiente contenido:

    export const environment = {
        production: false,
        apiUrl: 'http://localhost:8000/api' // Cambia esto si tu API está en otra dirección
    };

<!-- Ejecución de la Aplicación -->
Ejecuta el siguiente comando para iniciar la aplicación:

    ng serve

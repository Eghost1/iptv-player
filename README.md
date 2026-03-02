# IPTV Player Web App

Esta es una aplicación web simple para reproducir canales de televisión en vivo (IPTV). Está diseñada para funcionar puramente con tecnologías frontend (HTML, CSS y JavaScript) permitiendo su fácil alojamiento en cualquier servidor web estático como GitHub Pages.

## Características

*   Reproductor de canales en vivo a través de iframes o tecnologías compatibles (como M3U8 si está implementado con librerías intermedias de vídeo).
*   Interfaz moderna y responsiva.
*   Totalmente funcional y probada localmente.

## Estructura del Proyecto

*   `index.html`: La página principal de la aplicación donde ocurre la mayoría de la magia visual.
*   `style.css`: La hoja de estilo principal, contiene todos los detalles visuales de la aplicación.
*   `main.js`: Lógica del lado del cliente para manejar la interacción del usuario y la reproducción del contenido.
*   `libre_home.html` / `libre_agenda.html`: Otras vistas relacionadas a las funciones de "librefutbol".
*   `package.json` / `package-lock.json`: Indica que hay dependencias, posiblemente para un servidor de desarrollo local o linting. 

## Desarrollo Local

Dado que utiliza componentes estáticos, puedes abrir el archivo `index.html` directamente en tu navegador. Si deseas usar las dependencias o el entorno configurado:

1.  Asegúrate de tener Node.js instalado.
2.  Ejecuta `npm install` en la raíz del proyecto para instalar las dependencias (si hay alguna herramienta de desarrollo configurada).
3.  Usa herramientas como `Live Server` de VS Code, o un servidor local como `http-server` para probar la aplicación y evitar posibles restricciones de políticas de CORS del navegador al abrir archivos locales directamente.

## Despliegue en GitHub Pages

Este proyecto está listo para ser desplegado en GitHub Pages.

1.  Inicializa un repositorio Git (si aún no lo has hecho): `git init`
2.  Añade todos los archivos: `git add .`
3.  Haz tu primer commit: `git commit -m "Inicializando proyecto web de IPTV"`
4.  Crea un nuevo repositorio en GitHub.
5.  Sigue las instrucciones en GitHub para añadir el `remote` y hacer `git push -u origin main`.
6.  Ve a la sección `Settings` > `Pages` de tu repositorio en GitHub y selecciona la rama `main` en la opción "Source" y la carpeta "/ (root)". Guarda y espera un momento a que esté publicado.

### Consideraciones al Desplegar

*   **Fuentes Mixtas (Mixed Content):** Si tu página se aloja en `https://` (como en GitHub Pages), el navegador bloqueará iframes o peticiones a orígenes `http://` por razones de seguridad. Asegúrate de que todas tus fuentes de canales usen `https://`.
*   **Políticas CORS:** Puedes encontrarte con que algunos canales prohíban ser mostrados fuera de su sitio original mediante las cabeceras `X-Frame-Options` o configuraciones CORS restrictivas. Esta aplicación no puede saltarse estas restricciones puramente del lado del cliente, es una limitación esperada.

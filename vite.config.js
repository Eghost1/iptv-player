import { defineConfig } from 'vite';

export default defineConfig({
    // Esto hace que las rutas a los archivos CSS y JS sean relativas al index.html
    // Esencial para que funcione correctamente en GitHub Pages u otros subdirectorios.
    base: './',
});

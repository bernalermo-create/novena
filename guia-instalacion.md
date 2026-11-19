# Juegos de la Novena: guía de instalación

Este paquete tiene tres juegos (rompecabezas, Atrapa la natilla y La culebrita buñuelera), una página de inicio y una tabla de clasificación automática. Los juegos se publican gratis en **GitHub Pages** y los resultados se guardan en una **hoja de Google Sheets** tuya.

Tiempo aproximado: 20 minutos. Es más cómodo hacerlo desde un computador.

## Qué hay en el paquete

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página de inicio con los tres juegos |
| `rompecabezas.html`, `natilla.html`, `culebrita.html` | Los juegos |
| `clasificacion.html` | Tabla de clasificación (se actualiza sola) |
| `config.js` | Aquí se pega la dirección del script de Google |
| `marcador.js`, `estilo.css` | Archivos de apoyo (no hay que tocarlos) |
| `Code.gs` | Código para pegar en Google Apps Script (no se sube a GitHub) |

## Paso 1. Crear la hoja de resultados en Google

1. Entra a [sheets.google.com](https://sheets.google.com) y crea una hoja en blanco. Ponle un nombre, por ejemplo **Resultados Novena**.
2. En el menú, abre **Extensiones → Apps Script**.
3. Borra todo lo que aparece en el editor y pega el contenido completo del archivo `Code.gs`.
4. Guarda con el ícono del disquete.
5. Arriba a la derecha toca **Implementar → Nueva implementación**.
6. En el engranaje de **Seleccionar tipo**, elige **Aplicación web** y configura:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier usuario
7. Toca **Implementar** y luego **Autorizar acceso** con tu cuenta de Google.
   - Google mostrará un aviso de que la app no está verificada. Es normal porque el script es tuyo: toca **Configuración avanzada** y luego **Ir a … (no seguro)** y **Permitir**.
8. Copia la **URL de la aplicación web**. Termina en `/exec`. La necesitas en el paso 3.

> Si más adelante cambias el código del script, debes ir a **Implementar → Gestionar implementaciones**, editar (lápiz), elegir **Nueva versión** e implementar otra vez. La URL no cambia.

## Paso 2. Subir los juegos a GitHub

1. Crea una cuenta gratuita en [github.com](https://github.com) si no tienes.
2. Toca **+ → New repository**.
   - **Repository name:** `novena`
   - Déjalo como **Public**.
   - Toca **Create repository**.
3. En la página del repositorio toca **uploading an existing file** (o **Add file → Upload files**).
4. Descomprime el paquete y arrastra **todos los archivos excepto `Code.gs`**. Toca **Commit changes**.
5. Ve a **Settings → Pages**. En **Branch** elige **main** y la carpeta **/ (root)**. Toca **Save**.
6. Espera uno o dos minutos y recarga esa página. Aparecerá la dirección de tus juegos, parecida a:
   `https://tuusuario.github.io/novena/`

## Paso 3. Conectar los juegos con la hoja

1. En tu repositorio de GitHub abre el archivo `config.js` y toca el lápiz (**Edit this file**).
2. Pega la URL del paso 1 entre las comillas, así:
   ```js
   urlScript: "https://script.google.com/macros/s/XXXXXXXX/exec"
   ```
3. Toca **Commit changes**. En un minuto los juegos quedan conectados.

## Paso 4. Probar

1. Abre tu dirección de GitHub Pages, juega una partida corta y revisa que al final diga **"Tu resultado quedó en la tabla de clasificación"**.
2. Revisa que aparezca una fila nueva en la pestaña **Resultados** de tu hoja de Google.
3. Abre la tabla de clasificación y confirma que salga tu nombre.
4. Antes de la novena, **borra las filas de prueba** en la hoja (deja la fila de títulos).

## Durante la novena

- Comparte solo la dirección principal (`https://tuusuario.github.io/novena/`): desde ahí se llega a los tres juegos y a la clasificación.
- Proyecta la tabla de clasificación: se actualiza sola cada 20 segundos.
- Cada participante puede jugar varias veces; la tabla muestra **su mejor resultado** en cada juego. Si quieres que cuente solo el primer intento, borra los intentos posteriores en la hoja.
- La tabla agrupa por nombre: pide que todos escriban su nombre siempre igual. Con estudiantes, es mejor usar el primer nombre y el curso (por ejemplo "Laura 10A") o el nombre de la familia, en lugar del nombre completo.
- Si alguien envía un resultado falso, borra esa fila en la hoja y desaparece de la tabla.
- Para empezar una competencia nueva, borra todas las filas de resultados (menos los títulos).
- Las capturas de pantalla siguen sirviendo como respaldo si alguien tiene problemas de conexión.

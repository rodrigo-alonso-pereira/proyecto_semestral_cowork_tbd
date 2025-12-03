# Frontend – Cowork App

Este proyecto corresponde al **frontend** de la aplicación de gestión de reservas del cowork.

---

## ✅ Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión recomendada: 18 o superior)
- **npm** (se instala junto con Node)

Puedes verificar las versiones con:

```bash
node -v
npm -v
```

---

## 📥 Instalación

1. Clona el repositorio (si aún no lo tienes):

```bash
git clone <URL_DEL_REPOSITORIO>
```

2. Entra a la carpeta del frontend (ajusta el nombre según tu estructura):

```bash
cd cowork-app_frontend
```

3. Instala las dependencias del proyecto:

```bash
npm install
```

Este comando descargará todas las librerías necesarias usando el archivo `package.json`.

---

## 🔗 Configuración de la conexión al backend

El frontend se comunica con el backend mediante Axios, configurado en el archivo:

`src/services/api.js`

Ahí encontrarás algo similar a:

```js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8060/api/v1",
});

export default api;
```

Por defecto, el frontend espera que el backend esté disponible en:

- `http://localhost:8060/api/v1`

Si el backend se ejecuta en otra URL o puerto, debes actualizar la propiedad `baseURL` con la dirección correcta.

Ejemplos:

```js
// Si el backend corre en otro puerto
baseURL: "http://localhost:8080/api/v1"

// Si corre en otra máquina de la red
baseURL: "http://192.168.0.10:8060/api/v1"
```

---

## ▶️ Ejecutar el frontend en modo desarrollo

Con las dependencias instaladas y el backend en funcionamiento, ejecuta:

```bash
npm start
```

Esto:

- Levantará la aplicación en modo desarrollo.
- Abrirá (o podrás abrir) el navegador en:

  - `http://localhost:3000`

Cada vez que modifiques el código, la página se recargará automáticamente.

> ⚠️ Importante: si ya hay otra aplicación usando el puerto 3000, Create React App te preguntará si quieres usar otro puerto. Puedes aceptar escribiendo `Y` y presionando **Enter**.


## 📝 Notas finales

- Verifica siempre que el backend esté corriendo y que la URL en `src/services/api.js` sea la correcta.


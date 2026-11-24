# Campus Académico

Prototipo de sistema académico universitario desarrollado en React. La aplicación funciona completamente en el navegador con datos de demostración: no necesita backend, base de datos ni servicios externos.

La carpeta del proyecto y el repositorio local se llaman **`sistema-academico`**. Puedes usar ese nombre al crear el repositorio remoto.

## Requisitos

- Node.js 20.19 o superior, o 22.12 o superior.
- npm (incluido con Node.js).
- Un navegador moderno.

El requisito de Node corresponde a la versión de Vite utilizada. Consulta la [guía oficial de Vite](https://vite.dev/guide/) si necesitas instalar o actualizar Node.js.

## Instalación y ejecución

1. Abre una terminal en la carpeta `sistema-academico`.
2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Inicia el servidor local:

   ```sh
   npm run dev
   ```

4. Abre la dirección que muestre Vite en la terminal. Por defecto es `http://localhost:5173`.

Para generar y revisar la versión de producción local:

```sh
npm run build
npm run preview
```

## Ejecutar con Docker

Necesitas Docker Desktop, o Docker Engine con el plugin de Docker Compose.

Desde la carpeta `sistema-academico`, construye la imagen y levanta el contenedor:

```sh
docker compose up --build -d
```

Abre `http://localhost:8080`. Docker construye los recursos estáticos de React en una etapa Node y Nginx los sirve en la etapa final; no hay un servicio backend.

Comandos útiles:

```sh
docker compose ps
docker compose logs -f campus-academico
docker compose down
```

El puerto del equipo es `8080` por defecto. Para usar otro, por ejemplo `8081`:

```sh
APP_PORT=8081 docker compose up --build -d
```

El `.env` se lee al construir la imagen porque las variables `VITE_` se incorporan a los archivos frontend durante la compilación. Si cambias esos valores, vuelve a construir con `docker compose up --build -d`. La sesión y los datos de prueba continúan guardándose en el `localStorage` de cada navegador.

## Perfiles de demostración

En la pantalla de inicio se puede seleccionar uno de los perfiles. La contraseña para todos es `demo123`.

| Perfil | Correo | Acceso principal |
|---|---|---|
| Administrador | `alejandro@demo.edu` | Directorio, oferta académica y reportes institucionales |
| Coordinador | `diana@demo.edu` | Carga académica, microcurrículos y seguimiento del programa |
| Docente | `carolina@demo.edu` | Calificaciones, asistencia, plan de clase y horario |
| Estudiante | `valentina@demo.edu` | Horario, notas, asistencias y plan curricular |

Los perfiles de la pantalla inicial permiten elegir el espacio que quieres consultar; después selecciona **Entrar al campus**. El formulario también admite la contraseña de demostración `demo123`.

## Funcionalidades incluidas

### Administrador

- Crear y editar cuentas de administradores, coordinadores, docentes y estudiantes.
- Buscar y filtrar el directorio por rol; activar o desactivar cuentas.
- Gestionar facultades, programas, materias y aulas.
- Consultar indicadores institucionales y descargar reportes CSV.

### Coordinador

- Crear y editar la carga académica por programa, materia, docente, aula, grupo, día, hora y periodo.
- Inscribir estudiantes en los grupos.
- Validar que un docente o un aula no tenga cruces de horario en el mismo periodo.
- Crear y editar microcurrículos, objetivos y competencias específicas.
- Crear planes de ejecución por periodo y consultar el avance semanal que reportan los docentes.

### Docente

- Consultar los grupos y horarios asignados.
- Registrar las notas de los tres parciales en escala de 0.0 a 5.0.
- Abrir sesiones de asistencia, editar los estados de la lista y cerrar sesiones.
- Simular marcaciones de un sensor asociado al aula.
- Actualizar temas y observaciones del plan microcurricular semana a semana.

### Estudiante

- Consultar el horario que se deriva de sus grupos inscritos.
- Revisar las notas registradas por asignatura y parcial.
- Consultar el historial de asistencia y el avance de sus planes curriculares.

### Datos y reportes

- Descargar directorios, horarios, calificaciones, listas de asistencia e informes de grupos en formato CSV.
- Los datos iniciales representan una institución, dos facultades, programas, materias, docentes, estudiantes y sesiones de ejemplo.
- Las modificaciones se guardan en el `localStorage` del navegador actual y siguen disponibles al volver a abrir el sitio en ese navegador.

## Variables de entorno

El proyecto incluye los archivos `.env` y `.env.example` para que se pueda ejecutar sin configuración adicional. Ambos contienen solo opciones públicas de presentación:

| Variable | Uso | Valor incluido |
|---|---|---|
| `VITE_APP_NAME` | Nombre del producto mostrado en la interfaz | `Campus Académico` |
| `VITE_INSTITUTION_NAME` | Nombre de la institución de ejemplo | `Universidad del Caribe` |
| `VITE_DEMO_MODE` | Indica que el proyecto usa datos de demostración | `true` |
| `VITE_DEFAULT_PERIOD` | Periodo académico inicial | `2026-2` |

No hay claves, contraseñas de servicios ni credenciales privadas en estos archivos. En Vite, las variables con prefijo `VITE_` se incorporan al código del navegador; por eso no deben contener secretos. Si el profesor recibe esta carpeta, el `.env` incluido permite arrancar la demo directamente. Para personalizar el entorno se puede editar `.env` antes de iniciar `npm run dev`.

## Persistencia y restablecimiento de la demo

La sesión y los registros creados o editados se almacenan en el navegador, no en un servidor. Para volver a los datos iniciales, borra los datos del sitio `localhost:5173` desde la configuración del navegador. También puedes ejecutar en la consola del navegador:

```js
localStorage.removeItem('campus-academico.data')
localStorage.removeItem('campus-academico.session')
location.reload()
```

Cada navegador y equipo mantiene una copia independiente.

## Alcance y decisiones de la demo

El prototipo cubre la gestión de personas y oferta académica, microcurrículos y competencias, carga académica, horarios, calificaciones de tres parciales y asistencia por sesión. Los datos de puntaje ICFES y clasificación SISBEN son campos simulados; no se realizan consultas a esos servicios. La marcación del sensor también es simulada y no se comunica con hardware.

El promedio de notas que aparece en pantalla es la media simple de los parciales que ya tienen calificación. Los documentos del proyecto no especifican ponderaciones, así que la demo no presenta ese promedio como una nota final oficial. La asistencia es informativa y no bloquea el acceso a clases.

No forman parte del alcance de esta demo: cartera, facturación, recaudo de matrícula, nómina, biblioteca, bienestar universitario, aula virtual, expedición de títulos ni reportes oficiales a sistemas externos.

## Estructura del proyecto

```text
.
├── .env                     # Configuración pública incluida para la demo
├── .env.example             # Plantilla de configuración
├── .dockerignore            # Archivos excluidos del contexto Docker
├── Dockerfile               # Compilación React y servidor Nginx
├── compose.yaml             # Servicio local de Docker Compose
├── index.html               # Entrada de Vite
├── nginx.conf               # Fallback SPA y endpoint de salud
├── package.json             # Dependencias y comandos
├── vite.config.js           # Configuración de Vite y React
├── src/
│   ├── App.jsx               # Navegación y perfiles
│   ├── main.jsx              # Punto de entrada de React
│   ├── styles.css            # Diseño adaptable
│   ├── context/              # Estado local, sesión y persistencia
│   ├── data/seed.js           # Datos iniciales de ejemplo
│   ├── components/           # Navegación y componentes de interfaz
│   ├── pages/                # Módulos funcionales por rol
│   └── utils.js              # Formatos, promedios y descarga CSV
└── docs/                     # Enunciado y diagramas de análisis y diseño
```

## Relación con los documentos del proyecto

La implementación toma como referencia el enunciado y los diagramas incluidos en `docs/`: `enunciado-proyecto-final.pdf`, `diagrama-de-contexto.pdf` y `diagrama-de-clases.pdf`. Conserva los cuatro perfiles, las entidades académicas, los tres parciales, los planes microcurriculares y el registro de asistencia. Las integraciones que el análisis ubica fuera del sistema se muestran como simulaciones locales, sin conectarse a ICFES, SISBEN ni a sensores reales.

## Publicar en un remoto Git

Este directorio ya está inicializado como repositorio local con la rama `main`. Para conectarlo a un repositorio que crees en GitHub, GitLab u otro proveedor, configura su URL y publica la rama:

```sh
git remote add origin <URL_DEL_REPOSITORIO>
git add .
git commit -m "feat: sistema academico en React"
git push -u origin main
```

El `.env` de esta demo se conserva en el proyecto porque solo contiene opciones públicas de presentación. No agregues secretos a variables `VITE_`; el navegador las puede leer.

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm install` | Instala las dependencias |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la carpeta `dist/` para producción |
| `npm run preview` | Sirve localmente la última compilación |

1. El servidor y la base de datos ya estan activos y alojados en la nube en Render. Los cambios más recientes ya están reflejados en los enlaces desplegados.

URL del sistema: (Ingresar desde el enlace desplegado o abriendo el Frontend con Live Server).

Credenciales de Administrador para pruebas:

Usuario: admin
Contraseña: 123

2. Flujo de Prueba del Sistema
Para validar la lógica y los permisos implementados, sigue este flujo:

Registro de Usuario: Al registrar un nuevo usuario desde la plataforma, este se asignará de manera predeterminada y única al grupo Consulta (acceso de solo lectura).

Asignación de Permisos: Para otorgarle un rol con mayores privilegios (como Administrador o Registrador_Iglesias), debes iniciar sesión con la cuenta admin y cambiar su grupo desde el panel de control.

Registro y Visibilidad de Iglesias: Al crear una nueva iglesia, su estado inicial será Oculto por defecto. Para que aparezca reflejada en el mapa o índice inicial, entra al panel como admin y marca la casilla de Visible.

3. Modo Pruebas (Sin entorno local)
Si únicamente vas a probar el flujo de la aplicación o la interfaz web:

No necesitas ejecutar npm install ni activar el backend, ya que las peticiones se realizan directamente a la base de datos y servidor en la nube.

Abre la carpeta del Frontend en VS Code e inicia el archivo index.html mediante Live Server (o ábrelo directamente en tu navegador).


ESTO UNICAMENTE SI MODIFICARAS EL ARCHIVO LOCAL, RECOMENDADO NO MODIFIQUEN LA BASE DE DATOS DE RENDER A MENOS DE INSERTAR DATOS VALIDOS PARA EL PROYECTO
4. Modo Desarrollo (Pruebas y cambios en Local)
Si vas a realizar modificaciones en el código del servidor o probar configuraciones en tu equipo:

Accede a la carpeta del backend:

Bash
cd Back-end
Instala las dependencias necesarias:

Bash
npm install
Configura el entorno local (.env):
Crea un archivo llamado .env dentro de la carpeta Back-end con los siguientes valores:

Fragmento de código
PORT=8010
DB_USER=postgres
DB_PASSWORD=tu_contraseña_local
DB_NAME=iglesias_antigua
DB_HOST=127.0.0.1
DB_PORT=5432
JWT_SECRET=una_clave_super_secreta_y_larga_12345
(Nota: Asegúrate de no tener creada previamente la base de datos iglesias_antigua en tu cliente de PostgreSQL).

Crea la base de datos local:

Bash
npx sequelize-cli db:create
Construye las tablas con las migraciones:

Bash
npx sequelize-cli db:migrate
Poblar datos iniciales:
Ejecuta el archivo .sql ubicado dentro de la carpeta Back-end/sql/ en tu base de datos PostgreSQL local. Este archivo insertará los registros iniciales requeridos de grupos, permisos y grupos_permisos.

Inicia el servidor en modo desarrollo:

Bash
npm run dev 
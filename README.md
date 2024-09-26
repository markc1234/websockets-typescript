# Proyecto websocket - typescript

El objetivo de este proyecto es crear un websocket server que atienda multiples websockets clients y permita la comunicacion en tiempo real entre varias maquinas. Ademas, este websocket server se conecta y comunica con un server TCP.

## dev (server y client)

1. Clonar el repositorio
2. En el archivo src/app.ts (linea 20) establecer la direccion ip donde se esta ejecutando el servidor TCP.
3. [OPCIONAL] Se puede modificar a preferencia el puerto y el header (linea 12 y 17).
4. Ejecutar el comando `npm install` para instalar dependencias.
5. Ejecutar `npm run dev` para ejecutar el servidor websocket.
6. Abrir dos o mas terminales en la carpeta del proyecto y ejecutar `npx http-server -o`, que abre un servidor HTTP local y el navegador para los clientes.
7. Cuando se abra el navegador, enviar mensajes desde los diferentes clientes.

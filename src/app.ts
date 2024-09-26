import net from "net"
import { WebSocketServer, WebSocket } from 'ws';

const port = 3000

// servidor websocket escuchando en el puerto 3000
const wss = new WebSocketServer({ port });

// funcion para enviar datos al servidor TCP
function sendToTcpServer(data: string) {
    // tamaño del encabezado para enviar la longitud del mensaje
    const HEADER = 64

    // codificación de texto del mensaje
    const FORMAT = "utf-8"

    const SERVER_PORT = 5001

    // ACA va la direccion ip del servidor
    const SERVER_IP = "DIR-IP-SERVIDOR"

    // cliente que se conecta al servidor TCP 
    const tcpClient = new net.Socket()

    // conectarse al servior TCP en el puerto y direccion especificadas
    tcpClient.connect(SERVER_PORT, SERVER_IP, () => {
        console.log("Conectado al servidor TCP en el puerto 5001")
    
        // convierto el mensaje a formato UTF-8
        const message = Buffer.from(data, FORMAT)
    
        // calcula el tamaño del mensaje en bytes
        const msgLength = message.length.toString()

        // rellena el tamaño del mensaje a 64 bytes usando espacios
        const paddedLength = msgLength.padEnd(HEADER, ' ');

        // se envia primero el tamaño del mensaje
        tcpClient.write(paddedLength,(err) => {
            if(err) {
                console.error(`Error al enviar el tamaño del mensaje al servidor TCP: ${err}`)
            } else {
                console.log(`Tamaño del mensaje enviado al servidor TCP: ${msgLength}`)
            }
        })

        // luego se envia el mensaje
        tcpClient.write(message, (err) => {
            if(err) {
                console.error(`Error al enviar el mensaje al servidor TCP: ${err}`)
            } else {
                console.log(`Mensaje enviado al servidor TCP: ${data}`)
            }

            // se cierra la conexion una vez que el mensaje se envio
            tcpClient.end(() => {
                console.log(`Conexion cerrada con el servidor TCP`)
            })
        })

    })

    // imprime los errores en la conexion
    tcpClient.on("error", console.error)

}


// se activa cuando un cliente se conecta, mantiene la conexion con el cliente
wss.on('connection', function connection(ws) {

    console.log("Client connected")

    // imprime los errores en la conexion
    ws.on('error', console.error);

    // servidor escucha los mensajes de los clientes y los retransmite a otros clientes y al servidor TCP
    ws.on('message', function message(data) {

        // enviar la data al servidor TCP
        sendToTcpServer(data.toString());

        // enviar la data al cliente, serializacion
        const payload = JSON.stringify({
            type: "custom-message",
            payload: data.toString(),
        })
        
        // ws.send(JSON.stringify(payload))

        // DIFUSION de mensajes a TODOS los clientes
        // wss.clients.forEach(function each(client) {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(payload, { binary: false });
        //     }
        // });

        // DIFUSION de mensajes a todos menos el emisor
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(payload, { binary: false });
            }
        });
    });

    // se desconecta el cliente
    ws.on("close", () => {
        console.log("Client disconnected")
    })

});

console.log(`http://localhost:${port}`)
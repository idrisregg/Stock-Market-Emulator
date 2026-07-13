import http from "http";
import WebSocket, { WebSocketServer } from 'ws';
import { price } from './data/queries.ts';

//creation of simple http server
const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    res.end('/n');
}).listen(6767);


const wss = new WebSocketServer({ server });


let user: number = 0;

wss.on('connection', function connection(ws: WebSocket) {
    const maxLoad = 10


    ws.on('error', console.error);

    ws.on('message', function message(data: string) {
        if (data.length < maxLoad) {
            console.log("User " + user + ":", data.toString());
        }
        if (data.length > maxLoad) {
            console.log("you exceeded message length please wait a moment to make another Offer.")
            ws.pause()
            setTimeout(() => {
                ws.resume()
            }, 10000)
        }

        //if any bidder bids the same price as the seller, then the share is sold to that user and connection drops
        if (data == price) {
            console.log("the Share has been Sold to user " + user + " for the price of " + price);
            console.log("thank you for your participation.")
            wss.close();
            process.exit(0)
        }
    });

    //find out users who disconnect
    ws.on('close', function close() {
        console.log("User " + user + " has disconnected");
        user--
    });

    user++
})

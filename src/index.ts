import http from "http";
import WebSocket, { WebSocketServer } from 'ws';
import getPricefromDB from './data/queries.ts';
import database from './data/model.ts';
import { error } from "console";


//creation of simple http server
const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    res.end('Welcome');
}).listen(6767);


const wss = new WebSocketServer({ server });

let cached = ""

let userCount: number = 0;

// just way to mimic different type of users
enum Role {
    user,
    seller
}
let user: Role = Role.user


wss.on('connection', (user as Role) === Role.user ? function connection(ws: WebSocket) {

    const maxLoad = 10


    ws.on('error', error);

    ws.on('message', function message(data: string) {
        if (data.length < maxLoad) {
            console.log("User " + userCount + ":", data.toString());
        }
        if (data.length > maxLoad) {
            ws.send("you exceeded message length please wait a moment to make another Offer.")
            ws.pause()
            setTimeout(() => {
                ws.resume()
            }, 10000)
        }

        //if any bidder bids the same price as the seller, then the share is sold to that user and connection drops

        //checks cache before db
        if (cached) {
            if (cached == data) {
                console.log("the Share has been Sold to user " + userCount + " for the price of " + cached);
                console.log("thank you for your participation.")
                wss.close();
                process.exit(0)
            }
        }
        else {
            if (getPricefromDB() === null) {
                ws.send("Please Wait until a Seller Submit an Offer")
            }
            else {
                if (getPricefromDB() == data) {
                    console.log("the Share has been Sold to user " + userCount + " for the price of " + getPricefromDB());
                    console.log("thank you for your participation.")
                    wss.close();
                    process.exit(0)
                }
            }
        }
    });

    //find out users who disconnect
    ws.on('close', function close() {
        console.log("User " + userCount + " has disconnected");
        userCount--
    });

    userCount++
}

    : function connection(ws: WebSocket) {
        ws.on('error', error);


        ws.on("message", function message(data: string) {
            try {
                //making sure it only accept digits for pricee
                if (!/^\d+$/.test(data)) {
                    ws.send("please use only Numbers. and Don't leave Space")
                }

                else {
                    database.prepare(
                        "UPDATE Trade SET price = ? WHERE id = ?"
                    ).run(data.toString().trim(), 1);
                    console.log("Seller new Price : " + data)
                    //add the new price to cache
                    cached = data
                }
            } catch (e) {
                console.log(e)
            }
        })

        ws.on('close', function close() {
            console.log("Seller has Disconnected.")
        })
    }
)

import express, {json} from 'express';
import cors from 'cors'
import WebSocketServer from 'websocket';
import http  from 'http';
import UserController from "./controller/users-controller.js";
import NewsController from "./controller/news-controller.js";
import NewsCommentsController from "./controller/news-comments-controller.js";
import axios from "axios";
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import {createNews,findAllNews} from "./daos/news-dao.js";
import session from "express-session";
import ViewsController from "./controller/views-controller.js";
import AuthenticationController from "./controller/auth-controller.js";
import NewsLikesController from "./controller/news-like-controller.js";
import {PrivilegeController} from "./controller/privilege-controller.js";


dotenv.config()
try {
    console.log("Pass",process.env.TUITER_PASSWORD)
    mongoose.connect('mongodb+srv://stockmarket:' + process.env.TUITER_PASSWORD
                     + '@stockmarket.93t0zmz.mongodb.net/?retryWrites=true&w=majority');
}
catch (e) {
    console.log(e.toString())
}



const app = express();
const oneDay = 1000 * 60 * 60 * 24
app.set('trust proxy', 1);
app.use(
    session({
        secret: "asdfasdfasdfasdf",
        resave: false,
        saveUninitialized: true,
                cookie: {
                    secure: true,
                    sameSite: 'None',
                    maxAge: 24 * 60 * 60 * 1000
                }, // needs


    })
);
const webSocketServerPort = 8000
const server = http.createServer()
server.listen(webSocketServerPort)



console.log("Listining to web socket server port 8000")

const wsServer = new WebSocketServer.server({httpServer: server});

const clients = new Map();

wsServer.on('request', function (request) {
    var userID = 200;
    const connection = request.accept(null,request.origin);
    clients[userID] = connection;
    connection.on('message' , function(message) {
        if (message.type === 'utf8') {
            console.log('received message', message.utf8Data);
        }

        //broad cast to all connected clients
        for(let key in clients) {
            clients[key].sendUTF(message.utf8Data)
            console.log('sent message to',clients[key])
        }
    })
});

var i = 0;
const findAllNews1 = async () =>
  await axios.get('https://api.marketaux.com/v1/news/all?countries=in&filter_entities=true&limit=3&published_after=2023-03-09T10:57&api_token=IKdLsrWdrAo18pM4p5DaEGSDDxgsugTVMnf5UDvs').then(response => response.data)

async function find() {

   let  data
    try {
        data = await findAllNews1()}
    catch (error) {
      // console.log("Error in fetching market data",error)
        setTimeout(() => {find()},60000 *20 )
    }

    if(data===undefined){
        console.log("UNDEFINED")
        setTimeout(() => {find()},60*1000 *20 )
        return
    }
   /* const data = [{"description"
            :
            "Zomato NZ Media Private Limited is Zomato’s New Zealand-based wholly-owned subsidiary, whereas Zomato Australia Pty Limited is based out of Australia and is a step-down subsidiary, , zomato",
        "image"

            :
            "https://static.businessworld.in/article/article_extra_large_image/1643610664_fx7jMh_zomato.png",
        "title"
            :
            i+"Zomato Announces Dissolution Of Subsidiaries In NZ, Australia",
        "uuid"
            :
            "771e55f3-e624-465a-a6a8-f4ee7599e327",
    "published_at":"2023-04-01T22:00:27.000000Z",
    "source" :"forexlive.com",
        "entities": [
        {
            "symbol": "SBIN.NS",
            "name": "State Bank of India",
            "exchange": "NSE",
            "exchange_long": "National Stock Exchange of India",
            "country": "in",
            "type": "equity",
            "industry": "Financial Services",
            "match_score": 8.362228,
            "sentiment_score": 0}]
    }
    ]
*/
    i = i+1
   const refinedData = data.data.map(obj => { const structuredData = {_id:obj.uuid,title:obj.title,description:obj.description,image:obj.image_url,source:obj.source,time:obj.published_at,symbol:obj.entities[0].symbol,company:obj.entities[0].name,industry:obj.entities[0].industry,sentiment:obj.entities[0].sentiment_score}

       return structuredData

   })
//console.log(refinedData)
    for (const item of refinedData) {
        try {
            await createNews((item));
        }
        catch (err){


        }
    }

   const k = JSON.stringify(await findAllNews())
    //console.log(k)
    wsServer.connections.forEach(client =>


    client.send(k))


    setTimeout(() => {find()},60000 *20 )
}

find()





app.use(
    cors({
        credentials: true,
        //origin: "http://localhost:3000",
           origin: ["https://phenomenal-granita-444296.netlify.app","http://localhost:3000"],
    })
);
app.use(express.json());
app.get('/hello', (req, res) => {res.send('Life is good!')})
app.get('/', (req, res) => {res.send('Welcome to Full Stack Development!')})

UserController(app);
NewsController(app);
ViewsController(app);
NewsCommentsController(app);
AuthenticationController(app);
NewsLikesController(app)
PrivilegeController(app)


app.listen(process.env.PORT || 4000);



import express from 'express';
import cors from 'cors'
const app = express();
app.use(cors())
app.use(express.json());
app.get('/hello', (req, res) => {res.send('Life is good!')})
app.get('/', (req, res) => {res.send('Welcome to Full Stack Development!')})
app.listen(process.env.PORT || 4000);
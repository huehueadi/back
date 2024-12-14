import cors from 'cors';
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import router from "./src/Routes/route.js";
import connectionDB from "./src/config/db.Connect.js";

const app = express();

app.set('view engine', 'ejs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/',(req, res)=>{
  res.send("health")
});

app.use(cors({
    origin: ['https://main.d1f860502y81bj.amplifyapp.com','http://localhost:3000'], 
    methods: ['GET', 'POST', 'PUT'],
    
}));



app.use('/api', router);

connectionDB()
  .then(() => {
    app.listen(8080, () => {
      console.log("Server is running on http://0.0.0.0:8080");
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

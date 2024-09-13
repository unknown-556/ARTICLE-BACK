import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import connectDB from './src/database.js'
import router from './src/routes/index.js'

dotenv.config()

const app = express()

app.use(cors({origin:"*"}))

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/api/article', router)


const startServer  = async () => {
   const PORT  = process.env.PORT || 1234
   connectDB()
   try {
      app.listen(PORT,() => {console.log(`APP IS RUNNING ON PORT: ${PORT}`);})
   } catch (error) {
      console.log(error);
   }
};

startServer();

app.get("/", (req,res) => {
   res.send('API IS RUNNING')
})
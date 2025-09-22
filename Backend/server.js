import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import userRouter from "./routes/user.routes.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import geminiResponse from "./gemini.js"
dotenv.config()

const app = express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const port = process.env.PORT || 3000
app.use(express.json())
app.use(cookieParser())
app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)


app.listen(port,()=>{
    connectDb()
    console.log(`Server is running on port ${port}`)
})
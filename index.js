const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const { contentSecurityPolicy } = require('helmet')
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")


let logError = (err) => {
    console.log(err)
}

dotenv.config()

mongoose.set('debug', true)
mongoose.connection
.on('error', err => {
    logError(err)
})
.on('connecting', ()=>{
    if(mongoose.connection.readyState===2)
        console.log("Connecting...")
})
.on('open',() => {
    if(mongoose.connection.readyState===1)
        console.log("Connection established")
})

mongoose.connect(process.env.MONGO_URL)
.catch(err => console.log(err));

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("dev"))

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.listen(8801, () => {
    console.log("back end server is running!!!")
})





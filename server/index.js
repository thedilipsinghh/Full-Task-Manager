require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")

const app = express()
mongoose.connect(process.env.MONGO_URL)

app.use("/", (req, res) => {
    res.status(200).json({ message: "Task Manager Api Running..." })
})

mongoose.connection.once("open", () => {
    console.log("Db Connected...")
    app.listen(process.env.PORT, () => {
        console.log("Server Running...")
        console.log(`Modal ${process.env.NODE_ENV}`)
    })
})

module.exports = app

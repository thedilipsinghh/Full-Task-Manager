require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const { adminProtect, protect } = require("./middlewares/auth.middleware.js")

const app = express()
mongoose.connect(process.env.MONGO_URL)

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", require("./routes/auth.route.js"))
app.use("/api/admin", protect("admin"), require("./routes/admin.routes.js"))
app.use("/api/employee", protect("employee"), require("./routes/employee.routes.js"))


app.use("/", (req, res) => {
    res.status(404).json({ message: `Resource not Found ${req.method} ${req.path}` })
})

mongoose.connection.once("open", () => {
    console.log("Db Connected...")
    app.listen(process.env.PORT, () => {
        console.log("Server Running...")
        console.log(`Modal ${process.env.NODE_ENV}`)
    })
})

module.exports = app

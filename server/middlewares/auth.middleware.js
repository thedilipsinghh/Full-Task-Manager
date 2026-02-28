const User = require("../modal/User")

exports.adminProtect = async (req, res, next) => {
    const jwt = require("jsonwebtoken")
    try {

        // check for cookie
        //                         👇 cookie name from auth.controlller.js
        const TOKEN = req.cookies.TOKEN
        if (!TOKEN) {
            return res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "Unable to Authentice"
                    : "Invalid"
            })
        }
        // validate token 
        jwt.verify(TOKEN, process.env.JWT_KEY, async (err, decode) => {
            if (err) {
                return res.status(401).json({ message: "invalid Token" })
            }
            const result = await User.findById(decode._id)
            if (!result) {
                return res.status(401).json({ message: "invalid id" })
            }
            if (result.role !== "admin") {
                return res.status(401).json({ message: "Not Authorized to access this Route" })
            }
            req.user = decode._id // from auth.controller.js (signin)
            next()
        })

        // validate is admin

    } catch (error) {
        res.status(401).json({ message: "Unable to Authenticate" })

    }
}

exports.protect = (role) => async (req, res, next) => {
    const jwt = require("jsonwebtoken")
    try {

        // check for cookie
        //                         👇 cookie name from auth.controlller.js
        const TOKEN = req.cookies.TOKEN
        if (!TOKEN) {
            return res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "Unable to Authentice"
                    : "Invalid"
            })
        }
        // validate token 
        jwt.verify(TOKEN, process.env.JWT_KEY, async (err, decode) => {
            if (err) {
                return res.status(401).json({ message: "invalid Token" })
            }
            const result = await User.findById(decode._id)
            if (!result) {
                return res.status(401).json({ message: "invalid id" })
            }
            if (result.role !== role) {
                return res.status(401).json({ message: "Not Authorized to access this Route" })
            }
            req.user = decode._id // from auth.controller.js (signin)
            next()
        })

        // validate is admin

    } catch (error) {
        res.status(401).json({ message: "Unable to Authenticate" })

    }
}

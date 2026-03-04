const User = require("../models/User")
const { PRODUCTION } = require("../utils/config")
const jwt = require("jsonwebtoken")
exports.adminProtect = async (req, res, next) => {
    try {
        // check for cookie
        //                          👇 Cookie Name from auth.controller.js
        const TOKEN = req.cookies.TOKEN
        //     👆 our variable
        if (!TOKEN) {
            return res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "unable to authenticate"
                    : "No Cookie "
            })
        }
        // validate token
        jwt.verify(TOKEN, process.env.JWT_KEY, async (err, decode) => {
            if (err) {
                return res.status(401).json({ message: "invalid token" })
            }

            const result = await User.findById(decode._id)
            if (!result) {
                return res.status(401).json({ message: "Invalid Id" })
            }
            if (result.role !== "admin") {
                return res.status(403).json({ message: "Not Authorized to access this route" })
            }
            req.user = decode._id //👈 from auth.controller.js (singin)
            next()
        })
        // validate is admin
    } catch (error) {
        console.log(error)

        res.status(401).json({ message: "unable to authenticate" })
    }
}

exports.protect = (role) => async (req, res, next) => {
    try {
        // check for cookie
        //                          👇 Cookie Name from auth.controller.js
        const TOKEN = req.cookies.TOKEN
        //     👆 our variable
        if (!TOKEN) {
            return res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "unable to authenticate"
                    : "No Cookie "
            })
        }
        // validate token
        jwt.verify(TOKEN, process.env.JWT_KEY, async (err, decode) => {
            if (err) {
                return res.status(401).json({ message: "invalid token" })
            }

            const result = await User.findById(decode._id)
            if (!result) {
                return res.status(401).json({ message: "Invalid Id" })
            }
            if (result.role !== role) {
                return res.status(403).json({ message: "Not Authorized to access this route" })
            }
            req.user = decode._id //👈 from auth.controller.js (singin)
            next()
        })
        // validate is admin
    } catch (error) {
        console.log(error)

        res.status(401).json({ message: "unable to authenticate" })
    }
}
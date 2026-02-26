const User = require("../modal/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { PRODUCTION } = require("../utils/config")
const crypto = require("crypto")
const { sendEmail } = require("../utils/email")
const { registerTemplate } = require("../email-templates/registerTemplate")

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are Required" })
        }
        const result = await User.findOne({ email })

        if (!result) {
            return res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "invalid Credentails"
                    : "Email Not Found"
            })
        }
        if (!result.active) {
            return res.status(401).json({ message: "Account blocked by admin" })
        }
        const verify = await bcrypt.compare(password, result.password)
        if (!verify) {
            return res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "invalid Credentails"
                    : "Invalid Password"
            })
        }
        const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
        res.cookie("TOKEN", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === PRODUCTION,
            maxAge: 1000 * 60 * 60 * 24
        })
        res.status(200).json({
            message: "Login Success", result: {
                name: result.name,
                email: result.email,
                mobile: result.mobile,
                profilePic: result.profilePic,
                _id: result._id,
                role: result.role,
            }, success: true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to Login" })
    }
}
exports.registerEmployee = async (req, res) => {
    try {
        // only admin can  register employee
        const { name, email, mobile } = req.body
        if (!name || !email || !mobile) {
            return res.status(400).json({ message: "All Field Required" })
        }
        const isFound = await User.findOne({ $or: [{ email }, { mobile }] })
        if (isFound) {
            return res.status(401).json({ message: "email/mobile already exist" })
        }
        const pass = crypto.randomBytes(8).toString("hex")
        const password = await bcrypt.hash(pass, 10)
        // send email fn here
        await sendEmail({
            email,
            subject: 'Welcome To Task Manager',
            message: registerTemplate({ name, password: pass })
        })
        await User.create({ name, email, mobile, password, role: "employee" })
        res.status(200).json({ message: "register Success", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to register" })
    }
}
exports.signout = async (req, res) => {
    try {
        res.clearCookie("TOKEN")
        res.status(200).json({ message: "sigout Success", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to sigout" })
    }
}
exports.sendOTP = async (req, res) => {
    try {
        res.status(200).json({ message: "sendOTP Success", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to sendOTP" })
    }
}
exports.verifyOTP = async (req, res) => {
    try {
        res.status(200).json({ message: "verifyOTP Success", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to verifyOTP" })
    }
}
exports.forgetPassword = async (req, res) => {
    try {
        res.status(200).json({ message: "forgetPasword Success", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to forgetPasword" })
    }
}
exports.changePassword = async (req, res) => {
    try {
        res.status(200).json({ message: "changePassword Success", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to changePassword" })
    }
}
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { PRODUCTION, FRONTEND_URL } = require("../utils/config")
const crypto = require("crypto")
const { sendEmail } = require("../utils/email")
const { registerTemplate } = require("../email-templates/registerTemplate")
const { otpTemplate } = require("../email-templates/otpTemplate")
const { differenceInSeconds } = require("date-fns")
const { forgetPasswordTemplate } = require("../email-templates/forgetPasswordTemplate")
const { isEmail, isStrongPassword, isMobilePhone, isEmpty, isJWT } = require("validator")
exports.singin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" })
        }
        if (!isEmail(email)) {
            return res.status(400).json({ message: "invalid email" })
        }
        // if (!isStrongPassword(password)) {
        //     return res.status(400).json({ message: "weak password" })
        // }
        const result = await User.findOne({ email })
        if (!result) {
            return res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "Invalid Credentials"
                    : "Email Not Found"
            })
        }
        if (!result.active) {
            return res.status(401).json({ messsage: "account blocked by admin" })
        }
        const verify = await bcrypt.compare(password, result.password)
        if (!verify) {
            return res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "Invalid Credentials"
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
            message: "login success",
            result: {
                name: result.name,
                email: result.email,
                mobile: result.mobile,
                profilePic: result.profilePic,
                _id: result._id,
                role: result.role,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to login" })
    }
}

exports.registerEmployee = async (req, res) => {
    try {
        // Only Admin can register employee
        // express-validator
        const { name, email, mobile } = req.body
        if (isEmpty(name) || isEmpty(email) || isEmpty(mobile)) {
            return res.status(400).json({ message: "all fields required" })
        }
        if (!isEmail(email)) {
            return res.status(400).json({ message: "invalid email" })
        }
        if (!isMobilePhone(mobile, "en-IN")) {
            return res.status(400).json({ message: "invalid mobile" })
        }
        const isFound = await User.findOne({ $or: [{ email }, { mobile }] })
        if (isFound) {
            return res.status(401).json({ message: "email/mobile already exist" })
        }

        const pass = crypto.randomBytes(8).toString("hex")
        const password = await bcrypt.hash(pass, 10)
        await sendEmail({
            email,
            subject: 'Welcome to Task Manager',
            message: registerTemplate({ name, password: pass })
        })
        await User.create({ name, email, mobile, password, role: "employee" })

        res.status(200).json({ message: "register employee success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to register employee" })
    }
}
exports.signout = async (req, res) => {
    try {
        res.clearCookie("TOKEN")
        res.status(200).json({ message: "signout success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to signout employee" })
    }
}

exports.sendOTP = async (req, res) => {
    try {
        const { username } = req.body
        if (isEmpty(username)) {
            return res.status(400).json({ message: "email/mobile is required" })
        }
        if (!isEmail(username) && !isMobilePhone(username, "en-IN")) {
            return res.status(400).json({ message: "invalid email or mobile" })
        }
        const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })
        if (!result) {
            return res.status(400).josn({ message: "email/mobile not registered with us" })
        }
        // create OTP
        const otp = crypto.randomInt(100000, 1000000)
        // to convert to string 
        // String(otp)
        // otp.toString()
        const hashOTP = await bcrypt.hash(String(otp), 10)
        // add to database
        await User.findByIdAndUpdate(result._id, { otp: hashOTP, otpSendOn: new Date() })
        // Send OTP in email / sms / whatsapp
        await sendEmail({
            email: result.email,
            subject: "Login OTP",
            message: otpTemplate({
                name: result.name,
                otp,
                sec: process.env.OTP_EXPIRY,
                min: process.env.OTP_EXPIRY / 60
            })
        })
        res.status(200).json({ message: "sendOTP success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to sendOTP " })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const { username, otp } = req.body
        if (isEmpty(username) || isEmpty(otp)) {
            return res.status(400).json({ message: "all fields required" })
        }
        if (!isEmail(username) && !isMobilePhone(username, "en-IN")) {
            return res.status(400).json({ message: "invalid email or mobile" })
        }
        const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })
        if (!result) {
            return res.status(400).json({ message: "email/mobile not registered with us" })
        }
        const verify = await bcrypt.compare(otp, String(result.otp))
        if (!verify) {
            return res.status(400).json({ message: "invalid opt" })
        }
        if (differenceInSeconds(new Date(), new Date(result.otpSendOn)) > process.env.OTP_EXPIRY) {
            await User.findByIdAndUpdate(result._id, { otp: null })
            return res.status(400).json({ message: "opt Expired" })
        }
        const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
        res.cookie("TOKEN", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === PRODUCTION,
            maxAge: 1000 * 60 * 60 * 24
        })
        res.status(200).json({
            message: "login success", result: {
                name: result.name,
                email: result.email,
                mobile: result.mobile,
                profilePic: result.profilePic,
                _id: result._id,
                role: result.role,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to verifyOTP" })
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const { username } = req.body
        if (isEmpty(username)) {
            return res.status(400).josn({ message: "email/mobile is required" })
        }
        if (!isEmail(username) && !isMobilePhone(username, "en-IN")) {
            return res.status(400).json({ message: "invalid email or mobile" })
        }
        const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })
        if (!result) {
            return res.status(400).josn({ message: "email/mobile not registered with us" })
        }
        const accessToken = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "15m" })
        await User.findByIdAndUpdate(result._id, { accessToken })

        const link = `${FRONTEND_URL}/forget-password/?token=${accessToken}`
        await sendEmail({
            email: result.email,
            subject: "Request for Change Password",
            message: forgetPasswordTemplate({ name: result.name, resetLink: link })
        })

        res.status(200).json({ message: "forgetPassword success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to forgetPassword" })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { token } = req.query
        const { password } = req.body

        if (isEmpty(token)) {
            return res.status(400).json({ message: "Token Required" })
        }

        if (isJWT(token)) {
            return res.status(400).json({ message: "invalid token" })
        }

        const result = await User.findOne({ accessToken: token })
        if (!result) {
            return res.status(400).json({ message: "Token Not Found" })
        }
        jwt.verify(token, process.env.JWT_KEY, async (err, decode) => {
            if (err) {
                console.log(err)
                await User.findByIdAndUpdate(result._id, { accessToken: null })
                return res.status(400).json({ message: "Invalid Token" })
            }
            const hash = await bcrypt.hash(password, 10)
            await User.findByIdAndUpdate(result._id, { password: hash })
            res.status(200).json({ message: "changePassword success" })
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to changePassword" })
    }
}
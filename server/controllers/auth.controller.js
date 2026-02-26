const User = require("../modal/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { PRODUCTION, FRONTEND_URL } = require("../utils/config")
const crypto = require("crypto")
const { sendEmail } = require("../utils/email")
const { registerTemplate } = require("../email-templates/registerTemplate")
const { otpTemplate } = require("../email-templates/otpTemplate")
const { differenceInSeconds } = require("date-fns")
const { forgetPasswordTemplate } = require("../email-templates/forgetPasswordTemplate")

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
        const { username } = req.body

        if (!username) {
            return res.status(400).json({ message: "Email or Mobile is required" })
        }
        const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })
        if (!result) {
            return res.status(400).json({ message: "Email or Mobile not Register with us" })

        }
        // create otp
        const otp = crypto.randomInt(100000, 1000000)
        //                               👇to convert in string use simple String() fn they convert number to string
        const hasOTP = await bcrypt.hash(String(otp), 10)
        // add to database
        await User.findByIdAndUpdate(result._id, { otp: hasOTP, otpSendOn: new Date() })
        // send otp in email/sms/whataspp
        await sendEmail({
            email: result.email,
            subject: "login OTP",
            message: otpTemplate({
                name: result.name,
                otp,
                sec: process.env.OTP_EXIPIRY,
                min: process.env.OTP_EXIPIRY / 60
            })
        })
        res.status(200).json({ message: "sendOTP Success", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to sendOTP" })
    }
}
exports.verifyOTP = async (req, res) => {
    try {
        const { username, otp } = req.body
        if (!username || !otp) {
            return res.status(400).json({ message: "all field  required" })
        }
        const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })
        if (!result) {
            return res.status(400).json({ message: "Email or Mobile not Register with us" })

        }
        const verify = await bcrypt.compare(otp, String(result.otp))
        if (!verify) {
            return res.status(400).json({ message: "Invalid otp" })
        }
        if (differenceInSeconds(new Date(), new Date(result.otpSendOn)) > process.env.OTP_EXIPIRY) {
            await User.findByIdAndUpdate(result._id, { otp: null })
            return res.status(400).json({ message: "Otp Expired" })
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
        res.status(500).json({ message: "Unable to verifyOTP" })
    }
}
exports.forgetPassword = async (req, res) => {
    try {
        const { username } = req.body
        if (!username) {
            return res.status(400).json({ message: "email/mobile required" })
        }
        const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })
        if (!result) {
            return res.status(400).json({ message: "Email or Mobile not Register with us" })
        }
        const accessToken = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "15m" })
        await User.findByIdAndUpdate(result._id, { accessToken })
        const link = `${FRONTEND_URL}/forget-password/?token=${accessToken}`
        await sendEmail({
            email: result.email,
            subject: "Request for change password",
            message: forgetPasswordTemplate({ name: result.name, resetLink: link })
        })
        res.status(200).json({ message: "forgetPasword Success", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to forgetPasword" })
    }
}
exports.changePassword = async (req, res) => {
    try {
        const { token } = req.query
        const { password } = req.body
        if (!token) {
            res.status(400).json({ message: "Token Required" })
        }
        const result = await User.findOne({ accessToken: token })
        if (!result) {
            res.status(400).json({ message: "Token Not Found" })
        }
        jwt.verify(token, process.env.JWT_KEY, async (err, decode) => {
            if (err) {
                console.log(err)
                await User.findByIdAndUpdate(result._id, { accessToken: null })
                return res.status(400).json({ message: "Invalid Token" })
            }
            const hash = await bcrypt.hash(password, 10)
            await User.findByIdAndUpdate(result._id, { password: hash })
            res.status(200).json({ message: "changePassword Success", success: true })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to changePassword" })
    }
}
const { singin, registerEmployee, signout, sendOTP, verifyOTP, forgetPassword, changePassword, signin } = require("../controllers/auth.controller.js")
const { adminProtect } = require("../middlewares/auth.middleware.js")

const router = require("express").Router()

router
    .post("/register-employee", adminProtect, registerEmployee)
    .post("/signin", signin)
    .post("/signout", signout)
    .post("/send-otp", sendOTP)
    .post("/verify-otp", verifyOTP)
    .post("/forget-password", forgetPassword)
    .post("/change-password", changePassword)

module.exports = router
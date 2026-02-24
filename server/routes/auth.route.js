const { singin, registerEmployee, signout, sendOTP, verifyOTP, forgetPassword, changePassword, signin } = require("../controllers/auth.controller.js")

const router = require("express").Router()

router
    .post("/register-employee", registerEmployee)
    .post("/sigin", signin)
    .post("/signout", signout)
    .post("/send-otp", sendOTP)
    .post("/verify-otp", verifyOTP)
    .post("/forget-password", forgetPassword)
    .post("/change-password", changePassword)

module.exports = router
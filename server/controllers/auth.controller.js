exports.signin = async (req, res) => {
    try {
        res.status(200).json({ message: "Login Success", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to Login" })
    }
}
exports.registerEmployee = async (req, res) => {
    try {
        res.status(200).json({ message: "register Success", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to register" })
    }
}
exports.signout = async (req, res) => {
    try {
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
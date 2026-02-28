const Task = require("../modal/Task")
const User = require("../modal/User")

exports.getAllTodos = async (req, res) => {
    try {
        // from  auth.middlerware protect (id of logindin emp) 
        const result = await Task.find({ employee: req.user })
        res.status(200).json({ message: " Todos Fetch success", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to Fetch todos" })
    }
}

exports.togglerTodoStatus = async (req, res) => {
    try {
        const { tid } = req.params
        const { complete } = req.body
        await Task.findByIdAndUpdate(tid, { complete, completeDate: new Date() }, { runValidators: true })
        res.status(200).json({ message: " Todo Toggle Status success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable Todo Toggle Status " })
    }
}

exports.getProfile = async (req, res) => {
    try {
        const result = await User.findById(req.user).select("name , email, mobile , role , profilePic")
        res.status(200).json({ message: " Profile Fetch  success", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to Fetch Profile  " })
    }
}

exports.UpdateProfile = async (req, res) => {
    try {
        const { name, email, mobile } = req.body
        const body = {}
        if (name) body.name = name
        if (email) body.email = email
        if (mobile) body.mobile = mobile
        await User.findByIdAndUpdate(req.user, body, { runValidators: true })
        res.status(200).json({ message: " Profile update  success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to update Profile  " })
    }
}
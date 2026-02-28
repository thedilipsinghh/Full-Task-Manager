const Task = require("../modal/Task")
const User = require("../modal/User")

exports.getAllEmployee = async (req, res) => {
    try {

        const result = await User.find({ role: "employee" }).select(
            "name email password mobile active role isDelete "
        )
        res.status(200).json({ message: "Employee Fetch Suceess", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to Fetch All Employee" })
    }
}

exports.updateEmployee = async (req, res) => {
    try {
        const { eid } = req.params
        let obj = {}
        const { name, email, mobile } = req.body

        if (name) {
            obj = { ...obj, name: name }
        }

        if (email) {
            obj = { ...obj, email }
        }
        if (mobile) {
            obj = { ...obj, mobile }
        }
        if (obj.name || obj.email || obj.mobile) {
            await User.findByIdAndUpdate(eid, obj, { runValidators: true })
        }
        res.status(200).json({ message: "Employee update Suceess" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to update  Employee" })
    }
}

exports.toggleEmployeeStatus = async (req, res) => {
    try {
        const { status } = req.body
        if (typeof status !== "boolean") {
            return res.status(400).json({ message: "Status is Reuired" })
        }
        const { eid } = req.body
        await User.findByIdAndUpdate(eid, { active: status }, { runValidators: true })
        res.status(200).json({ message: "Employee status update Suceess" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to status update  Employee" })
    }
}

exports.DeleteEmployee = async (req, res) => {
    try {
        const { eid } = req.params
        await User.findByIdAndUpdate(eid, { isDelete: false }, { runValidators: true })
        res.status(200).json({ message: "Employee delete Suceess" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to delete  Employee" })
    }
}
exports.restoreEmployee = async (req, res) => {
    try {
        const { eid } = req.params
        await User.findByIdAndUpdate(eid, { isDelete: false }, { runValidators: true })
        res.status(200).json({ message: "Employee Restore Suceess" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to Restore  Employee" })
    }
}
exports.permanentDeleteEmployee = async (req, res) => {
    try {
        const { eid } = req.params
        await User.findByIdAndDelete(eid)
        res.status(200).json({ message: "Employee permanent delete Suceess" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable to permanent delete  Employee" })
    }
}


// todo controller 

exports.createTask = async (req, res) => {
    try {
        const { task, desc, priority, due, employee } = req.body
        if (!task || !desc || !priority || !due || !employee) {
            return res.status(400).json({ message: "All filed Required" })
        }
        await Task.create({ task, desc, priority, due, employee })
        res.status(200).json({ message: "Task Create Suceess" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable To Task Create " })
    }
}

exports.readTask = async (req, res) => {
    try {
        const result = await Task.find()

        res.status(200).json({ message: "Read task Suceess", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable To Read task " })
    }
}
exports.updateTask = async (req, res) => {
    try {
        const { tid } = req.params
        const { task, desc, priority, due, employee } = req.body
        const obj = {}
        if (task) obj.task = task
        if (desc) obj.desc = desc
        if (priority) obj.priority = priority
        if (employee) obj.employee = employee
        if (due) obj.due = due

        await Task.findByIdAndUpdate(tid, obj, { runValidators: true })
        res.status(200).json({ message: "update task Suceess" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable To update task " })
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const { tid } = req.paramsl
        await Task.findByIdAndDelete(tid)
        res.status(200).json({ message: "delete task Suceess" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Unable To delete task " })
    }
}
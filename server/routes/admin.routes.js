
const { getAllEmployee, updateEmployee, toggleEmployeeStatus, DeleteEmployee, createTask, readTask, updateTask, deleteTask, restoreEmployee, permanentDeleteEmployee } = require("../controllers/admin.controller.js")
const { adminProtect } = require("../middlewares/auth.middleware.js")

const router = require("express").Router()

router
    .get("/employee", getAllEmployee)
    .put("/update-employee/:eid", updateEmployee)
    .put("/toggle-employee-status/:eid", toggleEmployeeStatus)
    .delete("/delete-employee/:eid", DeleteEmployee)
    .put("/restore-employee/:eid", restoreEmployee)
    .delete("/remove-employee/:eid", permanentDeleteEmployee)

    .post("/todo-create", createTask)
    .get("/todo", readTask)
    .put("/todo/:tid", updateTask)
    .delete("/todo/:tid", deleteTask)

module.exports = router
const { getAllTodos, togglerTodoStatus, getProfile, UpdateProfile } = require("../controllers/employee.controller.js")


const router = require("express").Router()

router
    .get("/todos", getAllTodos)
    .put("/todo-update/:tid", togglerTodoStatus)
    .get("/profile", getProfile)
    .put("/profile-update", UpdateProfile)
module.exports = router
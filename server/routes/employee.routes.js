const { getAllTodos, toggleTodoStatus, getProfile, updateProfile } = require("../controllers/employee.controller")

const router = require("express").Router()

router
    .get("/todos", getAllTodos)
    .put("/todo-update/:tid", toggleTodoStatus)

    .get("/profile", getProfile)
    .put("/profile-update", updateProfile)


module.exports = router
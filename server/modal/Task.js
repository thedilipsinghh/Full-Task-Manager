const mongoose = require("mongoose")
module.exports = mongoose.model("task", new mongoose.Schema({
    task: { type: String, required: true },
    desc: { type: String, required: true },
    priority: { type: String, required: true },
    due: { type: Date, require: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },


    complete: { type: Boolean, default: false },
    completeDate: { type: Date },


    // primary key
    // forign key


}, { timestamps: true }))
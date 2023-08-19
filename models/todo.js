const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    description: { type: String, required: true},
},
{timestamps: true}
)

module.exports = new mongoose.model("todo", todoSchema);
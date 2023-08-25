const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listData = require('./router/todoApi');

mongoose
    .connect("mongodb+srv://rsingha:rsingha@cluster0.r0csg0b.mongodb.net/ToDoList?retryWrites=true&w=majority")
    .then(() => console.log("db connection successfully"))
    .catch((err) => console.log(err))

app.use(express.json());
app.use("/api", listData);

//! Print Bad Request
app.use((req,res,next) => {
    res.status(404).send({
        error: "Bad Request"
    });
})

app.use((req,res,next) => {
    req.requestTime = Date.now();
    next();
})


app.listen(4040, ()=> {
    console.log("server is running on post no 4040")
})

module.exports = app;
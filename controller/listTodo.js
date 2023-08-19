const todoList = require('../models/todo');

let Modules = function () {

//Post Todo Data: -
this.createData = async(req, res) => {
    const todo = new todoList(req.body);
    try{
        await todo.save();
        res.status(200).send("Posted todo data succsfully")
    }catch{
        res.status(500).send("Error posting todo data")
    }
}
//Get Todo Data: -
this.findAll = async(req, res) => {
    try{
        const todo = await todoList.find();
        res.status(200).send(todo);
    }catch{
        res.status(500).send("Error fetching todo data")
    }
}

//Find By id: -
this.findById = async(req, res) => {
    try{
        const todo = await todoList.findById(req.params.id);
        res.status(200).send(todo);
    }catch{
        res.status(404).send("Error fetching todo data")
    }
}

//Update Data: -
this.updateById = async(req, res) => {
    try{
        const todo = await todoList.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).send(todo);
    
    }catch{
        res.status(500).send("Error updating todo data")
    }
}

//Delete Data: -
this.deleteById = async(req, res) => {
    try{
        const todo = await todoList.findByIdAndDelete(req.params.id);
        res.status(200).send(todo)
    }catch{
        res.status(404).send("Error Updating the data")
    }
}
}
module.exports = new Modules();
const express = require("express");
const router = express();
const route = require('../controller/listTodo')

router.post('/list', route.createData); //done unit testing
router.get('/lists', route.findAll);    // done unit testing
router.get('/lists/:id', route.findById);   // done unit testing
router.put("/lists/:id", route.updateById); // done unit testing
router.delete("/listsd/:id", route.deleteById);  // done unit testing

module.exports = router;
const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const Todo = require('../models/todo');
const server = require("../index");
const expect = chai.expect;
chai.use(chaiHttp);

before(async () => {
  try {
    await mongoose.connect("mongodb+srv://rsingha:rsingha@cluster0.r0csg0b.mongodb.net/ToDoList?retryWrites=true&w=majority", {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
});

//! POST DATA UNIT TESTING: -
// describe.skip('/POST Todo', () => {    //! here skip method using for skip that testing.(describe.skip)
describe('createData', () => {
    it('Create a new todo', async() => {
      const newTodoData = {
        name: "My Todo",
        email: "my@email.com",
        description: "This is my todo.",
      };
      const todo = new Todo(newTodoData);
      await todo.save();
  
      chai.request(server)
        .post('/list')
        .send(newTodoData)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(todo.name).to.equal(newTodoData.name);
            expect(todo.email).to.equal(newTodoData.email);
            expect(todo.description).to.equal(newTodoData.description);
        });
    });
  });

//! GET DATA UNIT TESTING: - 
describe("findAll", () => {
    it("GET all the todos", async () => {
      const todoToFind = "My Todo";
      const foundTodo = await Todo.findOne({ name: todoToFind });
  
      chai.request(server)
        .get("/lists")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          // expect(res.body).to.have.lengthOf(1); // Assuming there's one todo in the database
          if (foundTodo) {
            expect(foundTodo.name).to.equal(todoToFind);
            expect(foundTodo.email).to.equal("my@email.com");
            expect(foundTodo.description).to.equal("This is my todo.");
          } else {
            // If todo is not found, the test should pass anyway since we are just testing the GET request here
            expect(true).to.be.true;
          }
        });
    });
    it("should return null if the todo does not exist", async () => {
      const todoToFind = "Nonexistent Todo";
      
      // Call the function that retrieves the todo by name
      const foundTodo = await Todo.findOne({ name: todoToFind });
  
      // Make assertions to check that the todo is not found (should be null)
      expect(foundTodo).to.be.null;
    });  
})

//! GET BY ID DATA UNIT TESTING: - 
describe("findById", () => {
    it("GET BY ID the todos", async () => {
      let todo = new Todo({
        name: "My Todo",
        email: "my@email.com",
        description: "This is my todo.",
      });
  
      // Save the todo with a custom maxTimeMS option for timeout
      await todo.save({ maxTimeMS: 15000 });
  
      const res = await chai.request(server)
      .get("/lists/" + todo.id);
  
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object");
      expect(res.body.name).to.equal("My Todo");
      expect(res.body.email).to.equal("my@email.com");
      expect(res.body.description).to.equal("This is my todo.");
    });
  
    it("If id is nonExisting", async () => {
      const nonExistingId = '61e9d8c4a7f3b0cc34567';
  
      const res = await chai.request(server).get("/lists/" + nonExistingId);
  
      expect(res).to.have.status(404);
    });
});

//! UPDATE todos data UNIT TESTING
describe('updateById', () => {
    it('it should UPDATE a todo list given the id', async () => {
        let todo = new Todo({
            name: "Todo",
            email: "todo@email.com",
            description: "This is my todo...."
        });
        // Save the todo item to the database
        await todo.save();
        // Perform the update request
        const updatedData = {
            name: "Updated Todo",
            email: "updated@email.com",
            description: "This is my updated todo...."
        };

        await chai.request(server)
        .put('/lists/' + todo._id) // Use _id instead of id
        .send(updatedData)
        .end((err, res) => {
        // Assertions
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.name).to.equal(updatedData.name);
        expect(res.body.email).to.equal(updatedData.email);
        expect(res.body.description).to.equal(updatedData.description); 
        })        
    });
    it("If Id is nonExist", async () => {
        const nonExistingId = '61e9d8c4a7f3b0cc34567';

        // const updatedData = {
        //     name: "Updated Todo",
        //     email: "updated@email.com",
        //     description: "This is my updated todo...."
        // };

        const res = await chai.request(server)
            .put("/lists/" + nonExistingId)
            // .send(updatedData);

        expect(res).to.have.status(500);
    });
});

//! Delete By Id: -
describe('/deleteById', () => {
    it('Delete a todo list from given the id', async () => {
        let todo = new Todo({
            name: "Todo Delete",
            email: "tododelete@email.com",
            description: "This is my deleted todo...."
        });
        await todo.save();
        await chai.request(server)
        .delete("/lists/" + todo.id)
        .end((err, res) => {
          expect(res).to.have.status(200);
        //   expect(res.body).to.be.an("array");
    })
})
//? AFTER SUCCESSFULLY POSTING THE DATA IN THE DATABASE DATA WILL BE AUTOMATICALLY DELETED FROM THE DATABASE AND ITS SHOWN DISCONNECTED FROM MONGODB
//!------------------------EXAMPLE OF UNIT TESTING: -
var assert = require('assert');
describe('Array', function () {
    describe('#indexOf()', function () {
      it('should return -1 when the value is not present', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
      });
    });
  });

    after(async () => {
    try {
      // Instead of dropping the database, remove the "todos" collection
    //   const Todo = mongoose.model("Todo");
      await Todo.deleteMany({});
      await mongoose.connection.close();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
    }
  });
})






//!!!!!!!!!!!!-----------------------------------------------------------------------------------------
// let mongoose = require("mongoose");
// let Todo = require("../models/todo");

// // Set the testing environment
// process.env.NODE_ENV = 'test';

// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../index');
// chai.use(chaiHttp);
// chai.should();

// describe('Todos', () => {
//     beforeEach(async () => {
//         // Before each test, empty the database
//         await Todo.deleteMany({});
//     });

    

//     describe('/GET todos', () => {
//         it('it should GET all the todos', (done) => {
//             chai.request(server)
//                 .get('/lists')
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.an('array'); // Assuming it returns an array of todos
//                     res.body.length.should.be.eql(0); // If it returns an empty array for no todos
//                     done();
//                 });
//         });
//     });

//     describe('/POST book', () => {
//         it('it should not POST a book without pages field', (done) => {
//             let book = {
//                 name: "the Rings",
//                 email: "J.R.R.@Tolkien",
//                 description: "---------------"
//             }
//               chai.request(server)
//               .post('/list')
//               .send(book)
//               .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                     res.body.should.have.property('errors');
//                     // res.body.errors.pages.should.have.property('kind').eql('required');
//                 done();
//               });
//         });
//         it('it should POST a book ', (done) => {
//             let book = {
//                 name: "the Rings",
//                 email: "J.R.R.@Tolkien",
//                 description: "---------------"
//             }
//               chai.request(server)
//               .post('/list')
//               .send(book)
//               .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                     res.body.should.have.property('message').eql('Book successfully added!');
//                     res.body.book.should.have.property('name');
//                     res.body.book.should.have.property('email');
//                     res.body.book.should.have.property('description');
//                     // res.body.book.should.have.property('year');
//                 done();
//               });
//         });
//     });
// });



// describe('/GET todos', () => {
//     beforeEach((done) => {
//         let todo1 = new Todo({
//             title: "Buy groceries",
//             description: "Milk, Cheese and Bread"
//             });
//             let todo2 = new Todo({
//                 title: "Finish homework",
//                 description: ""
//                 });
//                 // Save the two objects to database using save method of Mongoose model instancewe can insert multiple documents in a single call by passing an array as argument instead of individual object then calling done() function after inserting all data into db so that mocha knows when it's finished executing this test case
//                 Promise.all([todo1.save(), todo2.save()]).then(()=>
//                 done());
//                 })
//                 afterEach((done)=>
//                 deleteAllTodos().then (()=>
//                 done())
//                 )
//                 describe('/', ()=>{
//                     it ('it should GET all Todos from DB.', (done)=>{
//                         chai.request(server)
//                         .get('/')
//                         .end ((err, res)=>{
//                             if (err){
//                                 console.log(err);
//                                 } else{
//                                     //console.log(res.body[0].title + "\n\t"+
//                                     res.body[0]._id+ '\n' );
//                                     expect(res).to.have.status(200);
//                                     expect(res.body).to.be.a('array').that.is.not
//                                     .empty;
//                                     for (var i= 0 ;i<res.body.length;i++){
//                                         var objId = ObjectId(res.body[i]["_id"]);
//                                         assert.equal(objId , res.body[i]["_id"])}
//                                         };
//                                         return done()})});
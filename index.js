
const express = require('express')
const bodyparser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('lesson1.db', function (error) {
  if (error) {
    console.error("Failed to connect to db");
    console.error(error.message);
  } else {
    console.log("connected to db")
  }
});

const app = express()
//tell the app to use bodyparser's json for parsing
app.use(bodyparser.json());

const port = process.env.PORT || 4000

const { users } = require('./state')

/* BEGIN - create routes here */

// app.get("/", function (req, res) {
//   res.send("My first server route!");
// });

app.all("/", function (req, res) {
  res.send(`
  this backend can mange users using the following: 
      GET /users                      to get the list of all users
      GET /users/{id}                 to get a specific user by id
      has BODY !!! PUT  /users{id}    to update an existing user
      has BODY!!!POST /users          to add a new user  
      DELETE /users {id}              to inactive a user
      DELETE /user/{id}/purge         to delete the user for real
  
  
  `);
});


app.get("/testdb", function (req, res) {
  console.log("in GET /testdb route");

  // some code in here to issue this ommand to the database
  // and return the results 

  let sql = 'SELECT * from users';

  db.each (sql, function (error, row){
    console.log("Result from the DB =", row)

  })
  res.json("success");
})

app.get("/users", function (req, res) {
  console.log("inside my GET/user route");
  // console.log("request =", req);
  console.log("cureent users", users);
  // how do we send this list of users on the resonse? 
  res.json(users);
  // res.send("Nice to meet you! ")
})


// GET /users/1
app.get("/users/:id", function (req, res) { //path paramater bc of the :
  console.log("inside my GET/user/:id route", req.params); // Path
  //the id we are looking for 
  //right now it will only look for id #1 
  let idToLookFor = req.params.id; // params=parameter "what got passed in?"
  //loop through the users array,
  //and find the user with correct id
  let user = users.find(function (element) {
    if (element._id == idToLookFor) {
      return element;
    }
  })
  // return the found user
  res.json(user);
})

// POST /users // ADD 
app.post("/users", function (req, res) {
  console.log("inside my POST/user/ route");
  console.log("request body:", req.body); // req.body= object allows to request some data from the JSON // res.body: API is responding 
  //now that we have the json that was sent.
  //add an _id attribute to it,
  // and add it to the user array
  let newUser = {
    id: req.body._id, //object with keys and values  
    name: req.body.name
  }
  users.push(newUser)
  res.json(users);
})

// PUT /users/:id // UPDATE
// you want to update an existing user
//with the body that was passed in.
// NOTE!! make sure that if an id attribute is added in the body
// that you replace it with the id from the route!
app.put("/users/:id", function (req, res) { // : is expecting an user "created" id
  console.log("inside my PUT/user/:id route", req.params);
  console.log("request body:", req.body);
  const updateUser = req.body;
  users.forEach(user => {
    // requesting the paramter (inside of the url) to find the id 
    // does the id i passed in the url match the name
    if (user._id === parseInt(req.params.id)) {
      // we want to update the name that is associated with the id
      user.name = updateUser ? updateUser.name : user.name // ternary operator javascript short hand for if else statement
    }
  })

  res.json("success");
})

// DELETE /users/:id
app.delete("/users/:id", function (req, res) {
  console.log("inside my DELETE/user/:id route", req.params);
  console.log("request body:", req.body);
  // FOR the user with matching id,
  // add an "isActive" attribute, and set it to false
  //find the user with the matching id 
  const found = users.some(user => user._id == req.params.id)
  // let found = req.params.id; // params=parameter "what got passed in?"
  //loop through the users array,
  //and find the user with correct id
  let user = users.find(function (element) {
    if (element._id == found) {
      return element;
    }
  })
  // if the id is found set the attribute to false 
  user.isActive = false;
  // return the found user
  res.json(user);
})



/* END - create routes here */

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`))
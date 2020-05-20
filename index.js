var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");

//mongoose connection
var db = mongoose.connect("mongodb://localhost/todo");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//mongoose schema
var todoSchema = new mongoose.Schema({
  task: String,
  status: String,
});

var Todo = mongoose.model("Todo", todoSchema);

//Three list for three statuses
var todoList = [];
var doingList = [];
var doneList = [];

// ---------------- Express routes  -------------------

//default route
app.get("/", function (req, res) {
  todoList = [];
  doingList = [];
  doneList = [];

  Todo.find({}, function (err, response) {
    if (err) {
      onErr(err, callback);
    } else {
      //   console.log(response[0].status);

      //checking all the tasks initially and adding them to their respective list
      for (var i = 0; i < response.length; i++) {
        if (response[i].status == "todo") {
          todoList.push(response[i].task);
        } else if (response[i].status == "doing") {
          doingList.push(response[i].task);
        } else if (response[i].status == "done") {
          doneList.push(response[i].task);
        }
      }
      res.render("index.ejs", {
        todoList: todoList,
        doingList: doingList,
        doneList: doneList,
      });
    }
  });
});

//route for changing tasks from todo to doing
app.post("/doing", function (req, res) {
  console.log(req.body);
  var task = req.body.val;
  var condition = { task: req.body.val };
  var status = "";
  Todo.find({}, function (err, list) {
    if (err) console.log("err");
    else {
    //   console.log(list);
      for (var i = 0; i < list.length; i++) {
        if (list[i].task == task) {
          status = "doing";
        }
      }
    }
  });
//finding the object and changing the status as per the status variable
  Todo.find(condition, function (err, foundObject) {
    if (err) console.log(err);
    else {
      if (!foundObject) console.log("Not found.");
      else {
        foundObject.status = status;

        // foundObject.save();
      }
    }
  });
  res.redirect("/");
});

//route for changing tasks from doing to done
app.post("/done", function (req, res) {
  console.log(req.body.val);
  var task = req.body.val;
  var condition = { task: req.body.val };
  var status = "";
  Todo.find({}, function (err, list) {
    if (err) console.log("err");
    else {
      console.log(list);
      for (var i = 0; i < list.length; i++) {
        if (list[i].task == task) {
          status = "done";
        }
      }
    }
  });
  //finding the object and changing the status as per the status variable
  Todo.findOne(condition, function (err, foundObject) {
    if (err) console.log(err);
    else {
      if (!foundObject) console.log("Not found.");
      else {
        foundObject.status = status;

        foundObject.save();
      }
    }
  });
  res.redirect("/");
});


//route to add new tasks into the database
app.post("/newtodo", function (req, res) {
  console.log("item submitted.");
  //if a task is created, the initial status of the task is set to "todo"
  var newItem = new Todo({ task: req.body.item, status: "todo" });
  Todo.create(newItem, function (err, Todo) {
    if (err) console.log(err);
    else {
      console.log("Inserted item: " + newItem);
    }
  });
  res.redirect("/");
});




//route for changing tasks from todo to doing
app.post("/doing", function (req, res) {
    console.log(req.body);
    var task = req.body.val;
    var condition = { task: req.body.val };
    var status = "";
    Todo.find({}, function (err, list) {
      if (err) console.log("err");
      else {
      //   console.log(list);
        for (var i = 0; i < list.length; i++) {
          if (list[i].task == task) {
            status = "doing";
          }
        }
      }
    });
  //finding the object and changing the status as per the status variable
    Todo.find(condition, function (err, foundObject) {
      if (err) console.log(err);
      else {
        if (!foundObject) console.log("Not found.");
        else {
          foundObject.status = status;
  
          // foundObject.save();
        }
      }
    });
    res.redirect("/");
  });
  
  //route for deleting tasks when done
  app.post("/delete", function (req, res) {
    console.log(req.body.val);
    var task = req.body.val;
    Todo.remove({"task": task});
    res.redirect("/");
  });
  
//for invalid routes
app.get("*", function (req, res) {
  res.send("Invalid page!");
});

//Server listens to port 3000
app.listen(3000, function () {
  console.log("server running on: http://127.0.0.1:3000");
});

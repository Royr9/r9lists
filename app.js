// jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const https = require("express");
const date = require(__dirname + "/date.js");
const app = express();
app.locals._ = _;
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
const day = date.getDate();
 

// mongoose/mongodb database: 
mongoose.set('strictQuery', false);
// to connecto locally:  mongodb://0.0.0.0:27017/todoListDB
mongoose.connect(process.env.DATABASE_URL || "mongodb://0.0.0.0:27017/todoListDB" , {useNewUrlParser: true});

  //atlas cluster:  mongodb+srv://roy-admin1:5ZOyBqWdHniRBpT4@todolistcluster1.r6ene6j.mongodb.net/todoListDB

const itemsSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: [true , "itemsSchema ERROR: No name specified"]
  }
});

const Item = new mongoose.model("Item", itemsSchema);

const item1= new Item({
  name: "Welcome to your new to do list!"
});

const item2 = new Item({
name: "Press the + button to add a new item"
});

const item3 = new Item({
  name: "<-- hit this to delete an item "
  });

  const itemsArray = [item1, item2,item3];


  const listsSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
  });

  const List = new mongoose.model("List", listsSchema);



  
  
  
app.get("/", function(req, res){
Item.find({}, function (err, foundItems) {
  if (err) {
    console.log(".find error: " + err);
  } else if(foundItems.length === 0) {
    Item.insertMany(itemsArray, err => {
      if (err) {
        console.log(`Insertmany error: ${err}`);
      } else {
        console.log("items array sucessfuly added to db ");
       res.redirect("/");
      }
    })
  }else {
    List.find({}, (err, listsFound) =>{
      if (!err) {
      const listArray = listsFound;
      res.render("index" , {listType:"Todo list" ,ListCollection: listArray,    toDoItems: foundItems});
      }
        });
    
  }
})
});



app.get("/lists/:userList", (req,res) => {
const userListName = _.kebabCase(req.params.userList);
List.findOne({name: userListName }, function (err, list) {
  if (err){
    console.log("list.find error: " + err);
  } else if (!list){
    const newUserList = new List({
      name: userListName,
      
    })
    newUserList.save();
   res.redirect(`/lists/${userListName}`);
  } else{   
    List.find({}, (err, listsFound) =>{
      if (!err) {
      const listArray = listsFound;
      res.render("index" , {listType: _.capitalize(_.lowerCase(list.name)) ,ListCollection: listArray, toDoItems: list.items});
      }
        });
  }
});

});



app.post("/", function(req, res){
  const listTitle = _.kebabCase(_.lowerCase(req.body.listTypeName));
  console.log(listTitle);

  const newLi = new Item({
    name: _.capitalize(req.body.newItem)
  });

const homeTitle =  _.kebabCase(_.lowerCase("Todo list"));
console.log(homeTitle);
console.log(listTitle);

  if (listTitle === homeTitle ) {
      newLi.save();
    res.redirect("/");
  } else { 
List.findOne({name: listTitle }, (err,foundList) => {
if (err) {
  console.log(err);
} else {
  foundList.items.push(newLi);
  foundList.save();
  res.redirect("/lists/" + listTitle);
}
});
  }

  
});


app.post("/delete" , function (req ,res) {
 const checkedItemId = req.body.checkbox;
 const listName = _.kebabCase(_.lowerCase(req.body.toDoListName));
 const homeTitle =  _.kebabCase(_.lowerCase("Todo list"));
 if (listName === homeTitle) {
  setTimeout(() => {
    Item.findByIdAndRemove( checkedItemId, err => {
      if (err) {
        console.log("delete POST error: " + err);
      } else {
        res.redirect("/");
      }
     });
  }, 500);
 }   else {
  setTimeout(() => {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err) {
        res.redirect("/lists/" + listName);
      }
    });
  }, 500);
 
}
});

 app.post("/addlist" , function(req,res){
  const userNewList =_.kebabCase(req.body.userNewList); 
  List.findOne({name: userNewList}, (err, foundList) =>{
 if (!err){
  if (!foundList) {
    const newList = new List({
      name: userNewList,
      
    });
    newList.save();
console.log("new List added: " + newList.name);
res.redirect("/lists/" + userNewList);
  } else {
    console.log("list already created: " + foundList.name);
    res.redirect("/lists/" + foundList.name);
  }
 }
  });
 
  
  
  });







app.listen(process.env.PORT || 3000, function(){
  console.log(" Todolist Server has started on port 3000");
});

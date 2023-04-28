const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require('lodash');
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://adminvedansh:Vedansh%401@cluster0.j7vzx4w.mongodb.net/todoDB");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

const todoSchema = new mongoose.Schema({
  itemName: String,
});

const ItemModel = mongoose.model("item", todoSchema);



const item1 = new ItemModel({ itemName: "Buy food" });
const item2 = new ItemModel({ itemName: "Make Notes" });
const item3 = new ItemModel({ itemName: "Watch Movie" });

const defaultItems = [item1, item2, item3];


const listSchema = new mongoose.Schema({
  name: String,
  items: [todoSchema],
});

const ListModel = mongoose.model("List", listSchema);




app.get("/", function (req, res) {
  day = date.getDate();

  ItemModel.find().then((value) => {
    if (value.length === 0) {
      ItemModel.insertMany(defaultItems).then(() => {
        console.log("successfully inserted default items");
        res.redirect("/");
      });
    } else {
      
      res.render("list", { listTitle: day, newListItems: value });
    }
  });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;
  const list = req.body.list;
  const item1 = new ItemModel({ itemName: item });
  if(list === date.getDate()){
    
    ItemModel.create(item1);
  res.redirect("/");
  }
  else
  { ListModel.findOne({name:list}).then((value)=>{
    
      value.items.push(item1);
      value.save();
      res.redirect('/'+list);
    
  }
  )}
});





app.get("/:route", function (req, res) {
  const listTitle  = _.capitalize(req.params.route);
  if (listTitle === 'favicon.ico') {
    return res.sendStatus(204);
  }
 ListModel.findOne({name:listTitle}).then((value,err)=>{
   if (!err) {
    if(value){
      
      res.render("list",{listTitle:listTitle,newListItems:value.items});
    }
    else
    { 
     
      const list = new ListModel({
        name :listTitle,
        items:defaultItems
       
        })
        ListModel.create(list).then(()=>{
 
          res.redirect('/'+listTitle)
        });
     
    }
   }
 })
 
});

app.post("/delete", function (req, res) {
  const checkedBoxItemId = req.body.deleteItem;
  const listName=req.body.listName;
  
  if (listName === date.getDate()) {
    ItemModel.deleteOne({ _id: checkedBoxItemId }).then(() => {
      res.redirect('/');
    });
  }
  else{
    ListModel.findOneAndUpdate({name:listName},{$pull:{items:{_id: checkedBoxItemId}}}).then(()=>{
           res.redirect('/'+listName)
        
      });
      
    }
  
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started at 3000");
});

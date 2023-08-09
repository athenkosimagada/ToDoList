import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import _ from 'lodash';

const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://admin-athenkosi:Test123@cluster0.ycibwdg.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please check your data entry']
  },
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item ({
  name: 'Study Math',
});
const item2 = new Item ({
  name: 'Cook food',
});
const item3 = new Item ({
  name: 'Make cake',
});

const defaultItems = [item1, item2, item3];


async function retrieveItems() {
  try {
    const items = await Item.find({});
    if(items.length == 0) {
      Item.insertMany(defaultItems)
      .then(result => {
        console.log("Save Items!");
      })
      .catch(error => {
        console.error(error);
      });
    }
    return items;
  } catch (err) {
    console.log(err);
  }
}


const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model('List', listSchema);



app.get("/", async (req, res) => {
  const todayTasks = await retrieveItems();
  res.render("list",{ listName: "Today", tasks: todayTasks });
});

app.get("/:customListName", async (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  try {
    const list = await List.findOne({ name: customListName }).exec();
    if (list) {
      res.render("list", { listName: list.name, tasks: list.items });
    } else {
      const newList = new List({
        name: customListName,
        items: defaultItems,
      });
      await newList.save();
      res.redirect("/" + customListName);
    }
  } catch (error) {
    console.log("Error:", error);
  }
});


app.post("/", async (req, res) => {
  const itemName = req.body["title"];
  const listName = req.body.list;
  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    await item.save();
    res.redirect("/");
  } else {
    try {
      const foundList = await List.findOne({ name: listName }).exec();
      if (foundList) {
        foundList.items.push(item);
        await foundList.save();
        res.redirect("/" + listName);
      }
    } catch (err) {
      console.log("Error:", err);
      res.redirect("/" + listName);
    }
  }
});


app.post("/delete", async (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  console.log(checkedItemId);

  if(listName === "Today"){
    try {
      await Item.findByIdAndRemove(checkedItemId);
      console.log("Deleted item with ID:", checkedItemId);
    res.redirect("/");
    } catch (err) {
      console.log("Error deleting item:", err);
      res.redirect("/");
    }
  } else {
    try {
      const updatedList = await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkedItemId } } },
        { new: true }
      );
      
      console.log(updatedList);
      if (updatedList) {
        console.log("Removed item from custom list:", checkedItemId);
        res.redirect("/" + listName);
      } else {
        console.log("Custom list not found");
        res.redirect("/"  + listName);
      }
    } catch (err) {
      console.log("Error removing item from custom list:", err);
      res.redirect("/" + listName);
    }
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];


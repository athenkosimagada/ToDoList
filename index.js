import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

let todayTasks = [];
let workTasks = [];

app.get("/", (req, res) => {
  const date = new Date();
  var data;
  let day = date.getDay();
  day = weekdays[day];

  let month = date.getMonth();
  month = months[month];
  const todayDate = date.getDate();

  data = day + ", " + month + " " + todayDate;

  res.render("index.ejs",{ data, todayTasks });
});

app.get("/work", (req, res) => {
  res.render("work.ejs",{workTasks});
});

app.post("/submit", (req, res) => {
  const newTask = {
    id: todayTasks.length + 1,
    title: req.body["title"],
  }

  todayTasks.push(newTask);
  res.redirect('/');
});

app.post("/check", (req, res) => {
  const newTask = {
    id: workTasks.length + 1,
    title: req.body["title"],
  };

  workTasks.push(newTask);
  res.redirect('/work');
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


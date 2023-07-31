import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

let todayTasks = [];

fs.readFile("./today.txt", "utf8", (err, data) => {
  if(err) throw err;
  const dataArray = data.split('\n');

  // Remove any empty lines from the array (optional).
  const filteredArray = dataArray.filter((line) => line.trim() !== '');
  filteredArray.forEach(task => {
    const newTask = {
      title: task,
    };
    todayTasks.push(newTask);
  });
  // Now you have the data from each line stored in the 'filteredArray'.
  console.log(filteredArray);
  console.log(todayTasks);

});

let workTasks = [];
fs.readFile("./work.txt", "utf8", (err, data) => {
  if(err) throw err;
  const dataArray = data.split('\n');

  const filteredArray = dataArray.filter((line) => line.trim() !== '');

  filteredArray.forEach(task => {
    const newTask = {
      title: task,
    };
    workTasks.push(newTask);
  });
  // Now you have the data from each line stored in the 'filteredArray'.
  console.log(filteredArray);
  console.log(workTasks);
});

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
    title: req.body["title"],
  }

  fs.appendFile("today.txt", newTask.title + '\n', (err) => {
    if(err) throw err;
    console.log("Saved");
  });

  todayTasks.push(newTask);
  res.redirect('/');
});

app.post("/check", (req, res) => {
  const newTask = {
    title: req.body["title"],
  };

  fs.appendFile("work.txt", newTask.title + '\n', (err) => {
    if(err) throw err;
    console.log("Saved");
  });

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


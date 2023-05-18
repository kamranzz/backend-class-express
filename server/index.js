const express = require("express");
var cors = require("cors");
const app = express();
app.use(cors());
const PORT = 7070;
const bodyParser = require("body-parser");
const crypto = require("crypto");
app.use(bodyParser.json());

const fakeData = [
  {
    id: 1,
    name: "Kamran Chelebi"
  },
  {
    id: 2,
    name: "Gulsen Zalova"
  },
];

//STATUS CODES - 200, 204, 401, 404, 500, 201, 202
//BASE API URL
app.get("/api", (req, res) => {
  res.send("Welcome to Our API!");
});

//Get users
app.get("/api/list", (req, res) => {
  const { name } = req.query;
  if (!name) {
    res.status(200).send(fakeData);
  } else {
    const filteredData = fakeData.filter((x) =>
      x.name.toLowerCase().trim().includes(name.toLowerCase().trim())
    );
    res.status(200).send(filteredData);
  }
});
//Get User by ID
app.get("/api/list/:id", (req, res) => {
  const id = req.params.id;
  const user = fakeData.find((x) => x.id == id);
  if (user === undefined) {
    res.status(204).send({
      message: "list not found!",
    });
  } else {
    res.status(200).send(user);
  }
});
//Post User
app.post("/api/list", (req, res) => {
  const { name } = req.body;
  const newUser = {
    id: crypto.randomUUID(),
    name: name,
  };
  fakeData.push(newUser);
  res.status(201).send({
    message: "list created successfully!",
    data: newUser,
  });
});
//Delete User
app.delete("/api/list/:id", (req, res) => {
  const id = req.params.id;
  const deletingUser = fakeData.find((x) => x.id == id);
  let idx = fakeData.indexOf(deletingUser);
  fakeData.splice(idx, 1);
  if (deletingUser === undefined) {
    res.status(204).send("user not found!");
  } else {
    res.status(203).send({
      message: "list deleted successfully!",
    });
  }
});
//Edit User
app.put("/api/list/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  let editingUser = fakeData.find((x) => x.id == id);
  if (name) {
    editingUser.name = name;
  }

  res.status(200).send({
    message: "list updated successfully!",
  });
});

app.listen(PORT, () => {
  console.log(`App running on  PORT: ${PORT}`);
});

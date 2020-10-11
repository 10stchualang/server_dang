const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { register, login } = require("./services/user.services");
const { deCode } = require("./utils/crypto");
const { verifyToken } = require("./utils/jwt");
const bodyParser = require("body-parser");
const { randomAge, randomEmail, randomName } = require('./utils/random')
const User = require('./models/user.model')
const { Promise } = require('bluebird')
// db
mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://localhost:27017/dkm", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("[DB] Database connect successfully");
});

//app
const app = express();

app.use(cors());

app.get("/", (req, res) => res.send("It's working!"));

app.use(async (req, res, next) => {
  try {
    const token = req.header("x-access-token");
    if (!token) return next();
    const data = await verifyToken(token);
    if (!data) return next();
    req.user = data.user;
    next();
  } catch (e) {
    next(e);
  }
});

async function _createList() {
  let arr = []
  for (let i = 0; i < 1000; i++) {
    arr.push(i)
  }

  await Promise.all(arr.map(async e => {
    let user;
    const param = {
      name: randomName(),
      age: randomAge(),
      email: randomEmail(),
      password: null
    }

    user = await User.create(param);
    await user.save();
  }))

  console.log('done')

}

//listuser
_createList();

//login
app.post("/login", bodyParser.json(), async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const token = await login({ password, email });
    res.send({ token });
  } catch (error) {
    next(error);
  }
});

//register
app.post("/register", bodyParser.json(), async function (req, res, next) {
  const { email, password, name } = req.body;
  try {
    const user = await register({ email, name, password });
    console.log(user);
    res.send({ user });
  } catch (error) {
    next(error);
  }
});

//get profile
app.get("/get-profile", bodyParser.json(), async function (req, res, next) {
  if (!req.user) {
    res.send("dkm");
    // next();
  }
  if (req.user) {
    res.send({ user: req.user });
  }
});

app.listen(3333);

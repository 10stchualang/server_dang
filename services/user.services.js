const User = require("../models/user.model");
const generate = require("../utils/generate");
const { hashCode, deCode } = require("../utils/crypto");
const { verifyToken, signToken } = require("../utils/jwt");
const listuser = require("./listuser");

async function createUser({ name, password, email, age }) {
  let user;
  user = await User.findOne({ email });
  if (user) {
    return user;
  }
  if (!user) {
    const param = {
      name,
      password: await hashCode(password),
      email,
      age
    };
    user = await User.create(param);
    await user.save();
    return user;
  }
}
async function _createList() {

  for (let i = 0; i < 1000; i++) {
    let user;
    const param = {
      name: listuser.randomName,
      age: listuser.randomAge,
      email: listuser.randomEmail,
      password: null
    }
    user = await User.create(param);
    await user.save();
    return user;
  }
}

async function login({ email, password }) {
  let user;
  user = await User.findOne({ email });
  if (!user) {
    throw new Error("Account not register");
  }
  if (user) {
    const hasMatch = await deCode(password, user.password);
    if (hasMatch) {
      return await signToken({ user });
    }
  }
}
async function register({ name, password, email, age }) {
  return await createUser({ name, password, email, age });
}

module.exports = { register, login, _createList };

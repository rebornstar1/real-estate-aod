// src/controllers/user.controller.js
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

const usersCollection = () => getDB().collection("users");

const createUser = async (req, res) => {
  const user = req.body;
  console.log("req.body",req.body);
  const query = { email: user.email };
  const existingUser = await usersCollection().findOne(query);
  if (existingUser) {
    return res.send({ message: "user already exist", insertedId: null });
  }
  user.email = user.email.toLowerCase();
  const result = await usersCollection().insertOne(user);
  res.send(result);
};

const getUsers = async (req, res) => {
  const email = req.query.email;
  let query = {};
  if (email) {
    query = { email: email };
  }
  const result = await usersCollection().find(query).toArray();
  res.send(result);
};

const getUserRole = async (req, res) => {
  const email = req.query.email;
  let query = {};
  if (email) {
    query = { email: email };
  }
  console.log("email-getrole",email);
  const result = await usersCollection().findOne(query);
  console.log("result-getrole",result);
  res.send(result?.role);
};

const updateUserRole = async (req, res) => {
  const { id, role } = req.query;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = { $set: { role: role } };
  const result = await usersCollection().updateOne(filter, updateDoc);
  res.send(result);
};

const markUserAsFraud = async (req, res) => {
  const { id, email } = req.query;
  const filter1 = { _id: new ObjectId(id) };
  const filter2 = { agentEmail: email };
  const updateDoc1 = { $set: { role: "fraud" } };
  const updateDoc2 = { $set: { status: "fraud" } };
  
  const result = await usersCollection().updateOne(filter1, updateDoc1);
  const result2 = await getDB().collection("properties").updateMany(filter2, updateDoc2);
  res.send({ result, result2 });
};

module.exports = {
  createUser,
  getUsers,
  getUserRole,
  updateUserRole,
  markUserAsFraud
};
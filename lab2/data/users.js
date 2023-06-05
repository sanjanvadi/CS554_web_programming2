const index = require("./index");
const mongoCollections = require('../config/mongoCollections');
const bcrypt = require("bcryptjs");
const recipes = mongoCollections.recipes;
const users = mongoCollections.users;
// const { ObjectID } = require('mongodb');
const saltRounds = 10;
const validate = require("../helpers");

const createUser = async (name,username,password)=>{
    name = validate.validateName(name);
    username = validate.validateUsername(username);
    password = validate.validatePassword(password);
    let hash = await bcrypt.hash(password, saltRounds);
    const userCollection = await users();
    const existingUser = await userCollection.findOne({
        username: username
    });

    if(existingUser!=null){
        if(existingUser.username.toLowerCase()===username.toLowerCase()){
            throw `user with username ${username} already exists`;
        }
    }

    let newUser={
        name:name,
        username:username,
        password:hash
    }

    const insertInfo = await userCollection.insertOne(newUser);
      if (!insertInfo.acknowledged || !insertInfo.insertedId){
        throw 'Error : Could not add user';
      }
    newUser._id = newUser._id.toString();
    let userTemp = {
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
  }
    return userTemp;
}

const checkUser = async (username, password) => {

    validate.validateUsername(username);
    validate.validatePassword(password);
    const userCollection = await users();
    const user = await userCollection.findOne({
      username: username
    });
    if(user===null){
      throw "Either the username or password is invalid";
    }
    let compare = await bcrypt.compare(password, user.password);
    if(!compare){
      throw "Either the username or password is invalid";
    }
    let userTemp = {
      _id: user._id,
      name: user.name,
      username: user.username,
  }
    return userTemp;
  };

  const getAllUsers = async()=>{
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    if (!userList) throw 'Error : Could not get all recipes';
    userList.forEach(e => {
        e._id=e._id.toString();
    });
    return userList;
  }

module.exports={
    createUser,
    checkUser,
    getAllUsers
}
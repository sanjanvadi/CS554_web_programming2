const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const index = require('../data/index');
const validate = require("../helpers");
client.connect().then(() => {});


router.route('/login')
.post(async (req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    if(req.session.user){
        return res.status(403).json({error:'user already logged in'});
    }
    else{
        try {
            username = validate.validateUsername(username);
            password = validate.validatePassword(password);
        } catch (e) {
            return res.status(400).json({error:e});
        }
        try {
            const user = await index.users.checkUser(username,password);
            if(user){
                await client.set('userId',user._id.toString());
                await client.set('username',user.username.toString());
                req.session.user = {userId : user._id,username:user.username};
            }
            return res.status(200).json(user);
        } catch (e) {
            res.status(401).json({error:e});
        }
    }
});

router.route('/signup')
.post(async (req,res)=>{
    let username = req.body.username;
    let name = req.body.name;
    let password = req.body.password;
    if(req.session.user){
        return res.status(403).json({error:'user already logged in'});
    }
    else{
        try {
            username = validate.validateUsername(username);
            name = validate.validateName(name);
            password = validate.validatePassword(password);
        } catch (e) {
            return res.status(400).json({error:e});
        }
        try {
            const user = await index.users.createUser(name,username,password);
            return res.status(200).json(user);
        } catch (e) {
            res.status(401).json({error:e});
        }
    }
});

router.route('/logout')
.get(async (req,res)=>{
    if(req.session.user){
        try {
            req.session.destroy();
            res.clearCookie('AuthCookie');
            await client.del('userId');
            await client.del('username');
            return res.status(200).json({success:'logout successful'});
        } catch (error) {
            return res.status(500).json({error:error});
        }
    }
    else{
        return res.status(403).json({error:'user not logged in'});
    }
});

router.get('/mostaccessed', async (req, res) => {
    //Display the top 10 recipes
    try {
        const scores = await client.zRange('accessedRecipes', 0, 9,{REV: true});
        let topRecipes = [];
        for(let i=0;i<scores.length;i++){
            topRecipes[i] = JSON.parse(await client.get(`/recipes/${scores[i]}`));
        };

        if(topRecipes.length==0){
            return res.status(404).json("no recipes have been accessed yet");
        }
        else{
            return res.status(200).json(topRecipes);
        }
    } catch (error) {
        return res.status(500).json({error:error});
    }
  });

module.exports = router;
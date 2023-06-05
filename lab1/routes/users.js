const express = require('express');
const router = express.Router();
const index = require('../data/index');
const validate = require("../helpers");


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
        req.session.destroy();
        res.clearCookie('AuthCookie');
        return res.status(200).json({success:'logout successful'});
    }
    else{
        res.status(403).json({error:'user not logged in'});
    }
});

module.exports = router;
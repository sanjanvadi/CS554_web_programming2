const express = require('express');
const app = express();
const configRoutes = require('./routes');
const session = require('express-session');
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => {});
app.use(
  session({
    name: 'AuthCookie',
    secret: 'This is a secret',
    saveUninitialized: false,
    resave: false,
    maxAge: 86400000 //1-day
  })
);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(async (req, res, next) => {
    if(req.body.password && req.body.name){
        console.log({
            name:req.body.name,
            username:req.body.username,
        });
        console.log({
            urlPath:req.originalUrl,
            HTTPverb:req.method
        });
        
    }
    else if(req.body.password && !req.body.name){
        console.log({
            username:req.body.username,
        });
        console.log({
            urlPath:req.originalUrl,
            HTTPverb:req.method
        });
    }
    else{
        console.log(req.body);
        console.log({
            urlPath:req.originalUrl,
            HTTPverb:req.method
        });
    }
    next();
  });

const pathsAccessed = {};
app.use(async (req, res, next) => {
    if (!pathsAccessed[req.path]) pathsAccessed[req.path] = 0;

    pathsAccessed[req.path]++;

    console.log(
        `There have now been ${pathsAccessed[req.path]} requests made to ${
        req.path
        }`
    );
    console.log('---------------------------------------------------------');
    next();
});

app.use(async (req,res,next)=>{
    if(req.session.user){
        next();
    }
    else{
        try {
            let userExists = await client.exists(['userId','username']);
            console.log(userExists);
            if(userExists){
                let userId = await client.get('userId');
                let username = await client.get('username');
                req.session.user = {userId : userId,username:username};
            }
            next();
        } catch (error) {
            return res.status(500).json({error:error});
        }
    }
});

app.use('/recipes', async(req,res,next)=>{
    if(req.method=='GET'){
        try {
            let str = req.originalUrl;
            if(!(str.includes('?page'))){
                str = str+'?page=1'
            }
            let exists = await client.exists(str);
            if(exists){
                // console.log('cached');
                let recipeList = await client.get(str);
                recipeList = JSON.parse(recipeList);
                return res.status(200).json(recipeList);
            }
            else{
                next();
            }
        } catch (error) {
            return res.status(500).json({error:error});
        }
    }
    else{
        next();
    }
});

app.use('/recipes/:id',async(req,res,next)=>{
    if(req.method=='GET'){
        try {
            let str = req.originalUrl;
            let exists = await client.exists(str);
            if(exists){
                // console.log('cached');
                let recipe = await client.get(str);
                // console.log(recipe);
                recipe = JSON.parse(recipe);
            let existsInScoreBoard = await client.zRank(
                'accessedRecipes',
                recipe._id
              );
              if (existsInScoreBoard !== null) {
                console.log('found recipe in sorted set');
                // It has been found in the list so let's increment it by 1
                await client.zIncrBy('accessedRecipes', 1, recipe._id);
              } else {
                console.log('recipe in sorted set NOT found');
                //If the recipe is not found in the list, then we know to add it
                await client.zAdd('accessedRecipes', {
                  score: 1,
                  value: recipe._id,
                });
              }
                return res.status(200).json(recipe);
            }
            else{
                next();
            }
        } catch (error) {
            return res.status(500).json({error:error});
        }
    }
    else{
        next();
    }  
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
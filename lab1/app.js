const express = require('express');
const app = express();
const configRoutes = require('./routes');
const session = require('express-session');
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

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
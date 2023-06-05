const recipesRoute = require('./recipes');
const usersRoute = require('./users');

const constructorMethod = (app) => {
    app.use('/', usersRoute);
    app.use('/recipes', recipesRoute);
  
    app.use('*', (req, res) => {
        return res.status(404).json("Oops! the page you are searching doesn't exist");
    });
  };
  
  module.exports = constructorMethod;
const connection = require('./config/mongoConnection');
const index = require('./data/index');

const main = async () => {
  const db = await connection.dbConnection();
  db.dropDatabase();
  
  // try {
  //   const user = await index.users.createUser("Sanjan Vadi","sanjan123","Qwerty@1234");
  //   console.log(user);
  // } catch (e) {
  //   console.log(e);
  // }

  // try {
  //   const user = await index.users.checkUser("sanjan123","Qwerty@1234");
  //   console.log(user);
  // } catch (e) {
  //   console.log(e);
  // }
// let count=1;
// while(count<=150){
  try {
    const recipe = await index.recipes.createRecipe(`Pasta Bologense`,[`fenne pasta`,"1 egg","heavy cream","onion","tomato puree"],"novice",["boil the pasta for 20 min","Next, fry the onion and tomato, add salt, chilli powder and garam masala","blend the mixture and make fine paste","mix the puree with boiled pasta and serve","add a basil leaf to top it off"],"63d5c921e7b5722c85cbe35b","sanjan123");
    console.log(recipe);
  } catch (e) {
    console.log(e);
  }
//   count++;
// }

// try {
//     const recipes = await index.recipes.getAllRecipes(4);
//     console.log(recipes);
//   } catch (e) {
//     console.log(e);
// }
// try {
//     const users = await index.users.getAllUsers();
//     console.log(users);
//   } catch (e) {
//     console.log(e);
// }

// try {
//     const comment  = await index.recipes.createComment("63d5efaf0773d81fb63ebe1c","Awesome!","63d5c921e7b5722c85cbe35b","sanjan@123");
//     console.log(comment);
// } catch (e) {
//     console.log(e);   
// }

// try {
//   const recipes = await index.recipes.deleteComment('63d5efaf0773d81fb63ebe1b','63d6f857372f8f9ff9327827','63d5c921e7b5722c85cbe35b');
//   console.log(recipes);
// } catch (e) {
//   console.log(e);
// }

// try {
//     const comment  = await index.recipes.likeORUnlikeRecipe("63d5efaf0773d81fb63ebe1c","63d5c921e7b5722c85cbe35b");
//     console.log(comment);
// } catch (e) {
//     console.log(e);   
// }

// try {
//   const recipes = await index.recipes.updateRecipe('63d5efaf0773d81fb63ebe1c',{title:"pest pasta",cookingSkillRequired:"Intermediate"},'63d5c921e7b5722c85cbe35b');
//   console.log(recipes);
// } catch (e) {
//   console.log(e);
// }

connection.closeConnection();

}
main();
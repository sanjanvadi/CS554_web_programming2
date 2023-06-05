const { ObjectId } = require("bson");

function validateName(name) {
    if(!name){
      throw "name Input not provided";
    }
    if(typeof name!=='string'){
      throw "Input must be string";
    }
    if(name.trim().length==0){
      throw "Input cannot be Empty spaces";
    }
    if(!((/^[a-zA-Z]{2,}[ ]{1,1}[a-zA-Z]{2,}$/).test(name.trim()))){
        throw "only letters in name, must have space between firstname and lastname";
    }
    return name.trim();
}
function validatePassword(password) {
    if(!password){
      throw "password Input not provided";
    }
    if(typeof password!=='string'){
      throw "Input must be string";
    }
    if(password.trim().length==0){
      throw "Input cannot be Empty spaces";
    }
    if(!((/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.* ).{6,}$/).test(password))){
      throw "Password should have at least one uppercase character, one lower case character, at least one number, at least one special character and at least 6 characters long";
    }
    return password.trim();
}
function validateUsername(username) {
    if(!username){
      throw "username Input not provided";
    }
    if(typeof username!=='string'){
      throw "Input must be string";
    }
    if(username.trim().length==0){
      throw "Input cannot be Empty spaces";
    }
    if(!((/^[a-zA-Z]+[a-zA-Z0-9]*$/).test(username.trim()))){
        throw "username can only include alphaNumeric characters";
    }
    if(username.trim().length<3){
        throw "Username must have minimum three characters";
    }
    return username.trim().toLowerCase();
}
function validateId(id) {
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Invalid object ID';
    if (!id) throw 'Please provide an ID';
    if(typeof id !== 'string') throw "ID is not a string";
    if(id.length == 0) throw "ID length invalid";
    return id.trim();
}
function validateComment(comment) {
    if(!comment){
        throw "comment Input not provided";
    }
    if(typeof comment !== 'string'){
        throw "Input must be string";
    }
    if(comment.trim().length == 0){
        throw "Input cannot be Empty spaces";
    }
    if(!((/^[a-zA-Z]+[a-zA-Z !',.;"]*$/).test(comment.trim()))){
        throw "only letters in comment";
    }
    return comment.trim();
}
function validateTitle(title) {
    if(!title){
      throw "title Input not provided";
    }
    if(typeof title!=='string'){
      throw "Input must be string1";
    }
    if(title.trim().length==0){
      throw "Input cannot be Empty spaces";
    }
    if(!((/^[a-zA-Z]{3,}[ a-zA-Z]*$/).test(title.trim()))){
        throw "only letters in title minimum three characters";
    }
    return title.trim();
}
function validateIngredients(ingredients) {
    if(!ingredients){
      throw "ingredients Input not provided";
    }
    if(!Array.isArray(ingredients)){
      throw "Input must be an array";
    }
    if(ingredients.length==0 || ingredients.length<3){
      throw "minimum three ingredients required";
    }
    ingredients.forEach(e => {
        if(typeof e!=='string'){
            throw "ingredients must be string";
        }
        if(e.trim().length==0 || e.trim().length<3 || e.trim().length>50){
            throw "ingredients cannot be empty spaces, min 3 char, max 50 char";
        }
        if(!((/([0-9]{0,1})([ a-zA-Z]+)/).test(e.trim()))){
            throw "only letters or number in each ingredients";
        }
        e=e.trim();
    });
    return ingredients;
}
function validateSteps(steps) {
    if(!steps){
      throw "steps Input not provided";
    }
    if(!Array.isArray(steps)){
      throw "Input must be an array";
    }
    if(steps.length==0 || steps.length<5){
      throw "minimum five steps required";
    }
    steps.forEach(e => {
        if(typeof e!=='string'){
            throw "steps must be string";
        }
        if(e.trim().length==0 || e.trim().length<20){
            throw "steps cannot be empty spaces, min 20 char";
        }
        if(!((/^[a-zA-Z]+[a-zA-Z 0-9,]*$/).test(e.trim()))){
            throw "only letters or numbers in each steps";
        }
        e=e.trim();
    });
    return steps;
}
function validateCookingSkillRequired(cookingSkillRequired) {
    if(!cookingSkillRequired){
      throw "skill Input not provided";
    }
    if(typeof cookingSkillRequired!=='string'){
      throw "Input must be string";
    }
    if(cookingSkillRequired.trim().length==0){
      throw "Input cannot be Empty spaces";
    }
    if(!((/^(Novice|Intermediate|Advanced)$/i).test(cookingSkillRequired.trim()))){
        throw "cookingSkillRequired invalid";
    }
    return cookingSkillRequired.trim();
}
module.exports={
    validateName,
    validateUsername,
    validatePassword,
    validateId,
    validateComment,
    validateTitle,
    validateIngredients,
    validateSteps,
    validateCookingSkillRequired
}
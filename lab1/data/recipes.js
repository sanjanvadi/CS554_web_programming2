const index = require("./index");
const mongoCollections = require('../config/mongoCollections');
const recipes = mongoCollections.recipes;
const users = mongoCollections.users;
const validate = require("../helpers");
const { ObjectId } = require("bson");

const createRecipe = async(title,ingredients,cookingSkillRequired,steps,userId,username, customField,fieldValue)=>{
    title = validate.validateTitle(title);
    ingredients = validate.validateIngredients(ingredients);
    cookingSkillRequired = validate.validateCookingSkillRequired(cookingSkillRequired);
    steps = validate.validateSteps(steps);
    userId = validate.validateId(userId);
    username = validate.validateUsername(username);

    const recipeCollection = await recipes();

    let userThatPosted = {
        _id:ObjectId(userId),
        username:username
    }

    let newRecipe = {
        title:title,
        ingredients:ingredients,
        steps:steps,
        cookingSkillRequired:cookingSkillRequired,
        userThatPosted:userThatPosted,
        comments:[],
        likes:[],
        customField:fieldValue
    }

    const insertInfo = await recipeCollection.insertOne(newRecipe);
      if (!insertInfo.acknowledged || !insertInfo.insertedId){
        throw 'Error : Could not add recipe';
      }
    newRecipe._id = newRecipe._id.toString();
    newRecipe.userThatPosted._id = newRecipe.userThatPosted._id.toString(); 
    return newRecipe;
};

const getAllRecipes = async (page) => {
    page= Number(page);
    if(!(Number.isInteger(page))){
        throw "query string parameter needs to be a number";
    }
    if(page==0){
        throw "page number cannot start from 0";
    }
    page = page-1;
    if(page<0){
        throw "page number cannot be less than 0";
    }
    let skipRecipies = page*50;
    const recipeCollection = await recipes();
    const recipeList = await recipeCollection.find().skip(skipRecipies).limit(50).toArray();
    if (!recipeList) throw 'Error : Could not get all recipes';
    recipeList.forEach(e => {
        e._id = e._id.toString();
        e.userThatPosted._id=e.userThatPosted._id.toString();
        if(e.comments.length>0){
            e.comments.forEach(ele => {
                ele._id = ele._id.toString();
                ele.userThatPostedComment._id=ele.userThatPostedComment._id.toString();
            });
        }
    });
    return recipeList;
};

const getRecipeById = async(id)=>{
    id = validate.validateId(id);
    const recipeCollection = await recipes();
    const obj = {
        _id:ObjectId(id)
    }
    const recipe = await recipeCollection.findOne(obj);
    if(!recipe){
        throw "no property with this id found";
    }
    recipe._id = recipe._id.toString();
    recipe.userThatPosted._id= recipe.userThatPosted._id.toString();
    if(recipe.comments.length>0){
        recipe.comments.forEach(ele => {
            ele._id = ele._id.toString();
            ele.userThatPostedComment._id=ele.userThatPostedComment._id.toString();
        });
    }
    return recipe;
}

const updateRecipe =  async(recipeId, updatedRecipe,userId)=>{
    const recipeCollection = await recipes();
    if(typeof updatedRecipe!=='object'){
        throw 'not an object';
    }
    if(Object.keys(updatedRecipe).length<=0){
        throw 'atleast one value required';
    }
    let recipe = await getRecipeById(recipeId);
    if(recipe.userThatPosted._id!==userId){
        throw "only the original user who posted can update this recipe";
    }
    const updatedRecipeData = {};

    if(!updatedRecipe.title&&!updatedRecipe.ingredients&&!updatedRecipe.cookingSkillRequired&&!updatedRecipe.steps){
        throw "Atleast one of the values must be modified";
    }

    if (updatedRecipe.title) {
        updatedRecipe.title=validate.validateTitle(updatedRecipe.title);
        updatedRecipeData.title= updatedRecipe.title;
    }

    if (updatedRecipe.ingredients) {
        updatedRecipe.ingredients=validate.validateIngredients(updatedRecipe.ingredients);
        updatedRecipeData.ingredients= updatedRecipe.ingredients;
    }

    if (updatedRecipe.cookingSkillRequired) {
        updatedRecipe.cookingSkillRequired=validate.validateCookingSkillRequired(updatedRecipe.cookingSkillRequired);
        updatedRecipeData.cookingSkillRequired= updatedRecipe.cookingSkillRequired;
    }

    if (updatedRecipe.steps) {
        updatedRecipe.steps=validate.validateSteps(updatedRecipe.steps);
        updatedRecipeData.steps= updatedRecipe.steps;
    }
    const updatedInfo = await recipeCollection.updateOne({ _id: ObjectId(recipeId) }, { $set: updatedRecipeData });
    if (updatedInfo.modifiedCount === 0) {
        throw 'Error : could not update recipe';
    }
    return await getRecipeById(recipeId);
  }

const createComment = async(id,comment,userId,username)=>{
    id = validate.validateId(id);
    comment = validate.validateComment(comment);
    userId = validate.validateId(userId);
    username = validate.validateUsername(username);
    const recipeCollection = await recipes();

    let userThatPostedComment={
        _id:ObjectId(userId),
        username:username
    }

    let newComment = {
        _id: new ObjectId(),
        userThatPostedComment:userThatPostedComment,
        comment:comment
    }
    const updatedInfo = await recipeCollection.updateOne(
        {_id: ObjectId(id)},
        {$addToSet: {comments: newComment}}
    );

    if (updatedInfo.modifiedCount === 0) {
        throw 'Error : could not add comment to recipe collection';
    }
    return await getRecipeById(id);
}

const deleteComment = async(recipeId,commentId,userId)=>{
    recipeId = validate.validateId(recipeId);
    commentId = validate.validateId(commentId);
    userId = validate.validateId(userId);
    const recipeCollection = await recipes();
    const recipe = await getRecipeById(recipeId);
    let comment;
    if(recipe.comments.length>0){
        recipe.comments.forEach(ele => {
            if(ele._id===commentId){
                comment = ele;
            }
        });
    }
    if(!comment || comment==null || comment==undefined){
        throw "no comment found with given commentId";
    }
    let flag=false;
    if(comment.userThatPostedComment._id===userId){
        flag=true;
    }
    if(!flag){
        throw "invalid user, cannot delete comment"
    }
    else{
        const updatedInfo = await recipeCollection.updateOne({
            _id:ObjectId(recipeId)
        },{
            $pull:{comments:{_id:ObjectId(commentId)}}
        });
        if (updatedInfo.modifiedCount === 0) {
            throw 'Error : could not delete comment';
        }
    }
    const updatedRecipe = await getRecipeById(recipeId);
    return updatedRecipe;
}

const likeORUnlikeRecipe = async(recipeId,userId)=>{
    recipeId = validate.validateId(recipeId);
    userId = validate.validateId(userId);
    let recipe = await getRecipeById(recipeId);
    const recipeCollection = await recipes();

    if(recipe.likes.length==0){
        const updatedInfo = await recipeCollection.updateOne(
            {_id: ObjectId(recipeId)},
            {$addToSet: {likes: userId}}
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'Error : could not like the recipe';
        }
    }
    else{
        let userExists = false;
        recipe.likes.forEach(ele => {
            if(ele===userId){
                userExists=true;
            }
        });
        if(userExists){
            const updatedInfo = await recipeCollection.updateOne(
                {_id: ObjectId(recipeId)},
                {$pull: {likes: userId}}
            );
            if (updatedInfo.modifiedCount === 0) {
                throw 'Error : could not unlike the recipe';
            }
        }
        else{
            const updatedInfo = await recipeCollection.updateOne(
                {_id: ObjectId(recipeId)},
                {$addToSet: {likes: userId}}
            );
            if (updatedInfo.modifiedCount === 0) {
                throw 'Error : could not like this recipe';
            }
        }
    }
    recipe = await getRecipeById(recipeId);
    return recipe;
}

module.exports ={
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    createComment,
    deleteComment,
    likeORUnlikeRecipe
}
const express = require('express');
const router = express.Router();
const index = require('../data/index');
const validate = require("../helpers");

router.route('/')
.get(async (req,res)=>{
    let page = req.query.page || 1
    try{
        page= Number(page);
        if(!(Number.isInteger(page))){
            throw "query string parameter needs to be a number";
        }
        if(page==0){
            throw "page number cannot be 0";
        }
        let pageTemp = page-1;
        if(pageTemp<0){
            throw "page number cannot be less than 0";
        }   
    }catch(e){
        return res.status(400).json({error : e});
    }

    try {
        const recipeList = await index.recipes.getAllRecipes(page);
        if(recipeList.length==0){
            return res.status(404).json({error:"no recipes found"});
        }
        return res.status(200).json(recipeList);
    } catch (e) {
        if(e=='Error : Could not get all recipes'){
            res.status(500).json({error:e});
        }
        else{
            res.status(400).json({error:e});
        }

    }
})
.post(async (req,res)=>{
    let title = req.body.title;
    let ingredients = req.body.ingredients;
    let cookingSkillRequired = req.body.cookingSkillRequired;
    let steps = req.body.steps
    if(req.session.user){
        let userId = req.session.user.userId;
        let username = req.session.user.username;
        try {
            title = validate.validateTitle(title);
            ingredients = validate.validateIngredients(ingredients);
            steps = validate.validateSteps(steps);
            userId = validate.validateId(userId);
            cookingSkillRequired = validate.validateCookingSkillRequired(cookingSkillRequired);
            username = validate.validateUsername(username)
        } catch (e) {
            return res.status(400).json({error:e});
        }

        try {
            const recipe = await index.recipes.createRecipe(title,ingredients,cookingSkillRequired,steps,userId,username);
            return res.status(200).json(recipe);
        } catch (e) {
            if(e=='Error : Could not add recipe'){
                res.status(500).json({error:e});
            }
            else{
                res.status(400).json({error:e});
            }
        }
    }
    else{
        res.status(403).json({error :'user not logged in'});
    }
})

router.route('/:id')
.get(async (req,res)=>{
    let recipeId = req.params.id;
    try {
        recipeId = validate.validateId(recipeId);
    } catch (e) {
        return res.status(400).json({error:e});
    }

    try {
        const recipe = await index.recipes.getRecipeById(recipeId);
        return res.status(200).json(recipe);
    } catch (e) {
        res.status(404).json({error:e});
    }
})
.patch(async (req, res) => {
    if(req.session.user){
        const requestBody = req.body;
        let userId = req.session.user.userId;
        let updatedObject = {};
        let recipeId = req.params.id;

        try {
            recipeId = validate.validateId(recipeId);
            userId = validate.validateId(userId);
        } catch (e) {
            return res.status(400).json({error:e});
        }

        try {
        const oldRecipe = await index.recipes.getRecipeById(req.params.id);
        if (requestBody.title && requestBody.title !== oldRecipe.title)
            updatedObject.title = requestBody.title;
        if (requestBody.ingredients && requestBody.ingredients !== oldRecipe.ingredients)
            updatedObject.ingredients = requestBody.ingredients;
        if (requestBody.steps && requestBody.steps !== oldRecipe.steps)
            updatedObject.steps = requestBody.steps;
        if (requestBody.cookingSkillRequired && requestBody.cookingSkillRequired !== oldRecipe.cookingSkillRequired)
            updatedObject.cookingSkillRequired = requestBody.cookingSkillRequired;
        } catch (e) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        if (Object.keys(updatedObject).length !== 0) {
        try {
            const updatedRecipe = await index.recipes.updateRecipe(
            req.params.id,
            updatedObject,
            userId
            );
            return res.status(200).json(updatedRecipe);
        } catch (e) {
            return res.status(403).json({ error: e });
        }
        } else {
        return res.status(400).json({
            error:
            'No fields have been changed from their inital values, so no update has occurred'
        });
        }
    }
    else{
        res.status(403).json({error :'user not logged in'});
    }
})

router.route('/:id/comments')
.post(async (req,res)=>{
    if(req.session.user){
        let recipeId = req.params.id;
        let comment = req.body.comment;
        let userId = req.session.user.userId;
        let username = req.session.user.username;
        try {
            recipeId = validate.validateId(recipeId);
            comment = validate.validateComment(comment);
            userId = validate.validateId(userId);
            username = validate.validateUsername(username);
        } catch (e) {
            return res.status(400).json({error:e})
        }

        try {
            const recipe = await index.recipes.createComment(recipeId,comment,userId,username);
            return res.status(200).json({recipe});
        } catch (e) {
            return res.status(403).json({error:e});
        }
    }
    else{        
        res.status(403).json({error :'user not logged in'});
    }
})

router.route('/:recipeId/:commentId')
.delete(async (req,res)=>{
    let recipeId = req.params.recipeId;
    let commentId = req.params.commentId;
    if(req.session.user){
        let userId = req.session.user.userId;
        try {
            recipeId = validate.validateId(recipeId);
            commentId = validate.validateId(commentId);
            userId = validate.validateId(userId);
        } catch (e) {
            return res.status(400).json({error:e});
        }

        try {
            const recipe = await index.recipes.deleteComment(recipeId,commentId,userId);
            return res.status(200).json(recipe);
        } catch (e) {
            return res.status(403).json({error:e});
        }
    }
    else{
        res.status(403).json({error :'user not logged in'});
    }
})

router.route('/:id/likes')
.post(async (req,res)=>{
    let recipeId = req.params.id;
    if(req.session.user){
        let userId = req.session.user.userId;
        try {
            recipeId = validate.validateId(recipeId);
            userId = validate.validateId(userId);
        } catch (e) {
            return res.status(400).json({error:e});
        }

        try {
            const recipe = await index.recipes.likeORUnlikeRecipe(recipeId,userId);
            return res.status(200).json(recipe);
        } catch (e) {
            return res.status(403).json({error:e});
        }
    }
    else{
        res.status(403).json({error :'user not logged in'});
    }
})

module.exports = router;
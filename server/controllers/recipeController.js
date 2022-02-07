require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        const food = { latest };
        res.render('index', { title: 'Tarifler - Anasayfa', categories, food });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

/**
 * GET /categories
 * Categories
 */
exports.exploreCategories = async (req, res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Tarifler - Kategoriler', categories });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}

/**
 * GET /categories/:id
 * Categories By Id
 */
exports.exploreCategoriesById = async (req, res) => {
    try {
        const limitNumber = 20;
        const recipes = await Recipe.find({ category: req.params.id }).limit(limitNumber);
        res.render('categories', { title: 'Tarifler - ' + req.params.id, recipes });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
}

/**
 * GET /recipe/:id
 * Recipe
 */
exports.exploreRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        res.render('recipe', { title: recipe.name, recipe });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }

}

/**
 * GET /explore-latest
 * Explore Latest
 */
exports.exploreLatest = async (req, res) => {
    try {
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', { title: 'Explore Latest', recipe })
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
}

/**
 * GET /random-recipe
 * Random Recipe
 */
exports.randomRecipe = async (req, res) => {
    try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne({}).skip(random).exec();
    res.render('recipe', { title: recipe.name, recipe });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
}

/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async (req, res) => {
    const infoErrorObj = req.flash('infoError');
    const infoSuccessObj = req.flash('infoSuccess');
    try {
        res.render('submit-recipe', { title: 'Submit Recipe', infoErrorObj, infoSuccessObj });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
}

/**
 * POST /submit-recipe
 * Submit Recipe
 */
exports.submitRecipePOST = async (req, res) => {
    try {
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if (!req.files || Object.keys(req.files) === 0) {
            console.log('No files uploaded');
        } else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/img/' + newImageName;

            imageUploadFile.mv(uploadPath, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
            });
        }

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });
        await newRecipe.save();
        
        req.flash('infoSuccess', 'Recipe has been added');
        res.redirect('submit-recipe');
    } catch (error) {
        req.flash('infoError', error.message);
        res.redirect('submit-recipe');
    }
}

/**
 * POST /search
 * Search
 */
exports.searchRecipe = async (req, res) => {
    try {
        let recipe = await Recipe.find({ $text: { $search: req.body.searchTerm, $diacriticSensitive: true } });
        res.render('search', { title: 'Search', recipe });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
}





// async function insertDummyCategoryData(){
//     try {
//         await Category.insertMany([
//             {
//                 "name": "Thai",
//                 "image": "thai-food.jpg"
//             },
//             {
//                 "name": "American",
//                 "image": "american-food.jpg"
//             },
//             {
//                 "name": "Chinese",
//                 "image": "chinese-food.jpg"
//             },
//             {
//                 "name": "Mexican",
//                 "image": "mexican-food.jpg"
//             },
//             {
//                 "name": "Indian",
//                 "image": "indian-food.jpg"
//             },
//             {
//                 "name": "Spanish",
//                 "image": "spanish-food.jpg"
//             },
//         ]);
//     } catch (error) {
//         console.error(error);
//     }
// }


// insertDummyCategoryData();



// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "southern-friend-chicken.jpg"
//       },
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Thai",
//         "image": "southern-friend-chicken.jpg"
//       },
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Mexican",
//         "image": "southern-friend-chicken.jpg"
//       },
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Indian",
//         "image": "southern-friend-chicken.jpg"
//       },
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Chinese",
//         "image": "southern-friend-chicken.jpg"
//       },
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "southern-friend-chicken.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();
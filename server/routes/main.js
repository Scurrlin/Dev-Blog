const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET / home
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Dev Blog",
            description: "Simple Blog created with Node.Js, Express and MongoDB."
        }
    
        let perPage = 10;
        let page = req.query.page || 1;
    
        const data = await Post.aggregate([ { $sort: { createdAt: -1 } }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
    
        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
    
        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage: null,
            currentRoute: '/'
        });

    } catch (error) {
      console.log(error);  
    }

});

// GET / post :id
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug});

        const locals = {
            title: data.title,
            descripion: "Simple Blog created with NodeJS, Express and MongoDB.",
        }

        res.render('post', {
            locals,
            data,
            currentRoute: '/post/${slug}'
        });
    } catch (error) {
      console.log(error);  
    }

});

// POST / post - searchTerm
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            descripion: "Simple Blog created with NodeJS, Express and MongoDB.",
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
            ]
        });

        res.render("search", {
            data,
            locals,
            currentRoute: '/'
        });

    } catch (error) {
      console.log(error);  
    }

});

// GET / admin
router.get('/admin', (req, res) => {
    res.render('admin', {
        currentRoute: '/admin'
    });
});

module.exports = router;

const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/comment', withAuth, async (req,res) => {

    const URL = req.headers.referer.split('/').pop()
   
    try {
     const commentData = await Post.findAll({
       logging: false,
       attributes: ['title', 'body', 'createdAt'],
       where: {id:URL},
       include: [
         {
           model: User,
           attributes: ['user_name']
         }
       ],
       order: [['createdAt' , 'ASC']]
     })
   
     const post = commentData.map((post) => post.toJSON())
   
     res.render('post', {
       ...post[0],
       logged_in: req.session.logged_in,
       postID: URL
     });
   
     
     }
     catch(err){
       res.status(500).json(err);
     }
   
   
   })
   
   router.post('/comment', withAuth, async (req,res) => {
   
     const {body,postID} = req.body
   
     try {
       const commentData = await Comment.create({
         body: body, 
         userId: req.session.user,
         postId: postID
        })
   
       res.status(201).end()
   
     }
     catch(err){
       res.status(500).json(err);
     }
   
   
   })
   
   
   router.get('/:id', withAuth, async (req, res, next) => {
   
     try {
       const commentData = await Post.findAll({
         logging: false,
         attributes: ['title', 'body', 'createdAt'],
         where: {id:req.params.id},
         include: [ 
           {
             model:Comment,
             attributes: ['body','createdAt'],
             include: [
               {
                 model: User,
                 attributes: ['user_name']
               }
             ]
           },
           {
             model: User,
             attributes: ['user_name']
           }
         ],
         order: [['createdAt' , 'ASC']]
       })
   
       const post = commentData.map((post) => post.toJSON())
       console.log(post[0]);
   
       res.render('post', {
         ...post[0],
         logged_in: req.session.logged_in,
         areComment: true
       });
     } catch (err) {
       res.status(500).json(err);
     }
   });

   router.post('/new', withAuth, async (req, res) => {
   
    try {
        const newPost = await Post.create({
          title: req.body.title,
          body: req.body.body,
          userId: req.session.user
        })

        res.status(200).end()

    }
    catch(err){

    }
        
    })


   module.exports = router;
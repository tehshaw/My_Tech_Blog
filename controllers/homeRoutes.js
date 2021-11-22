const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const postData = await Post.findAll({
      limit: 10,
      include: [
        {
          model: User,
          attributes: ['user_name'],
        },
      ],
      order: [["createdAt", "DESC"]]
    });


    // const newComment = await Comment.create({body: "testing", userId: 1, postId: 5});

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/posts/comment', withAuth, async (req,res) => {

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

router.post('/posts/comment', withAuth, async (req,res) => {

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


router.get('/posts/:id', withAuth, async (req, res, next) => {

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

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;

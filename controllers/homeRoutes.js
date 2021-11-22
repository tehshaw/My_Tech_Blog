const router = require('express').Router();
const { Post, User, Comment } = require('../models');

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




router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});



router.get('/logout', (req, res) => {

  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(200).redirect('/')
    });
  }else{
    res.status(404).end()
  }

  

});

module.exports = router;




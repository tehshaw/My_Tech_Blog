const router = require('express').Router();
const { Post, User, Comment } = require('../models');
// const withAuth = require('../utils/auth');

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

    // req.session.logged_in = false;

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/posts/:id', async (req, res) => {

  try {
    const commentData = await Comment.findAll({
      attributes: [ 'body' ],
      where: {postId: req.params.id},
      include: [
        {
          model: Post,
          attributes: ['title'],
        },
      ]
    });

    const comments = commentData.map((comment) => comment.get({ plain: true }));

    res.send(comments)

//     res.render('project', {
//       ...project,
//       logged_in: req.session.logged_in
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Use withAuth middleware to prevent access to route
// router.get('/profile', withAuth, async (req, res) => {
//   try {
//     // Find the logged in user based on the session ID
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [{ model: Project }],
//     });

//     const user = userData.get({ plain: true });

    // res.render('profile', {
    //   ...user,
    //   logged_in: true
    // });
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

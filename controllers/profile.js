const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Use withAuth middleware to prevent access to route
router.get('/', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const userData = await User.findByPk(req.session.user, {
        attributes: { exclude: ['password'] },
        include: [
          { model: Post }
        ]
      });
  
      const user = userData.get({ plain: true });
  
      console.log(user.posts);
  
      res.render('profile', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.get('/post', async (req, res) => {

    res.render('addPost')
    
})



module.exports = router;
const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const postRoutes = require('./posts')
const profileRoutes = require('./profile')

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/posts', postRoutes);
router.use('/profile', profileRoutes);

module.exports = router;

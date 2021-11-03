const Post = require("./Post")
const User = require("./User")
const Comment = require("./Comment")


Post.hasMany(Comment, {
    foreignKey: "post_id"
} )
Comment.belongsTo(Post, {
    foreignKey: "post_id"
})


User.hasMany(Post, {
    foreignKey: "user_id"
})
Post.belongsTo(User,{
    foreignKey: "user_id"
})


module.exports = { Post, User, Comment } 
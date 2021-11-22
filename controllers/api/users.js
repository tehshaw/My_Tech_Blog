const router = require('express').Router();
const session = require('express-session');
const { User } = require('../../models');
const withAuth = require('../../utils/auth');


router.post('/', async (req, res) => {

    try{
        const userData = await User.findOrCreate({
            where:{
                email:req.body.email
            },
            defaults:{
                user_name:req.body.name,
                password:req.body.password
            }

        })

        
        // const user = userData.toJSON();
        console.log(userData[0].dataValues.id);

        if(userData[1]){
            req.session.logged_in = true;
            req.session.user = userData[0].dataValues.id
            res.status(200)
        }else{
            res.status(500).json({error:"user already exists"})
        }


    }
    catch(err){
        res.status(400).json(err)
    }


})


router.post("/login", async (req,res) => {

    try{

        const userData = await User.findOne({
            where: {
                email:req.body.email
            }
        })

        const user = userData.toJSON();
        console.log(user);
    
        if(user){
            if(userData.checkPassword(req.body.password)){
                req.session.logged_in = true;
                req.session.user = user.id;

                console.log("logged in!");
                console.log(req.session);
                res.status(200).end();
            }else{
                res.status(500).end();
            }
        }else{
            res.status(500).end();
        }
            
    
    }
    catch(err){
        res.status(500).end();
    }


})




module.exports = router;
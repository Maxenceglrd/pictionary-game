const router = require('express').Router();
const models = require('../models');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const asyncLib = require('async');


const MAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Register route
router.post("/register", function(req,res){
	
	var name = req.body.name;
	var mail = req.body.mail;
	var password = req.body.password;


	// Check that all parameters are given
	if(name == null || mail == null || password == null){
		res.status(400).json({'error': 'missing parameters','name': name,'email':mail, 'password':password});
	}

	// Check validity of parameters
	if(name.length > 25){
		res.status(400).json({'error': "Username's length must be less than 25"});
	}

	if(!MAIL_REGEX.test(mail)) {
		res.status(400).json({'error': "mail is not valid"});
	}
	
	models.Users.findOne({
		attributes: ['mail'],
		where: {mail: mail}
	})
	.then(function(userFound){
		if(!userFound){

			bcrypt.hash(password, 5, function(err, bcryptPassword){
				var newUser = models.Users.create({
					
    				name: name,
    				mail: mail,
    				password: bcryptPassword,
    				isAdmin: false,
    				currentRoom: 0,
    				points: 0
				})
				.then(function(newUser){
          var token = jwtUtils.generateTokenForUser(newUser);
					console.log(req.body.name);
					return res.status(201).json({
						'userId': newUser.id,
            'token': token
					})
				})
				.catch(function(err){
					console.log(err);
					return res.status(500).json({'error': 'cannot add user'});
				})
			});

		}
		else{
			return res.status(409).json({'error': 'user already exists'});
		}

	})
	.catch(function(err){
		return res.status(500).json({'error': 'enable to check user'});
	})
	
});






// Login route 
router.post("/login", function(req,res){
    
    
    var mail = req.body.mail;
    var password = req.body.password;

    console.log(req.body);
    
    
    if(mail == null || password == null){
      return res.status(400).json({'error': 'missing parameters'});
    }

    models.Users.findOne({
    	where: {mail:mail}
    })
    .then(function(userFound){
    	if(userFound){

    		bcrypt.compare(password, userFound.password, function(errBcrypt, resBcrypt){
    			if (resBcrypt) {
            var id = userFound.id;
            var token = jwtUtils.generateTokenForUser(userFound);

    				return res.status(200).json({
    					'userId': id,
    					'token': token
    				});
            
    			}
    			else {
    				res.status(403).json({'error': "invalid password"});
    			}
    		})



    	}
    	else {
    		return res.status(404).json({'error': 'user not exists'});
    	}
    })
    .catch(function(err){
    	return res.status(500).json({'error': 'unable to verify user'});
    });
    
})


// getUserProfile
router.get("/profile", function(req,res){

	var headerAuth = req.headers['authorization'];
	var userId = jwtUtils.getUserId(headerAuth);

	if (userId < 0){
		res.status(400).json({'error': 'wrong token'});
	}

	models.Users.findOne({
		attributes: ['id','name','mail','isAdmin'],
		where : {id:userId}
	}).then(function(user){
		if (user){
			res.status(200).json(user);
		}
		else {
			res.status(404).json({'error': 'user not found'})
		}
	}).catch(function(err){
		res.status(500).json({'error': 'cannot fetch user'});
	});
})

// Update UserProfile
router.put("/profile/modify", function(req,res){

	// Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var name = req.body.name;

    asyncLib.waterfall([
      function(done) {
        models.Users.findOne({
          attributes: ['id', 'name'],
          where: { id: userId }
        }).then(function (userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        if(userFound) {
          userFound.update({
            name: (name ? name : userFound.name)
          }).then(function() {
            done(userFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update user' });
          });
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], function(userFound) {
      if (userFound) {
        return res.status(201).json(userFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update user profile' });
      }
    });
})



module.exports = router;





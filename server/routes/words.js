const router = require('express').Router();
const models = require('../models');


router.get("/words", function(req,res){


    models.Words.findAll()
    .then(function(wordsFound){
        if(wordsFound){
            return res.status(200).json({data:wordsFound});
        }
        else {
            res.status(404).json({'error' : 'no words found'});
        }
    })
    .catch(function(err){
        res.status(500).json({'error': err});
    });

});

router.post("/words/add", function(req,res){

    var value = req.body.value

    models.Words.findOne({
        where: {value: value}
    })
    .then(function(wordFound){
        if(!wordFound){
            var newWord = models.Words.create({
                value: value,                
            })
            .then(function(newWord){
                return res.status(201).json({'success': 'adding success'});
            })
            .catch(function(err){
                return res.status(500).json({'error': 'cannot add word'});
            })
        }

        else {
            return res.status(409).json({'error': 'word already exists'});
        }
    })
    .catch(function(err){
        return res.status(500).json({'error': 'unable to check word'});
    })


});

router.post("/words/delete", function(req,res){

    var id = req.body.id;
    var isAdmin = req.body.isAdmin;

    if(isAdmin){

        models.Words.destroy({
            where: {id: id}
        })
        .then(function(){
            return res.status(200).json({'success':'removed with success'});
        })
    }
    else {
        return res.status(401).json({'error': 'only administrator can delete words'});
    }

});


module.exports = router;
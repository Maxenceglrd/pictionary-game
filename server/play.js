const models = require('./models');

const addParticipant = (userId, roomId, io) => {

    models.Users.findOne({
        where: {id: userId}
        
    })
    .then(function(userFound){
        userFound.update({
            currentRoom: roomId
        }) 
        .then(() => {
            models.Users.findAndCountAll({
                where: {currentRoom:roomId}
            }).then((result) => {io.to(roomId).emit("join", result.count)});
        })    

    })
    
}


const removeParticipant = (userId, roomId, io) => {

    models.Users.findOne({
        where: {id: userId}        
    })
    .then(function(userFound){
        userFound.update({
            currentRoom: 0
        })
        .then(() => {
            models.Users.findAndCountAll({
                where: {currentRoom:roomId}
            }).then((result) => {io.to(roomId).emit("leave", result.count)});
        })
        
    })
    
};



const addAttempt = (word, userId, roomId) => {


    models.Attempts.findOne({
        where: {word: word, userId: userId, roomId:roomId}
    })
    .then(function(AttemptFound){
        if(!AttemptFound){
            var newAttempt = models.Attempts.create({
                word: word,
                userId: userId,
                roomId: roomId,
            })
            .catch(function(err){
                return res.status(500).json({'error': 'cannot add attempt'});
            })
        }

        else {
            return res.status(409).json({'error': 'attempt already exists'});
        }
    })
    .catch(function(err){
        return res.status(500).json({'error': 'unable to check attempt'});
    })
        

};

const removeAttempt = (userId) => {
    
        models.Attempts.destroy({
            where: {userId: userId}
        });

};



const countPoint = (userId, roomId, io) => {
    console.log("Good score");
    // idea for counting : 1000 points / nb of winning
    //var nbAttempts;
    models.Attempts.findAndCountAll({
        where: [{userId: userId, roomId:roomId}]
    }).then((result) => {io.to(roomId).emit("WIN", {score:Math.floor(1000/result.count), userId:userId})});

    
    
}


exports.addAttempt = addAttempt;
exports.countPoint = countPoint;
exports.removeAttempt = removeAttempt;
exports.addParticipant = addParticipant;
exports.removeParticipant = removeParticipant;
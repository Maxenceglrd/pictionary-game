const router = require('express').Router();
const models = require('../models');



// Return all created rooms
router.get("/rooms", function(req,res){

	models.Rooms.findAll()
	.then(function(roomsFound){
		if(roomsFound){
			return res.status(200).json({data:roomsFound});
		}
		else {
			res.status(404).json({'error' : 'no rooms found'});
		}
	})
	.catch(function(err){
		res.status(500).json({'error': 'unable to get rooms'});
	});

})

// Get the required room with correct id
router.get("/rooms/:id", function(req,res){

	var id = req.params.id

	models.Rooms.findOne({
		where: {id: id}
	})
	.then(function(roomsFound){
		if(roomsFound){
			return res.status(200).json({data:roomsFound});
		}
		else {
			res.status(404).json({'error' : 'no room found'});
		}
	})
	.catch(function(err){
		res.status(500).json({'error': 'unable to get room'});
	});

})




// TO DO : set Creator
router.post("/rooms/add", function(req,res){
	var name = req.body.name;
	var maxPlayers = req.body.maxPlayers;
	var privateRoom = req.body.privateRoom;
	var creator = req.body.creator;

	console.log("salut "+creator);
	models.Rooms.findOne({
		attributes: ['name'],
		where: {name: name}
	})
	.then(function(roomFound){
		if(!roomFound){
			var newRoom = models.Rooms.create({
				name: name,
				maxPlayers: maxPlayers,
				currentPlayers:0,
				privateRoom: privateRoom,
				creator: creator,
			})
			.then(function(newRoom){
				return res.status(201).json({'roomId': newRoom.id})
			})
			.catch(function(err){
				return res.status(500).json({'error': 'cannot add room'});
			})
		}

		else {
			return res.status(409).json({'error': 'room already exists'});
		}
	})
	.catch(function(err){
		return res.status(500).json({'error': 'unable to check room'});
	})
});


router.post("/rooms/delete", function(req,res){

	var id = req.body.id;
	var isAdmin = req.body.isAdmin;

	if(isAdmin){
		models.Rooms.destroy({
			where: {id: id}
		})
	}
	else {
		return res.status(401).json({'error': 'only administrator can delete rooms'});
	}

})

router.post("/rooms/history", function(req,res){

	var id = req.body.id;
	var isConnected = req.body.isConnected;
	console.log(id);
	console.log(isConnected);
	if(isConnected){
		models.Rooms.findAll({
		attributes: ['name'],
		where: {creator: id}
		})
		.then(function(roomsFound){
		if(roomsFound){
			console.log("Ok.  " + roomsFound);
			return res.status(200).json({data:roomsFound});
		}
		else {
			res.status(404).json({'error' : 'no rooms found'});
		}
	})
	.catch(function(err){
		res.status(500).json({'error': 'unable to get rooms'});
	});
	}

})


router.post("/rooms/join", function(req,res){
    
    
    var id = req.body.id;
    models.Rooms.findOne({
		where: {id: id}
    	
	})
	.then(function(roomFound){

		if(roomFound.currentPlayers <= roomFound.maxPlayers){
			roomFound.update({
				currentPlayers: roomFound.currentPlayers+1
			})
			.then(function(updatepRoom){
				return res.status(201).json({'success': 'room updated'})
			})
			.catch(function(err){
				return res.status(500).json({'error': 'cannot update room'});
			})
		}

		else {
			return res.status(409).json({'error': 'room is full'});
		}
	})
	.catch(function(err){
		return res.status(500).json({'error': 'unable to check room'});
	})


   

});

router.post("/rooms/leave", function(req,res){
    
    
    var id = req.body.id;
    models.Rooms.findOne({
		where: {id: id}
    	
	})
	.then(function(roomFound){

		
		roomFound.update({
			currentPlayers: roomFound.currentPlayers-1
		})
		.then(function(updatepRoom){
			return res.status(201).json({'success': 'room updated'})
		})
		.catch(function(err){
			return res.status(500).json({'error': 'cannot update room'});
		})
	})
	.catch(function(err){
		return res.status(500).json({'error': 'unable to check room'});
	})


   

});




module.exports = router;
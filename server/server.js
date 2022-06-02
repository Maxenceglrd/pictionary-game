var express = require('express');
var sys = require('util');
var mysql = require('mysql');
var cors = require('cors');
var jwt = require('jsonwebtoken');

// Import models
const models = require('./models');


// Import route
const authRoute = require('./routes/auth');
const roomsRoute = require('./routes/rooms');
const wordsRoute = require('./routes/words');

// Import functions module
const attemptFunction = require('./play');


// Initialize server and socket
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);




app.use(cors());
app.use(express.json({ limit: '1mb'}));


// Routers
app.use('/api', authRoute);
app.use('/api', roomsRoute);
app.use('/api', wordsRoute);





io.sockets.on('connection', (socket) => {
  
  console.log('Sucessfull real time communication');
  

  socket.on('join', (data) => {
    socket.join(data.roomId);
    attemptFunction.addParticipant(data.userId, data.roomId, io);
  });

  socket.on('leave', (data) => {
    attemptFunction.removeParticipant(data.userId, data.roomId, io);
  })

  socket.on('SEND_MESSAGE', message => {
    attemptFunction.addAttempt(message.message, message.userId, message.roomId);    
    io.to(message.roomId).emit('RECEIVE_MESSAGE', message);
    
  });


  socket.on('SEND_DRAW', (draw) => {
    io.to(draw.roomId).emit('RECEIVE_DRAW', draw.draw);
  });


  socket.on('NEW_WORD', (word) => {
    io.to(word.roomId).emit('NEW_WORD', word.word);
    io.to(word.roomId).emit('LOADED');

  })

  socket.on('WIN', (data) => {
    attemptFunction.countPoint(data.userId, parseInt(data.roomId), io);
    attemptFunction.removeAttempt(data.userId);
  });


  socket.on('disconnect', () => {
    console.log('disconnect');
    io.emit('disconnect');
  });


  socket.on('line', data => {
  
    const lineCoordinates = data.lineCoordinates;
    io.to(data.roomId).emit('line', { 
          lineWidth: data.lineWidth,
          lineColor: data.lineColor,
          lineCoordinates
      });
    });


  socket.on('CLEAR', data => {
    io.to(data.roomId).emit('CLEAR');
  })

  
  

});







http.listen(8000);

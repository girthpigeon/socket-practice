var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

var userConnected = false;
var nickname = generateName();

function generateName() {
    return Math.floor((Math.random() * 999999999) + 1);
}

io.on('connection', function(socket){

  if (userConnected === false){
      console.log('new user connected');
      io.emit('chat message', nickname + " connected");
      userConnected = true;
  }
  
  socket.on('chat message', function(msg){
    msg = nickname + ": " + msg;
    console.log(msg);
    io.emit('chat message', msg);
  });

  socket.on('name change', function(msg){
    console.log(nickname + " changed their name to: " + msg);
    io.emit('chat message', nickname +" changed their name to: " + msg);
    nickname = msg;
  });
  
  socket.on('disconnect', function(){
    io.emit('chat message', nickname +' disconnected');
  });
})

http.listen(3000, function(){
  console.log('listening on 3000');
});

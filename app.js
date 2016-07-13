var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , server  = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , port = process.env.PORT || 3000 ;

app.set('views', __dirname + '/views');
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('./controllers')(io));

server.listen(port, function() {
  console.log('Listening on port ' + port);
});

var user = {
  id:'',
  room:'',
  avatar:''
};

io.on('connection',function(socket){
  console.log('New connection');

  socket.on('join-room',function(room){
    socket.join(room);
    socket.room = room;
    socket.broadcast.to(socket.room).emit('user-joined','User Joined');

    var roomMembers = socket.adapter.rooms[socket.room];
    console.log(socket);
    console.log(roomMembers);
    if(roomMembers && roomMembers.sockets){
      socket.emit('user-list', Object.keys(roomMembers.sockets).map((key)=> key ));
      socket.emit('user-list', socket.id);
    }

  });

  socket.on('username-change',function(newUsername){
    socket.broadcast.to(socket.room).emit('username-changed',{
      'new' : newUsername,
      'old' : socket.username
    });
  });

  socket.on('send-message',function(message){
    if(socket.room){
      socket.broadcast.to(socket.room).emit('get-message','@'+socket.room+' : ' + message);
    }
  });

  socket.on('disconnect',function(){
    socket.broadcast.to(socket.room).emit('user-left','User left');
    console.log('user disconnected');
  });
});




//

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

var users = {};

io.on('connection',function(socket){
  console.log('New connection '+ socket.id);

  socket.on('join-room',function(room){
    socket.join(room);

    var userObj = {
      id: socket.id,
      room: room,
      username: 'Agent '+ Math.round(Math.random()*100),
      avatar: 'default'
    };
    users[socket.id] = userObj;

    socket.broadcast.to(room).emit('user-joined', userObj);

    var getRoomMembers = function(roomObj){
      var roomMembers = (roomObj && roomObj.sockets) ? (roomObj.sockets) : '';
      if(roomMembers){
        for(var key in roomMembers){
          roomMembers[key] = users[key];
        }
        return roomMembers;
      }
      return null;
    };

    socket.emit('user-list', {
      myId: socket.id,
      users: getRoomMembers(socket.adapter.rooms[room])
    });

  });

  socket.on('username-change',function(newUsername){
    users[socket.id].username = newUsername;
    socket.broadcast.to(users[socket.id].room).emit('username-changed',{
      'id': socket.id,
      'new' : newUsername
    });
  });

  socket.on('send-message',function(message){
      socket.broadcast.to(users[socket.id].room).emit('get-message',{
        id: socket.id,
        message: message
      });
  });

  socket.on('disconnect',function(){
    if(socket.id && users[socket.id]){
      socket.broadcast.to(users[socket.id].room).emit('user-left', {
         id: socket.id
       });
      console.log('user disconnected ' + socket.id);
      delete users[socket.id];
    }
  });

  socket.on('send-buzz',function(){
      socket.broadcast.to(users[socket.id].room).emit('buzz',socket.id);
  });
});
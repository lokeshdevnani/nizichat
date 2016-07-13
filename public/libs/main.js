$(document).ready(function(){
    var socket = io();
    var hashId = $("#hash-id").text();

    socket.emit('message',"hello server");
    socket.emit('join-room',hashId);

    socket.on('connect',function(){
        console.log("I am connected to server");
    });

    socket.on('user-joined',function(user){
        console.log(user);
    });

    socket.on('user-left',function(user){
        console.log(user);
    });

    socket.on('user-list',function(users){
        console.log(users);
    });

    socket.on('get-message',function(message){
        $("#messages").append('<p>'+ message +'</p>');
        console.log(message);
    });

    $("#send-form").submit(function(e){
        e.preventDefault();
        var message = $("#message").val();
        socket.emit('send-message', message );
    });
});

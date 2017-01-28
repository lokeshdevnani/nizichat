$(document).ready(function(){
    var socket = io();
    var hashId = $("#hash-id").text();

    function Users(){
        var users = {};
        var myId;

        function initializeList(u){
            users = u.users;
            myId = u.myId;
        }
        function getMyId(){
            return myId;
        }
        function logList(){
            console.log(users);
        }
        function addUser(u){
            users[u.id] = u;
            displayList();
        }
        function removeUser(u){
            delete users[u.id];
            displayList();
        }
        function get(id, property){
            return users[id][property];
        }
        function getUsers(){
            return users;
        }
        function getUsername(id){
            return users[id]['username'];
        }
        function changeUsername(id, username){
            users[id].username = username;
        }
        return {
            initialize: initializeList,
            addUser: addUser,
            removeUser: removeUser,
            get: get,
            getUsername: getUsername,
            changeUsername: changeUsername,
            getUsers: getUsers,
            getMyId: getMyId,
            logList: logList
        };
    }

    $("#messages").slimScroll({
        height: '100%'
    });

    var userObj = new Users();

    function displayMessage(isMine, msgObj){
        var html =
        '    <div class="convo '+ ((isMine)?'mine':'others') +'">' +
        '        <span class="username"> '+ ((isMine) ? 'Me' : userObj.getUsername(msgObj.id)) + ' </span>' +
        '        <img src="/img/avatars/anonymous.jpg" class="avatar">' +
        '        <span class="message"> '+ msgObj.message + ' </span>' +
        '    </div>' ;
        var elem = $(html).hide();
        $("#messages").append(elem.fadeIn('slow'));
        scrollToBottom();
    }

    function scrollToBottom(){
        $("#messages").animate({scrollTop: $("#messages")[0].scrollHeight },1500);
    }

    function displayList(){
        var allUsers = userObj.getUsers();
        var me = userObj.getMyId();
        $("#user-list").html('');
        for(var user in allUsers){    
            if(user!=me)
                $("#user-list").append('<div>'+ allUsers[user].username +'</div>');
            else {
                $("#user-list").append('<div>'+ '<strong>Me</strong>' +'</div>');
            }
        }
    }

    function displayUpdate(message){
        $("#messages").append("<div class=room-update>"+ message +"</div>");
        scrollToBottom();
    }

    socket.on('connect',function(){
        console.log("I am connected to server");
    });

    socket.emit('join-room',hashId);

    socket.on('user-list',function(users){
        userObj.initialize(users);
        displayList();
        $("#username-change").val(userObj.getUsername(userObj.getMyId()));
    });

    socket.on('user-joined',function(user){
        userObj.addUser(user);
        displayUpdate(user.username + " joined");
    });

    socket.on('user-left',function(user){
        displayUpdate( userObj.getUsername(user.id) + " left");
        userObj.removeUser(user);
    });

    socket.on('get-message',function(messageObj){
        displayMessage(false, messageObj);
    });

    function sendMessage(){
        var message = ($("#message").val()).trim();
        if(message){
            displayMessage(true, {message: message});
            socket.emit('send-message', message );
            $("#message").val('').focus();
        }
    }

    $("#send-form").submit(function(e){
        e.preventDefault();
        userObj.logList();
        sendMessage();
    });
    $("#message").on('keyup',function(e){
        if(e.keyCode=="13" && !e.shiftKey)
            sendMessage();
    });

    $("#send-buzz").click(function(){
        socket.emit('send-buzz');
    });

    socket.on('buzz',function(uid){
        displayUpdate(userObj.getUsername(uid) + " buzzed");
        $("#chatbox").addClass('buzz');
        setTimeout(function(){
            $("#chatbox").removeClass('buzz');
        },1000);
    });

    $("#username-change").change(function(){
        var username = $(this).val();
        socket.emit("username-change",username);
    });

    socket.on("username-changed",function(obj){
        displayUpdate(userObj.getUsername(obj.id) + "'s nick has been changed to " +obj.new);
        userObj.changeUsername(obj.id, obj.new);
    });

});

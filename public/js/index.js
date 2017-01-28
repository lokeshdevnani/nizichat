$(document).ready(function(){
  var startChat = function(){
    var secret = $("#input-secret").val();
    secret = secret.trim();
    if(secret=="")
      return;
    location = '/@'+secret;
  }
  $("#input-secret").on('keyup',function(e){
        if(e.keyCode=="13" && !e.shiftKey)
            startChat();
  });
  $("#btn-start-chat").click(startChat);

});

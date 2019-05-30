$(document).ready(function(){

  $("#removeFriends").on('click', function(){
    friendCall("/removeUserFriends");
  });

  $("#addFriends").on('click', function(){
    friendCall("/assignUserFriends");
  });

  function friendCall(url){
    var selected = [];
    $('input:checked').each(function() {
      selected.push($(this).data('user_id'));
    });

    if(selected.length > 0){
      $.ajax({
        type: "POST",
        url: url,
        data: {friends: selected}, // serializes the form's elements.
        success: function(response){
          if(response.code === "E_WRONG_PASSWORD"){
            alert(response.message);
          }
          else if (response.code === "OK"){
            window.location = "/myFriends"
          }
        },
        error: function(data){
          alert("Something went wrong on server.");
        }
      });
    }
  }
});

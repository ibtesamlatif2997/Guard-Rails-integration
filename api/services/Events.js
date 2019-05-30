sails.on('UserEvent', function(user){
  console.log("user event");
  EmailService.sendWelcomeMail(user);
});

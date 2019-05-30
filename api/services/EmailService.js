

module.exports = {
  sendWelcomeMail: function(user) {
    sails.hooks.email.send(
      "welcomeEmail",
      {
        Name: user.first_name + " " + user.last_name
      },
      {
        to: user.email,
        subject: "Welcome Email"
      },
      function(err) {console.log(err || "Mail Sent!");}
    )
  }
}

/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  getUsers: function(req, res){
    Users.find({
      id: {'!=': req.user.id}
    })
    .then(function(users){
      res.view("pages/usersList", {users: users, isCheckList: false});
    })
    .catch(function(err){
      res.view("500.ejs");
    })
  },

  getFriends: function(req, res){
    sails.sendNativeQuery('SELECT users.* FROM users join userfriends uf ON uf.friend = users.id Where user_id = $1', [req.user.id] ,function(err, users) {
      if (err) {
        console.log(err);
        return res.view("500.ejs");
      }

      sails.sendNativeQuery('SELECT users.* FROM users Where id != $1 AND id NOT IN (select friend from userfriends where user_id = $1)', [req.user.id, req.user.id] ,function(err, notFriends) {
        if (err) {
          return res.view("500.ejs");
        }
        return res.view("pages/friends", {users: users.rows, notFriends: notFriends.rows, isCheckList: true});
      });

    });
  },

  assignUserFriends: function(req, res) {
    var friends = req.param("friends");
    var data = friends.map(function(friend){
      return {
        user_id: req.user.id,
        friend: friend
      };
    })
    UserFriends.createEach(data)
    .fetch()
    .then(function(result){
      res.ok(result);
    })
    .catch(res.serverError);
  },

  removeUserFriends: function(req, res) {
    UserFriends.destroy({user_id: req.user.id, friend: req.param("friends")})
    .then(function(result){
      res.ok(result);
    })
    .catch(res.serverError);
  },

};

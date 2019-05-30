/**
* AuthController
*
* @description :: Server-side actions for handling incoming requests.
* @help        :: See https://sailsjs.com/docs/concepts/actions
*/

var passport = require('passport');

/**
* Triggers when user authenticates via passport
* @param {Object} req Request object
* @param {Object} res Response object
* @param {Object} error Error object
* @param {Object} user User profile
* @param {Object} info Info if some error occurs
* @private
*/
function _onPassportAuth(req, res, error, user, info) {
  if (error) return res.serverError(error);
  if (!user) return res.unauthorized(null, info && info.code, info && info.message);

  req.session.user = user;

  return res.ok({
    // TODO: replace with new type of cipher service
    token: CipherService.createToken(user),
    user: user
  });
}

module.exports = {

  /**
  * Sign in by facebook strategy in passport
  * @param {Object} req Request object
  * @param {Object} res Response object
  */
  facebookAuthCallback: function (req, res) {
    passport.authenticate('facebook', function(err, user, info){
      console.log("facebook");
      console.log(err);
      console.log(user);
      console.log(info);
    });
  },

  /**
  * Sign in by facebook strategy in passport
  * @param {Object} req Request object
  * @param {Object} res Response object
  */
  facebookAuth: function (req, res) {
    console.log("facebookAuth");
    passport.authenticate('facebook')(req, res);;
  },

  /**
  * Sign in by local strategy in passport
  * @param {Object} req Request object
  * @param {Object} res Response object
  */
  signin: function (req, res) {
    passport.authenticate('local', _onPassportAuth.bind(this, req, res))(req, res);
  },


  /**
  * logout the user
  * @param {Object} req Request object
  * @param {Object} res Response object
  */
  logout: function (req, res) {
    delete req.session.user;
    return res.redirect('/');
  },

  /**
  * Sign up in system
  * @param {Object} req Request object
  * @param {Object} res Response object
  */
  signup: function (req, res) {

    Users.findOne({ 'or': [ {email: req.param('email')}, {user_name: req.param('user_name')}] })
    .exec(function (error, user){
      if (error) return res.serverError;
      if(null == user){
        Users
        .create(_.omit(req.allParams(), 'id'))
        .fetch()
        .then(function (created_user) {
          sails.emit('UserEvent', created_user);
          return {
            // TODO: replace with new type of cipher service
            token: CipherService.createToken(created_user),
            user: user
          };
        })
        .then(res.created)
        .catch(res.serverError);
      }
      else {
        if(req.param('user_name') == user.user_name){
          res.unqiueViolation({field_name: 'user name', field_value: req.param('user_name')});
        }
        else if(req.param('email') == user.email){
          res.unqiueViolation({field_name: 'email', field_value: req.param('email')});
        }
      }
    });
  },

};

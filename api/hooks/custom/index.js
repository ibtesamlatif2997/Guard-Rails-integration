/**
* custom hook
*
* @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
* @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
*/

var passport = require('passport');
var routes_to_dismiss = [
  "/",
  "/signup",
  "/signin",
  "/register",
  "/auth/facebook",
  "/auth/facebook/callback"
]

module.exports = function defineCustomHook(sails) {

  return {

    /**
    * Runs when a Sails app loads/lifts.
    *
    * @param {Function} done
    */
    initialize: async function (done) {

      sails.log.info('Initializing hook... (`api/hooks/custom`)');

      // ... Any other app-specific setup code that needs to run on lift,
      // even in production, goes here ...

      return done();

    },


    routes: {

      /**
      * Runs before every matching route.
      *
      * @param {Ref} req
      * @param {Ref} res
      * @param {Function} next
      */
      before: {
        '/*': {
          skipAssets: true,
          fn: async function(req, res, next){
            res.locals.login = false;

            var url = require('url');

            if(routes_to_dismiss.indexOf(req.url) != -1){
              return next();
            }
            if(req.headers["authorization"]){
              passport.authenticate('jwt', function (error, user, info) {
                if (error) return res.serverError(error);
                if (!user) return res.unauthorized(null, info && info.code, info && info.message);
                req.user = user;
                return next();

              })(req, res);
            }
            else{
              // No session? Proceed as usual.
              // (e.g. request for a static asset)
              if (!req.session) { return res.redirect("/"); }

              // Not logged in? Proceed as usual.
              if (!req.session.user) { return res.redirect("/"); }

              // Otherwise, look up the logged-in user.
              var loggedInUser = await Users.findOne({
                id: req.session.user.id
              });

              // If the logged-in user has gone missing, log a warning,
              // wipe the user id from the requesting user agent's session,
              if (!loggedInUser) {
                sails.log.warn('Somehow, the user record for the logged-in user (`'+req.session.user.id+'`) has gone missing....');
                delete req.session.user;
                return res.redirect("/");
              }

              req.user = loggedInUser;
              res.locals.login = true;

              return next();
            }
          }
        }
      }
    }


  };

};

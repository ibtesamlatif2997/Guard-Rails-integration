/**
 * Users.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    first_name: {
      type: "string",
      maxLength: 255
    },
    last_name: {
      type: "string",
      maxLength: 255
    },
    user_name: {
      type: "string",
      maxLength: 255,
      unique: true
    },
    email: {
      type: "string",
      maxLength: 255,
      unique: true
    },
    password: {
      type: "string",
      protect: true,
    }
  },
  customToJSON: function() {
    var obj = this;
    delete obj.password;
    return obj;
  },
  beforeUpdate: function (values, next) {
    Users.findOne(values.id)
    .then(function(user){
      if(null == user){
        next();
      }
      else if(values.password && user.password == values.password){
        next();
      }
      else{
        CipherService.hashPassword(values)
        .then(function(){ next(); })
        .catch(function(){ next(); });
      }
    })
    .catch(function(){
      next();
    });
  },
  beforeCreate: function (values, next) {
    CipherService.hashPassword(values)
    .then(function(){ next(); })
    .catch(function(){ next(); });
  }

};

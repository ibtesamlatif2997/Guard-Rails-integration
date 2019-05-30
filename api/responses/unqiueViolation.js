/**
* Unique key violation
*
* General status code. Most common code used to indicate success.
* The actual response will depend on the request method used.
* In a GET request, the response will contain an entity corresponding to the requested resource.
* In a POST request the response will contain an entity describing or containing the result of the action.
*/

module.exports = function (data, code, message, root) {
  var response = _.assign({
    code: code || 'E_UNIQUE_FIELD_VIOLATION',
    message: message || 'The value already exists',
    data: data || {}
  }, root);

  this.req._sails.log.silly('Sent unique key violation \n', response);

  this.res.status(200);
  this.res.json(response);
};

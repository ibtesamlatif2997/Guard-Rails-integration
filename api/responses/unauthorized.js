/**
* 401 (Unauthorized) Response
*
* Similar to 403 Forbidden.
* Specifically for use when authentication is possible but has failed or not yet been provided.
* Error code response for missing or invalid authentication token.
*/

module.exports = function (data, code, message, root) {
  var response = _.assign({
    code: code || 'E_UNAUTHORIZED',
    message: message || 'Missing or invalid authentication token',
    data: data || {}
  }, root);

  this.res.status(200);
  this.res.json(response);
};

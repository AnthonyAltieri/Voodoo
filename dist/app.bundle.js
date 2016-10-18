/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Panic = __webpack_require__(2);

	var _Panic2 = _interopRequireDefault(_Panic);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SERVER_PREFIX = 'http://159.203.234.179'; /**
	                                               * @author Anthony Altieri on 10/15/16.
	                                               */

	var HEARTBEAT_ENDPOINT = 'http://159.203.234.179/isAlive';
	var FIVE_SECONDS = 5;
	var ONE_SECOND = 1;
	var TWO_SECONDS = 2;
	var ONE_THIRD_SECOND = 0.33;
	var TYPE = 'POST';

	var panic = void 0;

	function test() {
	  panic = new _Panic2.default(HEARTBEAT_ENDPOINT, TYPE, FIVE_SECONDS, ONE_THIRD_SECOND);
	}

	var testButton = document.createElement('button');
	testButton.onclick = test;
	document.body.appendChild(testButton);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Anthony Altieri on 10/14/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Bharat Batra on 10/14/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _Heartbeat = __webpack_require__(3);

	var _Heartbeat2 = _interopRequireDefault(_Heartbeat);

	var _Ajax = __webpack_require__(4);

	var _Storage = __webpack_require__(5);

	var Storage = _interopRequireWildcard(_Storage);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FLATLINE = 'flatline';

	var Panic = function () {
	  function Panic(heartbeatEndpoint, type, secondsPerBeat) {
	    var panicSecondsPerBeat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

	    _classCallCheck(this, Panic);

	    console.log('init()');
	    if (typeof heartbeatEndpoint === 'undefined') {
	      throw new Error('Must have a valid heartbeat endpoint');
	    }
	    this.panicMilisecondsPerBeat = panicSecondsPerBeat;
	    this.heartbeat = new _Heartbeat2.default(heartbeatEndpoint, type, secondsPerBeat);
	  }

	  _createClass(Panic, [{
	    key: 'get',
	    value: function get(url, params) {
	      var withCredentials = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	      this.http('GET', url, params, withCredentials);
	    }
	  }, {
	    key: 'post',
	    value: function post(url, params) {
	      var withCredentials = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	      this.http('POST', url, params, withCredentials);
	    }
	  }, {
	    key: 'http',
	    value: function http(type, url, params, withCredentials) {
	      var _this = this;

	      if (this.heartbeat.isAlive) {
	        // If the heartbeat is alive send the HTTP request
	        (0, _Ajax.send)(type, url, params, withCredentials);
	      } else {
	        // If the heartbeat is dead, determine if panic mode as been enabled
	        if (!this.isPanic) {
	          (function () {
	            _this.isPanic = true;
	            _this.heartbeat.beginPanic();
	            _this.crashcart = window.setInterval(function () {
	              _this.heartbeat.beat();
	            }, _this.panicMilisecondsPerBeat);
	            var unsubscribe = _this.heartbeat.subscribe(function () {
	              clearInterval(_this.crashcart);
	              _this.isPanic = false;
	              _this.heartbeat.endPanic();
	              var flatlineActions = Storage.get(FLATLINE);
	              if (typeof flatlineActions !== 'undefined') {
	                flatlineActions.forEach(function (a) {
	                  // TODO: Deal with dead data
	                  var _a$split = a.split('&');

	                  var _a$split2 = _slicedToArray(_a$split, 2);

	                  var toCall = _a$split2[0];
	                  var time = _a$split2[1];

	                  var type = toCall.split(':')[0];

	                  var _toCall$split = toCall.split(',');

	                  var _toCall$split2 = _slicedToArray(_toCall$split, 3);

	                  var url = _toCall$split2[0];
	                  var params = _toCall$split2[1];
	                  var withCredentials = _toCall$split2[2];

	                  switch (type) {
	                    case 'GET':
	                      {
	                        _this.get(url, params, withCredentials);
	                        break;
	                      }
	                    case 'POST':
	                      {
	                        _this.post(url, params, withCredentials);
	                        break;
	                      }
	                  }
	                });
	              }
	              unsubscribe();
	            });
	            Storage.set(FLATLINE, '[]');
	          })();
	        }
	        var flatline = Storage.get(FLATLINE);
	        Storage.set([].concat(_toConsumableArray(flatline), [type + ':' + url + ',' + params + ',' + withCredentials + '&time:' + new Date().getTime()]));
	      }
	    }
	  }]);

	  return Panic;
	}();

	exports.default = Panic;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Anthony Altieri on 10/14/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Bharat Batra on 10/14/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _Ajax = __webpack_require__(4);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Heartbeat = function () {
	  function Heartbeat(heartbeatEndpoint, type) {
	    var secondsPerBeat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

	    _classCallCheck(this, Heartbeat);

	    this.source = heartbeatEndpoint;
	    this.isAlive = false;
	    this.listeners = [];
	    this.milisecondsPerBeat = secondsPerBeat * 1000;
	    this.beatType = type;
	    this.keepAlive(type);
	  }

	  _createClass(Heartbeat, [{
	    key: 'beginPanic',
	    value: function beginPanic() {
	      if (typeof this.pacemaker !== 'undefined') {
	        clearInterval(this.pacemaker);
	      }
	    }
	  }, {
	    key: 'endPanic',
	    value: function endPanic() {
	      this.keepAlive(this.beatType);
	    }
	  }, {
	    key: 'keepAlive',
	    value: function keepAlive(type) {
	      var _this = this;

	      console.log('keep Alive');
	      this.pacemaker = window.setInterval(function () {
	        _this.beat(type);
	      }, this.milisecondsPerBeat);
	    }
	  }, {
	    key: 'beat',
	    value: function beat() {
	      var _this2 = this;

	      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GET';

	      console.log('beat');
	      var notFourHundred = function notFourHundred(n) {
	        return n < 400 && n > 499;
	      };
	      (0, _Ajax.send)(type, this.source).then(function (response) {
	        console.log('send.then()');
	        var code = response.code;

	        if (typeof code === 'undefined') {
	          throw new Error('response code should not be undefined');
	        }
	        _this2.isAlive = notFourHundred(response.code);
	        // If there are listeners waiting for the heartbeat to become
	        // alive again then execute them
	        if (_this2.isAlive && _this2.listeners.length > 0) {
	          _this2.listeners.forEach(function (l) {
	            l();
	          });
	        }
	      }).catch(function (error) {
	        console.log('send.catch()', error);
	      });
	    }
	  }, {
	    key: 'subscribe',
	    value: function subscribe(listener, type) {
	      var _this3 = this;

	      var currentListeners = this.listeners;
	      this.listeners = [].concat(_toConsumableArray(this.listeners), [listener]);
	      return function () {
	        _this3.listeners = currentListeners;
	      };
	    }
	  }]);

	  return Heartbeat;
	}();

	exports.default = Heartbeat;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * @author Anthony Altieri on 10/14/16.
	 * @author Bharat Batra on 10/14/16.
	 */

	var send = exports.send = function send(type, url) {
	  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	  var withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	  console.log('send()');
	  return new Promise(function (resolve, reject) {
	    var ajax = new XMLHttpRequest();
	    ajax.open(type, url, true);
	    ajax.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	    ajax.withCredentials = withCredentials;
	    ajax.onreadystatechange = function () {
	      if (ajax.readyState !== XMLHttpRequest.DONE) return;
	      console.log('ajax done');
	      if (ajax.status === 200) {
	        var response = null;
	        try {
	          if (!!ajax.payload) {
	            response = JSON.parse(ajax.payload);
	          }
	        } catch (e) {
	          reject({
	            code: 200,
	            error: {
	              info: 'JSON parse failed'
	            }
	          });
	        }
	        resolve({
	          code: 200,
	          payload: response
	        });
	      } else {
	        console.log('ajax status ' + ajax.status);
	        switch (ajax.status) {
	          // Redirection
	          case 300:
	            {
	              // Do nothing
	              reject({
	                code: 300
	              });
	              return;
	            }

	          // Client Error
	          case 400:
	            {
	              reject({
	                code: 400,
	                error: {
	                  code: 400,
	                  info: 'Client Error'
	                }
	              });
	              return;
	            }

	          // Server Error
	          case 500:
	            {
	              reject({
	                code: 500,
	                error: {
	                  code: 500,
	                  info: 'Server Error'
	                }
	              });
	              return;
	            }
	        }
	      }
	    };
	    var parameters = void 0;
	    try {
	      if (!!params) {
	        parameters = JSON.stringify(params);
	      }
	    } catch (e) {
	      reject({
	        error: {
	          code: null,
	          info: 'Stringify Failed: ' + e
	        }
	      });
	    }
	    ajax.send(parameters);
	    return;
	  });
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	/**
	 * @author Anthony Altieri on 10/14/16.
	 * @author Bharat Batra on 10/14/16.
	 */

	var set = exports.set = function set(key, value) {
	  try {
	    var serializedValue = JSON.serialize(value);
	    if (typeof window.localStorage === 'undefined') {
	      document.cookie = key + '=' + serializedValue;
	    } else {
	      window.localStorage.setItem(key, serializedValue);
	    }
	  } catch (e) {
	    return false;
	  }
	};

	var get = exports.get = function get(key) {
	  if (typeof window.localStorage === 'undefined') {
	    var cookies = document.cookie.split(';');
	    cookies.forEach(function (c) {
	      var _c$split = c.split('=');

	      var _c$split2 = _slicedToArray(_c$split, 2);

	      var cookieKey = _c$split2[0];
	      var cookieValue = _c$split2[1];

	      if (key === cookieKey) {
	        try {
	          return JSON.serialize(cookieValue);
	        } catch (e) {
	          return false;
	        }
	      }
	    });
	    return undefined;
	  } else {
	    var serialized = window.localStorage.getItem(key);
	    try {
	      return JSON.parse(serialized);
	    } catch (e) {
	      return undefined;
	    }
	  }
	};

/***/ }
/******/ ]);
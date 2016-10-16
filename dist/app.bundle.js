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

	function test() {
	  console.log('Tests begin');
	} /**
	   * @author Anthony Altieri on 10/15/16.
	   */

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
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

	var FLATLINE = 'flatline';

	var Panic = {
	  init: init,
	  get: get,
	  post: post
	};

	function init(heartbeatEndpoint, type, secondsPerBeat) {
	  var panicSecondsPerBeat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

	  if (typeof heartbeatEndpoint === 'undefined') {
	    throw new Error('Must have a valid heartbeat endpoint');
	  }
	  this.panicMilisecondsPerBeat = panicSecondsPerBeat;
	  this.heartbeat = new _Heartbeat2.default(heartbeatEndpoint, type, secondsPerBeat);
	}

	function get(url, params) {
	  var withCredentials = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  http('GET', url, params, withCredentials);
	}

	function post(url, params) {
	  var withCredentials = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  http('POST', url, params, withCredentials);
	}

	function http(type, url, params) {
	  var _this = this;

	  var withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	  if (this.heartbeat.isAlive) {
	    var response = (0, _Ajax.send)(type, url, params, withCredentials);
	  } else {
	    if (!this.isPanic) {
	      (function () {
	        clearInterval(_this.heartbeat.pacemaker);
	        _this.isPanic = true;
	        var unsubscribe = _this.heartbeat.subscribe(function () {
	          clearInterval(_this.crashcart);
	          _this.heartbeat.keepAlive();
	          _this.isPanic = false;
	          var flatlineActions = Storage.get(FLATLINE);
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
	          unsubscribe();
	        });
	        _this.crashcart = window.setInterval(function () {
	          _this.heartbeat.beat();
	        }, _this.panicMilisecondsPerBeat);
	        Storage.set(FLATLINE, '[]');
	      })();
	    }
	    var flatline = Storage.get(FLATLINE);
	    var result = Storage.set([].concat(_toConsumableArray(flatline), [type + ':' + url + ',' + params + ',' + withCredentials + '&time:' + new Date().getTime()]));
	  }
	}

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

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Heartbeat = function () {
	  function Heartbeat(heartbeatEndpoint, type) {
	    var secondsPerBeat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;

	    _classCallCheck(this, Heartbeat);

	    this.source = heartbeatEndpoint;
	    this.milisecondsPerBeat = secondsPerBeat * 1000;
	    this.isAlive = false;
	    this.hasInit = false;
	    this.listeners = [];
	    this.init(type);
	  }

	  _createClass(Heartbeat, [{
	    key: 'init',
	    value: function () {
	      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(type) {
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.next = 2;
	                return this.beat(type);

	              case 2:
	                this.keepAlive();

	              case 3:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, this);
	      }));

	      function init(_x2) {
	        return _ref.apply(this, arguments);
	      }

	      return init;
	    }()
	  }, {
	    key: 'beat',
	    value: function () {
	      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
	        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GET';
	        var response;
	        return regeneratorRuntime.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                _context2.next = 2;
	                return (0, _Ajax.send)(type);

	              case 2:
	                response = _context2.sent;

	                if (!response.error) {
	                  _context2.next = 6;
	                  break;
	                }

	                this.isAlive = false;
	                return _context2.abrupt('return', {
	                  error: response.error
	                });

	              case 6:
	                if (!(response.code === 200)) {
	                  _context2.next = 11;
	                  break;
	                }

	                this.listeners.forEach(function (l) {
	                  l();
	                });
	                this.isAlive = true;
	                _context2.next = 13;
	                break;

	              case 11:
	                this.isAlive = false;
	                throw new Error('Response code: ' + response.code + ' invalid, awaiting 200');

	              case 13:
	                this.hasInit = true;

	              case 14:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, this);
	      }));

	      function beat(_x3) {
	        return _ref2.apply(this, arguments);
	      }

	      return beat;
	    }()
	  }, {
	    key: 'keepAlive',
	    value: function keepAlive() {
	      var _this = this;

	      this.pacemaker = window.setInterval(function () {
	        _this.beat().then(function () {}).catch(function (error) {});
	      }, this.milisecondsPerBeat);
	    }
	  }, {
	    key: 'subscribe',
	    value: function subscribe(listeners) {
	      var _this2 = this;

	      var currentListeners = this.listeners;
	      this.listeners = [].concat(_toConsumableArray(this.listeners), [listeners]);
	      return function () {
	        _this2.listeners = currentListeners;
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

	var send = exports.send = function send(type, url, params) {
	  var withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	  return new Promise(function (resolve, reject) {
	    var ajax = new XMLHttpRequest();
	    ajax.open(type, PREFIX + url, true);
	    ajax.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	    ajax.withCredentials = withCredentials;
	    ajax.onreadystatechange = function () {
	      if (ajax.status === 200 && ajax.readyState === 4) {
	        try {
	          resolve({
	            code: 200,
	            payload: JSON.parse(ajax.payload)
	          });
	        } catch (e) {
	          reject({
	            code: 200,
	            error: {
	              info: 'JSON parse failed'
	            }
	          });
	          return;
	        }
	      } else {
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

	    console.log('params', params);
	    try {
	      ajax.send(JSON.stringify(params));
	    } catch (e) {
	      reject({
	        error: {
	          code: null,
	          info: 'Stringify Failed: ' + e
	        }
	      });
	      return;
	    }
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
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

	var _Storage = __webpack_require__(3);

	var Storage = _interopRequireWildcard(_Storage);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author Anthony Altieri on 10/15/16.
	 */

	var SERVER_PREFIX = 'http://159.203.234.179';
	var HEARTBEAT_ENDPOINT = 'http://159.203.234.179/isAlive';
	var FIVE_SECONDS = 5;
	var ONE_SECOND = 1;
	var TWO_SECONDS = 2;
	var ONE_THIRD_SECOND = 0.33;
	var TYPE = 'POST';

	var panic = void 0;

	function test() {
	  console.log('Beginning test()');
	  panic = new _Panic2.default(HEARTBEAT_ENDPOINT, {
	    type: TYPE,
	    secondsPerBeat: FIVE_SECONDS
	  });
	}

	function testPost() {
	  panic.post(SERVER_PREFIX + '/test', { foo: 'bar' });
	}

	function testLocal() {
	  Storage.set('key', 'value');
	  var obj = Storage.get('key');
	  obj.foo();
	}

	var testButton = document.createElement('button');
	testButton.onclick = test;
	testButton.innerHTML = 'Start Test';
	document.body.appendChild(testButton);

	var postButton = document.createElement('button');
	postButton.onclick = testPost;
	postButton.innerHTML = 'Send Post';
	document.body.appendChild(postButton);

	var storageButton = document.createElement('button');
	storageButton.onclick = testLocal;
	storageButton.innerHTML = 'Storage test';
	document.body.appendChild(storageButton);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Anthony Altieri on 10/22/16.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _Storage = __webpack_require__(3);

	var Storage = _interopRequireWildcard(_Storage);

	var _Ajax = __webpack_require__(4);

	var Ajax = _interopRequireWildcard(_Ajax);

	var _Heartbeat = __webpack_require__(5);

	var _Heartbeat2 = _interopRequireDefault(_Heartbeat);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LS_KEY = 'PanicCallQueue';

	var Panic = function () {
	  function Panic(endpoint, options) {
	    _classCallCheck(this, Panic);

	    this.heartbeat = new _Heartbeat2.default(endpoint, options);
	    // Flag if the call Queue is being dealt with
	    this.isHandlingCallQueue = false;
	    this.unsubscribeOnAlive = this.heartbeat.subscribe('ALIVE', onAlive.bind(this));
	    this.unsubscribeOnDead = this.heartbeat.subscribe('DEAD', onDead.bind(this));
	  }

	  _createClass(Panic, [{
	    key: 'http',
	    value: function http(type, url, params, withCredentials) {
	      var _this = this;

	      console.log('http: ' + type);
	      console.log('heartbeat.isAlive: ' + this.heartbeat.isAlive);
	      if (this.heartbeat.isAlive) {
	        Ajax.send(type, url, params, withCredentials).then(function () {}).catch(function () {
	          // NOTE: Might want to add some sort of functionality to
	          // guarantee that the http call after forceDead() uses
	          // offline functionality
	          _this.heartbeat.forceDead();
	          _this.http(type, url, params, withCredentials);
	        });
	      } else {
	        // TODO: Implement panic mode
	        console.log('http with no connection');
	        try {
	          var call = type + '**' + url + '**' + JSON.stringify(params) + '**' + withCredentials + '$$$' + new Date();
	          var callQueue = Storage.get(LS_KEY);
	          if (!callQueue) {
	            callQueue = [];
	          }
	          // Add call to queue
	          // TODO: Sort [...calQueue, call] by time
	          callQueue = [].concat(_toConsumableArray(callQueue), [call]);
	          // Save in local storage
	          Storage.set(LS_KEY, callQueue);
	        } catch (e) {
	          // Silently fail
	        }
	      }
	    }
	  }, {
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
	  }]);

	  return Panic;
	}();

	function onAlive() {
	  if (this.heartbeat.isPanic) {
	    this.heartbeat.stopPanic();
	  }
	  console.log('alive');
	}

	function onDead() {
	  if (!this.heartbeat) return;
	  console.log('dead');
	  if (!this.heartbeat.isPanic) {
	    this.heartbeat.startPanic();
	  }
	  if (!this.isHandlingCallQueue) {
	    // TODO: Start handling call queue
	  }
	}

	exports.default = Panic;

/***/ },
/* 3 */
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
	    var serializedValue = JSON.stringify(value, function (k, v) {
	      if (typeof v === 'function') {
	        return v + '';
	      }
	      return v;
	    });
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
	          return JSON.stringify(cookieValue);
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
	      var isFivehundred = function isFivehundred(code) {
	        return code >= 500 && code <= 599;
	      };
	      if (isFivehundred(ajax.status)) {
	        reject({
	          code: 500,
	          error: {
	            code: 500,
	            info: 'Server Error'
	          }
	        });
	      } else {
	        try {
	          var payload = JSON.stringify(ajax.payload);
	          resolve({
	            code: ajax.status,
	            payload: payload
	          });
	        } catch (error) {
	          reject({
	            code: undefined,
	            error: error
	          });
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	/**
	 * @author Anthony Altieri on 10/22/16.
	 */

	var _Ajax = __webpack_require__(4);

	var Ajax = _interopRequireWildcard(_Ajax);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Heartbeat = function () {
	  /**
	   * endpoint {String} The URI of the endpoint on the server that
	   * will be used to determine connection status
	   *
	   * options {Object} The options that are to be applied to the
	   * heartbeat singleton. These include:
	   *   - type: HTTP_TYPE the type of
	   *   - secondsPerBeat: {number} how many seconds to wait in between each beat
	   *   - secondsPerPanicBeat: {number} when in panic mode how many seconds to wait
	   *   between each beat
	   *   - withCredentials {boolean} if to put withCredentials on the Ajax
	   * request
	   */
	  function Heartbeat(endpoint, options) {
	    _classCallCheck(this, Heartbeat);

	    var type = options.type;
	    var secondsPerBeat = options.secondsPerBeat;
	    var secondsPerPanicBeat = options.secondsPerPanicBeat;
	    var withCredentials = options.withCredentials;

	    var ONE_SECOND = 1;
	    var THREE_SECONDS = 3;
	    var secondsToMilliseconds = function secondsToMilliseconds(seconds) {
	      var CONVERSION = 1000;
	      return seconds * CONVERSION;
	    };
	    this.milisecondsPerBeat = secondsPerBeat ? secondsToMilliseconds(secondsPerBeat) : secondsToMilliseconds(THREE_SECONDS);
	    this.milisecondsPerPanicBeat = secondsPerPanicBeat ? secondsToMilliseconds(secondsPerPanicBeat) : secondsToMilliseconds(ONE_SECOND);
	    this.type = type;
	    this.endpoint = endpoint;
	    this.withCredentials = withCredentials;
	    this.aliveListeners = [];
	    this.deadListeners = [];
	    this.isPanic = false;
	    this.init();
	  }

	  /**
	   * Initializes the beat interval
	   */


	  _createClass(Heartbeat, [{
	    key: 'init',
	    value: function init() {
	      var _this = this;

	      this.pacemaker = window.setInterval(function () {
	        _this.beat();
	      }, this.milisecondsPerBeat);
	    }

	    /**
	     * Ping the server to determine if the server is working/client is
	     * online
	     */

	  }, {
	    key: 'beat',
	    value: function beat() {
	      var _this2 = this;

	      Ajax.send(this.type, this.endpoint, {}, this.withCredentials).then(function (result) {
	        var code = result.code;
	        var payload = result.payload;

	        var isOnline = function isOnline(code) {
	          return code !== 0;
	        };
	        console.log('beat code: ' + code);
	        _this2.isAlive = isOnline(code);
	        if (_this2.isAlive) {
	          _this2.aliveListeners.forEach(function (l) {
	            l();
	          });
	        } else {
	          _this2.deadListeners.forEach(function (l) {
	            l();
	          });
	        }
	      }).catch(function (fail) {
	        // Is not alive on server error or offline
	        _this2.isAlive = false;
	        _this2.deadListeners.forEach(function (l) {
	          l();
	        });
	      });
	    }
	  }, {
	    key: 'startPanic',
	    value: function startPanic() {
	      var _this3 = this;

	      this.isPanic = true;
	      this.panicPacemaker = window.setInterval(function () {
	        _this3.beat();
	      }, this.milisecondsPerPanicBeat);
	    }
	  }, {
	    key: 'stopPanic',
	    value: function stopPanic() {
	      this.isPanic = false;
	      if (!!this.panicPacemaker) clearInterval(this.panicPacemaker);
	    }

	    /**
	     * Stops the interval (pacemaker) that pings the server periodically (beat)
	     */

	  }, {
	    key: 'stop',
	    value: function stop() {
	      if (!!this.pacemaker) clearInterval(this.pacemaker);
	    }
	  }, {
	    key: 'subscribe',
	    value: function subscribe() {
	      var _this4 = this;

	      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ALIVE' | 'DEAD';
	      var listener = arguments[1];

	      switch (type) {
	        case 'ALIVE':
	          {
	            var _ret = function () {
	              var listeners = _this4.aliveListeners;
	              _this4.aliveListeners = [].concat(_toConsumableArray(_this4.aliveListeners), [listener]);
	              return {
	                v: function v() {
	                  _this4.aliveListeners = listeners;
	                }
	              };
	            }();

	            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	          }

	        case 'DEAD':
	          {
	            var _ret2 = function () {
	              var listeners = _this4.deadListeners;
	              _this4.deadListeners = [].concat(_toConsumableArray(_this4.deadListeners), [listener]);
	              return {
	                v: function v() {
	                  _this4.deadListeners = listeners;
	                }
	              };
	            }();

	            if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	          }

	        default:
	          {
	            throw new Error('subscribe type ' + type + ' not allowed');
	          }
	      }
	    }
	  }, {
	    key: 'forceDead',
	    value: function forceDead() {
	      this.isAlive = false;
	    }
	  }]);

	  return Heartbeat;
	}();

	exports.default = Heartbeat;

/***/ }
/******/ ]);
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

	var _Storage = __webpack_require__(5);

	var Storage = _interopRequireWildcard(_Storage);

	var _Hub = __webpack_require__(7);

	var _Hub2 = _interopRequireDefault(_Hub);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
	var i = 1;

	function test() {
	  console.log('Beginning test()');
	  panic = new _Panic2.default(_Hub2.default, HEARTBEAT_ENDPOINT, {
	    type: TYPE,
	    secondsPerBeat: FIVE_SECONDS
	  });
	}

	function testPost() {
	  panic.post(SERVER_PREFIX + '/test', { foo: i++ });
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

	var _CallQueue = __webpack_require__(3);

	var CQ = _interopRequireWildcard(_CallQueue);

	var _Ajax = __webpack_require__(6);

	var Ajax = _interopRequireWildcard(_Ajax);

	var _Hub = __webpack_require__(7);

	var _Hub2 = _interopRequireDefault(_Hub);

	var _Heartbeat = __webpack_require__(8);

	var _Heartbeat2 = _interopRequireDefault(_Heartbeat);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Panic = function () {
	  function Panic(hub, endpoint, options) {
	    _classCallCheck(this, Panic);

	    CQ.init();
	    this.heartbeat = new _Heartbeat2.default(endpoint, options);
	    this.unsubscribeOnAlive = this.heartbeat.subscribe('ALIVE', onAlive.bind(this));
	    this.unsubscribeOnDead = this.heartbeat.subscribe('DEAD', onDead.bind(this));
	    this.priorAliveStatus = false;
	  }

	  _createClass(Panic, [{
	    key: 'http',
	    value: function http(type, url, params, responseTag, withCredentials) {
	      var _this = this;

	      return new Promise(function (resolve, reject) {
	        if (_this.heartbeat.isAlive || typeof _this.heartbeat.isAlive === 'undefined') {
	          Ajax.send(type, url, params, withCredentials).then(function (payload) {
	            console.log(".then now gonna resolve payload");
	            if (payload.code !== 0) {
	              console.log(payload);
	              resolve(payload);
	            } else {
	              console.log("Payload couldn't be resolved code was found to be 0");
	              _this.heartbeat.forceDead();
	              _this.http(type, url, params, withCredentials);
	            }
	          }).catch(function () {
	            console.log("Send caught an error");
	            _this.heartbeat.forceDead();
	            _this.http(type, url, params, withCredentials);
	          });
	        } else {
	          console.log("Gonna Add to CQ");
	          CQ.add({
	            time: new Date().getTime(),
	            type: type,
	            url: url,
	            params: params,
	            withCredentials: withCredentials,
	            responseTag: responseTag
	          });
	        }
	      });
	    }
	  }, {
	    key: 'get',
	    value: function get(url, params, responseTag) {
	      var withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

	      this.http('GET', url, params, responseTag, withCredentials);
	    }
	  }, {
	    key: 'post',
	    value: function post(url, params, responseTag) {
	      var withCredentials = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

	      this.http('POST', url, params, responseTag, withCredentials);
	    }
	  }]);

	  return Panic;
	}();

	function onAlive() {
	  var _this2 = this;

	  console.log('alive');
	  if (this.heartbeat.isPanic) {
	    console.log("In Panic mode, but gonna stop panic cuz alive");
	    this.heartbeat.stopPanic();
	  }
	  if (this.priorAliveStatus === false) {
	    // Going from dead to alive
	    this.priorAliveStatus = true;
	    console.log("Prior Alive set to true");
	    console.log(JSON.stringify(CQ.get(), null, 2));
	    //If calls exist on CQ, we will now attempt to make them
	    if (!!CQ.get()) {
	      CQ.get().forEach(function (c) {
	        _this2.http(c.type, c.url, c.params, c.withCredentials).then(function (payload) {
	          // const response = this.hub[c.responseTag];
	          // if (typeof response === 'function') {
	          //   response(payload);
	          // }
	          console.log("Call Made: ");
	          console.log(JSON.stringify(c, null, 2));
	          console.log("Response: ");
	          console.log(JSON.stringify(payload, null, 2));
	        });
	      });
	    }
	  }
	}

	function onDead() {
	  console.log('dead');
	  if (!this.heartbeat.isPanic) {
	    this.heartbeat.startPanic();
	  }
	  if (this.priorAliveStatus === true) {
	    this.priorAliveStatus = false;
	    // Going from alive to dead
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
	exports.hasCalls = exports.removeAllMiddleware = exports.addMiddleware = exports.pop = exports.add = exports.init = exports.get = undefined;

	var _StorageMiddleware = __webpack_require__(4);

	var StorageMiddleware = _interopRequireWildcard(_StorageMiddleware);

	var _Storage = __webpack_require__(5);

	var Storage = _interopRequireWildcard(_Storage);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
	                                                                                                                                                                                                     * @author Anthony Altieri on 10/22/16.
	                                                                                                                                                                                                     */

	var CallQueue = null;
	var middleware = null;
	var defaultMiddleware = [StorageMiddleware.addStorage, StorageMiddleware.popStorage];
	var CQ_KEY = 'CallQueue';
	var TWO_HOURS_MILLISECONDS = 2.7e6;

	var get = exports.get = function get() {
	  return CallQueue;
	};

	// TODO: make valid time easier to set, not have to do milliseconds
	var init = exports.init = function init() {
	  var validTimeDif = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : TWO_HOURS_MILLISECONDS;

	  try {
	    var priorState = Storage.get(CQ_KEY);
	    var timeDiff = function timeDiff(time) {
	      return new Date().getTime() - time;
	    };
	    var isValidPriorState = timeDiff(priorState.time) < validTimeDif;
	    CallQueue = !!priorState && isValidPriorState ? priorState.cq : [];
	    middleware = [].concat(defaultMiddleware);
	  } catch (e) {
	    // Silently fail
	  }
	};

	var add = exports.add = function add(call) {
	  //TODO: Uncomment and Enable these once add has been tested
	  // const applicableMiddleware = middleware.filter(m => m.type === 'ADD');
	  // applicableMiddleware.forEach((m) => { m.exec(call).bind(cq) });
	  if (!!CallQueue) {
	    CallQueue = [].concat(_toConsumableArray(CallQueue), [call]).sort(function (l, r) {
	      return l.time - r.time;
	    });
	  } else {
	    CallQueue = [call];
	  }

	  console.log("IN ADD");
	  console.log(JSON.stringify(CallQueue, null, 2));
	  return call;
	};

	var pop = exports.pop = function pop() {
	  if (!CallQueue || CallQueue.length === 0) return null;
	  var first = CallQueue[0];
	  //TODO: Uncomment and Enable these once pop has been tested
	  // const applicableMiddleware = middleware.filter(m => m.type === 'POP');
	  // applicableMiddleware.forEach((m) => { m.exec(first).bind(cq) });
	  CallQueue = CallQueue.slice(1, CallQueue.length);
	  return first;
	};

	var addMiddleware = exports.addMiddleware = function addMiddleware(middlewares, mw) {
	  var currentMiddleware = middlewares.slice(0, middlewares.length);
	  middlewares = [].concat(_toConsumableArray(middlewares), [mw]);
	  return function () {
	    middlewares = currentMiddleware;
	  };
	};

	var removeAllMiddleware = exports.removeAllMiddleware = function removeAllMiddleware(middlewares, defaultMiddleware) {
	  var keepStorage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  if (keepStorage) {
	    middlewares = [].concat(_toConsumableArray(defaultMiddleware));
	    return;
	  }
	  middleware = [];
	};

	var hasCalls = exports.hasCalls = function hasCalls() {
	  return CallQueue.length > 0;
	};

	exports.default = {
	  init: init,
	  add: add,
	  pop: pop,
	  addMiddleware: addMiddleware,
	  removeAllMiddleware: removeAllMiddleware,
	  get: get
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.popStorage = exports.addStorage = undefined;

	var _Storage = __webpack_require__(5);

	var Storage = _interopRequireWildcard(_Storage);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
	                                                                                                                                                                                                     * @author Anthony Altieri on 10/22/16.
	                                                                                                                                                                                                     */

	var CQ_KEY = 'CallQueue';

	var addStorage = exports.addStorage = function addStorage(call) {
	  return {
	    type: 'ADD',
	    exec: function exec() {
	      var storedCQ = Storage.get(CQ_KEY);
	      var time = new Date().getTime();
	      try {
	        Storage.set(CQ_KEY, storedCQ ? { time: time, cq: [].concat(_toConsumableArray(storedCQ), [call]).sort(function (l, r) {
	            return l.time - r.time;
	          }) } : { time: time, cq: [call] });
	      } catch (e) {
	        // Silently Fail
	      }
	    }
	  };
	};

	var popStorage = exports.popStorage = function popStorage() {
	  return {
	    type: 'POP',
	    exec: function exec() {
	      var storedCQ = Storage.get(CQ_KEY);
	      if (!storedCQ) return;
	      var time = new Date().getTime();
	      try {
	        Storage.set(CQ_KEY, { time: time, cq: storedCQ.slice(1, storedCQ.length) });
	      } catch (e) {
	        // Silently Fail
	      }
	    }
	  };
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
/* 6 */
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
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * @author Anthony Altieri on 10/22/16.
	 */

	var Hub = {
	  test: function test(payload) {
	    console.log(payload);
	  }
	};

	exports.default = Hub;

/***/ },
/* 8 */
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

	var _Ajax = __webpack_require__(6);

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
	   *                      Default value set to 3
	   *   - secondsPerPanicBeat: {number} when in panic mode how many seconds to wait
	   *                           Default value set to 1
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
	    this.withCredentials = withCredentials ? withCredentials : true;
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
	          console.log("Beat is alive");
	          _this2.aliveListeners.forEach(function (l) {
	            l();
	          });
	        } else {
	          console.log("Beat is dead");
	          _this2.deadListeners.forEach(function (l) {
	            l();
	          });
	        }
	      }).catch(function (fail) {
	        // Is not alive on server error or offline
	        _this2.handleDead();
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
	    key: 'handleDead',
	    value: function handleDead() {
	      this.isAlive = false;
	      this.deadListeners.forEach(function (l) {
	        l();
	      });
	    }
	  }, {
	    key: 'forceDead',
	    value: function forceDead() {
	      console.log("Forced Dead");
	      this.handleDead();
	    }
	  }]);

	  return Heartbeat;
	}();

	exports.default = Heartbeat;

/***/ }
/******/ ]);
exports.id = 607;
exports.ids = [607];
exports.modules = {

/***/ 52353:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports =
{
  parallel      : __webpack_require__(54668),
  serial        : __webpack_require__(23339),
  serialOrdered : __webpack_require__(99869)
};


/***/ }),

/***/ 61677:
/***/ ((module) => {

// API
module.exports = abort;

/**
 * Aborts leftover active jobs
 *
 * @param {object} state - current state object
 */
function abort(state)
{
  Object.keys(state.jobs).forEach(clean.bind(state));

  // reset leftover jobs
  state.jobs = {};
}

/**
 * Cleans up leftover job by invoking abort function for the provided job id
 *
 * @this  state
 * @param {string|number} key - job id to abort
 */
function clean(key)
{
  if (typeof this.jobs[key] == 'function')
  {
    this.jobs[key]();
  }
}


/***/ }),

/***/ 92792:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defer = __webpack_require__(56403);

// API
module.exports = async;

/**
 * Runs provided callback asynchronously
 * even if callback itself is not
 *
 * @param   {function} callback - callback to invoke
 * @returns {function} - augmented callback
 */
function async(callback)
{
  var isAsync = false;

  // check if async happened
  defer(function() { isAsync = true; });

  return function async_callback(err, result)
  {
    if (isAsync)
    {
      callback(err, result);
    }
    else
    {
      defer(function nextTick_callback()
      {
        callback(err, result);
      });
    }
  };
}


/***/ }),

/***/ 56403:
/***/ ((module) => {

module.exports = defer;

/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */
function defer(fn)
{
  var nextTick = typeof setImmediate == 'function'
    ? setImmediate
    : (
      typeof process == 'object' && typeof process.nextTick == 'function'
      ? process.nextTick
      : null
    );

  if (nextTick)
  {
    nextTick(fn);
  }
  else
  {
    setTimeout(fn, 0);
  }
}


/***/ }),

/***/ 98617:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var async = __webpack_require__(92792)
  , abort = __webpack_require__(61677)
  ;

// API
module.exports = iterate;

/**
 * Iterates over each job object
 *
 * @param {array|object} list - array or object (named list) to iterate over
 * @param {function} iterator - iterator to run
 * @param {object} state - current job status
 * @param {function} callback - invoked when all elements processed
 */
function iterate(list, iterator, state, callback)
{
  // store current index
  var key = state['keyedList'] ? state['keyedList'][state.index] : state.index;

  state.jobs[key] = runJob(iterator, key, list[key], function(error, output)
  {
    // don't repeat yourself
    // skip secondary callbacks
    if (!(key in state.jobs))
    {
      return;
    }

    // clean up jobs
    delete state.jobs[key];

    if (error)
    {
      // don't process rest of the results
      // stop still active jobs
      // and reset the list
      abort(state);
    }
    else
    {
      state.results[key] = output;
    }

    // return salvaged results
    callback(error, state.results);
  });
}

/**
 * Runs iterator over provided job element
 *
 * @param   {function} iterator - iterator to invoke
 * @param   {string|number} key - key/index of the element in the list of jobs
 * @param   {mixed} item - job description
 * @param   {function} callback - invoked after iterator is done with the job
 * @returns {function|mixed} - job abort function or something else
 */
function runJob(iterator, key, item, callback)
{
  var aborter;

  // allow shortcut if iterator expects only two arguments
  if (iterator.length == 2)
  {
    aborter = iterator(item, async(callback));
  }
  // otherwise go with full three arguments
  else
  {
    aborter = iterator(item, key, async(callback));
  }

  return aborter;
}


/***/ }),

/***/ 59478:
/***/ ((module) => {

// API
module.exports = state;

/**
 * Creates initial state object
 * for iteration over list
 *
 * @param   {array|object} list - list to iterate over
 * @param   {function|null} sortMethod - function to use for keys sort,
 *                                     or `null` to keep them as is
 * @returns {object} - initial state object
 */
function state(list, sortMethod)
{
  var isNamedList = !Array.isArray(list)
    , initState =
    {
      index    : 0,
      keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
      jobs     : {},
      results  : isNamedList ? {} : [],
      size     : isNamedList ? Object.keys(list).length : list.length
    }
    ;

  if (sortMethod)
  {
    // sort array keys based on it's values
    // sort object's keys just on own merit
    initState.keyedList.sort(isNamedList ? sortMethod : function(a, b)
    {
      return sortMethod(list[a], list[b]);
    });
  }

  return initState;
}


/***/ }),

/***/ 77093:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var abort = __webpack_require__(61677)
  , async = __webpack_require__(92792)
  ;

// API
module.exports = terminator;

/**
 * Terminates jobs in the attached state context
 *
 * @this  AsyncKitState#
 * @param {function} callback - final callback to invoke after termination
 */
function terminator(callback)
{
  if (!Object.keys(this.jobs).length)
  {
    return;
  }

  // fast forward iteration index
  this.index = this.size;

  // abort jobs
  abort(this);

  // send back results we have so far
  async(callback)(null, this.results);
}


/***/ }),

/***/ 54668:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var iterate    = __webpack_require__(98617)
  , initState  = __webpack_require__(59478)
  , terminator = __webpack_require__(77093)
  ;

// Public API
module.exports = parallel;

/**
 * Runs iterator over provided array elements in parallel
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function parallel(list, iterator, callback)
{
  var state = initState(list);

  while (state.index < (state['keyedList'] || list).length)
  {
    iterate(list, iterator, state, function(error, result)
    {
      if (error)
      {
        callback(error, result);
        return;
      }

      // looks like it's the last one
      if (Object.keys(state.jobs).length === 0)
      {
        callback(null, state.results);
        return;
      }
    });

    state.index++;
  }

  return terminator.bind(state, callback);
}


/***/ }),

/***/ 23339:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var serialOrdered = __webpack_require__(99869);

// Public API
module.exports = serial;

/**
 * Runs iterator over provided array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serial(list, iterator, callback)
{
  return serialOrdered(list, iterator, null, callback);
}


/***/ }),

/***/ 99869:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var iterate    = __webpack_require__(98617)
  , initState  = __webpack_require__(59478)
  , terminator = __webpack_require__(77093)
  ;

// Public API
module.exports = serialOrdered;
// sorting helpers
module.exports.ascending  = ascending;
module.exports.descending = descending;

/**
 * Runs iterator over provided sorted array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} sortMethod - custom sort function
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serialOrdered(list, iterator, sortMethod, callback)
{
  var state = initState(list, sortMethod);

  iterate(list, iterator, state, function iteratorHandler(error, result)
  {
    if (error)
    {
      callback(error, result);
      return;
    }

    state.index++;

    // are we there yet?
    if (state.index < (state['keyedList'] || list).length)
    {
      iterate(list, iterator, state, iteratorHandler);
      return;
    }

    // done here
    callback(null, state.results);
  });

  return terminator.bind(state, callback);
}

/*
 * -- Sort methods
 */

/**
 * sort helper to sort array elements in ascending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function ascending(a, b)
{
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * sort helper to sort array elements in descending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function descending(a, b)
{
  return -1 * ascending(a, b);
}


/***/ }),

/***/ 97143:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var util = __webpack_require__(73837);
var Stream = (__webpack_require__(12781).Stream);
var DelayedStream = __webpack_require__(23154);

module.exports = CombinedStream;
function CombinedStream() {
  this.writable = false;
  this.readable = true;
  this.dataSize = 0;
  this.maxDataSize = 2 * 1024 * 1024;
  this.pauseStreams = true;

  this._released = false;
  this._streams = [];
  this._currentStream = null;
  this._insideLoop = false;
  this._pendingNext = false;
}
util.inherits(CombinedStream, Stream);

CombinedStream.create = function(options) {
  var combinedStream = new this();

  options = options || {};
  for (var option in options) {
    combinedStream[option] = options[option];
  }

  return combinedStream;
};

CombinedStream.isStreamLike = function(stream) {
  return (typeof stream !== 'function')
    && (typeof stream !== 'string')
    && (typeof stream !== 'boolean')
    && (typeof stream !== 'number')
    && (!Buffer.isBuffer(stream));
};

CombinedStream.prototype.append = function(stream) {
  var isStreamLike = CombinedStream.isStreamLike(stream);

  if (isStreamLike) {
    if (!(stream instanceof DelayedStream)) {
      var newStream = DelayedStream.create(stream, {
        maxDataSize: Infinity,
        pauseStream: this.pauseStreams,
      });
      stream.on('data', this._checkDataSize.bind(this));
      stream = newStream;
    }

    this._handleErrors(stream);

    if (this.pauseStreams) {
      stream.pause();
    }
  }

  this._streams.push(stream);
  return this;
};

CombinedStream.prototype.pipe = function(dest, options) {
  Stream.prototype.pipe.call(this, dest, options);
  this.resume();
  return dest;
};

CombinedStream.prototype._getNext = function() {
  this._currentStream = null;

  if (this._insideLoop) {
    this._pendingNext = true;
    return; // defer call
  }

  this._insideLoop = true;
  try {
    do {
      this._pendingNext = false;
      this._realGetNext();
    } while (this._pendingNext);
  } finally {
    this._insideLoop = false;
  }
};

CombinedStream.prototype._realGetNext = function() {
  var stream = this._streams.shift();


  if (typeof stream == 'undefined') {
    this.end();
    return;
  }

  if (typeof stream !== 'function') {
    this._pipeNext(stream);
    return;
  }

  var getStream = stream;
  getStream(function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
      stream.on('data', this._checkDataSize.bind(this));
      this._handleErrors(stream);
    }

    this._pipeNext(stream);
  }.bind(this));
};

CombinedStream.prototype._pipeNext = function(stream) {
  this._currentStream = stream;

  var isStreamLike = CombinedStream.isStreamLike(stream);
  if (isStreamLike) {
    stream.on('end', this._getNext.bind(this));
    stream.pipe(this, {end: false});
    return;
  }

  var value = stream;
  this.write(value);
  this._getNext();
};

CombinedStream.prototype._handleErrors = function(stream) {
  var self = this;
  stream.on('error', function(err) {
    self._emitError(err);
  });
};

CombinedStream.prototype.write = function(data) {
  this.emit('data', data);
};

CombinedStream.prototype.pause = function() {
  if (!this.pauseStreams) {
    return;
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.pause) == 'function') this._currentStream.pause();
  this.emit('pause');
};

CombinedStream.prototype.resume = function() {
  if (!this._released) {
    this._released = true;
    this.writable = true;
    this._getNext();
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.resume) == 'function') this._currentStream.resume();
  this.emit('resume');
};

CombinedStream.prototype.end = function() {
  this._reset();
  this.emit('end');
};

CombinedStream.prototype.destroy = function() {
  this._reset();
  this.emit('close');
};

CombinedStream.prototype._reset = function() {
  this.writable = false;
  this._streams = [];
  this._currentStream = null;
};

CombinedStream.prototype._checkDataSize = function() {
  this._updateDataSize();
  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
  this._emitError(new Error(message));
};

CombinedStream.prototype._updateDataSize = function() {
  this.dataSize = 0;

  var self = this;
  this._streams.forEach(function(stream) {
    if (!stream.dataSize) {
      return;
    }

    self.dataSize += stream.dataSize;
  });

  if (this._currentStream && this._currentStream.dataSize) {
    this.dataSize += this._currentStream.dataSize;
  }
};

CombinedStream.prototype._emitError = function(err) {
  this._reset();
  this.emit('error', err);
};


/***/ }),

/***/ 52327:
/***/ ((module, exports, __webpack_require__) => {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(51145);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),

/***/ 51145:
/***/ ((module, exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(69842);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ 17783:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = __webpack_require__(52327);
} else {
  module.exports = __webpack_require__(49035);
}


/***/ }),

/***/ 49035:
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(76224);
var util = __webpack_require__(73837);

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(51145);
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = __webpack_require__(57147);
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = __webpack_require__(41808);
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


/***/ }),

/***/ 23154:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stream = (__webpack_require__(12781).Stream);
var util = __webpack_require__(73837);

module.exports = DelayedStream;
function DelayedStream() {
  this.source = null;
  this.dataSize = 0;
  this.maxDataSize = 1024 * 1024;
  this.pauseStream = true;

  this._maxDataSizeExceeded = false;
  this._released = false;
  this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);

DelayedStream.create = function(source, options) {
  var delayedStream = new this();

  options = options || {};
  for (var option in options) {
    delayedStream[option] = options[option];
  }

  delayedStream.source = source;

  var realEmit = source.emit;
  source.emit = function() {
    delayedStream._handleEmit(arguments);
    return realEmit.apply(source, arguments);
  };

  source.on('error', function() {});
  if (delayedStream.pauseStream) {
    source.pause();
  }

  return delayedStream;
};

Object.defineProperty(DelayedStream.prototype, 'readable', {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.source.readable;
  }
});

DelayedStream.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};

DelayedStream.prototype.resume = function() {
  if (!this._released) {
    this.release();
  }

  this.source.resume();
};

DelayedStream.prototype.pause = function() {
  this.source.pause();
};

DelayedStream.prototype.release = function() {
  this._released = true;

  this._bufferedEvents.forEach(function(args) {
    this.emit.apply(this, args);
  }.bind(this));
  this._bufferedEvents = [];
};

DelayedStream.prototype.pipe = function() {
  var r = Stream.prototype.pipe.apply(this, arguments);
  this.resume();
  return r;
};

DelayedStream.prototype._handleEmit = function(args) {
  if (this._released) {
    this.emit.apply(this, args);
    return;
  }

  if (args[0] === 'data') {
    this.dataSize += args[1].length;
    this._checkIfMaxDataSizeExceeded();
  }

  this._bufferedEvents.push(args);
};

DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
  if (this._maxDataSizeExceeded) {
    return;
  }

  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  this._maxDataSizeExceeded = true;
  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.'
  this.emit('error', new Error(message));
};


/***/ }),

/***/ 96967:
/***/ ((module) => {

"use strict";


// do not edit .js files directly - edit src/index.jst



module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};


/***/ }),

/***/ 10361:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var debug;

module.exports = function () {
  if (!debug) {
    try {
      /* eslint global-require: off */
      debug = __webpack_require__(17783)("follow-redirects");
    }
    catch (error) { /* */ }
    if (typeof debug !== "function") {
      debug = function () { /* */ };
    }
  }
  debug.apply(null, arguments);
};


/***/ }),

/***/ 71794:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var url = __webpack_require__(57310);
var URL = url.URL;
var http = __webpack_require__(13685);
var https = __webpack_require__(95687);
var Writable = (__webpack_require__(12781).Writable);
var assert = __webpack_require__(39491);
var debug = __webpack_require__(10361);

// Create handlers that pass events from native requests
var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = Object.create(null);
events.forEach(function (event) {
  eventHandlers[event] = function (arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});

var InvalidUrlError = createErrorType(
  "ERR_INVALID_URL",
  "Invalid URL",
  TypeError
);
// Error types with codes
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded"
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

RedirectableRequest.prototype.abort = function () {
  abortRequest(this._currentRequest);
  this.emit("abort");
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  }

  // Validate input and shift parameters if necessary
  if (!isString(data) && !isBuffer(data)) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (isFunction(encoding)) {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (isFunction(data)) {
    callback = data;
    data = encoding = null;
  }
  else if (isFunction(encoding)) {
    callback = encoding;
    encoding = null;
  }

  // Write data if needed and end
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  }
  else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function () {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
  var self = this;

  // Destroys the socket on timeout
  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  }

  // Sets up a timer to trigger a timeout event
  function startTimer(socket) {
    if (self._timeout) {
      clearTimeout(self._timeout);
    }
    self._timeout = setTimeout(function () {
      self.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  }

  // Stops a timeout from triggering
  function clearTimer() {
    // Clear the timeout
    if (self._timeout) {
      clearTimeout(self._timeout);
      self._timeout = null;
    }

    // Clean up all attached listeners
    self.removeListener("abort", clearTimer);
    self.removeListener("error", clearTimer);
    self.removeListener("response", clearTimer);
    if (callback) {
      self.removeListener("timeout", callback);
    }
    if (!self.socket) {
      self._currentRequest.removeListener("socket", startTimer);
    }
  }

  // Attach callback if passed
  if (callback) {
    this.on("timeout", callback);
  }

  // Start the timer if or when the socket is opened
  if (this.socket) {
    startTimer(this.socket);
  }
  else {
    this._currentRequest.once("socket", startTimer);
  }

  // Clean up on events
  this.on("socket", destroyOnTimeout);
  this.on("abort", clearTimer);
  this.on("error", clearTimer);
  this.on("response", clearTimer);

  return this;
};

// Proxy all other public ClientRequest methods
[
  "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present
  if (!options.headers) {
    options.headers = {};
  }

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};


// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new TypeError("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.slice(0, -1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request and set up its event handlers
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  request._redirectable = this;
  for (var event of events) {
    request.on(event, eventHandlers[event]);
  }

  // RFC7230§5.3.1: When making a request directly to an origin server, […]
  // a client MUST send only the absolute path […] as the request-target.
  this._currentUrl = /^\//.test(this._options.path) ?
    url.format(this._options) :
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path;

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      /* istanbul ignore else */
      if (request === self._currentRequest) {
        // Report any write errors
        /* istanbul ignore if */
        if (error) {
          self.emit("error", error);
        }
        // Write the next buffer if there are still left
        else if (i < buffers.length) {
          var buffer = buffers[i++];
          /* istanbul ignore else */
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        }
        // End the request if `end` has been called on us
        else if (self._ended) {
          request.end();
        }
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.

  // If the response is not a redirect; return it as-is
  var location = response.headers.location;
  if (!location || this._options.followRedirects === false ||
      statusCode < 300 || statusCode >= 400) {
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
    return;
  }

  // The response is a redirect, so abort the current request
  abortRequest(this._currentRequest);
  // Discard the remainder of the response to avoid waiting for data
  response.destroy();

  // RFC7231§6.4: A client SHOULD detect and intervene
  // in cyclical redirections (i.e., "infinite" redirection loops).
  if (++this._redirectCount > this._options.maxRedirects) {
    this.emit("error", new TooManyRedirectsError());
    return;
  }

  // Store the request headers if applicable
  var requestHeaders;
  var beforeRedirect = this._options.beforeRedirect;
  if (beforeRedirect) {
    requestHeaders = Object.assign({
      // The Host header was set by nativeProtocol.request
      Host: response.req.getHeader("host"),
    }, this._options.headers);
  }

  // RFC7231§6.4: Automatic redirection needs to done with
  // care for methods not known to be safe, […]
  // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
  // the request method from POST to GET for the subsequent request.
  var method = this._options.method;
  if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
      // RFC7231§6.4.4: The 303 (See Other) status code indicates that
      // the server is redirecting the user agent to a different resource […]
      // A user agent can perform a retrieval request targeting that URI
      // (a GET or HEAD request if using HTTP) […]
      (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
    this._options.method = "GET";
    // Drop a possible entity and headers related to it
    this._requestBodyBuffers = [];
    removeMatchingHeaders(/^content-/i, this._options.headers);
  }

  // Drop the Host header, as the redirect might lead to a different host
  var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);

  // If the redirect is relative, carry over the host of the last request
  var currentUrlParts = url.parse(this._currentUrl);
  var currentHost = currentHostHeader || currentUrlParts.host;
  var currentUrl = /^\w+:/.test(location) ? this._currentUrl :
    url.format(Object.assign(currentUrlParts, { host: currentHost }));

  // Determine the URL of the redirection
  var redirectUrl;
  try {
    redirectUrl = url.resolve(currentUrl, location);
  }
  catch (cause) {
    this.emit("error", new RedirectionError({ cause: cause }));
    return;
  }

  // Create the redirected request
  debug("redirecting to", redirectUrl);
  this._isRedirect = true;
  var redirectUrlParts = url.parse(redirectUrl);
  Object.assign(this._options, redirectUrlParts);

  // Drop confidential headers when redirecting to a less secure protocol
  // or to a different domain that is not a superdomain
  if (redirectUrlParts.protocol !== currentUrlParts.protocol &&
     redirectUrlParts.protocol !== "https:" ||
     redirectUrlParts.host !== currentHost &&
     !isSubdomain(redirectUrlParts.host, currentHost)) {
    removeMatchingHeaders(/^(?:authorization|cookie)$/i, this._options.headers);
  }

  // Evaluate the beforeRedirect callback
  if (isFunction(beforeRedirect)) {
    var responseDetails = {
      headers: response.headers,
      statusCode: statusCode,
    };
    var requestDetails = {
      url: currentUrl,
      method: method,
      headers: requestHeaders,
    };
    try {
      beforeRedirect(this._options, responseDetails, requestDetails);
    }
    catch (err) {
      this.emit("error", err);
      return;
    }
    this._sanitizeOptions(this._options);
  }

  // Perform the redirected request
  try {
    this._performRequest();
  }
  catch (cause) {
    this.emit("error", new RedirectionError({ cause: cause }));
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    function request(input, options, callback) {
      // Parse parameters
      if (isString(input)) {
        var parsed;
        try {
          parsed = urlToOptions(new URL(input));
        }
        catch (err) {
          /* istanbul ignore next */
          parsed = url.parse(input);
        }
        if (!isString(parsed.protocol)) {
          throw new InvalidUrlError({ input });
        }
        input = parsed;
      }
      else if (URL && (input instanceof URL)) {
        input = urlToOptions(input);
      }
      else {
        callback = options;
        options = input;
        input = { protocol: protocol };
      }
      if (isFunction(options)) {
        callback = options;
        options = null;
      }

      // Set defaults
      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength,
      }, input, options);
      options.nativeProtocols = nativeProtocols;
      if (!isString(options.host) && !isString(options.hostname)) {
        options.hostname = "::1";
      }

      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    }

    // Executes a GET request, following redirects
    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }

    // Expose the properties on the wrapped protocol
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get, configurable: true, enumerable: true, writable: true },
    });
  });
  return exports;
}

/* istanbul ignore next */
function noop() { /* empty */ }

// from https://github.com/nodejs/node/blob/master/lib/internal/url.js
function urlToOptions(urlObject) {
  var options = {
    protocol: urlObject.protocol,
    hostname: urlObject.hostname.startsWith("[") ?
      /* istanbul ignore next */
      urlObject.hostname.slice(1, -1) :
      urlObject.hostname,
    hash: urlObject.hash,
    search: urlObject.search,
    pathname: urlObject.pathname,
    path: urlObject.pathname + urlObject.search,
    href: urlObject.href,
  };
  if (urlObject.port !== "") {
    options.port = Number(urlObject.port);
  }
  return options;
}

function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return (lastValue === null || typeof lastValue === "undefined") ?
    undefined : String(lastValue).trim();
}

function createErrorType(code, message, baseClass) {
  // Create constructor
  function CustomError(properties) {
    Error.captureStackTrace(this, this.constructor);
    Object.assign(this, properties || {});
    this.code = code;
    this.message = this.cause ? message + ": " + this.cause.message : message;
  }

  // Attach constructor and set default properties
  CustomError.prototype = new (baseClass || Error)();
  CustomError.prototype.constructor = CustomError;
  CustomError.prototype.name = "Error [" + code + "]";
  return CustomError;
}

function abortRequest(request) {
  for (var event of events) {
    request.removeListener(event, eventHandlers[event]);
  }
  request.on("error", noop);
  request.abort();
}

function isSubdomain(subdomain, domain) {
  assert(isString(subdomain) && isString(domain));
  var dot = subdomain.length - domain.length - 1;
  return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}

function isString(value) {
  return typeof value === "string" || value instanceof String;
}

function isFunction(value) {
  return typeof value === "function";
}

function isBuffer(value) {
  return typeof value === "object" && ("length" in value);
}

// Exports
module.exports = wrap({ http: http, https: https });
module.exports.wrap = wrap;


/***/ }),

/***/ 20054:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var CombinedStream = __webpack_require__(97143);
var util = __webpack_require__(73837);
var path = __webpack_require__(71017);
var http = __webpack_require__(13685);
var https = __webpack_require__(95687);
var parseUrl = (__webpack_require__(57310).parse);
var fs = __webpack_require__(57147);
var Stream = (__webpack_require__(12781).Stream);
var mime = __webpack_require__(32994);
var asynckit = __webpack_require__(52353);
var populate = __webpack_require__(13024);

// Public API
module.exports = FormData;

// make it a Stream
util.inherits(FormData, CombinedStream);

/**
 * Create readable "multipart/form-data" streams.
 * Can be used to submit forms
 * and file uploads to other web applications.
 *
 * @constructor
 * @param {Object} options - Properties to be added/overriden for FormData and CombinedStream
 */
function FormData(options) {
  if (!(this instanceof FormData)) {
    return new FormData(options);
  }

  this._overheadLength = 0;
  this._valueLength = 0;
  this._valuesToMeasure = [];

  CombinedStream.call(this);

  options = options || {};
  for (var option in options) {
    this[option] = options[option];
  }
}

FormData.LINE_BREAK = '\r\n';
FormData.DEFAULT_CONTENT_TYPE = 'application/octet-stream';

FormData.prototype.append = function(field, value, options) {

  options = options || {};

  // allow filename as single option
  if (typeof options == 'string') {
    options = {filename: options};
  }

  var append = CombinedStream.prototype.append.bind(this);

  // all that streamy business can't handle numbers
  if (typeof value == 'number') {
    value = '' + value;
  }

  // https://github.com/felixge/node-form-data/issues/38
  if (util.isArray(value)) {
    // Please convert your array into string
    // the way web server expects it
    this._error(new Error('Arrays are not supported.'));
    return;
  }

  var header = this._multiPartHeader(field, value, options);
  var footer = this._multiPartFooter();

  append(header);
  append(value);
  append(footer);

  // pass along options.knownLength
  this._trackLength(header, value, options);
};

FormData.prototype._trackLength = function(header, value, options) {
  var valueLength = 0;

  // used w/ getLengthSync(), when length is known.
  // e.g. for streaming directly from a remote server,
  // w/ a known file a size, and not wanting to wait for
  // incoming file to finish to get its size.
  if (options.knownLength != null) {
    valueLength += +options.knownLength;
  } else if (Buffer.isBuffer(value)) {
    valueLength = value.length;
  } else if (typeof value === 'string') {
    valueLength = Buffer.byteLength(value);
  }

  this._valueLength += valueLength;

  // @check why add CRLF? does this account for custom/multiple CRLFs?
  this._overheadLength +=
    Buffer.byteLength(header) +
    FormData.LINE_BREAK.length;

  // empty or either doesn't have path or not an http response or not a stream
  if (!value || ( !value.path && !(value.readable && value.hasOwnProperty('httpVersion')) && !(value instanceof Stream))) {
    return;
  }

  // no need to bother with the length
  if (!options.knownLength) {
    this._valuesToMeasure.push(value);
  }
};

FormData.prototype._lengthRetriever = function(value, callback) {

  if (value.hasOwnProperty('fd')) {

    // take read range into a account
    // `end` = Infinity –> read file till the end
    //
    // TODO: Looks like there is bug in Node fs.createReadStream
    // it doesn't respect `end` options without `start` options
    // Fix it when node fixes it.
    // https://github.com/joyent/node/issues/7819
    if (value.end != undefined && value.end != Infinity && value.start != undefined) {

      // when end specified
      // no need to calculate range
      // inclusive, starts with 0
      callback(null, value.end + 1 - (value.start ? value.start : 0));

    // not that fast snoopy
    } else {
      // still need to fetch file size from fs
      fs.stat(value.path, function(err, stat) {

        var fileSize;

        if (err) {
          callback(err);
          return;
        }

        // update final size based on the range options
        fileSize = stat.size - (value.start ? value.start : 0);
        callback(null, fileSize);
      });
    }

  // or http response
  } else if (value.hasOwnProperty('httpVersion')) {
    callback(null, +value.headers['content-length']);

  // or request stream http://github.com/mikeal/request
  } else if (value.hasOwnProperty('httpModule')) {
    // wait till response come back
    value.on('response', function(response) {
      value.pause();
      callback(null, +response.headers['content-length']);
    });
    value.resume();

  // something else
  } else {
    callback('Unknown stream');
  }
};

FormData.prototype._multiPartHeader = function(field, value, options) {
  // custom header specified (as string)?
  // it becomes responsible for boundary
  // (e.g. to handle extra CRLFs on .NET servers)
  if (typeof options.header == 'string') {
    return options.header;
  }

  var contentDisposition = this._getContentDisposition(value, options);
  var contentType = this._getContentType(value, options);

  var contents = '';
  var headers  = {
    // add custom disposition as third element or keep it two elements if not
    'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
    // if no content type. allow it to be empty array
    'Content-Type': [].concat(contentType || [])
  };

  // allow custom headers.
  if (typeof options.header == 'object') {
    populate(headers, options.header);
  }

  var header;
  for (var prop in headers) {
    if (!headers.hasOwnProperty(prop)) continue;
    header = headers[prop];

    // skip nullish headers.
    if (header == null) {
      continue;
    }

    // convert all headers to arrays.
    if (!Array.isArray(header)) {
      header = [header];
    }

    // add non-empty headers.
    if (header.length) {
      contents += prop + ': ' + header.join('; ') + FormData.LINE_BREAK;
    }
  }

  return '--' + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
};

FormData.prototype._getContentDisposition = function(value, options) {

  var filename
    , contentDisposition
    ;

  if (typeof options.filepath === 'string') {
    // custom filepath for relative paths
    filename = path.normalize(options.filepath).replace(/\\/g, '/');
  } else if (options.filename || value.name || value.path) {
    // custom filename take precedence
    // formidable and the browser add a name property
    // fs- and request- streams have path property
    filename = path.basename(options.filename || value.name || value.path);
  } else if (value.readable && value.hasOwnProperty('httpVersion')) {
    // or try http response
    filename = path.basename(value.client._httpMessage.path || '');
  }

  if (filename) {
    contentDisposition = 'filename="' + filename + '"';
  }

  return contentDisposition;
};

FormData.prototype._getContentType = function(value, options) {

  // use custom content-type above all
  var contentType = options.contentType;

  // or try `name` from formidable, browser
  if (!contentType && value.name) {
    contentType = mime.lookup(value.name);
  }

  // or try `path` from fs-, request- streams
  if (!contentType && value.path) {
    contentType = mime.lookup(value.path);
  }

  // or if it's http-reponse
  if (!contentType && value.readable && value.hasOwnProperty('httpVersion')) {
    contentType = value.headers['content-type'];
  }

  // or guess it from the filepath or filename
  if (!contentType && (options.filepath || options.filename)) {
    contentType = mime.lookup(options.filepath || options.filename);
  }

  // fallback to the default content type if `value` is not simple value
  if (!contentType && typeof value == 'object') {
    contentType = FormData.DEFAULT_CONTENT_TYPE;
  }

  return contentType;
};

FormData.prototype._multiPartFooter = function() {
  return function(next) {
    var footer = FormData.LINE_BREAK;

    var lastPart = (this._streams.length === 0);
    if (lastPart) {
      footer += this._lastBoundary();
    }

    next(footer);
  }.bind(this);
};

FormData.prototype._lastBoundary = function() {
  return '--' + this.getBoundary() + '--' + FormData.LINE_BREAK;
};

FormData.prototype.getHeaders = function(userHeaders) {
  var header;
  var formHeaders = {
    'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
  };

  for (header in userHeaders) {
    if (userHeaders.hasOwnProperty(header)) {
      formHeaders[header.toLowerCase()] = userHeaders[header];
    }
  }

  return formHeaders;
};

FormData.prototype.setBoundary = function(boundary) {
  this._boundary = boundary;
};

FormData.prototype.getBoundary = function() {
  if (!this._boundary) {
    this._generateBoundary();
  }

  return this._boundary;
};

FormData.prototype.getBuffer = function() {
  var dataBuffer = new Buffer.alloc( 0 );
  var boundary = this.getBoundary();

  // Create the form content. Add Line breaks to the end of data.
  for (var i = 0, len = this._streams.length; i < len; i++) {
    if (typeof this._streams[i] !== 'function') {

      // Add content to the buffer.
      if(Buffer.isBuffer(this._streams[i])) {
        dataBuffer = Buffer.concat( [dataBuffer, this._streams[i]]);
      }else {
        dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(this._streams[i])]);
      }

      // Add break after content.
      if (typeof this._streams[i] !== 'string' || this._streams[i].substring( 2, boundary.length + 2 ) !== boundary) {
        dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(FormData.LINE_BREAK)] );
      }
    }
  }

  // Add the footer and return the Buffer object.
  return Buffer.concat( [dataBuffer, Buffer.from(this._lastBoundary())] );
};

FormData.prototype._generateBoundary = function() {
  // This generates a 50 character boundary similar to those used by Firefox.
  // They are optimized for boyer-moore parsing.
  var boundary = '--------------------------';
  for (var i = 0; i < 24; i++) {
    boundary += Math.floor(Math.random() * 10).toString(16);
  }

  this._boundary = boundary;
};

// Note: getLengthSync DOESN'T calculate streams length
// As workaround one can calculate file size manually
// and add it as knownLength option
FormData.prototype.getLengthSync = function() {
  var knownLength = this._overheadLength + this._valueLength;

  // Don't get confused, there are 3 "internal" streams for each keyval pair
  // so it basically checks if there is any value added to the form
  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  // https://github.com/form-data/form-data/issues/40
  if (!this.hasKnownLength()) {
    // Some async length retrievers are present
    // therefore synchronous length calculation is false.
    // Please use getLength(callback) to get proper length
    this._error(new Error('Cannot calculate proper length in synchronous way.'));
  }

  return knownLength;
};

// Public API to check if length of added values is known
// https://github.com/form-data/form-data/issues/196
// https://github.com/form-data/form-data/issues/262
FormData.prototype.hasKnownLength = function() {
  var hasKnownLength = true;

  if (this._valuesToMeasure.length) {
    hasKnownLength = false;
  }

  return hasKnownLength;
};

FormData.prototype.getLength = function(cb) {
  var knownLength = this._overheadLength + this._valueLength;

  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  if (!this._valuesToMeasure.length) {
    process.nextTick(cb.bind(this, null, knownLength));
    return;
  }

  asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
    if (err) {
      cb(err);
      return;
    }

    values.forEach(function(length) {
      knownLength += length;
    });

    cb(null, knownLength);
  });
};

FormData.prototype.submit = function(params, cb) {
  var request
    , options
    , defaults = {method: 'post'}
    ;

  // parse provided url if it's string
  // or treat it as options object
  if (typeof params == 'string') {

    params = parseUrl(params);
    options = populate({
      port: params.port,
      path: params.pathname,
      host: params.hostname,
      protocol: params.protocol
    }, defaults);

  // use custom params
  } else {

    options = populate(params, defaults);
    // if no port provided use default one
    if (!options.port) {
      options.port = options.protocol == 'https:' ? 443 : 80;
    }
  }

  // put that good code in getHeaders to some use
  options.headers = this.getHeaders(params.headers);

  // https if specified, fallback to http in any other case
  if (options.protocol == 'https:') {
    request = https.request(options);
  } else {
    request = http.request(options);
  }

  // get content length and fire away
  this.getLength(function(err, length) {
    if (err && err !== 'Unknown stream') {
      this._error(err);
      return;
    }

    // add content length
    if (length) {
      request.setHeader('Content-Length', length);
    }

    this.pipe(request);
    if (cb) {
      var onResponse;

      var callback = function (error, responce) {
        request.removeListener('error', callback);
        request.removeListener('response', onResponse);

        return cb.call(this, error, responce);
      };

      onResponse = callback.bind(this, null);

      request.on('error', callback);
      request.on('response', onResponse);
    }
  }.bind(this));

  return request;
};

FormData.prototype._error = function(err) {
  if (!this.error) {
    this.error = err;
    this.pause();
    this.emit('error', err);
  }
};

FormData.prototype.toString = function () {
  return '[object FormData]';
};


/***/ }),

/***/ 13024:
/***/ ((module) => {

// populates missing values
module.exports = function(dst, src) {

  Object.keys(src).forEach(function(prop)
  {
    dst[prop] = dst[prop] || src[prop];
  });

  return dst;
};


/***/ }),

/***/ 93764:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Module dependencies
 */

var debug = __webpack_require__(17783)('jsonp');

/**
 * Module exports.
 */

module.exports = jsonp;

/**
 * Callback index.
 */

var count = 0;

/**
 * Noop function.
 */

function noop(){}

/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`)
 *  - prefix {String} qs parameter (`__jp`)
 *  - name {String} qs parameter (`prefix` + incr)
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */

function jsonp(url, opts, fn){
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }
  if (!opts) opts = {};

  var prefix = opts.prefix || '__jp';

  // use the callback name that was passed if one was provided.
  // otherwise generate a unique name by incrementing our counter.
  var id = opts.name || (prefix + (count++));

  var param = opts.param || 'callback';
  var timeout = null != opts.timeout ? opts.timeout : 60000;
  var enc = encodeURIComponent;
  var target = document.getElementsByTagName('script')[0] || document.head;
  var script;
  var timer;


  if (timeout) {
    timer = setTimeout(function(){
      cleanup();
      if (fn) fn(new Error('Timeout'));
    }, timeout);
  }

  function cleanup(){
    if (script.parentNode) script.parentNode.removeChild(script);
    window[id] = noop;
    if (timer) clearTimeout(timer);
  }

  function cancel(){
    if (window[id]) {
      cleanup();
    }
  }

  window[id] = function(data){
    debug('jsonp got', data);
    cleanup();
    if (fn) fn(null, data);
  };

  // add qs component
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
  url = url.replace('?&', '?');

  debug('jsonp req "%s"', url);

  // create script
  script = document.createElement('script');
  script.src = url;
  target.parentNode.insertBefore(script, target);

  return cancel;
}


/***/ }),

/***/ 64931:
/***/ ((module) => {


module.exports = function load (src, opts, cb) {
  var head = document.head || document.getElementsByTagName('head')[0]
  var script = document.createElement('script')

  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  opts = opts || {}
  cb = cb || function() {}

  script.type = opts.type || 'text/javascript'
  script.charset = opts.charset || 'utf8';
  script.async = 'async' in opts ? !!opts.async : true
  script.src = src

  if (opts.attrs) {
    setAttributes(script, opts.attrs)
  }

  if (opts.text) {
    script.text = '' + opts.text
  }

  var onend = 'onload' in script ? stdOnEnd : ieOnEnd
  onend(script, cb)

  // some good legacy browsers (firefox) fail the 'in' detection above
  // so as a fallback we always set onload
  // old IE will ignore this and new IE will set onload
  if (!script.onload) {
    stdOnEnd(script, cb);
  }

  head.appendChild(script)
}

function setAttributes(script, attrs) {
  for (var attr in attrs) {
    script.setAttribute(attr, attrs[attr]);
  }
}

function stdOnEnd (script, cb) {
  script.onload = function () {
    this.onerror = this.onload = null
    cb(null, script)
  }
  script.onerror = function () {
    // this.onload = null here is necessary
    // because even IE9 works not like others
    this.onerror = this.onload = null
    cb(new Error('Failed to load ' + this.src), script)
  }
}

function ieOnEnd (script, cb) {
  script.onreadystatechange = function () {
    if (this.readyState != 'complete' && this.readyState != 'loaded') return
    this.onreadystatechange = null
    cb(null, script) // there is no way to catch loading errors in IE8
  }
}


/***/ }),

/***/ 97024:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 */

module.exports = __webpack_require__(40572)


/***/ }),

/***/ 32994:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var db = __webpack_require__(97024)
var extname = (__webpack_require__(71017).extname)

/**
 * Module variables.
 * @private
 */

var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/
var TEXT_TYPE_REGEXP = /^text\//i

/**
 * Module exports.
 * @public
 */

exports.charset = charset
exports.charsets = { lookup: charset }
exports.contentType = contentType
exports.extension = extension
exports.extensions = Object.create(null)
exports.lookup = lookup
exports.types = Object.create(null)

// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types)

/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)
  var mime = match && db[match[1].toLowerCase()]

  if (mime && mime.charset) {
    return mime.charset
  }

  // default text/* to utf-8
  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
    return 'UTF-8'
  }

  return false
}

/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */

function contentType (str) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false
  }

  var mime = str.indexOf('/') === -1
    ? exports.lookup(str)
    : str

  if (!mime) {
    return false
  }

  // TODO: use content-type or other module
  if (mime.indexOf('charset') === -1) {
    var charset = exports.charset(mime)
    if (charset) mime += '; charset=' + charset.toLowerCase()
  }

  return mime
}

/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function extension (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)

  // get extensions
  var exts = match && exports.extensions[match[1].toLowerCase()]

  if (!exts || !exts.length) {
    return false
  }

  return exts[0]
}

/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */

function lookup (path) {
  if (!path || typeof path !== 'string') {
    return false
  }

  // get the extension ("ext" or ".ext" or full path)
  var extension = extname('x.' + path)
    .toLowerCase()
    .substr(1)

  if (!extension) {
    return false
  }

  return exports.types[extension] || false
}

/**
 * Populate the extensions and types maps.
 * @private
 */

function populateMaps (extensions, types) {
  // source preference (least -> most)
  var preference = ['nginx', 'apache', undefined, 'iana']

  Object.keys(db).forEach(function forEachMimeType (type) {
    var mime = db[type]
    var exts = mime.extensions

    if (!exts || !exts.length) {
      return
    }

    // mime -> extensions
    extensions[type] = exts

    // extension -> mime
    for (var i = 0; i < exts.length; i++) {
      var extension = exts[i]

      if (types[extension]) {
        var from = preference.indexOf(db[types[extension]].source)
        var to = preference.indexOf(mime.source)

        if (types[extension] !== 'application/octet-stream' &&
          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
          // skip the remapping
          continue
        }
      }

      // set the extension -> mime
      types[extension] = type
    }
  })
}


/***/ }),

/***/ 69842:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),

/***/ 12492:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
__webpack_unused_export__ = ({value:!0});var t=__webpack_require__(18038),e=__webpack_require__(93764);function n(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var o=n(t),r=n(e),c=function(t,e){return c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},c(t,e)};function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}c(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}var a=function(){return a=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t},a.apply(this,arguments)};function l(t,e){var n={};for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.indexOf(o)<0&&(n[o]=t[o]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(t);r<o.length;r++)e.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(t,o[r])&&(n[o[r]]=t[o[r]])}return n}function u(t,e,n,o){return new(n||(n=Promise))((function(r,c){function i(t){try{l(o.next(t))}catch(t){c(t)}}function a(t){try{l(o.throw(t))}catch(t){c(t)}}function l(t){var e;t.done?r(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,a)}l((o=o.apply(t,e||[])).next())}))}function s(t,e){var n,o,r,c,i={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return c={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(c[Symbol.iterator]=function(){return this}),c;function a(a){return function(l){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;c&&(c=0,a[0]&&(i=0)),i;)try{if(n=1,o&&(r=2&a[0]?o.return:a[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,a[1])).done)return r;switch(o=0,r&&(a=[2&a[0],r.value]),a[0]){case 0:case 1:r=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,o=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(r=i.trys,(r=r.length>0&&r[r.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!r||a[1]>r[0]&&a[1]<r[3])){i.label=a[1];break}if(6===a[0]&&i.label<r[1]){i.label=r[1],r=a;break}if(r&&i.label<r[2]){i.label=r[2],i.ops.push(a);break}r[2]&&i.ops.pop(),i.trys.pop();continue}a=e.call(t,i)}catch(t){a=[6,t],o=0}finally{n=r=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,l])}}}function p(t){return function(e){var n=e.bgStyle,r=void 0===n?{}:n,c=e.borderRadius,i=void 0===c?0:c,u=e.iconFillColor,s=void 0===u?"white":u,p=e.round,h=e.size,d=void 0===h?64:h,w=l(e,["bgStyle","borderRadius","iconFillColor","round","size"]);return o.default.createElement("svg",a({viewBox:"0 0 64 64",width:d,height:d},w),p?o.default.createElement("circle",{cx:"32",cy:"32",r:"31",fill:t.color,style:r}):o.default.createElement("rect",{width:"64",height:"64",rx:i,ry:i,fill:t.color,style:r}),o.default.createElement("path",{d:t.path,fill:s}))}}"function"==typeof SuppressedError&&SuppressedError;var h=p({color:"#3b5998",name:"facebook",path:"M34.1,47V33.3h4.6l0.7-5.3h-5.3v-3.4c0-1.5,0.4-2.6,2.6-2.6l2.8,0v-4.8c-0.5-0.1-2.2-0.2-4.1-0.2 c-4.1,0-6.9,2.5-6.9,7V28H24v5.3h4.6V47H34.1z"}),d=p({color:"#00b800",name:"line",path:"M52.62 30.138c0 3.693-1.432 7.019-4.42 10.296h.001c-4.326 4.979-14 11.044-16.201 11.972-2.2.927-1.876-.591-1.786-1.112l.294-1.765c.069-.527.142-1.343-.066-1.865-.232-.574-1.146-.872-1.817-1.016-9.909-1.31-17.245-8.238-17.245-16.51 0-9.226 9.251-16.733 20.62-16.733 11.37 0 20.62 7.507 20.62 16.733zM27.81 25.68h-1.446a.402.402 0 0 0-.402.401v8.985c0 .221.18.4.402.4h1.446a.401.401 0 0 0 .402-.4v-8.985a.402.402 0 0 0-.402-.401zm9.956 0H36.32a.402.402 0 0 0-.402.401v5.338L31.8 25.858a.39.39 0 0 0-.031-.04l-.002-.003-.024-.025-.008-.007a.313.313 0 0 0-.032-.026.255.255 0 0 1-.021-.014l-.012-.007-.021-.012-.013-.006-.023-.01-.013-.005-.024-.008-.014-.003-.023-.005-.017-.002-.021-.003-.021-.002h-1.46a.402.402 0 0 0-.402.401v8.985c0 .221.18.4.402.4h1.446a.401.401 0 0 0 .402-.4v-5.337l4.123 5.568c.028.04.063.072.101.099l.004.003a.236.236 0 0 0 .025.015l.012.006.019.01a.154.154 0 0 1 .019.008l.012.004.028.01.005.001a.442.442 0 0 0 .104.013h1.446a.4.4 0 0 0 .401-.4v-8.985a.402.402 0 0 0-.401-.401zm-13.442 7.537h-3.93v-7.136a.401.401 0 0 0-.401-.401h-1.447a.4.4 0 0 0-.401.401v8.984a.392.392 0 0 0 .123.29c.072.068.17.111.278.111h5.778a.4.4 0 0 0 .401-.401v-1.447a.401.401 0 0 0-.401-.401zm21.429-5.287c.222 0 .401-.18.401-.402v-1.446a.401.401 0 0 0-.401-.402h-5.778a.398.398 0 0 0-.279.113l-.005.004-.006.008a.397.397 0 0 0-.111.276v8.984c0 .108.043.206.112.278l.005.006a.401.401 0 0 0 .284.117h5.778a.4.4 0 0 0 .401-.401v-1.447a.401.401 0 0 0-.401-.401h-3.93v-1.519h3.93c.222 0 .401-.18.401-.402V29.85a.401.401 0 0 0-.401-.402h-3.93V27.93h3.93z"}),w=p({color:"#cb2128",name:"pinterest",path:"M32,16c-8.8,0-16,7.2-16,16c0,6.6,3.9,12.2,9.6,14.7c0-1.1,0-2.5,0.3-3.7 c0.3-1.3,2.1-8.7,2.1-8.7s-0.5-1-0.5-2.5c0-2.4,1.4-4.1,3.1-4.1c1.5,0,2.2,1.1,2.2,2.4c0,1.5-0.9,3.7-1.4,5.7 c-0.4,1.7,0.9,3.1,2.5,3.1c3,0,5.1-3.9,5.1-8.5c0-3.5-2.4-6.1-6.7-6.1c-4.9,0-7.9,3.6-7.9,7.7c0,1.4,0.4,2.4,1.1,3.1 c0.3,0.3,0.3,0.5,0.2,0.9c-0.1,0.3-0.3,1-0.3,1.3c-0.1,0.4-0.4,0.6-0.8,0.4c-2.2-0.9-3.3-3.4-3.3-6.1c0-4.5,3.8-10,11.4-10 c6.1,0,10.1,4.4,10.1,9.2c0,6.3-3.5,11-8.6,11c-1.7,0-3.4-0.9-3.9-2c0,0-0.9,3.7-1.1,4.4c-0.3,1.2-1,2.5-1.6,3.4 c1.4,0.4,3,0.7,4.5,0.7c8.8,0,16-7.2,16-16C48,23.2,40.8,16,32,16z"}),f=p({color:"#ff4500",name:"reddit",path:"m 52.8165,31.942362 c 0,-2.4803 -2.0264,-4.4965 -4.5169,-4.4965 -1.2155,0 -2.3171,0.4862 -3.128,1.2682 -3.077,-2.0247 -7.2403,-3.3133 -11.8507,-3.4782 l 2.5211,-7.9373 6.8272,1.5997 -0.0102,0.0986 c 0,2.0281 1.6575,3.6771 3.6958,3.6771 2.0366,0 3.6924,-1.649 3.6924,-3.6771 0,-2.0281 -1.6575,-3.6788 -3.6924,-3.6788 -1.564,0 -2.8968,0.9758 -3.4357,2.3443 l -7.3593,-1.7255 c -0.3213,-0.0782 -0.6477,0.1071 -0.748,0.4233 L 32,25.212062 c -4.8246,0.0578 -9.1953,1.3566 -12.41,3.4425 -0.8058,-0.7446 -1.8751,-1.2104 -3.0583,-1.2104 -2.4905,0 -4.5152,2.0179 -4.5152,4.4982 0,1.649 0.9061,3.0787 2.2389,3.8607 -0.0884,0.4794 -0.1462,0.9639 -0.1462,1.4569 0,6.6487 8.1736,12.0581 18.2223,12.0581 10.0487,0 18.224,-5.4094 18.224,-12.0581 0,-0.4658 -0.0493,-0.9248 -0.1275,-1.377 1.4144,-0.7599 2.3885,-2.2304 2.3885,-3.9406 z m -29.2808,3.0872 c 0,-1.4756 1.207,-2.6775 2.6894,-2.6775 1.4824,0 2.6877,1.2019 2.6877,2.6775 0,1.4756 -1.2053,2.6758 -2.6877,2.6758 -1.4824,0 -2.6894,-1.2002 -2.6894,-2.6758 z m 15.4037,7.9373 c -1.3549,1.3481 -3.4816,2.0043 -6.5008,2.0043 l -0.0221,-0.0051 -0.0221,0.0051 c -3.0209,0 -5.1476,-0.6562 -6.5008,-2.0043 -0.2465,-0.2448 -0.2465,-0.6443 0,-0.8891 0.2465,-0.2465 0.6477,-0.2465 0.8942,0 1.105,1.0999 2.9393,1.6337 5.6066,1.6337 l 0.0221,0.0051 0.0221,-0.0051 c 2.6673,0 4.5016,-0.5355 5.6066,-1.6354 0.2465,-0.2465 0.6477,-0.2448 0.8942,0 0.2465,0.2465 0.2465,0.6443 0,0.8908 z m -0.3213,-5.2615 c -1.4824,0 -2.6877,-1.2002 -2.6877,-2.6758 0,-1.4756 1.2053,-2.6775 2.6877,-2.6775 1.4824,0 2.6877,1.2019 2.6877,2.6775 0,1.4756 -1.2053,2.6758 -2.6877,2.6758 z"}),C=p({color:"#37aee2",name:"telegram",path:"m45.90873,15.44335c-0.6901,-0.0281 -1.37668,0.14048 -1.96142,0.41265c-0.84989,0.32661 -8.63939,3.33986 -16.5237,6.39174c-3.9685,1.53296 -7.93349,3.06593 -10.98537,4.24067c-3.05012,1.1765 -5.34694,2.05098 -5.4681,2.09312c-0.80775,0.28096 -1.89996,0.63566 -2.82712,1.72788c-0.23354,0.27218 -0.46884,0.62161 -0.58825,1.10275c-0.11941,0.48114 -0.06673,1.09222 0.16682,1.5716c0.46533,0.96052 1.25376,1.35737 2.18443,1.71383c3.09051,0.99037 6.28638,1.93508 8.93263,2.8236c0.97632,3.44171 1.91401,6.89571 2.84116,10.34268c0.30554,0.69185 0.97105,0.94823 1.65764,0.95525l-0.00351,0.03512c0,0 0.53908,0.05268 1.06412,-0.07375c0.52679,-0.12292 1.18879,-0.42846 1.79109,-0.99212c0.662,-0.62161 2.45836,-2.38812 3.47683,-3.38552l7.6736,5.66477l0.06146,0.03512c0,0 0.84989,0.59703 2.09312,0.68132c0.62161,0.04214 1.4399,-0.07726 2.14229,-0.59176c0.70766,-0.51626 1.1765,-1.34683 1.396,-2.29506c0.65673,-2.86224 5.00979,-23.57745 5.75257,-27.00686l-0.02107,0.08077c0.51977,-1.93157 0.32837,-3.70159 -0.87096,-4.74991c-0.60054,-0.52152 -1.2924,-0.7498 -1.98425,-0.77965l0,0.00176zm-0.2072,3.29069c0.04741,0.0439 0.0439,0.0439 0.00351,0.04741c-0.01229,-0.00351 0.14048,0.2072 -0.15804,1.32576l-0.01229,0.04214l-0.00878,0.03863c-0.75858,3.50668 -5.15554,24.40802 -5.74203,26.96472c-0.08077,0.34417 -0.11414,0.31959 -0.09482,0.29852c-0.1756,-0.02634 -0.50045,-0.16506 -0.52679,-0.1756l-13.13468,-9.70175c4.4988,-4.33199 9.09945,-8.25307 13.744,-12.43229c0.8218,-0.41265 0.68483,-1.68573 -0.29852,-1.70681c-1.04305,0.24584 -1.92279,0.99564 -2.8798,1.47502c-5.49971,3.2626 -11.11882,6.13186 -16.55882,9.49279c-2.792,-0.97105 -5.57873,-1.77704 -8.15298,-2.57601c2.2336,-0.89555 4.00889,-1.55579 5.75608,-2.23009c3.05188,-1.1765 7.01687,-2.7042 10.98537,-4.24067c7.94051,-3.06944 15.92667,-6.16346 16.62028,-6.43037l0.05619,-0.02283l0.05268,-0.02283c0.19316,-0.0878 0.30378,-0.09658 0.35471,-0.10009c0,0 -0.01756,-0.05795 -0.00351,-0.04566l-0.00176,0zm-20.91715,22.0638l2.16687,1.60145c-0.93418,0.91311 -1.81743,1.77353 -2.45485,2.38812l0.28798,-3.98957"}),m=p({color:"#2c4762",name:"tumblr",path:"M39.2,41c-0.6,0.3-1.6,0.5-2.4,0.5c-2.4,0.1-2.9-1.7-2.9-3v-9.3h6v-4.5h-6V17c0,0-4.3,0-4.4,0 c-0.1,0-0.2,0.1-0.2,0.2c-0.3,2.3-1.4,6.4-5.9,8.1v3.9h3V39c0,3.4,2.5,8.1,9,8c2.2,0,4.7-1,5.2-1.8L39.2,41z"}),v=p({color:"#00aced",name:"twitter",path:"M48,22.1c-1.2,0.5-2.4,0.9-3.8,1c1.4-0.8,2.4-2.1,2.9-3.6c-1.3,0.8-2.7,1.3-4.2,1.6 C41.7,19.8,40,19,38.2,19c-3.6,0-6.6,2.9-6.6,6.6c0,0.5,0.1,1,0.2,1.5c-5.5-0.3-10.3-2.9-13.5-6.9c-0.6,1-0.9,2.1-0.9,3.3 c0,2.3,1.2,4.3,2.9,5.5c-1.1,0-2.1-0.3-3-0.8c0,0,0,0.1,0,0.1c0,3.2,2.3,5.8,5.3,6.4c-0.6,0.1-1.1,0.2-1.7,0.2c-0.4,0-0.8,0-1.2-0.1 c0.8,2.6,3.3,4.5,6.1,4.6c-2.2,1.8-5.1,2.8-8.2,2.8c-0.5,0-1.1,0-1.6-0.1c2.9,1.9,6.4,2.9,10.1,2.9c12.1,0,18.7-10,18.7-18.7 c0-0.3,0-0.6,0-0.8C46,24.5,47.1,23.4,48,22.1z"}),b=p({color:"#7C529E",name:"viber",path:"m31.0,12.3c9.0,0.2 16.4,6.2 18.0,15.2c0.2,1.5 0.3,3.0 0.4,4.6a1.0,1.0 0 0 1 -0.8,1.2l-0.1,0a1.1,1.1 0 0 1 -1.0,-1.2l0,0c-0.0,-1.2 -0.1,-2.5 -0.3,-3.8a16.1,16.1 0 0 0 -13.0,-13.5c-1.0,-0.1 -2.0,-0.2 -3.0,-0.3c-0.6,-0.0 -1.4,-0.1 -1.6,-0.8a1.1,1.1 0 0 1 0.9,-1.2l0.6,0l0.0,-0.0zm10.6,39.2a19.9,19.9 0 0 1 -2.1,-0.6c-6.9,-2.9 -13.2,-6.6 -18.3,-12.2a47.5,47.5 0 0 1 -7.0,-10.7c-0.8,-1.8 -1.6,-3.7 -2.4,-5.6c-0.6,-1.7 0.3,-3.4 1.4,-4.7a11.3,11.3 0 0 1 3.7,-2.8a2.4,2.4 0 0 1 3.0,0.7a39.0,39.0 0 0 1 4.7,6.5a3.1,3.1 0 0 1 -0.8,4.2c-0.3,0.2 -0.6,0.5 -1.0,0.8a3.3,3.3 0 0 0 -0.7,0.7a2.1,2.1 0 0 0 -0.1,1.9c1.7,4.9 4.7,8.7 9.7,10.8a5.0,5.0 0 0 0 2.5,0.6c1.5,-0.1 2.0,-1.8 3.1,-2.7a2.9,2.9 0 0 1 3.5,-0.1c1.1,0.7 2.2,1.4 3.3,2.2a37.8,37.8 0 0 1 3.1,2.4a2.4,2.4 0 0 1 0.7,3.0a10.4,10.4 0 0 1 -4.4,4.8a10.8,10.8 0 0 1 -1.9,0.6c-0.7,-0.2 0.6,-0.2 0,0l0.0,0l0,-0.0zm3.1,-21.4a4.2,4.2 0 0 1 -0.0,0.6a1.0,1.0 0 0 1 -1.9,0.1a2.7,2.7 0 0 1 -0.1,-0.8a10.9,10.9 0 0 0 -1.4,-5.5a10.2,10.2 0 0 0 -4.2,-4.0a12.3,12.3 0 0 0 -3.4,-1.0c-0.5,-0.0 -1.0,-0.1 -1.5,-0.2a0.9,0.9 0 0 1 -0.9,-1.0l0,-0.1a0.9,0.9 0 0 1 0.9,-0.9l0.1,0a14.1,14.1 0 0 1 5.9,1.5a11.9,11.9 0 0 1 6.5,9.3c0,0.1 0.0,0.3 0.0,0.5c0,0.4 0.0,0.9 0.0,1.5l0,0l0.0,0.0zm-5.6,-0.2a1.1,1.1 0 0 1 -1.2,-0.9l0,-0.1a11.3,11.3 0 0 0 -0.2,-1.4a4.0,4.0 0 0 0 -1.5,-2.3a3.9,3.9 0 0 0 -1.2,-0.5c-0.5,-0.1 -1.1,-0.1 -1.6,-0.2a1.0,1.0 0 0 1 -0.8,-1.1l0,0l0,0a1.0,1.0 0 0 1 1.1,-0.8c3.4,0.2 6.0,2.0 6.3,6.2a2.8,2.8 0 0 1 0,0.8a0.8,0.8 0 0 1 -0.8,0.7l0,0l0.0,-0.0z"}),g=p({color:"#CD201F",name:"weibo",path:"M40.9756152,15.0217119 C40.5000732,15.0546301 39.9999314,15.1204666 39.5325878,15.2192213 C38.6634928,15.4085016 38.0977589,16.2643757 38.2863368,17.1284787 C38.4667163,18.0008129 39.3194143,18.5686519 40.1885094,18.3793715 C42.8613908,17.8115326 45.7720411,18.6427174 47.7316073,20.8153207 C49.6911735,22.996153 50.2077122,25.975254 49.3714112,28.5840234 C49.1008441,29.4316684 49.5763861,30.3533789 50.4208857,30.6249537 C51.2653852,30.8965286 52.1754769,30.4192153 52.4542425,29.5715703 C53.6349013,25.9011885 52.9133876,21.7699494 50.1585171,18.7085538 C48.0923641,16.4042776 45.2063093,15.1533848 42.3530505,15.0217119 C41.8775084,14.9970227 41.4511594,14.9887937 40.9756152,15.0217119 Z M27.9227762,19.8277737 C24.9957268,20.140498 20.863421,22.4365431 17.2312548,26.0822378 C13.2711279,30.0571148 11,34.2871065 11,37.9328012 C11,44.9032373 19.8713401,49.125 28.5786978,49.125 C39.9917329,49.125 47.600423,42.4261409 47.600423,37.1427636 C47.600423,33.9496952 44.9603397,32.1638816 42.549827,31.4149913 C41.9594976,31.2339421 41.5167516,31.1434164 41.8283133,30.3616079 C42.5006339,28.66632 42.6236176,27.1932286 41.8939054,26.1480742 C40.5328692,24.1894405 36.7203236,24.2881952 32.448635,26.0822378 C32.448635,26.0822378 31.1203949,26.6912261 31.4647526,25.6213825 C32.1206742,23.4981576 32.0304845,21.712342 31.0056075,20.6836478 C30.2840938,19.9512176 29.2510184,19.6878718 27.9227762,19.8277737 Z M42.0906819,20.6836478 C41.6233383,20.6589586 41.1723917,20.716566 40.7132466,20.8153207 C39.9671353,20.9716828 39.4997917,21.7781784 39.6637721,22.5270687 C39.8277525,23.275959 40.5574647,23.7450433 41.303576,23.5804521 C42.1972686,23.3911718 43.2057485,23.6380596 43.8616701,24.3704897 C44.5175916,25.1029198 44.6733735,26.0657797 44.3864073,26.9381118 C44.1486363,27.6705419 44.5093932,28.4770397 45.2391054,28.7156963 C45.9688176,28.9461239 46.780521,28.5922524 47.0100936,27.8598223 C47.584026,26.0740087 47.2396661,24.0248493 45.8950269,22.5270687 C44.886547,21.4078489 43.4845162,20.7494842 42.0906819,20.6836478 Z M29.496988,29.9665891 C35.3100922,30.1723275 39.9917329,33.0691319 40.3852858,37.0769272 C40.8362324,41.6607904 35.5970585,45.9319315 28.6442899,46.6232144 C21.6915214,47.3144973 15.6488446,44.154347 15.197898,39.5787128 C14.7469514,34.9948495 20.059916,30.7237084 27.004486,30.0324256 C27.8735831,29.950131 28.6688875,29.9336709 29.496988,29.9665891 Z M25.5614586,34.3776322 C23.183744,34.5916017 20.9372116,35.9577073 19.9205332,37.9328012 C18.5348994,40.6238672 19.9041362,43.6029661 23.0689567,44.582284 C26.340366,45.5945202 30.1857056,44.0638213 31.5303448,41.1587879 C32.8503864,38.3195909 31.1613894,35.3734082 27.9227762,34.5751416 C27.1438688,34.3776322 26.356763,34.3035667 25.5614586,34.3776322 Z M24.052839,38.7228388 C24.3316067,38.7310678 24.5857748,38.8215935 24.8399449,38.9203482 C25.8648218,39.3400561 26.1845841,40.4428158 25.5614586,41.4221338 C24.9219361,42.3932227 23.5690963,42.8623069 22.5442194,42.4096807 C21.5357395,41.9652856 21.2487754,40.8542948 21.8882979,39.9078951 C22.3638421,39.2001542 23.2247386,38.7146097 24.052839,38.7228388 Z"}),y=p({color:"#25D366",name:"whatsapp",path:"m42.32286,33.93287c-0.5178,-0.2589 -3.04726,-1.49644 -3.52105,-1.66732c-0.4712,-0.17346 -0.81554,-0.2589 -1.15987,0.2589c-0.34175,0.51004 -1.33075,1.66474 -1.63108,2.00648c-0.30032,0.33658 -0.60064,0.36247 -1.11327,0.12945c-0.5178,-0.2589 -2.17994,-0.80259 -4.14759,-2.56312c-1.53269,-1.37217 -2.56312,-3.05503 -2.86603,-3.57283c-0.30033,-0.5178 -0.03366,-0.80259 0.22524,-1.06149c0.23301,-0.23301 0.5178,-0.59547 0.7767,-0.90616c0.25372,-0.31068 0.33657,-0.5178 0.51262,-0.85437c0.17088,-0.36246 0.08544,-0.64725 -0.04402,-0.90615c-0.12945,-0.2589 -1.15987,-2.79613 -1.58964,-3.80584c-0.41424,-1.00971 -0.84142,-0.88027 -1.15987,-0.88027c-0.29773,-0.02588 -0.64208,-0.02588 -0.98382,-0.02588c-0.34693,0 -0.90616,0.12945 -1.37736,0.62136c-0.4712,0.5178 -1.80194,1.76053 -1.80194,4.27186c0,2.51134 1.84596,4.945 2.10227,5.30747c0.2589,0.33657 3.63497,5.51458 8.80262,7.74113c1.23237,0.5178 2.1903,0.82848 2.94111,1.08738c1.23237,0.38836 2.35599,0.33657 3.24402,0.20712c0.99159,-0.15534 3.04985,-1.24272 3.47963,-2.45956c0.44013,-1.21683 0.44013,-2.22654 0.31068,-2.45955c-0.12945,-0.23301 -0.46601,-0.36247 -0.98382,-0.59548m-9.40068,12.84407l-0.02589,0c-3.05503,0 -6.08417,-0.82849 -8.72495,-2.38189l-0.62136,-0.37023l-6.47252,1.68286l1.73463,-6.29129l-0.41424,-0.64725c-1.70875,-2.71846 -2.6149,-5.85116 -2.6149,-9.07706c0,-9.39809 7.68934,-17.06155 17.15993,-17.06155c4.58253,0 8.88029,1.78642 12.11655,5.02268c3.23625,3.21036 5.02267,7.50812 5.02267,12.06476c-0.0078,9.3981 -7.69712,17.06155 -17.14699,17.06155m14.58906,-31.58846c-3.93529,-3.80584 -9.1133,-5.95471 -14.62789,-5.95471c-11.36055,0 -20.60848,9.2065 -20.61625,20.52564c0,3.61684 0.94757,7.14565 2.75211,10.26282l-2.92557,10.63564l10.93337,-2.85309c3.0136,1.63108 6.4052,2.4958 9.85634,2.49839l0.01037,0c11.36574,0 20.61884,-9.2091 20.62403,-20.53082c0,-5.48093 -2.14111,-10.64081 -6.03239,-14.51915"}),k=p({color:"#007fb1",name:"linkedin",path:"M20.4,44h5.4V26.6h-5.4V44z M23.1,18c-1.7,0-3.1,1.4-3.1,3.1c0,1.7,1.4,3.1,3.1,3.1 c1.7,0,3.1-1.4,3.1-3.1C26.2,19.4,24.8,18,23.1,18z M39.5,26.2c-2.6,0-4.4,1.4-5.1,2.8h-0.1v-2.4h-5.2V44h5.4v-8.6 c0-2.3,0.4-4.5,3.2-4.5c2.8,0,2.8,2.6,2.8,4.6V44H46v-9.5C46,29.8,45,26.2,39.5,26.2z"}),x=p({color:"#45668e",name:"vk",path:"M44.94,44.84h-0.2c-2.17-.36-3.66-1.92-4.92-3.37C39.1,40.66,38,38.81,36.7,39c-1.85.3-.93,3.52-1.71,4.9-0.62,1.11-3.29.91-5.12,0.71-5.79-.62-8.75-3.77-11.35-7.14A64.13,64.13,0,0,1,11.6,26a10.59,10.59,0,0,1-1.51-4.49C11,20.7,12.56,21,14.11,21c1.31,0,3.36-.29,4.32.2C19,21.46,19.57,23,20,24a37.18,37.18,0,0,0,3.31,5.82c0.56,0.81,1.41,2.35,2.41,2.14s1.06-2.63,1.1-4.18c0-1.77,0-4-.5-4.9S25,22,24.15,21.47c0.73-1.49,2.72-1.63,5.12-1.63,2,0,4.84-.23,5.62,1.12s0.25,3.85.2,5.71c-0.06,2.09-.41,4.25,1,5.21,1.09-.12,1.68-1.2,2.31-2A28,28,0,0,0,41.72,24c0.44-1,.91-2.65,1.71-3,1.21-.47,3.15-0.1,4.92-0.1,1.46,0,4.05-.41,4.52.61,0.39,0.85-.75,3-1.1,3.57a61.88,61.88,0,0,1-4.12,5.61c-0.58.78-1.78,2-1.71,3.27,0.05,0.94,1,1.67,1.71,2.35a33.12,33.12,0,0,1,3.92,4.18c0.47,0.62,1.5,2,1.4,2.76C52.66,45.81,46.88,44.24,44.94,44.84Z"}),L=p({color:"#168DE2",name:"mailru",path:"M39.7107745,17 C41.6619755,17 43.3204965,18.732852 43.3204965,21.0072202 C43.3204965,23.2815885 41.7595357,25.0144404 39.7107745,25.0144404 C37.7595732,25.0144404 36.1010522,23.2815885 36.1010522,21.0072202 C36.1010522,18.732852 37.7595732,17 39.7107745,17 Z M24.3938451,17 C26.3450463,17 28.0035672,18.732852 28.0035672,21.0072202 C28.0035672,23.2815885 26.4426063,25.0144404 24.3938451,25.0144404 C22.4426439,25.0144404 20.7841229,23.2815885 20.7841229,21.0072202 C20.7841229,18.732852 22.4426439,17 24.3938451,17 Z M51.9057817,43.4259928 C51.7106617,44.0758123 51.4179815,44.6173285 50.9301812,44.9422383 C50.637501,45.1588448 50.2472607,45.267148 49.8570205,45.267148 C49.07654,45.267148 48.3936197,44.833935 48.0033795,44.0758123 L46.2472985,40.7184115 L45.759498,41.2599278 C42.5400162,44.9422383 37.466893,47 32.0035297,47 C26.5401664,47 21.5646034,44.9422383 18.2475614,41.2599278 L17.7597611,40.7184115 L16.00368,44.0758123 C15.6134398,44.833935 14.9305194,45.267148 14.1500389,45.267148 C13.7597986,45.267148 13.3695584,45.1588448 13.0768782,44.9422383 C12.0037176,44.2924187 11.7110374,42.7761733 12.2963978,41.5848375 L16.7841605,33.0288807 C17.1744007,32.270758 17.8573211,31.8375453 18.6378016,31.8375453 C19.0280418,31.8375453 19.4182821,31.9458485 19.7109623,32.1624548 C20.7841229,32.8122743 21.0768031,34.3285197 20.4914427,35.5198555 L20.1012025,36.2779783 L20.2963226,36.602888 C22.4426439,39.9602888 27.0279667,42.234657 31.9059697,42.234657 C36.7839727,42.234657 41.3692955,40.068592 43.5156167,36.602888 L43.7107367,36.2779783 L43.3204965,35.6281587 C43.0278165,35.0866425 42.9302562,34.436823 43.1253765,33.7870035 C43.3204965,33.137184 43.6131767,32.5956678 44.100977,32.270758 C44.3936572,32.0541515 44.7838975,31.9458485 45.1741377,31.9458485 C45.9546182,31.9458485 46.6375385,32.3790613 47.0277787,33.137184 L51.5155415,41.6931408 C52.003342,42.234657 52.100902,42.8844765 51.9057817,43.4259928 Z"}),M=p({color:"#21A5D8",name:"livejournal",path:"M18.3407821,28.1764706 L21.9441341,31.789916 L33.0055865,42.882353 C33.0055865,42.882353 33.0893855,42.9663866 33.0893855,42.9663866 L46.6648046,47 C46.6648046,47 46.6648046,47 46.7486034,47 C46.8324022,47 46.8324022,47 46.9162012,46.9159664 C47,46.8319327 47,46.8319327 47,46.7478991 L42.9776536,33.1344537 C42.9776536,33.1344537 42.9776536,33.1344537 42.8938548,33.0504202 L31.1620111,21.3697479 L31.1620111,21.3697479 L28.1452514,18.2605042 C27.3072626,17.4201681 26.5530726,17 25.7150838,17 C24.2905028,17 23.0335195,18.3445378 21.5251397,19.8571429 C21.273743,20.1092437 20.9385475,20.4453781 20.6871508,20.697479 C20.3519553,21.0336134 20.1005586,21.2857143 19.849162,21.5378151 C18.3407821,22.9663866 17.0837989,24.2268908 17,25.7394958 C17.0837989,26.4957983 17.5027933,27.3361345 18.3407821,28.1764706 Z M39.9012319,39.6134454 C39.7336341,39.4453781 39.4822374,37.6806724 40.2364275,36.8403362 C40.9906174,36.0840337 41.6610084,36 42.1638017,36 C42.3313995,36 42.4989973,36 42.5827961,36 L44.8453659,43.5630253 L43.5883828,44.8235295 L36.0464833,42.5546218 C35.9626843,42.2184874 35.8788855,41.2100841 36.8844722,40.2016807 C37.2196676,39.8655463 37.8900587,39.6134454 38.5604498,39.6134454 C39.147042,39.6134454 39.5660364,39.7815126 39.5660364,39.7815126 C39.6498353,39.8655463 39.8174331,39.8655463 39.8174331,39.7815126 C39.9850307,39.7815126 39.9850307,39.697479 39.9012319,39.6134454 Z"}),S=p({color:"#3b3d4a",name:"workplace",path:"M34.019,10.292c0.21,0.017,0.423,0.034,0.636,0.049 c3.657,0.262,6.976,1.464,9.929,3.635c3.331,2.448,5.635,5.65,6.914,9.584c0.699,2.152,0.983,4.365,0.885,6.623 c-0.136,3.171-1.008,6.13-2.619,8.867c-0.442,0.75-0.908,1.492-1.495,2.141c-0.588,0.651-1.29,1.141-2.146,1.383 c-1.496,0.426-3.247-0.283-3.961-1.642c-0.26-0.494-0.442-1.028-0.654-1.548c-1.156-2.838-2.311-5.679-3.465-8.519 c-0.017-0.042-0.037-0.082-0.065-0.145c-0.101,0.245-0.192,0.472-0.284,0.698c-1.237,3.051-2.475,6.103-3.711,9.155 c-0.466,1.153-1.351,1.815-2.538,2.045c-1.391,0.267-2.577-0.154-3.496-1.247c-0.174-0.209-0.31-0.464-0.415-0.717 c-2.128-5.22-4.248-10.442-6.37-15.665c-0.012-0.029-0.021-0.059-0.036-0.104c0.054-0.003,0.103-0.006,0.15-0.006 c1.498-0.001,2.997,0,4.495-0.004c0.12-0.001,0.176,0.03,0.222,0.146c1.557,3.846,3.117,7.691,4.679,11.536 c0.018,0.046,0.039,0.091,0.067,0.159c0.273-0.673,0.536-1.32,0.797-1.968c1.064-2.627,2.137-5.25,3.19-7.883 c0.482-1.208,1.376-1.917,2.621-2.135c1.454-0.255,2.644,0.257,3.522,1.449c0.133,0.18,0.229,0.393,0.313,0.603 c1.425,3.495,2.848,6.991,4.269,10.488c0.02,0.047,0.04,0.093,0.073,0.172c0.196-0.327,0.385-0.625,0.559-0.935 c0.783-1.397,1.323-2.886,1.614-4.461c0.242-1.312,0.304-2.634,0.187-3.962c-0.242-2.721-1.16-5.192-2.792-7.38 c-2.193-2.939-5.086-4.824-8.673-5.625c-1.553-0.346-3.124-0.405-4.705-0.257c-3.162,0.298-6.036,1.366-8.585,3.258 c-3.414,2.534-5.638,5.871-6.623,10.016c-0.417,1.76-0.546,3.547-0.384,5.348c0.417,4.601,2.359,8.444,5.804,11.517 c2.325,2.073,5.037,3.393,8.094,3.989c1.617,0.317,3.247,0.395,4.889,0.242c1-0.094,1.982-0.268,2.952-0.529 c0.04-0.01,0.081-0.018,0.128-0.028c0,1.526,0,3.047,0,4.586c-0.402,0.074-0.805,0.154-1.21,0.221 c-0.861,0.14-1.728,0.231-2.601,0.258c-0.035,0.002-0.071,0.013-0.108,0.021c-0.493,0-0.983,0-1.476,0 c-0.049-0.007-0.1-0.018-0.149-0.022c-0.315-0.019-0.629-0.033-0.945-0.058c-1.362-0.105-2.702-0.346-4.017-0.716 c-3.254-0.914-6.145-2.495-8.66-4.752c-2.195-1.971-3.926-4.29-5.176-6.963c-1.152-2.466-1.822-5.057-1.993-7.774 c-0.014-0.226-0.033-0.451-0.05-0.676c0-0.502,0-1.003,0-1.504c0.008-0.049,0.02-0.099,0.022-0.148 c0.036-1.025,0.152-2.043,0.338-3.052c0.481-2.616,1.409-5.066,2.8-7.331c2.226-3.625,5.25-6.386,9.074-8.254 c2.536-1.24,5.217-1.947,8.037-2.126c0.23-0.015,0.461-0.034,0.691-0.051C33.052,10.292,33.535,10.292,34.019,10.292z"}),z=p({color:"#EF3F56",name:"pocket",path:"M41.084 29.065l-7.528 7.882a2.104 2.104 0 0 1-1.521.666 2.106 2.106 0 0 1-1.522-.666l-7.528-7.882c-.876-.914-.902-2.43-.065-3.384.84-.955 2.228-.987 3.1-.072l6.015 6.286 6.022-6.286c.88-.918 2.263-.883 3.102.071.841.938.82 2.465-.06 3.383l-.015.002zm6.777-10.976C47.463 16.84 46.361 16 45.14 16H18.905c-1.2 0-2.289.82-2.716 2.044-.125.363-.189.743-.189 1.125v10.539l.112 2.096c.464 4.766 2.73 8.933 6.243 11.838.06.053.125.102.19.153l.04.033c1.882 1.499 3.986 2.514 6.259 3.014a14.662 14.662 0 0 0 6.13.052c.118-.042.235-.065.353-.087.03 0 .065-.022.098-.042a15.395 15.395 0 0 0 6.011-2.945l.039-.045.18-.153c3.502-2.902 5.765-7.072 6.248-11.852L48 29.674v-10.52c0-.366-.041-.728-.161-1.08l.022.015z"}),I=p({color:"#1F1F1F",name:"instapaper",path:"M35.688 43.012c0 2.425.361 2.785 3.912 3.056V48H24.401v-1.932c3.555-.27 3.912-.63 3.912-3.056V20.944c0-2.379-.36-2.785-3.912-3.056V16H39.6v1.888c-3.55.27-3.912.675-3.912 3.056v22.068h.001z"}),H=p({color:"#009ad9",name:"hatena",path:"M 36.164062 33.554688 C 34.988281 32.234375 33.347656 31.5 31.253906 31.34375 C 33.125 30.835938 34.476562 30.09375 35.335938 29.09375 C 36.191406 28.09375 36.609375 26.78125 36.609375 25.101562 C 36.628906 23.875 36.332031 22.660156 35.75 21.578125 C 35.160156 20.558594 34.292969 19.71875 33.253906 19.160156 C 32.304688 18.640625 31.175781 18.265625 29.847656 18.042969 C 28.523438 17.824219 26.195312 17.730469 22.867188 17.730469 L 14.769531 17.730469 L 14.769531 47.269531 L 23.113281 47.269531 C 26.46875 47.269531 28.886719 47.15625 30.367188 46.929688 C 31.851562 46.695312 33.085938 46.304688 34.085938 45.773438 C 35.289062 45.148438 36.28125 44.179688 36.933594 42.992188 C 37.597656 41.796875 37.933594 40.402344 37.933594 38.816406 C 37.933594 36.621094 37.347656 34.867188 36.164062 33.554688 Z M 22.257812 24.269531 L 23.984375 24.269531 C 25.988281 24.269531 27.332031 24.496094 28.015625 24.945312 C 28.703125 25.402344 29.042969 26.183594 29.042969 27.285156 C 29.042969 28.390625 28.664062 29.105469 27.9375 29.550781 C 27.210938 29.992188 25.84375 30.199219 23.855469 30.199219 L 22.257812 30.199219 Z M 29.121094 41.210938 C 28.328125 41.691406 26.976562 41.925781 25.078125 41.925781 L 22.257812 41.925781 L 22.257812 35.488281 L 25.195312 35.488281 C 27.144531 35.488281 28.496094 35.738281 29.210938 36.230469 C 29.925781 36.726562 30.304688 37.582031 30.304688 38.832031 C 30.304688 40.078125 29.914062 40.742188 29.105469 41.222656 Z M 29.121094 41.210938 M 46.488281 39.792969 C 44.421875 39.792969 42.742188 41.46875 42.742188 43.535156 C 42.742188 45.605469 44.421875 47.28125 46.488281 47.28125 C 48.554688 47.28125 50.230469 45.605469 50.230469 43.535156 C 50.230469 41.46875 48.554688 39.792969 46.488281 39.792969 Z M 46.488281 39.792969 M 43.238281 17.730469 L 49.738281 17.730469 L 49.738281 37.429688 L 43.238281 37.429688 Z M 43.238281 17.730469 "}),j=p({color:"#2196F3",name:"facebookmessenger",path:"M 53.066406 21.871094 C 52.667969 21.339844 51.941406 21.179688 51.359375 21.496094 L 37.492188 29.058594 L 28.867188 21.660156 C 28.339844 21.207031 27.550781 21.238281 27.054688 21.730469 L 11.058594 37.726562 C 10.539062 38.25 10.542969 39.09375 11.0625 39.613281 C 11.480469 40.027344 12.121094 40.121094 12.640625 39.839844 L 26.503906 32.28125 L 35.136719 39.679688 C 35.667969 40.132812 36.457031 40.101562 36.949219 39.609375 L 52.949219 23.613281 C 53.414062 23.140625 53.464844 22.398438 53.066406 21.871094 Z M 53.066406 21.871094"}),O=p({color:"#7f7f7f",name:"email",path:"M17,22v20h30V22H17z M41.1,25L32,32.1L22.9,25H41.1z M20,39V26.6l12,9.3l12-9.3V39H20z"}),V=p({color:"#00d178",name:"gab",path:"m17.0506,23.97457l5.18518,0l0,14.23933c0,6.82699 -3.72695,10.09328 -9.33471,10.09328c-2.55969,0 -4.82842,-0.87286 -6.22084,-2.0713l2.07477,-3.88283c1.19844,0.81051 2.33108,1.29543 3.85511,1.29543c2.75366,0 4.44049,-1.97432 4.44049,-4.82149l0,-0.87286c-1.16728,1.39242 -2.81947,2.0713 -4.63446,2.0713c-4.44048,0 -7.81068,-3.68885 -7.81068,-8.28521c0,-4.59289 3.37019,-8.28174 7.81068,-8.28174c1.81499,0 3.46718,0.67888 4.63446,2.0713l0,-1.55521zm-3.62997,11.39217c1.97777,0 3.62997,-1.6522 3.62997,-3.62652c0,-1.97432 -1.6522,-3.62305 -3.62997,-3.62305c-1.97778,0 -3.62997,1.64873 -3.62997,3.62305c0,1.97432 1.65219,3.62652 3.62997,3.62652zm25.7077,4.13913l-5.18518,0l0,-1.29197c-1.00448,1.13264 -2.3969,1.81152 -4.21188,1.81152c-3.62997,0 -5.63893,-2.52504 -5.63893,-5.4034c0,-4.27076 5.251,-5.85715 9.78846,-4.49937c-0.09698,-1.39241 -0.9733,-2.39343 -2.78829,-2.39343c-1.26426,0 -2.72248,0.48492 -3.62997,1.00102l-1.5552,-3.72003c1.19844,-0.77587 3.40136,-1.55174 5.96452,-1.55174c3.78931,0 7.25648,2.13365 7.25648,7.95962l0,8.08777zm-5.18518,-6.14809c-2.42806,-0.77587 -4.66563,-0.3533 -4.66563,1.36124c0,1.00101 0.84168,1.6799 1.84616,1.6799c1.20191,0 2.56315,-0.96984 2.81947,-3.04115zm13.00626,-17.66495l0,9.83695c1.16727,-1.39242 2.81946,-2.0713 4.63445,-2.0713c4.44048,0 7.81068,3.68885 7.81068,8.28174c0,4.59636 -3.37019,8.28521 -7.81068,8.28521c-1.81499,0 -3.46718,-0.67888 -4.63445,-2.0713l0,1.55174l-5.18519,0l0,-23.81304l5.18519,0zm3.62997,19.67391c1.97777,0 3.62997,-1.6522 3.62997,-3.62652c0,-1.97432 -1.6522,-3.62305 -3.62997,-3.62305c-1.97778,0 -3.62997,1.64873 -3.62997,3.62305c0,1.97432 1.65219,3.62652 3.62997,3.62652zm0,0"}),W=p({color:"#e94475",name:"instagram",path:"M 39.88,25.89 C 40.86,25.89 41.65,25.10 41.65,24.12 41.65,23.14 40.86,22.35 39.88,22.35 38.90,22.35 38.11,23.14 38.11,24.12 38.11,25.10 38.90,25.89 39.88,25.89 Z M 32.00,24.42 C 27.82,24.42 24.42,27.81 24.42,32.00 24.42,36.19 27.82,39.58 32.00,39.58 36.18,39.58 39.58,36.18 39.58,32.00 39.58,27.82 36.18,24.42 32.00,24.42 Z M 32.00,36.92 C 29.28,36.92 27.08,34.72 27.08,32.00 27.08,29.28 29.28,27.08 32.00,27.08 34.72,27.08 36.92,29.28 36.92,32.00 36.92,34.72 34.72,36.92 32.00,36.92 Z M 32.00,19.90 C 35.94,19.90 36.41,19.92 37.96,19.99 39.41,20.05 40.19,20.29 40.71,20.50 41.40,20.77 41.89,21.08 42.41,21.60 42.92,22.12 43.24,22.61 43.51,23.30 43.71,23.82 43.95,24.60 44.02,26.04 44.09,27.60 44.11,28.06 44.11,32.01 44.11,35.95 44.09,36.41 44.02,37.97 43.95,39.41 43.71,40.19 43.51,40.71 43.24,41.40 42.92,41.90 42.41,42.41 41.89,42.93 41.40,43.25 40.71,43.51 40.19,43.71 39.41,43.96 37.96,44.02 36.41,44.09 35.94,44.11 32.00,44.11 28.06,44.11 27.59,44.09 26.04,44.02 24.59,43.96 23.81,43.72 23.29,43.51 22.60,43.24 22.11,42.93 21.59,42.41 21.08,41.90 20.76,41.40 20.49,40.71 20.29,40.19 20.05,39.41 19.98,37.97 19.91,36.41 19.89,35.95 19.89,32.01 19.89,28.06 19.91,27.60 19.98,26.04 20.05,24.60 20.29,23.82 20.49,23.30 20.76,22.61 21.08,22.12 21.59,21.60 22.11,21.08 22.60,20.76 23.29,20.50 23.81,20.30 24.59,20.05 26.04,19.99 27.59,19.91 28.06,19.90 32.00,19.90 Z M 32.00,17.24 C 27.99,17.24 27.49,17.26 25.91,17.33 24.34,17.40 23.27,17.65 22.33,18.01 21.36,18.39 20.54,18.90 19.72,19.72 18.90,20.54 18.39,21.37 18.01,22.33 17.65,23.27 17.40,24.34 17.33,25.92 17.26,27.49 17.24,27.99 17.24,32.00 17.24,36.01 17.26,36.51 17.33,38.09 17.40,39.66 17.65,40.73 18.01,41.67 18.39,42.65 18.90,43.47 19.72,44.29 20.54,45.11 21.37,45.61 22.33,45.99 23.27,46.36 24.34,46.61 25.92,46.68 27.49,46.75 27.99,46.77 32.01,46.77 36.02,46.77 36.52,46.75 38.09,46.68 39.66,46.61 40.74,46.36 41.68,45.99 42.65,45.62 43.47,45.11 44.29,44.29 45.11,43.47 45.62,42.64 46.00,41.67 46.36,40.74 46.61,39.66 46.68,38.09 46.75,36.51 46.77,36.01 46.77,32.00 46.77,27.99 46.75,27.49 46.68,25.91 46.61,24.34 46.36,23.27 46.00,22.33 45.62,21.35 45.11,20.53 44.29,19.71 43.47,18.89 42.65,18.39 41.68,18.01 40.74,17.64 39.67,17.39 38.09,17.32 36.51,17.26 36.01,17.24 32.00,17.24 Z"}),B=p({color:"#2EBD59",name:"spotify",path:"M32,16c-8.8,0-16,7.2-16,16c0,8.8,7.2,16,16,16c8.8,0,16-7.2,16-16C48,23.2,40.8,16,32,16 M39.3,39.1c-0.3,0.5-0.9,0.6-1.4,0.3c-3.8-2.3-8.5-2.8-14.1-1.5c-0.5,0.1-1.1-0.2-1.2-0.7c-0.1-0.5,0.2-1.1,0.8-1.2 c6.1-1.4,11.3-0.8,15.5,1.8C39.5,38,39.6,38.6,39.3,39.1 M41.3,34.7c-0.4,0.6-1.1,0.8-1.7,0.4c-4.3-2.6-10.9-3.4-15.9-1.9 c-0.7,0.2-1.4-0.2-1.6-0.8c-0.2-0.7,0.2-1.4,0.8-1.6c5.8-1.8,13-0.9,18,2.1C41.5,33.4,41.7,34.1,41.3,34.7 M41.5,30.2 c-5.2-3.1-13.7-3.3-18.6-1.9c-0.8,0.2-1.6-0.2-1.9-1c-0.2-0.8,0.2-1.6,1-1.9c5.7-1.7,15-1.4,21,2.1c0.7,0.4,0.9,1.3,0.5,2.1 C43.1,30.4,42.2,30.6,41.5,30.2"});function P(t){var e=Object.entries(t).filter((function(t){var e=t[1];return null!=e})).map((function(t){var e=t[0],n=t[1];return"".concat(encodeURIComponent(e),"=").concat(encodeURIComponent(String(n)))}));return e.length>0?"?".concat(e.join("&")):""}var Z=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.openShareDialog=function(t){var n,o,r=e.props,c=r.onShareWindowClose,i=r.windowHeight,u=void 0===i?400:i,s=r.windowPosition,p=void 0===s?"windowCenter":s,h=r.windowWidth,d=void 0===h?550:h,w=r.blankTarget,f=void 0!==w&&w;!function(t,e,n,o){var r,c=e.height,i=e.width,u=l(e,["height","width"]),s=a({height:c,width:i,location:"no",toolbar:"no",status:"no",directories:"no",menubar:"no",scrollbars:"yes",resizable:"no",centerscreen:"yes",chrome:"yes"},u);if(r=n?window.open(t,"_blank"):window.open(t,"",Object.keys(s).map((function(t){return"".concat(t,"=").concat(s[t])})).join(", ")),o)var p=window.setInterval((function(){try{(null===r||r.closed)&&(window.clearInterval(p),o(r))}catch(t){console.error(t)}}),1e3)}(t,a({height:u,width:d},"windowCenter"===p?(n=d,o=u,{left:window.outerWidth/2+(window.screenX||window.screenLeft||0)-n/2,top:window.outerHeight/2+(window.screenY||window.screenTop||0)-o/2}):function(t,e){return{top:(window.screen.height-e)/2,left:(window.screen.width-t)/2}}(d,u)),f,c)},e.handleClick=function(t){return u(e,void 0,void 0,(function(){var e,n,o,r,c,i,a,l,u,p;return s(this,(function(s){switch(s.label){case 0:return e=this.props,n=e.beforeOnClick,o=e.disabled,r=e.networkLink,c=e.onClick,i=e.url,a=e.openShareDialogOnClick,l=e.opts,u=r(i,l),o?[2]:(t.preventDefault(),n?(p=n(),!(h=p)||"object"!=typeof h&&"function"!=typeof h||"function"!=typeof h.then?[3,2]:[4,p]):[3,2]);case 1:s.sent(),s.label=2;case 2:return a&&this.openShareDialog(u),c&&c(t,u),[2]}var h}))}))},e}return i(e,t),e.prototype.render=function(){var t=this.props,e=t.children,n=t.forwardedRef,r=t.networkName,c=t.style,i=l(t,["children","forwardedRef","networkName","style"]),u=a({backgroundColor:"transparent",border:"none",padding:0,font:"inherit",color:"inherit",cursor:"pointer",outline:"none"},c);return o.default.createElement("button",{"aria-label":i["aria-label"]||r,onClick:this.handleClick,ref:n,style:u},e)},e.defaultProps={disabledStyle:{opacity:.6},openShareDialogOnClick:!0,resetButtonStyle:!0},e}(t.Component);function _(e,n,r,c){function i(t,i){var l=r(t),u=a({},t);return Object.keys(l).forEach((function(t){delete u[t]})),o.default.createElement(Z,a({},c,u,{forwardedRef:i,networkName:e,networkLink:n,opts:r(t)}))}return i.displayName="ShareButton-".concat(e),t.forwardRef(i)}var E=_("facebook",(function(t,e){return"https://www.facebook.com/sharer/sharer.php"+P({u:t,quote:e.quote,hashtag:e.hashtag})}),(function(t){return{quote:t.quote,hashtag:t.hashtag}}),{windowWidth:550,windowHeight:400});var K=_("line",(function(t,e){return"https://social-plugins.line.me/lineit/share"+P({url:t,text:e.title})}),(function(t){return{title:t.title}}),{windowWidth:500,windowHeight:500});var D=_("pinterest",(function(t,e){return"https://pinterest.com/pin/create/button/"+P({url:t,media:e.media,description:e.description})}),(function(t){return{media:t.media,description:t.description}}),{windowWidth:1e3,windowHeight:730});var F=_("reddit",(function(t,e){return"https://www.reddit.com/submit"+P({url:t,title:e.title})}),(function(t){return{title:t.title}}),{windowWidth:660,windowHeight:460,windowPosition:"windowCenter"});var T=_("telegram",(function(t,e){return"https://telegram.me/share/"+P({url:t,text:e.title})}),(function(t){return{title:t.title}}),{windowWidth:550,windowHeight:400});var U=_("tumblr",(function(t,e){return"https://www.tumblr.com/widgets/share/tool"+P({canonicalUrl:t,title:e.title,caption:e.caption,tags:e.tags,posttype:e.posttype})}),(function(t){return{title:t.title,tags:(t.tags||[]).join(","),caption:t.caption,posttype:t.posttype||"link"}}),{windowWidth:660,windowHeight:460});var q=_("twitter",(function(t,e){var n=e.title,o=e.via,r=e.hashtags,c=void 0===r?[]:r,i=e.related,a=void 0===i?[]:i;return"https://twitter.com/intent/tweet"+P({url:t,text:n,via:o,hashtags:c.length>0?c.join(","):void 0,related:a.length>0?a.join(","):void 0})}),(function(t){return{hashtags:t.hashtags,title:t.title,via:t.via,related:t.related}}),{windowWidth:550,windowHeight:400});var R=_("viber",(function(t,e){var n=e.title,o=e.separator;return"viber://forward"+P({text:n?n+o+t:t})}),(function(t){return{title:t.title,separator:t.separator||" "}}),{windowWidth:660,windowHeight:460});var N=_("weibo",(function(t,e){return"http://service.weibo.com/share/share.php"+P({url:t,title:e.title,pic:e.image})}),(function(t){return{title:t.title,image:t.image}}),{windowWidth:660,windowHeight:550,windowPosition:"screenCenter"});var A=_("whatsapp",(function(t,e){var n=e.title,o=e.separator;return"https://"+(/(android|iphone|ipad|mobile)/i.test(navigator.userAgent)?"api":"web")+".whatsapp.com/send"+P({text:n?n+o+t:t})}),(function(t){return{title:t.title,separator:t.separator||" "}}),{windowWidth:550,windowHeight:400});var G=_("linkedin",(function(t,e){return"https://linkedin.com/sharing/share-offsite"+P({url:t,mini:"true",title:e.title,summary:e.summary,source:e.source})}),(function(t){return{title:t.title,summary:t.summary,source:t.source}}),{windowWidth:750,windowHeight:600});var X=_("vk",(function(t,e){return"https://vk.com/share.php"+P({url:t,title:e.title,image:e.image,noparse:e.noParse?1:0,no_vk_links:e.noVkLinks?1:0})}),(function(t){return{title:t.title,image:t.image,noParse:t.noParse,noVkLinks:t.noVkLinks}}),{windowWidth:660,windowHeight:460});var Y=_("mailru",(function(t,e){return"https://connect.mail.ru/share"+P({url:t,title:e.title,description:e.description,image_url:e.imageUrl})}),(function(t){return{title:t.title,description:t.description,imageUrl:t.imageUrl}}),{windowWidth:660,windowHeight:460});var J=_("livejournal",(function(t,e){return"https://www.livejournal.com/update.bml"+P({subject:e.title,event:e.description})}),(function(t){return{title:t.title,description:t.description}}),{windowWidth:660,windowHeight:460});var Q=_("workplace",(function(t,e){return"https://work.facebook.com/sharer.php"+P({u:t,quote:e.quote,hashtag:e.hashtag})}),(function(t){return{quote:t.quote,hashtag:t.hashtag}}),{windowWidth:550,windowHeight:400});var $=_("pocket",(function(t,e){return"https://getpocket.com/save"+P({url:t,title:e.title})}),(function(t){return{title:t.title}}),{windowWidth:500,windowHeight:500});var tt=_("instapaper",(function(t,e){return"http://www.instapaper.com/hello2"+P({url:t,title:e.title,description:e.description})}),(function(t){return{title:t.title,description:t.description}}),{windowWidth:500,windowHeight:500,windowPosition:"windowCenter"});var et=_("hatena",(function(t,e){var n=e.title;return"http://b.hatena.ne.jp/add?mode=confirm&url=".concat(t,"&title=").concat(n)}),(function(t){return{title:t.title}}),{windowWidth:660,windowHeight:460,windowPosition:"windowCenter"});var nt=_("facebookmessenger",(function(t,e){var n=e.appId;return"https://www.facebook.com/dialog/send"+P({link:t,redirect_uri:e.redirectUri||t,app_id:n,to:e.to})}),(function(t){return{appId:t.appId,redirectUri:t.redirectUri,to:t.to}}),{windowWidth:1e3,windowHeight:820});var ot=_("email",(function(t,e){var n=e.subject,o=e.body,r=e.separator;return"mailto:"+P({subject:n,body:o?o+r+t:t})}),(function(t){return{subject:t.subject,body:t.body,separator:t.separator||" "}}),{openShareDialogOnClick:!1,onClick:function(t,e){window.location.href=e}});var rt=_("gab",(function(t,e){return"https://gab.com/compose"+P({url:t,text:e.title})}),(function(t){return{title:t.title}}),{windowWidth:660,windowHeight:640,windowPosition:"windowCenter"}),ct=function(t){return t},it=function(t){function e(e){var n=t.call(this,e)||this;return n._isMounted=!1,n.state={count:0,isLoading:!1},n}return i(e,t),e.prototype.componentDidMount=function(){this._isMounted=!0,this.updateCount(this.props.url,this.props.appId,this.props.appSecret)},e.prototype.componentDidUpdate=function(t){this.props.url!==t.url&&this.updateCount(this.props.url,this.props.appId,this.props.appSecret)},e.prototype.componentWillUnmount=function(){this._isMounted=!1},e.prototype.updateCount=function(t,e,n){var o=this;this.setState({isLoading:!0}),this.props.getCount(t,(function(t){o._isMounted&&o.setState({count:t,isLoading:!1})}),e,n)},e.prototype.render=function(){var t=this.state,e=t.count,n=t.isLoading,r=this.props,c=r.children,i=void 0===c?ct:c,a=r.className;return r.getCount,o.default.createElement("span",{className:a},!n&&void 0!==e&&i(e))},e}(t.Component);function at(t){var e=function(e){return o.default.createElement(it,a({getCount:t},e))};return e.displayName="ShareCount(".concat(t.name,")"),e}var lt=at((function(t,e){window.OK||(window.OK={Share:{count:function(t,e){window.OK.callbacks[t](e)}},callbacks:[]});var n=window.OK.callbacks.length;return window.ODKL={updateCount:function(t,e){var n=""===t?0:parseInt(t.replace("react-share-",""),10);window.OK.callbacks[n](""===e?void 0:parseInt(e,10))}},window.OK.callbacks.push(e),r.default("https://connect.ok.ru/dk"+P({"st.cmd":"extLike",uid:"react-share-".concat(n),ref:t}))}));var ut=at((function(t,e){r.default("https://api.pinterest.com/v1/urls/count.json"+P({url:t}),(function(t,n){e(!t&&n?n.count:void 0)}))}));var st=at((function(t,e){return r.default("https://api.tumblr.com/v2/share/stats"+P({url:t}),(function(t,n){e(!t&&n&&n.response?n.response.note_count:void 0)}))}));var pt=at((function(t,e){window.VK||(window.VK={}),window.VK.Share={count:function(t,e){return window.VK.callbacks[t](e)}},window.VK.callbacks=[];var n=window.VK.callbacks.length;return window.VK.callbacks.push(e),r.default("https://vk.com/share.php"+P({act:"count",index:n,url:t}))}));var ht=at((function(t,e){r.default("https://bookmark.hatenaapis.com/count/entry"+P({url:t}),(function(t,n){e(t?void 0:n)}))}));var dt=at((function(t,e,n,o){var c="https://graph.facebook.com/?id=".concat(t,"&fields=engagement&access_token=").concat(n,"|").concat(o);r.default(c,(function(t,n){e(!t&&n&&n.engagement?n.engagement.share_count:void 0)}))}));exports.LQ=O,exports.cG=ot,exports.Vq=h,__webpack_unused_export__=j,__webpack_unused_export__=nt,exports.Dk=E,__webpack_unused_export__=dt,__webpack_unused_export__=V,__webpack_unused_export__=rt,__webpack_unused_export__=H,__webpack_unused_export__=et,__webpack_unused_export__=ht,__webpack_unused_export__=W,__webpack_unused_export__=I,__webpack_unused_export__=tt,__webpack_unused_export__=d,__webpack_unused_export__=K,exports.pA=k,exports.r2=G,__webpack_unused_export__=M,__webpack_unused_export__=J,__webpack_unused_export__=L,__webpack_unused_export__=Y,__webpack_unused_export__=lt,__webpack_unused_export__=w,__webpack_unused_export__=D,__webpack_unused_export__=ut,__webpack_unused_export__=z,__webpack_unused_export__=$,__webpack_unused_export__=f,__webpack_unused_export__=F,__webpack_unused_export__=B,__webpack_unused_export__=C,__webpack_unused_export__=T,__webpack_unused_export__=m,__webpack_unused_export__=U,__webpack_unused_export__=st,exports.Zm=v,exports.B=q,__webpack_unused_export__=x,__webpack_unused_export__=X,__webpack_unused_export__=pt,__webpack_unused_export__=b,__webpack_unused_export__=R,__webpack_unused_export__=g,__webpack_unused_export__=N,exports.ud=y,exports.N0=A,__webpack_unused_export__=S,__webpack_unused_export__=Q;


/***/ }),

/***/ 5670:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var parseUrl = (__webpack_require__(57310).parse);

var DEFAULT_PORTS = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443,
};

var stringEndsWith = String.prototype.endsWith || function(s) {
  return s.length <= this.length &&
    this.indexOf(s, this.length - s.length) !== -1;
};

/**
 * @param {string|object} url - The URL, or the result from url.parse.
 * @return {string} The URL of the proxy that should handle the request to the
 *  given URL. If no proxy is set, this will be an empty string.
 */
function getProxyForUrl(url) {
  var parsedUrl = typeof url === 'string' ? parseUrl(url) : url || {};
  var proto = parsedUrl.protocol;
  var hostname = parsedUrl.host;
  var port = parsedUrl.port;
  if (typeof hostname !== 'string' || !hostname || typeof proto !== 'string') {
    return '';  // Don't proxy URLs without a valid scheme or host.
  }

  proto = proto.split(':', 1)[0];
  // Stripping ports in this way instead of using parsedUrl.hostname to make
  // sure that the brackets around IPv6 addresses are kept.
  hostname = hostname.replace(/:\d*$/, '');
  port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
  if (!shouldProxy(hostname, port)) {
    return '';  // Don't proxy URLs that match NO_PROXY.
  }

  var proxy =
    getEnv('npm_config_' + proto + '_proxy') ||
    getEnv(proto + '_proxy') ||
    getEnv('npm_config_proxy') ||
    getEnv('all_proxy');
  if (proxy && proxy.indexOf('://') === -1) {
    // Missing scheme in proxy, default to the requested URL's scheme.
    proxy = proto + '://' + proxy;
  }
  return proxy;
}

/**
 * Determines whether a given URL should be proxied.
 *
 * @param {string} hostname - The host name of the URL.
 * @param {number} port - The effective port of the URL.
 * @returns {boolean} Whether the given URL should be proxied.
 * @private
 */
function shouldProxy(hostname, port) {
  var NO_PROXY =
    (getEnv('npm_config_no_proxy') || getEnv('no_proxy')).toLowerCase();
  if (!NO_PROXY) {
    return true;  // Always proxy if NO_PROXY is not set.
  }
  if (NO_PROXY === '*') {
    return false;  // Never proxy if wildcard is set.
  }

  return NO_PROXY.split(/[,\s]/).every(function(proxy) {
    if (!proxy) {
      return true;  // Skip zero-length hosts.
    }
    var parsedProxy = proxy.match(/^(.+):(\d+)$/);
    var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
    var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
    if (parsedProxyPort && parsedProxyPort !== port) {
      return true;  // Skip if ports don't match.
    }

    if (!/^[.*]/.test(parsedProxyHostname)) {
      // No wildcards, so stop proxying if there is an exact match.
      return hostname !== parsedProxyHostname;
    }

    if (parsedProxyHostname.charAt(0) === '*') {
      // Remove leading wildcard.
      parsedProxyHostname = parsedProxyHostname.slice(1);
    }
    // Stop proxying if the hostname ends with the no_proxy host.
    return !stringEndsWith.call(hostname, parsedProxyHostname);
  });
}

/**
 * Get the value for an environment variable.
 *
 * @param {string} key - The name of the environment variable.
 * @return {string} The value of the environment variable.
 * @private
 */
function getEnv(key) {
  return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || '';
}

exports.j = getProxyForUrl;


/***/ }),

/***/ 30236:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W2d: () => (/* binding */ ImForward)
/* harmony export */ });
/* unused harmony exports ImHome, ImHome2, ImHome3, ImOffice, ImNewspaper, ImPencil, ImPencil2, ImQuill, ImPen, ImBlog, ImEyedropper, ImDroplet, ImPaintFormat, ImImage, ImImages, ImCamera, ImHeadphones, ImMusic, ImPlay, ImFilm, ImVideoCamera, ImDice, ImPacman, ImSpades, ImClubs, ImDiamonds, ImBullhorn, ImConnection, ImPodcast, ImFeed, ImMic, ImBook, ImBooks, ImLibrary, ImFileText, ImProfile, ImFileEmpty, ImFilesEmpty, ImFileText2, ImFilePicture, ImFileMusic, ImFilePlay, ImFileVideo, ImFileZip, ImCopy, ImPaste, ImStack, ImFolder, ImFolderOpen, ImFolderPlus, ImFolderMinus, ImFolderDownload, ImFolderUpload, ImPriceTag, ImPriceTags, ImBarcode, ImQrcode, ImTicket, ImCart, ImCoinDollar, ImCoinEuro, ImCoinPound, ImCoinYen, ImCreditCard, ImCalculator, ImLifebuoy, ImPhone, ImPhoneHangUp, ImAddressBook, ImEnvelop, ImPushpin, ImLocation, ImLocation2, ImCompass, ImCompass2, ImMap, ImMap2, ImHistory, ImClock, ImClock2, ImAlarm, ImBell, ImStopwatch, ImCalendar, ImPrinter, ImKeyboard, ImDisplay, ImLaptop, ImMobile, ImMobile2, ImTablet, ImTv, ImDrawer, ImDrawer2, ImBoxAdd, ImBoxRemove, ImDownload, ImUpload, ImFloppyDisk, ImDrive, ImDatabase, ImUndo, ImRedo, ImUndo2, ImRedo2, ImReply, ImBubble, ImBubbles, ImBubbles2, ImBubble2, ImBubbles3, ImBubbles4, ImUser, ImUsers, ImUserPlus, ImUserMinus, ImUserCheck, ImUserTie, ImQuotesLeft, ImQuotesRight, ImHourGlass, ImSpinner, ImSpinner2, ImSpinner3, ImSpinner4, ImSpinner5, ImSpinner6, ImSpinner7, ImSpinner8, ImSpinner9, ImSpinner10, ImSpinner11, ImBinoculars, ImSearch, ImZoomIn, ImZoomOut, ImEnlarge, ImShrink, ImEnlarge2, ImShrink2, ImKey, ImKey2, ImLock, ImUnlocked, ImWrench, ImEqualizer, ImEqualizer2, ImCog, ImCogs, ImHammer, ImMagicWand, ImAidKit, ImBug, ImPieChart, ImStatsDots, ImStatsBars, ImStatsBars2, ImTrophy, ImGift, ImGlass, ImGlass2, ImMug, ImSpoonKnife, ImLeaf, ImRocket, ImMeter, ImMeter2, ImHammer2, ImFire, ImLab, ImMagnet, ImBin, ImBin2, ImBriefcase, ImAirplane, ImTruck, ImRoad, ImAccessibility, ImTarget, ImShield, ImPower, ImSwitch, ImPowerCord, ImClipboard, ImListNumbered, ImList, ImList2, ImTree, ImMenu, ImMenu2, ImMenu3, ImMenu4, ImCloud, ImCloudDownload, ImCloudUpload, ImCloudCheck, ImDownload2, ImUpload2, ImDownload3, ImUpload3, ImSphere, ImEarth, ImLink, ImFlag, ImAttachment, ImEye, ImEyePlus, ImEyeMinus, ImEyeBlocked, ImBookmark, ImBookmarks, ImSun, ImContrast, ImBrightnessContrast, ImStarEmpty, ImStarHalf, ImStarFull, ImHeart, ImHeartBroken, ImMan, ImWoman, ImManWoman, ImHappy, ImHappy2, ImSmile, ImSmile2, ImTongue, ImTongue2, ImSad, ImSad2, ImWink, ImWink2, ImGrin, ImGrin2, ImCool, ImCool2, ImAngry, ImAngry2, ImEvil, ImEvil2, ImShocked, ImShocked2, ImBaffled, ImBaffled2, ImConfused, ImConfused2, ImNeutral, ImNeutral2, ImHipster, ImHipster2, ImWondering, ImWondering2, ImSleepy, ImSleepy2, ImFrustrated, ImFrustrated2, ImCrying, ImCrying2, ImPointUp, ImPointRight, ImPointDown, ImPointLeft, ImWarning, ImNotification, ImQuestion, ImPlus, ImMinus, ImInfo, ImCancelCircle, ImBlocked, ImCross, ImCheckmark, ImCheckmark2, ImSpellCheck, ImEnter, ImExit, ImPlay2, ImPause, ImStop, ImPrevious, ImNext, ImBackward, ImForward2, ImPlay3, ImPause2, ImStop2, ImBackward2, ImForward3, ImFirst, ImLast, ImPrevious2, ImNext2, ImEject, ImVolumeHigh, ImVolumeMedium, ImVolumeLow, ImVolumeMute, ImVolumeMute2, ImVolumeIncrease, ImVolumeDecrease, ImLoop, ImLoop2, ImInfinite, ImShuffle, ImArrowUpLeft, ImArrowUp, ImArrowUpRight, ImArrowRight, ImArrowDownRight, ImArrowDown, ImArrowDownLeft, ImArrowLeft, ImArrowUpLeft2, ImArrowUp2, ImArrowUpRight2, ImArrowRight2, ImArrowDownRight2, ImArrowDown2, ImArrowDownLeft2, ImArrowLeft2, ImCircleUp, ImCircleRight, ImCircleDown, ImCircleLeft, ImTab, ImMoveUp, ImMoveDown, ImSortAlphaAsc, ImSortAlphaDesc, ImSortNumericAsc, ImSortNumbericDesc, ImSortAmountAsc, ImSortAmountDesc, ImCommand, ImShift, ImCtrl, ImOpt, ImCheckboxChecked, ImCheckboxUnchecked, ImRadioChecked, ImRadioChecked2, ImRadioUnchecked, ImCrop, ImMakeGroup, ImUngroup, ImScissors, ImFilter, ImFont, ImLigature, ImLigature2, ImTextHeight, ImTextWidth, ImFontSize, ImBold, ImUnderline, ImItalic, ImStrikethrough, ImOmega, ImSigma, ImPageBreak, ImSuperscript, ImSubscript, ImSuperscript2, ImSubscript2, ImTextColor, ImPagebreak, ImClearFormatting, ImTable, ImTable2, ImInsertTemplate, ImPilcrow, ImLtr, ImRtl, ImSection, ImParagraphLeft, ImParagraphCenter, ImParagraphRight, ImParagraphJustify, ImIndentIncrease, ImIndentDecrease, ImShare, ImNewTab, ImEmbed, ImEmbed2, ImTerminal, ImShare2, ImMail, ImMail2, ImMail3, ImMail4, ImAmazon, ImGoogle, ImGoogle2, ImGoogle3, ImGooglePlus, ImGooglePlus2, ImGooglePlus3, ImHangouts, ImGoogleDrive, ImFacebook, ImFacebook2, ImInstagram, ImWhatsapp, ImSpotify, ImTelegram, ImTwitter, ImVine, ImVk, ImRenren, ImSinaWeibo, ImRss, ImRss2, ImYoutube, ImYoutube2, ImTwitch, ImVimeo, ImVimeo2, ImLanyrd, ImFlickr, ImFlickr2, ImFlickr3, ImFlickr4, ImDribbble, ImBehance, ImBehance2, ImDeviantart, Im500Px, ImSteam, ImSteam2, ImDropbox, ImOnedrive, ImGithub, ImNpm, ImBasecamp, ImTrello, ImWordpress, ImJoomla, ImEllo, ImBlogger, ImBlogger2, ImTumblr, ImTumblr2, ImYahoo, ImYahoo2, ImTux, ImAppleinc, ImFinder, ImAndroid, ImWindows, ImWindows8, ImSoundcloud, ImSoundcloud2, ImSkype, ImReddit, ImHackernews, ImWikipedia, ImLinkedin, ImLinkedin2, ImLastfm, ImLastfm2, ImDelicious, ImStumbleupon, ImStumbleupon2, ImStackoverflow, ImPinterest, ImPinterest2, ImXing, ImXing2, ImFlattr, ImFoursquare, ImYelp, ImPaypal, ImChrome, ImFirefox, ImIe, ImEdge, ImSafari, ImOpera, ImFilePdf, ImFileOpenoffice, ImFileWord, ImFileExcel, ImLibreoffice, ImHtmlFive, ImHtmlFive2, ImCss3, ImGit, ImCodepen, ImSvg, ImIcoMoon */
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(64407);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lib__WEBPACK_IMPORTED_MODULE_0__);
// THIS FILE IS AUTO GENERATED

function ImHome (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 9.226l-8-6.21-8 6.21v-2.532l8-6.21 8 6.21zM14 9v6h-4v-4h-4v4h-4v-6l6-4.5z"}}]})(props);
};
function ImHome2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0.5l-8 8 1.5 1.5 1.5-1.5v6.5h4v-3h2v3h4v-6.5l1.5 1.5 1.5-1.5-8-8zM8 7c-0.552 0-1-0.448-1-1s0.448-1 1-1c0.552 0 1 0.448 1 1s-0.448 1-1 1z"}}]})(props);
};
function ImHome3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 9.5l-3-3v-4.5h-2v2.5l-3-3-8 8v0.5h2v5h5v-3h2v3h5v-5h2z"}}]})(props);
};
function ImOffice (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 16h8v-16h-8v16zM5 2h2v2h-2v-2zM5 6h2v2h-2v-2zM5 10h2v2h-2v-2zM1 2h2v2h-2v-2zM1 6h2v2h-2v-2zM1 10h2v2h-2v-2zM9 5h7v1h-7zM9 16h2v-4h3v4h2v-9h-7z"}}]})(props);
};
function ImNewspaper (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 4v-2h-14v11c0 0.552 0.448 1 1 1h13.5c0.828 0 1.5-0.672 1.5-1.5v-8.5h-2zM13 13h-12v-10h12v10zM2 5h10v1h-10zM8 7h4v1h-4zM8 9h4v1h-4zM8 11h3v1h-3zM2 7h5v5h-5z"}}]})(props);
};
function ImPencil (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.5 0c1.381 0 2.5 1.119 2.5 2.5 0 0.563-0.186 1.082-0.5 1.5l-1 1-3.5-3.5 1-1c0.418-0.314 0.937-0.5 1.5-0.5zM1 11.5l-1 4.5 4.5-1 9.25-9.25-3.5-3.5-9.25 9.25zM11.181 5.681l-7 7-0.862-0.862 7-7 0.862 0.862z"}}]})(props);
};
function ImPencil2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 10l2-1 7-7-1-1-7 7-1 2zM4.52 13.548c-0.494-1.043-1.026-1.574-2.069-2.069l1.548-4.262 2-1.217 6-6h-3l-6 6-3 10 10-3 6-6v-3l-6 6-1.217 2z"}}]})(props);
};
function ImQuill (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 16c2-6 7.234-16 16-16-4.109 3.297-6 11-9 11s-3 0-3 0l-3 5h-1z"}}]})(props);
};
function ImPen (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.909 4.561l-4.47-4.47c-0.146-0.146-0.338-0.113-0.427 0.073l-0.599 1.248 4.175 4.175 1.248-0.599c0.186-0.089 0.219-0.282 0.073-0.427z"}},{"tag":"path","attr":{"d":"M9.615 2.115l-4.115 0.343c-0.273 0.034-0.501 0.092-0.58 0.449-0 0-0 0.001-0 0.001-1.116 5.36-4.92 10.591-4.92 10.591l0.896 0.896 4.25-4.25c-0.094-0.196-0.146-0.415-0.146-0.647 0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5-0.672 1.5-1.5 1.5c-0.232 0-0.451-0.053-0.647-0.146l-4.25 4.25 0.896 0.896c0 0 5.231-3.804 10.591-4.92 0-0 0.001-0 0.001-0 0.357-0.078 0.415-0.306 0.449-0.58l0.343-4.115-4.269-4.269z"}}]})(props);
};
function ImBlog (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 0v1.5c1.148 0 2.261 0.225 3.308 0.667 1.012 0.428 1.921 1.041 2.702 1.822s1.394 1.69 1.822 2.702c0.443 1.047 0.667 2.16 0.667 3.308h1.5c0-5.523-4.477-10-10-10z"}},{"tag":"path","attr":{"d":"M6 3v1.5c1.469 0 2.85 0.572 3.889 1.611s1.611 2.42 1.611 3.889h1.5c0-3.866-3.134-7-7-7z"}},{"tag":"path","attr":{"d":"M7.5 6l-1 1-3.5 1-3 6.5 0.396 0.396 3.638-3.638c-0.022-0.083-0.034-0.169-0.034-0.259 0-0.552 0.448-1 1-1s1 0.448 1 1-0.448 1-1 1c-0.090 0-0.176-0.012-0.259-0.034l-3.638 3.638 0.396 0.396 6.5-3 1-3.5 1-1-2.5-2.5z"}}]})(props);
};
function ImEyedropper (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.414 0.586c-0.781-0.781-2.047-0.781-2.828 0l-2.689 2.689-1.896-1.896-2.121 2.121 1.663 1.663-7.377 7.377c-0.126 0.126-0.179 0.296-0.161 0.46h-0.004v2.5c0 0.276 0.224 0.5 0.5 0.5h2.5c0 0 0.042 0 0.063 0 0.144 0 0.288-0.055 0.398-0.165l7.377-7.377 1.663 1.663 2.121-2.121-1.896-1.896 2.689-2.689c0.781-0.781 0.781-2.047 0-2.828zM2.705 15h-1.705v-1.705l7.337-7.337 1.704 1.704-7.337 7.337z"}}]})(props);
};
function ImDroplet (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.51 7.393c-1.027-2.866-3.205-5.44-5.51-7.393-2.305 1.953-4.482 4.527-5.51 7.393-0.635 1.772-0.698 3.696 0.197 5.397 1.029 1.955 3.104 3.21 5.313 3.21s4.284-1.255 5.313-3.21c0.895-1.701 0.832-3.624 0.197-5.397zM11.543 11.859c-0.684 1.301-2.075 2.141-3.543 2.141-0.861 0-1.696-0.29-2.377-0.791 0.207 0.027 0.416 0.041 0.627 0.041 1.835 0 3.573-1.050 4.428-2.676 0.701-1.333 0.64-2.716 0.373-3.818 0.227 0.44 0.42 0.878 0.576 1.311 0.353 0.985 0.625 2.443-0.084 3.791z"}}]})(props);
};
function ImPaintFormat (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 9v-6h-3v-1c0-0.55-0.45-1-1-1h-11c-0.55 0-1 0.45-1 1v3c0 0.55 0.45 1 1 1h11c0.55 0 1-0.45 1-1v-1h2v4h-9v2h-0.5c-0.276 0-0.5 0.224-0.5 0.5v5c0 0.276 0.224 0.5 0.5 0.5h2c0.276 0 0.5-0.224 0.5-0.5v-5c0-0.276-0.224-0.5-0.5-0.5h-0.5v-1h9zM12 3h-11v-1h11v1z"}}]})(props);
};
function ImImage (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.998 2c0.001 0.001 0.001 0.001 0.002 0.002v11.996c-0.001 0.001-0.001 0.001-0.002 0.002h-13.996c-0.001-0.001-0.001-0.001-0.002-0.002v-11.996c0.001-0.001 0.001-0.001 0.002-0.002h13.996zM15 1h-14c-0.55 0-1 0.45-1 1v12c0 0.55 0.45 1 1 1h14c0.55 0 1-0.45 1-1v-12c0-0.55-0.45-1-1-1v0z"}},{"tag":"path","attr":{"d":"M13 4.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5 0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5z"}},{"tag":"path","attr":{"d":"M14 13h-12v-2l3.5-6 4 5h1l3.5-3z"}}]})(props);
};
function ImImages (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 18 16"},"child":[{"tag":"path","attr":{"d":"M17 2h-1v-1c0-0.55-0.45-1-1-1h-14c-0.55 0-1 0.45-1 1v12c0 0.55 0.45 1 1 1h1v1c0 0.55 0.45 1 1 1h14c0.55 0 1-0.45 1-1v-12c0-0.55-0.45-1-1-1zM2 3v10h-0.998c-0.001-0.001-0.001-0.001-0.002-0.002v-11.996c0.001-0.001 0.001-0.001 0.002-0.002h13.996c0.001 0.001 0.001 0.001 0.002 0.002v0.998h-12c-0.55 0-1 0.45-1 1v0zM17 14.998c-0.001 0.001-0.001 0.001-0.002 0.002h-13.996c-0.001-0.001-0.001-0.001-0.002-0.002v-11.996c0.001-0.001 0.001-0.001 0.002-0.002h13.996c0.001 0.001 0.001 0.001 0.002 0.002v11.996z"}},{"tag":"path","attr":{"d":"M15 5.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5 0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5z"}},{"tag":"path","attr":{"d":"M16 14h-12v-2l3.5-6 4 5h1l3.5-3z"}}]})(props);
};
function ImCamera (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4.75 9.5c0 1.795 1.455 3.25 3.25 3.25s3.25-1.455 3.25-3.25-1.455-3.25-3.25-3.25-3.25 1.455-3.25 3.25zM15 4h-3.5c-0.25-1-0.5-2-1.5-2h-4c-1 0-1.25 1-1.5 2h-3.5c-0.55 0-1 0.45-1 1v9c0 0.55 0.45 1 1 1h14c0.55 0 1-0.45 1-1v-9c0-0.55-0.45-1-1-1zM8 13.938c-2.451 0-4.438-1.987-4.438-4.438s1.987-4.438 4.438-4.438c2.451 0 4.438 1.987 4.438 4.438s-1.987 4.438-4.438 4.438zM15 7h-2v-1h2v1z"}}]})(props);
};
function ImHeadphones (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4.5 9h-1v7h1c0.275 0 0.5-0.225 0.5-0.5v-6c0-0.275-0.225-0.5-0.5-0.5z"}},{"tag":"path","attr":{"d":"M11.5 9c-0.275 0-0.5 0.225-0.5 0.5v6c0 0.275 0.225 0.5 0.5 0.5h1v-7h-1z"}},{"tag":"path","attr":{"d":"M16 8c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 0.96 0.169 1.88 0.479 2.732-0.304 0.519-0.479 1.123-0.479 1.768 0 1.763 1.304 3.222 3 3.464v-6.928c-0.499 0.071-0.963 0.248-1.371 0.506-0.084-0.417-0.129-0.849-0.129-1.292 0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5c0 0.442-0.044 0.874-0.128 1.292-0.408-0.259-0.873-0.435-1.372-0.507v6.929c1.696-0.243 3-1.701 3-3.464 0-0.645-0.175-1.249-0.479-1.768 0.31-0.853 0.479-1.773 0.479-2.732z"}}]})(props);
};
function ImMusic (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15 0h1v11.5c0 1.381-1.567 2.5-3.5 2.5s-3.5-1.119-3.5-2.5c0-1.381 1.567-2.5 3.5-2.5 0.979 0 1.865 0.287 2.5 0.751v-5.751l-8 1.778v7.722c0 1.381-1.567 2.5-3.5 2.5s-3.5-1.119-3.5-2.5c0-1.381 1.567-2.5 3.5-2.5 0.979 0 1.865 0.287 2.5 0.751v-9.751l9-2z"}}]})(props);
};
function ImPlay (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.331 2.502c-2.244-0.323-4.724-0.502-7.331-0.502s-5.087 0.179-7.331 0.502c-0.43 1.683-0.669 3.543-0.669 5.498s0.239 3.815 0.669 5.498c2.244 0.323 4.724 0.502 7.331 0.502s5.087-0.179 7.331-0.502c0.43-1.683 0.669-3.543 0.669-5.498s-0.239-3.815-0.669-5.498zM6 11v-6l5 3-5 3z"}}]})(props);
};
function ImFilm (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 2v12h16v-12h-16zM3 13h-2v-2h2v2zM3 9h-2v-2h2v2zM3 5h-2v-2h2v2zM12 13h-8v-10h8v10zM15 13h-2v-2h2v2zM15 9h-2v-2h2v2zM15 5h-2v-2h2v2zM6 5v6l4-3z"}}]})(props);
};
function ImVideoCamera (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 4.5c0-1.381 1.119-2.5 2.5-2.5s2.5 1.119 2.5 2.5c0 1.381-1.119 2.5-2.5 2.5s-2.5-1.119-2.5-2.5zM0 4.5c0-1.381 1.119-2.5 2.5-2.5s2.5 1.119 2.5 2.5c0 1.381-1.119 2.5-2.5 2.5s-2.5-1.119-2.5-2.5zM12 9.5v-1.5c0-0.55-0.45-1-1-1h-10c-0.55 0-1 0.45-1 1v5c0 0.55 0.45 1 1 1h10c0.55 0 1-0.45 1-1v-1.5l4 2.5v-7l-4 2.5zM10 12h-8v-3h8v3z"}}]})(props);
};
function ImDice (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.5 3h-8c-1.375 0-2.5 1.125-2.5 2.5v8c0 1.375 1.125 2.5 2.5 2.5h8c1.375 0 2.5-1.125 2.5-2.5v-8c0-1.375-1.125-2.5-2.5-2.5zM6.5 14c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5-0.672 1.5-1.5 1.5zM6.5 8c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5-0.672 1.5-1.5 1.5zM9.5 11c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5-0.672 1.5-1.5 1.5zM12.5 14c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5-0.672 1.5-1.5 1.5zM12.5 8c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5-0.672 1.5-1.5 1.5zM12.949 2c-0.233-1.138-1.245-2-2.449-2h-8c-1.375 0-2.5 1.125-2.5 2.5v8c0 1.204 0.862 2.216 2 2.449v-9.949c0-0.55 0.45-1 1-1h9.949z"}}]})(props);
};
function ImPacman (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.074 2.794c-1.467-1.71-3.644-2.794-6.074-2.794-4.418 0-8 3.582-8 8s3.582 8 8 8c2.43 0 4.607-1.084 6.074-2.794l-5.074-5.206 5.074-5.206zM11 1.884c0.616 0 1.116 0.499 1.116 1.116s-0.499 1.116-1.116 1.116-1.116-0.499-1.116-1.116c0-0.616 0.499-1.116 1.116-1.116z"}}]})(props);
};
function ImSpades (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.775 5.44c-3.024-2.248-4.067-4.047-4.774-5.44v0c-0 0-0-0-0-0v0c-0.708 1.393-1.75 3.192-4.774 5.44-5.157 3.833-0.303 9.182 3.965 6.238-0.278 1.827-1.227 3.159-2.191 3.733v0.59h6v-0.59c-0.964-0.574-1.913-1.906-2.191-3.733 4.268 2.944 9.122-2.405 3.965-6.238z"}}]})(props);
};
function ImClubs (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.294 6.137c-0.922 0-1.751 0.384-2.341 1.011-0.25 0.265-0.684 0.58-1.153 0.856 0.22-0.842 0.917-1.902 1.4-2.367 0.619-0.596 1-1.435 1-2.367 0-1.795-1.429-3.252-3.2-3.271-1.771 0.019-3.2 1.475-3.2 3.271 0 0.932 0.38 1.771 1 2.367 0.484 0.465 1.18 1.525 1.4 2.367-0.469-0.277-0.903-0.591-1.153-0.856-0.59-0.627-1.419-1.011-2.341-1.011-1.787 0-3.236 1.463-3.236 3.271s1.448 3.271 3.236 3.271c0.923 0 1.751-0.396 2.341-1.023 0.263-0.279 0.726-0.627 1.223-0.916-0.047 2.308-1.149 4.003-2.271 4.67v0.59h6v-0.59c-1.122-0.668-2.224-2.363-2.271-4.67 0.498 0.289 0.961 0.637 1.223 0.916 0.59 0.626 1.419 1.023 2.341 1.023 1.787 0 3.236-1.464 3.236-3.271s-1.448-3.271-3.236-3.271z"}}]})(props);
};
function ImDiamonds (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0l-5 8 5 8 5-8z"}}]})(props);
};
function ImBullhorn (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 6.707c0-3.139-0.919-5.687-2.054-5.707 0.005-0 0.009-0 0.014-0h-1.296c0 0-3.044 2.287-7.425 3.184-0.134 0.708-0.219 1.551-0.219 2.523s0.085 1.816 0.219 2.523c4.382 0.897 7.425 3.184 7.425 3.184h1.296c-0.005 0-0.009-0-0.014-0.001 1.136-0.020 2.054-2.567 2.054-5.707zM13.513 11.551c-0.147 0-0.305-0.152-0.387-0.243-0.197-0.22-0.387-0.562-0.55-0.989-0.363-0.957-0.564-2.239-0.564-3.611s0.2-2.655 0.564-3.611c0.162-0.428 0.353-0.77 0.55-0.99 0.081-0.091 0.24-0.243 0.387-0.243s0.305 0.152 0.387 0.243c0.197 0.22 0.387 0.562 0.55 0.99 0.363 0.957 0.564 2.239 0.564 3.611s-0.2 2.655-0.564 3.611c-0.162 0.428-0.353 0.77-0.55 0.989-0.081 0.091-0.24 0.243-0.387 0.243zM3.935 6.707c0-0.812 0.060-1.6 0.173-2.33-0.74 0.102-1.39 0.161-2.193 0.161-1.048 0-1.048 0-1.048 0l-0.867 1.479v1.378l0.867 1.479c0 0 0 0 1.048 0 0.803 0 1.453 0.059 2.193 0.161-0.113-0.729-0.173-1.518-0.173-2.33zM5.752 10.034l-2-0.383 1.279 5.024c0.066 0.26 0.324 0.391 0.573 0.291l1.852-0.741c0.249-0.1 0.349-0.374 0.222-0.611l-1.926-3.581zM13.513 8.574c-0.057 0-0.118-0.059-0.149-0.094-0.076-0.085-0.149-0.217-0.212-0.381-0.14-0.369-0.217-0.863-0.217-1.392s0.077-1.023 0.217-1.392c0.063-0.165 0.136-0.297 0.212-0.381 0.031-0.035 0.092-0.094 0.149-0.094s0.118 0.059 0.149 0.094c0.076 0.085 0.149 0.217 0.212 0.381 0.14 0.369 0.217 0.863 0.217 1.392s-0.077 1.023-0.217 1.392c-0.063 0.165-0.136 0.297-0.212 0.381-0.031 0.035-0.092 0.094-0.149 0.094z"}}]})(props);
};
function ImConnection (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 20 16"},"child":[{"tag":"path","attr":{"d":"M10 9c1.654 0 3.154 0.673 4.241 1.759l-1.414 1.414c-0.724-0.724-1.724-1.173-2.827-1.173s-2.103 0.449-2.827 1.173l-1.414-1.414c1.086-1.086 2.586-1.759 4.241-1.759zM2.929 7.929c1.889-1.889 4.4-2.929 7.071-2.929s5.182 1.040 7.071 2.929l-1.414 1.414c-1.511-1.511-3.52-2.343-5.657-2.343s-4.146 0.832-5.657 2.343l-1.414-1.414zM15.45 2.101c1.667 0.705 3.164 1.715 4.45 3v0l-1.414 1.414c-2.267-2.266-5.28-3.515-8.485-3.515s-6.219 1.248-8.485 3.515l-1.414-1.414c1.285-1.285 2.783-2.295 4.45-3 1.727-0.73 3.56-1.101 5.45-1.101s3.723 0.37 5.45 1.101zM9 14c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1z"}}]})(props);
};
function ImPodcast (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 8c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 3.438 2.169 6.37 5.214 7.501l-0.214 0.499h6l-0.214-0.499c3.045-1.131 5.214-4.063 5.214-7.501zM7.606 9.919c-0.356-0.153-0.606-0.507-0.606-0.919 0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.412-0.25 0.766-0.606 0.919l-0.394-0.919-0.394 0.919zM8.41 9.958c0.908-0.189 1.59-0.994 1.59-1.958 0-1.105-0.895-2-2-2s-2 0.895-2 2c0 0.964 0.682 1.768 1.59 1.957l-1.166 2.721c-1.425-0.612-2.424-2.028-2.424-3.677 0-2.209 1.791-4.188 4-4.188s4 1.978 4 4.188c0 1.649-0.999 3.066-2.424 3.677l-1.166-2.72zM10.757 15.433l-1.155-2.695c1.976-0.668 3.398-2.537 3.398-4.738 0-2.761-2.239-5-5-5s-5 2.239-5 5c0 2.201 1.422 4.070 3.398 4.738l-1.155 2.695c-2.494-1.070-4.24-3.547-4.24-6.433 0-3.865 3.133-7.185 6.997-7.185s6.997 3.32 6.997 7.185c0 2.886-1.747 5.363-4.24 6.433z"}}]})(props);
};
function ImFeed (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 8c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM10.38 3.602c1.56 0.846 2.62 2.498 2.62 4.398s-1.059 3.552-2.62 4.398c0.689-1.096 1.12-2.66 1.12-4.398s-0.431-3.302-1.12-4.398zM4.5 8c0 1.738 0.431 3.302 1.12 4.398-1.56-0.846-2.62-2.498-2.62-4.398s1.059-3.552 2.62-4.398c-0.689 1.096-1.12 2.66-1.12 4.398zM1.5 8c0 2.686 0.85 5.097 2.198 6.746-2.223-1.421-3.698-3.911-3.698-6.746s1.474-5.325 3.698-6.746c-1.348 1.649-2.198 4.060-2.198 6.746zM12.302 1.254c2.223 1.421 3.698 3.911 3.698 6.746s-1.474 5.325-3.698 6.746c1.348-1.649 2.198-4.060 2.198-6.746s-0.85-5.097-2.198-6.746z"}}]})(props);
};
function ImMic (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7.5 11c1.381 0 2.5-1.119 2.5-2.5v-6c0-1.381-1.119-2.5-2.5-2.5s-2.5 1.119-2.5 2.5v6c0 1.381 1.119 2.5 2.5 2.5zM11 7v1.5c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5v-1.5h-1v1.5c0 2.316 1.75 4.223 4 4.472v2.028h-2v1h5v-1h-2v-2.028c2.25-0.249 4-2.156 4-4.472v-1.5h-1z"}}]})(props);
};
function ImBook (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 2v13h-10.5c-0.829 0-1.5-0.672-1.5-1.5s0.671-1.5 1.5-1.5h9.5v-12h-10c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h12v-14h-1z"}},{"tag":"path","attr":{"d":"M3.501 13v0c-0 0-0.001 0-0.001 0-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5c0 0 0.001-0 0.001-0v0h9.498v-1h-9.498z"}}]})(props);
};
function ImBooks (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 18 16"},"child":[{"tag":"path","attr":{"d":"M3.5 2h-3c-0.275 0-0.5 0.225-0.5 0.5v11c0 0.275 0.225 0.5 0.5 0.5h3c0.275 0 0.5-0.225 0.5-0.5v-11c0-0.275-0.225-0.5-0.5-0.5zM3 5h-2v-1h2v1z"}},{"tag":"path","attr":{"d":"M8.5 2h-3c-0.275 0-0.5 0.225-0.5 0.5v11c0 0.275 0.225 0.5 0.5 0.5h3c0.275 0 0.5-0.225 0.5-0.5v-11c0-0.275-0.225-0.5-0.5-0.5zM8 5h-2v-1h2v1z"}},{"tag":"path","attr":{"d":"M11.954 2.773l-2.679 1.35c-0.246 0.124-0.345 0.426-0.222 0.671l4.5 8.93c0.124 0.246 0.426 0.345 0.671 0.222l2.679-1.35c0.246-0.124 0.345-0.426 0.222-0.671l-4.5-8.93c-0.124-0.246-0.426-0.345-0.671-0.222z"}},{"tag":"path","attr":{"d":"M14.5 13.5c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5z"}}]})(props);
};
function ImLibrary (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 17 16"},"child":[{"tag":"path","attr":{"d":"M16 15v-1h-1v-6h1v-1h-3v1h1v6h-3v-6h1v-1h-3v1h1v6h-3v-6h1v-1h-3v1h1v6h-3v-6h1v-1h-3v1h1v6h-1v1h-1v1h17v-1h-1z"}},{"tag":"path","attr":{"d":"M8 0h1l8 5v1h-17v-1l8-5z"}}]})(props);
};
function ImFileText (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.5 0h-12c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h12c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM13 14h-11v-12h11v12zM4 7h7v1h-7zM4 9h7v1h-7zM4 11h7v1h-7zM4 5h7v1h-7z"}}]})(props);
};
function ImProfile (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.5 0h-12c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h12c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM13 14h-11v-12h11v12zM4 9h7v1h-7zM4 11h7v1h-7zM5 4.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5zM7.5 6h-2c-0.825 0-1.5 0.45-1.5 1v1h5v-1c0-0.55-0.675-1-1.5-1z"}}]})(props);
};
function ImFileEmpty (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"}}]})(props);
};
function ImFilesEmpty (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.341 5.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-5.75c-0.689 0-1.25 0.561-1.25 1.25v11.5c0 0.689 0.561 1.25 1.25 1.25h9.5c0.689 0 1.25-0.561 1.25-1.25v-7.75c0-0.224-0.068-0.615-0.659-1.421zM12.271 4.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134v0zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-9.5c-0.136 0-0.25-0.114-0.25-0.25v-11.5c0-0.135 0.114-0.25 0.25-0.25 0 0 5.749-0 5.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v7.75z"}},{"tag":"path","attr":{"d":"M9.421 0.659c-0.806-0.591-1.197-0.659-1.421-0.659h-5.75c-0.689 0-1.25 0.561-1.25 1.25v11.5c0 0.604 0.43 1.109 1 1.225v-12.725c0-0.135 0.115-0.25 0.25-0.25h7.607c-0.151-0.124-0.297-0.238-0.437-0.341z"}}]})(props);
};
function ImFileText2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"}},{"tag":"path","attr":{"d":"M11.5 13h-7c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h7c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M11.5 11h-7c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h7c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M11.5 9h-7c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h7c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z"}}]})(props);
};
function ImFilePicture (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13 14h-10v-2l3-5 4.109 5 2.891-2v4z"}},{"tag":"path","attr":{"d":"M13 7.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5 0.672-1.5 1.5-1.5c0.828 0 1.5 0.672 1.5 1.5z"}},{"tag":"path","attr":{"d":"M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"}}]})(props);
};
function ImFileMusic (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421v0zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134v0zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"}},{"tag":"path","attr":{"d":"M11.817 6.113c-0.116-0.095-0.268-0.133-0.415-0.104l-5 1c-0.234 0.047-0.402 0.252-0.402 0.49v3.701c-0.294-0.128-0.636-0.201-1-0.201-1.105 0-2 0.672-2 1.5s0.895 1.5 2 1.5 2-0.672 2-1.5v-3.59l4-0.8v2.091c-0.294-0.128-0.636-0.201-1-0.201-1.105 0-2 0.672-2 1.5s0.895 1.5 2 1.5 2-0.672 2-1.5v-5c0-0.15-0.067-0.292-0.183-0.387z"}}]})(props);
};
function ImFilePlay (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 6l5 3.5-5 3.5v-7z"}},{"tag":"path","attr":{"d":"M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"}}]})(props);
};
function ImFileVideo (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421v0 0zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134v0 0zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"}},{"tag":"path","attr":{"d":"M4 8h5v5h-5v-5z"}},{"tag":"path","attr":{"d":"M9 10l3-2v5l-3-2z"}}]})(props);
};
function ImFileZip (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421v0 0zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134v0 0zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"}},{"tag":"path","attr":{"d":"M4 1h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M6 2h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M4 3h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M6 4h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M4 5h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M6 6h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M4 7h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M6 8h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M4 13.25c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75h-1.25v-1h-2v4.25zM7 12v1h-2v-1h2z"}}]})(props);
};
function ImCopy (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M10 4v-4h-7l-3 3v9h6v4h10v-12h-6zM3 1.414v1.586h-1.586l1.586-1.586zM1 11v-7h3v-3h5v3l-3 3v4h-5zM9 5.414v1.586h-1.586l1.586-1.586zM15 15h-8v-7h3v-3h5v10z"}}]})(props);
};
function ImPaste (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11 2h-2v-1c0-0.55-0.45-1-1-1h-2c-0.55 0-1 0.45-1 1v1h-2v2h8v-2zM8 2h-2v-0.998c0.001-0.001 0.001-0.001 0.002-0.002h1.996c0.001 0.001 0.001 0.001 0.002 0.002v0.998zM13 5v-2.5c0-0.275-0.225-0.5-0.5-0.5h-1v1h0.5v2h-3l-3 3v4h-4v-9h0.5v-1h-1c-0.275 0-0.5 0.225-0.5 0.5v10c0 0.275 0.225 0.5 0.5 0.5h4.5v3h10v-11h-3zM9 6.414v1.586h-1.586l1.586-1.586zM15 15h-8v-6h3v-3h5v9z"}}]})(props);
};
function ImStack (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 5l-8-4-8 4 8 4 8-4zM8 2.328l5.345 2.672-5.345 2.672-5.345-2.672 5.345-2.672zM14.398 7.199l1.602 0.801-8 4-8-4 1.602-0.801 6.398 3.199zM14.398 10.199l1.602 0.801-8 4-8-4 1.602-0.801 6.398 3.199z"}}]})(props);
};
function ImFolder (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7 2l2 2h7v11h-16v-13z"}}]})(props);
};
function ImFolderOpen (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13 15l3-8h-13l-3 8zM2 6l-2 9v-13h4.5l2 2h6.5v2z"}}]})(props);
};
function ImFolderPlus (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9 4l-2-2h-7v13h16v-11h-7zM11 11h-2v2h-2v-2h-2v-2h2v-2h2v2h2v2z"}}]})(props);
};
function ImFolderMinus (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9 4l-2-2h-7v13h16v-11h-7zM11 11h-6v-2h6v2z"}}]})(props);
};
function ImFolderDownload (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9 4l-2-2h-7v13h16v-11h-7zM8 13.5l-3.5-3.5h2.5v-4h2v4h2.5l-3.5 3.5z"}}]})(props);
};
function ImFolderUpload (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9 4l-2-2h-7v13h16v-11h-7zM8 7.5l3.5 3.5h-2.5v4h-2v-4h-2.5l3.5-3.5z"}}]})(props);
};
function ImPriceTag (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.25 0h-6c-0.412 0-0.989 0.239-1.28 0.53l-7.439 7.439c-0.292 0.292-0.292 0.769 0 1.061l6.439 6.439c0.292 0.292 0.769 0.292 1.061 0l7.439-7.439c0.292-0.292 0.53-0.868 0.53-1.28v-6c0-0.412-0.338-0.75-0.75-0.75zM11.5 6c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5-0.672 1.5-1.5 1.5z"}}]})(props);
};
function ImPriceTags (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 20 16"},"child":[{"tag":"path","attr":{"d":"M19.25 0h-6c-0.412 0-0.989 0.239-1.28 0.53l-7.439 7.439c-0.292 0.292-0.292 0.769 0 1.061l6.439 6.439c0.292 0.292 0.769 0.292 1.061 0l7.439-7.439c0.292-0.292 0.53-0.868 0.53-1.28v-6c0-0.412-0.337-0.75-0.75-0.75zM15.5 6c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5-0.672 1.5-1.5 1.5z"}},{"tag":"path","attr":{"d":"M2 8.5l8.5-8.5h-1.25c-0.412 0-0.989 0.239-1.28 0.53l-7.439 7.439c-0.292 0.292-0.292 0.769 0 1.061l6.439 6.439c0.292 0.292 0.769 0.292 1.061 0l0.47-0.47-6.5-6.5z"}}]})(props);
};
function ImBarcode (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 2h2v10h-2zM3 2h1v10h-1zM5 2h1v10h-1zM8 2h1v10h-1zM12 2h1v10h-1zM15 2h1v10h-1zM10 2h0.5v10h-0.5zM7 2h0.5v10h-0.5zM13.5 2h0.5v10h-0.5zM0 13h1v1h-1zM3 13h1v1h-1zM5 13h1v1h-1zM10 13h1v1h-1zM15 13h1v1h-1zM12 13h2v1h-2zM7 13h2v1h-2z"}}]})(props);
};
function ImQrcode (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5 1h-4v4h4v-4zM6 0v0 6h-6v-6h6zM2 2h2v2h-2zM15 1h-4v4h4v-4zM16 0v0 6h-6v-6h6zM12 2h2v2h-2zM5 11h-4v4h4v-4zM6 10v0 6h-6v-6h6zM2 12h2v2h-2zM7 0h1v1h-1zM8 1h1v1h-1zM7 2h1v1h-1zM8 3h1v1h-1zM7 4h1v1h-1zM8 5h1v1h-1zM7 6h1v1h-1zM7 8h1v1h-1zM8 9h1v1h-1zM7 10h1v1h-1zM8 11h1v1h-1zM7 12h1v1h-1zM8 13h1v1h-1zM7 14h1v1h-1zM8 15h1v1h-1zM15 8h1v1h-1zM1 8h1v1h-1zM2 7h1v1h-1zM0 7h1v1h-1zM4 7h1v1h-1zM5 8h1v1h-1zM6 7h1v1h-1zM9 8h1v1h-1zM10 7h1v1h-1zM11 8h1v1h-1zM12 7h1v1h-1zM13 8h1v1h-1zM14 7h1v1h-1zM15 10h1v1h-1zM9 10h1v1h-1zM10 9h1v1h-1zM11 10h1v1h-1zM13 10h1v1h-1zM14 9h1v1h-1zM15 12h1v1h-1zM9 12h1v1h-1zM10 11h1v1h-1zM12 11h1v1h-1zM13 12h1v1h-1zM14 11h1v1h-1zM15 14h1v1h-1zM10 13h1v1h-1zM11 14h1v1h-1zM12 13h1v1h-1zM13 14h1v1h-1zM10 15h1v1h-1zM12 15h1v1h-1zM14 15h1v1h-1z"}}]})(props);
};
function ImTicket (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9 5l2 2-4 4-2-2zM15.649 4.649l-1.149-1.149-0.5 0.5c-0.256 0.256-0.61 0.414-1 0.414-0.781 0-1.414-0.633-1.414-1.414 0-0.391 0.158-0.744 0.415-1l0.5-0.5-1.149-1.149c-0.468-0.468-1.235-0.468-1.703 0l-9.297 9.297c-0.468 0.468-0.468 1.235 0 1.703l1.149 1.149 0.499-0.499c0.256-0.256 0.61-0.415 1.001-0.415 0.781 0 1.414 0.633 1.414 1.414 0 0.391-0.158 0.744-0.415 1l-0.5 0.5 1.149 1.149c0.468 0.468 1.234 0.468 1.703 0l9.297-9.297c0.468-0.468 0.468-1.235 0-1.703zM7 13l-4-4 6-6 4 4-6 6z"}}]})(props);
};
function ImCart (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 14.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5z"}},{"tag":"path","attr":{"d":"M16 14.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5z"}},{"tag":"path","attr":{"d":"M16 8v-6h-12c0-0.552-0.448-1-1-1h-3v1h2l0.751 6.438c-0.458 0.367-0.751 0.93-0.751 1.562 0 1.105 0.895 2 2 2h12v-1h-12c-0.552 0-1-0.448-1-1 0-0.003 0-0.007 0-0.010l13-1.99z"}}]})(props);
};
function ImCoinDollar (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7.5 1c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5zM7.5 14.5c-3.314 0-6-2.686-6-6s2.686-6 6-6c3.314 0 6 2.686 6 6s-2.686 6-6 6zM8 8v-2h2v-1h-2v-1h-1v1h-2v4h2v2h-2v1h2v1h1v-1h2l-0-4h-2zM7 8h-1v-2h1v2zM9 11h-1v-2h1v2z"}}]})(props);
};
function ImCoinEuro (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7.5 1c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5zM7.5 14.5c-3.314 0-6-2.686-6-6s2.686-6 6-6c3.314 0 6 2.686 6 6s-2.686 6-6 6z"}},{"tag":"path","attr":{"d":"M10.482 10.068c-0.239-0.139-0.545-0.058-0.684 0.181-0.27 0.463-0.767 0.751-1.298 0.751h-2c-0.652 0-1.208-0.418-1.414-1h2.414c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-2.5v-1h2.5c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-2.414c0.206-0.582 0.762-1 1.414-1h2c0.531 0 1.028 0.288 1.298 0.751 0.139 0.239 0.445 0.32 0.684 0.181s0.32-0.445 0.181-0.684c-0.448-0.77-1.277-1.249-2.162-1.249h-2c-1.207 0-2.217 0.86-2.45 2h-0.55c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h0.5v1h-0.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h0.55c0.232 1.14 1.242 2 2.45 2h2c0.886 0 1.714-0.478 2.162-1.249 0.139-0.239 0.058-0.545-0.181-0.684z"}}]})(props);
};
function ImCoinPound (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7.5 1c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5zM7.5 14.5c-3.314 0-6-2.686-6-6s2.686-6 6-6c3.314 0 6 2.686 6 6s-2.686 6-6 6z"}},{"tag":"path","attr":{"d":"M9.5 11h-3.5v-2h1.5c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-1.5v-0.5c0-0.827 0.673-1.5 1.5-1.5 0.534 0 1.032 0.288 1.3 0.75 0.138 0.239 0.444 0.321 0.683 0.182s0.321-0.444 0.182-0.683c-0.446-0.771-1.276-1.25-2.165-1.25-1.378 0-2.5 1.122-2.5 2.5v0.5h-0.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h0.5v3h4.5c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5z"}}]})(props);
};
function ImCoinYen (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7.5 1c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5zM7.5 14.5c-3.314 0-6-2.686-6-6s2.686-6 6-6c3.314 0 6 2.686 6 6s-2.686 6-6 6z"}},{"tag":"path","attr":{"d":"M9.5 9c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-1.066l1.482-2.223c0.153-0.23 0.091-0.54-0.139-0.693s-0.54-0.091-0.693 0.139l-1.584 2.376-1.584-2.376c-0.153-0.23-0.464-0.292-0.693-0.139s-0.292 0.464-0.139 0.693l1.482 2.223h-1.066c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h1.5v1h-1.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h1.5v1.5c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5v-1.5h1.5c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-1.5v-1h1.5z"}}]})(props);
};
function ImCreditCard (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 2h-13c-0.825 0-1.5 0.675-1.5 1.5v9c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-9c0-0.825-0.675-1.5-1.5-1.5zM1.5 3h13c0.271 0 0.5 0.229 0.5 0.5v1.5h-14v-1.5c0-0.271 0.229-0.5 0.5-0.5zM14.5 13h-13c-0.271 0-0.5-0.229-0.5-0.5v-4.5h14v4.5c0 0.271-0.229 0.5-0.5 0.5zM2 10h1v2h-1zM4 10h1v2h-1zM6 10h1v2h-1z"}}]})(props);
};
function ImCalculator (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 1h-5c-0.55 0-1 0.45-1 1v5c0 0.55 0.45 1 1 1h5c0.55 0 1-0.45 1-1v-5c0-0.55-0.45-1-1-1zM6 5h-5v-1h5v1zM14 1h-5c-0.55 0-1 0.45-1 1v13c0 0.55 0.45 1 1 1h5c0.55 0 1-0.45 1-1v-13c0-0.55-0.45-1-1-1zM14 10h-5v-1h5v1zM14 7h-5v-1h5v1zM6 9h-5c-0.55 0-1 0.45-1 1v5c0 0.55 0.45 1 1 1h5c0.55 0 1-0.45 1-1v-5c0-0.55-0.45-1-1-1zM6 13h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1z"}}]})(props);
};
function ImLifebuoy (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM5 8c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zM14.468 10.679v0l-2.772-1.148c0.196-0.472 0.304-0.989 0.304-1.531s-0.108-1.059-0.304-1.531l2.772-1.148c0.342 0.825 0.532 1.73 0.532 2.679s-0.189 1.854-0.532 2.679v0zM10.679 1.532v0 0l-1.148 2.772c-0.472-0.196-0.989-0.304-1.531-0.304s-1.059 0.108-1.531 0.304l-1.148-2.772c0.825-0.342 1.73-0.532 2.679-0.532s1.854 0.189 2.679 0.532zM1.532 5.321l2.772 1.148c-0.196 0.472-0.304 0.989-0.304 1.531s0.108 1.059 0.304 1.531l-2.772 1.148c-0.342-0.825-0.532-1.73-0.532-2.679s0.189-1.854 0.532-2.679zM5.321 14.468l1.148-2.772c0.472 0.196 0.989 0.304 1.531 0.304s1.059-0.108 1.531-0.304l1.148 2.772c-0.825 0.342-1.73 0.532-2.679 0.532s-1.854-0.189-2.679-0.532z"}}]})(props);
};
function ImPhone (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11 10c-1 1-1 2-2 2s-2-1-3-2-2-2-2-3 1-1 2-2-2-4-3-4-3 3-3 3c0 2 2.055 6.055 4 8s6 4 8 4c0 0 3-2 3-3s-3-4-4-3z"}}]})(props);
};
function ImPhoneHangUp (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.897 9c0.125 0.867 0.207 2.053-0.182 2.507-0.643 0.751-4.714 0.751-4.714-0.751 0-0.756 0.67-1.252 0.027-2.003-0.632-0.738-1.766-0.75-3.027-0.751s-2.394 0.012-3.027 0.751c-0.643 0.751 0.027 1.247 0.027 2.003 0 1.501-4.071 1.501-4.714 0.751-0.389-0.454-0.307-1.64-0.182-2.507 0.096-0.579 0.339-1.203 1.118-2 0-0 0-0 0-0 1.168-1.090 2.935-1.98 6.716-2v-0c0.021 0 0.042 0 0.063 0s0.041-0 0.063-0v0c3.781 0.019 5.548 0.91 6.716 2 0 0 0 0 0 0 0.778 0.797 1.022 1.421 1.118 2z"}}]})(props);
};
function ImAddressBook (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3 0v16h12v-16h-12zM9 4.005c1.102 0 1.995 0.893 1.995 1.995s-0.893 1.995-1.995 1.995-1.995-0.893-1.995-1.995 0.893-1.995 1.995-1.995v0zM12 12h-6v-1c0-1.105 0.895-2 2-2v0h2c1.105 0 2 0.895 2 2v1z"}},{"tag":"path","attr":{"d":"M1 1h1.5v3h-1.5v-3z"}},{"tag":"path","attr":{"d":"M1 5h1.5v3h-1.5v-3z"}},{"tag":"path","attr":{"d":"M1 9h1.5v3h-1.5v-3z"}},{"tag":"path","attr":{"d":"M1 13h1.5v3h-1.5v-3z"}}]})(props);
};
function ImEnvelop (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 2h-13c-0.825 0-1.5 0.675-1.5 1.5v10c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-10c0-0.825-0.675-1.5-1.5-1.5zM6.23 8.6l-4.23 3.295v-7.838l4.23 4.543zM2.756 4h10.488l-5.244 3.938-5.244-3.938zM6.395 8.777l1.605 1.723 1.605-1.723 3.29 4.223h-9.79l3.29-4.223zM9.77 8.6l4.23-4.543v7.838l-4.23-3.295z"}}]})(props);
};
function ImPushpin (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8.5 0l-1.5 1.5 1.5 1.5-3.5 4h-3.5l2.75 2.75-4.25 5.635v0.615h0.615l5.635-4.25 2.75 2.75v-3.5l4-3.5 1.5 1.5 1.5-1.5-7.5-7.5zM7 8.5l-1-1 3.5-3.5 1 1-3.5 3.5z"}}]})(props);
};
function ImLocation (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-2.761 0-5 2.239-5 5 0 5 5 11 5 11s5-6 5-11c0-2.761-2.239-5-5-5zM8 8c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"}}]})(props);
};
function ImLocation2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-2.761 0-5 2.239-5 5 0 5 5 11 5 11s5-6 5-11c0-2.761-2.239-5-5-5zM8 8.063c-1.691 0-3.063-1.371-3.063-3.063s1.371-3.063 3.063-3.063 3.063 1.371 3.063 3.063-1.371 3.063-3.063 3.063zM6.063 5c0-1.070 0.867-1.938 1.938-1.938s1.938 0.867 1.938 1.938c0 1.070-0.867 1.938-1.938 1.938s-1.938-0.867-1.938-1.938z"}}]})(props);
};
function ImCompass (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8.5 16c-0.036 0-0.072-0.004-0.108-0.012-0.229-0.051-0.392-0.254-0.392-0.488v-7.5h-7.5c-0.234 0-0.437-0.163-0.488-0.392s0.064-0.462 0.277-0.561l15-7c0.191-0.089 0.416-0.049 0.565 0.1s0.188 0.374 0.1 0.565l-7 15c-0.083 0.179-0.262 0.289-0.453 0.289zM2.754 7h5.746c0.276 0 0.5 0.224 0.5 0.5v5.746l5.465-11.712-11.712 5.465z"}}]})(props);
};
function ImCompass2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM1.5 8c0-3.59 2.91-6.5 6.5-6.5 1.712 0 3.269 0.662 4.43 1.744l-6.43 2.756-2.756 6.43c-1.082-1.161-1.744-2.718-1.744-4.43zM9.143 9.143l-4.001 1.715 1.715-4.001 2.286 2.286zM8 14.5c-1.712 0-3.269-0.662-4.43-1.744l6.43-2.756 2.756-6.43c1.082 1.161 1.744 2.718 1.744 4.43 0 3.59-2.91 6.5-6.5 6.5z"}}]})(props);
};
function ImMap (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 3l5-2v12l-5 2z"}},{"tag":"path","attr":{"d":"M6 0.5l5 3v11.5l-5-2.5z"}},{"tag":"path","attr":{"d":"M12 3.5l4-3v12l-4 3z"}}]})(props);
};
function ImMap2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M10.5 3l-5-2-5.5 2v12l5.5-2 5 2 5.5-2v-12l-5.5 2zM6 2.277l4 1.6v9.846l-4-1.6v-9.846zM1 3.7l4-1.455v9.872l-4 1.454v-9.872zM15 12.3l-4 1.455v-9.872l4-1.455v9.872z"}}]})(props);
};
function ImHistory (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 17 16"},"child":[{"tag":"path","attr":{"d":"M10 1c3.866 0 7 3.134 7 7s-3.134 7-7 7v-1.5c1.469 0 2.85-0.572 3.889-1.611s1.611-2.42 1.611-3.889c0-1.469-0.572-2.85-1.611-3.889s-2.42-1.611-3.889-1.611c-1.469 0-2.85 0.572-3.889 1.611-0.799 0.799-1.322 1.801-1.52 2.889h2.909l-3.5 4-3.5-4h2.571c0.485-3.392 3.402-6 6.929-6zM13 7v2h-4v-5h2v3z"}}]})(props);
};
function ImClock (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M10.293 11.707l-3.293-3.293v-4.414h2v3.586l2.707 2.707zM8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14c-3.314 0-6-2.686-6-6s2.686-6 6-6c3.314 0 6 2.686 6 6s-2.686 6-6 6z"}}]})(props);
};
function ImClock2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM10.293 11.707l-3.293-3.293v-4.414h2v3.586l2.707 2.707-1.414 1.414z"}}]})(props);
};
function ImAlarm (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 2c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zM8 14.625c-3.107 0-5.625-2.518-5.625-5.625s2.518-5.625 5.625-5.625c3.107 0 5.625 2.518 5.625 5.625s-2.518 5.625-5.625 5.625zM14.606 4.487c0.251-0.438 0.394-0.946 0.394-1.487 0-1.657-1.343-3-3-3-0.966 0-1.825 0.457-2.374 1.166 2.061 0.426 3.831 1.644 4.98 3.322v0zM6.374 1.166c-0.549-0.709-1.408-1.166-2.374-1.166-1.657 0-3 1.343-3 3 0 0.541 0.143 1.049 0.394 1.487 1.148-1.678 2.919-2.896 4.98-3.322z"}},{"tag":"path","attr":{"d":"M8 9v-4h-1v5h4v-1z"}}]})(props);
};
function ImBell (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16.023 12.5c0-4.5-4-3.5-4-7 0-0.29-0.028-0.538-0.079-0.749-0.263-1.766-1.44-3.183-2.965-3.615 0.014-0.062 0.021-0.125 0.021-0.191 0-0.52-0.45-0.945-1-0.945s-1 0.425-1 0.945c0 0.065 0.007 0.129 0.021 0.191-1.71 0.484-2.983 2.208-3.020 4.273-0.001 0.030-0.001 0.060-0.001 0.091 0 3.5-4 2.5-4 7 0 1.191 2.665 2.187 6.234 2.439 0.336 0.631 1.001 1.061 1.766 1.061s1.43-0.43 1.766-1.061c3.568-0.251 6.234-1.248 6.234-2.439 0-0.004-0-0.007-0-0.011l0.024 0.011zM12.91 13.345c-0.847 0.226-1.846 0.389-2.918 0.479-0.089-1.022-0.947-1.824-1.992-1.824s-1.903 0.802-1.992 1.824c-1.072-0.090-2.071-0.253-2.918-0.479-1.166-0.311-1.724-0.659-1.928-0.845 0.204-0.186 0.762-0.534 1.928-0.845 1.356-0.362 3.1-0.561 4.91-0.561s3.554 0.199 4.91 0.561c1.166 0.311 1.724 0.659 1.928 0.845-0.204 0.186-0.762 0.534-1.928 0.845z"}}]})(props);
};
function ImStopwatch (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 3.019v-1.019h2v-1c0-0.552-0.448-1-1-1h-3c-0.552 0-1 0.448-1 1v1h2v1.019c-3.356 0.255-6 3.059-6 6.481 0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5c0-3.422-2.644-6.226-6-6.481zM11.036 13.036c-0.944 0.944-2.2 1.464-3.536 1.464s-2.591-0.52-3.536-1.464c-0.944-0.944-1.464-2.2-1.464-3.536s0.52-2.591 1.464-3.536c0.907-0.907 2.101-1.422 3.377-1.462l-0.339 4.907c-0.029 0.411 0.195 0.591 0.497 0.591s0.527-0.18 0.497-0.591l-0.339-4.907c1.276 0.040 2.47 0.555 3.377 1.462 0.944 0.944 1.464 2.2 1.464 3.536s-0.52 2.591-1.464 3.536z"}}]})(props);
};
function ImCalendar (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5 6h2v2h-2zM8 6h2v2h-2zM11 6h2v2h-2zM2 12h2v2h-2zM5 12h2v2h-2zM8 12h2v2h-2zM5 9h2v2h-2zM8 9h2v2h-2zM11 9h2v2h-2zM2 9h2v2h-2zM13 0v1h-2v-1h-7v1h-2v-1h-2v16h15v-16h-2zM14 15h-13v-11h13v11z"}}]})(props);
};
function ImPrinter (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 1h8v2h-8v-2z"}},{"tag":"path","attr":{"d":"M15 4h-14c-0.55 0-1 0.45-1 1v5c0 0.55 0.45 1 1 1h3v4h8v-4h3c0.55 0 1-0.45 1-1v-5c0-0.55-0.45-1-1-1zM2 7c-0.552 0-1-0.448-1-1s0.448-1 1-1 1 0.448 1 1-0.448 1-1 1zM11 14h-6v-5h6v5z"}}]})(props);
};
function ImKeyboard (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 18 16"},"child":[{"tag":"path","attr":{"d":"M17 2h-16c-0.55 0-1 0.45-1 1v10c0 0.55 0.45 1 1 1h16c0.55 0 1-0.45 1-1v-10c0-0.55-0.45-1-1-1zM10 4h2v2h-2v-2zM13 7v2h-2v-2h2zM7 4h2v2h-2v-2zM10 7v2h-2v-2h2zM4 4h2v2h-2v-2zM7 7v2h-2v-2h2zM2 4h1v2h-1v-2zM2 7h2v2h-2v-2zM3 12h-1v-2h1v2zM12 12h-8v-2h8v2zM16 12h-3v-2h3v2zM16 9h-2v-2h2v2zM16 6h-3v-2h3v2z"}}]})(props);
};
function ImDisplay (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 1v10h16v-10h-16zM15 10h-14v-8h14v8zM10.5 12h-5l-0.5 2-1 1h8l-1-1z"}}]})(props);
};
function ImLaptop (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 11v-8c0-0.55-0.45-1-1-1h-10c-0.55 0-1 0.45-1 1v8h-2v3h16v-3h-2zM10 13h-4v-1h4v1zM13 11h-10v-7.998c0.001-0.001 0.001-0.001 0.002-0.002h9.996c0.001 0.001 0.001 0.001 0.002 0.002v7.998z"}}]})(props);
};
function ImMobile (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.5 0h-7c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h7c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM6 0.75h4v0.5h-4v-0.5zM8 15c-0.552 0-1-0.448-1-1s0.448-1 1-1 1 0.448 1 1-0.448 1-1 1zM12 12h-8v-10h8v10z"}}]})(props);
};
function ImMobile2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12 0h-9c-0.55 0-1 0.45-1 1v14c0 0.55 0.45 1 1 1h9c0.55 0 1-0.45 1-1v-14c0-0.55-0.45-1-1-1zM7.5 15.278c-0.43 0-0.778-0.348-0.778-0.778s0.348-0.778 0.778-0.778 0.778 0.348 0.778 0.778-0.348 0.778-0.778 0.778zM12 13h-9v-11h9v11z"}}]})(props);
};
function ImTablet (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.5 0h-10c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h10c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM7.5 15.5c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5 0.5 0.224 0.5 0.5-0.224 0.5-0.5 0.5zM12 14h-9v-12h9v12z"}}]})(props);
};
function ImTv (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.331 4.502c-1.388-0.199-2.865-0.344-4.407-0.425l2.576-2.576-1-1-3.509 3.509c-0.328-0.006-0.659-0.009-0.991-0.009v0l-4-4-1 1 3.034 3.034c-1.889 0.066-3.693 0.227-5.365 0.467-0.43 1.683-0.669 3.543-0.669 5.498s0.239 3.815 0.669 5.498c2.244 0.323 4.724 0.502 7.331 0.502s5.087-0.179 7.331-0.502c0.43-1.683 0.669-3.543 0.669-5.498s-0.239-3.815-0.669-5.498zM13.498 13.666c-1.683 0.215-3.543 0.334-5.498 0.334s-3.815-0.119-5.498-0.334c-0.323-1.122-0.502-2.362-0.502-3.666s0.179-2.543 0.502-3.666c1.683-0.215 3.543-0.334 5.498-0.334s3.815 0.119 5.498 0.334c0.323 1.122 0.502 2.362 0.502 3.666s-0.179 2.543-0.502 3.666z"}}]})(props);
};
function ImDrawer (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.89 10.188l-4-5c-0.095-0.119-0.239-0.188-0.39-0.188h-7c-0.152 0-0.296 0.069-0.39 0.188l-4 5c-0.071 0.089-0.11 0.199-0.11 0.312v4.5c0 0.552 0.448 1 1 1h14c0.552 0 1-0.448 1-1v-4.5c0-0.114-0.039-0.224-0.11-0.312zM15 11h-3.5l-2 2h-3l-2-2h-3.5v-0.325l3.74-4.675h6.519l3.74 4.675v0.325z"}},{"tag":"path","attr":{"d":"M11.5 8h-7c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h7c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M12.5 10h-9c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h9c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z"}}]})(props);
};
function ImDrawer2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.89 10.188l-4-5c-0.095-0.119-0.239-0.188-0.39-0.188h-7c-0.152 0-0.296 0.069-0.39 0.188l-4 5c-0.071 0.089-0.11 0.199-0.11 0.312v4.5c0 0.552 0.448 1 1 1h14c0.552 0 1-0.448 1-1v-4.5c0-0.114-0.039-0.224-0.11-0.312zM15 11h-3.5l-2 2h-3l-2-2h-3.5v-0.325l3.74-4.675h6.519l3.74 4.675v0.325z"}}]})(props);
};
function ImBoxAdd (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13 1h-10l-3 3v10.5c0 0.276 0.224 0.5 0.5 0.5h15c0.276 0 0.5-0.224 0.5-0.5v-10.5l-3-3zM8 13l-5-4h3v-3h4v3h3l-5 4zM2.414 3l1-1h9.172l1 1h-11.172z"}}]})(props);
};
function ImBoxRemove (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13 1h-10l-3 3v10.5c0 0.276 0.224 0.5 0.5 0.5h15c0.276 0 0.5-0.224 0.5-0.5v-10.5l-3-3zM10 10v3h-4v-3h-3l5-4 5 4h-3zM2.414 3l1-1h9.171l1 1h-11.171z"}}]})(props);
};
function ImDownload (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 9l4-4h-3v-4h-2v4h-3zM11.636 7.364l-1.121 1.121 4.064 1.515-6.579 2.453-6.579-2.453 4.064-1.515-1.121-1.121-4.364 1.636v4l8 3 8-3v-4z"}}]})(props);
};
function ImUpload (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7 9h2v-4h3l-4-4-4 4h3zM10 6.75v1.542l4.579 1.708-6.579 2.453-6.579-2.453 4.579-1.708v-1.542l-6 2.25v4l8 3 8-3v-4z"}}]})(props);
};
function ImFloppyDisk (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 0h-14v16h16v-14l-2-2zM8 2h2v4h-2v-4zM14 14h-12v-12h1v5h9v-5h1.172l0.828 0.828v11.172z"}}]})(props);
};
function ImDrive (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3 14h10c1.657 0 3-1.343 3-3h-16c0 1.657 1.343 3 3 3zM13 12h1v1h-1v-1zM15 2h-14l-1 8h16z"}}]})(props);
};
function ImDatabase (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 1.119-8 2.5v2c0 1.381 3.582 2.5 8 2.5s8-1.119 8-2.5v-2c0-1.381-3.582-2.5-8-2.5z"}},{"tag":"path","attr":{"d":"M8 8.5c-4.418 0-8-1.119-8-2.5v3c0 1.381 3.582 2.5 8 2.5s8-1.119 8-2.5v-3c0 1.381-3.582 2.5-8 2.5z"}},{"tag":"path","attr":{"d":"M8 13c-4.418 0-8-1.119-8-2.5v3c0 1.381 3.582 2.5 8 2.5s8-1.119 8-2.5v-3c0 1.381-3.582 2.5-8 2.5z"}}]})(props);
};
function ImUndo (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 1c-2.209 0-4.209 0.896-5.657 2.343l-2.343-2.343v6h6l-2.243-2.243c1.086-1.086 2.586-1.757 4.243-1.757 3.314 0 6 2.686 6 6 0 1.792-0.786 3.401-2.032 4.5l1.323 1.5c1.661-1.466 2.709-3.611 2.709-6 0-4.418-3.582-8-8-8z"}}]})(props);
};
function ImRedo (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 9c0 2.389 1.048 4.534 2.709 6l1.323-1.5c-1.246-1.099-2.031-2.708-2.031-4.5 0-3.314 2.686-6 6-6 1.657 0 3.157 0.672 4.243 1.757l-2.243 2.243h6v-6l-2.343 2.343c-1.448-1.448-3.448-2.343-5.657-2.343-4.418 0-8 3.582-8 8z"}}]})(props);
};
function ImUndo2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.904 16c1.777-3.219 2.076-8.13-4.904-7.966v3.966l-6-6 6-6v3.881c8.359-0.218 9.29 7.378 4.904 12.119z"}}]})(props);
};
function ImRedo2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9 3.881v-3.881l6 6-6 6v-3.966c-6.98-0.164-6.681 4.747-4.904 7.966-4.386-4.741-3.455-12.337 4.904-12.119z"}}]})(props);
};
function ImForward (props) {
  return (0,_lib__WEBPACK_IMPORTED_MODULE_0__.GenIcon)({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4.096 0c-1.777 3.219-2.076 8.13 4.904 7.966v-3.966l6 6-6 6v-3.881c-8.359 0.218-9.29-7.378-4.904-12.119z"}}]})(props);
};
function ImReply (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7 12.119v3.881l-6-6 6-6v3.966c6.98 0.164 6.681-4.747 4.904-7.966 4.386 4.741 3.455 12.337-4.904 12.119z"}}]})(props);
};
function ImBubble (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 1c4.418 0 8 2.91 8 6.5s-3.582 6.5-8 6.5c-0.424 0-0.841-0.027-1.247-0.079-1.718 1.718-3.77 2.027-5.753 2.072v-0.421c1.071-0.525 2-1.48 2-2.572 0-0.152-0.012-0.302-0.034-0.448-1.809-1.192-2.966-3.012-2.966-5.052 0-3.59 3.582-6.5 8-6.5z"}}]})(props);
};
function ImBubbles (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 18 16"},"child":[{"tag":"path","attr":{"d":"M17 14.081c0 0.711 0.407 1.327 1 1.628v0.249c-0.166 0.023-0.335 0.035-0.508 0.035-1.063 0-2.021-0.446-2.699-1.16-0.41 0.109-0.844 0.168-1.293 0.168-2.485 0-4.5-1.791-4.5-4s2.015-4 4.5-4c2.485 0 4.5 1.791 4.5 4 0 0.865-0.309 1.665-0.834 2.32-0.107 0.232-0.166 0.489-0.166 0.761zM8 0c4.351 0 7.89 2.822 7.997 6.336-0.768-0.343-1.619-0.524-2.497-0.524-1.493 0-2.903 0.523-3.971 1.472-1.107 0.984-1.717 2.304-1.717 3.716 0 0.698 0.149 1.373 0.433 1.997-0.082 0.002-0.164 0.003-0.246 0.003-0.424 0-0.841-0.027-1.247-0.079-1.718 1.718-3.77 2.027-5.753 2.072v-0.421c1.071-0.525 2-1.48 2-2.572 0-0.152-0.012-0.302-0.034-0.448-1.809-1.192-2.966-3.012-2.966-5.052 0-3.59 3.582-6.5 8-6.5z"}}]})(props);
};
function ImBubbles2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 18 16"},"child":[{"tag":"path","attr":{"d":"M7.5 0v0c4.142 0 7.5 2.717 7.5 6.069s-3.358 6.069-7.5 6.069c-0.398 0-0.788-0.025-1.169-0.074-1.611 1.605-3.471 1.892-5.331 1.935v-0.393c1.004-0.49 1.813-1.382 1.813-2.402 0-0.142-0.011-0.282-0.032-0.419-1.696-1.113-2.781-2.812-2.781-4.717 0-3.352 3.358-6.069 7.5-6.069zM15.563 13.604c0 0.874 0.567 1.639 1.438 2.059v0.337c-1.611-0.036-3.090-0.283-4.487-1.658-0.33 0.041-0.669 0.063-1.013 0.063-1.492 0-2.866-0.402-3.963-1.079 2.261-0.008 4.395-0.732 6.013-2.042 0.816-0.66 1.459-1.435 1.913-2.302 0.481-0.92 0.724-1.9 0.724-2.913 0-0.163-0.007-0.326-0.020-0.487 1.134 0.936 1.832 2.213 1.832 3.62 0 1.633-0.94 3.089-2.41 4.043-0.018 0.117-0.027 0.237-0.027 0.359z"}}]})(props);
};
function ImBubble2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 3c-0.858 0-1.687 0.135-2.464 0.402-0.73 0.251-1.38 0.605-1.932 1.054-1.035 0.841-1.604 1.922-1.604 3.044 0 0.63 0.175 1.24 0.52 1.815 0.356 0.592 0.89 1.134 1.547 1.566 0.474 0.312 0.793 0.812 0.878 1.373 0.028 0.187 0.046 0.376 0.053 0.564 0.117-0.097 0.23-0.201 0.342-0.312 0.377-0.377 0.887-0.586 1.414-0.586 0.084 0 0.168 0.005 0.252 0.016 0.328 0.042 0.662 0.063 0.995 0.063 0.858 0 1.687-0.135 2.464-0.402 0.73-0.251 1.38-0.605 1.932-1.054 1.035-0.841 1.604-1.922 1.604-3.044s-0.57-2.203-1.604-3.044c-0.552-0.448-1.202-0.803-1.932-1.054-0.777-0.267-1.606-0.402-2.464-0.402zM8 1v0c4.418 0 8 2.91 8 6.5s-3.582 6.5-8 6.5c-0.424 0-0.841-0.027-1.247-0.079-1.718 1.718-3.77 2.027-5.753 2.072v-0.421c1.071-0.525 2-1.48 2-2.572 0-0.152-0.012-0.302-0.034-0.448-1.809-1.192-2.966-3.012-2.966-5.052 0-3.59 3.582-6.5 8-6.5z"}}]})(props);
};
function ImBubbles3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 18 16"},"child":[{"tag":"path","attr":{"d":"M17 14.081c0 0.711 0.407 1.327 1 1.628v0.249c-0.166 0.023-0.335 0.035-0.508 0.035-1.063 0-2.021-0.446-2.699-1.16-0.41 0.109-0.844 0.168-1.293 0.168-2.485 0-4.5-1.791-4.5-4s2.015-4 4.5-4c2.485 0 4.5 1.791 4.5 4 0 0.865-0.309 1.665-0.834 2.32-0.107 0.232-0.166 0.489-0.166 0.761zM3.604 3.456c-1.035 0.841-1.604 1.922-1.604 3.044 0 0.63 0.175 1.24 0.52 1.815 0.356 0.592 0.89 1.134 1.547 1.566 0.474 0.312 0.793 0.812 0.878 1.373 0.028 0.187 0.046 0.376 0.053 0.564 0.117-0.097 0.23-0.201 0.342-0.312 0.377-0.377 0.887-0.586 1.414-0.586 0.084 0 0.168 0.005 0.252 0.016 0.327 0.042 0.662 0.063 0.994 0.063v2c-0.424-0-0.84-0.027-1.246-0.079-1.718 1.718-3.77 2.027-5.753 2.072v-0.421c1.071-0.525 2-1.48 2-2.572 0-0.152-0.012-0.302-0.034-0.448-1.809-1.192-2.966-3.012-2.966-5.052 0-3.59 3.582-6.5 8-6.5 4.351 0 7.89 2.822 7.997 6.336-0.642-0.286-1.341-0.46-2.067-0.509-0.18-0.876-0.709-1.7-1.535-2.371-0.552-0.448-1.202-0.803-1.932-1.054-0.777-0.267-1.606-0.402-2.464-0.402s-1.687 0.135-2.464 0.402c-0.73 0.251-1.38 0.605-1.932 1.054z"}}]})(props);
};
function ImBubbles4 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 18 16"},"child":[{"tag":"path","attr":{"d":"M7.5 2c-0.792 0-1.556 0.124-2.272 0.369-0.671 0.23-1.267 0.554-1.773 0.963-0.938 0.759-1.455 1.731-1.455 2.737 0 0.562 0.157 1.109 0.467 1.623 0.323 0.537 0.811 1.028 1.41 1.421 0.476 0.312 0.796 0.812 0.881 1.374 0.014 0.094 0.025 0.188 0.034 0.282 0.043-0.039 0.085-0.080 0.127-0.122 0.377-0.376 0.886-0.583 1.411-0.583 0.084 0 0.167 0.005 0.251 0.016 0.303 0.038 0.611 0.058 0.918 0.058 0.792 0 1.556-0.124 2.272-0.369 0.671-0.23 1.267-0.554 1.774-0.963 0.938-0.759 1.455-1.731 1.455-2.737s-0.517-1.978-1.455-2.737c-0.506-0.41-1.103-0.734-1.774-0.963-0.716-0.245-1.48-0.369-2.272-0.369zM7.5 0v0c4.142 0 7.5 2.717 7.5 6.069s-3.358 6.069-7.5 6.069c-0.398 0-0.788-0.025-1.169-0.074-1.611 1.605-3.471 1.892-5.331 1.935v-0.393c1.004-0.49 1.813-1.382 1.813-2.402 0-0.142-0.011-0.282-0.032-0.419-1.696-1.113-2.781-2.812-2.781-4.717 0-3.352 3.358-6.069 7.5-6.069zM15.563 13.604c0 0.874 0.567 1.639 1.438 2.059v0.337c-1.611-0.036-3.090-0.283-4.487-1.658-0.33 0.041-0.669 0.063-1.013 0.063-1.492 0-2.866-0.402-3.963-1.079 2.261-0.008 4.395-0.732 6.013-2.042 0.816-0.66 1.459-1.435 1.913-2.302 0.481-0.92 0.724-1.9 0.724-2.913 0-0.163-0.007-0.326-0.020-0.487 1.134 0.936 1.832 2.213 1.832 3.62 0 1.633-0.94 3.089-2.41 4.043-0.018 0.117-0.027 0.237-0.027 0.359z"}}]})(props);
};
function ImUser (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9 11.041v-0.825c1.102-0.621 2-2.168 2-3.716 0-2.485 0-4.5-3-4.5s-3 2.015-3 4.5c0 1.548 0.898 3.095 2 3.716v0.825c-3.392 0.277-6 1.944-6 3.959h14c0-2.015-2.608-3.682-6-3.959z"}}]})(props);
};
function ImUsers (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 18 16"},"child":[{"tag":"path","attr":{"d":"M12 12.041v-0.825c1.102-0.621 2-2.168 2-3.716 0-2.485 0-4.5-3-4.5s-3 2.015-3 4.5c0 1.548 0.898 3.095 2 3.716v0.825c-3.392 0.277-6 1.944-6 3.959h14c0-2.015-2.608-3.682-6-3.959z"}},{"tag":"path","attr":{"d":"M5.112 12.427c0.864-0.565 1.939-0.994 3.122-1.256-0.235-0.278-0.449-0.588-0.633-0.922-0.475-0.863-0.726-1.813-0.726-2.748 0-1.344 0-2.614 0.478-3.653 0.464-1.008 1.299-1.633 2.488-1.867-0.264-1.195-0.968-1.98-2.841-1.98-3 0-3 2.015-3 4.5 0 1.548 0.898 3.095 2 3.716v0.825c-3.392 0.277-6 1.944-6 3.959h4.359c0.227-0.202 0.478-0.393 0.753-0.573z"}}]})(props);
};
function ImUserPlus (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 11.5c0-2.363 1.498-4.383 3.594-5.159 0.254-0.571 0.406-1.206 0.406-1.841 0-2.485 0-4.5-3-4.5s-3 2.015-3 4.5c0 1.548 0.898 3.095 2 3.716v0.825c-3.392 0.277-6 1.944-6 3.959h6.208c-0.135-0.477-0.208-0.98-0.208-1.5z"}},{"tag":"path","attr":{"d":"M11.5 7c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5zM14 12h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1z"}}]})(props);
};
function ImUserMinus (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 11.5c0-2.363 1.498-4.383 3.594-5.159 0.254-0.571 0.406-1.206 0.406-1.841 0-2.485 0-4.5-3-4.5s-3 2.015-3 4.5c0 1.548 0.898 3.095 2 3.716v0.825c-3.392 0.277-6 1.944-6 3.959h6.208c-0.135-0.477-0.208-0.98-0.208-1.5z"}},{"tag":"path","attr":{"d":"M11.5 7c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5zM14 12h-5v-1h5v1z"}}]})(props);
};
function ImUserCheck (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15 9.5l-4.5 4.5-1.5-1.5-1 1 2.5 2.5 5.5-5.5z"}},{"tag":"path","attr":{"d":"M7 12h5v-1.799c-1.050-0.613-2.442-1.033-4-1.16v-0.825c1.102-0.621 2-2.168 2-3.716 0-2.485 0-4.5-3-4.5s-3 2.015-3 4.5c0 1.548 0.898 3.095 2 3.716v0.825c-3.392 0.277-6 1.944-6 3.959h7v-1z"}}]})(props);
};
function ImUserTie (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5 3c0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3s-3-1.343-3-3zM12.001 7h-0.553l-3.111 6.316 1.163-5.816-1.5-1.5-1.5 1.5 1.163 5.816-3.111-6.316h-0.554c-1.999 0-1.999 1.344-1.999 3v5h12v-5c0-1.656 0-3-1.999-3z"}}]})(props);
};
function ImQuotesLeft (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3.516 7c1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5-3.5-1.567-3.5-3.5l-0.016-0.5c0-3.866 3.134-7 7-7v2c-1.336 0-2.591 0.52-3.536 1.464-0.182 0.182-0.348 0.375-0.497 0.578 0.179-0.028 0.362-0.043 0.548-0.043zM12.516 7c1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5-3.5-1.567-3.5-3.5l-0.016-0.5c0-3.866 3.134-7 7-7v2c-1.336 0-2.591 0.52-3.536 1.464-0.182 0.182-0.348 0.375-0.497 0.578 0.179-0.028 0.362-0.043 0.549-0.043z"}}]})(props);
};
function ImQuotesRight (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.5 10c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5l0.016 0.5c0 3.866-3.134 7-7 7v-2c1.336 0 2.591-0.52 3.536-1.464 0.182-0.182 0.348-0.375 0.497-0.578-0.179 0.028-0.362 0.043-0.549 0.043zM3.5 10c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5l0.016 0.5c0 3.866-3.134 7-7 7v-2c1.336 0 2.591-0.52 3.536-1.464 0.182-0.182 0.348-0.375 0.497-0.578-0.179 0.028-0.362 0.043-0.549 0.043z"}}]})(props);
};
function ImHourGlass (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.39 8c2.152-1.365 3.61-3.988 3.61-7 0-0.339-0.019-0.672-0.054-1h-13.891c-0.036 0.328-0.054 0.661-0.054 1 0 3.012 1.457 5.635 3.609 7-2.152 1.365-3.609 3.988-3.609 7 0 0.339 0.019 0.672 0.054 1h13.891c0.036-0.328 0.054-0.661 0.054-1 0-3.012-1.457-5.635-3.609-7zM2.5 15c0-2.921 1.253-5.397 3.5-6.214v-1.572c-2.247-0.817-3.5-3.294-3.5-6.214v0h11c0 2.921-1.253 5.397-3.5 6.214v1.572c2.247 0.817 3.5 3.294 3.5 6.214h-11zM9.682 10.462c-1.12-0.635-1.181-1.459-1.182-1.959v-1.004c0-0.5 0.059-1.327 1.184-1.963 0.602-0.349 1.122-0.88 1.516-1.537h-6.4c0.395 0.657 0.916 1.188 1.518 1.538 1.12 0.635 1.181 1.459 1.182 1.959v1.004c0 0.5-0.059 1.327-1.184 1.963-1.135 0.659-1.98 1.964-2.236 3.537h7.839c-0.256-1.574-1.102-2.879-2.238-3.538z"}}]})(props);
};
function ImSpinner (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 2c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM10.243 3.757c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM13 8c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM11.243 12.243c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM7 14c0 0 0 0 0 0 0-0.552 0.448-1 1-1s1 0.448 1 1c0 0 0 0 0 0 0 0.552-0.448 1-1 1s-1-0.448-1-1zM2.757 12.243c0 0 0 0 0 0 0-0.552 0.448-1 1-1s1 0.448 1 1c0 0 0 0 0 0 0 0.552-0.448 1-1 1s-1-0.448-1-1zM2.257 3.757c0 0 0 0 0 0 0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0 0 0 0 0 0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5zM0.875 8c0-0.621 0.504-1.125 1.125-1.125s1.125 0.504 1.125 1.125c0 0.621-0.504 1.125-1.125 1.125s-1.125-0.504-1.125-1.125z"}}]})(props);
};
function ImSpinner2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 8c-0.020-1.045-0.247-2.086-0.665-3.038-0.417-0.953-1.023-1.817-1.766-2.53s-1.624-1.278-2.578-1.651c-0.953-0.374-1.978-0.552-2.991-0.531-1.013 0.020-2.021 0.24-2.943 0.646-0.923 0.405-1.758 0.992-2.449 1.712s-1.237 1.574-1.597 2.497c-0.361 0.923-0.533 1.914-0.512 2.895 0.020 0.981 0.234 1.955 0.627 2.847 0.392 0.892 0.961 1.7 1.658 2.368s1.523 1.195 2.416 1.543c0.892 0.348 1.851 0.514 2.799 0.493 0.949-0.020 1.89-0.227 2.751-0.608 0.862-0.379 1.642-0.929 2.287-1.604s1.154-1.472 1.488-2.335c0.204-0.523 0.342-1.069 0.415-1.622 0.019 0.001 0.039 0.002 0.059 0.002 0.552 0 1-0.448 1-1 0-0.028-0.001-0.056-0.004-0.083h0.004zM14.411 10.655c-0.367 0.831-0.898 1.584-1.55 2.206s-1.422 1.112-2.254 1.434c-0.832 0.323-1.723 0.476-2.608 0.454-0.884-0.020-1.759-0.215-2.56-0.57-0.801-0.354-1.526-0.867-2.125-1.495s-1.071-1.371-1.38-2.173c-0.31-0.801-0.457-1.66-0.435-2.512s0.208-1.694 0.551-2.464c0.342-0.77 0.836-1.468 1.441-2.044s1.321-1.029 2.092-1.326c0.771-0.298 1.596-0.438 2.416-0.416s1.629 0.202 2.368 0.532c0.74 0.329 1.41 0.805 1.963 1.387s0.988 1.27 1.272 2.011c0.285 0.74 0.418 1.532 0.397 2.32h0.004c-0.002 0.027-0.004 0.055-0.004 0.083 0 0.516 0.39 0.94 0.892 0.994-0.097 0.544-0.258 1.075-0.481 1.578z"}}]})(props);
};
function ImSpinner3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 4.736c-0.515 0-0.933-0.418-0.933-0.933v-2.798c0-0.515 0.418-0.933 0.933-0.933s0.933 0.418 0.933 0.933v2.798c0 0.515-0.418 0.933-0.933 0.933z"}},{"tag":"path","attr":{"d":"M8 15.577c-0.322 0-0.583-0.261-0.583-0.583v-2.798c0-0.322 0.261-0.583 0.583-0.583s0.583 0.261 0.583 0.583v2.798c0 0.322-0.261 0.583-0.583 0.583z"}},{"tag":"path","attr":{"d":"M5.902 5.24c-0.302 0-0.596-0.157-0.758-0.437l-1.399-2.423c-0.241-0.418-0.098-0.953 0.32-1.194s0.953-0.098 1.194 0.32l1.399 2.423c0.241 0.418 0.098 0.953-0.32 1.194-0.138 0.079-0.288 0.117-0.436 0.117z"}},{"tag":"path","attr":{"d":"M11.498 14.582c-0.181 0-0.358-0.094-0.455-0.262l-1.399-2.423c-0.145-0.251-0.059-0.572 0.192-0.717s0.572-0.059 0.717 0.192l1.399 2.423c0.145 0.251 0.059 0.572-0.192 0.717-0.083 0.048-0.173 0.070-0.262 0.070z"}},{"tag":"path","attr":{"d":"M4.365 6.718c-0.138 0-0.279-0.035-0.407-0.109l-2.423-1.399c-0.39-0.225-0.524-0.724-0.299-1.115s0.724-0.524 1.115-0.299l2.423 1.399c0.39 0.225 0.524 0.724 0.299 1.115-0.151 0.262-0.425 0.408-0.707 0.408z"}},{"tag":"path","attr":{"d":"M14.057 11.964c-0.079 0-0.159-0.020-0.233-0.063l-2.423-1.399c-0.223-0.129-0.299-0.414-0.171-0.637s0.414-0.299 0.637-0.171l2.423 1.399c0.223 0.129 0.299 0.414 0.171 0.637-0.086 0.15-0.243 0.233-0.404 0.233z"}},{"tag":"path","attr":{"d":"M3.803 8.758h-2.798c-0.418 0-0.758-0.339-0.758-0.758s0.339-0.758 0.758-0.758h2.798c0.419 0 0.758 0.339 0.758 0.758s-0.339 0.758-0.758 0.758z"}},{"tag":"path","attr":{"d":"M14.995 8.466c-0 0 0 0 0 0h-2.798c-0.258-0-0.466-0.209-0.466-0.466s0.209-0.466 0.466-0.466c0 0 0 0 0 0h2.798c0.258 0 0.466 0.209 0.466 0.466s-0.209 0.466-0.466 0.466z"}},{"tag":"path","attr":{"d":"M1.943 12.197c-0.242 0-0.477-0.125-0.606-0.35-0.193-0.335-0.079-0.762 0.256-0.955l2.423-1.399c0.335-0.193 0.762-0.079 0.955 0.256s0.079 0.762-0.256 0.955l-2.423 1.399c-0.11 0.064-0.23 0.094-0.349 0.094z"}},{"tag":"path","attr":{"d":"M11.635 6.368c-0.161 0-0.318-0.084-0.404-0.233-0.129-0.223-0.052-0.508 0.171-0.637l2.423-1.399c0.223-0.129 0.508-0.052 0.637 0.171s0.052 0.508-0.171 0.637l-2.423 1.399c-0.073 0.042-0.154 0.063-0.233 0.063z"}},{"tag":"path","attr":{"d":"M4.502 14.699c-0.109 0-0.219-0.028-0.32-0.086-0.307-0.177-0.412-0.569-0.235-0.876l1.399-2.423c0.177-0.307 0.569-0.412 0.876-0.235s0.412 0.569 0.235 0.876l-1.399 2.423c-0.119 0.206-0.334 0.321-0.556 0.321z"}},{"tag":"path","attr":{"d":"M10.098 4.832c-0.079 0-0.159-0.020-0.233-0.063-0.223-0.129-0.299-0.414-0.171-0.637l1.399-2.423c0.129-0.223 0.414-0.299 0.637-0.171s0.299 0.414 0.171 0.637l-1.399 2.423c-0.086 0.15-0.243 0.233-0.404 0.233z"}}]})(props);
};
function ImSpinner4 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3 8c0-0.19 0.011-0.378 0.032-0.563l-2.89-0.939c-0.092 0.487-0.141 0.989-0.141 1.502 0 2.3 0.971 4.374 2.526 5.833l1.786-2.458c-0.814-0.889-1.312-2.074-1.312-3.375zM13 8c0 1.301-0.497 2.486-1.312 3.375l1.786 2.458c1.555-1.459 2.526-3.533 2.526-5.833 0-0.513-0.049-1.015-0.141-1.502l-2.89 0.939c0.021 0.185 0.032 0.373 0.032 0.563zM9 3.1c1.436 0.292 2.649 1.199 3.351 2.435l2.89-0.939c-1.144-2.428-3.473-4.188-6.241-4.534v3.038zM3.649 5.535c0.702-1.236 1.914-2.143 3.351-2.435v-3.038c-2.769 0.345-5.097 2.105-6.241 4.534l2.89 0.939zM10.071 12.552c-0.631 0.288-1.332 0.448-2.071 0.448s-1.44-0.16-2.071-0.448l-1.786 2.458c1.144 0.631 2.458 0.99 3.857 0.99s2.713-0.359 3.857-0.99l-1.786-2.458z"}}]})(props);
};
function ImSpinner5 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 4c2.209 0 4 1.791 4 4s-1.791 4-4 4-4-1.791-4-4 1.791-4 4-4zM12.773 12.773c-1.275 1.275-2.97 1.977-4.773 1.977s-3.498-0.702-4.773-1.977-1.977-2.97-1.977-4.773c0-1.803 0.702-3.498 1.977-4.773l1.061 1.061c0 0 0 0 0 0-2.047 2.047-2.047 5.378 0 7.425 0.992 0.992 2.31 1.538 3.712 1.538s2.721-0.546 3.712-1.538c2.047-2.047 2.047-5.378 0-7.425l1.061-1.061c1.275 1.275 1.977 2.97 1.977 4.773s-0.702 3.498-1.977 4.773z"}}]})(props);
};
function ImSpinner6 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 2c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM12.359 8c0 0 0 0 0 0 0-0.906 0.735-1.641 1.641-1.641s1.641 0.735 1.641 1.641c0 0 0 0 0 0 0 0.906-0.735 1.641-1.641 1.641s-1.641-0.735-1.641-1.641zM10.757 12.243c0-0.821 0.665-1.486 1.486-1.486s1.486 0.665 1.486 1.486c0 0.821-0.665 1.486-1.486 1.486s-1.486-0.665-1.486-1.486zM6.654 14c0-0.743 0.603-1.346 1.346-1.346s1.346 0.603 1.346 1.346c0 0.743-0.603 1.346-1.346 1.346s-1.346-0.603-1.346-1.346zM2.538 12.243c0-0.673 0.546-1.219 1.219-1.219s1.219 0.546 1.219 1.219c0 0.673-0.546 1.219-1.219 1.219s-1.219-0.546-1.219-1.219zM0.896 8c0-0.61 0.494-1.104 1.104-1.104s1.104 0.494 1.104 1.104c0 0.61-0.494 1.104-1.104 1.104s-1.104-0.494-1.104-1.104zM2.757 3.757c0 0 0 0 0 0 0-0.552 0.448-1 1-1s1 0.448 1 1c0 0 0 0 0 0 0 0.552-0.448 1-1 1s-1-0.448-1-1zM14.054 3.757c0 1-0.811 1.811-1.812 1.811s-1.812-0.811-1.812-1.811c0-1.001 0.811-1.811 1.812-1.811s1.812 0.811 1.812 1.811z"}}]})(props);
};
function ImSpinner7 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.5 14.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5zM0 8c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5zM13 8c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5zM1.904 3.404c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5zM11.096 12.596c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5zM1.904 12.596c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5zM11.096 3.404c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5z"}}]})(props);
};
function ImSpinner8 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c-2.137 0-4.146-0.832-5.657-2.343s-2.343-3.52-2.343-5.657c0-1.513 0.425-2.986 1.228-4.261 0.781-1.239 1.885-2.24 3.193-2.895l0.672 1.341c-1.063 0.533-1.961 1.347-2.596 2.354-0.652 1.034-0.997 2.231-0.997 3.461 0 3.584 2.916 6.5 6.5 6.5s6.5-2.916 6.5-6.5c0-1.23-0.345-2.426-0.997-3.461-0.635-1.008-1.533-1.822-2.596-2.354l0.672-1.341c1.308 0.655 2.412 1.656 3.193 2.895 0.803 1.274 1.228 2.748 1.228 4.261 0 2.137-0.832 4.146-2.343 5.657s-3.52 2.343-5.657 2.343z"}}]})(props);
};
function ImSpinner9 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.355 0-7.898 3.481-7.998 7.812 0.092-3.779 2.966-6.812 6.498-6.812 3.59 0 6.5 3.134 6.5 7 0 0.828 0.672 1.5 1.5 1.5s1.5-0.672 1.5-1.5c0-4.418-3.582-8-8-8zM8 16c4.355 0 7.898-3.481 7.998-7.812-0.092 3.779-2.966 6.812-6.498 6.812-3.59 0-6.5-3.134-6.5-7 0-0.828-0.672-1.5-1.5-1.5s-1.5 0.672-1.5 1.5c0 4.418 3.582 8 8 8z"}}]})(props);
};
function ImSpinner10 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0.001 8.025l-0 0c0 0 0 0.001 0 0.003 0.002 0.061 0.009 0.12 0.021 0.177 0.003 0.027 0.007 0.057 0.011 0.090 0.003 0.029 0.007 0.061 0.011 0.095 0.006 0.040 0.012 0.083 0.019 0.128 0.013 0.090 0.028 0.189 0.045 0.296 0.021 0.101 0.044 0.21 0.068 0.326 0.011 0.058 0.028 0.117 0.044 0.178s0.032 0.123 0.049 0.188c0.009 0.032 0.016 0.065 0.027 0.097s0.021 0.065 0.031 0.098 0.043 0.134 0.065 0.203c0.006 0.017 0.011 0.035 0.017 0.052s0.013 0.034 0.019 0.052 0.026 0.070 0.039 0.105c0.027 0.070 0.053 0.142 0.081 0.215 0.031 0.071 0.062 0.144 0.094 0.218 0.016 0.037 0.032 0.074 0.048 0.111s0.035 0.073 0.053 0.111 0.073 0.148 0.11 0.224c0.039 0.075 0.081 0.149 0.123 0.224 0.021 0.037 0.042 0.075 0.063 0.113s0.045 0.074 0.068 0.112 0.093 0.149 0.14 0.224c0.198 0.295 0.417 0.587 0.66 0.864 0.245 0.275 0.511 0.535 0.792 0.775 0.284 0.236 0.582 0.452 0.886 0.642 0.306 0.188 0.619 0.349 0.928 0.487 0.078 0.032 0.156 0.063 0.232 0.095 0.038 0.015 0.076 0.032 0.115 0.046s0.077 0.027 0.115 0.041 0.151 0.054 0.226 0.078c0.075 0.022 0.15 0.044 0.224 0.066 0.037 0.011 0.073 0.022 0.109 0.031s0.073 0.018 0.109 0.027 0.143 0.035 0.213 0.052c0.070 0.014 0.139 0.027 0.207 0.040 0.034 0.006 0.067 0.013 0.101 0.019 0.017 0.003 0.033 0.006 0.049 0.009s0.033 0.005 0.049 0.007c0.066 0.009 0.13 0.018 0.192 0.027 0.031 0.004 0.062 0.009 0.093 0.013s0.061 0.006 0.091 0.009 0.118 0.010 0.174 0.015c0.056 0.005 0.111 0.011 0.164 0.012 0.004 0 0.007 0 0.011 0 0.010 0.544 0.453 0.982 1 0.982 0.008 0 0.017-0 0.025-0.001v0c0 0 0.001-0 0.004-0 0.061-0.002 0.12-0.009 0.177-0.021 0.027-0.003 0.057-0.007 0.090-0.011 0.029-0.003 0.061-0.007 0.095-0.011 0.040-0.006 0.083-0.012 0.128-0.019 0.090-0.013 0.189-0.028 0.296-0.045 0.101-0.021 0.21-0.044 0.326-0.068 0.058-0.011 0.117-0.028 0.178-0.044s0.123-0.033 0.188-0.049c0.032-0.009 0.065-0.016 0.097-0.027s0.065-0.021 0.098-0.031 0.134-0.043 0.203-0.065c0.017-0.006 0.035-0.011 0.052-0.017s0.034-0.013 0.052-0.019 0.070-0.026 0.105-0.039c0.070-0.027 0.142-0.053 0.215-0.081 0.071-0.031 0.144-0.062 0.218-0.094 0.037-0.016 0.074-0.032 0.111-0.048s0.073-0.035 0.111-0.053 0.148-0.073 0.224-0.11c0.075-0.039 0.149-0.081 0.224-0.123 0.037-0.021 0.075-0.042 0.113-0.063s0.074-0.045 0.112-0.068 0.149-0.093 0.224-0.14c0.295-0.197 0.587-0.417 0.864-0.66 0.275-0.245 0.535-0.511 0.775-0.792 0.236-0.284 0.452-0.582 0.642-0.886 0.188-0.306 0.349-0.619 0.487-0.928 0.032-0.078 0.063-0.156 0.095-0.232 0.015-0.038 0.032-0.076 0.046-0.115s0.027-0.077 0.040-0.115 0.054-0.151 0.078-0.226c0.022-0.075 0.044-0.15 0.066-0.224 0.011-0.037 0.022-0.073 0.031-0.109s0.018-0.073 0.027-0.109 0.035-0.143 0.052-0.213c0.014-0.070 0.027-0.139 0.040-0.207 0.006-0.034 0.013-0.067 0.019-0.101 0.003-0.017 0.006-0.033 0.009-0.049s0.005-0.033 0.007-0.050c0.009-0.065 0.018-0.13 0.027-0.192 0.004-0.031 0.009-0.062 0.013-0.093s0.006-0.061 0.009-0.091 0.010-0.118 0.015-0.174c0.005-0.056 0.011-0.111 0.012-0.165 0-0.008 0.001-0.016 0.001-0.025 0.55-0.002 0.996-0.449 0.996-1 0-0.008-0-0.017-0.001-0.025h0c0 0-0-0.001-0-0.003-0.002-0.061-0.009-0.12-0.021-0.177-0.003-0.027-0.007-0.057-0.011-0.090-0.003-0.029-0.007-0.061-0.011-0.095-0.006-0.040-0.012-0.083-0.019-0.128-0.013-0.090-0.028-0.189-0.045-0.296-0.021-0.101-0.044-0.21-0.068-0.326-0.011-0.058-0.028-0.117-0.044-0.178s-0.032-0.123-0.049-0.188c-0.009-0.032-0.016-0.065-0.027-0.097s-0.021-0.065-0.031-0.098-0.043-0.134-0.065-0.203c-0.005-0.017-0.011-0.035-0.017-0.052s-0.013-0.034-0.019-0.052-0.026-0.070-0.039-0.105c-0.027-0.070-0.053-0.142-0.081-0.215-0.031-0.071-0.062-0.144-0.094-0.218-0.016-0.037-0.032-0.074-0.048-0.111s-0.035-0.073-0.053-0.111-0.073-0.148-0.11-0.224c-0.039-0.075-0.081-0.149-0.123-0.224-0.021-0.037-0.042-0.075-0.063-0.113s-0.045-0.074-0.068-0.112-0.093-0.149-0.14-0.224c-0.197-0.295-0.417-0.587-0.66-0.864-0.245-0.275-0.511-0.535-0.792-0.775-0.284-0.236-0.582-0.452-0.886-0.642-0.306-0.188-0.619-0.349-0.928-0.487-0.078-0.032-0.156-0.063-0.232-0.095-0.038-0.015-0.076-0.032-0.115-0.046s-0.077-0.027-0.115-0.040-0.151-0.054-0.226-0.078c-0.075-0.022-0.15-0.044-0.224-0.066-0.037-0.010-0.073-0.022-0.109-0.031s-0.073-0.018-0.109-0.027-0.143-0.035-0.213-0.052c-0.070-0.014-0.139-0.027-0.207-0.040-0.034-0.006-0.067-0.013-0.101-0.019-0.017-0.003-0.033-0.006-0.049-0.009s-0.033-0.005-0.049-0.007c-0.066-0.009-0.13-0.018-0.192-0.027-0.031-0.004-0.062-0.009-0.093-0.013s-0.061-0.006-0.091-0.009-0.118-0.010-0.174-0.015c-0.056-0.005-0.111-0.011-0.164-0.012-0.013-0-0.026-0.001-0.039-0.001-0.010-0.543-0.454-0.981-0.999-0.981-0.008 0-0.017 0-0.025 0.001l-0-0c0 0-0.001 0-0.003 0-0.061 0.002-0.12 0.009-0.177 0.021-0.027 0.003-0.057 0.007-0.090 0.011-0.029 0.003-0.061 0.007-0.095 0.011-0.040 0.006-0.083 0.012-0.128 0.019-0.090 0.013-0.189 0.028-0.296 0.045-0.101 0.021-0.21 0.044-0.326 0.068-0.058 0.011-0.117 0.028-0.178 0.044s-0.123 0.033-0.188 0.049c-0.032 0.009-0.065 0.016-0.097 0.027s-0.065 0.021-0.098 0.031-0.134 0.043-0.203 0.065c-0.017 0.006-0.035 0.011-0.052 0.017s-0.034 0.013-0.052 0.019-0.070 0.026-0.105 0.039c-0.070 0.027-0.142 0.053-0.215 0.081-0.071 0.031-0.144 0.062-0.218 0.094-0.037 0.016-0.074 0.032-0.111 0.048s-0.073 0.035-0.111 0.053-0.148 0.073-0.224 0.11c-0.075 0.039-0.149 0.081-0.224 0.123-0.037 0.021-0.075 0.042-0.113 0.063s-0.074 0.045-0.112 0.068-0.149 0.093-0.224 0.14c-0.295 0.198-0.587 0.417-0.864 0.66-0.275 0.245-0.535 0.511-0.775 0.792-0.236 0.284-0.452 0.582-0.642 0.886-0.188 0.306-0.349 0.619-0.487 0.928-0.032 0.078-0.063 0.156-0.095 0.232-0.015 0.038-0.032 0.076-0.046 0.115s-0.027 0.077-0.040 0.115-0.054 0.151-0.078 0.226c-0.022 0.075-0.044 0.15-0.066 0.224-0.011 0.037-0.022 0.073-0.032 0.109s-0.018 0.073-0.027 0.109-0.035 0.143-0.052 0.213c-0.014 0.070-0.027 0.139-0.040 0.207-0.006 0.034-0.013 0.067-0.019 0.101-0.003 0.017-0.006 0.033-0.009 0.049s-0.005 0.033-0.007 0.050c-0.009 0.065-0.018 0.13-0.027 0.192-0.004 0.031-0.009 0.062-0.013 0.093s-0.006 0.061-0.009 0.091-0.010 0.118-0.015 0.174c-0.005 0.056-0.011 0.111-0.012 0.165-0 0.009-0.001 0.017-0.001 0.025-0.537 0.017-0.967 0.458-0.967 0.999 0 0.008 0 0.017 0.001 0.025zM1.149 7.011c0.001-0.003 0.001-0.006 0.002-0.009 0.010-0.051 0.026-0.102 0.040-0.155s0.030-0.107 0.045-0.163c0.008-0.028 0.015-0.056 0.024-0.084s0.019-0.057 0.028-0.086 0.038-0.116 0.058-0.176c0.005-0.015 0.010-0.030 0.015-0.045s0.012-0.030 0.017-0.045 0.023-0.060 0.035-0.091 0.048-0.123 0.073-0.186c0.028-0.062 0.056-0.125 0.084-0.189 0.014-0.032 0.028-0.064 0.043-0.096s0.032-0.064 0.048-0.096 0.065-0.128 0.098-0.194c0.034-0.065 0.073-0.128 0.109-0.194 0.018-0.032 0.037-0.065 0.056-0.098s0.040-0.064 0.061-0.096c0.041-0.064 0.082-0.129 0.124-0.194 0.176-0.255 0.369-0.506 0.583-0.744 0.217-0.236 0.451-0.459 0.697-0.665 0.25-0.202 0.511-0.385 0.776-0.547 0.268-0.159 0.541-0.294 0.808-0.41 0.068-0.027 0.135-0.053 0.202-0.079 0.033-0.013 0.066-0.027 0.099-0.038s0.067-0.022 0.1-0.033 0.131-0.045 0.196-0.065c0.065-0.018 0.13-0.036 0.194-0.054 0.032-0.009 0.063-0.019 0.095-0.026s0.063-0.014 0.094-0.021 0.123-0.028 0.184-0.042c0.061-0.011 0.12-0.021 0.179-0.032 0.029-0.005 0.058-0.010 0.087-0.015 0.014-0.003 0.029-0.005 0.043-0.008s0.029-0.003 0.043-0.005c0.056-0.007 0.112-0.014 0.166-0.020 0.027-0.003 0.053-0.007 0.080-0.010s0.053-0.004 0.078-0.006 0.102-0.007 0.15-0.011c0.049-0.003 0.095-0.008 0.142-0.008 0.091-0.002 0.177-0.004 0.256-0.006 0.073 0.003 0.14 0.005 0.2 0.007 0.030 0.001 0.058 0.002 0.085 0.002 0.033 0.002 0.064 0.004 0.093 0.006 0.033 0.002 0.063 0.004 0.091 0.006 0.051 0.008 0.103 0.012 0.156 0.012 0.007 0 0.015-0 0.022-0.001 0.002 0 0.004 0 0.004 0v-0c0.487-0.012 0.887-0.372 0.962-0.84 0.008 0.002 0.017 0.004 0.025 0.006 0.051 0.010 0.102 0.026 0.155 0.040s0.107 0.030 0.163 0.045c0.028 0.008 0.056 0.015 0.084 0.024s0.057 0.019 0.086 0.028 0.116 0.038 0.176 0.058c0.015 0.005 0.030 0.010 0.045 0.015s0.030 0.012 0.045 0.017 0.060 0.023 0.091 0.035 0.123 0.048 0.186 0.073c0.062 0.028 0.125 0.056 0.189 0.084 0.032 0.014 0.064 0.028 0.096 0.043s0.064 0.032 0.096 0.048 0.128 0.065 0.194 0.098c0.065 0.034 0.129 0.073 0.194 0.109 0.032 0.018 0.065 0.037 0.098 0.056s0.064 0.040 0.096 0.061 0.129 0.082 0.194 0.124c0.255 0.176 0.506 0.369 0.744 0.583 0.236 0.217 0.459 0.451 0.665 0.697 0.202 0.25 0.385 0.511 0.547 0.776 0.159 0.268 0.294 0.541 0.41 0.808 0.027 0.068 0.053 0.135 0.079 0.202 0.013 0.033 0.027 0.066 0.038 0.099s0.022 0.067 0.033 0.1 0.045 0.131 0.065 0.196c0.018 0.065 0.036 0.13 0.054 0.194 0.009 0.032 0.019 0.063 0.026 0.095s0.014 0.063 0.021 0.094 0.028 0.123 0.042 0.184c0.011 0.061 0.021 0.12 0.032 0.179 0.005 0.029 0.010 0.058 0.015 0.087 0.003 0.014 0.005 0.029 0.008 0.043s0.003 0.029 0.005 0.043c0.007 0.056 0.014 0.112 0.020 0.166 0.003 0.027 0.007 0.053 0.010 0.080s0.004 0.053 0.006 0.078 0.007 0.102 0.011 0.15c0.003 0.049 0.008 0.095 0.008 0.142 0.002 0.091 0.004 0.177 0.006 0.256-0.003 0.073-0.005 0.14-0.007 0.2-0.001 0.030-0.002 0.058-0.002 0.085-0.002 0.033-0.004 0.064-0.006 0.093-0.002 0.033-0.004 0.063-0.006 0.091-0.008 0.051-0.012 0.103-0.012 0.156 0 0.007 0 0.015 0.001 0.022-0 0.002-0 0.004-0 0.004h0c0.012 0.481 0.363 0.877 0.823 0.959-0.001 0.005-0.002 0.009-0.003 0.014-0.010 0.051-0.025 0.102-0.040 0.155s-0.030 0.107-0.045 0.163c-0.008 0.028-0.015 0.056-0.024 0.084s-0.019 0.057-0.028 0.086-0.039 0.116-0.058 0.176c-0.005 0.015-0.010 0.030-0.015 0.045s-0.012 0.030-0.017 0.045-0.023 0.060-0.035 0.091-0.048 0.123-0.073 0.186c-0.028 0.062-0.056 0.125-0.084 0.189-0.014 0.032-0.028 0.064-0.043 0.096s-0.032 0.064-0.048 0.096-0.065 0.128-0.098 0.194c-0.034 0.065-0.073 0.129-0.109 0.194-0.018 0.032-0.037 0.065-0.056 0.098s-0.040 0.064-0.061 0.096-0.082 0.129-0.124 0.194c-0.176 0.255-0.369 0.506-0.583 0.744-0.217 0.236-0.451 0.459-0.697 0.665-0.25 0.202-0.511 0.385-0.776 0.547-0.268 0.159-0.541 0.294-0.808 0.41-0.068 0.027-0.135 0.053-0.202 0.079-0.033 0.013-0.066 0.027-0.099 0.038s-0.067 0.022-0.1 0.033-0.131 0.045-0.196 0.065c-0.065 0.018-0.13 0.036-0.194 0.054-0.032 0.009-0.063 0.019-0.095 0.026s-0.063 0.014-0.094 0.021-0.123 0.028-0.184 0.042c-0.061 0.011-0.12 0.021-0.179 0.032-0.029 0.005-0.058 0.010-0.087 0.015-0.014 0.003-0.028 0.005-0.043 0.008s-0.029 0.003-0.043 0.005c-0.056 0.007-0.112 0.014-0.166 0.020-0.027 0.003-0.053 0.007-0.080 0.010s-0.053 0.004-0.078 0.006-0.102 0.007-0.15 0.011c-0.049 0.003-0.095 0.008-0.142 0.008-0.091 0.002-0.177 0.004-0.256 0.006-0.073-0.003-0.14-0.005-0.2-0.007-0.030-0.001-0.058-0.002-0.085-0.002-0.033-0.002-0.064-0.004-0.093-0.006-0.033-0.002-0.063-0.004-0.091-0.006-0.051-0.008-0.103-0.012-0.156-0.012-0.007 0-0.015 0-0.022 0.001-0.002-0-0.003-0-0.003-0v0c-0.484 0.012-0.883 0.369-0.961 0.834-0.050-0.010-0.101-0.025-0.153-0.039s-0.107-0.030-0.163-0.045c-0.028-0.008-0.056-0.015-0.084-0.024s-0.057-0.019-0.086-0.028-0.116-0.039-0.176-0.058c-0.015-0.005-0.030-0.010-0.045-0.015s-0.030-0.012-0.045-0.017-0.060-0.023-0.091-0.035-0.123-0.048-0.186-0.073c-0.062-0.028-0.125-0.056-0.189-0.084-0.032-0.014-0.064-0.028-0.096-0.043s-0.064-0.032-0.096-0.048-0.128-0.065-0.194-0.098c-0.065-0.034-0.129-0.073-0.194-0.109-0.032-0.018-0.065-0.037-0.098-0.056s-0.064-0.040-0.096-0.061c-0.064-0.041-0.129-0.082-0.194-0.124-0.255-0.175-0.506-0.369-0.744-0.583-0.236-0.217-0.459-0.451-0.665-0.697-0.202-0.25-0.385-0.511-0.547-0.776-0.159-0.268-0.294-0.541-0.41-0.808-0.027-0.068-0.053-0.135-0.079-0.202-0.013-0.033-0.027-0.066-0.038-0.099s-0.022-0.067-0.033-0.1-0.045-0.131-0.065-0.196c-0.018-0.065-0.036-0.13-0.054-0.194-0.009-0.032-0.019-0.063-0.026-0.095s-0.014-0.063-0.021-0.094-0.028-0.123-0.042-0.184c-0.011-0.061-0.021-0.12-0.032-0.179-0.005-0.029-0.010-0.058-0.015-0.087-0.003-0.014-0.005-0.028-0.008-0.043s-0.003-0.029-0.005-0.043c-0.007-0.056-0.014-0.112-0.020-0.166-0.003-0.027-0.007-0.053-0.010-0.080s-0.004-0.053-0.006-0.078-0.007-0.101-0.011-0.15c-0.003-0.049-0.008-0.095-0.008-0.142-0.002-0.091-0.004-0.177-0.006-0.256 0.003-0.073 0.005-0.14 0.007-0.2 0.001-0.030 0.002-0.058 0.002-0.085 0.002-0.033 0.004-0.064 0.006-0.093 0.002-0.033 0.004-0.063 0.006-0.091 0.008-0.051 0.012-0.103 0.012-0.156 0-0.007-0-0.015-0.001-0.022 0-0.002 0-0.003 0-0.003h-0c-0.012-0.49-0.377-0.893-0.851-0.964z"}}]})(props);
};
function ImSpinner11 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 6h-6l2.243-2.243c-1.133-1.133-2.64-1.757-4.243-1.757s-3.109 0.624-4.243 1.757c-1.133 1.133-1.757 2.64-1.757 4.243s0.624 3.109 1.757 4.243c1.133 1.133 2.64 1.757 4.243 1.757s3.109-0.624 4.243-1.757c0.095-0.095 0.185-0.192 0.273-0.292l1.505 1.317c-1.466 1.674-3.62 2.732-6.020 2.732-4.418 0-8-3.582-8-8s3.582-8 8-8c2.209 0 4.209 0.896 5.656 2.344l2.343-2.344v6z"}}]})(props);
};
function ImBinoculars (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M1 0h6v1h-6zM9 0h6v1h-6zM14.875 5h-0.875v-4h-4v4h-4v-4h-4v4h-0.875c-0.619 0-1.125 0.506-1.125 1.125v8.75c0 0.619 0.506 1.125 1.125 1.125h4.75c0.619 0 1.125-0.506 1.125-1.125v-5.875h2v5.875c0 0.619 0.506 1.125 1.125 1.125h4.75c0.619 0 1.125-0.506 1.125-1.125v-8.75c0-0.619-0.506-1.125-1.125-1.125zM5.438 15h-3.875c-0.309 0-0.563-0.225-0.563-0.5s0.253-0.5 0.563-0.5h3.875c0.309 0 0.563 0.225 0.563 0.5s-0.253 0.5-0.563 0.5zM8.5 8h-1c-0.275 0-0.5-0.225-0.5-0.5s0.225-0.5 0.5-0.5h1c0.275 0 0.5 0.225 0.5 0.5s-0.225 0.5-0.5 0.5zM14.438 15h-3.875c-0.309 0-0.563-0.225-0.563-0.5s0.253-0.5 0.563-0.5h3.875c0.309 0 0.563 0.225 0.563 0.5s-0.253 0.5-0.563 0.5z"}}]})(props);
};
function ImSearch (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.504 13.616l-3.79-3.223c-0.392-0.353-0.811-0.514-1.149-0.499 0.895-1.048 1.435-2.407 1.435-3.893 0-3.314-2.686-6-6-6s-6 2.686-6 6 2.686 6 6 6c1.486 0 2.845-0.54 3.893-1.435-0.016 0.338 0.146 0.757 0.499 1.149l3.223 3.79c0.552 0.613 1.453 0.665 2.003 0.115s0.498-1.452-0.115-2.003zM6 10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"}}]})(props);
};
function ImZoomIn (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.504 13.616l-3.79-3.223c-0.392-0.353-0.811-0.514-1.149-0.499 0.895-1.048 1.435-2.407 1.435-3.893 0-3.314-2.686-6-6-6s-6 2.686-6 6 2.686 6 6 6c1.486 0 2.845-0.54 3.893-1.435-0.016 0.338 0.146 0.757 0.499 1.149l3.223 3.79c0.552 0.613 1.453 0.665 2.003 0.115s0.498-1.452-0.115-2.003zM6 10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zM7 3h-2v2h-2v2h2v2h2v-2h2v-2h-2z"}}]})(props);
};
function ImZoomOut (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.504 13.616l-3.79-3.223c-0.392-0.353-0.811-0.514-1.149-0.499 0.895-1.048 1.435-2.407 1.435-3.893 0-3.314-2.686-6-6-6s-6 2.686-6 6 2.686 6 6 6c1.486 0 2.845-0.54 3.893-1.435-0.016 0.338 0.146 0.757 0.499 1.149l3.223 3.79c0.552 0.613 1.453 0.665 2.003 0.115s0.498-1.452-0.115-2.003zM6 10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zM3 5h6v2h-6z"}}]})(props);
};
function ImEnlarge (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 0h-6.5l2.5 2.5-3 3 1.5 1.5 3-3 2.5 2.5z"}},{"tag":"path","attr":{"d":"M16 16v-6.5l-2.5 2.5-3-3-1.5 1.5 3 3-2.5 2.5z"}},{"tag":"path","attr":{"d":"M0 16h6.5l-2.5-2.5 3-3-1.5-1.5-3 3-2.5-2.5z"}},{"tag":"path","attr":{"d":"M0 0v6.5l2.5-2.5 3 3 1.5-1.5-3-3 2.5-2.5z"}}]})(props);
};
function ImShrink (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9 7h6.5l-2.5-2.5 3-3-1.5-1.5-3 3-2.5-2.5z"}},{"tag":"path","attr":{"d":"M9 9v6.5l2.5-2.5 3 3 1.5-1.5-3-3 2.5-2.5z"}},{"tag":"path","attr":{"d":"M7 9h-6.5l2.5 2.5-3 3 1.5 1.5 3-3 2.5 2.5z"}},{"tag":"path","attr":{"d":"M7 7v-6.5l-2.5 2.5-3-3-1.5 1.5 3 3-2.5 2.5z"}}]})(props);
};
function ImEnlarge2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 0v6.5l-2.5-2.5-3 3-1.5-1.5 3-3-2.5-2.5zM7 10.5l-3 3 2.5 2.5h-6.5v-6.5l2.5 2.5 3-3z"}}]})(props);
};
function ImShrink2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7 9v6.5l-2.5-2.5-3 3-1.5-1.5 3-3-2.5-2.5zM16 1.5l-3 3 2.5 2.5h-6.5v-6.5l2.5 2.5 3-3z"}}]})(props);
};
function ImKey (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11 0c-2.761 0-5 2.239-5 5 0 0.313 0.029 0.619 0.084 0.916l-6.084 6.084v3c0 0.552 0.448 1 1 1h1v-1h2v-2h2v-2h2l1.298-1.298c0.531 0.192 1.105 0.298 1.702 0.298 2.761 0 5-2.239 5-5s-2.239-5-5-5zM12.498 5.002c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5-0.672 1.5-1.5 1.5z"}}]})(props);
};
function ImKey2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.658 4.91l-1.58-1.58c-0.387-0.387-1.021-1.021-1.409-1.409l-1.58-1.58c-0.387-0.387-1.077-0.456-1.533-0.152l-4.319 2.88c-0.456 0.304-0.628 0.954-0.383 1.444l1.101 2.203c0.034 0.067 0.073 0.139 0.115 0.213l-5.571 5.571-0.5 3.5h3v-1h2v-2h2v-2h2v-1.112c0.1 0.060 0.196 0.113 0.284 0.157l2.203 1.101c0.49 0.245 1.14 0.072 1.444-0.383l2.88-4.319c0.304-0.456 0.236-1.146-0.152-1.533zM2.354 13.354l-0.707-0.707 4.868-4.868 0.707 0.707-4.868 4.868zM14.328 6.621l-0.707 0.707c-0.194 0.194-0.513 0.194-0.707 0l-4.243-4.243c-0.194-0.194-0.194-0.513 0-0.707l0.707-0.707c0.194-0.194 0.513-0.194 0.707 0l4.243 4.243c0.194 0.194 0.194 0.513 0 0.707z"}}]})(props);
};
function ImLock (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9.25 7h-0.25v-3c0-1.654-1.346-3-3-3h-2c-1.654 0-3 1.346-3 3v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v7.5c0 0.412 0.338 0.75 0.75 0.75h8.5c0.412 0 0.75-0.338 0.75-0.75v-7.5c0-0.412-0.338-0.75-0.75-0.75zM3 4c0-0.551 0.449-1 1-1h2c0.551 0 1 0.449 1 1v3h-4v-3z"}}]})(props);
};
function ImUnlocked (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12 1c1.654 0 3 1.346 3 3v3h-2v-3c0-0.551-0.449-1-1-1h-2c-0.551 0-1 0.449-1 1v3h0.25c0.412 0 0.75 0.338 0.75 0.75v7.5c0 0.412-0.338 0.75-0.75 0.75h-8.5c-0.412 0-0.75-0.338-0.75-0.75v-7.5c0-0.412 0.338-0.75 0.75-0.75h6.25v-3c0-1.654 1.346-3 3-3h2z"}}]})(props);
};
function ImWrench (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.671 12.779l-7.196-6.168c0.335-0.63 0.525-1.348 0.525-2.111 0-2.485-2.015-4.5-4.5-4.5-0.455 0-0.893 0.068-1.307 0.193l2.6 2.6c0.389 0.389 0.389 1.025 0 1.414l-1.586 1.586c-0.389 0.389-1.025 0.389-1.414 0l-2.6-2.6c-0.125 0.414-0.193 0.852-0.193 1.307 0 2.485 2.015 4.5 4.5 4.5 0.763 0 1.482-0.19 2.111-0.525l6.168 7.196c0.358 0.418 0.969 0.441 1.358 0.052l1.586-1.586c0.389-0.389 0.365-1-0.052-1.358z"}}]})(props);
};
function ImEqualizer (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7 2v-0.25c0-0.413-0.338-0.75-0.75-0.75h-2.5c-0.413 0-0.75 0.337-0.75 0.75v0.25h-3v2h3v0.25c0 0.412 0.337 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-0.25h9v-2h-9zM4 4v-2h2v2h-2zM13 6.75c0-0.412-0.338-0.75-0.75-0.75h-2.5c-0.412 0-0.75 0.338-0.75 0.75v0.25h-9v2h9v0.25c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-0.25h3v-2h-3v-0.25zM10 9v-2h2v2h-2zM7 11.75c0-0.412-0.338-0.75-0.75-0.75h-2.5c-0.413 0-0.75 0.338-0.75 0.75v0.25h-3v2h3v0.25c0 0.412 0.337 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-0.25h9v-2h-9v-0.25zM4 14v-2h2v2h-2z"}}]})(props);
};
function ImEqualizer2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 7h0.25c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.413-0.338-0.75-0.75-0.75h-0.25v-3h-2v3h-0.25c-0.412 0-0.75 0.337-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h0.25v9h2v-9zM12 4h2v2h-2v-2zM9.25 13c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75h-0.25v-9h-2v9h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h0.25v3h2v-3h0.25zM7 10h2v2h-2v-2zM4.25 7c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.413-0.338-0.75-0.75-0.75h-0.25v-3h-2v3h-0.25c-0.413 0-0.75 0.337-0.75 0.75v2.5c0 0.412 0.337 0.75 0.75 0.75h0.25v9h2v-9h0.25zM2 4h2v2h-2v-2z"}}]})(props);
};
function ImCog (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.59 9.535c-0.839-1.454-0.335-3.317 1.127-4.164l-1.572-2.723c-0.449 0.263-0.972 0.414-1.529 0.414-1.68 0-3.042-1.371-3.042-3.062h-3.145c0.004 0.522-0.126 1.051-0.406 1.535-0.839 1.454-2.706 1.948-4.17 1.106l-1.572 2.723c0.453 0.257 0.845 0.634 1.123 1.117 0.838 1.452 0.336 3.311-1.12 4.16l1.572 2.723c0.448-0.261 0.967-0.41 1.522-0.41 1.675 0 3.033 1.362 3.042 3.046h3.145c-0.001-0.517 0.129-1.040 0.406-1.519 0.838-1.452 2.7-1.947 4.163-1.11l1.572-2.723c-0.45-0.257-0.839-0.633-1.116-1.113zM8 11.24c-1.789 0-3.24-1.45-3.24-3.24s1.45-3.24 3.24-3.24c1.789 0 3.24 1.45 3.24 3.24s-1.45 3.24-3.24 3.24z"}}]})(props);
};
function ImCogs (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5.683 11.282l0.645-0.903-0.707-0.707-0.903 0.645c-0.168-0.094-0.347-0.168-0.535-0.222l-0.183-1.095h-1l-0.183 1.095c-0.188 0.053-0.368 0.128-0.535 0.222l-0.903-0.645-0.707 0.707 0.645 0.903c-0.094 0.168-0.168 0.347-0.222 0.535l-1.095 0.183v1l1.095 0.183c0.053 0.188 0.128 0.368 0.222 0.535l-0.645 0.903 0.707 0.707 0.903-0.645c0.168 0.094 0.347 0.168 0.535 0.222l0.183 1.095h1l0.183-1.095c0.188-0.053 0.368-0.128 0.535-0.222l0.903 0.645 0.707-0.707-0.645-0.903c0.094-0.168 0.168-0.347 0.222-0.535l1.095-0.182v-1l-1.095-0.183c-0.053-0.188-0.128-0.368-0.222-0.535zM3.5 13.5c-0.552 0-1-0.448-1-1s0.448-1 1-1 1 0.448 1 1-0.448 1-1 1zM16 6v-1l-1.053-0.191c-0.019-0.126-0.044-0.25-0.074-0.372l0.899-0.58-0.383-0.924-1.046 0.226c-0.066-0.108-0.136-0.213-0.211-0.315l0.609-0.88-0.707-0.707-0.88 0.609c-0.102-0.074-0.207-0.145-0.315-0.211l0.226-1.046-0.924-0.383-0.58 0.899c-0.122-0.030-0.246-0.054-0.372-0.074l-0.191-1.053h-1l-0.191 1.053c-0.126 0.019-0.25 0.044-0.372 0.074l-0.58-0.899-0.924 0.383 0.226 1.046c-0.108 0.066-0.213 0.136-0.315 0.211l-0.88-0.609-0.707 0.707 0.609 0.88c-0.074 0.102-0.145 0.207-0.211 0.315l-1.046-0.226-0.383 0.924 0.899 0.58c-0.030 0.122-0.054 0.246-0.074 0.372l-1.053 0.191v1l1.053 0.191c0.019 0.126 0.044 0.25 0.074 0.372l-0.899 0.58 0.383 0.924 1.046-0.226c0.066 0.108 0.136 0.213 0.211 0.315l-0.609 0.88 0.707 0.707 0.88-0.609c0.102 0.074 0.207 0.145 0.315 0.211l-0.226 1.046 0.924 0.383 0.58-0.899c0.122 0.030 0.246 0.054 0.372 0.074l0.191 1.053h1l0.191-1.053c0.126-0.019 0.25-0.044 0.372-0.074l0.58 0.899 0.924-0.383-0.226-1.046c0.108-0.066 0.213-0.136 0.315-0.211l0.88 0.609 0.707-0.707-0.609-0.88c0.074-0.102 0.145-0.207 0.211-0.315l1.046 0.226 0.383-0.924-0.899-0.58c0.030-0.122 0.054-0.246 0.074-0.372l1.053-0.191zM10.5 7.675c-1.201 0-2.175-0.974-2.175-2.175s0.974-2.175 2.175-2.175 2.175 0.974 2.175 2.175c0 1.201-0.974 2.175-2.175 2.175z"}}]})(props);
};
function ImHammer (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.781 12.953l-4.712-4.712c-0.292-0.292-0.769-0.292-1.061 0l-0.354 0.354-2.875-2.875 4.72-4.72h-5l-2.22 2.22-0.22-0.22h-1.061v1.061l0.22 0.22-3.22 3.22 2.5 2.5 3.22-3.22 2.875 2.875-0.354 0.354c-0.292 0.292-0.292 0.769 0 1.061l4.712 4.712c0.292 0.292 0.769 0.292 1.061 0l1.768-1.768c0.292-0.292 0.292-0.769 0-1.061z"}}]})(props);
};
function ImMagicWand (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 3l-2-2h-1v1l2 2zM5 0h1v2h-1zM9 5h2v1h-2zM10 2v-1h-1l-2 2 1 1zM0 5h2v1h-2zM5 9h1v2h-1zM1 9v1h1l2-2-1-1zM15.781 13.781l-9.939-9.939c-0.292-0.292-0.769-0.292-1.061 0l-0.939 0.939c-0.292 0.292-0.292 0.769 0 1.061l9.939 9.939c0.292 0.292 0.769 0.292 1.061 0l0.939-0.939c0.292-0.292 0.292-0.769 0-1.061zM7.5 8.5l-3-3 1-1 3 3-1 1z"}}]})(props);
};
function ImAidKit (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 4h-3v-2c0-0.55-0.45-1-1-1h-4c-0.55 0-1 0.45-1 1v2h-3c-1.1 0-2 0.9-2 2v8c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-8c0-1.1-0.9-2-2-2zM6 2h4v2h-4v-2zM12 11h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"}}]})(props);
};
function ImBug (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 9v-1h-3.020c-0.092-1.136-0.497-2.172-1.12-3.004h2.53l1.095-4.379-0.97-0.243-0.905 3.621h-2.729c-0.014-0.011-0.028-0.021-0.042-0.032 0.105-0.305 0.162-0.632 0.162-0.972 0-1.653-1.343-2.992-3-2.992s-3 1.34-3 2.992c0 0.34 0.057 0.667 0.162 0.972-0.014 0.011-0.028 0.021-0.042 0.032h-2.729l-0.905-3.621-0.97 0.243 1.095 4.379h2.53c-0.623 0.832-1.028 1.868-1.12 3.004h-3.020v1h3.021c0.059 0.713 0.242 1.388 0.526 1.996h-1.937l-1.095 4.379 0.97 0.243 0.905-3.621h1.756c0.917 1.219 2.303 1.996 3.854 1.996s2.937-0.777 3.854-1.996h1.756l0.905 3.621 0.97-0.243-1.095-4.379h-1.937c0.283-0.608 0.466-1.283 0.526-1.996h3.021z"}}]})(props);
};
function ImPieChart (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7 9v-7c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7c0-1.126-0.266-2.189-0.738-3.131l-6.262 3.131zM14.262 3.869c-1.149-2.294-3.521-3.869-6.262-3.869v7l6.262-3.131z"}}]})(props);
};
function ImStatsDots (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M2 14h14v2h-16v-16h2zM4.5 13c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5c0.044 0 0.088 0.002 0.131 0.006l1.612-2.687c-0.154-0.235-0.243-0.517-0.243-0.819 0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.302-0.090 0.583-0.243 0.819l1.612 2.687c0.043-0.004 0.087-0.006 0.131-0.006 0.033 0 0.066 0.001 0.099 0.004l2.662-4.658c-0.165-0.241-0.261-0.532-0.261-0.845 0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5-0.033 0-0.066-0.001-0.099-0.004l-2.662 4.658c0.165 0.241 0.261 0.532 0.261 0.845 0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5c0-0.302 0.090-0.583 0.243-0.819l-1.612-2.687c-0.043 0.004-0.087 0.006-0.131 0.006s-0.088-0.002-0.131-0.006l-1.612 2.687c0.154 0.235 0.243 0.517 0.243 0.819 0 0.828-0.672 1.5-1.5 1.5z"}}]})(props);
};
function ImStatsBars (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 13h16v2h-16zM2 9h2v3h-2zM5 5h2v7h-2zM8 8h2v4h-2zM11 2h2v10h-2z"}}]})(props);
};
function ImStatsBars2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4.5 6h-3c-0.275 0-0.5 0.225-0.5 0.5v9c0 0.275 0.225 0.5 0.5 0.5h3c0.275 0 0.5-0.225 0.5-0.5v-9c0-0.275-0.225-0.5-0.5-0.5zM4.5 15h-3v-4h3v4zM9.5 4h-3c-0.275 0-0.5 0.225-0.5 0.5v11c0 0.275 0.225 0.5 0.5 0.5h3c0.275 0 0.5-0.225 0.5-0.5v-11c0-0.275-0.225-0.5-0.5-0.5zM9.5 15h-3v-5h3v5zM14.5 2h-3c-0.275 0-0.5 0.225-0.5 0.5v13c0 0.275 0.225 0.5 0.5 0.5h3c0.275 0 0.5-0.225 0.5-0.5v-13c0-0.275-0.225-0.5-0.5-0.5zM14.5 15h-3v-6h3v6z"}}]})(props);
};
function ImTrophy (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13 3v-2h-10v2h-3v2c0 1.657 1.343 3 3 3 0.314 0 0.616-0.048 0.9-0.138 0.721 1.031 1.822 1.778 3.1 2.037v3.1h-1c-1.105 0-2 0.895-2 2h8c0-1.105-0.895-2-2-2h-1v-3.1c1.278-0.259 2.378-1.006 3.1-2.037 0.284 0.089 0.587 0.138 0.9 0.138 1.657 0 3-1.343 3-3v-2h-3zM3 6.813c-0.999 0-1.813-0.813-1.813-1.813v-1h1.813v1c0 0.628 0.116 1.229 0.327 1.782-0.106 0.019-0.216 0.030-0.327 0.030zM14.813 5c0 0.999-0.813 1.813-1.813 1.813-0.112 0-0.221-0.011-0.327-0.030 0.211-0.554 0.327-1.154 0.327-1.782v-1h1.813v1z"}}]})(props);
};
function ImGift (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.055 5c0.283-0.201 0.555-0.425 0.804-0.674 0.522-0.522 0.871-1.164 0.983-1.808 0.123-0.706-0.057-1.362-0.494-1.798-0.348-0.348-0.82-0.533-1.365-0.533-0.775 0-1.593 0.372-2.242 1.021-1.039 1.039-1.644 2.472-1.97 3.496-0.241-1.028-0.722-2.416-1.657-3.351-0.501-0.501-1.142-0.759-1.748-0.759-0.495 0-0.965 0.172-1.317 0.523-0.781 0.781-0.675 2.153 0.236 3.064 0.325 0.325 0.705 0.595 1.105 0.819h-3.391v4h1v7h12v-7h1v-4h-2.945zM10.536 2.003c0.433-0.433 0.974-0.692 1.446-0.692 0.167 0 0.402 0.035 0.57 0.203 0.407 0.407 0.178 1.349-0.489 2.016-0.687 0.687-1.61 1.159-2.413 1.47h-0.792c0.29-0.899 0.813-2.132 1.678-2.997zM3.655 2.514c-0.011-0.143-0.001-0.41 0.191-0.601 0.16-0.16 0.372-0.194 0.521-0.194v0c0.332 0 0.679 0.157 0.952 0.429 0.529 0.529 0.965 1.371 1.26 2.436 0.008 0.029 0.016 0.057 0.023 0.086-0.028-0.008-0.057-0.015-0.086-0.023-1.064-0.295-1.906-0.731-2.436-1.26-0.247-0.247-0.403-0.565-0.426-0.872zM7 15h-4v-6.5h4v6.5zM7 8h-5v-2h5v2zM13 15h-4v-6.5h4v6.5zM14 8h-5v-2h5v2z"}}]})(props);
};
function ImGlass (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.153 0.263c-0.087-0.162-0.256-0.263-0.44-0.263h-7.425c-0.184 0-0.353 0.101-0.44 0.263-0.554 1.032-0.847 2.237-0.847 3.487 0 1.647 0.506 3.2 1.424 4.374 0.71 0.907 1.601 1.508 2.576 1.753v5.123h-1.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h5c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-1.5v-5.123c0.975-0.244 1.866-0.846 2.576-1.753 0.918-1.174 1.424-2.727 1.424-4.374 0-1.249-0.293-2.455-0.847-3.487zM4.595 1h6.809c0.39 0.827 0.595 1.771 0.595 2.75 0 0.084-0.002 0.167-0.005 0.25h-7.991c-0.003-0.083-0.005-0.166-0.005-0.25-0-0.979 0.205-1.923 0.595-2.75z"}}]})(props);
};
function ImGlass2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.893 2.809c0.118-0.151 0.14-0.355 0.057-0.527s-0.258-0.281-0.45-0.281h-11c-0.191 0-0.366 0.109-0.45 0.281s-0.062 0.377 0.057 0.527l4.893 6.228v5.963h-1.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h5c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-1.5v-5.963l4.893-6.228zM12.471 3l-1.571 2h-5.8l-1.571-2h8.943z"}}]})(props);
};
function ImMug (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15 5h-3v-1.5c0-1.381-2.686-2.5-6-2.5s-6 1.119-6 2.5v10c0 1.381 2.686 2.5 6 2.5s6-1.119 6-2.5v-1.5h3c0.552 0 1-0.448 1-1v-5c0-0.552-0.448-1-1-1zM2.751 4.037c-0.578-0.19-0.928-0.394-1.116-0.537 0.188-0.143 0.538-0.347 1.116-0.537 0.905-0.298 2.059-0.463 3.249-0.463s2.344 0.164 3.249 0.463c0.578 0.19 0.928 0.394 1.116 0.537-0.188 0.143-0.538 0.347-1.116 0.537-0.905 0.298-2.059 0.463-3.249 0.463s-2.344-0.164-3.249-0.463zM14 10h-2v-3h2v3z"}}]})(props);
};
function ImSpoonKnife (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3.5 0c-1.657 0-3 1.567-3 3.5 0 1.655 0.985 3.042 2.308 3.406l-0.497 8.096c-0.034 0.549 0.389 0.998 0.939 0.998h0.5c0.55 0 0.972-0.449 0.939-0.998l-0.497-8.096c1.323-0.365 2.308-1.751 2.308-3.406 0-1.933-1.343-3.5-3-3.5zM13.583 0l-0.833 5h-0.625l-0.417-5h-0.417l-0.417 5h-0.625l-0.833-5h-0.417v6.5c0 0.276 0.224 0.5 0.5 0.5h1.302l-0.491 8.002c-0.034 0.549 0.389 0.998 0.939 0.998h0.5c0.55 0 0.972-0.449 0.939-0.998l-0.491-8.002h1.302c0.276 0 0.5-0.224 0.5-0.5v-6.5h-0.417z"}}]})(props);
};
function ImLeaf (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.802 2.102c-1.73-1.311-4.393-2.094-7.124-2.094-3.377 0-6.129 1.179-7.549 3.235-0.667 0.965-1.036 2.109-1.097 3.398-0.054 1.148 0.139 2.418 0.573 3.784 1.482-4.444 5.622-7.923 10.395-7.923 0 0-4.466 1.175-7.274 4.816-0.002 0.002-0.039 0.048-0.103 0.136-0.564 0.754-1.055 1.612-1.423 2.583-0.623 1.482-1.2 3.515-1.2 5.965h2c0 0-0.304-1.91 0.224-4.106 0.873 0.118 1.654 0.177 2.357 0.177 1.839 0 3.146-0.398 4.115-1.252 0.868-0.765 1.347-1.794 1.854-2.882 0.774-1.663 1.651-3.547 4.198-5.002 0.146-0.083 0.24-0.234 0.251-0.402s-0.063-0.329-0.197-0.431z"}}]})(props);
};
function ImRocket (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11 1l-5 5h-3l-3 4c0 0 3.178-0.885 5.032-0.47l-5.032 6.47 6.592-5.127c0.919 2.104-0.592 5.127-0.592 5.127l4-3v-3l5-5 1-5-5 1z"}}]})(props);
};
function ImMeter (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 1c4.418 0 8 3.582 8 8 0 3.012-1.665 5.635-4.125 7h-7.75c-2.46-1.365-4.125-3.988-4.125-7 0-4.418 3.582-8 8-8zM12.53 13.53c1.21-1.21 1.876-2.819 1.876-4.53h-1.406v-1h1.329c-0.11-0.703-0.334-1.377-0.665-2h-1.664v-1h1.004c-0.147-0.184-0.306-0.361-0.475-0.53-0.722-0.722-1.587-1.251-2.53-1.559v1.089h-1v-1.329c-0.328-0.051-0.662-0.078-1-0.078s-0.672 0.026-1 0.078v1.329h-1v-1.089c-0.943 0.309-1.808 0.837-2.53 1.559-0.169 0.169-0.327 0.346-0.475 0.53h1.004v1h-1.664c-0.331 0.623-0.555 1.297-0.665 2h1.329v1h-1.406c0 1.711 0.666 3.32 1.876 4.53 0.167 0.167 0.343 0.324 0.524 0.47h3.006l0.571-8h0.857l0.571 8h3.006c0.182-0.146 0.357-0.303 0.524-0.47z"}}]})(props);
};
function ImMeter2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM4.732 13.034c0.174-0.479 0.268-0.995 0.268-1.534 0-1.943-1.231-3.598-2.956-4.228 0.16-1.327 0.754-2.555 1.714-3.514 1.133-1.133 2.64-1.757 4.243-1.757s3.109 0.624 4.243 1.757c0.96 0.96 1.554 2.188 1.714 3.514-1.725 0.63-2.956 2.285-2.956 4.228 0 0.539 0.095 1.055 0.268 1.534-0.964 0.629-2.090 0.966-3.268 0.966s-2.304-0.338-3.268-0.966zM8.621 10.016c0.217 0.055 0.379 0.251 0.379 0.484v1c0 0.275-0.225 0.5-0.5 0.5h-1c-0.275 0-0.5-0.225-0.5-0.5v-1c0-0.233 0.162-0.43 0.379-0.484l0.371-7.016h0.5l0.371 7.016z"}}]})(props);
};
function ImHammer2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.784 14.309l-8.572-7.804 0.399-0.4c0.326-0.327 0.503-0.75 0.53-1.181 0.016-0.007 0.031-0.014 0.046-0.023l1.609-1.006c0.218-0.256 0.202-0.66-0.036-0.898l-2.799-2.806c-0.237-0.238-0.641-0.254-0.896-0.036l-1.004 1.614c-0.008 0.015-0.015 0.031-0.022 0.046-0.43 0.027-0.852 0.204-1.178 0.531l-1.522 1.527c-0.327 0.327-0.503 0.75-0.53 1.181-0.016 0.007-0.031 0.014-0.046 0.023l-1.609 1.006c-0.218 0.256-0.202 0.66 0.036 0.898l2.799 2.806c0.237 0.238 0.641 0.254 0.896 0.036l1.004-1.614c0.008-0.015 0.015-0.031 0.023-0.046 0.43-0.027 0.852-0.204 1.178-0.531l0.442-0.443 7.783 8.596c0.226 0.249 0.573 0.289 0.773 0.089l0.787-0.789c0.199-0.2 0.159-0.549-0.089-0.775z"}}]})(props);
};
function ImFire (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5.016 16c-1.066-2.219-0.498-3.49 0.321-4.688 0.897-1.312 1.129-2.61 1.129-2.61s0.706 0.917 0.423 2.352c1.246-1.387 1.482-3.598 1.293-4.445 2.817 1.969 4.021 6.232 2.399 9.392 8.631-4.883 2.147-12.19 1.018-13.013 0.376 0.823 0.448 2.216-0.313 2.893-1.287-4.879-4.468-5.879-4.468-5.879 0.376 2.516-1.364 5.268-3.042 7.324-0.059-1.003-0.122-1.696-0.649-2.656-0.118 1.823-1.511 3.309-1.889 5.135-0.511 2.473 0.383 4.284 3.777 6.197z"}}]})(props);
};
function ImLab (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.942 12.57l-4.942-8.235v-3.335h0.5c0.275 0 0.5-0.225 0.5-0.5s-0.225-0.5-0.5-0.5h-5c-0.275 0-0.5 0.225-0.5 0.5s0.225 0.5 0.5 0.5h0.5v3.335l-4.942 8.235c-1.132 1.886-0.258 3.43 1.942 3.43h10c2.2 0 3.074-1.543 1.942-3.43zM3.766 10l3.234-5.39v-3.61h2v3.61l3.234 5.39h-8.468z"}}]})(props);
};
function ImMagnet (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 0h-4l1 9c0 1.657-1.343 3-3 3s-3-1.343-3-3l1-9h-4l-1 9c0 3.866 3.134 7 7 7s7-3.134 7-7l-1-9zM12.154 13.154c-1.11 1.11-2.585 1.721-4.154 1.721s-3.045-0.611-4.154-1.721c-1.096-1.096-1.705-2.548-1.72-4.095l0.564-5.075h1.736l-0.55 4.953v0.062c0 1.102 0.429 2.138 1.208 2.917s1.815 1.208 2.917 1.208 2.138-0.429 2.917-1.208c0.779-0.779 1.208-1.815 1.208-2.917v-0.062l-0.007-0.062-0.543-4.891h1.736l0.564 5.075c-0.015 1.547-0.625 2.999-1.72 4.095z"}}]})(props);
};
function ImBin (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M2 5v10c0 0.55 0.45 1 1 1h9c0.55 0 1-0.45 1-1v-10h-11zM5 14h-1v-7h1v7zM7 14h-1v-7h1v7zM9 14h-1v-7h1v7zM11 14h-1v-7h1v7z"}},{"tag":"path","attr":{"d":"M13.25 2h-3.25v-1.25c0-0.412-0.338-0.75-0.75-0.75h-3.5c-0.412 0-0.75 0.338-0.75 0.75v1.25h-3.25c-0.413 0-0.75 0.337-0.75 0.75v1.25h13v-1.25c0-0.413-0.338-0.75-0.75-0.75zM9 2h-3v-0.987h3v0.987z"}}]})(props);
};
function ImBin2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3 16h10l1-11h-12zM10 2v-2h-4v2h-5v3l1-1h12l1 1v-3h-5zM9 2h-2v-1h2v1z"}}]})(props);
};
function ImBriefcase (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15 4h-4v-1c0-0.55-0.45-1-1-1h-4c-0.55 0-1 0.45-1 1v1h-4c-0.55 0-1 0.45-1 1v9c0 0.55 0.45 1 1 1h14c0.55 0 1-0.45 1-1v-9c0-0.55-0.45-1-1-1zM6 3.002c0.001-0.001 0.001-0.001 0.002-0.002h3.996c0.001 0.001 0.001 0.001 0.002 0.002v0.998h-4v-0.998zM15 8h-2v1.5c0 0.275-0.225 0.5-0.5 0.5h-1c-0.275 0-0.5-0.225-0.5-0.5v-1.5h-6v1.5c0 0.275-0.225 0.5-0.5 0.5h-1c-0.275 0-0.5-0.225-0.5-0.5v-1.5h-2v-1h14v1z"}}]})(props);
};
function ImAirplane (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12 9.999l-2.857-2.857 6.857-5.143-2-2-8.571 3.429-2.698-2.699c-0.778-0.778-1.864-0.964-2.414-0.414s-0.364 1.636 0.414 2.414l2.698 2.698-3.429 8.572 2 2 5.144-6.857 2.857 2.857v4h2l1-3 3-1v-2l-4 0z"}}]})(props);
};
function ImTruck (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 9l-2-4h-3v-2c0-0.55-0.45-1-1-1h-9c-0.55 0-1 0.45-1 1v8l1 1h1.268c-0.17 0.294-0.268 0.636-0.268 1 0 1.105 0.895 2 2 2s2-0.895 2-2c0-0.364-0.098-0.706-0.268-1h5.536c-0.17 0.294-0.268 0.636-0.268 1 0 1.105 0.895 2 2 2s2-0.895 2-2c0-0.364-0.098-0.706-0.268-1h1.268v-3zM11 9v-3h2.073l1.5 3h-3.573z"}}]})(props);
};
function ImRoad (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11 16h5l-4-16h-3l0.5 4h-3l0.5-4h-3l-4 16h5l0.5-4h5l0.5 4zM5.75 10l0.5-4h3.5l0.5 4h-4.5z"}}]})(props);
};
function ImAccessibility (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.5 1.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5z"}},{"tag":"path","attr":{"d":"M10 5l5.15-2.221-0.371-0.929-6.279 2.15h-1l-6.279-2.15-0.371 0.929 5.15 2.221v4l-2.051 6.634 0.935 0.355 2.902-6.489h0.429l2.902 6.489 0.935-0.355-2.051-6.634z"}}]})(props);
};
function ImTarget (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 7h-1.577c-0.432-2.785-2.638-4.991-5.423-5.423v-1.577h-2v1.577c-2.785 0.432-4.991 2.638-5.423 5.423h-1.577v2h1.577c0.432 2.785 2.638 4.991 5.423 5.423v1.577h2v-1.577c2.785-0.432 4.991-2.638 5.423-5.423h1.577v-2zM12.388 7h-1.559c-0.301-0.852-0.977-1.528-1.829-1.829v-1.559c1.68 0.383 3.005 1.708 3.388 3.388zM8 9c-0.552 0-1-0.448-1-1s0.448-1 1-1c0.552 0 1 0.448 1 1s-0.448 1-1 1zM7 3.612v1.559c-0.852 0.301-1.528 0.977-1.829 1.829h-1.559c0.383-1.68 1.708-3.005 3.388-3.388zM3.612 9h1.559c0.301 0.852 0.977 1.528 1.829 1.829v1.559c-1.68-0.383-3.005-1.708-3.388-3.388zM9 12.388v-1.559c0.852-0.301 1.528-0.977 1.829-1.829h1.559c-0.383 1.68-1.708 3.005-3.388 3.388z"}}]})(props);
};
function ImShield (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15 0l-7 2-7-2c0 0-0.070 0.808 0 2l7 2.189 7-2.189c0.070-1.192 0-2 0-2zM1.128 3.049c0.375 3.917 1.773 10.504 6.872 12.951 5.099-2.448 6.497-9.034 6.872-12.951l-6.872 2.584-6.872-2.584z"}}]})(props);
};
function ImPower (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 0l-6 8h6l-4 8 14-10h-8l6-6z"}}]})(props);
};
function ImSwitch (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M10 2.29v2.124c0.566 0.247 1.086 0.6 1.536 1.050 0.944 0.944 1.464 2.2 1.464 3.536s-0.52 2.591-1.464 3.536c-0.944 0.944-2.2 1.464-3.536 1.464s-2.591-0.52-3.536-1.464c-0.944-0.944-1.464-2.2-1.464-3.536s0.52-2.591 1.464-3.536c0.45-0.45 0.97-0.803 1.536-1.050v-2.124c-2.891 0.861-5 3.539-5 6.71 0 3.866 3.134 7 7 7s7-3.134 7-7c0-3.171-2.109-5.849-5-6.71zM7 0h2v8h-2z"}}]})(props);
};
function ImPowerCord (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 4.414l-1.414-1.414-2.793 2.793-1.586-1.586 2.793-2.793-1.414-1.414-2.793 2.793-1.793-1.793-1.354 1.353 8 8 1.354-1.353-1.793-1.793 2.793-2.793z"}},{"tag":"path","attr":{"d":"M12.407 10.528l-6.935-6.935c-1.497 1.795-3.196 4.57-2.022 6.957l-2.066 2.066c-0.486 0.486-0.486 1.282 0 1.768l0.232 0.232c0.486 0.486 1.282 0.486 1.768 0l2.066-2.066c2.387 1.174 5.161-0.524 6.957-2.022z"}}]})(props);
};
function ImClipboard (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 2h-4.5c0-1.105-0.895-2-2-2s-2 0.895-2 2h-4.5c-0.276 0-0.5 0.224-0.5 0.5v13c0 0.276 0.224 0.5 0.5 0.5h13c0.276 0 0.5-0.224 0.5-0.5v-13c0-0.276-0.224-0.5-0.5-0.5zM8 1c0.552 0 1 0.448 1 1s-0.448 1-1 1c-0.552 0-1-0.448-1-1s0.448-1 1-1zM14 15h-12v-12h2v1.5c0 0.276 0.224 0.5 0.5 0.5h7c0.276 0 0.5-0.224 0.5-0.5v-1.5h2v12z"}},{"tag":"path","attr":{"d":"M7 13.414l-3.207-3.707 0.914-0.914 2.293 1.793 4.293-3.793 0.914 0.914z"}}]})(props);
};
function ImListNumbered (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 13h10v2h-10zM6 7h10v2h-10zM6 1h10v2h-10zM3 0v4h-1v-3h-1v-1zM2 8.219v0.781h2v1h-3v-2.281l2-0.938v-0.781h-2v-1h3v2.281zM4 11v5h-3v-1h2v-1h-2v-1h2v-1h-2v-1z"}}]})(props);
};
function ImList (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 0h4v4h-4zM6 1h10v2h-10zM0 6h4v4h-4zM6 7h10v2h-10zM0 12h4v4h-4zM6 13h10v2h-10z"}}]})(props);
};
function ImList2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 1h10v2h-10v-2zM6 7h10v2h-10v-2zM6 13h10v2h-10v-2zM0 2c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM0 8c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM0 14c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2z"}}]})(props);
};
function ImTree (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.25 12h-0.25v-3.25c0-0.965-0.785-1.75-1.75-1.75h-4.25v-2h0.25c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.413-0.338-0.75-0.75-0.75h-2.5c-0.412 0-0.75 0.337-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h0.25v2h-4.25c-0.965 0-1.75 0.785-1.75 1.75v3.25h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.413 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.337-0.75-0.75-0.75h-0.25v-3h4v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75h-0.25v-3h4v3h-0.25c-0.412 0-0.75 0.338-0.75 0.75v2.5c0 0.412 0.338 0.75 0.75 0.75h2.5c0.412 0 0.75-0.338 0.75-0.75v-2.5c0-0.412-0.338-0.75-0.75-0.75zM3 15h-2v-2h2v2zM9 15h-2v-2h2v2zM7 4v-2h2v2h-2zM15 15h-2v-2h2v2z"}}]})(props);
};
function ImMenu (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M1 3h14v3h-14zM1 7h14v3h-14zM1 11h14v3h-14z"}}]})(props);
};
function ImMenu2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 22 16"},"child":[{"tag":"path","attr":{"d":"M0 3h14v3h-14v-3zM0 7h14v3h-14v-3zM0 11h14v3h-14v-3z"}},{"tag":"path","attr":{"d":"M15.5 9l3 3 3-3z"}},{"tag":"path","attr":{"d":"M21.5 8l-3-3-3 3z"}}]})(props);
};
function ImMenu3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 22 16"},"child":[{"tag":"path","attr":{"d":"M0 3h14v3h-14v-3zM0 7h14v3h-14v-3zM0 11h14v3h-14v-3z"}},{"tag":"path","attr":{"d":"M15.5 7l3 3 3-3z"}}]})(props);
};
function ImMenu4 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 22 16"},"child":[{"tag":"path","attr":{"d":"M0 3h14v3h-14v-3zM0 7h14v3h-14v-3zM0 11h14v3h-14v-3z"}},{"tag":"path","attr":{"d":"M15.5 10l3-3 3 3z"}}]})(props);
};
function ImCloud (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 10.274c0-1.283-0.886-2.358-2.078-2.648-0.051-2.011-1.695-3.626-3.717-3.626-1.184 0-2.239 0.555-2.92 1.418-0.382-0.494-0.98-0.812-1.652-0.812-1.153 0-2.088 0.936-2.088 2.089 0 0.101 0.007 0.199 0.021 0.296-0.175-0.032-0.356-0.049-0.54-0.049-1.672-0-3.027 1.356-3.027 3.029s1.355 3.029 3.027 3.029l10.254-0c1.502-0.003 2.719-1.222 2.719-2.726z"}}]})(props);
};
function ImCloudDownload (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.922 5.626c-0.051-2.011-1.695-3.626-3.717-3.626-1.184 0-2.239 0.555-2.92 1.418-0.382-0.494-0.98-0.812-1.652-0.812-1.153 0-2.088 0.936-2.088 2.089 0 0.101 0.007 0.199 0.021 0.296-0.175-0.032-0.356-0.049-0.54-0.049-1.672-0-3.027 1.356-3.027 3.029s1.355 3.029 3.027 3.029h1.434l3.539 3.664 3.539-3.664 1.742-0c1.502-0.003 2.719-1.222 2.719-2.726 0-1.283-0.886-2.358-2.078-2.648zM8 13l-3-3h2v-3h2v3h2l-3 3z"}}]})(props);
};
function ImCloudUpload (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.942 6.039c0.038-0.174 0.058-0.354 0.058-0.539 0-1.381-1.119-2.5-2.5-2.5-0.222 0-0.438 0.029-0.643 0.084-0.387-1.209-1.52-2.084-2.857-2.084-1.365 0-2.516 0.911-2.88 2.159-0.355-0.103-0.731-0.159-1.12-0.159-2.209 0-4 1.791-4 4s1.791 4 4 4h2v3h4v-3h3.5c1.381 0 2.5-1.119 2.5-2.5 0-1.23-0.888-2.253-2.058-2.461zM9 10v3h-2v-3h-2.5l3.5-3.5 3.5 3.5h-2.5z"}}]})(props);
};
function ImCloudCheck (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.942 8.039c0.038-0.174 0.058-0.354 0.058-0.539 0-1.381-1.119-2.5-2.5-2.5-0.222 0-0.438 0.029-0.643 0.084-0.387-1.209-1.52-2.084-2.857-2.084-1.365 0-2.516 0.911-2.88 2.159-0.355-0.103-0.731-0.159-1.12-0.159-2.209 0-4 1.791-4 4s1.791 4 4 4h9.5c1.381 0 2.5-1.119 2.5-2.5 0-1.23-0.888-2.252-2.058-2.461zM6.5 12l-2.5-2.5 1-1 1.5 1.5 3.5-3.5 1 1-4.5 4.5z"}}]})(props);
};
function ImDownload2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 8h-2.5l-3.5 3.5-3.5-3.5h-2.5l-2 4v1h16v-1l-2-4zM0 14h16v1h-16v-1zM9 5v-4h-2v4h-3.5l4.5 4.5 4.5-4.5h-3.5z"}}]})(props);
};
function ImUpload2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 14h16v1h-16zM16 12v1h-16v-1l2-4h4v2h4v-2h4zM3.5 5l4.5-4.5 4.5 4.5h-3.5v4h-2v-4z"}}]})(props);
};
function ImDownload3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.5 7l-4 4-4-4h2.5v-6h3v6zM7.5 11h-7.5v4h15v-4h-7.5zM14 13h-2v-1h2v1z"}}]})(props);
};
function ImUpload3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7.5 11h-7.5v4h15v-4h-7.5zM14 13h-2v-1h2v1zM3.5 5l4-4 4 4h-2.5v5h-3v-5z"}}]})(props);
};
function ImSphere (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7.5 1c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5zM11.744 11c0.134-0.632 0.219-1.303 0.246-2h1.991c-0.052 0.691-0.213 1.361-0.479 2h-1.758zM3.256 6c-0.134 0.632-0.219 1.303-0.246 2h-1.991c0.052-0.691 0.213-1.361 0.479-2h1.758zM10.719 6c0.15 0.64 0.241 1.31 0.27 2h-2.989v-2h2.719zM8 5v-2.927c0.228 0.066 0.454 0.178 0.675 0.334 0.415 0.293 0.813 0.744 1.149 1.304 0.233 0.388 0.434 0.819 0.601 1.289h-2.426zM5.176 3.711c0.336-0.561 0.734-1.012 1.149-1.304 0.222-0.156 0.447-0.268 0.675-0.334v2.927h-2.426c0.168-0.47 0.369-0.901 0.601-1.289zM7 6v2h-2.989c0.029-0.69 0.12-1.36 0.27-2h2.719zM1.498 11c-0.266-0.639-0.427-1.309-0.479-2h1.991c0.028 0.697 0.112 1.368 0.246 2h-1.758zM4.011 9h2.989v2h-2.719c-0.15-0.64-0.241-1.31-0.27-2zM7 12v2.927c-0.228-0.066-0.454-0.178-0.675-0.334-0.415-0.293-0.813-0.744-1.149-1.304-0.233-0.388-0.434-0.819-0.602-1.289h2.426zM9.825 13.289c-0.336 0.561-0.734 1.012-1.149 1.304-0.222 0.156-0.447 0.268-0.675 0.334v-2.927h2.426c-0.168 0.47-0.369 0.901-0.602 1.289zM8 11v-2h2.989c-0.029 0.69-0.12 1.36-0.27 2h-2.719zM11.99 8c-0.028-0.697-0.112-1.368-0.246-2h1.758c0.267 0.639 0.427 1.309 0.479 2h-1.991zM12.979 5h-1.498c-0.291-0.918-0.693-1.723-1.177-2.366 0.665 0.318 1.267 0.744 1.792 1.27 0.336 0.336 0.631 0.702 0.883 1.096zM2.904 3.904c0.526-0.526 1.128-0.952 1.792-1.27-0.483 0.643-0.886 1.448-1.177 2.366h-1.498c0.252-0.394 0.547-0.761 0.883-1.096zM2.021 12h1.498c0.291 0.918 0.693 1.723 1.177 2.366-0.665-0.318-1.267-0.744-1.792-1.27-0.336-0.336-0.631-0.702-0.883-1.096zM12.096 13.096c-0.526 0.526-1.128 0.952-1.792 1.27 0.483-0.643 0.886-1.448 1.177-2.366h1.498c-0.252 0.394-0.547 0.761-0.883 1.096z"}}]})(props);
};
function ImEarth (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 15c-0.984 0-1.92-0.203-2.769-0.57l3.643-4.098c0.081-0.092 0.126-0.21 0.126-0.332v-1.5c0-0.276-0.224-0.5-0.5-0.5-1.765 0-3.628-1.835-3.646-1.854-0.094-0.094-0.221-0.146-0.354-0.146h-2c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.189 0.107 0.363 0.276 0.447l1.724 0.862v2.936c-1.813-1.265-3-3.366-3-5.745 0-1.074 0.242-2.091 0.674-3h1.826c0.133 0 0.26-0.053 0.354-0.146l2-2c0.094-0.094 0.146-0.221 0.146-0.354v-1.21c0.634-0.189 1.305-0.29 2-0.29 1.1 0 2.141 0.254 3.067 0.706-0.065 0.055-0.128 0.112-0.188 0.172-0.567 0.567-0.879 1.32-0.879 2.121s0.312 1.555 0.879 2.121c0.569 0.569 1.332 0.879 2.119 0.879 0.049 0 0.099-0.001 0.149-0.004 0.216 0.809 0.605 2.917-0.131 5.818-0.007 0.027-0.011 0.055-0.013 0.082-1.271 1.298-3.042 2.104-5.002 2.104z"}}]})(props);
};
function ImLink (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.879 9.934c-0.208 0-0.416-0.079-0.575-0.238-1.486-1.486-1.486-3.905 0-5.392l3-3c0.72-0.72 1.678-1.117 2.696-1.117s1.976 0.397 2.696 1.117c1.486 1.487 1.486 3.905 0 5.392l-1.371 1.371c-0.317 0.317-0.832 0.317-1.149 0s-0.317-0.832 0-1.149l1.371-1.371c0.853-0.853 0.853-2.241 0-3.094-0.413-0.413-0.963-0.641-1.547-0.641s-1.134 0.228-1.547 0.641l-3 3c-0.853 0.853-0.853 2.241 0 3.094 0.317 0.317 0.317 0.832 0 1.149-0.159 0.159-0.367 0.238-0.575 0.238z"}},{"tag":"path","attr":{"d":"M4 15.813c-1.018 0-1.976-0.397-2.696-1.117-1.486-1.486-1.486-3.905 0-5.392l1.371-1.371c0.317-0.317 0.832-0.317 1.149 0s0.317 0.832 0 1.149l-1.371 1.371c-0.853 0.853-0.853 2.241 0 3.094 0.413 0.413 0.962 0.641 1.547 0.641s1.134-0.228 1.547-0.641l3-3c0.853-0.853 0.853-2.241 0-3.094-0.317-0.317-0.317-0.832 0-1.149s0.832-0.317 1.149 0c1.486 1.486 1.486 3.905 0 5.392l-3 3c-0.72 0.72-1.678 1.117-2.696 1.117z"}}]})(props);
};
function ImFlag (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 0h2v16h-2v-16z"}},{"tag":"path","attr":{"d":"M13 10.047c1.291 0 2.415-0.312 3-0.773v-8c-0.585 0.461-1.709 0.773-3 0.773s-2.415-0.312-3-0.773v8c0.585 0.461 1.709 0.773 3 0.773z"}},{"tag":"path","attr":{"d":"M9.5 0.508c-0.733-0.312-1.805-0.508-3-0.508-1.506 0-2.818 0.312-3.5 0.773v8c0.682-0.461 1.994-0.773 3.5-0.773 1.195 0 2.267 0.197 3 0.508v-8z"}}]})(props);
};
function ImAttachment (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M10.404 5.11l-1.015-1.014-5.075 5.074c-0.841 0.841-0.841 2.204 0 3.044s2.204 0.841 3.045 0l6.090-6.089c1.402-1.401 1.402-3.673 0-5.074s-3.674-1.402-5.075 0l-6.394 6.393c-0.005 0.005-0.010 0.009-0.014 0.013-1.955 1.955-1.955 5.123 0 7.077s5.123 1.954 7.078 0c0.004-0.004 0.008-0.009 0.013-0.014l0.001 0.001 4.365-4.364-1.015-1.014-4.365 4.363c-0.005 0.004-0.009 0.009-0.013 0.013-1.392 1.392-3.656 1.392-5.048 0s-1.392-3.655 0-5.047c0.005-0.005 0.009-0.009 0.014-0.013l-0.001-0.001 6.395-6.393c0.839-0.84 2.205-0.84 3.045 0s0.839 2.205 0 3.044l-6.090 6.089c-0.28 0.28-0.735 0.28-1.015 0s-0.28-0.735 0-1.014l5.075-5.075z"}}]})(props);
};
function ImEye (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 3c-3.489 0-6.514 2.032-8 5 1.486 2.968 4.511 5 8 5s6.514-2.032 8-5c-1.486-2.968-4.511-5-8-5zM11.945 5.652c0.94 0.6 1.737 1.403 2.335 2.348-0.598 0.946-1.395 1.749-2.335 2.348-1.181 0.753-2.545 1.152-3.944 1.152s-2.763-0.398-3.945-1.152c-0.94-0.6-1.737-1.403-2.335-2.348 0.598-0.946 1.395-1.749 2.335-2.348 0.061-0.039 0.123-0.077 0.185-0.114-0.156 0.427-0.241 0.888-0.241 1.369 0 2.209 1.791 4 4 4s4-1.791 4-4c0-0.481-0.085-0.942-0.241-1.369 0.062 0.037 0.124 0.075 0.185 0.114v0zM8 6.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5 0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5z"}}]})(props);
};
function ImEyePlus (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 2h-2v-2h-2v2h-2v2h2v2h2v-2h2z"}},{"tag":"path","attr":{"d":"M13.498 6.969c0.288 0.32 0.55 0.665 0.782 1.031-0.598 0.946-1.395 1.749-2.335 2.348-1.181 0.753-2.545 1.152-3.944 1.152s-2.763-0.398-3.945-1.152c-0.94-0.6-1.736-1.403-2.335-2.348 0.598-0.946 1.395-1.749 2.335-2.348 0.061-0.039 0.123-0.077 0.185-0.114-0.156 0.427-0.241 0.888-0.241 1.369 0 2.209 1.791 4 4 4s4-1.791 4-4c0-0.011-0-0.022-0-0.032-1.708-0.44-2.973-1.979-2.999-3.817-0.329-0.037-0.662-0.057-1.001-0.057-3.489 0-6.514 2.032-8 5 1.486 2.968 4.511 5 8 5s6.514-2.032 8-5c-0.276-0.55-0.604-1.069-0.979-1.548-0.457 0.268-0.973 0.449-1.523 0.517zM6.5 5c0.828 0 1.5 0.672 1.5 1.5s-0.672 1.5-1.5 1.5-1.5-0.672-1.5-1.5 0.672-1.5 1.5-1.5z"}}]})(props);
};
function ImEyeMinus (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M10 2h6v2h-6v-2z"}},{"tag":"path","attr":{"d":"M13.599 5h-4.599v-1.944c-0.328-0.037-0.662-0.056-1-0.056-3.489 0-6.514 2.032-8 5 1.486 2.968 4.511 5 8 5s6.514-2.032 8-5c-0.584-1.167-1.407-2.189-2.401-3zM6.5 5c0.828 0 1.5 0.672 1.5 1.5s-0.672 1.5-1.5 1.5-1.5-0.672-1.5-1.5 0.672-1.5 1.5-1.5zM11.944 10.348c-1.181 0.753-2.545 1.152-3.944 1.152s-2.763-0.398-3.945-1.152c-0.94-0.6-1.736-1.403-2.335-2.348 0.598-0.946 1.395-1.749 2.335-2.348 0.061-0.039 0.123-0.077 0.185-0.114-0.156 0.427-0.241 0.888-0.241 1.369 0 2.209 1.791 4 4 4s4-1.791 4-4c0-0.481-0.085-0.942-0.241-1.369 0.062 0.037 0.124 0.075 0.185 0.114 0.94 0.6 1.737 1.403 2.335 2.348-0.598 0.946-1.395 1.749-2.335 2.348z"}}]})(props);
};
function ImEyeBlocked (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.78 0.22c-0.293-0.293-0.768-0.293-1.061 0l-3.159 3.159c-0.812-0.246-1.671-0.378-2.561-0.378-3.489 0-6.514 2.032-8 5 0.643 1.283 1.573 2.391 2.703 3.236l-2.484 2.484c-0.293 0.293-0.293 0.768 0 1.061 0.146 0.146 0.338 0.22 0.53 0.22s0.384-0.073 0.53-0.22l13.5-13.5c0.293-0.293 0.293-0.768 0-1.061zM6.5 5c0.66 0 1.22 0.426 1.421 1.019l-1.902 1.902c-0.592-0.201-1.019-0.761-1.019-1.421 0-0.828 0.672-1.5 1.5-1.5zM1.721 8c0.598-0.946 1.395-1.749 2.335-2.348 0.061-0.039 0.123-0.077 0.185-0.114-0.156 0.427-0.241 0.888-0.241 1.369 0 0.858 0.27 1.652 0.73 2.303l-0.952 0.952c-0.819-0.576-1.519-1.311-2.057-2.162z"}},{"tag":"path","attr":{"d":"M12 6.906c0-0.424-0.066-0.833-0.189-1.217l-5.028 5.028c0.384 0.123 0.793 0.189 1.217 0.189 2.209 0 4-1.791 4-4z"}},{"tag":"path","attr":{"d":"M12.969 4.531l-1.084 1.084c0.020 0.012 0.040 0.024 0.059 0.037 0.94 0.6 1.737 1.403 2.335 2.348-0.598 0.946-1.395 1.749-2.335 2.348-1.181 0.753-2.545 1.152-3.944 1.152-0.604 0-1.202-0.074-1.781-0.219l-1.201 1.201c0.933 0.335 1.937 0.518 2.982 0.518 3.489 0 6.514-2.032 8-5-0.703-1.405-1.752-2.6-3.031-3.469z"}}]})(props);
};
function ImBookmark (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3 0v16l5-5 5 5v-16z"}}]})(props);
};
function ImBookmarks (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 2v14l5-5 5 5v-14zM12 0h-10v14l1-1v-12h9z"}}]})(props);
};
function ImSun (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 13c0.552 0 1 0.448 1 1v1c0 0.552-0.448 1-1 1s-1-0.448-1-1v-1c0-0.552 0.448-1 1-1zM8 3c-0.552 0-1-0.448-1-1v-1c0-0.552 0.448-1 1-1s1 0.448 1 1v1c0 0.552-0.448 1-1 1zM15 7c0.552 0 1 0.448 1 1s-0.448 1-1 1h-1c-0.552 0-1-0.448-1-1s0.448-1 1-1h1zM3 8c0 0.552-0.448 1-1 1h-1c-0.552 0-1-0.448-1-1s0.448-1 1-1h1c0.552 0 1 0.448 1 1zM12.95 11.536l0.707 0.707c0.39 0.39 0.39 1.024 0 1.414s-1.024 0.39-1.414 0l-0.707-0.707c-0.39-0.39-0.39-1.024 0-1.414s1.024-0.39 1.414 0zM3.050 4.464l-0.707-0.707c-0.391-0.391-0.391-1.024 0-1.414s1.024-0.391 1.414 0l0.707 0.707c0.391 0.391 0.391 1.024 0 1.414s-1.024 0.391-1.414 0zM12.95 4.464c-0.39 0.391-1.024 0.391-1.414 0s-0.39-1.024 0-1.414l0.707-0.707c0.39-0.391 1.024-0.391 1.414 0s0.39 1.024 0 1.414l-0.707 0.707zM3.050 11.536c0.39-0.39 1.024-0.39 1.414 0s0.391 1.024 0 1.414l-0.707 0.707c-0.391 0.39-1.024 0.39-1.414 0s-0.391-1.024 0-1.414l0.707-0.707z"}},{"tag":"path","attr":{"d":"M8 4c-2.209 0-4 1.791-4 4s1.791 4 4 4c2.209 0 4-1.791 4-4s-1.791-4-4-4zM8 10.5c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"}}]})(props);
};
function ImContrast (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM2 8c0-3.314 2.686-6 6-6v12c-3.314 0-6-2.686-6-6z"}}]})(props);
};
function ImBrightnessContrast (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 4c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zM8 10.5v-5c1.379 0 2.5 1.122 2.5 2.5s-1.121 2.5-2.5 2.5zM8 13c0.552 0 1 0.448 1 1v1c0 0.552-0.448 1-1 1s-1-0.448-1-1v-1c0-0.552 0.448-1 1-1zM8 3c-0.552 0-1-0.448-1-1v-1c0-0.552 0.448-1 1-1s1 0.448 1 1v1c0 0.552-0.448 1-1 1zM15 7c0.552 0 1 0.448 1 1s-0.448 1-1 1h-1c-0.552 0-1-0.448-1-1s0.448-1 1-1h1zM3 8c0 0.552-0.448 1-1 1h-1c-0.552 0-1-0.448-1-1s0.448-1 1-1h1c0.552 0 1 0.448 1 1zM12.95 11.536l0.707 0.707c0.39 0.39 0.39 1.024 0 1.414s-1.024 0.39-1.414 0l-0.707-0.707c-0.39-0.39-0.39-1.024 0-1.414s1.024-0.39 1.414 0zM3.050 4.464l-0.707-0.707c-0.391-0.391-0.391-1.024 0-1.414s1.024-0.391 1.414 0l0.707 0.707c0.391 0.391 0.391 1.024 0 1.414s-1.024 0.391-1.414 0zM12.95 4.464c-0.39 0.391-1.024 0.391-1.414 0s-0.39-1.024 0-1.414l0.707-0.707c0.39-0.391 1.024-0.391 1.414 0s0.39 1.024 0 1.414l-0.707 0.707zM3.050 11.536c0.39-0.39 1.024-0.39 1.414 0s0.391 1.024 0 1.414l-0.707 0.707c-0.391 0.39-1.024 0.39-1.414 0s-0.391-1.024 0-1.414l0.707-0.707z"}}]})(props);
};
function ImStarEmpty (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 6.204l-5.528-0.803-2.472-5.009-2.472 5.009-5.528 0.803 4 3.899-0.944 5.505 4.944-2.599 4.944 2.599-0.944-5.505 4-3.899zM8 11.773l-3.492 1.836 0.667-3.888-2.825-2.753 3.904-0.567 1.746-3.537 1.746 3.537 3.904 0.567-2.825 2.753 0.667 3.888-3.492-1.836z"}}]})(props);
};
function ImStarHalf (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 6.204l-5.528-0.803-2.472-5.009-2.472 5.009-5.528 0.803 4 3.899-0.944 5.505 4.944-2.599 4.944 2.599-0.944-5.505 4-3.899zM8 11.773l-0.015 0.008 0.015-8.918 1.746 3.537 3.904 0.567-2.825 2.753 0.667 3.888-3.492-1.836z"}}]})(props);
};
function ImStarFull (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 6.204l-5.528-0.803-2.472-5.009-2.472 5.009-5.528 0.803 4 3.899-0.944 5.505 4.944-2.599 4.944 2.599-0.944-5.505 4-3.899z"}}]})(props);
};
function ImHeart (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.8 1c-1.682 0-3.129 1.368-3.799 2.797-0.671-1.429-2.118-2.797-3.8-2.797-2.318 0-4.2 1.882-4.2 4.2 0 4.716 4.758 5.953 8 10.616 3.065-4.634 8-6.050 8-10.616 0-2.319-1.882-4.2-4.2-4.2z"}}]})(props);
};
function ImHeartBroken (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.8 1c2.318 0 4.2 1.882 4.2 4.2 0 4.566-4.935 5.982-8 10.616-3.243-4.663-8-5.9-8-10.616 0-2.319 1.882-4.2 4.2-4.2 0.943 0 1.812 0.43 2.512 1.060l-1.213 1.94 3.5 2-2 5 5.5-6-3.5-2 0.967-1.451c0.553-0.34 1.175-0.549 1.833-0.549z"}}]})(props);
};
function ImMan (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5z"}},{"tag":"path","attr":{"d":"M9 4h-3c-0.552 0-1 0.448-1 1v5h1v6h1.25v-6h0.5v6h1.25v-6h1v-5c0-0.552-0.448-1-1-1z"}}]})(props);
};
function ImWoman (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5z"}},{"tag":"path","attr":{"d":"M11.234 8l0.766-0.555-2.083-3.221c-0.092-0.14-0.249-0.225-0.417-0.225h-4c-0.168 0-0.325 0.084-0.417 0.225l-2.083 3.221 0.766 0.555 1.729-2.244 0.601 1.402-2.095 3.841h1.917l0.333 5h1v-5h0.5v5h1l0.333-5h1.917l-2.095-3.842 0.601-1.402 1.729 2.244z"}}]})(props);
};
function ImManWoman (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5z"}},{"tag":"path","attr":{"d":"M13 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5z"}},{"tag":"path","attr":{"d":"M4 4h-3c-0.552 0-1 0.448-1 1v5h1v6h1.25v-6h0.5v6h1.25v-6h1v-5c0-0.552-0.448-1-1-1z"}},{"tag":"path","attr":{"d":"M15.234 8l0.766-0.555-2.083-3.221c-0.092-0.14-0.249-0.225-0.417-0.225h-4c-0.168 0-0.325 0.084-0.417 0.225l-2.083 3.221 0.766 0.555 1.729-2.244 0.601 1.402-2.095 3.841h1.917l0.333 5h1v-5h0.5v5h1l0.333-5h1.917l-2.095-3.842 0.601-1.402 1.729 2.244z"}}]})(props);
};
function ImHappy (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM8 9.356c1.812 0 3.535-0.481 5-1.327-0.228 2.788-2.393 4.971-5 4.971s-4.772-2.186-5-4.973c1.465 0.845 3.188 1.329 5 1.329zM4 5.5c0-0.828 0.448-1.5 1-1.5s1 0.672 1 1.5c0 0.828-0.448 1.5-1 1.5s-1-0.672-1-1.5zM10 5.5c0-0.828 0.448-1.5 1-1.5s1 0.672 1 1.5c0 0.828-0.448 1.5-1 1.5s-1-0.672-1-1.5z"}}]})(props);
};
function ImHappy2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM11 4c0.552 0 1 0.672 1 1.5s-0.448 1.5-1 1.5-1-0.672-1-1.5 0.448-1.5 1-1.5zM5 4c0.552 0 1 0.672 1 1.5s-0.448 1.5-1 1.5-1-0.672-1-1.5 0.448-1.5 1-1.5zM8 14c-2.607 0-4.772-2.186-5-4.973 1.465 0.846 3.188 1.329 5 1.329s3.535-0.481 5-1.327c-0.228 2.788-2.393 4.971-5 4.971z"}}]})(props);
};
function ImSmile (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM4 5c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM10 5c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM11.002 9.801l1.286 0.772c-0.874 1.454-2.467 2.427-4.288 2.427s-3.413-0.973-4.288-2.427l1.286-0.772c0.612 1.018 1.727 1.699 3.002 1.699s2.389-0.681 3.002-1.699z"}}]})(props);
};
function ImSmile2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM11 4c0.552 0 1 0.448 1 1s-0.448 1-1 1-1-0.448-1-1 0.448-1 1-1zM5 4c0.552 0 1 0.448 1 1s-0.448 1-1 1-1-0.448-1-1 0.448-1 1-1zM8 13c-1.82 0-3.413-0.973-4.288-2.427l1.286-0.772c0.612 1.018 1.727 1.699 3.002 1.699s2.389-0.681 3.002-1.699l1.286 0.772c-0.874 1.454-2.467 2.427-4.288 2.427z"}}]})(props);
};
function ImTongue (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM4 5c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM10 5c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM12 9v1h-1v1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5v-1.5h-4v-1h8z"}}]})(props);
};
function ImTongue2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM5 4c0.552 0 1 0.448 1 1s-0.448 1-1 1-1-0.448-1-1 0.448-1 1-1zM12 10h-1v1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5v-1.5h-4v-1h8v1zM11 6c-0.552 0-1-0.448-1-1s0.448-1 1-1 1 0.448 1 1-0.448 1-1 1z"}}]})(props);
};
function ImSad (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM4 5c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM10 5c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM4.998 12.199l-1.286-0.772c0.874-1.454 2.467-2.427 4.288-2.427s3.413 0.973 4.288 2.427l-1.286 0.772c-0.612-1.018-1.727-1.699-3.002-1.699s-2.389 0.681-3.002 1.699z"}}]})(props);
};
function ImSad2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM11 4c0.552 0 1 0.448 1 1s-0.448 1-1 1-1-0.448-1-1 0.448-1 1-1zM5 4c0.552 0 1 0.448 1 1s-0.448 1-1 1-1-0.448-1-1 0.448-1 1-1zM11.002 12.199c-0.612-1.018-1.727-1.699-3.002-1.699s-2.389 0.681-3.002 1.699l-1.286-0.772c0.874-1.454 2.467-2.427 4.288-2.427s3.414 0.973 4.288 2.427l-1.286 0.772z"}}]})(props);
};
function ImWink (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM8.48 11.11c2.191-0.433 3.892-1.43 4.507-2.759-0.338 2.624-2.524 4.649-5.17 4.649-1.863 0-3.498-1.004-4.42-2.515 1.1 0.86 3.040 1.028 5.083 0.625zM10 5.5c0-0.828 0.448-1.5 1-1.5s1 0.672 1 1.5c0 0.828-0.448 1.5-1 1.5s-1-0.672-1-1.5zM5.5 5.805c-0.653 0-1.208 0.245-1.414 0.586-0.055-0.092-0.086-0.503-0.086-0.605 0-0.485 0.672-0.879 1.5-0.879s1.5 0.394 1.5 0.879c0 0.103-0.030 0.514-0.086 0.605-0.206-0.341-0.761-0.586-1.414-0.586z"}}]})(props);
};
function ImWink2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.418 0 8-3.582 8-8s-3.582-8-8-8zM11 4c0.552 0 1 0.672 1 1.5s-0.448 1.5-1 1.5-1-0.672-1-1.5 0.448-1.5 1-1.5zM5.5 4.876c0.932 0 1.594 0.349 1.594 0.895 0 0.116 0.060 0.672-0.003 0.775-0.232-0.384-0.856-0.659-1.591-0.659s-1.359 0.275-1.591 0.659c-0.062-0.103-0.003-0.659-0.003-0.775 0-0.546 0.662-0.895 1.594-0.895zM7.818 13c-1.863 0-3.498-1.004-4.42-2.515 1.1 0.86 3.040 1.028 5.083 0.625 2.191-0.433 3.892-1.43 4.507-2.759-0.338 2.624-2.524 4.649-5.17 4.649z"}}]})(props);
};
function ImGrin (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM3 8v1c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4v-1h-10zM6 11.828c-0.415-0.148-0.796-0.388-1.118-0.71-0.569-0.569-0.882-1.321-0.882-2.118h2v2.828zM9 12h-2v-3h2v3zM11.118 11.118c-0.322 0.322-0.703 0.562-1.118 0.71v-2.828h2c0 0.797-0.313 1.549-0.882 2.118zM3.521 6c0 0 0 0 0 0 0.153 0 0.283-0.11 0.308-0.261 0.096-0.573 0.589-0.989 1.171-0.989s1.074 0.416 1.171 0.989c0.025 0.151 0.156 0.261 0.308 0.261s0.283-0.11 0.308-0.261c0.017-0.101 0.025-0.202 0.025-0.302 0-0.999-0.813-1.813-1.813-1.813s-1.813 0.813-1.813 1.813c0 0.1 0.009 0.201 0.025 0.302 0.025 0.151 0.156 0.261 0.308 0.261zM9.521 6c0 0 0 0 0 0 0.153 0 0.283-0.11 0.308-0.261 0.096-0.573 0.589-0.989 1.171-0.989s1.074 0.416 1.171 0.989c0.025 0.151 0.156 0.261 0.308 0.261s0.283-0.11 0.308-0.261c0.017-0.101 0.025-0.202 0.025-0.302 0-0.999-0.813-1.813-1.813-1.813s-1.813 0.813-1.813 1.813c0 0.1 0.008 0.201 0.025 0.302 0.025 0.151 0.156 0.261 0.308 0.261z"}}]})(props);
};
function ImGrin2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.418 0 8-3.582 8-8s-3.582-8-8-8zM11 3.688c0.999 0 1.813 0.813 1.813 1.813 0 0.1-0.009 0.201-0.025 0.302-0.025 0.151-0.156 0.261-0.308 0.261s-0.283-0.11-0.308-0.261c-0.096-0.573-0.589-0.833-1.171-0.833s-1.074 0.26-1.171 0.833c-0.025 0.151-0.156 0.261-0.308 0.261-0 0 0 0-0 0-0.153 0-0.283-0.11-0.308-0.261-0.017-0.101-0.025-0.202-0.025-0.302 0-0.999 0.813-1.813 1.813-1.813zM5 3.688c0.999 0 1.813 0.813 1.813 1.813 0 0.1-0.009 0.201-0.025 0.302-0.025 0.151-0.156 0.261-0.308 0.261s-0.283-0.11-0.308-0.261c-0.096-0.573-0.589-0.833-1.171-0.833s-1.074 0.26-1.171 0.833c-0.025 0.151-0.156 0.261-0.308 0.261 0 0 0 0 0 0-0.153 0-0.283-0.11-0.308-0.261-0.017-0.101-0.025-0.202-0.025-0.302 0-0.999 0.813-1.813 1.813-1.813zM3 9h3v3.873c-1.72-0.447-3-2.018-3-3.873zM7 13v-4h2v4h-2zM10 12.873v-3.873h3c0 1.855-1.28 3.426-3 3.873z"}}]})(props);
};
function ImCool (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM12.5 4c0.275 0 0.5 0.225 0.5 0.5v1.5c0 0.55-0.45 1-1 1h-2c-0.55 0-1-0.45-1-1h-2c0 0.55-0.45 1-1 1h-2c-0.55 0-1-0.45-1-1v-1.5c0-0.275 0.225-0.5 0.5-0.5h3c0.275 0 0.5 0.225 0.5 0.5v0.5h2v-0.5c0-0.275 0.225-0.5 0.5-0.5h3zM8 12c1.456 0 2.731-0.778 3.43-1.942l0.857 0.515c-0.874 1.454-2.467 2.427-4.288 2.427-0.757 0-1.475-0.169-2.118-0.47l0.518-0.864c0.49 0.214 1.031 0.334 1.6 0.334z"}}]})(props);
};
function ImCool2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.418 0 8-3.582 8-8s-3.582-8-8-8zM8 13c-0.757 0-1.475-0.169-2.118-0.47l0.518-0.864c0.49 0.214 1.031 0.334 1.6 0.334 1.456 0 2.731-0.778 3.43-1.942l0.858 0.515c-0.874 1.454-2.467 2.427-4.288 2.427zM13 6c0 0.55-0.45 1-1 1h-2c-0.55 0-1-0.45-1-1h-2c0 0.55-0.45 1-1 1h-2c-0.55 0-1-0.45-1-1v-1.5c0-0.275 0.225-0.5 0.5-0.5h3c0.275 0 0.5 0.225 0.5 0.5v0.5h2v-0.5c0-0.275 0.225-0.5 0.5-0.5h3c0.275 0 0.5 0.225 0.5 0.5v1.5z"}}]})(props);
};
function ImAngry (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM11.002 12.199c-0.612-1.018-1.727-1.699-3.002-1.699s-2.389 0.681-3.002 1.699l-1.286-0.772c0.874-1.454 2.467-2.427 4.288-2.427s3.414 0.973 4.288 2.427l-1.286 0.772zM11.985 4.379c0.067 0.268-0.096 0.539-0.364 0.606-0.275 0.070-0.602 0.189-0.89 0.334 0.166 0.179 0.268 0.418 0.268 0.681 0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.018 0.001-0.036 0.002-0.054 0.032-0.741 0.706-1.234 1.275-1.518 0.543-0.271 1.080-0.407 1.102-0.413 0.268-0.067 0.539 0.096 0.606 0.364zM4.015 4.379c0.067-0.268 0.338-0.431 0.606-0.364 0.023 0.006 0.559 0.141 1.102 0.413 0.568 0.284 1.243 0.776 1.275 1.518 0.001 0.018 0.002 0.036 0.002 0.054 0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.263 0.102-0.503 0.268-0.681-0.288-0.144-0.614-0.264-0.89-0.334-0.268-0.067-0.431-0.338-0.364-0.606z"}}]})(props);
};
function ImAngry2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM9.001 5.946c0.032-0.741 0.706-1.234 1.275-1.518 0.543-0.271 1.080-0.407 1.102-0.413 0.268-0.067 0.539 0.096 0.606 0.364s-0.096 0.539-0.364 0.606c-0.275 0.070-0.602 0.189-0.89 0.334 0.166 0.179 0.268 0.418 0.268 0.681 0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.018 0.001-0.036 0.002-0.054zM4.015 4.379c0.067-0.268 0.338-0.431 0.606-0.364 0.023 0.006 0.559 0.141 1.102 0.413 0.568 0.284 1.243 0.776 1.275 1.518 0.001 0.018 0.002 0.036 0.002 0.054 0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.263 0.102-0.503 0.268-0.681-0.288-0.144-0.614-0.264-0.89-0.334-0.268-0.067-0.431-0.338-0.364-0.606zM11.002 12.199c-0.612-1.018-1.727-1.699-3.002-1.699s-2.389 0.681-3.002 1.699l-1.286-0.772c0.874-1.454 2.467-2.427 4.288-2.427s3.414 0.973 4.288 2.427l-1.286 0.772z"}}]})(props);
};
function ImEvil (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M10 7c-0.552 0-1-0.448-1-1 0-0.018 0.001-0.036 0.002-0.054 0.032-0.741 0.706-1.234 1.275-1.518 0.543-0.271 1.080-0.407 1.102-0.413 0.268-0.067 0.539 0.096 0.606 0.364s-0.096 0.539-0.364 0.606c-0.275 0.070-0.602 0.189-0.89 0.334 0.166 0.179 0.268 0.418 0.268 0.681 0 0.552-0.448 1-1 1zM4.379 4.985c-0.268-0.067-0.431-0.338-0.364-0.606s0.338-0.431 0.606-0.364c0.023 0.006 0.559 0.141 1.102 0.413 0.568 0.284 1.243 0.776 1.275 1.518 0.001 0.018 0.002 0.036 0.002 0.054 0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.263 0.102-0.503 0.268-0.681-0.288-0.144-0.614-0.264-0.89-0.334zM8 11.5c1.274 0 2.389-0.681 3.002-1.699l1.286 0.772c-0.874 1.454-2.467 2.427-4.288 2.427s-3.413-0.973-4.288-2.427l1.286-0.772c0.612 1.018 1.727 1.699 3.002 1.699zM16 1c0-0.711-0.149-1.387-0.416-2-0.525 1.201-1.507 2.155-2.726 2.643-1.347-1.031-3.030-1.643-4.857-1.643s-3.51 0.613-4.857 1.643c-1.22-0.488-2.202-1.443-2.726-2.643-0.268 0.613-0.416 1.289-0.416 2 0 1.15 0.388 2.208 1.040 3.053-0.662 1.165-1.040 2.512-1.040 3.947 0 4.418 3.582 8 8 8s8-3.582 8-8c0-1.436-0.378-2.783-1.040-3.947 0.652-0.845 1.040-1.903 1.040-3.053zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"}}]})(props);
};
function ImEvil2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 1c0-0.711-0.149-1.387-0.416-2-0.525 1.201-1.507 2.155-2.726 2.643-1.347-1.031-3.030-1.643-4.857-1.643s-3.51 0.613-4.857 1.643c-1.22-0.488-2.202-1.443-2.726-2.643-0.268 0.613-0.416 1.289-0.416 2 0 1.15 0.388 2.208 1.040 3.053-0.662 1.165-1.040 2.512-1.040 3.947 0 4.418 3.582 8 8 8s8-3.582 8-8c0-1.436-0.378-2.783-1.040-3.947 0.652-0.845 1.040-1.903 1.040-3.053zM9.001 5.946c0.032-0.741 0.706-1.234 1.275-1.518 0.543-0.271 1.080-0.407 1.102-0.413 0.268-0.067 0.539 0.096 0.606 0.364s-0.096 0.539-0.364 0.606c-0.275 0.070-0.602 0.189-0.89 0.334 0.166 0.179 0.268 0.418 0.268 0.681 0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.018 0.001-0.036 0.002-0.054zM4.015 4.379c0.067-0.268 0.338-0.431 0.606-0.364 0.023 0.006 0.559 0.141 1.102 0.413 0.568 0.284 1.243 0.776 1.275 1.518 0.001 0.018 0.002 0.036 0.002 0.054 0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.263 0.102-0.503 0.268-0.681-0.288-0.144-0.614-0.264-0.89-0.334-0.268-0.067-0.431-0.338-0.364-0.606zM8 13c-1.82 0-3.413-0.973-4.288-2.427l1.286-0.772c0.612 1.018 1.727 1.699 3.002 1.699s2.389-0.681 3.002-1.699l1.286 0.772c-0.874 1.454-2.467 2.427-4.288 2.427z"}}]})(props);
};
function ImShocked (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM6 11c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM10 5.5c0-0.828 0.448-1.5 1-1.5s1 0.672 1 1.5c0 0.828-0.448 1.5-1 1.5s-1-0.672-1-1.5zM4 5.5c0-0.828 0.448-1.5 1-1.5s1 0.672 1 1.5c0 0.828-0.448 1.5-1 1.5s-1-0.672-1-1.5z"}}]})(props);
};
function ImShocked2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM5 7c-0.552 0-1-0.672-1-1.5s0.448-1.5 1-1.5 1 0.672 1 1.5-0.448 1.5-1 1.5zM8 13c-1.105 0-2-0.895-2-2s0.895-2 2-2c1.105 0 2 0.895 2 2s-0.895 2-2 2zM11 7c-0.552 0-1-0.672-1-1.5s0.448-1.5 1-1.5 1 0.672 1 1.5-0.448 1.5-1 1.5z"}}]})(props);
};
function ImBaffled (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5z"}},{"tag":"path","attr":{"d":"M6 6.5c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5z"}},{"tag":"path","attr":{"d":"M5.5 5c0.828 0 1.5 0.672 1.5 1.5s-0.672 1.5-1.5 1.5-1.5-0.672-1.5-1.5 0.672-1.5 1.5-1.5zM5.5 4c-1.378 0-2.5 1.122-2.5 2.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5-1.122-2.5-2.5-2.5v0z"}},{"tag":"path","attr":{"d":"M11 6.5c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5z"}},{"tag":"path","attr":{"d":"M10.5 5c0.828 0 1.5 0.672 1.5 1.5s-0.672 1.5-1.5 1.5-1.5-0.672-1.5-1.5 0.672-1.5 1.5-1.5zM10.5 4c-1.379 0-2.5 1.122-2.5 2.5s1.121 2.5 2.5 2.5 2.5-1.122 2.5-2.5-1.121-2.5-2.5-2.5v0z"}},{"tag":"path","attr":{"d":"M6 11h4v1h-4v-1z"}}]})(props);
};
function ImBaffled2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 6.5c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5 0.224-0.5 0.5-0.5 0.5 0.224 0.5 0.5z"}},{"tag":"path","attr":{"d":"M11 6.5c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5 0.224-0.5 0.5-0.5 0.5 0.224 0.5 0.5z"}},{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM4 6.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5-0.672 1.5-1.5 1.5-1.5-0.672-1.5-1.5zM10 12h-4v-1h4v1zM10.5 8c-0.828 0-1.5-0.672-1.5-1.5s0.672-1.5 1.5-1.5 1.5 0.672 1.5 1.5-0.672 1.5-1.5 1.5z"}}]})(props);
};
function ImConfused (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM4 5c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM10 5c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM11.345 10h1.014c0.144 1.133-0.507 2.258-1.624 2.665-1.295 0.472-2.733-0.199-3.204-1.494-0.283-0.777-1.145-1.179-1.923-0.896-0.712 0.259-1.109 1.005-0.953 1.725h-1.013c-0.144-1.133 0.507-2.258 1.624-2.665 1.295-0.472 2.733 0.199 3.204 1.494 0.283 0.777 1.145 1.179 1.923 0.896 0.712-0.259 1.109-1.005 0.953-1.725z"}}]})(props);
};
function ImConfused2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.418 0 8-3.582 8-8s-3.582-8-8-8zM11 4c0.552 0 1 0.448 1 1s-0.448 1-1 1-1-0.448-1-1c0-0.552 0.448-1 1-1zM5 4c0.552 0 1 0.448 1 1s-0.448 1-1 1-1-0.448-1-1c0-0.552 0.448-1 1-1zM10.735 12.665c-1.295 0.472-2.733-0.199-3.204-1.494-0.283-0.777-1.145-1.179-1.923-0.896-0.712 0.259-1.109 1.005-0.953 1.725h-1.013c-0.144-1.133 0.507-2.258 1.624-2.665 1.295-0.472 2.733 0.199 3.204 1.494 0.283 0.777 1.145 1.179 1.923 0.896 0.712-0.259 1.109-1.005 0.953-1.725h1.014c0.144 1.133-0.507 2.258-1.624 2.665z"}}]})(props);
};
function ImNeutral (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM4 5c0 0.552 0.448 1 1 1s1-0.448 1-1-0.448-1-1-1-1 0.448-1 1zM10 5c0 0.552 0.448 1 1 1s1-0.448 1-1-0.448-1-1-1-1 0.448-1 1zM6 11h4v1h-4v-1z"}}]})(props);
};
function ImNeutral2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.418 0 8-3.582 8-8s-3.582-8-8-8zM10 12h-4v-1h4v1zM11 4c0.552 0 1 0.448 1 1s-0.448 1-1 1-1-0.448-1-1c0-0.552 0.448-1 1-1zM5 4c0.552 0 1 0.448 1 1s-0.448 1-1 1-1-0.448-1-1c0-0.552 0.448-1 1-1z"}}]})(props);
};
function ImHipster (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM4 5c0-0.552 0.448-1 1-1s1 0.448 1 1-0.448 1-1 1-1-0.448-1-1zM10 5c0-0.552 0.448-1 1-1s1 0.448 1 1-0.448 1-1 1-1-0.448-1-1z"}},{"tag":"path","attr":{"d":"M10.561 8.439c-0.586-0.586-1.536-0.586-2.121 0s-0.586 1.536 0 2.121c0.019 0.019 0.038 0.037 0.058 0.055 1.352 1.227 4.503-0.029 4.503-1.615-0.969 0.625-1.726 0.153-2.439-0.561z"}},{"tag":"path","attr":{"d":"M5.439 8.439c0.586-0.586 1.536-0.586 2.121 0s0.586 1.536 0 2.121c-0.019 0.019-0.038 0.037-0.058 0.055-1.352 1.227-4.503-0.029-4.503-1.615 0.969 0.625 1.726 0.153 2.439-0.561z"}}]})(props);
};
function ImHipster2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM11 4c0.552 0 1 0.448 1 1s-0.448 1-1 1-1-0.448-1-1 0.448-1 1-1zM5 4c0.552 0 1 0.448 1 1s-0.448 1-1 1-1-0.448-1-1 0.448-1 1-1zM8.497 10.615c-0.020-0.018-0.039-0.036-0.058-0.055-0.293-0.293-0.439-0.677-0.439-1.060-0 0.384-0.146 0.768-0.439 1.060-0.019 0.019-0.038 0.037-0.058 0.055-1.352 1.227-4.503-0.029-4.503-1.615 0.969 0.625 1.726 0.153 2.439-0.561 0.586-0.586 1.536-0.586 2.121 0 0.293 0.293 0.439 0.677 0.439 1.060 0-0.384 0.146-0.768 0.439-1.060 0.586-0.586 1.536-0.586 2.121 0 0.713 0.714 1.471 1.186 2.439 0.561 0 1.586-3.151 2.842-4.503 1.615z"}}]})(props);
};
function ImWondering (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM11.652 9.4l0.351 1.2-6.828 2-0.351-1.2zM4 5c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM10 5c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1z"}}]})(props);
};
function ImWondering2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM11 4c0.552 0 1 0.448 1 1s-0.448 1-1 1-1-0.448-1-1 0.448-1 1-1zM4 5c0-0.552 0.448-1 1-1s1 0.448 1 1-0.448 1-1 1-1-0.448-1-1zM5.176 12.6l-0.351-1.2 6.828-2 0.351 1.2-6.828 2z"}}]})(props);
};
function ImSleepy (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5z"}},{"tag":"path","attr":{"d":"M10 10.5c0 1.381-0.895 2.5-2 2.5s-2-1.119-2-2.5c0-1.381 0.895-2.5 2-2.5s2 1.119 2 2.5z"}},{"tag":"path","attr":{"d":"M6.5 5.313c-0.128 0-0.256-0.049-0.354-0.146-0.302-0.302-0.991-0.302-1.293 0-0.195 0.195-0.512 0.195-0.707 0s-0.195-0.512 0-0.707c0.696-0.696 2.011-0.696 2.707 0 0.195 0.195 0.195 0.512 0 0.707-0.098 0.098-0.226 0.146-0.354 0.146z"}},{"tag":"path","attr":{"d":"M11.5 5.313c-0.128 0-0.256-0.049-0.354-0.146-0.302-0.302-0.991-0.302-1.293 0-0.195 0.195-0.512 0.195-0.707 0s-0.195-0.512 0-0.707c0.696-0.696 2.011-0.696 2.707 0 0.195 0.195 0.195 0.512 0 0.707-0.098 0.098-0.226 0.146-0.354 0.146z"}}]})(props);
};
function ImSleepy2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM4.854 5.166c-0.195 0.195-0.512 0.195-0.707 0s-0.195-0.512 0-0.707c0.696-0.696 2.011-0.696 2.707 0 0.195 0.195 0.195 0.512 0 0.707-0.098 0.098-0.226 0.146-0.354 0.146s-0.256-0.049-0.354-0.146c-0.302-0.302-0.991-0.302-1.293 0zM8 13c-1.105 0-2-1.119-2-2.5s0.895-2.5 2-2.5 2 1.119 2 2.5-0.895 2.5-2 2.5zM11.854 5.166c-0.098 0.098-0.226 0.146-0.354 0.146s-0.256-0.049-0.354-0.146c-0.302-0.302-0.991-0.302-1.293 0-0.195 0.195-0.512 0.195-0.707 0s-0.195-0.512 0-0.707c0.696-0.696 2.011-0.696 2.707 0 0.195 0.195 0.195 0.512 0 0.707z"}}]})(props);
};
function ImFrustrated (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5.724 4.428c-0.543-0.271-1.080-0.407-1.102-0.413-0.268-0.067-0.539 0.096-0.606 0.364s0.096 0.539 0.364 0.606c0.275 0.070 0.602 0.189 0.89 0.334-0.166 0.179-0.268 0.418-0.268 0.681 0 0.552 0.448 1 1 1s1-0.448 1-1c0-0.018-0.001-0.036-0.002-0.054-0.032-0.741-0.706-1.234-1.275-1.518z"}},{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM3.695 12.87c0.167 0.083 0.356 0.13 0.555 0.13h7.5c0.199 0 0.387-0.047 0.555-0.13-1.147 1.014-2.654 1.63-4.305 1.63s-3.158-0.616-4.305-1.63zM4 11.75v-1.5c0-0.136 0.114-0.25 0.25-0.25h1.75v2h-1.75c-0.136 0-0.25-0.114-0.25-0.25zM7 12v-2h2v2h-2zM10 12v-2h1.75c0.136 0 0.25 0.114 0.25 0.25v1.5c0 0.136-0.114 0.25-0.25 0.25h-1.75zM12.87 12.305c0.083-0.167 0.13-0.356 0.13-0.555v-1.5c0-0.689-0.561-1.25-1.25-1.25h-7.5c-0.689 0-1.25 0.561-1.25 1.25v1.5c0 0.199 0.047 0.387 0.13 0.555-1.014-1.147-1.63-2.654-1.63-4.305 0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5c0 1.651-0.616 3.158-1.63 4.305z"}},{"tag":"path","attr":{"d":"M11.379 4.015c-0.023 0.006-0.559 0.141-1.102 0.413-0.568 0.284-1.243 0.776-1.275 1.518-0.001 0.018-0.002 0.036-0.002 0.054 0 0.552 0.448 1 1 1s1-0.448 1-1c0-0.263-0.102-0.503-0.268-0.681 0.288-0.144 0.614-0.264 0.89-0.334 0.268-0.067 0.431-0.338 0.364-0.606s-0.338-0.431-0.606-0.364z"}}]})(props);
};
function ImFrustrated2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 10.25v1.5c0 0.136 0.114 0.25 0.25 0.25h1.75v-2h-1.75c-0.136 0-0.25 0.114-0.25 0.25z"}},{"tag":"path","attr":{"d":"M7 10h2v2h-2v-2z"}},{"tag":"path","attr":{"d":"M11.75 10h-1.75v2h1.75c0.136 0 0.25-0.114 0.25-0.25v-1.5c0-0.136-0.114-0.25-0.25-0.25z"}},{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM9.002 5.946c0.032-0.741 0.706-1.234 1.275-1.518 0.543-0.271 1.080-0.407 1.102-0.413 0.268-0.067 0.539 0.096 0.606 0.364s-0.096 0.539-0.364 0.606c-0.275 0.070-0.602 0.189-0.89 0.334 0.166 0.179 0.268 0.418 0.268 0.681 0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.018 0.001-0.036 0.002-0.054zM4.015 4.379c0.067-0.268 0.338-0.431 0.606-0.364 0.023 0.006 0.559 0.141 1.102 0.413 0.568 0.284 1.243 0.776 1.275 1.518 0.001 0.018 0.002 0.036 0.002 0.054 0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.263 0.102-0.503 0.268-0.681-0.288-0.144-0.614-0.264-0.89-0.334-0.268-0.067-0.431-0.338-0.364-0.606zM13 11.75c0 0.689-0.561 1.25-1.25 1.25h-7.5c-0.689 0-1.25-0.561-1.25-1.25v-1.5c0-0.689 0.561-1.25 1.25-1.25h7.5c0.689 0 1.25 0.561 1.25 1.25v1.5z"}}]})(props);
};
function ImCrying (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5z"}},{"tag":"path","attr":{"d":"M12.5 6h-2c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h2c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M5.5 6h-2c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h2c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M9.5 13.375c-0.128 0-0.256-0.049-0.354-0.146-0.072-0.072-0.46-0.229-1.146-0.229s-1.075 0.157-1.146 0.229c-0.195 0.195-0.512 0.195-0.707 0s-0.195-0.512 0-0.707c0.471-0.471 1.453-0.521 1.854-0.521s1.383 0.051 1.854 0.521c0.195 0.195 0.195 0.512 0 0.707-0.098 0.098-0.226 0.146-0.354 0.146z"}},{"tag":"path","attr":{"d":"M11.5 9c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v1c0 0.276-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M11.5 12c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v1c0 0.276-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M4.5 9c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v1c0 0.276-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M4.5 12c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v1c0 0.276-0.224 0.5-0.5 0.5z"}}]})(props);
};
function ImCrying2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM5 11.5c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v1zM5 8.5c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v1zM5.5 6h-2c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h2c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5zM9.854 13.229c-0.098 0.098-0.226 0.146-0.354 0.146s-0.256-0.049-0.354-0.146c-0.072-0.072-0.46-0.229-1.146-0.229s-1.075 0.157-1.146 0.229c-0.195 0.195-0.512 0.195-0.707 0s-0.195-0.512 0-0.707c0.471-0.471 1.453-0.521 1.854-0.521s1.383 0.051 1.854 0.521c0.195 0.195 0.195 0.512 0 0.707zM12 11.5c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v1zM12 8.5c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v1zM12.5 6h-2c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h2c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z"}}]})(props);
};
function ImPointUp (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15 9.5v-2.5c0-0.827-0.673-1.5-1.5-1.5-0.267 0-0.518 0.070-0.736 0.193-0.267-0.417-0.734-0.693-1.264-0.693-0.384 0-0.734 0.145-1 0.383-0.266-0.238-0.616-0.383-1-0.383-0.175 0-0.344 0.030-0.5 0.086v-3.586c0-0.827-0.673-1.5-1.5-1.5s-1.5 0.673-1.5 1.5v6.167l-2.75-1.466c-0.227-0.131-0.486-0.201-0.75-0.201-0.827 0-1.5 0.673-1.5 1.5 0 0.412 0.164 0.796 0.461 1.082 0.004 0.004 0.008 0.007 0.012 0.011l3.737 3.407h-0.71c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.276 0.224 0.5 0.5 0.5h10c0.276 0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5h-0.691l1.138-2.276c0.035-0.069 0.053-0.146 0.053-0.224zM14 13.5c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5 0.224-0.5 0.5-0.5 0.5 0.224 0.5 0.5zM14 9.382l-1.309 2.618h-5.997l-4.544-4.143c-0.097-0.095-0.15-0.221-0.15-0.357 0-0.276 0.224-0.5 0.5-0.5 0.085 0 0.166 0.020 0.239 0.061 0.008 0.005 0.017 0.010 0.025 0.014l3.5 1.866c0.155 0.083 0.342 0.078 0.492-0.012s0.243-0.253 0.243-0.429v-7c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v5c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v0.5c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v2.382z"}}]})(props);
};
function ImPointRight (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.5 15h2.5c0.827 0 1.5-0.673 1.5-1.5 0-0.267-0.070-0.518-0.193-0.736 0.417-0.267 0.693-0.734 0.693-1.264 0-0.384-0.145-0.734-0.383-1 0.238-0.266 0.383-0.616 0.383-1 0-0.175-0.030-0.344-0.086-0.5h3.586c0.827 0 1.5-0.673 1.5-1.5s-0.673-1.5-1.5-1.5h-6.167l1.466-2.75c0.131-0.227 0.201-0.486 0.201-0.75 0-0.827-0.673-1.5-1.5-1.5-0.412 0-0.796 0.164-1.082 0.461-0.004 0.004-0.007 0.008-0.011 0.012l-3.407 3.737v-0.71c0-0.276-0.224-0.5-0.5-0.5h-3c-0.276 0-0.5 0.224-0.5 0.5v10c0 0.276 0.224 0.5 0.5 0.5h3c0.276 0 0.5-0.224 0.5-0.5v-0.691l2.276 1.138c0.069 0.035 0.146 0.053 0.224 0.053zM2.5 14c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5 0.5 0.224 0.5 0.5-0.224 0.5-0.5 0.5zM6.618 14l-2.618-1.309v-5.997l4.143-4.544c0.095-0.097 0.221-0.15 0.357-0.15 0.276 0 0.5 0.224 0.5 0.5 0 0.085-0.020 0.166-0.061 0.239-0.005 0.008-0.010 0.017-0.014 0.025l-1.866 3.5c-0.083 0.155-0.078 0.342 0.013 0.492s0.253 0.243 0.429 0.243h7c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5h-5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5h-0.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5h-2.382z"}}]})(props);
};
function ImPointDown (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15 6.5v2.5c0 0.827-0.673 1.5-1.5 1.5-0.267 0-0.518-0.070-0.736-0.193-0.267 0.417-0.734 0.693-1.264 0.693-0.384 0-0.734-0.145-1-0.383-0.266 0.238-0.616 0.383-1 0.383-0.175 0-0.344-0.030-0.5-0.086v3.586c0 0.827-0.673 1.5-1.5 1.5s-1.5-0.673-1.5-1.5v-6.167l-2.75 1.466c-0.227 0.131-0.486 0.201-0.75 0.201-0.827 0-1.5-0.673-1.5-1.5 0-0.412 0.164-0.796 0.461-1.082 0.004-0.004 0.008-0.007 0.012-0.011l3.737-3.407h-0.71c-0.276 0-0.5-0.224-0.5-0.5v-3c0-0.276 0.224-0.5 0.5-0.5h10c0.276 0 0.5 0.224 0.5 0.5v3c0 0.276-0.224 0.5-0.5 0.5h-0.691l1.138 2.276c0.035 0.069 0.053 0.146 0.053 0.224zM14 2.5c0-0.276-0.224-0.5-0.5-0.5s-0.5 0.224-0.5 0.5 0.224 0.5 0.5 0.5 0.5-0.224 0.5-0.5zM14 6.618l-1.309-2.618h-5.997l-4.544 4.143c-0.097 0.095-0.15 0.221-0.15 0.357 0 0.276 0.224 0.5 0.5 0.5 0.085 0 0.166-0.020 0.239-0.061 0.008-0.005 0.017-0.010 0.025-0.014l3.5-1.866c0.155-0.083 0.342-0.078 0.492 0.013s0.243 0.253 0.243 0.429v7c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5v-5c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5v-0.5c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5v-2.382z"}}]})(props);
};
function ImPointLeft (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9.5 15h-2.5c-0.827 0-1.5-0.673-1.5-1.5 0-0.267 0.070-0.518 0.193-0.736-0.417-0.267-0.693-0.734-0.693-1.264 0-0.384 0.145-0.734 0.383-1-0.238-0.266-0.383-0.616-0.383-1 0-0.175 0.030-0.344 0.086-0.5h-3.586c-0.827 0-1.5-0.673-1.5-1.5s0.673-1.5 1.5-1.5h6.167l-1.466-2.75c-0.131-0.227-0.201-0.486-0.201-0.75 0-0.827 0.673-1.5 1.5-1.5 0.412 0 0.796 0.164 1.082 0.461 0.004 0.004 0.007 0.008 0.011 0.012l3.407 3.737v-0.71c0-0.276 0.224-0.5 0.5-0.5h3c0.276 0 0.5 0.224 0.5 0.5v10c0 0.276-0.224 0.5-0.5 0.5h-3c-0.276 0-0.5-0.224-0.5-0.5v-0.691l-2.276 1.138c-0.069 0.035-0.146 0.053-0.224 0.053zM13.5 14c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5-0.5 0.224-0.5 0.5 0.224 0.5 0.5 0.5zM9.382 14l2.618-1.309v-5.997l-4.143-4.544c-0.095-0.097-0.221-0.15-0.357-0.15-0.276 0-0.5 0.224-0.5 0.5 0 0.085 0.020 0.166 0.061 0.239 0.005 0.008 0.010 0.017 0.014 0.025l1.866 3.5c0.083 0.155 0.078 0.342-0.012 0.492s-0.253 0.243-0.429 0.243h-7c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h5c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h0.5c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h2.382z"}}]})(props);
};
function ImWarning (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 1.45l6.705 13.363h-13.409l6.705-13.363zM8 0c-0.345 0-0.69 0.233-0.951 0.698l-6.829 13.611c-0.523 0.93-0.078 1.691 0.989 1.691h13.583c1.067 0 1.512-0.761 0.989-1.691h0l-6.829-13.611c-0.262-0.465-0.606-0.698-0.951-0.698v0z"}},{"tag":"path","attr":{"d":"M9 13c0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.552 0.448-1 1-1s1 0.448 1 1z"}},{"tag":"path","attr":{"d":"M8 11c-0.552 0-1-0.448-1-1v-3c0-0.552 0.448-1 1-1s1 0.448 1 1v3c0 0.552-0.448 1-1 1z"}}]})(props);
};
function ImNotification (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 1.5c-1.736 0-3.369 0.676-4.596 1.904s-1.904 2.86-1.904 4.596c0 1.736 0.676 3.369 1.904 4.596s2.86 1.904 4.596 1.904c1.736 0 3.369-0.676 4.596-1.904s1.904-2.86 1.904-4.596c0-1.736-0.676-3.369-1.904-4.596s-2.86-1.904-4.596-1.904zM8 0v0c4.418 0 8 3.582 8 8s-3.582 8-8 8c-4.418 0-8-3.582-8-8s3.582-8 8-8zM7 11h2v2h-2zM7 3h2v6h-2z"}}]})(props);
};
function ImQuestion (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7 11h2v2h-2zM11 4c0.552 0 1 0.448 1 1v3l-3 2h-2v-1l3-2v-1h-5v-2h6zM8 1.5c-1.736 0-3.369 0.676-4.596 1.904s-1.904 2.86-1.904 4.596c0 1.736 0.676 3.369 1.904 4.596s2.86 1.904 4.596 1.904c1.736 0 3.369-0.676 4.596-1.904s1.904-2.86 1.904-4.596c0-1.736-0.676-3.369-1.904-4.596s-2.86-1.904-4.596-1.904zM8 0v0c4.418 0 8 3.582 8 8s-3.582 8-8 8c-4.418 0-8-3.582-8-8s3.582-8 8-8z"}}]})(props);
};
function ImPlus (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.5 6h-5.5v-5.5c0-0.276-0.224-0.5-0.5-0.5h-3c-0.276 0-0.5 0.224-0.5 0.5v5.5h-5.5c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.276 0.224 0.5 0.5 0.5h5.5v5.5c0 0.276 0.224 0.5 0.5 0.5h3c0.276 0 0.5-0.224 0.5-0.5v-5.5h5.5c0.276 0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5z"}}]})(props);
};
function ImMinus (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 6.5v3c0 0.276 0.224 0.5 0.5 0.5h15c0.276 0 0.5-0.224 0.5-0.5v-3c0-0.276-0.224-0.5-0.5-0.5h-15c-0.276 0-0.5 0.224-0.5 0.5z"}}]})(props);
};
function ImInfo (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7 4.75c0-0.412 0.338-0.75 0.75-0.75h0.5c0.412 0 0.75 0.338 0.75 0.75v0.5c0 0.412-0.338 0.75-0.75 0.75h-0.5c-0.412 0-0.75-0.338-0.75-0.75v-0.5z"}},{"tag":"path","attr":{"d":"M10 12h-4v-1h1v-3h-1v-1h3v4h1z"}},{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"}}]})(props);
};
function ImCancelCircle (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"}},{"tag":"path","attr":{"d":"M10.5 4l-2.5 2.5-2.5-2.5-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 2.5-2.5 2.5 2.5 1.5-1.5-2.5-2.5 2.5-2.5z"}}]})(props);
};
function ImBlocked (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.657 2.343c-1.511-1.511-3.52-2.343-5.657-2.343s-4.146 0.832-5.657 2.343c-1.511 1.511-2.343 3.52-2.343 5.657s0.832 4.146 2.343 5.657c1.511 1.511 3.52 2.343 5.657 2.343s4.146-0.832 5.657-2.343c1.511-1.511 2.343-3.52 2.343-5.657s-0.832-4.146-2.343-5.657zM14 8c0 1.294-0.412 2.494-1.111 3.475l-8.364-8.364c0.981-0.699 2.181-1.111 3.475-1.111 3.308 0 6 2.692 6 6zM2 8c0-1.294 0.412-2.494 1.111-3.475l8.364 8.364c-0.981 0.699-2.181 1.111-3.475 1.111-3.308 0-6-2.692-6-6z"}}]})(props);
};
function ImCross (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.854 12.854c-0-0-0-0-0-0l-4.854-4.854 4.854-4.854c0-0 0-0 0-0 0.052-0.052 0.090-0.113 0.114-0.178 0.066-0.178 0.028-0.386-0.114-0.529l-2.293-2.293c-0.143-0.143-0.351-0.181-0.529-0.114-0.065 0.024-0.126 0.062-0.178 0.114 0 0-0 0-0 0l-4.854 4.854-4.854-4.854c-0-0-0-0-0-0-0.052-0.052-0.113-0.090-0.178-0.114-0.178-0.066-0.386-0.029-0.529 0.114l-2.293 2.293c-0.143 0.143-0.181 0.351-0.114 0.529 0.024 0.065 0.062 0.126 0.114 0.178 0 0 0 0 0 0l4.854 4.854-4.854 4.854c-0 0-0 0-0 0-0.052 0.052-0.090 0.113-0.114 0.178-0.066 0.178-0.029 0.386 0.114 0.529l2.293 2.293c0.143 0.143 0.351 0.181 0.529 0.114 0.065-0.024 0.126-0.062 0.178-0.114 0-0 0-0 0-0l4.854-4.854 4.854 4.854c0 0 0 0 0 0 0.052 0.052 0.113 0.090 0.178 0.114 0.178 0.066 0.386 0.029 0.529-0.114l2.293-2.293c0.143-0.143 0.181-0.351 0.114-0.529-0.024-0.065-0.062-0.126-0.114-0.178z"}}]})(props);
};
function ImCheckmark (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.5 2l-7.5 7.5-3.5-3.5-2.5 2.5 6 6 10-10z"}}]})(props);
};
function ImCheckmark2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.21 14.339l-6.217-6.119 3.084-3.035 3.133 3.083 6.713-6.607 3.084 3.035-9.797 9.643zM1.686 8.22l4.524 4.453 8.104-7.976-1.391-1.369-6.713 6.607-3.133-3.083-1.391 1.369z"}}]})(props);
};
function ImSpellCheck (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M2 4h2v3h1v-6c0-0.55-0.45-1-1-1h-2c-0.55 0-1 0.45-1 1v6h1v-3zM2 1h2v2h-2v-2zM15 1v-1h-3c-0.55 0-1 0.45-1 1v5c0 0.55 0.45 1 1 1h3v-1h-3v-5h3zM10 2.5v-1.5c0-0.55-0.45-1-1-1h-3v7h3c0.55 0 1-0.45 1-1v-1.5c0-0.55-0.137-1-0.688-1 0.55 0 0.688-0.45 0.688-1zM9 6h-2v-2h2v2zM9 3h-2v-2h2v2zM13 9l-6.5 7-3.5-4.5 1.281-1.094 2.219 2.313 5.5-4.719z"}}]})(props);
};
function ImEnter (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 8h-5v-2h5v-2l3 3-3 3zM16 0v13l-6 3v-3h-6v-4h1v3h5v-9l4-2h-9v4h-1v-5z"}}]})(props);
};
function ImExit (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12 10v-2h-5v-2h5v-2l3 3zM11 9v4h-5v3l-6-3v-13h11v5h-1v-4h-8l4 2v9h4v-3z"}}]})(props);
};
function ImPlay2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5zM6 4.5l6 3.5-6 3.5z"}}]})(props);
};
function ImPause (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5zM5 5h2v6h-2zM9 5h2v6h-2z"}}]})(props);
};
function ImStop (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5zM5 5h6v6h-6z"}}]})(props);
};
function ImPrevious (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"}},{"tag":"path","attr":{"d":"M7 8l4-3v6z"}},{"tag":"path","attr":{"d":"M5 5h2v6h-2v-6z"}}]})(props);
};
function ImNext (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zM8 14.5c3.59 0 6.5-2.91 6.5-6.5s-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5 2.91 6.5 6.5 6.5z"}},{"tag":"path","attr":{"d":"M9 8l-4-3v6z"}},{"tag":"path","attr":{"d":"M11 5h-2v6h2v-6z"}}]})(props);
};
function ImBackward (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5zM11 10.5l-3.5-2.5 3.5-2.5zM7 10.5l-3.5-2.5 3.5-2.5z"}}]})(props);
};
function ImForward2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5zM5 5.5l3.5 2.5-3.5 2.5zM9 5.5l3.5 2.5-3.5 2.5z"}}]})(props);
};
function ImPlay3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3 2l10 6-10 6z"}}]})(props);
};
function ImPause2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M2 2h5v12h-5zM9 2h5v12h-5z"}}]})(props);
};
function ImStop2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M2 2h12v12h-12z"}}]})(props);
};
function ImBackward2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9 2.5v5l5-5v11l-5-5v5l-5.5-5.5z"}}]})(props);
};
function ImForward3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 13.5v-5l-5 5v-11l5 5v-5l5.5 5.5z"}}]})(props);
};
function ImFirst (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M2 14v-12h2v5.5l5-5v5l5-5v11l-5-5v5l-5-5v5.5z"}}]})(props);
};
function ImLast (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 2v12h-2v-5.5l-5 5v-5l-5 5v-11l5 5v-5l5 5v-5.5z"}}]})(props);
};
function ImPrevious2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 14v-12h2v5.5l5-5v11l-5-5v5.5z"}}]})(props);
};
function ImNext2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12 2v12h-2v-5.5l-5 5v-11l5 5v-5.5z"}}]})(props);
};
function ImEject (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 12h16v2h-16zM8 2l8 8h-16z"}}]})(props);
};
function ImVolumeHigh (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 17 16"},"child":[{"tag":"path","attr":{"d":"M13.907 14.407c-0.192 0-0.384-0.073-0.53-0.22-0.293-0.293-0.293-0.768 0-1.061 1.369-1.369 2.123-3.19 2.123-5.127s-0.754-3.757-2.123-5.127c-0.293-0.293-0.293-0.768 0-1.061s0.768-0.293 1.061 0c1.653 1.653 2.563 3.85 2.563 6.187s-0.91 4.534-2.563 6.187c-0.146 0.146-0.338 0.22-0.53 0.22zM11.243 12.993c-0.192 0-0.384-0.073-0.53-0.22-0.293-0.293-0.293-0.768 0-1.061 2.047-2.047 2.047-5.378 0-7.425-0.293-0.293-0.293-0.768 0-1.061s0.768-0.293 1.061 0c1.275 1.275 1.977 2.97 1.977 4.773s-0.702 3.498-1.977 4.773c-0.146 0.146-0.338 0.22-0.53 0.22v0zM8.578 11.578c-0.192 0-0.384-0.073-0.53-0.22-0.293-0.293-0.293-0.768 0-1.061 1.267-1.267 1.267-3.329 0-4.596-0.293-0.293-0.293-0.768 0-1.061s0.768-0.293 1.061 0c1.852 1.852 1.852 4.865 0 6.718-0.146 0.146-0.338 0.22-0.53 0.22z"}},{"tag":"path","attr":{"d":"M6.5 15c-0.13 0-0.258-0.051-0.354-0.146l-3.854-3.854h-1.793c-0.276 0-0.5-0.224-0.5-0.5v-5c0-0.276 0.224-0.5 0.5-0.5h1.793l3.854-3.854c0.143-0.143 0.358-0.186 0.545-0.108s0.309 0.26 0.309 0.462v13c0 0.202-0.122 0.385-0.309 0.462-0.062 0.026-0.127 0.038-0.191 0.038z"}}]})(props);
};
function ImVolumeMedium (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.243 12.993c-0.192 0-0.384-0.073-0.53-0.22-0.293-0.293-0.293-0.768 0-1.061 2.047-2.047 2.047-5.378 0-7.425-0.293-0.293-0.293-0.768 0-1.061s0.768-0.293 1.061 0c1.275 1.275 1.977 2.97 1.977 4.773s-0.702 3.498-1.977 4.773c-0.146 0.146-0.338 0.22-0.53 0.22v0zM8.578 11.578c-0.192 0-0.384-0.073-0.53-0.22-0.293-0.293-0.293-0.768 0-1.061 1.267-1.267 1.267-3.329 0-4.596-0.293-0.293-0.293-0.768 0-1.061s0.768-0.293 1.061 0c1.852 1.852 1.852 4.865 0 6.718-0.146 0.146-0.338 0.22-0.53 0.22z"}},{"tag":"path","attr":{"d":"M6.5 15c-0.13 0-0.258-0.051-0.354-0.146l-3.854-3.854h-1.793c-0.276 0-0.5-0.224-0.5-0.5v-5c0-0.276 0.224-0.5 0.5-0.5h1.793l3.854-3.854c0.143-0.143 0.358-0.186 0.545-0.108s0.309 0.26 0.309 0.462v13c0 0.202-0.122 0.385-0.309 0.462-0.062 0.026-0.127 0.038-0.191 0.038z"}}]})(props);
};
function ImVolumeLow (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8.578 11.578c-0.192 0-0.384-0.073-0.53-0.22-0.293-0.293-0.293-0.768 0-1.061 1.267-1.267 1.267-3.329 0-4.596-0.293-0.293-0.293-0.768 0-1.061s0.768-0.293 1.061 0c1.852 1.852 1.852 4.865 0 6.718-0.146 0.146-0.338 0.22-0.53 0.22z"}},{"tag":"path","attr":{"d":"M6.5 15c-0.13 0-0.258-0.051-0.354-0.146l-3.854-3.854h-1.793c-0.276 0-0.5-0.224-0.5-0.5v-5c0-0.276 0.224-0.5 0.5-0.5h1.793l3.854-3.854c0.143-0.143 0.358-0.186 0.545-0.108s0.309 0.26 0.309 0.462v13c0 0.202-0.122 0.385-0.309 0.462-0.062 0.026-0.127 0.038-0.191 0.038z"}}]})(props);
};
function ImVolumeMute (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.5 15c-0.13 0-0.258-0.051-0.354-0.146l-3.854-3.854h-1.793c-0.276 0-0.5-0.224-0.5-0.5v-5c0-0.276 0.224-0.5 0.5-0.5h1.793l3.854-3.854c0.143-0.143 0.358-0.186 0.545-0.108s0.309 0.26 0.309 0.462v13c0 0.202-0.122 0.385-0.309 0.462-0.062 0.026-0.127 0.038-0.191 0.038z"}}]})(props);
};
function ImVolumeMute2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15 9.674v1.326h-1.326l-1.674-1.674-1.674 1.674h-1.326v-1.326l1.674-1.674-1.674-1.674v-1.326h1.326l1.674 1.674 1.674-1.674h1.326v1.326l-1.674 1.674 1.674 1.674z"}},{"tag":"path","attr":{"d":"M6.5 15c-0.13 0-0.258-0.051-0.354-0.146l-3.854-3.854h-1.793c-0.276 0-0.5-0.224-0.5-0.5v-5c0-0.276 0.224-0.5 0.5-0.5h1.793l3.854-3.854c0.143-0.143 0.358-0.186 0.545-0.108s0.309 0.26 0.309 0.462v13c0 0.202-0.122 0.385-0.309 0.462-0.062 0.026-0.127 0.038-0.191 0.038z"}}]})(props);
};
function ImVolumeIncrease (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 9h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"}},{"tag":"path","attr":{"d":"M6.5 15c-0.13 0-0.258-0.051-0.354-0.146l-3.854-3.854h-1.793c-0.276 0-0.5-0.224-0.5-0.5v-5c0-0.276 0.224-0.5 0.5-0.5h1.793l3.854-3.854c0.143-0.143 0.358-0.186 0.545-0.108s0.309 0.26 0.309 0.462v13c0 0.202-0.122 0.385-0.309 0.462-0.062 0.026-0.127 0.038-0.191 0.038z"}}]})(props);
};
function ImVolumeDecrease (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 7h8v2h-8v-2z"}},{"tag":"path","attr":{"d":"M6.5 15c-0.13 0-0.258-0.051-0.354-0.146l-3.854-3.854h-1.793c-0.276 0-0.5-0.224-0.5-0.5v-5c0-0.276 0.224-0.5 0.5-0.5h1.793l3.854-3.854c0.143-0.143 0.358-0.186 0.545-0.108s0.309 0.26 0.309 0.462v13c0 0.202-0.122 0.385-0.309 0.462-0.062 0.026-0.127 0.038-0.191 0.038z"}}]})(props);
};
function ImLoop (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M2 5h10v3l4-4-4-4v3h-12v6h2zM14 11h-10v-3l-4 4 4 4v-3h12v-6h-2z"}}]})(props);
};
function ImLoop2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.901 2.599c-1.463-1.597-3.565-2.599-5.901-2.599-4.418 0-8 3.582-8 8h1.5c0-3.59 2.91-6.5 6.5-6.5 1.922 0 3.649 0.835 4.839 2.161l-2.339 2.339h5.5v-5.5l-2.099 2.099z"}},{"tag":"path","attr":{"d":"M14.5 8c0 3.59-2.91 6.5-6.5 6.5-1.922 0-3.649-0.835-4.839-2.161l2.339-2.339h-5.5v5.5l2.099-2.099c1.463 1.597 3.565 2.599 5.901 2.599 4.418 0 8-3.582 8-8h-1.5z"}}]})(props);
};
function ImInfinite (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.25 11.75c-1.002 0-1.943-0.39-2.652-1.098l-1.598-1.598-1.598 1.598c-0.708 0.708-1.65 1.098-2.652 1.098s-1.944-0.39-2.652-1.098c-0.708-0.708-1.098-1.65-1.098-2.652s0.39-1.943 1.098-2.652c0.708-0.708 1.65-1.098 2.652-1.098s1.943 0.39 2.652 1.098l1.598 1.598 1.598-1.598c0.708-0.708 1.65-1.098 2.652-1.098s1.944 0.39 2.652 1.098c0.708 0.708 1.098 1.65 1.098 2.652s-0.39 1.943-1.098 2.652c-0.708 0.708-1.65 1.098-2.652 1.098zM10.652 9.598c0.427 0.427 0.994 0.662 1.598 0.662s1.171-0.235 1.598-0.662c0.427-0.427 0.662-0.994 0.662-1.598s-0.235-1.171-0.662-1.598c-0.427-0.427-0.994-0.662-1.598-0.662s-1.171 0.235-1.598 0.662l-1.598 1.598 1.598 1.598zM3.75 5.74c-0.604 0-1.171 0.235-1.598 0.662s-0.662 0.994-0.662 1.598c0 0.604 0.235 1.171 0.662 1.598s0.994 0.662 1.598 0.662c0.604 0 1.171-0.235 1.598-0.662l1.598-1.598-1.598-1.598c-0.427-0.427-0.994-0.662-1.598-0.662v0z"}}]})(props);
};
function ImShuffle (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12 11h-1.586l-2.5-2.5 2.5-2.5h1.586v2.5l3.5-3.5-3.5-3.5v2.5h-2c-0.265 0-0.52 0.105-0.707 0.293l-2.793 2.793-2.793-2.793c-0.188-0.188-0.442-0.293-0.707-0.293h-3v2h2.586l2.5 2.5-2.5 2.5h-2.586v2h3c0.265 0 0.52-0.105 0.707-0.293l2.793-2.793 2.793 2.793c0.188 0.188 0.442 0.293 0.707 0.293h2v2.5l3.5-3.5-3.5-3.5v2.5z"}}]})(props);
};
function ImArrowUpLeft (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 11.5l4-4 8.5 8.5 3.5-3.5-8.5-8.5 4-4h-11.5v11.5z"}}]})(props);
};
function ImArrowUp (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0.5l-7.5 7.5h4.5v8h6v-8h4.5z"}}]})(props);
};
function ImArrowUpRight (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4.5 0l4 4-8.5 8.5 3.5 3.5 8.5-8.5 4 4v-11.5h-11.5z"}}]})(props);
};
function ImArrowRight (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.5 8l-7.5-7.5v4.5h-8v6h8v4.5z"}}]})(props);
};
function ImArrowDownRight (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 4.5l-4 4-8.5-8.5-3.5 3.5 8.5 8.5-4 4h11.5v-11.5z"}}]})(props);
};
function ImArrowDown (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 15.5l7.5-7.5h-4.5v-8h-6v8h-4.5z"}}]})(props);
};
function ImArrowDownLeft (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.5 16l-4-4 8.5-8.5-3.5-3.5-8.5 8.5-4-4v11.5h11.5z"}}]})(props);
};
function ImArrowLeft (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0.5 8l7.5 7.5v-4.5h8v-6h-8v-4.5z"}}]})(props);
};
function ImArrowUpLeft2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.707 12.293l-8.293-8.293h3.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6c-0.404 0-0.769 0.244-0.924 0.617-0.051 0.124-0.076 0.254-0.076 0.383h-0.001v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-3.586l8.293 8.293c0.195 0.195 0.451 0.293 0.707 0.293s0.512-0.098 0.707-0.293c0.391-0.39 0.391-1.024 0-1.414z"}}]})(props);
};
function ImArrowUp2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.707 6.293l-5-5c-0.39-0.391-1.024-0.391-1.414 0l-5 5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l3.293-3.293v9.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-9.586l3.293 3.293c0.195 0.195 0.451 0.293 0.707 0.293s0.512-0.098 0.707-0.293c0.391-0.391 0.391-1.024 0-1.414z"}}]})(props);
};
function ImArrowUpRight2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3.707 13.707l8.293-8.293v3.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.404-0.244-0.769-0.617-0.924-0.124-0.051-0.254-0.076-0.383-0.076v-0.001h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h3.586l-8.293 8.293c-0.195 0.195-0.293 0.451-0.293 0.707s0.098 0.512 0.293 0.707c0.39 0.391 1.024 0.391 1.414 0z"}}]})(props);
};
function ImArrowRight2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9.707 13.707l5-5c0.391-0.39 0.391-1.024 0-1.414l-5-5c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l3.293 3.293h-9.586c-0.552 0-1 0.448-1 1s0.448 1 1 1h9.586l-3.293 3.293c-0.195 0.195-0.293 0.451-0.293 0.707s0.098 0.512 0.293 0.707c0.391 0.391 1.024 0.391 1.414 0z"}}]})(props);
};
function ImArrowDownRight2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M2.293 3.707l8.293 8.293h-3.586c-0.552 0-1 0.448-1 1s0.448 1 1 1h6c0.404 0 0.769-0.244 0.924-0.617 0.051-0.124 0.076-0.254 0.076-0.383h0.001v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v3.586l-8.293-8.293c-0.195-0.195-0.451-0.293-0.707-0.293s-0.512 0.098-0.707 0.293c-0.391 0.39-0.391 1.024 0 1.414z"}}]})(props);
};
function ImArrowDown2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.707 9.707l-5 5c-0.39 0.391-1.024 0.391-1.414 0l-5-5c-0.391-0.391-0.391-1.024 0-1.414s1.024-0.391 1.414 0l3.293 3.293v-9.586c0-0.552 0.448-1 1-1s1 0.448 1 1v9.586l3.293-3.293c0.195-0.195 0.451-0.293 0.707-0.293s0.512 0.098 0.707 0.293c0.391 0.391 0.391 1.024 0 1.414z"}}]})(props);
};
function ImArrowDownLeft2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.293 2.293l-8.293 8.293v-3.586c0-0.552-0.448-1-1-1s-1 0.448-1 1v6c0 0.404 0.244 0.769 0.617 0.924 0.124 0.051 0.254 0.076 0.383 0.076v0.001l6-0c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3.586l8.293-8.293c0.195-0.195 0.293-0.451 0.293-0.707s-0.098-0.512-0.293-0.707c-0.39-0.391-1.024-0.391-1.414 0v0z"}}]})(props);
};
function ImArrowLeft2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.293 13.707l-5-5c-0.391-0.39-0.391-1.024 0-1.414l5-5c0.391-0.391 1.024-0.391 1.414 0s0.391 1.024 0 1.414l-3.293 3.293h9.586c0.552 0 1 0.448 1 1s-0.448 1-1 1h-9.586l3.293 3.293c0.195 0.195 0.293 0.451 0.293 0.707s-0.098 0.512-0.293 0.707c-0.391 0.391-1.024 0.391-1.414 0z"}}]})(props);
};
function ImCircleUp (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 8c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8-8 3.582-8 8zM14.5 8c0 3.59-2.91 6.5-6.5 6.5s-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5z"}},{"tag":"path","attr":{"d":"M11.043 10.457l1.414-1.414-4.457-4.457-4.457 4.457 1.414 1.414 3.043-3.043z"}}]})(props);
};
function ImCircleRight (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"}},{"tag":"path","attr":{"d":"M5.543 11.043l1.414 1.414 4.457-4.457-4.457-4.457-1.414 1.414 3.043 3.043z"}}]})(props);
};
function ImCircleDown (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 8c0-4.418-3.582-8-8-8s-8 3.582-8 8 3.582 8 8 8 8-3.582 8-8zM1.5 8c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5z"}},{"tag":"path","attr":{"d":"M4.957 5.543l-1.414 1.414 4.457 4.457 4.457-4.457-1.414-1.414-3.043 3.043z"}}]})(props);
};
function ImCircleLeft (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zM8 1.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5z"}},{"tag":"path","attr":{"d":"M10.457 4.957l-1.414-1.414-4.457 4.457 4.457 4.457 1.414-1.414-3.043-3.043z"}}]})(props);
};
function ImTab (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15 0h1v8h-1v-8z"}},{"tag":"path","attr":{"d":"M0 8h1v8h-1v-8z"}},{"tag":"path","attr":{"d":"M5 11h11v2h-11v2.5l-3.5-3.5 3.5-3.5v2.5z"}},{"tag":"path","attr":{"d":"M11 5h-11v-2h11v-2.5l3.5 3.5-3.5 3.5z"}}]})(props);
};
function ImMoveUp (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11 8v6h1v-6h2.5l-3-3-3 3z"}},{"tag":"path","attr":{"d":"M1 3h1.5v1h-1.5v-1z"}},{"tag":"path","attr":{"d":"M3 3h1.5v1h-1.5v-1z"}},{"tag":"path","attr":{"d":"M5 3h1v1.5h-1v-1.5z"}},{"tag":"path","attr":{"d":"M1 6.5h1v1.5h-1v-1.5z"}},{"tag":"path","attr":{"d":"M2.5 7h1.5v1h-1.5v-1z"}},{"tag":"path","attr":{"d":"M4.5 7h1.5v1h-1.5v-1z"}},{"tag":"path","attr":{"d":"M1 4.5h1v1.5h-1v-1.5z"}},{"tag":"path","attr":{"d":"M5 5h1v1.5h-1v-1.5z"}},{"tag":"path","attr":{"d":"M5 11v3h-3v-3h3zM6 10h-5v5h5v-5z"}}]})(props);
};
function ImMoveDown (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12 11v-6h-1v6h-2.5l3 3 3-3z"}},{"tag":"path","attr":{"d":"M5 4v3h-3v-3h3zM6 3h-5v5h5v-5z"}},{"tag":"path","attr":{"d":"M1 10h1.5v1h-1.5v-1z"}},{"tag":"path","attr":{"d":"M3 10h1.5v1h-1.5v-1z"}},{"tag":"path","attr":{"d":"M5 10h1v1.5h-1v-1.5z"}},{"tag":"path","attr":{"d":"M1 13.5h1v1.5h-1v-1.5z"}},{"tag":"path","attr":{"d":"M2.5 14h1.5v1h-1.5v-1z"}},{"tag":"path","attr":{"d":"M4.5 14h1.5v1h-1.5v-1z"}},{"tag":"path","attr":{"d":"M1 11.5h1v1.5h-1v-1.5z"}},{"tag":"path","attr":{"d":"M5 12h1v1.5h-1v-1.5z"}}]})(props);
};
function ImSortAlphaAsc (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5 12v-12h-2v12h-2.5l3.5 3.5 3.5-3.5h-2.5z"}},{"tag":"path","attr":{"d":"M14.5 16h-4c-0.184 0-0.354-0.101-0.441-0.264s-0.077-0.36 0.025-0.513l3.482-5.223h-3.066c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h4c0.184 0 0.354 0.101 0.441 0.264s0.077 0.36-0.025 0.513l-3.482 5.223h3.066c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M15.947 6.276l-3-6c-0.085-0.169-0.258-0.276-0.447-0.276s-0.363 0.107-0.447 0.276l-3 6c-0.123 0.247-0.023 0.547 0.224 0.671 0.072 0.036 0.148 0.053 0.223 0.053 0.183 0 0.36-0.101 0.448-0.277l0.862-1.724h3.382l0.862 1.724c0.123 0.247 0.424 0.347 0.671 0.224s0.347-0.424 0.224-0.671zM11.309 4l1.191-2.382 1.191 2.382h-2.382z"}}]})(props);
};
function ImSortAlphaDesc (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5 12v-12h-2v12h-2.5l3.5 3.5 3.5-3.5h-2.5z"}},{"tag":"path","attr":{"d":"M14.5 7h-4c-0.184 0-0.354-0.101-0.441-0.264s-0.077-0.36 0.025-0.513l3.482-5.223h-3.066c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h4c0.184 0 0.354 0.102 0.441 0.264s0.077 0.36-0.025 0.513l-3.482 5.223h3.066c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M15.947 15.276l-3-6c-0.085-0.169-0.258-0.276-0.447-0.276s-0.363 0.107-0.447 0.276l-3 6c-0.123 0.247-0.023 0.547 0.224 0.671 0.072 0.036 0.148 0.053 0.223 0.053 0.183 0 0.36-0.101 0.448-0.277l0.862-1.724h3.382l0.862 1.724c0.123 0.247 0.424 0.347 0.671 0.224s0.347-0.424 0.224-0.671zM11.309 13l1.191-2.382 1.191 2.382h-2.382z"}}]})(props);
};
function ImSortNumericAsc (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5 12v-12h-2v12h-2.5l3.5 3.5 3.5-3.5h-2.5z"}},{"tag":"path","attr":{"d":"M13.5 7c-0.276 0-0.5-0.224-0.5-0.5v-5.5h-0.5c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h1c0.276 0 0.5 0.224 0.5 0.5v6c0 0.276-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M14.5 9h-3c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.276 0.224 0.5 0.5 0.5h2.5v2h-2.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h3c0.276 0 0.5-0.224 0.5-0.5v-6c0-0.276-0.224-0.5-0.5-0.5zM12 10h2v2h-2v-2z"}}]})(props);
};
function ImSortNumbericDesc (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5 12v-12h-2v12h-2.5l3.5 3.5 3.5-3.5h-2.5z"}},{"tag":"path","attr":{"d":"M13.5 16c-0.276 0-0.5-0.224-0.5-0.5v-5.5h-0.5c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h1c0.276 0 0.5 0.224 0.5 0.5v6c0 0.276-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M14.5 0h-3c-0.276 0-0.5 0.224-0.5 0.5v3c0 0.276 0.224 0.5 0.5 0.5h2.5v2h-2.5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h3c0.276 0 0.5-0.224 0.5-0.5v-6c0-0.276-0.224-0.5-0.5-0.5zM12 1h2v2h-2v-2z"}}]})(props);
};
function ImSortAmountAsc (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5 12v-12h-2v12h-2.5l3.5 3.5 3.5-3.5h-2.5z"}},{"tag":"path","attr":{"d":"M7 9h9v2h-9v-2z"}},{"tag":"path","attr":{"d":"M7 6h7v2h-7v-2z"}},{"tag":"path","attr":{"d":"M7 3h5v2h-5v-2z"}},{"tag":"path","attr":{"d":"M7 0h3v2h-3v-2z"}}]})(props);
};
function ImSortAmountDesc (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5 12v-12h-2v12h-2.5l3.5 3.5 3.5-3.5h-2.5z"}},{"tag":"path","attr":{"d":"M7 0h9v2h-9v-2z"}},{"tag":"path","attr":{"d":"M7 3h7v2h-7v-2z"}},{"tag":"path","attr":{"d":"M7 6h5v2h-5v-2z"}},{"tag":"path","attr":{"d":"M7 9h3v2h-3v-2z"}}]})(props);
};
function ImCommand (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.5 14c-1.379 0-2.5-1.121-2.5-2.5v-1.5h-2v1.5c0 1.379-1.122 2.5-2.5 2.5s-2.5-1.121-2.5-2.5 1.122-2.5 2.5-2.5h1.5v-2h-1.5c-1.378 0-2.5-1.122-2.5-2.5s1.122-2.5 2.5-2.5 2.5 1.122 2.5 2.5v1.5h2v-1.5c0-1.378 1.121-2.5 2.5-2.5s2.5 1.122 2.5 2.5-1.121 2.5-2.5 2.5h-1.5v2h1.5c1.379 0 2.5 1.121 2.5 2.5s-1.121 2.5-2.5 2.5zM10 10v1.5c0 0.827 0.673 1.5 1.5 1.5s1.5-0.673 1.5-1.5-0.673-1.5-1.5-1.5h-1.5zM4.5 10c-0.827 0-1.5 0.673-1.5 1.5s0.673 1.5 1.5 1.5 1.5-0.673 1.5-1.5v-1.5h-1.5zM7 9h2v-2h-2v2zM10 6h1.5c0.827 0 1.5-0.673 1.5-1.5s-0.673-1.5-1.5-1.5-1.5 0.673-1.5 1.5v1.5zM4.5 3c-0.827 0-1.5 0.673-1.5 1.5s0.673 1.5 1.5 1.5h1.5v-1.5c0-0.827-0.673-1.5-1.5-1.5z"}}]})(props);
};
function ImShift (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M10.5 14h-5c-0.276 0-0.5-0.224-0.5-0.5v-5.5h-2c-0.202 0-0.385-0.122-0.462-0.309s-0.035-0.402 0.108-0.545l5-5c0.195-0.195 0.512-0.195 0.707 0l5 5c0.143 0.143 0.186 0.358 0.108 0.545s-0.26 0.309-0.462 0.309h-2v5.5c0 0.276-0.224 0.5-0.5 0.5zM6 13h4v-5.5c0-0.276 0.224-0.5 0.5-0.5h1.293l-3.793-3.793-3.793 3.793h1.293c0.276 0 0.5 0.224 0.5 0.5v5.5z"}}]})(props);
};
function ImCtrl (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.5 7c-0.139 0-0.278-0.058-0.377-0.171l-3.124-3.57-3.124 3.57c-0.182 0.208-0.498 0.229-0.706 0.047s-0.229-0.498-0.047-0.706l3.5-4c0.095-0.108 0.232-0.171 0.376-0.171s0.281 0.062 0.376 0.171l3.5 4c0.182 0.208 0.161 0.524-0.047 0.706-0.095 0.083-0.212 0.124-0.329 0.124z"}}]})(props);
};
function ImOpt (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 13h-4c-0.198 0-0.377-0.116-0.457-0.297l-3.868-8.703h-4.675c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h5c0.198 0 0.377 0.116 0.457 0.297l3.868 8.703h3.675c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M14.5 4h-5c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h5c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z"}}]})(props);
};
function ImCheckboxChecked (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 0h-12c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-12c0-1.1-0.9-2-2-2zM7 12.414l-3.707-3.707 1.414-1.414 2.293 2.293 4.793-4.793 1.414 1.414-6.207 6.207z"}}]})(props);
};
function ImCheckboxUnchecked (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 0h-12c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h12c1.1 0 2-0.9 2-2v-12c0-1.1-0.9-2-2-2zM14 14h-12v-12h12v12z"}}]})(props);
};
function ImRadioChecked (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14c-3.314 0-6-2.686-6-6s2.686-6 6-6c3.314 0 6 2.686 6 6s-2.686 6-6 6zM5 8c0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3s-3-1.343-3-3z"}}]})(props);
};
function ImRadioChecked2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 10c-1.105 0-2-0.895-2-2s0.895-2 2-2c1.105 0 2 0.895 2 2s-0.895 2-2 2z"}}]})(props);
};
function ImRadioUnchecked (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14c-3.314 0-6-2.686-6-6s2.686-6 6-6c3.314 0 6 2.686 6 6s-2.686 6-6 6z"}}]})(props);
};
function ImCrop (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13 4l3-3-1-1-3 3h-7v-3h-2v3h-3v2h3v8h8v3h2v-3h3v-2h-3v-7zM5 5h5l-5 5v-5zM6 11l5-5v5h-5z"}}]})(props);
};
function ImMakeGroup (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5 2h-2c-0.55 0-1 0.45-1 1v2c0 0.55 0.45 1 1 1h2c0.55 0 1-0.45 1-1v-2c0-0.55-0.45-1-1-1z"}},{"tag":"path","attr":{"d":"M11 6h2c0.55 0 1-0.45 1-1v-2c0-0.55-0.45-1-1-1h-2c-0.55 0-1 0.45-1 1v2c0 0.55 0.45 1 1 1zM11 3h2v2h-2v-2z"}},{"tag":"path","attr":{"d":"M5 10h-2c-0.55 0-1 0.45-1 1v2c0 0.55 0.45 1 1 1h2c0.55 0 1-0.45 1-1v-2c0-0.55-0.45-1-1-1zM5 13h-2v-2h2v2z"}},{"tag":"path","attr":{"d":"M13 10h-2c-0.55 0-1 0.45-1 1v2c0 0.55 0.45 1 1 1h2c0.55 0 1-0.45 1-1v-2c0-0.55-0.45-1-1-1z"}},{"tag":"path","attr":{"d":"M14 8h-1c-1.336 0-2.591-0.52-3.536-1.464s-1.464-2.2-1.464-3.536v-1c0-1.1-0.9-2-2-2h-4c-1.1 0-2 0.9-2 2v4c0 1.1 0.9 2 2 2h1c1.336 0 2.591 0.52 3.536 1.464s1.464 2.2 1.464 3.536v1c0 1.1 0.9 2 2 2h4c1.1 0 2-0.9 2-2v-4c0-1.1-0.9-2-2-2zM15 14c0 0.265-0.105 0.515-0.295 0.705s-0.44 0.295-0.705 0.295h-4c-0.265 0-0.515-0.105-0.705-0.295s-0.295-0.44-0.295-0.705v-1c0-3.314-2.686-6-6-6h-1c-0.265 0-0.515-0.105-0.705-0.295s-0.295-0.441-0.295-0.705v-4c0-0.265 0.105-0.515 0.295-0.705s0.44-0.295 0.705-0.295h4c0.265 0 0.515 0.105 0.705 0.295s0.295 0.44 0.295 0.705v1c0 3.314 2.686 6 6 6h1c0.265 0 0.515 0.105 0.705 0.295s0.295 0.44 0.295 0.705v4z"}}]})(props);
};
function ImUngroup (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 7.25c0 0.412-0.338 0.75-0.75 0.75h-1.5c-0.413 0-0.75-0.338-0.75-0.75v-1.5c0-0.412 0.337-0.75 0.75-0.75h1.5c0.412 0 0.75 0.338 0.75 0.75v1.5z"}},{"tag":"path","attr":{"d":"M11 7.25c0 0.412-0.338 0.75-0.75 0.75h-1.5c-0.412 0-0.75-0.338-0.75-0.75v-1.5c0-0.412 0.338-0.75 0.75-0.75h1.5c0.412 0 0.75 0.338 0.75 0.75v1.5z"}},{"tag":"path","attr":{"d":"M6 12.25c0 0.412-0.338 0.75-0.75 0.75h-1.5c-0.413 0-0.75-0.338-0.75-0.75v-1.5c0-0.412 0.337-0.75 0.75-0.75h1.5c0.412 0 0.75 0.338 0.75 0.75v1.5z"}},{"tag":"path","attr":{"d":"M11 12.25c0 0.412-0.338 0.75-0.75 0.75h-1.5c-0.412 0-0.75-0.338-0.75-0.75v-1.5c0-0.412 0.338-0.75 0.75-0.75h1.5c0.412 0 0.75 0.338 0.75 0.75v1.5z"}},{"tag":"path","attr":{"d":"M14.251 2.5l1.749-1.749v-0.751h-0.751l-1.749 1.749-1.749-1.749h-0.751v0.751l1.749 1.749-1.749 1.749v0.751h0.751l1.749-1.749 1.749 1.749h0.751v-0.751z"}},{"tag":"path","attr":{"d":"M0 12h1v2h-1v-2z"}},{"tag":"path","attr":{"d":"M0 9h1v2h-1v-2z"}},{"tag":"path","attr":{"d":"M13 7h1v2h-1v-2z"}},{"tag":"path","attr":{"d":"M13 13h1v2h-1v-2z"}},{"tag":"path","attr":{"d":"M13 10h1v2h-1v-2z"}},{"tag":"path","attr":{"d":"M0 6h1v2h-1v-2z"}},{"tag":"path","attr":{"d":"M0 3h1v2h-1v-2z"}},{"tag":"path","attr":{"d":"M8 2h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M5 2h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M2 2h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M7 15h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M10 15h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M4 15h2v1h-2v-1z"}},{"tag":"path","attr":{"d":"M1 15h2v1h-2v-1z"}}]})(props);
};
function ImScissors (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.279 10.62c-1.042-1.628-2.829-2.345-3.992-1.601-0.1 0.064-0.193 0.138-0.277 0.218l-1.241-1.942 2.867-4.5c0.235-0.433 0.321-0.949 0.207-1.468-0.109-0.496-0.383-0.913-0.752-1.207l-0.192-0.122-3.398 5.314-3.398-5.314-0.192 0.122c-0.369 0.294-0.643 0.711-0.752 1.207-0.114 0.519-0.027 1.035 0.207 1.468l2.867 4.5-1.241 1.942c-0.085-0.081-0.177-0.154-0.277-0.218-1.163-0.744-2.95-0.028-3.992 1.601s-0.944 3.551 0.219 4.296c1.163 0.744 2.95 0.028 3.992-1.601l2.567-4.029 2.567 4.029c1.042 1.628 2.829 2.345 3.992 1.601s1.261-2.667 0.219-4.296zM3.67 12.507c-0.469 0.733-1.071 1.089-1.478 1.179-0 0-0 0-0 0-0.133 0.029-0.317 0.047-0.443-0.033-0.139-0.089-0.231-0.324-0.247-0.629-0.025-0.494 0.151-1.076 0.483-1.594 0.469-0.733 1.071-1.089 1.478-1.179 0.133-0.029 0.317-0.047 0.443 0.033 0.139 0.089 0.231 0.324 0.247 0.629 0.025 0.495-0.151 1.076-0.483 1.594zM7.5 8c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5 0.5 0.224 0.5 0.5-0.224 0.5-0.5 0.5zM13.498 13.023c-0.016 0.305-0.108 0.54-0.247 0.629-0.125 0.080-0.31 0.062-0.443 0.033 0 0 0 0-0 0-0.407-0.089-1.009-0.446-1.478-1.179-0.332-0.519-0.508-1.1-0.483-1.594 0.016-0.305 0.108-0.54 0.247-0.629 0.125-0.080 0.31-0.062 0.443-0.033 0.407 0.089 1.009 0.446 1.478 1.179 0.332 0.519 0.508 1.1 0.483 1.594z"}}]})(props);
};
function ImFilter (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 1.119-8 2.5v1.5l6 6v5c0 0.552 0.895 1 2 1s2-0.448 2-1v-5l6-6v-1.5c0-1.381-3.582-2.5-8-2.5zM1.475 2.169c0.374-0.213 0.9-0.416 1.52-0.586 1.374-0.376 3.152-0.583 5.005-0.583s3.631 0.207 5.005 0.583c0.62 0.17 1.146 0.372 1.52 0.586 0.247 0.141 0.38 0.26 0.442 0.331-0.062 0.071-0.195 0.19-0.442 0.331-0.374 0.213-0.9 0.416-1.52 0.586-1.374 0.376-3.152 0.583-5.005 0.583s-3.631-0.207-5.005-0.583c-0.62-0.17-1.146-0.372-1.52-0.586-0.247-0.141-0.38-0.26-0.442-0.331 0.062-0.071 0.195-0.19 0.442-0.331z"}}]})(props);
};
function ImFont (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.494 0.253c-1.414 0-2.322-0.253-3.779-0.253-4.708 0-6.903 2.681-6.903 5.404 0 1.604 0.76 2.132 2.259 2.132-0.106-0.232-0.296-0.486-0.296-1.626 0-3.188 1.203-4.117 2.744-4.18 0 0-1.264 12.396-4.934 13.883v0.385h4.947l1.688-8h3.091l0.689-2h-3.358l0.812-3.847c0.929 0.19 1.837 0.38 2.618 0.38 0.971 0 1.858-0.296 2.343-2.533-0.591 0.19-1.224 0.253-1.921 0.253z"}}]})(props);
};
function ImLigature (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12 13.622c0-0.001 0-0.001 0-0.002l-0.005-6.821-1.992 0.097h-3.936v-0.336c0-1.274 0.091-2.546 0.269-3.042 0.123-0.343 0.353-0.652 0.683-0.919 0.322-0.261 0.643-0.393 0.955-0.393 0.262 0 0.48 0.045 0.647 0.134 0.235 0.134 0.464 0.359 0.682 0.669 0.577 0.82 0.812 1.038 0.939 1.131 0.216 0.158 0.477 0.238 0.776 0.238 0.292 0 0.546-0.109 0.757-0.324 0.209-0.213 0.315-0.479 0.315-0.792 0-0.335-0.139-0.691-0.414-1.057-0.268-0.358-0.683-0.652-1.232-0.875-0.536-0.218-1.14-0.329-1.793-0.329-0.949 0-1.813 0.228-2.568 0.678-0.757 0.451-1.337 1.077-1.725 1.863-0.359 0.728-0.333 2.105-0.355 3.355h-1.965v1.116h1.962v5.073c0 1.12-0.342 1.422-0.472 1.583-0.179 0.222-0.509 0.455-0.944 0.455h-0.604v0.878h6.021v-0.878h-0.105c-1.424 0-1.828-0.154-1.828-1.888 0-0 0-0.001 0-0.001l-0.001-5.222h2.191c1.163 0 1.43 0.054 1.491 0.077 0.074 0.028 0.169 0.075 0.204 0.143 0.014 0.026 0.081 0.391 0.081 1.296v3.917c0 0.913-0.111 1.217-0.179 1.319-0.145 0.222-0.319 0.345-0.854 0.358v0.879h4.588v-0.873c-1.431 0-1.588-0.153-1.588-1.505z"}}]})(props);
};
function ImLigature2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.364 14.335c-0.183 0-1.307-0.206-1.375-0.458-0.161-0.619-0.183-1.284-0.183-2.040v-8.453c0-1.261 0.252-1.994 0.252-1.994-0.023-0.115-0.138-0.367-0.275-0.367h-0.069c-0.069 0-0.871 0.504-1.605 0.504-0.596-0-0.967-0.527-1.655-0.527-2.892 0-4.249 2.349-4.249 5.672v0.173c0 0.069-0.046 0.138-0.115 0.138h-0.94c-0.115 0-0.344 0.642-0.344 0.94 0 0.092 0.023 0.137 0.069 0.137h1.215c0.069 0 0.115 0.092 0.115 0.16 0 2.040-0.023 4.052-0.023 4.052 0 0.321-0.023 1.031-0.16 1.605-0.069 0.252-1.123 0.458-1.398 0.458-0.115 0-0.115 0.55 0 0.665 0.94-0.046 1.559-0.115 2.499-0.115 0.871 0 1.536 0.069 2.453 0.115 0.046-0.138 0.046-0.665-0.069-0.665-0.183 0-1.307-0.206-1.375-0.458-0.16-0.619-0.16-1.284-0.183-2.040v-3.639c0-0.069 0.069-0.138 0.138-0.138h2.361c0.16-0.321 0.275-0.711 0.275-0.917 0-0.138 0-0.16-0.115-0.16h-2.544c-0.046 0-0.115-0.069-0.115-0.115v-0.825c0-2.040 0.836-3.837 2.234-3.837 0.99 0 1.854 0.642 1.854 3.093 0 0 0 0 0 0 0.003 0.063 0.005 0.114 0.005 0.148v6.825c0 0.321-0.023 1.031-0.16 1.605-0.069 0.252-1.123 0.458-1.398 0.458-0.115 0-0.115 0.55 0 0.665 0.94-0.046 1.559-0.115 2.499-0.115 0.871 0 1.536 0.069 2.453 0.115 0.046-0.137 0.046-0.665-0.069-0.665z"}}]})(props);
};
function ImTextHeight (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 12h2l-2.5 3-2.5-3h2v-8h-2l2.5-3 2.5 3h-2zM10 1v4l-1-2h-3v11h2v1h-6v-1h2v-11h-3l-1 2v-4z"}}]})(props);
};
function ImTextWidth (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 14v2l-3-2.5 3-2.5v2h8v-2l3 2.5-3 2.5v-2zM13 1v4l-1-2h-3v7h2v1h-6v-1h2v-7h-3l-1 2v-4z"}}]})(props);
};
function ImFontSize (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M1 8h6v2h-2v6h-2v-6h-2zM15 4h-3.934v12h-2.133v-12h-3.934v-2h10z"}}]})(props);
};
function ImBold (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.061 7.573c0.586-0.696 0.939-1.594 0.939-2.573 0-2.206-1.794-4-4-4h-5v14h6c2.206 0 4-1.794 4-4 0-1.452-0.778-2.726-1.939-3.427zM6 3h1.586c0.874 0 1.586 0.897 1.586 2s-0.711 2-1.586 2h-1.586v-4zM8.484 13h-2.484v-4h2.484c0.913 0 1.656 0.897 1.656 2s-0.743 2-1.656 2z"}}]})(props);
};
function ImUnderline (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11 1h2v6.5c0 2.485-2.239 4.5-5 4.5s-5-2.015-5-4.5v-6.5h2v6.5c0 0.628 0.285 1.23 0.802 1.695 0.577 0.519 1.357 0.805 2.198 0.805s1.621-0.286 2.198-0.805c0.517-0.466 0.802-1.068 0.802-1.695v-6.5zM3 13h10v2h-10z"}}]})(props);
};
function ImItalic (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 1v1h-2l-5 12h2v1h-7v-1h2l5-12h-2v-1z"}}]})(props);
};
function ImStrikethrough (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 8v1h-3.664c0.43 0.602 0.664 1.292 0.664 2 0 1.107-0.573 2.172-1.572 2.921-0.927 0.696-2.145 1.079-3.428 1.079s-2.501-0.383-3.428-1.079c-0.999-0.749-1.572-1.814-1.572-2.921h2c0 1.084 1.374 2 3 2s3-0.916 3-2c0-1.084-1.374-2-3-2h-8v-1h4.68c-0.037-0.026-0.073-0.052-0.108-0.079-0.999-0.749-1.572-1.814-1.572-2.921s0.573-2.172 1.572-2.921c0.927-0.696 2.145-1.079 3.428-1.079s2.501 0.383 3.428 1.079c0.999 0.749 1.572 1.814 1.572 2.921h-2c0-1.084-1.374-2-3-2s-3 0.916-3 2c0 1.084 1.374 2 3 2 1.234 0 2.407 0.354 3.32 1h4.68z"}}]})(props);
};
function ImOmega (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11 14h4l1-2v4h-6v-3.347c2.049-0.883 3.5-3.081 3.5-5.653 0-3.35-2.462-5.973-5.5-5.973s-5.5 2.622-5.5 5.973c0 2.572 1.451 4.77 3.5 5.653v3.347h-6v-4l1 2h4v-0.509c-2.932-1.038-5-3.553-5-6.491 0-3.866 3.582-7 8-7s8 3.134 8 7c0 2.938-2.068 5.452-5 6.491v0.509z"}}]})(props);
};
function ImSigma (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.713 11.48l0.694-1.48h0.594l-1 6h-15v-1.16l5.18-6.113-5.18-5.18v-3.547h15.313l0.688 4h-0.537l-0.293-0.607c-0.552-1.146-0.967-1.393-2.17-1.393h-10.344l5.517 5.516-4.647 5.483h8.474c1.813 0 2.291-0.65 2.713-1.52z"}}]})(props);
};
function ImPageBreak (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 8h2v1h-2zM3 8h3v1h-3zM7 8h2v1h-2zM10 8h3v1h-3zM14 8h2v1h-2zM13.75 0l0.25 7h-12l0.25-7h0.5l0.25 6h10l0.25-6zM2.25 16l-0.25-6h12l-0.25 6h-0.5l-0.25-5h-10l-0.25 5z"}}]})(props);
};
function ImSuperscript (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12 3.219v0.781h2v1h-3v-2.281l2-0.938v-0.781h-2v-1h3v2.281zM10.563 4h-2.125l-2.938 2.938-2.938-2.938h-2.125l4 4-4 4h2.125l2.938-2.938 2.938 2.938h2.125l-4-4z"}}]})(props);
};
function ImSubscript (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12 14.219v0.781h2v1h-3v-2.281l2-0.938v-0.781h-2v-1h3v2.281zM10.563 4h-2.125l-2.938 2.938-2.938-2.938h-2.125l4 4-4 4h2.125l2.938-2.938 2.938 2.938h2.125l-4-4z"}}]})(props);
};
function ImSuperscript2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3.032 13l0.9-3h4.137l0.9 3h1.775l-3-10h-3.488l-3 10h1.776zM5.432 5h1.137l0.9 3h-2.937l0.9-3zM11 13l2.5-4 2.5 4h-5z"}},{"tag":"path","attr":{"d":"M13.5 2h-1c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h2c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-2c-0.827 0-1.5 0.673-1.5 1.5 0 0.384 0.145 0.734 0.383 1 0.275 0.307 0.674 0.5 1.117 0.5h1c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5h-2c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h2c0.827 0 1.5-0.673 1.5-1.5 0-0.384-0.145-0.734-0.383-1-0.275-0.307-0.674-0.5-1.117-0.5z"}}]})(props);
};
function ImSubscript2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3.032 13l0.9-3h4.137l0.9 3h1.775l-3-10h-3.488l-3 10h1.776zM5.432 5h1.137l0.9 3h-2.937l0.9-3zM16 3l-2.5 4-2.5-4h5z"}},{"tag":"path","attr":{"d":"M13.5 13h-1c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h2c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-2c-0.827 0-1.5 0.673-1.5 1.5 0 0.384 0.145 0.734 0.383 1 0.275 0.307 0.674 0.5 1.117 0.5h1c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5h-2c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h2c0.827 0 1.5-0.673 1.5-1.5 0-0.384-0.145-0.734-0.383-1-0.275-0.307-0.674-0.5-1.117-0.5z"}}]})(props);
};
function ImTextColor (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5.032 13l0.9-3h4.137l0.9 3h1.775l-3-10h-3.488l-3 10h1.776zM7.432 5h1.137l0.9 3h-2.937l0.9-3z"}}]})(props);
};
function ImPagebreak (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 6v-6h12v6h-1v-5h-10v5zM16 9v7h-12v-7h1v6h10v-6zM8 7h2v1h-2zM5 7h2v1h-2zM11 7h2v1h-2zM14 7h2v1h-2zM0 4.5l3 3-3 3z"}}]})(props);
};
function ImClearFormatting (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 14h9v2h-9zM14 2h-4.727l-2.871 11h-2.067l2.871-11h-4.205v-2h11zM14.528 16l-2.028-2.028-2.028 2.028-0.972-0.972 2.028-2.028-2.028-2.028 0.972-0.972 2.028 2.028 2.028-2.028 0.972 0.972-2.028 2.028 2.028 2.028z"}}]})(props);
};
function ImTable (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 3v11h16v-11h-16zM6 10v-2h4v2h-4zM10 11v2h-4v-2h4zM10 5v2h-4v-2h4zM5 5v2h-4v-2h4zM1 8h4v2h-4v-2zM11 8h4v2h-4v-2zM11 7v-2h4v2h-4zM1 11h4v2h-4v-2zM11 13v-2h4v2h-4z"}}]})(props);
};
function ImTable2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 1v14h16v-14h-16zM6 10v-3h4v3h-4zM10 11v3h-4v-3h4zM10 3v3h-4v-3h4zM5 3v3h-4v-3h4zM1 7h4v3h-4v-3zM11 7h4v3h-4v-3zM11 6v-3h4v3h-4zM1 11h4v3h-4v-3zM11 14v-3h4v3h-4z"}}]})(props);
};
function ImInsertTemplate (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 3h2v1h-2zM9 3h2v1h-2zM14 3v4h-3v-1h2v-2h-1v-1zM5 6h2v1h-2zM8 6h2v1h-2zM3 4v2h1v1h-2v-4h3v1zM6 9h2v1h-2zM9 9h2v1h-2zM14 9v4h-3v-1h2v-2h-1v-1zM5 12h2v1h-2zM8 12h2v1h-2zM3 10v2h1v1h-2v-4h3v1zM15 1h-14v14h14v-14zM16 0v0 16h-16v-16h16z"}}]})(props);
};
function ImPilcrow (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 0h8v2h-2v14h-2v-14h-2v14h-2v-8c-2.209 0-4-1.791-4-4s1.791-4 4-4z"}}]})(props);
};
function ImLtr (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-2.209 0-4 1.791-4 4s1.791 4 4 4v8h2v-14h2v14h2v-14h2v-2h-8zM0 11l4-4-4-4z"}}]})(props);
};
function ImRtl (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 0c-2.209 0-4 1.791-4 4s1.791 4 4 4v8h2v-14h2v14h2v-14h2v-2h-8zM16 3l-4 4 4 4z"}}]})(props);
};
function ImSection (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7.749 16c-0.771 0-1.424-0.225-1.939-0.669-0.519-0.447-0.782-0.969-0.782-1.552 0-0.283 0.103-0.527 0.307-0.726 0.207-0.202 0.465-0.309 0.748-0.309 0.281 0 0.534 0.1 0.732 0.29 0.195 0.187 0.294 0.435 0.294 0.736 0 0.177-0.029 0.372-0.086 0.58-0.056 0.206-0.068 0.312-0.068 0.364 0 0.058 0.014 0.126 0.121 0.199 0.199 0.138 0.439 0.204 0.732 0.204 0.353 0 0.667-0.123 0.962-0.375 0.29-0.249 0.431-0.505 0.431-0.782 0-0.308-0.082-0.575-0.252-0.816-0.287-0.402-0.826-0.874-1.603-1.401-1.248-0.835-2.079-1.559-2.54-2.211-0.358-0.511-0.539-1.061-0.539-1.636 0-0.579 0.19-1.155 0.564-1.713 0.32-0.477 0.794-0.908 1.41-1.283-0.33-0.355-0.577-0.689-0.736-0.995-0.201-0.387-0.303-0.787-0.303-1.189 0-0.747 0.295-1.393 0.878-1.92s1.31-0.795 2.161-0.795c0.783 0 1.441 0.22 1.956 0.654 0.521 0.439 0.785 0.952 0.785 1.524 0 0.292-0.109 0.553-0.324 0.776l-0.004 0.004c-0.125 0.124-0.353 0.271-0.735 0.271-0.299 0-0.561-0.098-0.758-0.283-0.196-0.184-0.296-0.405-0.296-0.656 0-0.108 0.027-0.272 0.084-0.515 0.028-0.115 0.042-0.221 0.042-0.316 0-0.162-0.058-0.285-0.183-0.39-0.129-0.108-0.314-0.161-0.565-0.161-0.389 0-0.708 0.118-0.975 0.361s-0.399 0.533-0.399 0.883c0 0.315 0.071 0.574 0.212 0.771 0.267 0.374 0.731 0.778 1.378 1.201 1.315 0.853 2.233 1.636 2.727 2.325 0.365 0.518 0.549 1.068 0.549 1.637 0 0.572-0.186 1.148-0.552 1.714-0.316 0.487-0.793 0.926-1.42 1.308 0.347 0.367 0.591 0.688 0.743 0.977 0.189 0.359 0.284 0.751 0.284 1.165 0 0.776-0.296 1.435-0.879 1.96s-1.31 0.79-2.161 0.79zM6.975 5.568c-0.753 0.452-1.12 0.972-1.12 1.583 0 0.356 0.102 0.674 0.31 0.973 0.311 0.436 0.926 0.97 1.825 1.583 0.381 0.259 0.724 0.511 1.025 0.751 0.767-0.461 1.14-0.974 1.14-1.565 0-0.322-0.127-0.668-0.378-1.030-0.263-0.378-0.826-0.872-1.674-1.467-0.443-0.306-0.821-0.583-1.128-0.827z"}}]})(props);
};
function ImParagraphLeft (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 1h16v2h-16zM0 4h10v2h-10zM0 10h10v2h-10zM0 7h16v2h-16zM0 13h16v2h-16z"}}]})(props);
};
function ImParagraphCenter (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 1h16v2h-16zM3 4h10v2h-10zM3 10h10v2h-10zM0 7h16v2h-16zM0 13h16v2h-16z"}}]})(props);
};
function ImParagraphRight (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 1h16v2h-16zM6 4h10v2h-10zM6 10h10v2h-10zM0 7h16v2h-16zM0 13h16v2h-16z"}}]})(props);
};
function ImParagraphJustify (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 1h16v2h-16zM0 4h16v2h-16zM0 7h16v2h-16zM0 10h16v2h-16zM0 13h16v2h-16z"}}]})(props);
};
function ImIndentIncrease (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 1h16v2h-16zM6 4h10v2h-10zM6 7h10v2h-10zM6 10h10v2h-10zM0 13h16v2h-16zM0 11v-6l4 3z"}}]})(props);
};
function ImIndentDecrease (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 1h16v2h-16zM6 4h10v2h-10zM6 7h10v2h-10zM6 10h10v2h-10zM0 13h16v2h-16zM4 5v6l-4-3z"}}]})(props);
};
function ImShare (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 10c0 0 0.919-3 6-3v3l6-4-6-4v3c-4 0-6 2.495-6 5zM11 12h-9v-6h1.967c0.158-0.186 0.327-0.365 0.508-0.534 0.687-0.644 1.509-1.135 2.439-1.466h-6.914v10h13v-4.197l-2 1.333v0.864z"}}]})(props);
};
function ImNewTab (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3 1v12h12v-12h-12zM14 12h-10v-10h10v10zM2 14v-10.5l-1-1v12.5h12.5l-1-1h-10.5z"}},{"tag":"path","attr":{"d":"M5.5 4l2.5 2.5-3 3 1.5 1.5 3-3 2.5 2.5v-6.5z"}}]})(props);
};
function ImEmbed (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9 11.5l1.5 1.5 5-5-5-5-1.5 1.5 3.5 3.5z"}},{"tag":"path","attr":{"d":"M7 4.5l-1.5-1.5-5 5 5 5 1.5-1.5-3.5-3.5z"}}]})(props);
};
function ImEmbed2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 20 16"},"child":[{"tag":"path","attr":{"d":"M13 11.5l1.5 1.5 5-5-5-5-1.5 1.5 3.5 3.5z"}},{"tag":"path","attr":{"d":"M7 4.5l-1.5-1.5-5 5 5 5 1.5-1.5-3.5-3.5z"}},{"tag":"path","attr":{"d":"M10.958 2.352l1.085 0.296-3 11-1.085-0.296 3-11z"}}]})(props);
};
function ImTerminal (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 1v14h16v-14h-16zM15 14h-14v-12h14v12zM14 3h-12v10h12v-10zM7 8h-1v1h-1v1h-1v-1h1v-1h1v-1h-1v-1h-1v-1h1v1h1v1h1v1zM11 10h-3v-1h3v1z"}}]})(props);
};
function ImShare2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.5 11c-0.706 0-1.342 0.293-1.797 0.763l-6.734-3.367c0.021-0.129 0.032-0.261 0.032-0.396s-0.011-0.267-0.032-0.396l6.734-3.367c0.455 0.47 1.091 0.763 1.797 0.763 1.381 0 2.5-1.119 2.5-2.5s-1.119-2.5-2.5-2.5-2.5 1.119-2.5 2.5c0 0.135 0.011 0.267 0.031 0.396l-6.734 3.367c-0.455-0.47-1.091-0.763-1.797-0.763-1.381 0-2.5 1.119-2.5 2.5s1.119 2.5 2.5 2.5c0.706 0 1.343-0.293 1.797-0.763l6.734 3.367c-0.021 0.129-0.031 0.261-0.031 0.396 0 1.381 1.119 2.5 2.5 2.5s2.5-1.119 2.5-2.5c0-1.381-1.119-2.5-2.5-2.5z"}}]})(props);
};
function ImMail (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.333 0h-10.666c-1.467 0-2.667 1.2-2.667 2.667v10.666c0 1.467 1.2 2.667 2.667 2.667h10.666c1.468 0 2.667-1.2 2.667-2.667v-10.666c0-1.467-1.199-2.667-2.667-2.667zM4 4h8c0.143 0 0.281 0.031 0.409 0.088l-4.409 5.143-4.409-5.143c0.127-0.058 0.266-0.088 0.409-0.088zM3 11v-6c0-0.021 0.001-0.042 0.002-0.063l2.932 3.421-2.9 2.9c-0.023-0.083-0.034-0.17-0.034-0.258zM12 12h-8c-0.088 0-0.175-0.012-0.258-0.034l2.846-2.846 1.413 1.648 1.413-1.648 2.846 2.846c-0.083 0.023-0.17 0.034-0.258 0.034zM13 11c0 0.088-0.012 0.175-0.034 0.258l-2.9-2.9 2.932-3.421c0.001 0.021 0.002 0.042 0.002 0.063v6z"}}]})(props);
};
function ImMail2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.333 0h-10.666c-1.467 0-2.667 1.2-2.667 2.667v10.666c0 1.468 1.2 2.667 2.667 2.667h10.666c1.467 0 2.667-1.199 2.667-2.667v-10.666c0-1.467-1.2-2.667-2.667-2.667zM13.333 2c0.125 0 0.243 0.036 0.344 0.099l-5.678 4.694-5.677-4.694c0.101-0.063 0.219-0.099 0.344-0.099h10.666zM2.667 14c-0.030 0-0.060-0.002-0.089-0.006l3.525-4.89-0.457-0.457-3.646 3.646v-9.549l6 7.256 6-7.256v9.549l-3.646-3.646-0.457 0.457 3.525 4.89c-0.029 0.004-0.059 0.006-0.088 0.006h-10.666z"}}]})(props);
};
function ImMail3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.333 0h-10.666c-1.467 0-2.667 1.2-2.667 2.667v10.666c0 1.468 1.2 2.667 2.667 2.667h10.666c1.467 0 2.667-1.199 2.667-2.667v-10.666c0-1.467-1.2-2.667-2.667-2.667zM2.854 13.854l-1.207-1.207 4-4 0.457 0.457-3.25 4.75zM2.396 3.104l0.457-0.457 5.146 4.146 5.146-4.146 0.457 0.457-5.604 6.604-5.604-6.604zM13.146 13.854l-3.25-4.75 0.457-0.457 4 4-1.207 1.207z"}}]})(props);
};
function ImMail4 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM4 4h8c0.143 0 0.281 0.031 0.409 0.088l-4.409 5.143-4.409-5.143c0.127-0.058 0.266-0.088 0.409-0.088zM3 11v-6c0-0.021 0.001-0.042 0.002-0.063l2.932 3.421-2.9 2.9c-0.023-0.083-0.034-0.17-0.034-0.258zM12 12h-8c-0.088 0-0.175-0.012-0.258-0.034l2.846-2.846 1.413 1.648 1.413-1.648 2.846 2.846c-0.083 0.023-0.17 0.034-0.258 0.034zM13 11c0 0.088-0.012 0.175-0.034 0.258l-2.9-2.9 2.932-3.421c0.001 0.021 0.002 0.042 0.002 0.063v6z"}}]})(props);
};
function ImAmazon (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.463 13.831c-1.753 1.294-4.291 1.981-6.478 1.981-3.066 0-5.825-1.131-7.912-3.019-0.163-0.147-0.019-0.35 0.178-0.234 2.253 1.313 5.041 2.1 7.919 2.1 1.941 0 4.075-0.403 6.041-1.238 0.294-0.125 0.544 0.197 0.253 0.409z"}},{"tag":"path","attr":{"d":"M15.191 13c-0.225-0.287-1.481-0.137-2.047-0.069-0.172 0.019-0.197-0.128-0.044-0.238 1.003-0.703 2.647-0.5 2.838-0.266 0.194 0.238-0.050 1.884-0.991 2.672-0.144 0.122-0.281 0.056-0.219-0.103 0.216-0.528 0.688-1.709 0.463-1.997z"}},{"tag":"path","attr":{"d":"M11.053 11.838l0.003 0.003c0.387-0.341 1.084-0.95 1.478-1.278 0.156-0.125 0.128-0.334 0.006-0.509-0.353-0.488-0.728-0.884-0.728-1.784v-3c0-1.272 0.088-2.438-0.847-3.313-0.738-0.706-1.963-0.956-2.9-0.956-1.831 0-3.875 0.684-4.303 2.947-0.047 0.241 0.131 0.369 0.287 0.403l1.866 0.203c0.175-0.009 0.3-0.181 0.334-0.356 0.159-0.778 0.813-1.156 1.547-1.156 0.397 0 0.847 0.144 1.081 0.5 0.269 0.397 0.234 0.938 0.234 1.397v0.25c-1.116 0.125-2.575 0.206-3.619 0.666-1.206 0.522-2.053 1.584-2.053 3.147 0 2 1.259 3 2.881 3 1.369 0 2.116-0.322 3.172-1.403 0.35 0.506 0.463 0.753 1.103 1.284 0.147 0.078 0.328 0.072 0.456-0.044zM9.113 7.144c0 0.75 0.019 1.375-0.359 2.041-0.306 0.544-0.791 0.875-1.331 0.875-0.737 0-1.169-0.563-1.169-1.394 0-1.641 1.472-1.938 2.863-1.938v0.416z"}}]})(props);
};
function ImGoogle (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8.159 6.856v2.744h4.537c-0.184 1.178-1.372 3.45-4.537 3.45-2.731 0-4.959-2.262-4.959-5.050s2.228-5.050 4.959-5.050c1.553 0 2.594 0.663 3.188 1.234l2.172-2.091c-1.394-1.306-3.2-2.094-5.359-2.094-4.422 0-8 3.578-8 8s3.578 8 8 8c4.616 0 7.681-3.247 7.681-7.816 0-0.525-0.056-0.925-0.125-1.325l-7.556-0.003z"}}]})(props);
};
function ImGoogle2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM8.119 14c-3.316 0-6-2.684-6-6s2.684-6 6-6c1.619 0 2.975 0.591 4.019 1.569l-1.628 1.569c-0.447-0.428-1.225-0.925-2.391-0.925-2.050 0-3.719 1.697-3.719 3.787s1.672 3.787 3.719 3.787c2.375 0 3.266-1.706 3.403-2.588h-3.403v-2.056h5.666c0.050 0.3 0.094 0.6 0.094 0.994 0.003 3.428-2.294 5.863-5.759 5.863z"}}]})(props);
};
function ImGoogle3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.419 0-8 3.581-8 8s3.581 8 8 8 8-3.581 8-8-3.581-8-8-8zM8.119 14c-3.316 0-6-2.684-6-6s2.684-6 6-6c1.619 0 2.975 0.591 4.019 1.569l-1.628 1.569c-0.447-0.428-1.225-0.925-2.391-0.925-2.050 0-3.719 1.697-3.719 3.787s1.672 3.787 3.719 3.787c2.375 0 3.266-1.706 3.403-2.588h-3.403v-2.056h5.666c0.050 0.3 0.094 0.6 0.094 0.994 0.003 3.428-2.294 5.863-5.759 5.863z"}}]})(props);
};
function ImGooglePlus (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5.091 7.147v1.747h2.888c-0.116 0.75-0.872 2.197-2.888 2.197-1.737 0-3.156-1.441-3.156-3.216s1.419-3.216 3.156-3.216c0.991 0 1.65 0.422 2.028 0.784l1.381-1.331c-0.888-0.828-2.037-1.331-3.409-1.331-2.816 0.003-5.091 2.278-5.091 5.094s2.275 5.091 5.091 5.091c2.937 0 4.888-2.066 4.888-4.975 0-0.334-0.037-0.591-0.081-0.844h-4.806z"}},{"tag":"path","attr":{"d":"M16 7h-1.5v-1.5h-1.5v1.5h-1.5v1.5h1.5v1.5h1.5v-1.5h1.5z"}}]})(props);
};
function ImGooglePlus2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM6 12c-2.212 0-4-1.787-4-4s1.788-4 4-4c1.081 0 1.984 0.394 2.681 1.047l-1.088 1.044c-0.297-0.284-0.816-0.616-1.594-0.616-1.366 0-2.481 1.131-2.481 2.525s1.116 2.525 2.481 2.525c1.584 0 2.178-1.137 2.269-1.725h-2.269v-1.372h3.778c0.034 0.2 0.063 0.4 0.063 0.663 0 2.287-1.531 3.909-3.841 3.909zM14 8h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1z"}}]})(props);
};
function ImGooglePlus3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.419 0-8 3.581-8 8s3.581 8 8 8 8-3.581 8-8-3.581-8-8-8zM6 12c-2.212 0-4-1.787-4-4s1.788-4 4-4c1.081 0 1.984 0.394 2.681 1.047l-1.088 1.044c-0.297-0.284-0.816-0.616-1.594-0.616-1.366 0-2.481 1.131-2.481 2.525s1.116 2.525 2.481 2.525c1.584 0 2.178-1.137 2.269-1.725h-2.269v-1.372h3.778c0.034 0.2 0.063 0.4 0.063 0.663 0 2.287-1.531 3.909-3.841 3.909zM13 8v1h-1v-1h-1v-1h1v-1h1v1h1v1h-1z"}}]})(props);
};
function ImHangouts (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7.997 0c-3.816 0-6.909 3.094-6.909 6.909 0 3.616 3.294 6.547 6.909 6.547v2.544c4.197-2.128 6.916-5.556 6.916-9.091 0-3.816-3.1-6.909-6.916-6.909zM7 8c0 0.828-0.447 1.5-1 1.5v-1.5h-2v-3h3v3zM12 8c0 0.828-0.447 1.5-1 1.5v-1.5h-2v-3h3v3z"}}]})(props);
};
function ImGoogleDrive (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.844 10l-2.884 5h9.072l2.884-5z"}},{"tag":"path","attr":{"d":"M15.506 9l-4.619-8h-5.775l4.619 8z"}},{"tag":"path","attr":{"d":"M4.534 2l-4.534 7.856 2.888 5 4.534-7.856z"}}]})(props);
};
function ImFacebook (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9.5 3h2.5v-3h-2.5c-1.93 0-3.5 1.57-3.5 3.5v1.5h-2v3h2v8h3v-8h2.5l0.5-3h-3v-1.5c0-0.271 0.229-0.5 0.5-0.5z"}}]})(props);
};
function ImFacebook2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h6.5v-7h-2v-2h2v-1c0-1.653 1.347-3 3-3h2v2h-2c-0.55 0-1 0.45-1 1v1h3l-0.5 2h-2.5v7h4.5c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5z"}}]})(props);
};
function ImInstagram (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM11 2.5c0-0.275 0.225-0.5 0.5-0.5h2c0.275 0 0.5 0.225 0.5 0.5v2c0 0.275-0.225 0.5-0.5 0.5h-2c-0.275 0-0.5-0.225-0.5-0.5v-2zM8 5c1.656 0 3 1.344 3 3s-1.344 3-3 3c-1.656 0-3-1.344-3-3s1.344-3 3-3zM14 13.5v0c0 0.275-0.225 0.5-0.5 0.5h-11c-0.275 0-0.5-0.225-0.5-0.5v0-6.5h1.1c-0.066 0.322-0.1 0.656-0.1 1 0 2.762 2.237 5 5 5s5-2.238 5-5c0-0.344-0.034-0.678-0.1-1h1.1v6.5z"}}]})(props);
};
function ImWhatsapp (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.641 2.325c-1.497-1.5-3.488-2.325-5.609-2.325-4.369 0-7.925 3.556-7.925 7.928 0 1.397 0.366 2.763 1.059 3.963l-1.125 4.109 4.203-1.103c1.159 0.631 2.463 0.966 3.787 0.966h0.003c0 0 0 0 0 0 4.369 0 7.928-3.556 7.928-7.928 0-2.119-0.825-4.109-2.322-5.609zM8.034 14.525v0c-1.184 0-2.344-0.319-3.356-0.919l-0.241-0.144-2.494 0.653 0.666-2.431-0.156-0.25c-0.663-1.047-1.009-2.259-1.009-3.506 0-3.634 2.956-6.591 6.594-6.591 1.759 0 3.416 0.688 4.659 1.931 1.244 1.247 1.928 2.9 1.928 4.662-0.003 3.637-2.959 6.594-6.591 6.594zM11.647 9.588c-0.197-0.1-1.172-0.578-1.353-0.644s-0.313-0.1-0.447 0.1c-0.131 0.197-0.512 0.644-0.628 0.778-0.116 0.131-0.231 0.15-0.428 0.050s-0.838-0.309-1.594-0.984c-0.588-0.525-0.987-1.175-1.103-1.372s-0.013-0.306 0.088-0.403c0.091-0.088 0.197-0.231 0.297-0.347s0.131-0.197 0.197-0.331c0.066-0.131 0.034-0.247-0.016-0.347s-0.447-1.075-0.609-1.472c-0.159-0.388-0.325-0.334-0.447-0.341-0.116-0.006-0.247-0.006-0.378-0.006s-0.347 0.050-0.528 0.247c-0.181 0.197-0.694 0.678-0.694 1.653s0.709 1.916 0.809 2.050c0.1 0.131 1.397 2.134 3.384 2.991 0.472 0.203 0.841 0.325 1.128 0.419 0.475 0.15 0.906 0.128 1.247 0.078 0.381-0.056 1.172-0.478 1.338-0.941s0.166-0.859 0.116-0.941c-0.047-0.088-0.178-0.137-0.378-0.238z"}}]})(props);
};
function ImSpotify (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.559-8-8-8zM11.681 11.559c-0.159 0.241-0.441 0.319-0.681 0.159-1.881-1.159-4.241-1.4-7.041-0.759-0.281 0.081-0.519-0.119-0.6-0.359-0.081-0.281 0.119-0.519 0.359-0.6 3.041-0.681 5.681-0.4 7.759 0.881 0.281 0.119 0.322 0.438 0.203 0.678zM12.641 9.359c-0.2 0.281-0.559 0.4-0.841 0.2-2.159-1.319-5.441-1.719-7.959-0.919-0.319 0.081-0.681-0.081-0.759-0.4-0.081-0.319 0.081-0.681 0.4-0.759 2.919-0.881 6.519-0.441 9 1.081 0.238 0.119 0.359 0.519 0.159 0.797zM12.719 7.119c-2.559-1.519-6.841-1.681-9.281-0.919-0.4 0.119-0.8-0.119-0.919-0.481-0.119-0.4 0.119-0.8 0.481-0.919 2.841-0.841 7.519-0.681 10.481 1.081 0.359 0.2 0.481 0.681 0.281 1.041-0.203 0.278-0.681 0.397-1.044 0.197z"}}]})(props);
};
function ImTelegram (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.419 0-8 3.581-8 8s3.581 8 8 8 8-3.581 8-8-3.581-8-8-8zM11.931 5.484l-1.313 6.184c-0.091 0.441-0.356 0.544-0.725 0.341l-2-1.478-0.959 0.934c-0.112 0.109-0.2 0.2-0.4 0.2-0.259 0-0.216-0.097-0.303-0.344l-0.681-2.237-1.978-0.616c-0.428-0.131-0.431-0.425 0.097-0.634l7.706-2.975c0.35-0.159 0.691 0.084 0.556 0.625z"}}]})(props);
};
function ImTwitter (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 3.538c-0.588 0.263-1.222 0.438-1.884 0.516 0.678-0.406 1.197-1.050 1.444-1.816-0.634 0.375-1.338 0.65-2.084 0.797-0.6-0.638-1.453-1.034-2.397-1.034-1.813 0-3.281 1.469-3.281 3.281 0 0.256 0.028 0.506 0.084 0.747-2.728-0.138-5.147-1.444-6.766-3.431-0.281 0.484-0.444 1.050-0.444 1.65 0 1.138 0.578 2.144 1.459 2.731-0.538-0.016-1.044-0.166-1.488-0.409 0 0.013 0 0.028 0 0.041 0 1.591 1.131 2.919 2.634 3.219-0.275 0.075-0.566 0.116-0.866 0.116-0.212 0-0.416-0.022-0.619-0.059 0.419 1.303 1.631 2.253 3.066 2.281-1.125 0.881-2.538 1.406-4.078 1.406-0.266 0-0.525-0.016-0.784-0.047 1.456 0.934 3.181 1.475 5.034 1.475 6.037 0 9.341-5.003 9.341-9.341 0-0.144-0.003-0.284-0.009-0.425 0.641-0.459 1.197-1.038 1.637-1.697z"}}]})(props);
};
function ImVine (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.012 7.953c-0.412 0.094-0.809 0.137-1.169 0.137-2.019 0-3.572-1.409-3.572-3.862 0-1.203 0.466-1.825 1.122-1.825 0.625 0 1.041 0.559 1.041 1.697 0 0.647-0.172 1.356-0.3 1.775 0 0 0.622 1.084 2.322 0.753 0.363-0.803 0.556-1.841 0.556-2.75 0-2.45-1.25-3.878-3.541-3.878-2.356 0-3.734 1.809-3.734 4.197 0 2.366 1.106 4.394 2.928 5.319-0.766 1.534-1.741 2.884-2.759 3.903-1.844-2.231-3.513-5.206-4.197-11.016h-2.722c1.259 9.675 5.006 12.756 6 13.347 0.559 0.337 1.044 0.322 1.556 0.031 0.806-0.456 3.222-2.875 4.563-5.703 0.563 0 1.238-0.066 1.909-0.219v-1.906z"}}]})(props);
};
function ImVk (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM12.959 11.2l-1.463 0.022c0 0-0.316 0.063-0.728-0.222-0.547-0.375-1.063-1.353-1.466-1.225-0.406 0.128-0.394 1.006-0.394 1.006s0.003 0.188-0.091 0.287c-0.1 0.109-0.3 0.131-0.3 0.131h-0.653c0 0-1.444 0.088-2.716-1.238-1.388-1.444-2.612-4.309-2.612-4.309s-0.072-0.188 0.006-0.278c0.087-0.103 0.322-0.109 0.322-0.109l1.566-0.009c0 0 0.147 0.025 0.253 0.103 0.088 0.063 0.134 0.184 0.134 0.184s0.253 0.641 0.588 1.219c0.653 1.128 0.959 1.375 1.181 1.256 0.322-0.175 0.225-1.597 0.225-1.597s0.006-0.516-0.162-0.744c-0.131-0.178-0.378-0.231-0.484-0.244-0.088-0.013 0.056-0.216 0.244-0.309 0.281-0.138 0.778-0.147 1.366-0.141 0.456 0.003 0.591 0.034 0.769 0.075 0.541 0.131 0.356 0.634 0.356 1.841 0 0.388-0.069 0.931 0.209 1.109 0.119 0.078 0.412 0.012 1.147-1.234 0.347-0.591 0.609-1.284 0.609-1.284s0.056-0.125 0.144-0.178c0.091-0.053 0.213-0.037 0.213-0.037l1.647-0.009c0 0 0.494-0.059 0.575 0.166 0.084 0.234-0.184 0.781-0.856 1.678-1.103 1.472-1.228 1.334-0.309 2.184 0.875 0.813 1.056 1.209 1.088 1.259 0.356 0.6-0.406 0.647-0.406 0.647z"}}]})(props);
};
function ImRenren (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.644 0.166c-3.769 0.634-6.644 3.913-6.644 7.862 0 1.963 0.713 3.759 1.887 5.15 2.791-1.35 4.744-4.406 4.756-7.966v-5.047z"}},{"tag":"path","attr":{"d":"M9.356 0.166c3.769 0.634 6.644 3.913 6.644 7.862 0 1.963-0.713 3.759-1.887 5.15-2.791-1.35-4.744-4.406-4.756-7.966v-5.047z"}},{"tag":"path","attr":{"d":"M7.972 10.041c-0.497 2.056-1.981 3.813-3.828 4.981 1.138 0.622 2.441 0.978 3.828 0.978s2.691-0.356 3.828-0.978c-1.847-1.169-3.331-2.925-3.828-4.981z"}}]})(props);
};
function ImSinaWeibo (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.722 14.031c-2.65 0.262-4.938-0.938-5.109-2.675-0.172-1.741 1.837-3.359 4.484-3.622 2.65-0.263 4.938 0.938 5.106 2.675 0.175 1.741-1.834 3.362-4.481 3.622zM12.019 8.259c-0.225-0.069-0.381-0.113-0.262-0.409 0.256-0.644 0.281-1.197 0.003-1.594-0.519-0.741-1.941-0.703-3.569-0.019 0 0-0.513 0.222-0.381-0.181 0.25-0.806 0.213-1.478-0.178-1.869-0.884-0.884-3.234 0.034-5.25 2.050-1.506 1.503-2.381 3.106-2.381 4.491 0 2.644 3.394 4.253 6.713 4.253 4.35 0 7.247-2.528 7.247-4.534 0-1.216-1.022-1.903-1.941-2.188z"}},{"tag":"path","attr":{"d":"M14.909 3.416c-1.050-1.166-2.6-1.609-4.031-1.306v0c-0.331 0.072-0.541 0.397-0.469 0.725 0.072 0.331 0.394 0.541 0.725 0.469 1.019-0.216 2.119 0.1 2.866 0.928s0.95 1.956 0.628 2.944v0c-0.103 0.322 0.072 0.666 0.394 0.772 0.322 0.103 0.666-0.072 0.772-0.394v-0.003c0.45-1.381 0.166-2.969-0.884-4.134z"}},{"tag":"path","attr":{"d":"M13.294 4.875c-0.512-0.569-1.269-0.784-1.963-0.634-0.284 0.059-0.466 0.344-0.406 0.628 0.063 0.284 0.344 0.466 0.625 0.403v0c0.341-0.072 0.709 0.034 0.959 0.309 0.25 0.278 0.319 0.656 0.209 0.987v0c-0.088 0.275 0.063 0.575 0.341 0.666 0.278 0.088 0.575-0.063 0.666-0.341 0.219-0.678 0.081-1.453-0.431-2.019z"}},{"tag":"path","attr":{"d":"M6.869 10.884c-0.094 0.159-0.297 0.234-0.456 0.169-0.159-0.063-0.206-0.244-0.116-0.397 0.094-0.153 0.291-0.228 0.447-0.169 0.156 0.056 0.213 0.234 0.125 0.397zM6.022 11.966c-0.256 0.409-0.806 0.588-1.219 0.4-0.406-0.184-0.528-0.659-0.272-1.059 0.253-0.397 0.784-0.575 1.194-0.403 0.416 0.178 0.55 0.65 0.297 1.063zM6.984 9.072c-1.259-0.328-2.684 0.3-3.231 1.409-0.559 1.131-0.019 2.391 1.253 2.803 1.319 0.425 2.875-0.228 3.416-1.447 0.534-1.197-0.131-2.425-1.438-2.766z"}}]})(props);
};
function ImRss (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M2.13 11.733c-1.175 0-2.13 0.958-2.13 2.126 0 1.174 0.955 2.122 2.13 2.122 1.179 0 2.133-0.948 2.133-2.122-0-1.168-0.954-2.126-2.133-2.126zM0.002 5.436v3.067c1.997 0 3.874 0.781 5.288 2.196 1.412 1.411 2.192 3.297 2.192 5.302h3.080c-0-5.825-4.739-10.564-10.56-10.564zM0.006 0v3.068c7.122 0 12.918 5.802 12.918 12.932h3.076c0-8.82-7.176-16-15.994-16z"}}]})(props);
};
function ImRss2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM4.359 12.988c-0.75 0-1.359-0.603-1.359-1.353 0-0.744 0.609-1.356 1.359-1.356 0.753 0 1.359 0.613 1.359 1.356 0 0.75-0.609 1.353-1.359 1.353zM7.772 13c0-1.278-0.497-2.481-1.397-3.381-0.903-0.903-2.1-1.4-3.375-1.4v-1.956c3.713 0 6.738 3.022 6.738 6.737h-1.966zM11.244 13c0-4.547-3.697-8.25-8.241-8.25v-1.956c5.625 0 10.203 4.581 10.203 10.206h-1.963z"}}]})(props);
};
function ImYoutube (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.841 4.8c0 0-0.156-1.103-0.637-1.587-0.609-0.637-1.291-0.641-1.603-0.678-2.237-0.163-5.597-0.163-5.597-0.163h-0.006c0 0-3.359 0-5.597 0.163-0.313 0.038-0.994 0.041-1.603 0.678-0.481 0.484-0.634 1.587-0.634 1.587s-0.159 1.294-0.159 2.591v1.213c0 1.294 0.159 2.591 0.159 2.591s0.156 1.103 0.634 1.588c0.609 0.637 1.409 0.616 1.766 0.684 1.281 0.122 5.441 0.159 5.441 0.159s3.363-0.006 5.6-0.166c0.313-0.037 0.994-0.041 1.603-0.678 0.481-0.484 0.637-1.588 0.637-1.588s0.159-1.294 0.159-2.591v-1.213c-0.003-1.294-0.162-2.591-0.162-2.591zM6.347 10.075v-4.497l4.322 2.256-4.322 2.241z"}}]})(props);
};
function ImYoutube2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 40 16"},"child":[{"tag":"path","attr":{"d":"M5.375 2.647c0.003-0.014 0.005-0.023 0.006-0.028l0.016-0.118-0.74-0.004c-0.668-0.004-0.873 0-0.891 0.017-0.009 0.008-0.24 0.885-0.651 2.473-0.196 0.758-0.361 1.363-0.367 1.345s-0.24-0.883-0.522-1.922c-0.281-1.039-0.517-1.894-0.524-1.901-0.010-0.010-0.906-0.014-1.632-0.008-0.105 0.001-0.164-0.205 0.938 3.299 0.152 0.485 0.381 1.172 0.507 1.526 0.146 0.408 0.25 0.724 0.321 0.987 0.126 0.501 0.13 0.815 0.103 1.182-0.032 0.423-0.036 3.413-0.005 3.463 0.024 0.038 1.425 0.056 1.558 0.020 0.021-0.006 0.035-0.026 0.045-0.139 0.033-0.097 0.036-0.484 0.036-2.090v-2.051l0.090-0.283c0.059-0.185 0.206-0.672 0.328-1.082s0.269-0.9 0.327-1.090c0.529-1.724 1.033-3.419 1.047-3.516l0.011-0.079z"}},{"tag":"path","attr":{"d":"M13.221 5.135l-0 0.107-0.017 0-0.009 2.953-0.009 2.863-0.229 0.233c-0.257 0.261-0.462 0.361-0.648 0.314-0.203-0.051-0.197 0.028-0.214-3.356l-0.016-3.115h-1.474v0.107h-0.017v3.38c0 3.621-0 3.619 0.184 3.982 0.146 0.29 0.36 0.431 0.725 0.479h0c0.481 0.064 1-0.154 1.481-0.622l0.209-0.203v0.351c0 0.303 0.009 0.353 0.064 0.368 0.090 0.025 1.206 0.027 1.326 0.002l0.1-0.021v-0.104l0.017-0.003v-7.736l-1.472 0.020z"}},{"tag":"path","attr":{"d":"M9.483 6.661c-0.14-0.599-0.401-1.002-0.832-1.28-0.676-0.437-1.449-0.484-2.165-0.13-0.522 0.258-0.859 0.686-1.032 1.314-0.021 0.075-0.036 0.138-0.047 0.231-0.044 0.222-0.049 0.552-0.061 2.093-0.018 2.374 0.010 2.656 0.307 3.195 0.292 0.529 0.897 0.917 1.556 0.997 0.198 0.024 0.6-0.013 0.832-0.078 0.525-0.146 1.029-0.561 1.252-1.032 0.096-0.204 0.154-0.345 0.189-0.604 0.065-0.353 0.070-0.925 0.070-2.381-0-1.857-0.006-2.060-0.068-2.326zM7.802 11.5c-0.124 0.094-0.34 0.135-0.515 0.098-0.135-0.029-0.318-0.241-0.374-0.434-0.070-0.241-0.075-3.594-0.015-4.251 0.1-0.329 0.378-0.501 0.682-0.419 0.237 0.064 0.358 0.212 0.427 0.523 0.051 0.231 0.057 0.518 0.046 2.207-0.007 1.12-0.011 1.668-0.048 1.962-0.037 0.185-0.099 0.235-0.203 0.315z"}},{"tag":"path","attr":{"d":"M35.944 8.346h0.712l-0.011-0.645c-0.011-0.592-0.020-0.659-0.099-0.82-0.125-0.253-0.309-0.366-0.601-0.366-0.351 0-0.573 0.17-0.678 0.518-0.045 0.148-0.092 1.167-0.058 1.255 0.019 0.049 0.121 0.058 0.735 0.058z"}},{"tag":"path","attr":{"d":"M31.184 6.879c-0.095-0.191-0.272-0.286-0.477-0.278-0.16 0.006-0.337 0.073-0.508 0.203l-0.127 0.097v4.634l0.127 0.097c0.288 0.22 0.604 0.266 0.822 0.12 0.086-0.058 0.142-0.137 0.186-0.263 0.057-0.164 0.062-0.375 0.055-2.325-0.008-2.032-0.012-2.152-0.078-2.285z"}},{"tag":"path","attr":{"d":"M40.014 4.791c-0.142-1.701-0.255-2.253-0.605-2.962-0.465-0.939-1.136-1.434-2.092-1.543-0.739-0.084-3.521-0.203-6.094-0.26-4.456-0.099-11.782 0.092-12.718 0.331-0.432 0.111-0.757 0.299-1.094 0.634-0.591 0.588-0.944 1.432-1.085 2.6-0.323 2.666-0.33 5.886-0.019 8.649 0.134 1.188 0.41 1.96 0.928 2.596 0.323 0.397 0.881 0.734 1.379 0.835 0.35 0.071 2.1 0.169 4.65 0.26 0.38 0.014 1.385 0.037 2.235 0.052 1.77 0.031 5.025 0.013 6.886-0.039 1.252-0.035 3.534-0.128 3.961-0.161 0.12-0.009 0.398-0.027 0.618-0.039 0.739-0.042 1.209-0.196 1.65-0.543 0.571-0.449 1.013-1.278 1.2-2.251 0.177-0.92 0.295-2.559 0.319-4.42 0.020-1.555-0.007-2.393-0.119-3.741zM22.27 4.175l-0.828 0.010-0.036 8.83-0.718 0.009c-0.555 0.008-0.724-0.001-0.737-0.036-0.010-0.025-0.021-2.016-0.026-4.424l-0.009-4.379-1.617-0.020v-1.38l4.779 0.019 0.020 1.36-0.828 0.010zM27.347 9.236v3.797h-1.308v-0.4c0-0.301-0.011-0.4-0.047-0.4-0.026 0-0.144 0.099-0.263 0.22-0.259 0.263-0.565 0.474-0.827 0.572-0.542 0.203-1.056 0.084-1.275-0.293-0.201-0.345-0.204-0.423-0.204-4.005v-3.29h1.307l0.010 3.098c0.010 3.044 0.011 3.1 0.084 3.224 0.097 0.164 0.244 0.209 0.478 0.144 0.138-0.038 0.232-0.105 0.455-0.327l0.282-0.28v-5.859h1.308v3.797zM32.449 12.491c-0.115 0.257-0.372 0.508-0.583 0.57-0.549 0.162-0.99 0.030-1.499-0.449-0.158-0.149-0.305-0.269-0.327-0.269-0.027 0-0.041 0.116-0.041 0.345v0.345h-1.308v-10.248h1.308v1.672c0 0.919 0.012 1.672 0.027 1.672s0.153-0.122 0.307-0.27c0.354-0.341 0.649-0.491 1.024-0.519 0.669-0.051 1.068 0.294 1.25 1.080 0.057 0.245 0.062 0.525 0.062 2.798-0 2.768-0 2.78-0.221 3.273zM37.984 10.971c-0.012 0.285-0.046 0.612-0.077 0.727-0.182 0.674-0.666 1.152-1.366 1.348-0.942 0.264-1.98-0.168-2.394-0.997-0.232-0.465-0.241-0.558-0.241-2.831 0-1.853 0.007-2.081 0.066-2.334 0.168-0.715 0.584-1.178 1.289-1.435 0.204-0.074 0.417-0.113 0.63-0.117 0.761-0.016 1.515 0.393 1.832 1.059 0.213 0.449 0.24 0.642 0.261 1.908l0.019 1.136-2.789 0.019-0.010 0.763c-0.015 1.077 0.058 1.408 0.349 1.603 0.244 0.165 0.62 0.152 0.824-0.027 0.192-0.168 0.246-0.349 0.265-0.877l0.017-0.463h1.347l-0.022 0.518z"}}]})(props);
};
function ImTwitch (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M1.5 0l-1.5 2.5v11.5h4v2h2l2-2h2.5l4.5-4.5v-9.5h-13.5zM13 8.5l-2.5 2.5h-2.5l-2 2v-2h-3v-9h10v6.5z"}},{"tag":"path","attr":{"d":"M9.5 4h1.5v4h-1.5v-4z"}},{"tag":"path","attr":{"d":"M6.5 4h1.5v4h-1.5v-4z"}}]})(props);
};
function ImVimeo (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.994 4.281c-0.072 1.556-1.159 3.691-3.263 6.397-2.175 2.825-4.016 4.241-5.522 4.241-0.931 0-1.722-0.859-2.366-2.581-0.431-1.578-0.859-3.156-1.291-4.734-0.478-1.722-0.991-2.581-1.541-2.581-0.119 0-0.538 0.253-1.256 0.753l-0.753-0.969c0.791-0.694 1.569-1.388 2.334-2.081 1.053-0.909 1.844-1.387 2.372-1.438 1.244-0.119 2.013 0.731 2.3 2.553 0.309 1.966 0.525 3.188 0.647 3.666 0.359 1.631 0.753 2.447 1.184 2.447 0.334 0 0.838-0.528 1.509-1.588 0.669-1.056 1.028-1.862 1.078-2.416 0.097-0.912-0.262-1.372-1.078-1.372-0.384 0-0.778 0.088-1.184 0.263 0.787-2.575 2.287-3.825 4.506-3.753 1.641 0.044 2.416 1.109 2.322 3.194z"}}]})(props);
};
function ImVimeo2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM13.463 5.313c-0.050 1.125-0.838 2.666-2.359 4.622-1.572 2.044-2.903 3.066-3.991 3.066-0.675 0-1.244-0.622-1.709-1.866-0.313-1.141-0.622-2.281-0.934-3.422-0.344-1.244-0.716-1.866-1.112-1.866-0.087 0-0.391 0.181-0.906 0.544l-0.544-0.7c0.572-0.5 1.134-1.003 1.687-1.503 0.763-0.656 1.331-1.003 1.712-1.038 0.9-0.087 1.453 0.528 1.662 1.844 0.225 1.422 0.381 2.303 0.469 2.65 0.259 1.178 0.544 1.766 0.856 1.766 0.241 0 0.606-0.381 1.091-1.147s0.744-1.347 0.778-1.747c0.069-0.659-0.191-0.991-0.778-0.991-0.278 0-0.563 0.063-0.856 0.191 0.569-1.859 1.653-2.766 3.256-2.712 1.188 0.034 1.747 0.803 1.678 2.309z"}}]})(props);
};
function ImLanyrd (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM12.85 12.012l-5.444 1.781c-1.244 0.406-1.369 0.341-1.931-1.4l-1.375-4.259c-0.328-1.009-1.328-3.728-1.497-4.25-0.313-0.969-0.313-1.022 1.516-1.616 1.431-0.469 1.491-0.453 2.009 1.163 0.419 1.3 0.688 2.35 1.119 3.678l1.172 3.625 3.744-1.225c0.738-0.244 0.984-0.231 1.194 0.678l0.15 0.688c0.175 0.797-0.228 1-0.656 1.137z"}}]})(props);
};
function ImFlickr (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 8.5c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5zM9 8.5c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5z"}}]})(props);
};
function ImFlickr2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.5 6.5c-1.103 0-2 0.897-2 2s0.897 2 2 2c1.103 0 2-0.897 2-2s-0.897-2-2-2zM12.5 5v0c1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5-3.5-1.567-3.5-3.5c0-1.933 1.567-3.5 3.5-3.5zM0 8.5c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5z"}}]})(props);
};
function ImFlickr3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM4.5 10.5c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zM11.5 10.5c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5c1.381 0 2.5 1.119 2.5 2.5s-1.119 2.5-2.5 2.5z"}}]})(props);
};
function ImFlickr4 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.606-8 8.055s3.582 8.055 8 8.055 8-3.606 8-8.055-3.582-8.055-8-8.055zM4.5 10.5c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5c0 1.381-1.119 2.5-2.5 2.5zM11.5 10.5c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5c0 1.381-1.119 2.5-2.5 2.5z"}}]})(props);
};
function ImDribbble (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 16c-4.412 0-8-3.588-8-8s3.587-8 8-8c4.412 0 8 3.587 8 8s-3.588 8-8 8v0zM14.747 9.094c-0.234-0.075-2.116-0.634-4.256-0.291 0.894 2.456 1.256 4.456 1.328 4.872 1.531-1.037 2.625-2.678 2.928-4.581v0zM10.669 14.3c-0.103-0.6-0.497-2.688-1.456-5.181-0.016 0.006-0.031 0.009-0.044 0.016-3.856 1.344-5.241 4.016-5.362 4.266 1.159 0.903 2.616 1.444 4.194 1.444 0.947 0 1.85-0.194 2.669-0.544v0zM2.922 12.578c0.156-0.266 2.031-3.369 5.553-4.509 0.088-0.028 0.178-0.056 0.269-0.081-0.172-0.388-0.359-0.778-0.553-1.159-3.409 1.022-6.722 0.978-7.022 0.975-0.003 0.069-0.003 0.138-0.003 0.209 0 1.753 0.666 3.356 1.756 4.566v0zM1.313 6.609c0.306 0.003 3.122 0.016 6.319-0.831-1.131-2.013-2.353-3.706-2.534-3.953-1.913 0.903-3.344 2.666-3.784 4.784v0zM6.4 1.366c0.188 0.253 1.431 1.944 2.55 4 2.431-0.909 3.459-2.294 3.581-2.469-1.206-1.072-2.794-1.722-4.531-1.722-0.55 0.003-1.088 0.069-1.6 0.191v0zM13.291 3.691c-0.144 0.194-1.291 1.663-3.816 2.694 0.159 0.325 0.313 0.656 0.453 0.991 0.050 0.119 0.1 0.234 0.147 0.353 2.275-0.284 4.534 0.172 4.759 0.219-0.016-1.612-0.594-3.094-1.544-4.256v0z"}}]})(props);
};
function ImBehance (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4.641 3.206c0.472 0 0.897 0.041 1.284 0.125 0.388 0.081 0.716 0.219 0.994 0.406 0.275 0.188 0.487 0.438 0.644 0.75 0.15 0.309 0.225 0.697 0.225 1.156 0 0.497-0.112 0.909-0.338 1.241-0.228 0.331-0.559 0.6-1.003 0.813 0.606 0.175 1.053 0.481 1.353 0.916 0.3 0.438 0.444 0.963 0.444 1.581 0 0.5-0.097 0.928-0.287 1.291-0.194 0.366-0.456 0.662-0.778 0.891-0.325 0.231-0.7 0.4-1.119 0.509-0.416 0.109-0.844 0.166-1.287 0.166h-4.772v-9.844h4.641zM4.359 7.181c0.384 0 0.703-0.091 0.953-0.275 0.25-0.181 0.369-0.481 0.369-0.894 0-0.228-0.041-0.419-0.122-0.566-0.084-0.147-0.194-0.263-0.334-0.344-0.138-0.084-0.294-0.141-0.478-0.172-0.178-0.034-0.366-0.050-0.556-0.050h-2.025v2.3h2.194zM4.478 11.372c0.213 0 0.416-0.019 0.606-0.063 0.194-0.044 0.366-0.109 0.509-0.209 0.144-0.097 0.266-0.225 0.353-0.394 0.088-0.166 0.128-0.378 0.128-0.637 0-0.506-0.144-0.869-0.428-1.088-0.284-0.216-0.662-0.322-1.131-0.322h-2.35v2.709h2.313z"}},{"tag":"path","attr":{"d":"M11.331 11.338c0.294 0.287 0.716 0.431 1.266 0.431 0.394 0 0.738-0.1 1.022-0.3s0.456-0.412 0.522-0.631h1.725c-0.278 0.859-0.697 1.469-1.272 1.838-0.566 0.369-1.259 0.556-2.063 0.556-0.563 0-1.066-0.091-1.519-0.269-0.453-0.181-0.831-0.434-1.15-0.766-0.309-0.331-0.553-0.725-0.725-1.188-0.169-0.459-0.256-0.969-0.256-1.519 0-0.534 0.088-1.031 0.262-1.491 0.178-0.463 0.422-0.859 0.747-1.194s0.706-0.6 1.156-0.794c0.447-0.194 0.941-0.291 1.488-0.291 0.603 0 1.131 0.116 1.584 0.353 0.45 0.234 0.822 0.55 1.113 0.944s0.497 0.847 0.625 1.353c0.128 0.506 0.172 1.034 0.137 1.588h-5.147c0 0.559 0.188 1.094 0.484 1.378zM13.578 7.594c-0.231-0.256-0.628-0.397-1.106-0.397-0.313 0-0.572 0.053-0.778 0.159-0.203 0.106-0.369 0.237-0.497 0.394-0.125 0.156-0.213 0.325-0.262 0.503-0.050 0.172-0.081 0.331-0.091 0.469h3.188c-0.047-0.5-0.219-0.869-0.453-1.128z"}},{"tag":"path","attr":{"d":"M10.444 4h3.991v0.972h-3.991v-0.972z"}}]})(props);
};
function ImBehance2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.316 7.009c0.203-0.147 0.3-0.391 0.3-0.728 0-0.188-0.031-0.341-0.097-0.459-0.069-0.119-0.156-0.213-0.272-0.278-0.112-0.069-0.241-0.116-0.388-0.141-0.144-0.028-0.297-0.041-0.453-0.041h-1.647v1.869h1.781c0.313 0.003 0.572-0.072 0.775-0.222z"}},{"tag":"path","attr":{"d":"M6.594 8.697c-0.231-0.175-0.537-0.262-0.919-0.262h-1.916v2.203h1.878c0.175 0 0.338-0.016 0.494-0.050s0.297-0.088 0.416-0.169c0.119-0.078 0.216-0.184 0.287-0.319s0.106-0.309 0.106-0.519c0-0.412-0.116-0.706-0.347-0.884z"}},{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM10.488 4.209h3.241v0.791h-3.241v-0.791zM8.463 10.725c-0.156 0.297-0.369 0.537-0.631 0.725-0.266 0.188-0.569 0.325-0.909 0.416-0.338 0.091-0.688 0.134-1.044 0.134h-3.878v-7.997h3.769c0.381 0 0.728 0.034 1.044 0.1 0.313 0.066 0.581 0.178 0.806 0.331 0.222 0.153 0.397 0.356 0.522 0.609 0.122 0.25 0.184 0.566 0.184 0.938 0 0.403-0.091 0.737-0.275 1.006s-0.453 0.487-0.816 0.659c0.494 0.141 0.856 0.391 1.097 0.744 0.244 0.356 0.363 0.784 0.363 1.284 0.003 0.409-0.075 0.759-0.231 1.050zM14.991 9.488h-4.178c0 0.456 0.156 0.891 0.394 1.125 0.238 0.231 0.581 0.35 1.028 0.35 0.322 0 0.597-0.081 0.831-0.244 0.231-0.162 0.372-0.334 0.425-0.512h1.4c-0.225 0.697-0.566 1.194-1.031 1.494-0.459 0.3-1.022 0.45-1.675 0.45-0.456 0-0.866-0.075-1.234-0.219-0.369-0.147-0.675-0.353-0.934-0.622-0.253-0.269-0.447-0.591-0.588-0.966-0.137-0.372-0.209-0.787-0.209-1.234 0-0.434 0.072-0.838 0.213-1.213 0.144-0.375 0.344-0.7 0.606-0.969 0.262-0.272 0.575-0.487 0.938-0.647 0.363-0.156 0.762-0.234 1.206-0.234 0.491 0 0.919 0.094 1.287 0.287 0.366 0.191 0.666 0.447 0.903 0.769s0.403 0.688 0.509 1.1c0.103 0.406 0.137 0.834 0.109 1.284z"}},{"tag":"path","attr":{"d":"M12.134 7.247c-0.253 0-0.466 0.044-0.631 0.131s-0.3 0.194-0.403 0.319c-0.103 0.128-0.172 0.263-0.213 0.409-0.041 0.141-0.066 0.269-0.072 0.381h2.588c-0.037-0.406-0.178-0.706-0.366-0.916-0.194-0.213-0.512-0.325-0.903-0.325z"}}]})(props);
};
function ImDeviantart (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.953 2.909v-2.909h-2.909l-0.291 0.294-1.375 2.616-0.431 0.291h-4.9v3.994h2.694l0.241 0.291-2.934 5.606v2.909h2.909l0.291-0.294 1.375-2.616 0.431-0.291h4.9v-3.994h-2.694l-0.241-0.294z"}}]})(props);
};
function Im500Px (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M3.953 10.512c0.003 0.009 0.088 0.238 0.134 0.353 0.263 0.622 0.641 1.184 1.122 1.666s1.041 0.859 1.666 1.122c0.647 0.272 1.331 0.412 2.037 0.412s1.394-0.137 2.037-0.412c0.625-0.262 1.184-0.641 1.666-1.122s0.859-1.041 1.122-1.666c0.272-0.647 0.412-1.331 0.412-2.037s-0.137-1.394-0.412-2.037c-0.262-0.625-0.641-1.184-1.122-1.666s-1.041-0.859-1.666-1.122c-0.647-0.272-1.331-0.413-2.037-0.413-0.716 0-1.431 0.144-2.066 0.413-0.509 0.216-1.372 0.769-1.875 1.291l-0.003 0.003v-4.313h7.241c0.262-0.003 0.262-0.372 0.262-0.491 0-0.122 0-0.487-0.266-0.491h-7.828c-0.213 0-0.344 0.178-0.344 0.341v6.066c0 0.197 0.244 0.338 0.472 0.384 0.444 0.094 0.544-0.047 0.653-0.197l0.016-0.019c0.166-0.247 0.681-0.766 0.688-0.772 0.806-0.806 1.884-1.25 3.037-1.25 1.147 0 2.222 0.444 3.028 1.25 0.809 0.809 1.256 1.881 1.256 3.019 0 1.141-0.444 2.216-1.25 3.019-0.794 0.794-1.906 1.25-3.047 1.25-0.772 0-1.519-0.206-2.159-0.597l0.003-3.688c0-0.491 0.213-1.028 0.572-1.431 0.409-0.463 0.972-0.716 1.588-0.716 0.594 0 1.15 0.225 1.566 0.634 0.409 0.406 0.637 0.95 0.637 1.528 0 1.231-0.969 2.197-2.206 2.197-0.238 0-0.672-0.106-0.691-0.109-0.25-0.075-0.356 0.272-0.391 0.387-0.134 0.441 0.069 0.528 0.109 0.541 0.397 0.125 0.659 0.147 1.003 0.147 1.747 0 3.169-1.422 3.169-3.169 0-1.734-1.422-3.144-3.166-3.144-0.856 0-1.659 0.328-2.263 0.919-0.575 0.566-0.903 1.319-0.903 2.069v0.019c-0.003 0.094-0.003 2.306-0.006 3.031l-0.003-0.003c-0.328-0.363-0.653-0.919-0.869-1.488-0.084-0.222-0.275-0.184-0.534-0.103-0.125 0.034-0.469 0.141-0.391 0.394v0zM7.675 9.647c0 0.106 0.097 0.2 0.156 0.253l0.019 0.019c0.1 0.097 0.194 0.147 0.281 0.147 0.072 0 0.116-0.034 0.131-0.050 0.044-0.041 0.537-0.544 0.588-0.591l0.553 0.55c0.050 0.056 0.106 0.088 0.172 0.088 0.088 0 0.184-0.053 0.284-0.156 0.238-0.244 0.119-0.375 0.063-0.438l-0.559-0.559 0.584-0.588c0.128-0.137 0.016-0.284-0.097-0.397-0.162-0.162-0.322-0.206-0.422-0.112l-0.581 0.581-0.588-0.588c-0.031-0.031-0.072-0.047-0.113-0.047-0.078 0-0.172 0.053-0.275 0.156-0.181 0.181-0.219 0.306-0.125 0.406l0.588 0.584-0.584 0.584c-0.053 0.050-0.078 0.103-0.075 0.156zM8.953 1.716c-0.938 0-1.938 0.191-2.669 0.506-0.078 0.031-0.125 0.094-0.134 0.181-0.009 0.084 0.013 0.194 0.069 0.337 0.047 0.116 0.166 0.425 0.4 0.334 0.75-0.288 1.581-0.444 2.334-0.444 0.856 0 1.688 0.169 2.469 0.497 0.622 0.263 1.206 0.644 1.844 1.194 0.047 0.041 0.097 0.059 0.147 0.059 0.125 0 0.244-0.122 0.347-0.237 0.169-0.191 0.287-0.35 0.119-0.509-0.609-0.575-1.275-1.006-2.1-1.356-0.894-0.372-1.847-0.563-2.825-0.563zM14.006 13.3v0c-0.113-0.113-0.209-0.178-0.294-0.203s-0.162-0.006-0.222 0.053l-0.056 0.056c-0.581 0.581-1.259 1.037-2.012 1.356-0.781 0.331-1.609 0.497-2.463 0.497-0.856 0-1.684-0.169-2.463-0.497-0.753-0.319-1.431-0.775-2.013-1.356-0.606-0.606-1.063-1.284-1.356-2.012-0.288-0.713-0.381-1.247-0.413-1.422-0.003-0.016-0.006-0.028-0.006-0.037-0.041-0.206-0.231-0.222-0.503-0.178-0.112 0.019-0.459 0.072-0.428 0.319v0.006c0.091 0.578 0.253 1.144 0.481 1.681 0.366 0.866 0.891 1.644 1.559 2.313s1.447 1.191 2.313 1.559c0.897 0.378 1.85 0.572 2.831 0.572s1.934-0.194 2.831-0.572c0.866-0.366 1.644-0.891 2.313-1.559 0 0 0.037-0.037 0.059-0.059 0.069-0.084 0.134-0.225-0.159-0.516z"}}]})(props);
};
function ImSteam (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11 4.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5zM14.975 2.025c-1.367-1.367-3.583-1.367-4.95 0-0.556 0.556-0.886 1.252-0.989 1.975v0l-3.198 4.847c-0.43 0.022-0.856 0.132-1.249 0.328l-2.467-1.928c-0.571-0.446-1.396-0.345-1.842 0.226s-0.345 1.396 0.226 1.842l2.436 1.905c-0.265 1.043 0.010 2.196 0.827 3.012 1.233 1.233 3.232 1.233 4.465 0 0.757-0.757 1.049-1.804 0.876-2.784l3.891-3.484c0.723-0.104 1.419-0.434 1.975-0.989 1.367-1.367 1.367-3.583 0-4.95zM6 14.105c-1.162 0-2.105-0.942-2.105-2.105 0-0.011 0.001-0.022 0.001-0.033l1.046 0.817c0.24 0.188 0.525 0.278 0.807 0.278 0.39 0 0.776-0.173 1.035-0.504 0.446-0.571 0.345-1.396-0.226-1.842l-0.992-0.776c0.14-0.029 0.285-0.045 0.434-0.045 1.162 0 2.105 0.942 2.105 2.105s-0.942 2.105-2.105 2.105zM12.5 7c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z"}}]})(props);
};
function ImSteam2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4.749 13.063c0.424 0 0.84-0.205 1.093-0.585 0.402-0.603 0.239-1.418-0.364-1.82l-1.032-0.688c0.177-0.048 0.362-0.074 0.554-0.074 1.162 0 2.105 0.942 2.105 2.105s-0.942 2.105-2.105 2.105c-1.131 0-2.054-0.893-2.102-2.012l1.124 0.749c0.224 0.149 0.477 0.221 0.727 0.221zM13.333 0c1.467 0 2.667 1.2 2.667 2.667v10.666c0 1.468-1.2 2.667-2.667 2.667h-10.666c-1.467 0-2.667-1.199-2.667-2.667v-3.172l1.896 1.264c-0.182 0.987 0.108 2.044 0.872 2.808 1.233 1.233 3.232 1.233 4.465 0 0.757-0.757 1.049-1.804 0.876-2.784l3.892-3.484c0.723-0.104 1.419-0.433 1.975-0.989 1.367-1.367 1.367-3.583 0-4.95s-3.583-1.367-4.95 0c-0.556 0.556-0.886 1.252-0.989 1.975v0l-3.198 4.847c-0.498 0.025-0.99 0.168-1.433 0.428l-3.404-2.269v-4.339c0-1.467 1.2-2.667 2.667-2.667h10.666zM14 4.5c0-1.381-1.119-2.5-2.5-2.5s-2.5 1.119-2.5 2.5 1.119 2.5 2.5 2.5 2.5-1.119 2.5-2.5zM10 4.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5-0.672 1.5-1.5 1.5-1.5-0.672-1.5-1.5z"}}]})(props);
};
function ImDropbox (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.5 0.5l-3.5 3 4.5 3 3.5-3z"}},{"tag":"path","attr":{"d":"M8 3.5l-3.5-3-4.5 3 3.5 3z"}},{"tag":"path","attr":{"d":"M12.5 6.5l3.5 3-4.5 2.5-3.5-3z"}},{"tag":"path","attr":{"d":"M8 9l-4.5-2.5-3.5 3 4.5 2.5z"}},{"tag":"path","attr":{"d":"M11.377 13.212l-3.377-2.895-3.377 2.895-2.123-1.179v1.467l5.5 2.5 5.5-2.5v-1.467z"}}]})(props);
};
function ImOnedrive (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5.482 12.944c-0.942-0.235-1.466-0.984-1.468-2.095-0-0.355 0.025-0.525 0.114-0.754 0.217-0.56 0.793-0.982 1.55-1.138 0.377-0.077 0.493-0.16 0.493-0.353 0-0.060 0.045-0.24 0.1-0.399 0.249-0.724 0.71-1.327 1.202-1.573 0.515-0.258 0.776-0.316 1.399-0.313 0.886 0.005 1.327 0.197 1.945 0.846l0.34 0.357 0.304-0.105c1.473-0.51 2.942 0.358 3.061 1.809l0.032 0.397 0.29 0.104c0.829 0.297 1.218 0.92 1.148 1.837-0.046 0.599-0.326 1.078-0.77 1.315l-0.209 0.112-4.638 0.009c-3.564 0.007-4.697-0.006-4.893-0.055v0zM1.613 12.281c-0.565-0.142-1.164-0.67-1.445-1.273-0.159-0.342-0.168-0.393-0.168-0.998 0-0.576 0.014-0.668 0.14-0.954 0.267-0.603 0.78-1.038 1.422-1.21 0.136-0.036 0.263-0.094 0.283-0.128s0.043-0.221 0.050-0.415c0.045-1.206 0.794-2.269 1.839-2.61 0.565-0.184 1.306-0.202 1.92 0.058 0.195 0.082 0.173 0.1 0.585-0.471 0.244-0.338 0.705-0.695 1.108-0.909 0.435-0.231 0.887-0.337 1.428-0.336 1.512 0.004 2.815 1.003 3.297 2.529 0.154 0.487 0.146 0.624-0.035 0.628-0.079 0.002-0.306 0.048-0.505 0.102l-0.361 0.099-0.329-0.348c-0.928-0.98-2.441-1.192-3.728-0.522-0.514 0.268-0.927 0.652-1.239 1.153-0.222 0.357-0.506 1.024-0.506 1.189 0 0.117-0.090 0.176-0.474 0.309-1.189 0.412-1.883 1.364-1.882 2.582 0 0.443 0.108 0.986 0.258 1.296 0.057 0.117 0.088 0.228 0.070 0.247-0.046 0.049-1.525 0.032-1.73-0.019v0z"}}]})(props);
};
function ImGithub (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0.198c-4.418 0-8 3.582-8 8 0 3.535 2.292 6.533 5.471 7.591 0.4 0.074 0.547-0.174 0.547-0.385 0-0.191-0.008-0.821-0.011-1.489-2.226 0.484-2.695-0.944-2.695-0.944-0.364-0.925-0.888-1.171-0.888-1.171-0.726-0.497 0.055-0.486 0.055-0.486 0.803 0.056 1.226 0.824 1.226 0.824 0.714 1.223 1.872 0.869 2.328 0.665 0.072-0.517 0.279-0.87 0.508-1.070-1.777-0.202-3.645-0.888-3.645-3.954 0-0.873 0.313-1.587 0.824-2.147-0.083-0.202-0.357-1.015 0.077-2.117 0 0 0.672-0.215 2.201 0.82 0.638-0.177 1.322-0.266 2.002-0.269 0.68 0.003 1.365 0.092 2.004 0.269 1.527-1.035 2.198-0.82 2.198-0.82 0.435 1.102 0.162 1.916 0.079 2.117 0.513 0.56 0.823 1.274 0.823 2.147 0 3.073-1.872 3.749-3.653 3.947 0.287 0.248 0.543 0.735 0.543 1.481 0 1.070-0.009 1.932-0.009 2.195 0 0.213 0.144 0.462 0.55 0.384 3.177-1.059 5.466-4.057 5.466-7.59 0-4.418-3.582-8-8-8z"}}]})(props);
};
function ImNpm (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 0v16h16v-16h-16zM13 13h-2v-8h-3v8h-5v-10h10v10z"}}]})(props);
};
function ImBasecamp (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 1.666c-2.919 0-5.169 2.444-6.444 4.838-0.719 1.347-1.222 2.822-1.453 4.331-0.025 0.172-0.050 0.344-0.069 0.519-0.009 0.094-0.019 0.188-0.025 0.281-0.009 0.119-0.003 0.156 0.059 0.256 0.187 0.303 0.409 0.584 0.659 0.838 0.512 0.525 1.134 0.928 1.794 1.241 1.503 0.709 3.2 0.966 4.85 1.022 1.703 0.056 3.453-0.084 5.081-0.616 1.391-0.453 2.731-1.244 3.503-2.522 0.084-0.137 0.025-0.341 0.009-0.5-0.019-0.191-0.044-0.378-0.075-0.566-0.056-0.369-0.131-0.731-0.222-1.094-0.181-0.738-0.428-1.463-0.728-2.159-1.088-2.525-3.1-5.219-5.963-5.775-0.322-0.063-0.65-0.094-0.978-0.094zM8.1 13.909c-1.784 0-3.728-0.159-5.334-1.019-0.625-0.334-1.262-0.819-1.563-1.484-0.087-0.194-0.056-0.269-0.016-0.497 0.028-0.147 0.041-0.291 0.106-0.428 0.091-0.191 0.184-0.378 0.281-0.566 0.328-0.634 0.681-1.262 1.091-1.853 0.203-0.291 0.419-0.578 0.669-0.828 0.175-0.175 0.388-0.362 0.634-0.422 0.756-0.181 1.334 0.694 1.794 1.134 0.222 0.213 0.519 0.453 0.85 0.412 0.228-0.028 0.431-0.206 0.594-0.353 0.553-0.497 0.997-1.112 1.456-1.691 0.228-0.284 0.453-0.572 0.7-0.844 0.166-0.184 0.347-0.394 0.569-0.513 0.397-0.216 0.903 0.228 1.178 0.456 0.469 0.391 0.884 0.847 1.281 1.309 0.378 0.441 0.744 0.888 1.066 1.372 0.497 0.75 0.928 1.55 1.322 2.359 0.084 0.175 0.113 0.294 0.144 0.488 0.019 0.106 0.059 0.228 0.044 0.338-0.022 0.153-0.128 0.319-0.206 0.444-0.188 0.297-0.441 0.553-0.719 0.769-1.166 0.903-2.744 1.203-4.178 1.338-0.588 0.056-1.175 0.078-1.762 0.078z"}}]})(props);
};
function ImTrello (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM7 12c0 0.55-0.45 1-1 1h-2c-0.55 0-1-0.45-1-1v-8c0-0.55 0.45-1 1-1h2c0.55 0 1 0.45 1 1v8zM13 9c0 0.55-0.45 1-1 1h-2c-0.55 0-1-0.45-1-1v-5c0-0.55 0.45-1 1-1h2c0.55 0 1 0.45 1 1v5z"}}]})(props);
};
function ImWordpress (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M2 8c0 2.313 1.38 4.312 3.382 5.259l-2.862-7.637c-0.333 0.727-0.52 1.531-0.52 2.378zM12.050 7.705c0-0.722-0.266-1.222-0.495-1.612-0.304-0.482-0.589-0.889-0.589-1.371 0-0.537 0.418-1.037 1.008-1.037 0.027 0 0.052 0.003 0.078 0.005-1.067-0.953-2.49-1.534-4.052-1.534-2.096 0-3.94 1.048-5.013 2.634 0.141 0.004 0.274 0.007 0.386 0.007 0.627 0 1.599-0.074 1.599-0.074 0.323-0.018 0.361 0.444 0.038 0.482 0 0-0.325 0.037-0.687 0.055l2.185 6.33 1.313-3.835-0.935-2.495c-0.323-0.019-0.629-0.055-0.629-0.055-0.323-0.019-0.285-0.5 0.038-0.482 0 0 0.991 0.074 1.58 0.074 0.627 0 1.599-0.074 1.599-0.074 0.323-0.018 0.362 0.444 0.038 0.482 0 0-0.326 0.037-0.687 0.055l2.168 6.282 0.599-1.947c0.259-0.809 0.457-1.389 0.457-1.889zM8.105 8.511l-1.8 5.095c0.538 0.154 1.106 0.238 1.695 0.238 0.699 0 1.369-0.117 1.992-0.331-0.016-0.025-0.031-0.052-0.043-0.081l-1.844-4.921zM13.265 5.196c0.026 0.186 0.040 0.386 0.040 0.601 0 0.593-0.114 1.259-0.456 2.093l-1.833 5.16c1.784-1.013 2.983-2.895 2.983-5.051 0-1.016-0.267-1.971-0.735-2.803zM8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 15c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z"}}]})(props);
};
function ImJoomla (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4.156 4.323c0.513-0.513 1.344-0.513 1.856-0l0.122 0.123 1.58-1.581-0.123-0.123c-0.9-0.902-2.164-1.217-3.319-0.946-0.166-1.018-1.048-1.796-2.112-1.796-1.182 0-2.14 0.96-2.14 2.143 0 1.021 0.712 1.875 1.667 2.091-0.362 1.21-0.066 2.576 0.888 3.531l3.56 3.561 1.578-1.581-3.56-3.561c-0.511-0.511-0.512-1.346 0.003-1.861zM15.98 2.143c0-1.184-0.958-2.143-2.14-2.143-1.082 0-1.976 0.804-2.12 1.847-1.204-0.354-2.559-0.055-3.51 0.897l-3.56 3.561 1.58 1.581 3.559-3.56c0.515-0.515 1.344-0.514 1.854-0.003 0.512 0.513 0.512 1.346-0.001 1.859l-0.122 0.122 1.578 1.582 0.123-0.124c0.945-0.946 1.245-2.293 0.9-3.494 1.049-0.138 1.858-1.037 1.858-2.125zM14.16 11.735c0.283-1.163-0.031-2.443-0.939-3.352l-3.555-3.562-1.58 1.58 3.555 3.563c0.515 0.516 0.514 1.345 0.003 1.857-0.513 0.513-1.344 0.513-1.857-0l-0.121-0.122-1.578 1.582 0.121 0.121c0.961 0.962 2.338 1.257 3.553 0.883 0.197 0.979 1.061 1.716 2.098 1.716 1.181 0 2.14-0.959 2.14-2.143 0-1.081-0.8-1.976-1.84-2.122zM9.568 8.261l-3.555 3.562c-0.511 0.512-1.344 0.513-1.859-0.002-0.513-0.514-0.513-1.345-0.001-1.859l0.122-0.121-1.579-1.58-0.121 0.12c-0.918 0.919-1.228 2.216-0.929 3.39-0.944 0.223-1.646 1.072-1.646 2.086-0 1.184 0.958 2.143 2.14 2.143 1.017-0.001 1.869-0.71 2.087-1.662 1.167 0.29 2.453-0.020 3.365-0.934l3.555-3.562-1.578-1.582z"}}]})(props);
};
function ImEllo (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM12.885 9.212c-0.575 2.23-2.584 3.788-4.885 3.788s-4.31-1.558-4.885-3.788c-0.097-0.377 0.131-0.764 0.508-0.861 0.058-0.015 0.118-0.023 0.177-0.023 0.322 0 0.604 0.218 0.684 0.531 0.414 1.605 1.86 2.727 3.516 2.727s3.102-1.121 3.516-2.727c0.081-0.313 0.362-0.531 0.684-0.531 0.060 0 0.12 0.008 0.178 0.023 0.183 0.047 0.336 0.163 0.432 0.326s0.123 0.353 0.075 0.536z"}}]})(props);
};
function ImBlogger (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.966 6h-0.897c-0.549 0-1.031-0.465-1.069-1v0c0-2.854-2.301-5-5.175-5h-2.622c-2.872 0-5.201 2.313-5.203 5.167v5.669c0 2.854 2.331 5.165 5.203 5.165h5.6c2.874 0 5.197-2.311 5.197-5.165v-3.662c0-0.57-0.46-1.173-1.034-1.173zM5 4h3c0.55 0 1 0.45 1 1s-0.45 1-1 1h-3c-0.55 0-1-0.45-1-1s0.45-1 1-1zM11 12h-6c-0.55 0-1-0.45-1-1s0.45-1 1-1h6c0.55 0 1 0.45 1 1s-0.45 1-1 1z"}}]})(props);
};
function ImBlogger2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM14 10.125c0 2.141-1.741 3.875-3.897 3.875h-4.2c-2.156 0-3.903-1.734-3.903-3.875v-4.25c0-2.141 1.747-3.875 3.903-3.875h1.966c2.156 0 3.881 1.609 3.881 3.75 0.028 0.4 0.391 0.75 0.8 0.75h0.672c0.431 0 0.775 0.453 0.775 0.881v2.744z"}},{"tag":"path","attr":{"d":"M11 10c0 0.55-0.45 1-1 1h-4c-0.55 0-1-0.45-1-1v0c0-0.55 0.45-1 1-1h4c0.55 0 1 0.45 1 1v0z"}},{"tag":"path","attr":{"d":"M9 6c0 0.55-0.45 1-1 1h-2c-0.55 0-1-0.45-1-1v0c0-0.55 0.45-1 1-1h2c0.55 0 1 0.45 1 1v0z"}}]})(props);
};
function ImTumblr (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9.001 7l-0 3.659c0 0.928-0.012 1.463 0.086 1.727 0.098 0.262 0.342 0.534 0.609 0.691 0.354 0.212 0.758 0.318 1.214 0.318 0.81 0 1.289-0.107 2.090-0.633v2.405c-0.683 0.321-1.279 0.509-1.833 0.639-0.555 0.129-1.154 0.194-1.798 0.194-0.732 0-1.163-0.092-1.725-0.276-0.562-0.185-1.042-0.45-1.438-0.79-0.398-0.343-0.672-0.706-0.826-1.091s-0.23-0.944-0.23-1.676v-5.611h-2.147v-2.266c0.628-0.204 1.331-0.497 1.778-0.877 0.449-0.382 0.809-0.839 1.080-1.374 0.272-0.534 0.459-1.214 0.561-2.039h2.579l-0 4h3.999v3h-3.999z"}}]})(props);
};
function ImTumblr2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM11.434 12.884c-0.472 0.222-0.9 0.378-1.281 0.469-0.381 0.088-0.797 0.134-1.241 0.134-0.506 0-0.803-0.063-1.191-0.191s-0.719-0.309-0.994-0.544c-0.275-0.238-0.463-0.488-0.569-0.753s-0.159-0.65-0.159-1.156v-3.872h-1.5v-1.563c0.434-0.141 0.938-0.344 1.244-0.606 0.309-0.263 0.559-0.578 0.744-0.947 0.188-0.369 0.316-0.837 0.388-1.406h1.569v2.55h2.556v1.972h-2.553v2.831c0 0.641-0.009 1.009 0.059 1.191s0.238 0.369 0.422 0.475c0.244 0.147 0.525 0.219 0.838 0.219 0.559 0 1.116-0.181 1.669-0.544v1.741z"}}]})(props);
};
function ImYahoo (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8.878 9.203v0c1.759-3.088 4.666-8.125 5.463-9.203-0.35 0.234-0.887 0.353-1.381 0.466l-0.747-0.466c-0.6 1.119-2.813 4.734-4.222 7.050-1.428-2.366-3.119-5.097-4.222-7.050-0.875 0.188-1.237 0.197-2.109 0v0 0c0 0 0 0 0 0v0c1.731 2.606 4.503 7.572 5.447 9.203v0l-0.128 6.797 1.013-0.466v-0.012l1.012 0.478-0.125-6.797z"}}]})(props);
};
function ImYahoo2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8.019 1.087c-2.828 0-5.5-0.372-8.019-1.087 0 5.653 0 14.581 0 16 2.522-0.716 5.194-1.088 8.019-1.088 2.794 0 5.459 0.363 7.981 1.088 0-5.444 0-10.153 0-16-2.522 0.725-5.184 1.087-7.981 1.087zM12.45 2.453l-0.097 0.153c-0.091 0.144-0.172 0.266-0.284 0.438-0.15 0.225-0.431 0.672-0.769 1.247-0.094 0.159-0.209 0.35-0.328 0.556-0.228 0.384-0.484 0.819-0.688 1.162-0.084 0.147-0.169 0.297-0.256 0.447-0.225 0.391-0.456 0.794-0.678 1.181-0.228 0.403-0.453 0.8-0.678 1.194v0.397c0 0.55 0.012 1.15 0.031 1.684 0.009 0.244 0.019 0.678 0.031 1.137 0.012 0.547 0.025 1.113 0.041 1.4l0.003 0.088v0.009l-0.094-0.025c-0.037-0.009-0.072-0.019-0.109-0.028-0.113-0.025-0.234-0.044-0.353-0.056-0.072-0.006-0.147-0.009-0.222-0.009 0 0 0 0 0 0s0 0 0 0c-0.075 0-0.15 0.003-0.222 0.009-0.119 0.012-0.241 0.031-0.353 0.056-0.037 0.009-0.075 0.019-0.109 0.028l-0.094 0.025v-0.009l0.003-0.088c0.013-0.284 0.028-0.853 0.041-1.4 0.009-0.459 0.022-0.894 0.031-1.137 0.022-0.537 0.031-1.134 0.031-1.684v-0.397c-0.225-0.397-0.45-0.791-0.678-1.194-0.222-0.391-0.453-0.791-0.675-1.181-0.088-0.15-0.172-0.3-0.256-0.447-0.2-0.347-0.459-0.781-0.688-1.162-0.122-0.203-0.237-0.397-0.328-0.556-0.338-0.575-0.619-1.019-0.769-1.247-0.112-0.172-0.194-0.294-0.284-0.438l-0.097-0.153 0.175 0.050c0.222 0.063 0.45 0.094 0.694 0.094s0.478-0.031 0.697-0.094l0.053-0.016 0.028 0.047c0.431 0.778 1.591 2.684 2.284 3.825 0.237 0.394 0.428 0.703 0.522 0.862 0 0 0 0 0-0.003 0 0 0 0 0 0.003 0.094-0.156 0.284-0.469 0.522-0.862 0.694-1.138 1.853-3.044 2.284-3.825l0.028-0.047 0.053 0.016c0.219 0.063 0.453 0.094 0.697 0.094s0.472-0.031 0.694-0.094l0.166-0.050z"}}]})(props);
};
function ImTux (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8.87 11.514c-1.28 0.596-2.471 0.589-3.271 0.532-0.954-0.069-1.721-0.33-2.058-0.558-0.208-0.141-0.49-0.086-0.631 0.122s-0.086 0.49 0.122 0.631c0.542 0.367 1.501 0.64 2.503 0.712 0.17 0.012 0.356 0.020 0.557 0.020 0.872 0 1.979-0.083 3.163-0.634 0.228-0.106 0.326-0.376 0.22-0.604s-0.376-0.326-0.604-0.22zM13.921 10.841c0.044-3.948 0.449-11.409-7.109-10.806-7.463 0.601-5.484 8.484-5.595 11.124-0.099 1.397-0.562 3.104-1.217 4.841h2.017c0.207-0.736 0.36-1.464 0.425-2.159 0.122 0.085 0.252 0.167 0.391 0.245 0.226 0.133 0.42 0.31 0.626 0.497 0.48 0.438 1.025 0.934 2.089 0.996 0.071 0.004 0.143 0.006 0.214 0.006 1.077 0 1.813-0.471 2.404-0.85 0.283-0.181 0.528-0.338 0.759-0.413 0.655-0.205 1.227-0.536 1.655-0.957 0.067-0.066 0.129-0.133 0.187-0.202 0.238 0.873 0.564 1.856 0.926 2.836h4.307c-1.034-1.597-2.101-3.162-2.079-5.159zM1.939 8.693c0-0 0-0-0-0.001-0.074-1.288 0.542-2.372 1.377-2.421s1.571 0.957 1.645 2.245c0 0 0 0 0 0.001 0.004 0.069 0.006 0.138 0.006 0.206-0.264 0.066-0.503 0.163-0.717 0.275-0.001-0.010-0.001-0.019-0.002-0.029 0-0 0-0 0-0-0.071-0.731-0.462-1.284-0.873-1.234s-0.686 0.684-0.614 1.415c0 0 0 0 0 0 0.031 0.319 0.123 0.604 0.251 0.819-0.032 0.025-0.122 0.091-0.225 0.166-0.078 0.057-0.172 0.126-0.286 0.21-0.311-0.408-0.524-0.993-0.562-1.655zM10.395 11.878c-0.030 0.681-0.92 1.322-1.743 1.579l-0.005 0.002c-0.342 0.111-0.647 0.306-0.97 0.513-0.543 0.347-1.104 0.706-1.914 0.706-0.053 0-0.108-0.002-0.161-0.005-0.742-0.043-1.090-0.36-1.529-0.761-0.232-0.211-0.472-0.43-0.781-0.611l-0.007-0.004c-0.667-0.377-1.081-0.845-1.108-1.253-0.013-0.203 0.077-0.378 0.268-0.522 0.416-0.312 0.695-0.516 0.879-0.651 0.205-0.15 0.267-0.195 0.313-0.239 0.033-0.031 0.068-0.065 0.106-0.103 0.382-0.371 1.021-0.993 2.002-0.993 0.6 0 1.264 0.231 1.971 0.686 0.333 0.217 0.623 0.317 0.99 0.444 0.252 0.087 0.539 0.186 0.922 0.35l0.006 0.003c0.357 0.147 0.78 0.415 0.76 0.858zM10.198 10.278c-0.069-0.035-0.14-0.068-0.215-0.098-0.345-0.148-0.622-0.248-0.852-0.328 0.127-0.248 0.206-0.558 0.213-0.894 0-0 0-0 0-0 0.018-0.818-0.395-1.483-0.922-1.484s-0.968 0.661-0.986 1.479c0 0 0 0 0 0-0.001 0.027-0.001 0.053-0 0.080-0.324-0.149-0.643-0.258-0.956-0.324-0.001-0.031-0.003-0.061-0.004-0.092 0-0 0-0.001 0-0.001-0.030-1.491 0.884-2.725 2.043-2.756s2.122 1.152 2.153 2.642c0 0 0 0.001 0 0.001 0.014 0.674-0.167 1.295-0.475 1.776z"}}]})(props);
};
function ImAppleinc (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M12.367 8.501c-0.020-2.026 1.652-2.998 1.727-3.046-0.94-1.375-2.404-1.564-2.926-1.585-1.246-0.126-2.431 0.734-3.064 0.734-0.631 0-1.607-0.715-2.64-0.696-1.358 0.020-2.61 0.79-3.31 2.006-1.411 2.448-0.361 6.076 1.014 8.061 0.672 0.972 1.473 2.064 2.525 2.025 1.013-0.040 1.396-0.656 2.621-0.656s1.569 0.656 2.641 0.635c1.090-0.020 1.781-0.991 2.448-1.966 0.772-1.128 1.089-2.219 1.108-2.275-0.024-0.011-2.126-0.816-2.147-3.236zM10.353 2.555c0.558-0.677 0.935-1.617 0.832-2.555-0.804 0.033-1.779 0.536-2.356 1.212-0.518 0.6-0.971 1.557-0.85 2.476 0.898 0.070 1.815-0.456 2.373-1.132z"}}]})(props);
};
function ImFinder (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8.894 12.16c-0-0.001-0-0.001-0-0.002 0 0.001 0 0.001 0 0.002z"}},{"tag":"path","attr":{"d":"M8.916 12.727c-0-0.004-0-0.007-0.001-0.011 0 0.004 0 0.007 0.001 0.011z"}},{"tag":"path","attr":{"d":"M8.903 12.442c-0-0.003-0-0.006-0-0.008 0 0.003 0 0.006 0 0.008z"}},{"tag":"path","attr":{"d":"M15 0h-14c-0.55 0-1 0.45-1 1v14c0 0.55 0.45 1 1 1h7.716c0.001 0 0.001 0 0.002 0s0.001-0 0.002-0h6.28c0.55 0 1-0.45 1-1v-14c0-0.55-0.45-1-1-1zM3 3.5c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v1c0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5v-1zM15 15h-5.86c-0.105-0.658-0.17-1.336-0.209-1.994 0 0.002 0 0.004 0 0.005-0.308 0.034-0.618 0.051-0.931 0.051-2.088 0-4.1-0.76-5.664-2.141-0.233-0.206-0.255-0.561-0.050-0.794s0.561-0.255 0.794-0.050c1.358 1.199 3.105 1.859 4.919 1.859 0.298 0 0.595-0.018 0.888-0.053-0.034-1.847 0.107-3.311 0.11-3.334 0.014-0.141-0.032-0.28-0.127-0.385s-0.229-0.164-0.371-0.164h-1.487c0.022-0.541 0.079-1.466 0.234-2.503 0.295-1.981 0.812-3.528 1.502-4.497h6.251v14z"}},{"tag":"path","attr":{"d":"M12.5 5c-0.276 0-0.5-0.224-0.5-0.5v-1c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v1c0 0.276-0.224 0.5-0.5 0.5z"}},{"tag":"path","attr":{"d":"M8.445 13.050c-0.057 0.003-0.114 0.005-0.171 0.007 0.057-0.002 0.114-0.004 0.171-0.007z"}},{"tag":"path","attr":{"d":"M8 13.063c0.073 0 0.146-0.001 0.22-0.003-0.073 0.002-0.146 0.003-0.22 0.003z"}},{"tag":"path","attr":{"d":"M8.423 11.925c0.012-0.001 0.024-0.001 0.037-0.002-0.012 0.001-0.024 0.001-0.037 0.002z"}},{"tag":"path","attr":{"d":"M8.204 11.934c0.017-0 0.034-0.001 0.050-0.002-0.017 0.001-0.034 0.001-0.050 0.002z"}},{"tag":"path","attr":{"d":"M13.713 10.128c-0.206-0.233-0.561-0.255-0.794-0.050-1.135 1.002-2.542 1.627-4.032 1.806 0.007 0.364 0.020 0.742 0.043 1.127 1.749-0.191 3.403-0.916 4.733-2.090 0.233-0.206 0.255-0.561 0.050-0.794z"}},{"tag":"path","attr":{"d":"M8.93 13.012c-0.072 0.008-0.144 0.015-0.216 0.021 0.072-0.006 0.144-0.013 0.216-0.021z"}},{"tag":"path","attr":{"d":"M8.68 13.035c-0.061 0.005-0.122 0.009-0.183 0.013 0.061-0.004 0.122-0.008 0.183-0.013z"}}]})(props);
};
function ImAndroid (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14 6c-0.55 0-1 0.45-1 1v4c0 0.55 0.45 1 1 1s1-0.45 1-1v-4c0-0.55-0.45-1-1-1zM2 6c-0.55 0-1 0.45-1 1v4c0 0.55 0.45 1 1 1s1-0.45 1-1v-4c0-0.55-0.45-1-1-1zM3.5 11.5c0 0.828 0.672 1.5 1.5 1.5v0 2c0 0.55 0.45 1 1 1s1-0.45 1-1v-2h2v2c0 0.55 0.45 1 1 1s1-0.45 1-1v-2c0.828 0 1.5-0.672 1.5-1.5v-5.5h-9v5.5z"}},{"tag":"path","attr":{"d":"M12.472 5c-0.152-1.373-0.922-2.559-2.025-3.276l0.5-1.001c0.123-0.247 0.023-0.547-0.224-0.671s-0.547-0.023-0.671 0.224l-0.502 1.004-0.13-0.052c-0.446-0.148-0.924-0.229-1.42-0.229s-0.974 0.081-1.42 0.229l-0.13 0.052-0.502-1.004c-0.123-0.247-0.424-0.347-0.671-0.224s-0.347 0.424-0.224 0.671l0.5 1.001c-1.103 0.716-1.873 1.903-2.025 3.276v0.5h8.972v-0.5h-0.028zM6.5 4c-0.276 0-0.5-0.224-0.5-0.5s0.223-0.499 0.499-0.5c0 0 0.001 0 0.001 0s0.001-0 0.001-0c0.276 0.001 0.499 0.224 0.499 0.5s-0.224 0.5-0.5 0.5zM9.5 4c-0.276 0-0.5-0.224-0.5-0.5s0.223-0.499 0.499-0.5c0 0 0.001 0 0.001 0s0.001-0 0.002-0c0.276 0.001 0.499 0.224 0.499 0.5s-0.224 0.5-0.5 0.5z"}}]})(props);
};
function ImWindows (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.441 7.999c-0.745-0.383-1.47-0.577-2.154-0.577-0.093 0-0.187 0.003-0.28 0.011-0.873 0.072-1.671 0.303-2.184 0.482-0.136 0.050-0.276 0.103-0.419 0.161l-1.403 4.866c0.964-0.357 1.817-0.53 2.598-0.53 1.263 0 2.18 0.472 2.937 0.958 0.359-1.217 1.219-4.158 1.476-5.036-0.187-0.114-0.376-0.228-0.571-0.333zM8.255 9.235l-1.413 4.909c0.419 0.24 1.83 1.001 2.91 1.001 0.872 0 1.848-0.223 2.982-0.684l1.349-4.718c-0.916 0.296-1.795 0.446-2.617 0.446-1.499 0-2.549-0.486-3.211-0.952zM4.575 5.762c1.205 0.012 2.096 0.472 2.835 0.945l1.449-4.958c-0.305-0.175-1.106-0.611-1.685-0.759-0.381-0.089-0.782-0.135-1.206-0.135-0.809 0.015-1.694 0.218-2.701 0.622l-1.382 4.853c1.013-0.382 1.885-0.568 2.689-0.568 0.001 0 0.002 0 0.002 0zM16 3.096c-0.919 0.357-1.816 0.539-2.672 0.539-1.433 0-2.489-0.497-3.173-0.974l-1.437 4.972c0.965 0.62 2.005 0.936 3.096 0.936 0.89 0 1.812-0.214 2.742-0.636l-0.003-0.035 0.058-0.014 1.39-4.788z"}}]})(props);
};
function ImWindows8 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0.005 8l-0.005-4.876 6-0.815v5.691zM7 2.164l7.998-1.164v7h-7.998zM15 9l-0.002 7-7.998-1.125v-5.875zM6 14.747l-5.995-0.822-0-4.926h5.995z"}}]})(props);
};
function ImSoundcloud (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.937 8.034c-0.283 0-0.552 0.055-0.798 0.154-0.164-1.787-1.723-3.188-3.625-3.188-0.465 0-0.917 0.088-1.317 0.237-0.156 0.058-0.197 0.117-0.197 0.233v6.292c0 0.121 0.098 0.222 0.221 0.234 0.005 0.001 5.68 0.003 5.717 0.003 1.139 0 2.062-0.888 2.062-1.983s-0.924-1.983-2.063-1.983zM6.25 12h0.5l0.25-3.503-0.25-3.497h-0.5l-0.25 3.497zM4.75 12h-0.5l-0.25-2.543 0.25-2.457h0.5l0.25 2.5zM2.25 12h0.5l0.25-2-0.25-2h-0.5l-0.25 2zM0.25 11h0.5l0.25-1-0.25-1h-0.5l-0.25 1z"}}]})(props);
};
function ImSoundcloud2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM2.75 11h-0.5l-0.25-1.5 0.25-1.5h0.5l0.25 1.5-0.25 1.5zM4.75 11h-0.5l-0.25-2 0.25-2h0.5l0.25 2-0.25 2zM6.75 11h-0.5l-0.25-3 0.25-3h0.5l0.25 3-0.25 3zM12.894 11c-0.031 0-4.706-0.003-4.709-0.003-0.1-0.009-0.181-0.097-0.184-0.2v-5.394c0-0.1 0.034-0.15 0.162-0.2 0.331-0.128 0.703-0.203 1.088-0.203 1.566 0 2.85 1.2 2.987 2.734 0.203-0.084 0.425-0.131 0.656-0.131 0.938 0 1.7 0.762 1.7 1.7s-0.762 1.697-1.7 1.697z"}}]})(props);
};
function ImSkype (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6.65 0.584c-0.025-0.016-0.053-0.028-0.078-0.041-0.028 0.006-0.053 0.009-0.081 0.016l0.159 0.025z"}},{"tag":"path","attr":{"d":"M0.575 6.578c-0.006 0.028-0.009 0.056-0.012 0.081 0.016 0.025 0.025 0.050 0.041 0.075l-0.028-0.156z"}},{"tag":"path","attr":{"d":"M15.419 9.416c0.006-0.028 0.009-0.056 0.016-0.084-0.016-0.025-0.025-0.050-0.041-0.075l0.025 0.159z"}},{"tag":"path","attr":{"d":"M9.25 15.359c0.025 0.016 0.053 0.028 0.078 0.041 0.028-0.006 0.056-0.009 0.084-0.012l-0.162-0.028z"}},{"tag":"path","attr":{"d":"M15.434 9.331c-0.006 0.028-0.009 0.056-0.016 0.084l-0.028-0.162c0.016 0.028 0.028 0.053 0.044 0.078 0.081-0.45 0.125-0.909 0.125-1.369 0-1.019-0.2-2.009-0.594-2.941-0.381-0.9-0.925-1.709-1.619-2.403s-1.503-1.238-2.4-1.619c-0.931-0.394-1.922-0.594-2.941-0.594-0.481 0-0.963 0.044-1.431 0.134 0 0-0.003 0-0.003 0 0.025 0.012 0.053 0.025 0.078 0.041l-0.159-0.025c0.028-0.006 0.053-0.009 0.081-0.016-0.644-0.341-1.366-0.525-2.097-0.525-1.194 0-2.319 0.466-3.163 1.309s-1.309 1.969-1.309 3.163c0 0.759 0.197 1.509 0.563 2.169 0.006-0.028 0.009-0.056 0.012-0.081l0.028 0.159c-0.016-0.025-0.028-0.050-0.041-0.075-0.075 0.428-0.112 0.866-0.112 1.303 0 1.019 0.2 2.009 0.594 2.941 0.381 0.9 0.925 1.706 1.619 2.4s1.503 1.238 2.403 1.619c0.931 0.394 1.922 0.594 2.941 0.594 0.444 0 0.887-0.041 1.322-0.119-0.025-0.016-0.050-0.028-0.078-0.041l0.162 0.028c-0.028 0.006-0.056 0.009-0.084 0.012 0.669 0.378 1.428 0.581 2.2 0.581 1.194 0 2.319-0.466 3.162-1.309s1.309-1.969 1.309-3.162c-0.003-0.759-0.2-1.509-0.569-2.175zM8.034 12.591c-2.684 0-3.884-1.319-3.884-2.309 0-0.506 0.375-0.863 0.891-0.863 1.15 0 0.85 1.65 2.994 1.65 1.097 0 1.703-0.597 1.703-1.206 0-0.366-0.181-0.772-0.903-0.95l-2.388-0.597c-1.922-0.481-2.272-1.522-2.272-2.5 0-2.028 1.909-2.791 3.703-2.791 1.653 0 3.6 0.913 3.6 2.131 0 0.522-0.453 0.825-0.969 0.825-0.981 0-0.8-1.356-2.775-1.356-0.981 0-1.522 0.444-1.522 1.078s0.775 0.838 1.447 0.991l1.769 0.394c1.934 0.431 2.425 1.563 2.425 2.625 0 1.647-1.266 2.878-3.819 2.878z"}}]})(props);
};
function ImReddit (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4 10c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM10 10c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1zM10.049 12.137c0.258-0.203 0.631-0.159 0.834 0.099s0.159 0.631-0.099 0.834c-0.717 0.565-1.81 0.93-2.783 0.93s-2.066-0.365-2.784-0.93c-0.258-0.203-0.302-0.576-0.099-0.834s0.576-0.302 0.834-0.099c0.413 0.325 1.23 0.675 2.049 0.675s1.636-0.35 2.049-0.675zM16 8c0-1.105-0.895-2-2-2-0.752 0-1.406 0.415-1.748 1.028-1.028-0.562-2.28-0.926-3.645-1.010l1.193-2.68 2.284 0.659c0.206 0.583 0.761 1.002 1.415 1.002 0.828 0 1.5-0.672 1.5-1.5s-0.672-1.5-1.5-1.5c-0.571 0-1.068 0.319-1.321 0.789l-2.545-0.735c-0.285-0.082-0.587 0.058-0.707 0.329l-1.621 3.641c-1.33 0.094-2.551 0.453-3.557 1.004-0.342-0.613-0.996-1.028-1.748-1.028-1.105 0-2 0.895-2 2 0 0.817 0.491 1.52 1.193 1.83-0.126 0.375-0.193 0.767-0.193 1.17 0 2.761 3.134 5 7 5s7-2.239 7-5c0-0.403-0.067-0.795-0.193-1.17 0.703-0.31 1.193-1.013 1.193-1.83zM13.5 2.938c0.311 0 0.563 0.252 0.563 0.563s-0.252 0.563-0.563 0.563-0.563-0.252-0.563-0.563 0.252-0.563 0.563-0.563zM1 8c0-0.551 0.449-1 1-1 0.399 0 0.743 0.234 0.904 0.573-0.523 0.396-0.956 0.854-1.276 1.355-0.368-0.148-0.628-0.508-0.628-0.928zM8 14.813c-3.21 0-5.813-1.707-5.813-3.813s2.602-3.813 5.813-3.813c3.21 0 5.813 1.707 5.813 3.813s-2.602 3.813-5.813 3.813zM14.372 8.928c-0.32-0.502-0.753-0.959-1.276-1.355 0.161-0.338 0.505-0.573 0.904-0.573 0.551 0 1 0.449 1 1 0 0.42-0.26 0.78-0.628 0.928z"}}]})(props);
};
function ImHackernews (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 0v16h16v-16h-16zM8.5 9.125v3.375h-1v-3.375l-2.734-5.125h1.134l2.1 3.938 2.1-3.938h1.134l-2.734 5.125z"}}]})(props);
};
function ImWikipedia (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.106 3.65c0 0.050-0.016 0.097-0.047 0.141-0.031 0.041-0.066 0.063-0.106 0.063-0.313 0.031-0.569 0.131-0.766 0.3-0.2 0.169-0.403 0.497-0.613 0.975l-3.225 7.272c-0.022 0.069-0.081 0.1-0.178 0.1-0.075 0-0.134-0.034-0.178-0.1l-1.809-3.781-2.081 3.781c-0.044 0.069-0.1 0.1-0.178 0.1-0.094 0-0.153-0.034-0.184-0.1l-3.166-7.269c-0.197-0.45-0.406-0.766-0.625-0.944s-0.525-0.291-0.916-0.331c-0.034 0-0.066-0.019-0.094-0.053-0.031-0.034-0.044-0.075-0.044-0.122 0-0.119 0.034-0.178 0.1-0.178 0.281 0 0.578 0.013 0.888 0.038 0.288 0.025 0.556 0.038 0.809 0.038 0.256 0 0.563-0.013 0.913-0.038 0.366-0.025 0.691-0.038 0.975-0.038 0.069 0 0.1 0.059 0.1 0.178s-0.022 0.175-0.063 0.175c-0.281 0.022-0.506 0.094-0.669 0.216s-0.244 0.281-0.244 0.481c0 0.1 0.034 0.228 0.1 0.378l2.616 5.912 1.487-2.806-1.384-2.903c-0.25-0.519-0.453-0.853-0.612-1.003s-0.403-0.241-0.728-0.275c-0.031 0-0.056-0.019-0.084-0.053s-0.041-0.075-0.041-0.122c0-0.119 0.028-0.178 0.088-0.178 0.281 0 0.541 0.013 0.778 0.038 0.228 0.025 0.469 0.038 0.728 0.038 0.253 0 0.519-0.013 0.803-0.038 0.291-0.025 0.578-0.038 0.859-0.038 0.069 0 0.1 0.059 0.1 0.178s-0.019 0.175-0.063 0.175c-0.566 0.038-0.847 0.2-0.847 0.481 0 0.125 0.066 0.322 0.197 0.588l0.916 1.859 0.912-1.7c0.125-0.241 0.191-0.444 0.191-0.606 0-0.388-0.281-0.594-0.847-0.619-0.050 0-0.075-0.059-0.075-0.175 0-0.044 0.012-0.081 0.037-0.119s0.050-0.056 0.075-0.056c0.203 0 0.45 0.013 0.747 0.038 0.281 0.025 0.516 0.038 0.697 0.038 0.131 0 0.322-0.013 0.575-0.031 0.319-0.028 0.588-0.044 0.803-0.044 0.050 0 0.075 0.050 0.075 0.15 0 0.134-0.047 0.203-0.137 0.203-0.328 0.034-0.594 0.125-0.794 0.272s-0.45 0.481-0.75 1.006l-1.222 2.237 1.644 3.35 2.428-5.647c0.084-0.206 0.125-0.397 0.125-0.569 0-0.412-0.281-0.631-0.847-0.659-0.050 0-0.075-0.059-0.075-0.175 0-0.119 0.037-0.178 0.113-0.178 0.206 0 0.45 0.013 0.734 0.038 0.262 0.025 0.481 0.038 0.656 0.038 0.188 0 0.4-0.013 0.644-0.038 0.253-0.025 0.481-0.038 0.684-0.038 0.063 0 0.094 0.050 0.094 0.15z"}}]})(props);
};
function ImLinkedin (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM6 13h-2v-7h2v7zM5 5c-0.553 0-1-0.447-1-1s0.447-1 1-1c0.553 0 1 0.447 1 1s-0.447 1-1 1zM13 13h-2v-4c0-0.553-0.447-1-1-1s-1 0.447-1 1v4h-2v-7h2v1.241c0.412-0.566 1.044-1.241 1.75-1.241 1.244 0 2.25 1.119 2.25 2.5v4.5z"}}]})(props);
};
function ImLinkedin2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M6 6h2.767v1.418h0.040c0.385-0.691 1.327-1.418 2.732-1.418 2.921 0 3.461 1.818 3.461 4.183v4.817h-2.885v-4.27c0-1.018-0.021-2.329-1.5-2.329-1.502 0-1.732 1.109-1.732 2.255v4.344h-2.883v-9z"}},{"tag":"path","attr":{"d":"M1 6h3v9h-3v-9z"}},{"tag":"path","attr":{"d":"M4 3.5c0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5c0-0.828 0.672-1.5 1.5-1.5s1.5 0.672 1.5 1.5z"}}]})(props);
};
function ImLastfm (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M7.056 11.972l-0.588-1.594c0 0-0.953 1.063-2.381 1.063-1.266 0-2.163-1.1-2.163-2.859 0-2.253 1.137-3.059 2.253-3.059 1.612 0 2.125 1.044 2.566 2.381l0.588 1.831c0.588 1.778 1.688 3.206 4.856 3.206 2.272 0 3.813-0.697 3.813-2.528 0-1.484-0.844-2.253-2.419-2.622l-1.172-0.256c-0.806-0.184-1.044-0.513-1.044-1.063 0-0.622 0.494-0.991 1.3-0.991 0.881 0 1.356 0.331 1.428 1.119l1.831-0.219c-0.147-1.65-1.284-2.328-3.153-2.328-1.65 0-3.262 0.622-3.262 2.622 0 1.247 0.606 2.034 2.125 2.4l1.247 0.294c0.934 0.219 1.247 0.606 1.247 1.137 0 0.678-0.659 0.953-1.906 0.953-1.85 0-2.622-0.972-3.059-2.309l-0.606-1.831c-0.766-2.384-1.994-3.263-4.431-3.263-2.694 0-4.125 1.703-4.125 4.6 0 2.784 1.428 4.287 3.997 4.287 2.069 0 3.059-0.972 3.059-0.972v0z"}}]})(props);
};
function ImLastfm2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM11.666 11.887c-2.775 0-3.737-1.25-4.25-2.806l-0.513-1.603c-0.384-1.172-0.834-2.084-2.244-2.084-0.978 0-1.972 0.706-1.972 2.678 0 1.541 0.784 2.503 1.894 2.503 1.25 0 2.084-0.931 2.084-0.931l0.513 1.394c0 0-0.866 0.85-2.678 0.85-2.25 0-3.5-1.313-3.5-3.75 0-2.534 1.25-4.025 3.609-4.025 2.134 0 3.206 0.769 3.881 2.853l0.528 1.603c0.384 1.172 1.059 2.022 2.678 2.022 1.091 0 1.669-0.241 1.669-0.834 0-0.466-0.272-0.803-1.091-0.994l-1.091-0.256c-1.331-0.322-1.859-1.009-1.859-2.1 0-1.747 1.412-2.294 2.853-2.294 1.634 0 2.631 0.594 2.759 2.038l-1.603 0.194c-0.066-0.691-0.481-0.978-1.25-0.978-0.706 0-1.137 0.322-1.137 0.866 0 0.481 0.209 0.769 0.912 0.931l1.025 0.225c1.378 0.322 2.116 0.994 2.116 2.294 0 1.597-1.347 2.206-3.334 2.206z"}}]})(props);
};
function ImDelicious (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 0v16h16v-16h-16zM8 15v-7h-7v-7h7v7h7v7h-7z"}}]})(props);
};
function ImStumbleupon (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 5c-0.55 0-1 0.45-1 1v4c0 1.653-1.347 3-3 3s-3-1.347-3-3v-2h2v2c0 0.55 0.45 1 1 1s1-0.45 1-1v-4c0-1.653 1.347-3 3-3s3 1.347 3 2.781v0.969l-1.281 0.375-0.719-0.375v-0.969c0-0.331-0.45-0.781-1-0.781z"}},{"tag":"path","attr":{"d":"M15 10c0 1.653-1.347 3-3 3s-3-1.347-3-3.219v-1.938l0.719 0.375 1.281-0.375v1.938c0 0.769 0.45 1.219 1 1.219s1-0.45 1-1v-2h2v2z"}}]})(props);
};
function ImStumbleupon2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.313 0h-10.625c-1.478 0-2.688 1.209-2.688 2.688v10.625c0 1.478 1.209 2.688 2.688 2.688h10.625c1.478 0 2.688-1.209 2.688-2.688v-10.625c0-1.478-1.209-2.688-2.688-2.688zM8 5c-0.551 0-1 0.449-1 1v4c0 1.654-1.346 3-3 3s-3-1.346-3-3v-2h2v2c0 0.551 0.449 1 1 1s1-0.449 1-1v-4c0-1.654 1.346-3 3-3s3 1.346 3 2.781v0.969l-1.281 0.375-0.719-0.375v-0.969c0-0.333-0.449-0.781-1-0.781zM15 10c0 1.654-1.346 3-3 3s-3-1.346-3-3.219v-1.938l0.719 0.375 1.281-0.375v1.938c0 0.77 0.449 1.219 1 1.219s1-0.449 1-1v-2h2v2z"}}]})(props);
};
function ImStackoverflow (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 10v6h-16v-6h2v4h12v-4zM3 11h10v2h-10zM3.237 8.835l0.433-1.953 9.763 2.164-0.433 1.953zM4.37 4.821l0.845-1.813 9.063 4.226-0.845 1.813zM15.496 5.648l-1.218 1.587-7.934-6.088 0.88-1.147h0.91z"}}]})(props);
};
function ImPinterest (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 1.069c-3.828 0-6.931 3.103-6.931 6.931 0 2.938 1.828 5.444 4.406 6.453-0.059-0.547-0.116-1.391 0.025-1.988 0.125-0.541 0.813-3.444 0.813-3.444s-0.206-0.416-0.206-1.028c0-0.963 0.559-1.684 1.253-1.684 0.591 0 0.878 0.444 0.878 0.975 0 0.594-0.378 1.484-0.575 2.306-0.166 0.691 0.344 1.253 1.025 1.253 1.231 0 2.178-1.3 2.178-3.175 0-1.659-1.194-2.819-2.894-2.819-1.972 0-3.128 1.478-3.128 3.009 0 0.597 0.228 1.234 0.516 1.581 0.056 0.069 0.066 0.128 0.047 0.2-0.053 0.219-0.169 0.691-0.194 0.787-0.031 0.128-0.1 0.153-0.231 0.094-0.866-0.403-1.406-1.669-1.406-2.684 0-2.188 1.587-4.194 4.578-4.194 2.403 0 4.272 1.712 4.272 4.003 0 2.388-1.506 4.313-3.597 4.313-0.703 0-1.362-0.366-1.588-0.797 0 0-0.347 1.322-0.431 1.647-0.156 0.603-0.578 1.356-0.862 1.816 0.65 0.2 1.337 0.309 2.053 0.309 3.828 0 6.931-3.103 6.931-6.931 0-3.831-3.103-6.934-6.931-6.934z"}}]})(props);
};
function ImPinterest2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.412 0-8 3.587-8 8s3.587 8 8 8 8-3.588 8-8-3.588-8-8-8zM8 14.931c-0.716 0-1.403-0.109-2.053-0.309 0.281-0.459 0.706-1.216 0.862-1.816 0.084-0.325 0.431-1.647 0.431-1.647 0.225 0.431 0.888 0.797 1.587 0.797 2.091 0 3.597-1.922 3.597-4.313 0-2.291-1.869-4.003-4.272-4.003-2.991 0-4.578 2.009-4.578 4.194 0 1.016 0.541 2.281 1.406 2.684 0.131 0.063 0.2 0.034 0.231-0.094 0.022-0.097 0.141-0.566 0.194-0.787 0.016-0.069 0.009-0.131-0.047-0.2-0.287-0.347-0.516-0.988-0.516-1.581 0-1.528 1.156-3.009 3.128-3.009 1.703 0 2.894 1.159 2.894 2.819 0 1.875-0.947 3.175-2.178 3.175-0.681 0-1.191-0.563-1.025-1.253 0.197-0.825 0.575-1.713 0.575-2.306 0-0.531-0.284-0.975-0.878-0.975-0.697 0-1.253 0.719-1.253 1.684 0 0.612 0.206 1.028 0.206 1.028s-0.688 2.903-0.813 3.444c-0.141 0.6-0.084 1.441-0.025 1.988-2.578-1.006-4.406-3.512-4.406-6.45 0-3.828 3.103-6.931 6.931-6.931s6.931 3.103 6.931 6.931c0 3.828-3.103 6.931-6.931 6.931z"}}]})(props);
};
function ImXing (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 0h-13c-0.825 0-1.5 0.675-1.5 1.5v13c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-13c0-0.825-0.675-1.5-1.5-1.5zM4.884 10.406h-1.728c-0.103 0-0.181-0.047-0.225-0.119-0.047-0.075-0.047-0.169 0-0.266l1.838-3.244c0.003-0.003 0.003-0.006 0-0.009l-1.169-2.025c-0.047-0.097-0.056-0.191-0.009-0.266 0.044-0.072 0.131-0.109 0.237-0.109h1.731c0.266 0 0.397 0.172 0.481 0.325 0 0 1.181 2.063 1.191 2.075-0.069 0.125-1.869 3.303-1.869 3.303-0.094 0.162-0.219 0.334-0.478 0.334zM13.069 2.378l-3.831 6.775c-0.003 0.003-0.003 0.009 0 0.012l2.441 4.456c0.047 0.097 0.050 0.194 0.003 0.269-0.044 0.072-0.125 0.109-0.231 0.109h-1.728c-0.266 0-0.397-0.175-0.484-0.328 0 0-2.453-4.5-2.459-4.512 0.122-0.216 3.85-6.828 3.85-6.828 0.094-0.166 0.206-0.328 0.463-0.328h1.753c0.103 0 0.188 0.041 0.231 0.109 0.044 0.072 0.044 0.169-0.006 0.266z"}}]})(props);
};
function ImXing2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M2.431 3.159c-0.138 0-0.256 0.050-0.316 0.144-0.059 0.1-0.050 0.225 0.013 0.353l1.559 2.7c0.003 0.006 0.003 0.009 0 0.013l-2.45 4.331c-0.063 0.128-0.059 0.256 0 0.353 0.059 0.094 0.163 0.156 0.3 0.156h2.306c0.344 0 0.513-0.234 0.628-0.447 0 0 2.397-4.241 2.491-4.406-0.009-0.016-1.588-2.766-1.588-2.766-0.116-0.203-0.287-0.431-0.644-0.431h-2.3z"}},{"tag":"path","attr":{"d":"M12.125 0c-0.344 0-0.494 0.216-0.619 0.441 0 0-4.972 8.816-5.134 9.106 0.009 0.016 3.278 6.016 3.278 6.016 0.116 0.203 0.291 0.441 0.644 0.441h2.306c0.137 0 0.247-0.053 0.306-0.147 0.063-0.1 0.059-0.228-0.006-0.356l-3.25-5.947c-0.003-0.006-0.003-0.009 0-0.016l5.109-9.034c0.063-0.128 0.066-0.256 0.006-0.356-0.059-0.094-0.169-0.147-0.306-0.147h-2.334z"}}]})(props);
};
function ImFlattr (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M5.743 0c-3.802 0-5.743 2.19-5.743 6.279v0 8.579l3.725-3.729v-4.358c0-1.694 0.449-2.772 1.955-3.014v0c0.526-0.103 1.621-0.067 2.317-0.067v0 2.587c0 0.024 0.003 0.066 0.009 0.087v0c0.029 0.105 0.124 0.181 0.236 0.182v0c0.063 0 0.123-0.033 0.184-0.093v0l6.455-6.453-9.139-0.001zM12.275 4.871v4.358c0 1.694-0.449 2.772-1.955 3.014v0c-0.526 0.103-1.621 0.067-2.317 0.067v0-2.587c0-0.023-0.003-0.066-0.009-0.087v0c-0.029-0.105-0.124-0.182-0.236-0.182v0c-0.064-0-0.123 0.033-0.184 0.093v0l-6.455 6.453 9.139 0.001c3.802 0 5.743-2.19 5.743-6.279v0-8.579l-3.725 3.729z"}}]})(props);
};
function ImFoursquare (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.306 1.408c-0.188-0.256-0.488-0.408-0.806-0.408h-9.5c-0.552 0-1 0.448-1 1v12c0 0.404 0.244 0.769 0.617 0.924 0.124 0.051 0.254 0.076 0.382 0.076 0.26 0 0.516-0.102 0.707-0.293l3.707-3.707h2.586c0.437 0 0.824-0.284 0.954-0.702l2.5-8c0.095-0.304 0.040-0.634-0.149-0.891zM10.515 5h-3.515c-0.552 0-1 0.448-1 1s0.448 1 1 1h2.89l-0.625 2h-2.265c-0.265 0-0.52 0.105-0.707 0.293l-2.293 2.293v-8.586h7.14l-0.625 2z"}}]})(props);
};
function ImYelp (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9.514 10.21c-0.27 0.272-0.042 0.768-0.042 0.768l2.033 3.394c0 0 0.334 0.447 0.623 0.447 0.29 0 0.577-0.239 0.577-0.239l1.607-2.297c0 0 0.162-0.29 0.166-0.544 0.006-0.361-0.538-0.46-0.538-0.46l-3.805-1.222c-0 0-0.373-0.099-0.621 0.152zM9.321 8.5c0.195 0.33 0.732 0.234 0.732 0.234l3.796-1.109c0 0 0.517-0.21 0.591-0.491 0.072-0.281-0.085-0.619-0.085-0.619l-1.814-2.137c0 0-0.157-0.27-0.483-0.297-0.36-0.031-0.581 0.405-0.581 0.405l-2.145 3.375c0 0-0.19 0.336-0.010 0.64zM7.527 7.184c0.447-0.11 0.518-0.759 0.518-0.759l-0.030-5.404c0 0-0.067-0.667-0.367-0.847-0.47-0.285-0.609-0.136-0.744-0.116l-3.151 1.171c0 0-0.309 0.102-0.469 0.36-0.23 0.365 0.233 0.899 0.233 0.899l3.276 4.465c0 0 0.323 0.334 0.735 0.233zM6.749 9.371c0.011-0.417-0.5-0.667-0.5-0.667l-3.387-1.711c0 0-0.502-0.207-0.746-0.063-0.187 0.11-0.352 0.31-0.368 0.486l-0.221 2.716c0 0-0.033 0.471 0.089 0.685 0.173 0.304 0.741 0.092 0.741 0.092l3.955-0.874c0.154-0.103 0.423-0.113 0.438-0.664zM7.732 10.837c-0.339-0.174-0.746 0.187-0.746 0.187l-2.648 2.915c0 0-0.33 0.446-0.246 0.72 0.079 0.257 0.21 0.384 0.396 0.474l2.659 0.839c0 0 0.322 0.067 0.567-0.004 0.347-0.1 0.283-0.643 0.283-0.643l0.060-3.947c-0 0-0.014-0.38-0.324-0.541z"}}]})(props);
};
function ImPaypal (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.531 4.822c-0.747 3.316-3.053 5.066-6.688 5.066h-1.209l-0.841 5.338h-1.013l-0.053 0.344c-0.034 0.228 0.141 0.431 0.369 0.431h2.588c0.306 0 0.566-0.222 0.616-0.525l0.025-0.131 0.488-3.091 0.031-0.169c0.047-0.303 0.309-0.525 0.616-0.525h0.384c2.506 0 4.469-1.019 5.044-3.963 0.216-1.119 0.134-2.069-0.356-2.775z"}},{"tag":"path","attr":{"d":"M12.984 1.206c-0.741-0.844-2.081-1.206-3.794-1.206h-4.972c-0.35 0-0.65 0.253-0.703 0.6l-2.072 13.131c-0.041 0.259 0.159 0.494 0.422 0.494h3.072l0.772-4.891-0.025 0.153c0.053-0.347 0.35-0.6 0.7-0.6h1.459c2.866 0 5.109-1.162 5.766-4.531 0.019-0.1 0.037-0.197 0.050-0.291 0.194-1.244 0-2.094-0.675-2.859z"}}]})(props);
};
function ImChrome (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4.036 6.977l-2.29-3.966c1.466-1.835 3.722-3.012 6.254-3.012 2.929 0 5.489 1.574 6.883 3.922h-6.528c-0.117-0.010-0.236-0.016-0.356-0.016-1.904 0-3.509 1.307-3.964 3.071zM10.864 5.078h4.585c0.355 0.905 0.551 1.891 0.551 2.922 0 4.388-3.533 7.95-7.909 7.999l3.272-5.667c0.461-0.662 0.731-1.466 0.731-2.332 0-1.143-0.471-2.178-1.23-2.922zM5.094 8c0-1.603 1.304-2.906 2.906-2.906s2.906 1.304 2.906 2.906c0 1.602-1.304 2.906-2.906 2.906s-2.906-1.304-2.906-2.906zM9.097 11.944l-2.29 3.967c-3.852-0.576-6.806-3.899-6.806-7.911 0-1.425 0.373-2.763 1.026-3.922l3.266 5.657c0.654 1.392 2.070 2.359 3.707 2.359 0.38 0 0.747-0.052 1.097-0.149z"}}]})(props);
};
function ImFirefox (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.977 5.221l-0.185 1.189c0 0-0.265-2.201-0.59-3.024-0.498-1.261-0.719-1.251-0.72-1.249 0.333 0.847 0.273 1.302 0.273 1.302s-0.591-1.609-2.152-2.121c-1.729-0.567-2.665-0.412-2.773-0.383-0.016-0-0.032-0-0.047-0 0.013 0.001 0.025 0.002 0.038 0.003-0.001 0-0.001 0.001-0.001 0.001 0.007 0.009 1.911 0.333 2.249 0.797 0 0-0.809 0-1.614 0.232-0.036 0.010 2.961 0.374 3.574 3.37 0 0-0.329-0.686-0.735-0.802 0.267 0.813 0.199 2.356-0.056 3.123-0.033 0.099-0.066-0.426-0.568-0.652 0.161 1.151-0.010 2.976-0.808 3.479-0.062 0.039 0.5-1.802 0.113-1.090-2.23 3.419-4.866 1.578-6.051 0.767 0.607 0.132 1.76-0.021 2.271-0.4 0.001-0 0.001-0.001 0.002-0.001 0.554-0.379 0.882-0.656 1.177-0.59s0.491-0.23 0.262-0.493c-0.229-0.263-0.786-0.625-1.539-0.428-0.531 0.139-1.19 0.727-2.194 0.132-0.771-0.457-0.844-0.837-0.851-1.1 0.019-0.093 0.043-0.18 0.072-0.26 0.089-0.248 0.358-0.323 0.508-0.382 0.254 0.044 0.473 0.123 0.703 0.241 0.003-0.076 0.004-0.178-0-0.293 0.022-0.044 0.008-0.176-0.027-0.337-0.020-0.161-0.053-0.328-0.106-0.48 0-0 0-0 0-0s0.002-0.001 0.002-0.001c0.001-0.001 0.002-0.002 0.003-0.003s0-0.001 0.001-0.001c0.001-0.002 0.002-0.004 0.003-0.007 0.016-0.072 0.188-0.211 0.402-0.361 0.192-0.134 0.417-0.277 0.595-0.387 0.157-0.098 0.277-0.17 0.302-0.189 0.010-0.007 0.021-0.016 0.034-0.026 0.002-0.002 0.005-0.004 0.007-0.006s0.003-0.002 0.004-0.004c0.085-0.067 0.211-0.194 0.237-0.462 0-0.001 0-0.001 0-0.002 0.001-0.008 0.001-0.016 0.002-0.024 0-0.006 0.001-0.011 0.001-0.017 0-0.004 0-0.009 0.001-0.013 0-0.011 0.001-0.021 0.001-0.032 0-0.001 0-0.001 0-0.002 0-0.026-0-0.053-0.002-0.081-0.001-0.016-0.002-0.030-0.005-0.043-0-0.001-0-0.001-0-0.002s-0.001-0.003-0.001-0.004-0.001-0.005-0.002-0.007c-0-0-0-0-0-0.001-0.001-0.003-0.002-0.005-0.003-0.007-0-0-0-0-0-0-0.027-0.064-0.13-0.088-0.554-0.096-0-0-0.001-0-0.001-0v0c-0.173-0.003-0.399-0.003-0.695-0.002-0.52 0.002-0.807-0.508-0.898-0.705 0.126-0.695 0.489-1.19 1.085-1.525 0.011-0.006 0.009-0.012-0.004-0.015 0.117-0.071-1.41-0.002-2.112 0.891-0.623-0.155-1.166-0.144-1.635-0.035-0.090-0.003-0.202-0.014-0.335-0.041-0.311-0.282-0.757-0.803-0.781-1.425 0 0-0.001 0.001-0.004 0.003-0-0.006-0.001-0.012-0.001-0.018 0 0-0.949 0.729-0.807 2.717-0 0.032-0.001 0.062-0.002 0.092-0.257 0.348-0.384 0.641-0.394 0.706-0.228 0.463-0.458 1.16-0.646 2.218 0 0 0.131-0.417 0.395-0.889-0.194 0.594-0.346 1.518-0.257 2.904 0 0 0.024-0.307 0.107-0.75 0.065 0.86 0.352 1.921 1.076 3.169 1.39 2.396 3.526 3.605 5.887 3.791 0.419 0.035 0.845 0.035 1.272 0.003 0.039-0.003 0.079-0.006 0.118-0.009 0.484-0.034 0.971-0.107 1.457-0.224 6.643-1.606 5.921-9.628 5.921-9.628z"}}]})(props);
};
function ImIe (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.472 9.825h3.688c0.028-0.256 0.040-0.517 0.040-0.784 0-1.253-0.336-2.429-0.924-3.442 0.607-1.614 0.586-2.984-0.227-3.803-0.773-0.77-2.848-0.645-5.194 0.394-0.174-0.013-0.349-0.020-0.526-0.020-3.22 0-5.921 2.216-6.667 5.201 1.010-1.293 2.072-2.231 3.492-2.913-0.129 0.121-0.882 0.87-1.009 0.996-3.743 3.742-4.923 8.63-3.653 9.9 0.965 0.965 2.715 0.802 4.725-0.182 0.934 0.476 1.992 0.744 3.113 0.744 3.018 0 5.575-1.942 6.501-4.648h-3.717c-0.511 0.943-1.512 1.586-2.66 1.586s-2.148-0.642-2.66-1.586c-0.227-0.426-0.358-0.915-0.358-1.432v-0.011h6.035zM5.442 8.013c0.085-1.517 1.347-2.728 2.887-2.728s2.802 1.21 2.887 2.728h-5.774zM14.015 2.559c0.524 0.529 0.511 1.503 0.063 2.719-0.768-1.17-1.883-2.093-3.2-2.619 1.408-0.604 2.553-0.684 3.137-0.1zM1.461 15.113c-0.668-0.669-0.467-2.072 0.394-3.763 0.536 1.504 1.581 2.767 2.927 3.581-1.491 0.677-2.712 0.792-3.321 0.182z"}}]})(props);
};
function ImEdge (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0.241 7.103c0.469-3.7 2.994-7.056 7.519-7.103 2.731 0.053 4.978 1.291 6.316 3.65 0.672 1.231 0.881 2.525 0.925 3.953v1.678h-10.041c0.047 4.141 6.094 4 8.697 2.175v3.372c-1.525 0.916-4.984 1.734-7.662 0.681-2.281-0.856-3.906-3.244-3.897-5.541-0.075-2.978 1.481-4.95 3.897-6.072-0.513 0.634-0.903 1.334-1.106 2.547h5.669c0 0 0.331-3.388-3.209-3.388-3.338 0.116-5.744 2.056-7.106 4.047v0z"}}]})(props);
};
function ImSafari (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8 0c-4.419 0-8 3.581-8 8s3.581 8 8 8 8-3.581 8-8-3.581-8-8-8zM14.975 7.388l-0.016-0.166c0.003 0.056 0.009 0.109 0.016 0.166zM13.881 4.2l-0.113-0.169c0.037 0.056 0.075 0.112 0.113 0.169zM13.447 3.603l-0.069-0.084c0.025 0.028 0.047 0.056 0.069 0.084zM12.478 2.619l-0.084-0.069c0.031 0.025 0.056 0.047 0.084 0.069zM11.969 2.231l-0.169-0.112c0.056 0.038 0.113 0.075 0.169 0.112zM8.778 1.044l-0.169-0.016c0.056 0.003 0.113 0.009 0.169 0.016zM7.388 1.025l-0.169 0.016c0.056-0.003 0.112-0.009 0.169-0.016zM4.2 2.119l-0.169 0.112c0.056-0.038 0.112-0.075 0.169-0.112zM3.603 2.553l-0.081 0.066c0.028-0.022 0.053-0.044 0.081-0.066zM2.619 3.522l-0.069 0.084c0.025-0.028 0.047-0.056 0.069-0.084zM2.231 4.031l-0.112 0.169c0.038-0.056 0.075-0.112 0.112-0.169zM1.044 7.222l-0.016 0.169c0.003-0.056 0.009-0.112 0.016-0.169zM1.025 8.613l0.016 0.169c-0.003-0.056-0.009-0.113-0.016-0.169zM2.119 11.797l0.112 0.169c-0.038-0.053-0.075-0.109-0.112-0.169zM2.25 11.994l1.247-0.834-0.138-0.209-1.247 0.834c-0.566-0.878-0.938-1.887-1.063-2.975l0.747-0.075-0.025-0.25-0.747 0.075c-0.012-0.144-0.019-0.291-0.022-0.438h1.5v-0.25h-1.5c0.003-0.147 0.009-0.291 0.022-0.438l0.747 0.072 0.025-0.25-0.747-0.072c0.125-1.088 0.5-2.097 1.066-2.975l1.247 0.834 0.138-0.209-1.25-0.828c0.084-0.119 0.169-0.237 0.259-0.35l0.578 0.475 0.159-0.194-0.578-0.475c0.094-0.112 0.194-0.219 0.294-0.325l1.059 1.059 0.178-0.178-1.059-1.059c0.106-0.1 0.212-0.2 0.322-0.294l0.475 0.581 0.194-0.159-0.475-0.578c0.116-0.091 0.231-0.178 0.35-0.263l0.834 1.247 0.209-0.138-0.834-1.247c0.878-0.566 1.888-0.938 2.975-1.063l0.075 0.747 0.25-0.025-0.075-0.747c0.144-0.012 0.291-0.019 0.438-0.022v1.5h0.25v-1.5c0.147 0.003 0.291 0.009 0.438 0.022l-0.072 0.747 0.25 0.025 0.072-0.747c1.088 0.125 2.097 0.5 2.975 1.066l-0.834 1.247 0.209 0.138 0.834-1.247c0.119 0.084 0.238 0.169 0.35 0.259l-0.475 0.578 0.194 0.159 0.475-0.578c0.113 0.094 0.219 0.194 0.325 0.294l-0.4 0.391-5.469 3.647-3.647 5.469-0.391 0.391c-0.1-0.106-0.2-0.213-0.294-0.322l0.578-0.475-0.159-0.194-0.578 0.475c-0.091-0.113-0.175-0.231-0.259-0.35zM2.619 12.478c-0.022-0.028-0.044-0.053-0.066-0.081l0.066 0.081zM3.522 13.381l0.081 0.066c-0.028-0.022-0.053-0.044-0.081-0.066zM4.031 13.766l0.169 0.113c-0.056-0.034-0.112-0.072-0.169-0.113zM7.222 14.956l0.169 0.016c-0.056-0.003-0.112-0.009-0.169-0.016zM8.613 14.975l0.166-0.016c-0.056 0.003-0.109 0.009-0.166 0.016zM11.8 13.881l0.169-0.113c-0.056 0.037-0.113 0.075-0.169 0.113zM12.397 13.447l0.084-0.069c-0.028 0.025-0.056 0.047-0.084 0.069zM12.944 12.956l0.012-0.012c-0.003 0.003-0.009 0.009-0.012 0.012zM13.381 12.478l0.069-0.084c-0.025 0.028-0.047 0.056-0.069 0.084zM13.491 12.344l-0.578-0.475-0.159 0.194 0.578 0.475c-0.094 0.113-0.194 0.219-0.294 0.325l-1.059-1.059-0.178 0.178 1.059 1.059c-0.106 0.1-0.213 0.2-0.322 0.294l-0.475-0.581-0.194 0.159 0.475 0.578c-0.116 0.091-0.231 0.178-0.35 0.262l-0.834-1.247-0.209 0.137 0.834 1.247c-0.878 0.566-1.887 0.938-2.975 1.063l-0.075-0.747-0.25 0.025 0.075 0.747c-0.144 0.012-0.291 0.019-0.438 0.022v-1.5h-0.25v1.5c-0.147-0.003-0.291-0.009-0.438-0.022l0.072-0.747-0.25-0.025-0.072 0.747c-1.088-0.125-2.097-0.5-2.975-1.066l0.834-1.247-0.209-0.137-0.828 1.247c-0.119-0.084-0.237-0.169-0.35-0.259l0.475-0.578-0.194-0.159-0.475 0.578c-0.112-0.094-0.219-0.194-0.325-0.294l0.394-0.391 5.469-3.647 3.647-5.469 0.391-0.391c0.1 0.106 0.2 0.212 0.294 0.322l-0.578 0.475 0.159 0.194 0.578-0.475c0.091 0.116 0.178 0.231 0.262 0.35l-1.247 0.834 0.137 0.209 1.247-0.834c0.566 0.878 0.938 1.888 1.063 2.975l-0.747 0.075 0.025 0.25 0.747-0.075c0.012 0.144 0.019 0.291 0.022 0.438h-1.5v0.25h1.5c-0.003 0.147-0.009 0.291-0.022 0.438l-0.747-0.072-0.025 0.25 0.747 0.072c-0.125 1.088-0.5 2.097-1.066 2.975l-1.247-0.834-0.137 0.209 1.247 0.834c-0.081 0.113-0.169 0.228-0.259 0.344zM14.975 8.609c-0.006 0.056-0.009 0.113-0.016 0.169l0.016-0.169zM13.881 11.8c-0.037 0.056-0.075 0.113-0.113 0.169l0.113-0.169z"}},{"tag":"path","attr":{"d":"M6.758 1.111l0.293 1.471-0.245 0.049-0.293-1.471 0.245-0.049z"}},{"tag":"path","attr":{"d":"M9.245 14.89l-0.293-1.471 0.245-0.049 0.293 1.471-0.245 0.049z"}},{"tag":"path","attr":{"d":"M6.088 1.264l0.218 0.718-0.239 0.073-0.218-0.718 0.239-0.073z"}},{"tag":"path","attr":{"d":"M9.913 14.733l-0.218-0.718 0.239-0.073 0.218 0.718-0.239 0.073z"}},{"tag":"path","attr":{"d":"M5.438 1.486l0.574 1.386-0.231 0.096-0.574-1.386 0.231-0.096z"}},{"tag":"path","attr":{"d":"M10.564 14.515l-0.574-1.386 0.231-0.096 0.574 1.386-0.231 0.096z"}},{"tag":"path","attr":{"d":"M4.588 1.885l0.22-0.118 0.354 0.661-0.22 0.118-0.354-0.661z"}},{"tag":"path","attr":{"d":"M11.408 14.114l-0.22 0.118-0.354-0.661 0.22-0.118 0.354 0.661z"}},{"tag":"path","attr":{"d":"M1.884 4.591l0.662 0.353-0.118 0.221-0.661-0.353 0.118-0.221z"}},{"tag":"path","attr":{"d":"M14.113 11.409l-0.662-0.353 0.118-0.22 0.662 0.353-0.118 0.22z"}},{"tag":"path","attr":{"d":"M2.872 6.010l-1.386-0.574 0.096-0.231 1.386 0.574-0.096 0.231z"}},{"tag":"path","attr":{"d":"M13.13 9.989l1.386 0.574-0.096 0.231-1.386-0.574 0.096-0.231z"}},{"tag":"path","attr":{"d":"M1.337 5.85l0.718 0.218-0.073 0.239-0.718-0.218 0.073-0.239z"}},{"tag":"path","attr":{"d":"M14.661 10.151l-0.718-0.218 0.073-0.239 0.718 0.218-0.073 0.239z"}},{"tag":"path","attr":{"d":"M1.157 6.512l1.471 0.293-0.049 0.245-1.471-0.293 0.049-0.245z"}},{"tag":"path","attr":{"d":"M14.84 9.488l-1.471-0.293 0.049-0.245 1.471 0.293-0.049 0.245z"}},{"tag":"path","attr":{"d":"M1.109 9.243l1.471-0.293 0.049 0.245-1.471 0.293-0.049-0.245z"}},{"tag":"path","attr":{"d":"M14.888 6.757l-1.471 0.293-0.049-0.245 1.471-0.293 0.049 0.245z"}},{"tag":"path","attr":{"d":"M1.265 9.914l0.718-0.218 0.073 0.239-0.718 0.218-0.073-0.239z"}},{"tag":"path","attr":{"d":"M14.734 6.089l-0.718 0.218-0.073-0.239 0.718-0.218 0.073 0.239z"}},{"tag":"path","attr":{"d":"M1.58 10.796l-0.096-0.231 1.386-0.574 0.096 0.231-1.386 0.574z"}},{"tag":"path","attr":{"d":"M14.419 5.207l0.096 0.231-1.386 0.574-0.096-0.231 1.386-0.574z"}},{"tag":"path","attr":{"d":"M1.888 11.41l-0.118-0.22 0.661-0.354 0.118 0.22-0.661 0.354z"}},{"tag":"path","attr":{"d":"M14.116 4.59l0.118 0.22-0.661 0.354-0.118-0.22 0.661-0.354z"}},{"tag":"path","attr":{"d":"M4.811 14.232l-0.22-0.118 0.354-0.661 0.22 0.118-0.354 0.661z"}},{"tag":"path","attr":{"d":"M11.189 1.767l0.22 0.118-0.353 0.661-0.22-0.118 0.353-0.661z"}},{"tag":"path","attr":{"d":"M5.207 14.419l0.574-1.386 0.231 0.096-0.574 1.386-0.231-0.096z"}},{"tag":"path","attr":{"d":"M10.795 1.58l-0.574 1.386-0.231-0.096 0.574-1.386 0.231 0.096z"}},{"tag":"path","attr":{"d":"M6.088 14.735l-0.239-0.073 0.218-0.718 0.239 0.073-0.218 0.718z"}},{"tag":"path","attr":{"d":"M9.912 1.264l0.239 0.073-0.218 0.718-0.239-0.073 0.218-0.718z"}},{"tag":"path","attr":{"d":"M6.757 14.888l-0.245-0.049 0.293-1.471 0.245 0.049-0.293 1.471z"}},{"tag":"path","attr":{"d":"M9.243 1.109l0.245 0.049-0.293 1.471-0.245-0.049 0.293-1.471z"}}]})(props);
};
function ImOpera (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M16 8v0 0c0 2.369-1.031 4.5-2.669 5.963-2.053 1-3.966 0.3-4.597-0.137 2.016-0.441 3.537-2.878 3.537-5.825s-1.522-5.384-3.537-5.828c0.634-0.438 2.547-1.137 4.597-0.138 1.637 1.466 2.669 3.597 2.669 5.966v0 0z"}},{"tag":"path","attr":{"d":"M5.366 3.491c-0.884 1.044-1.456 2.587-1.494 4.322 0 0.003 0 0.372 0 0.378 0.038 1.731 0.613 3.275 1.497 4.319 1.147 1.491 2.853 2.434 4.759 2.434 1.172 0 2.269-0.356 3.206-0.978-1.419 1.266-3.287 2.034-5.334 2.034-0.128 0-0.256-0.003-0.381-0.009-4.241-0.2-7.619-3.7-7.619-7.991 0-4.419 3.581-8 8-8 0.009 0 0.019 0 0.031 0 2.037 0.006 3.894 0.775 5.303 2.038-0.938-0.622-2.034-0.981-3.206-0.981-1.906 0-3.612 0.944-4.763 2.434z"}}]})(props);
};
function ImFilePdf (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M13.156 9.211c-0.213-0.21-0.686-0.321-1.406-0.331-0.487-0.005-1.073 0.038-1.69 0.124-0.276-0.159-0.561-0.333-0.784-0.542-0.601-0.561-1.103-1.34-1.415-2.197 0.020-0.080 0.038-0.15 0.054-0.222 0 0 0.339-1.923 0.249-2.573-0.012-0.089-0.020-0.115-0.044-0.184l-0.029-0.076c-0.092-0.212-0.273-0.437-0.556-0.425l-0.171-0.005c-0.316 0-0.573 0.161-0.64 0.403-0.205 0.757 0.007 1.889 0.39 3.355l-0.098 0.239c-0.275 0.67-0.619 1.345-0.923 1.94l-0.040 0.077c-0.32 0.626-0.61 1.157-0.873 1.607l-0.271 0.144c-0.020 0.010-0.485 0.257-0.594 0.323-0.926 0.553-1.539 1.18-1.641 1.678-0.032 0.159-0.008 0.362 0.156 0.456l0.263 0.132c0.114 0.057 0.234 0.086 0.357 0.086 0.659 0 1.425-0.821 2.48-2.662 1.218-0.396 2.604-0.726 3.819-0.908 0.926 0.521 2.065 0.883 2.783 0.883 0.128 0 0.238-0.012 0.327-0.036 0.138-0.037 0.254-0.115 0.325-0.222 0.139-0.21 0.168-0.499 0.13-0.795-0.011-0.088-0.081-0.196-0.157-0.271zM3.307 12.72c0.12-0.329 0.596-0.979 1.3-1.556 0.044-0.036 0.153-0.138 0.253-0.233-0.736 1.174-1.229 1.642-1.553 1.788zM7.476 3.12c0.212 0 0.333 0.534 0.343 1.035s-0.107 0.853-0.252 1.113c-0.12-0.385-0.179-0.992-0.179-1.389 0 0-0.009-0.759 0.088-0.759v0zM6.232 9.961c0.148-0.264 0.301-0.543 0.458-0.839 0.383-0.724 0.624-1.29 0.804-1.755 0.358 0.651 0.804 1.205 1.328 1.649 0.065 0.055 0.135 0.111 0.207 0.166-1.066 0.211-1.987 0.467-2.798 0.779v0zM12.952 9.901c-0.065 0.041-0.251 0.064-0.37 0.064-0.386 0-0.864-0.176-1.533-0.464 0.257-0.019 0.493-0.029 0.705-0.029 0.387 0 0.502-0.002 0.88 0.095s0.383 0.293 0.318 0.333v0z"}},{"tag":"path","attr":{"d":"M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421v0zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134v0zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"}}]})(props);
};
function ImFileOpenoffice (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M10.785 7.37c-0.948-0.448-2.156-0.538-3.044 0.095 1.080-0.103 2.265 0.076 3.049 0.893 0.75-0.861 1.939-1.022 3.015-0.933-0.898-0.596-2.082-0.516-3.019-0.054v0zM10.401 9.465c-1.068-0.025-2.101 0.362-2.986 0.939-1.675-0.712-3.793-0.58-5.219 0.609 0.411-0.015 0.813-0.116 1.22-0.169 1.487-0.148 3.072 0.221 4.196 1.247 0.465-0.68 1.119-1.223 1.87-1.561 0.986-0.477 2.096-0.526 3.169-0.539-0.651-0.448-1.478-0.531-2.249-0.526z"}},{"tag":"path","attr":{"d":"M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421v0zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134v0zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"}}]})(props);
};
function ImFileWord (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M9.997 7.436h0.691l-0.797 3.534-1.036-4.969h-1.665l-1.205 4.969-0.903-4.969h-1.741l1.767 7.998h1.701l1.192-4.73 1.066 4.73h1.568l2.025-7.998h-2.663v1.435z"}},{"tag":"path","attr":{"d":"M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421v0zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134v0zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"}}]})(props);
};
function ImFileExcel (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M11.61 6h-2.114l-1.496 2.204-1.496-2.204h-2.114l2.534 3.788-2.859 4.212h3.935v-1.431h-0.784l0.784-1.172 1.741 2.603h2.194l-2.859-4.212 2.534-3.788z"}},{"tag":"path","attr":{"d":"M14.341 3.579c-0.347-0.473-0.831-1.027-1.362-1.558s-1.085-1.015-1.558-1.362c-0.806-0.591-1.197-0.659-1.421-0.659h-7.75c-0.689 0-1.25 0.561-1.25 1.25v13.5c0 0.689 0.561 1.25 1.25 1.25h11.5c0.689 0 1.25-0.561 1.25-1.25v-9.75c0-0.224-0.068-0.615-0.659-1.421v0zM12.271 2.729c0.48 0.48 0.856 0.912 1.134 1.271h-2.406v-2.405c0.359 0.278 0.792 0.654 1.271 1.134v0zM14 14.75c0 0.136-0.114 0.25-0.25 0.25h-11.5c-0.135 0-0.25-0.114-0.25-0.25v-13.5c0-0.135 0.115-0.25 0.25-0.25 0 0 7.749-0 7.75 0v3.5c0 0.276 0.224 0.5 0.5 0.5h3.5v9.75z"}}]})(props);
};
function ImLibreoffice (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M8.354 0.354c-0.194-0.194-0.579-0.354-0.854-0.354h-6c-0.275 0-0.5 0.225-0.5 0.5v15c0 0.275 0.225 0.5 0.5 0.5h12c0.275 0 0.5-0.225 0.5-0.5v-9c0-0.275-0.159-0.659-0.354-0.854l-5.293-5.293zM13 15h-11v-14h5.487c0.046 0.008 0.131 0.043 0.169 0.070l5.274 5.274c0.027 0.038 0.062 0.123 0.070 0.169v8.487zM13.5 0h-3c-0.275 0-0.341 0.159-0.146 0.354l3.293 3.293c0.194 0.194 0.354 0.129 0.354-0.146v-3c0-0.275-0.225-0.5-0.5-0.5z"}}]})(props);
};
function ImHtmlFive (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0.946 0l1.284 14.4 5.762 1.6 5.777-1.602 1.286-14.398h-14.108zM12.26 4.71h-6.758l0.161 1.809h6.437l-0.485 5.422-3.623 1.004-3.618-1.004-0.247-2.774h1.773l0.126 1.41 1.967 0.53 0.004-0.001 1.968-0.531 0.204-2.29h-6.121l-0.476-5.341h8.847l-0.158 1.766z"}}]})(props);
};
function ImHtmlFive2 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0.946 0l1.284 14.4 5.762 1.6 5.777-1.602 1.286-14.398h-14.108zM12.668 13.482l-4.644 1.287v0.007l-0.012-0.004-0.012 0.004v-0.007l-4.644-1.287-1.098-12.304h11.508l-1.098 12.304zM10.168 8.284l-0.204 2.29-1.972 0.532-1.967-0.53-0.126-1.41h-1.773l0.247 2.774 3.626 1.003 3.615-1.003 0.485-5.422h-6.437l-0.161-1.809h6.758l0.158-1.766h-8.847l0.477 5.341z"}}]})(props);
};
function ImCss3 (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M2.381 0.758l-0.537 2.686h10.934l-0.342 1.735h-10.94l-0.53 2.686h10.933l-0.61 3.063-4.406 1.46-3.819-1.46 0.261-1.329h-2.686l-0.639 3.224 6.316 2.417 7.281-2.417 2.403-12.066z"}}]})(props);
};
function ImGit (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M15.698 7.287l-6.986-6.986c-0.402-0.402-1.055-0.402-1.457 0l-1.623 1.623 1.221 1.221c0.196-0.094 0.415-0.146 0.647-0.146 0.828 0 1.5 0.672 1.5 1.5 0 0.232-0.053 0.451-0.146 0.647l2 2c0.196-0.094 0.415-0.146 0.647-0.146 0.828 0 1.5 0.672 1.5 1.5s-0.672 1.5-1.5 1.5-1.5-0.672-1.5-1.5c0-0.232 0.053-0.451 0.146-0.647l-2-2c-0.048 0.023-0.097 0.043-0.147 0.061v4.171c0.583 0.206 1 0.761 1 1.414 0 0.828-0.672 1.5-1.5 1.5s-1.5-0.672-1.5-1.5c0-0.653 0.417-1.208 1-1.414v-4.171c-0.583-0.206-1-0.761-1-1.414 0-0.232 0.053-0.451 0.146-0.647l-1.221-1.221-4.623 4.623c-0.402 0.403-0.402 1.055 0 1.458l6.986 6.986c0.402 0.402 1.054 0.402 1.457 0l6.953-6.953c0.402-0.403 0.402-1.055-0-1.458z"}}]})(props);
};
function ImCodepen (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.777 5.751l-7-4.667c-0.168-0.112-0.387-0.112-0.555 0l-7 4.667c-0.139 0.093-0.223 0.249-0.223 0.416v4.667c0 0.167 0.084 0.323 0.223 0.416l7 4.667c0.084 0.056 0.181 0.084 0.277 0.084s0.193-0.028 0.277-0.084l7-4.667c0.139-0.093 0.223-0.249 0.223-0.416v-4.667c0-0.167-0.084-0.323-0.223-0.416zM7.5 10.232l-2.599-1.732 2.599-1.732 2.599 1.732-2.599 1.732zM8 5.899v-3.465l5.599 3.732-2.599 1.732-3-2zM7 5.899l-3 2-2.599-1.732 5.599-3.732v3.465zM3.099 8.5l-2.099 1.399v-2.798l2.099 1.399zM4 9.101l3 2v3.465l-5.599-3.732 2.599-1.732zM8 11.101l3-2 2.599 1.732-5.599 3.732v-3.465zM11.901 8.5l2.099-1.399v2.798l-2.099-1.399z"}}]})(props);
};
function ImSvg (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M14.5 6.5c-0.444 0-0.843 0.193-1.118 0.5h-2.968l2.099-2.099c0.411 0.023 0.83-0.123 1.144-0.437 0.586-0.586 0.586-1.536 0-2.121s-1.536-0.586-2.121 0c-0.314 0.314-0.46 0.733-0.437 1.144l-2.099 2.099v-2.968c0.307-0.275 0.5-0.674 0.5-1.118 0-0.828-0.672-1.5-1.5-1.5s-1.5 0.672-1.5 1.5c0 0.444 0.193 0.843 0.5 1.118v2.968l-2.099-2.099c0.023-0.411-0.123-0.83-0.437-1.144-0.586-0.586-1.536-0.586-2.121 0s-0.586 1.536 0 2.121c0.314 0.314 0.733 0.46 1.144 0.437l2.099 2.099h-2.968c-0.275-0.307-0.674-0.5-1.118-0.5-0.828 0-1.5 0.672-1.5 1.5s0.672 1.5 1.5 1.5c0.444 0 0.843-0.193 1.118-0.5h2.968l-2.099 2.099c-0.411-0.023-0.83 0.123-1.144 0.437-0.586 0.586-0.586 1.536 0 2.121s1.536 0.586 2.121 0c0.314-0.314 0.46-0.733 0.437-1.144l2.099-2.099v2.968c-0.307 0.275-0.5 0.674-0.5 1.118 0 0.828 0.672 1.5 1.5 1.5s1.5-0.672 1.5-1.5c0-0.444-0.193-0.843-0.5-1.118v-2.968l2.099 2.099c-0.023 0.411 0.123 0.83 0.437 1.144 0.586 0.586 1.536 0.586 2.121 0s0.586-1.536 0-2.121c-0.314-0.314-0.733-0.46-1.144-0.437l-2.099-2.099h2.968c0.275 0.307 0.674 0.5 1.118 0.5 0.828 0 1.5-0.672 1.5-1.5s-0.672-1.5-1.5-1.5z"}}]})(props);
};
function ImIcoMoon (props) {
  return GenIcon({"tag":"svg","attr":{"version":"1.1","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M4.055 8c0-1.022 0.829-1.851 1.851-1.851s1.851 0.829 1.851 1.851c0 1.022-0.829 1.851-1.851 1.851s-1.851-0.829-1.851-1.851zM8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.418 0 8-3.582 8-8s-3.582-8-8-8zM5.928 14.989c-2.406-1.4-4.023-4.005-4.023-6.989s1.617-5.589 4.023-6.989c2.406 1.399 4.025 4.005 4.025 6.989s-1.618 5.589-4.025 6.989z"}}]})(props);
};


/***/ }),

/***/ 87441:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/YouTube.tsx
var YouTube_exports = {};
__export(YouTube_exports, {
  default: () => YouTube_default
});
module.exports = __toCommonJS(YouTube_exports);
var import_prop_types = __toESM(__webpack_require__(55601));
var import_react = __toESM(__webpack_require__(18038));
var import_fast_deep_equal = __toESM(__webpack_require__(96967));
var import_youtube_player = __toESM(__webpack_require__(82113));
function shouldUpdateVideo(prevProps, props) {
  var _a, _b;
  if (prevProps.videoId !== props.videoId) {
    return true;
  }
  const prevVars = ((_a = prevProps.opts) == null ? void 0 : _a.playerVars) || {};
  const vars = ((_b = props.opts) == null ? void 0 : _b.playerVars) || {};
  return prevVars.start !== vars.start || prevVars.end !== vars.end;
}
function filterResetOptions(opts = {}) {
  return __spreadProps(__spreadValues({}, opts), {
    height: 0,
    width: 0,
    playerVars: __spreadProps(__spreadValues({}, opts.playerVars), {
      autoplay: 0,
      start: 0,
      end: 0
    })
  });
}
function shouldResetPlayer(prevProps, props) {
  return prevProps.videoId !== props.videoId || !(0, import_fast_deep_equal.default)(filterResetOptions(prevProps.opts), filterResetOptions(props.opts));
}
function shouldUpdatePlayer(prevProps, props) {
  var _a, _b, _c, _d;
  return prevProps.id !== props.id || prevProps.className !== props.className || ((_a = prevProps.opts) == null ? void 0 : _a.width) !== ((_b = props.opts) == null ? void 0 : _b.width) || ((_c = prevProps.opts) == null ? void 0 : _c.height) !== ((_d = props.opts) == null ? void 0 : _d.height) || prevProps.iframeClassName !== props.iframeClassName || prevProps.title !== props.title;
}
var defaultProps = {
  videoId: "",
  id: "",
  className: "",
  iframeClassName: "",
  style: {},
  title: "",
  loading: void 0,
  opts: {},
  onReady: () => {
  },
  onError: () => {
  },
  onPlay: () => {
  },
  onPause: () => {
  },
  onEnd: () => {
  },
  onStateChange: () => {
  },
  onPlaybackRateChange: () => {
  },
  onPlaybackQualityChange: () => {
  }
};
var propTypes = {
  videoId: import_prop_types.default.string,
  id: import_prop_types.default.string,
  className: import_prop_types.default.string,
  iframeClassName: import_prop_types.default.string,
  style: import_prop_types.default.object,
  title: import_prop_types.default.string,
  loading: import_prop_types.default.oneOf(["lazy", "eager"]),
  opts: import_prop_types.default.objectOf(import_prop_types.default.any),
  onReady: import_prop_types.default.func,
  onError: import_prop_types.default.func,
  onPlay: import_prop_types.default.func,
  onPause: import_prop_types.default.func,
  onEnd: import_prop_types.default.func,
  onStateChange: import_prop_types.default.func,
  onPlaybackRateChange: import_prop_types.default.func,
  onPlaybackQualityChange: import_prop_types.default.func
};
var _YouTube = class extends import_react.default.Component {
  constructor(props) {
    super(props);
    this.destroyPlayerPromise = void 0;
    this.onPlayerReady = (event) => {
      var _a, _b;
      return (_b = (_a = this.props).onReady) == null ? void 0 : _b.call(_a, event);
    };
    this.onPlayerError = (event) => {
      var _a, _b;
      return (_b = (_a = this.props).onError) == null ? void 0 : _b.call(_a, event);
    };
    this.onPlayerStateChange = (event) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      (_b = (_a = this.props).onStateChange) == null ? void 0 : _b.call(_a, event);
      switch (event.data) {
        case _YouTube.PlayerState.ENDED:
          (_d = (_c = this.props).onEnd) == null ? void 0 : _d.call(_c, event);
          break;
        case _YouTube.PlayerState.PLAYING:
          (_f = (_e = this.props).onPlay) == null ? void 0 : _f.call(_e, event);
          break;
        case _YouTube.PlayerState.PAUSED:
          (_h = (_g = this.props).onPause) == null ? void 0 : _h.call(_g, event);
          break;
        default:
      }
    };
    this.onPlayerPlaybackRateChange = (event) => {
      var _a, _b;
      return (_b = (_a = this.props).onPlaybackRateChange) == null ? void 0 : _b.call(_a, event);
    };
    this.onPlayerPlaybackQualityChange = (event) => {
      var _a, _b;
      return (_b = (_a = this.props).onPlaybackQualityChange) == null ? void 0 : _b.call(_a, event);
    };
    this.destroyPlayer = () => {
      if (this.internalPlayer) {
        this.destroyPlayerPromise = this.internalPlayer.destroy().then(() => this.destroyPlayerPromise = void 0);
        return this.destroyPlayerPromise;
      }
      return Promise.resolve();
    };
    this.createPlayer = () => {
      if (typeof document === "undefined")
        return;
      if (this.destroyPlayerPromise) {
        this.destroyPlayerPromise.then(this.createPlayer);
        return;
      }
      const playerOpts = __spreadProps(__spreadValues({}, this.props.opts), {
        videoId: this.props.videoId
      });
      this.internalPlayer = (0, import_youtube_player.default)(this.container, playerOpts);
      this.internalPlayer.on("ready", this.onPlayerReady);
      this.internalPlayer.on("error", this.onPlayerError);
      this.internalPlayer.on("stateChange", this.onPlayerStateChange);
      this.internalPlayer.on("playbackRateChange", this.onPlayerPlaybackRateChange);
      this.internalPlayer.on("playbackQualityChange", this.onPlayerPlaybackQualityChange);
      if (this.props.title || this.props.loading) {
        this.internalPlayer.getIframe().then((iframe) => {
          if (this.props.title)
            iframe.setAttribute("title", this.props.title);
          if (this.props.loading)
            iframe.setAttribute("loading", this.props.loading);
        });
      }
    };
    this.resetPlayer = () => this.destroyPlayer().then(this.createPlayer);
    this.updatePlayer = () => {
      var _a;
      (_a = this.internalPlayer) == null ? void 0 : _a.getIframe().then((iframe) => {
        if (this.props.id)
          iframe.setAttribute("id", this.props.id);
        else
          iframe.removeAttribute("id");
        if (this.props.iframeClassName)
          iframe.setAttribute("class", this.props.iframeClassName);
        else
          iframe.removeAttribute("class");
        if (this.props.opts && this.props.opts.width)
          iframe.setAttribute("width", this.props.opts.width.toString());
        else
          iframe.removeAttribute("width");
        if (this.props.opts && this.props.opts.height)
          iframe.setAttribute("height", this.props.opts.height.toString());
        else
          iframe.removeAttribute("height");
        if (this.props.title)
          iframe.setAttribute("title", this.props.title);
        else
          iframe.setAttribute("title", "YouTube video player");
        if (this.props.loading)
          iframe.setAttribute("loading", this.props.loading);
        else
          iframe.removeAttribute("loading");
      });
    };
    this.getInternalPlayer = () => {
      return this.internalPlayer;
    };
    this.updateVideo = () => {
      var _a, _b, _c, _d;
      if (typeof this.props.videoId === "undefined" || this.props.videoId === null) {
        (_a = this.internalPlayer) == null ? void 0 : _a.stopVideo();
        return;
      }
      let autoplay = false;
      const opts = {
        videoId: this.props.videoId
      };
      if ((_b = this.props.opts) == null ? void 0 : _b.playerVars) {
        autoplay = this.props.opts.playerVars.autoplay === 1;
        if ("start" in this.props.opts.playerVars) {
          opts.startSeconds = this.props.opts.playerVars.start;
        }
        if ("end" in this.props.opts.playerVars) {
          opts.endSeconds = this.props.opts.playerVars.end;
        }
      }
      if (autoplay) {
        (_c = this.internalPlayer) == null ? void 0 : _c.loadVideoById(opts);
        return;
      }
      (_d = this.internalPlayer) == null ? void 0 : _d.cueVideoById(opts);
    };
    this.refContainer = (container) => {
      this.container = container;
    };
    this.container = null;
    this.internalPlayer = null;
  }
  componentDidMount() {
    this.createPlayer();
  }
  componentDidUpdate(prevProps) {
    return __async(this, null, function* () {
      if (shouldUpdatePlayer(prevProps, this.props)) {
        this.updatePlayer();
      }
      if (shouldResetPlayer(prevProps, this.props)) {
        yield this.resetPlayer();
      }
      if (shouldUpdateVideo(prevProps, this.props)) {
        this.updateVideo();
      }
    });
  }
  componentWillUnmount() {
    this.destroyPlayer();
  }
  render() {
    return /* @__PURE__ */ import_react.default.createElement("div", {
      className: this.props.className,
      style: this.props.style
    }, /* @__PURE__ */ import_react.default.createElement("div", {
      id: this.props.id,
      className: this.props.iframeClassName,
      ref: this.refContainer
    }));
  }
};
var YouTube = _YouTube;
YouTube.propTypes = propTypes;
YouTube.defaultProps = defaultProps;
YouTube.PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
};
var YouTube_default = YouTube;
// Annotate the CommonJS export names for ESM import in node:
0 && (0);
//# sourceMappingURL=YouTube.js.map

/***/ }),

/***/ 65714:
/***/ ((module) => {

"use strict";


var Sister;

/**
* @link https://github.com/gajus/sister for the canonical source repository
* @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause
*/
Sister = function () {
    var sister = {},
        events = {};

    /**
     * @name handler
     * @function
     * @param {Object} data Event data.
     */

    /**
     * @param {String} name Event name.
     * @param {handler} handler
     * @return {listener}
     */
    sister.on = function (name, handler) {
        var listener = {name: name, handler: handler};
        events[name] = events[name] || [];
        events[name].unshift(listener);
        return listener;
    };

    /**
     * @param {listener}
     */
    sister.off = function (listener) {
        var index = events[listener.name].indexOf(listener);

        if (index !== -1) {
            events[listener.name].splice(index, 1);
        }
    };

    /**
     * @param {String} name Event name.
     * @param {Object} data Event data.
     */
    sister.trigger = function (name, data) {
        var listeners = events[name],
            i;

        if (listeners) {
            i = listeners.length;
            while (i--) {
                listeners[i].handler(data);
            }
        }
    };

    return sister;
};

module.exports = Sister;


/***/ }),

/***/ 88191:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _PlayerStates = __webpack_require__(36896);

var _PlayerStates2 = _interopRequireDefault(_PlayerStates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = {
  pauseVideo: {
    acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PAUSED],
    stateChangeRequired: false
  },
  playVideo: {
    acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PLAYING],
    stateChangeRequired: false
  },
  seekTo: {
    acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PLAYING, _PlayerStates2.default.PAUSED],
    stateChangeRequired: true,

    // TRICKY: `seekTo` may not cause a state change if no buffering is
    // required.
    timeout: 3000
  }
};
module.exports = exports['default'];

/***/ }),

/***/ 44755:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _debug = __webpack_require__(17783);

var _debug2 = _interopRequireDefault(_debug);

var _functionNames = __webpack_require__(5067);

var _functionNames2 = _interopRequireDefault(_functionNames);

var _eventNames = __webpack_require__(661);

var _eventNames2 = _interopRequireDefault(_eventNames);

var _FunctionStateMap = __webpack_require__(88191);

var _FunctionStateMap2 = _interopRequireDefault(_FunctionStateMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable promise/prefer-await-to-then */

var debug = (0, _debug2.default)('youtube-player');

var YouTubePlayer = {};

/**
 * Construct an object that defines an event handler for all of the YouTube
 * player events. Proxy captured events through an event emitter.
 *
 * @todo Capture event parameters.
 * @see https://developers.google.com/youtube/iframe_api_reference#Events
 */
YouTubePlayer.proxyEvents = function (emitter) {
  var events = {};

  var _loop = function _loop(eventName) {
    var onEventName = 'on' + eventName.slice(0, 1).toUpperCase() + eventName.slice(1);

    events[onEventName] = function (event) {
      debug('event "%s"', onEventName, event);

      emitter.trigger(eventName, event);
    };
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _eventNames2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var eventName = _step.value;

      _loop(eventName);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return events;
};

/**
 * Delays player API method execution until player state is ready.
 *
 * @todo Proxy all of the methods using Object.keys.
 * @todo See TRICKY below.
 * @param playerAPIReady Promise that resolves when player is ready.
 * @param strictState A flag designating whether or not to wait for
 * an acceptable state when calling supported functions.
 * @returns {Object}
 */
YouTubePlayer.promisifyPlayer = function (playerAPIReady) {
  var strictState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var functions = {};

  var _loop2 = function _loop2(functionName) {
    if (strictState && _FunctionStateMap2.default[functionName]) {
      functions[functionName] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return playerAPIReady.then(function (player) {
          var stateInfo = _FunctionStateMap2.default[functionName];
          var playerState = player.getPlayerState();

          // eslint-disable-next-line no-warning-comments
          // TODO: Just spread the args into the function once Babel is fixed:
          // https://github.com/babel/babel/issues/4270
          //
          // eslint-disable-next-line prefer-spread
          var value = player[functionName].apply(player, args);

          // TRICKY: For functions like `seekTo`, a change in state must be
          // triggered given that the resulting state could match the initial
          // state.
          if (stateInfo.stateChangeRequired ||

          // eslint-disable-next-line no-extra-parens
          Array.isArray(stateInfo.acceptableStates) && stateInfo.acceptableStates.indexOf(playerState) === -1) {
            return new Promise(function (resolve) {
              var onPlayerStateChange = function onPlayerStateChange() {
                var playerStateAfterChange = player.getPlayerState();

                var timeout = void 0;

                if (typeof stateInfo.timeout === 'number') {
                  timeout = setTimeout(function () {
                    player.removeEventListener('onStateChange', onPlayerStateChange);

                    resolve();
                  }, stateInfo.timeout);
                }

                if (Array.isArray(stateInfo.acceptableStates) && stateInfo.acceptableStates.indexOf(playerStateAfterChange) !== -1) {
                  player.removeEventListener('onStateChange', onPlayerStateChange);

                  clearTimeout(timeout);

                  resolve();
                }
              };

              player.addEventListener('onStateChange', onPlayerStateChange);
            }).then(function () {
              return value;
            });
          }

          return value;
        });
      };
    } else {
      functions[functionName] = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return playerAPIReady.then(function (player) {
          // eslint-disable-next-line no-warning-comments
          // TODO: Just spread the args into the function once Babel is fixed:
          // https://github.com/babel/babel/issues/4270
          //
          // eslint-disable-next-line prefer-spread
          return player[functionName].apply(player, args);
        });
      };
    }
  };

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = _functionNames2.default[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var functionName = _step2.value;

      _loop2(functionName);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return functions;
};

exports["default"] = YouTubePlayer;
module.exports = exports['default'];

/***/ }),

/***/ 36896:
/***/ ((module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = {
  BUFFERING: 3,
  ENDED: 0,
  PAUSED: 2,
  PLAYING: 1,
  UNSTARTED: -1,
  VIDEO_CUED: 5
};
module.exports = exports["default"];

/***/ }),

/***/ 661:
/***/ ((module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));


/**
 * @see https://developers.google.com/youtube/iframe_api_reference#Events
 * `volumeChange` is not officially supported but seems to work
 * it emits an object: `{volume: 82.6923076923077, muted: false}`
 */
exports["default"] = ['ready', 'stateChange', 'playbackQualityChange', 'playbackRateChange', 'error', 'apiChange', 'volumeChange'];
module.exports = exports['default'];

/***/ }),

/***/ 5067:
/***/ ((module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));


/**
 * @see https://developers.google.com/youtube/iframe_api_reference#Functions
 */
exports["default"] = ['cueVideoById', 'loadVideoById', 'cueVideoByUrl', 'loadVideoByUrl', 'playVideo', 'pauseVideo', 'stopVideo', 'getVideoLoadedFraction', 'cuePlaylist', 'loadPlaylist', 'nextVideo', 'previousVideo', 'playVideoAt', 'setShuffle', 'setLoop', 'getPlaylist', 'getPlaylistIndex', 'setOption', 'mute', 'unMute', 'isMuted', 'setVolume', 'getVolume', 'seekTo', 'getPlayerState', 'getPlaybackRate', 'setPlaybackRate', 'getAvailablePlaybackRates', 'getPlaybackQuality', 'setPlaybackQuality', 'getAvailableQualityLevels', 'getCurrentTime', 'getDuration', 'removeEventListener', 'getVideoUrl', 'getVideoEmbedCode', 'getOptions', 'getOption', 'addEventListener', 'destroy', 'setSize', 'getIframe'];
module.exports = exports['default'];

/***/ }),

/***/ 82113:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _sister = __webpack_require__(65714);

var _sister2 = _interopRequireDefault(_sister);

var _loadYouTubeIframeApi = __webpack_require__(87221);

var _loadYouTubeIframeApi2 = _interopRequireDefault(_loadYouTubeIframeApi);

var _YouTubePlayer = __webpack_require__(44755);

var _YouTubePlayer2 = _interopRequireDefault(_YouTubePlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef YT.Player
 * @see https://developers.google.com/youtube/iframe_api_reference
 * */

/**
 * @see https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
 */
var youtubeIframeAPI = void 0;

/**
 * A factory function used to produce an instance of YT.Player and queue function calls and proxy events of the resulting object.
 *
 * @param maybeElementId Either An existing YT.Player instance,
 * the DOM element or the id of the HTML element where the API will insert an <iframe>.
 * @param options See `options` (Ignored when using an existing YT.Player instance).
 * @param strictState A flag designating whether or not to wait for
 * an acceptable state when calling supported functions. Default: `false`.
 * See `FunctionStateMap.js` for supported functions and acceptable states.
 */

exports["default"] = function (maybeElementId) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var strictState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var emitter = (0, _sister2.default)();

  if (!youtubeIframeAPI) {
    youtubeIframeAPI = (0, _loadYouTubeIframeApi2.default)(emitter);
  }

  if (options.events) {
    throw new Error('Event handlers cannot be overwritten.');
  }

  if (typeof maybeElementId === 'string' && !document.getElementById(maybeElementId)) {
    throw new Error('Element "' + maybeElementId + '" does not exist.');
  }

  options.events = _YouTubePlayer2.default.proxyEvents(emitter);

  var playerAPIReady = new Promise(function (resolve) {
    if ((typeof maybeElementId === 'undefined' ? 'undefined' : _typeof(maybeElementId)) === 'object' && maybeElementId.playVideo instanceof Function) {
      var player = maybeElementId;

      resolve(player);
    } else {
      // asume maybeElementId can be rendered inside
      // eslint-disable-next-line promise/catch-or-return
      youtubeIframeAPI.then(function (YT) {
        // eslint-disable-line promise/prefer-await-to-then
        var player = new YT.Player(maybeElementId, options);

        emitter.on('ready', function () {
          resolve(player);
        });

        return null;
      });
    }
  });

  var playerApi = _YouTubePlayer2.default.promisifyPlayer(playerAPIReady, strictState);

  playerApi.on = emitter.on;
  playerApi.off = emitter.off;

  return playerApi;
};

module.exports = exports['default'];

/***/ }),

/***/ 87221:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _loadScript = __webpack_require__(64931);

var _loadScript2 = _interopRequireDefault(_loadScript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = function (emitter) {
  /**
   * A promise that is resolved when window.onYouTubeIframeAPIReady is called.
   * The promise is resolved with a reference to window.YT object.
   */
  var iframeAPIReady = new Promise(function (resolve) {
    if (window.YT && window.YT.Player && window.YT.Player instanceof Function) {
      resolve(window.YT);

      return;
    } else {
      var protocol = window.location.protocol === 'http:' ? 'http:' : 'https:';

      (0, _loadScript2.default)(protocol + '//www.youtube.com/iframe_api', function (error) {
        if (error) {
          emitter.trigger('error', error);
        }
      });
    }

    var previous = window.onYouTubeIframeAPIReady;

    // The API will call this function when page has finished downloading
    // the JavaScript for the player API.
    window.onYouTubeIframeAPIReady = function () {
      if (previous) {
        previous();
      }

      resolve(window.YT);
    };
  });

  return iframeAPIReady;
};

module.exports = exports['default'];

/***/ }),

/***/ 93258:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* binding */ lib_axios)
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/bind.js


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/utils.js




// utils is a library of generic helper functions non-specific to axios

const {toString: utils_toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = utils_toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const utils_hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
}

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0]
  }

  return str;
}

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

/* harmony default export */ const utils = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty: utils_hasOwnProperty,
  hasOwnProp: utils_hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/AxiosError.js




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const AxiosError_prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(AxiosError_prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(AxiosError_prototype);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ const core_AxiosError = (AxiosError);

// EXTERNAL MODULE: ./node_modules/form-data/lib/form_data.js
var form_data = __webpack_require__(20054);
;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/node/classes/FormData.js


/* harmony default export */ const classes_FormData = (form_data);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/toFormData.js




// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored


/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (classes_FormData || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);

  if (!utils.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils.isBlob(value)) {
      throw new core_AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils.isArray(value) && isFlatArray(value)) ||
        ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils.forEach(value, function each(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ const helpers_toFormData = (toFormData);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/AxiosURLSearchParams.js




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && helpers_toFormData(params, this, options);
}

const AxiosURLSearchParams_prototype = AxiosURLSearchParams.prototype;

AxiosURLSearchParams_prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

AxiosURLSearchParams_prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ const helpers_AxiosURLSearchParams = (AxiosURLSearchParams);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/buildURL.js





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function buildURL_encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || buildURL_encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ?
      params.toString() :
      new helpers_AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/InterceptorManager.js




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ const core_InterceptorManager = (InterceptorManager);

;// CONCATENATED MODULE: ./node_modules/axios/lib/defaults/transitional.js


/* harmony default export */ const defaults_transitional = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});

// EXTERNAL MODULE: external "url"
var external_url_ = __webpack_require__(57310);
;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/node/classes/URLSearchParams.js



/* harmony default export */ const URLSearchParams = (external_url_.URLSearchParams);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/node/index.js



/* harmony default export */ const node = ({
  isNode: true,
  classes: {
    URLSearchParams: URLSearchParams,
    FormData: classes_FormData,
    Blob: typeof Blob !== 'undefined' && Blob || null
  },
  protocols: [ 'http', 'https', 'file', 'data' ]
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/toURLEncodedForm.js






function toURLEncodedForm(data, options) {
  return helpers_toFormData(data, new node.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (node.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/formDataToJSON.js




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};

    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ const helpers_formDataToJSON = (formDataToJSON);

;// CONCATENATED MODULE: ./node_modules/axios/lib/defaults/index.js










/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: defaults_transitional,

  adapter: node.isNode ? 'http' : 'xhr',

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils.isObject(data);

    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils.isFormData(data);

    if (isFormData) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(helpers_formDataToJSON(data)) : data;
    }

    if (utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return helpers_toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw core_AxiosError.from(e, core_AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: node.classes.FormData,
    Blob: node.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

/* harmony default export */ const lib_defaults = (defaults);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/parseHeaders.js




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ const parseHeaders = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/AxiosHeaders.js





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils.isString(value)) return;

  if (utils.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils.freezeMethods(AxiosHeaders);

/* harmony default export */ const core_AxiosHeaders = (AxiosHeaders);

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/transformData.js






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || lib_defaults;
  const context = response || config;
  const headers = core_AxiosHeaders.from(context.headers);
  let data = context.data;

  utils.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/isCancel.js


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/CanceledError.js





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  core_AxiosError.call(this, message == null ? 'canceled' : message, core_AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, core_AxiosError, {
  __CANCEL__: true
});

/* harmony default export */ const cancel_CanceledError = (CanceledError);

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/settle.js




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new core_AxiosError(
      'Request failed with status code ' + response.status,
      [core_AxiosError.ERR_BAD_REQUEST, core_AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isAbsoluteURL.js


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/combineURLs.js


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/buildFullPath.js





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

// EXTERNAL MODULE: ./node_modules/proxy-from-env/index.js
var proxy_from_env = __webpack_require__(5670);
// EXTERNAL MODULE: external "http"
var external_http_ = __webpack_require__(13685);
// EXTERNAL MODULE: external "https"
var external_https_ = __webpack_require__(95687);
// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(73837);
// EXTERNAL MODULE: ./node_modules/follow-redirects/index.js
var follow_redirects = __webpack_require__(71794);
// EXTERNAL MODULE: external "zlib"
var external_zlib_ = __webpack_require__(59796);
;// CONCATENATED MODULE: ./node_modules/axios/lib/env/data.js
const VERSION = "1.5.0";
;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/parseProtocol.js


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/fromDataURI.js






const DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;

/**
 * Parse data uri to a Buffer or Blob
 *
 * @param {String} uri
 * @param {?Boolean} asBlob
 * @param {?Object} options
 * @param {?Function} options.Blob
 *
 * @returns {Buffer|Blob}
 */
function fromDataURI(uri, asBlob, options) {
  const _Blob = options && options.Blob || node.classes.Blob;
  const protocol = parseProtocol(uri);

  if (asBlob === undefined && _Blob) {
    asBlob = true;
  }

  if (protocol === 'data') {
    uri = protocol.length ? uri.slice(protocol.length + 1) : uri;

    const match = DATA_URL_PATTERN.exec(uri);

    if (!match) {
      throw new core_AxiosError('Invalid URL', core_AxiosError.ERR_INVALID_URL);
    }

    const mime = match[1];
    const isBase64 = match[2];
    const body = match[3];
    const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? 'base64' : 'utf8');

    if (asBlob) {
      if (!_Blob) {
        throw new core_AxiosError('Blob is not supported', core_AxiosError.ERR_NOT_SUPPORT);
      }

      return new _Blob([buffer], {type: mime});
    }

    return buffer;
  }

  throw new core_AxiosError('Unsupported protocol ' + protocol, core_AxiosError.ERR_NOT_SUPPORT);
}

// EXTERNAL MODULE: external "stream"
var external_stream_ = __webpack_require__(12781);
;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/throttle.js


/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  const threshold = 1000 / freq;
  let timer = null;
  return function throttled(force, args) {
    const now = Date.now();
    if (force || now - timestamp > threshold) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timestamp = now;
      return fn.apply(null, args);
    }
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        timestamp = Date.now();
        return fn.apply(null, args);
      }, threshold - (now - timestamp));
    }
  };
}

/* harmony default export */ const helpers_throttle = (throttle);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/speedometer.js


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ const helpers_speedometer = (speedometer);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/AxiosTransformStream.js







const kInternals = Symbol('internals');

class AxiosTransformStream extends external_stream_.Transform{
  constructor(options) {
    options = utils.toFlatObject(options, {
      maxRate: 0,
      chunkSize: 64 * 1024,
      minChunkSize: 100,
      timeWindow: 500,
      ticksRate: 2,
      samplesCount: 15
    }, null, (prop, source) => {
      return !utils.isUndefined(source[prop]);
    });

    super({
      readableHighWaterMark: options.chunkSize
    });

    const self = this;

    const internals = this[kInternals] = {
      length: options.length,
      timeWindow: options.timeWindow,
      ticksRate: options.ticksRate,
      chunkSize: options.chunkSize,
      maxRate: options.maxRate,
      minChunkSize: options.minChunkSize,
      bytesSeen: 0,
      isCaptured: false,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };

    const _speedometer = helpers_speedometer(internals.ticksRate * options.samplesCount, internals.timeWindow);

    this.on('newListener', event => {
      if (event === 'progress') {
        if (!internals.isCaptured) {
          internals.isCaptured = true;
        }
      }
    });

    let bytesNotified = 0;

    internals.updateProgress = helpers_throttle(function throttledHandler() {
      const totalBytes = internals.length;
      const bytesTransferred = internals.bytesSeen;
      const progressBytes = bytesTransferred - bytesNotified;
      if (!progressBytes || self.destroyed) return;

      const rate = _speedometer(progressBytes);

      bytesNotified = bytesTransferred;

      process.nextTick(() => {
        self.emit('progress', {
          'loaded': bytesTransferred,
          'total': totalBytes,
          'progress': totalBytes ? (bytesTransferred / totalBytes) : undefined,
          'bytes': progressBytes,
          'rate': rate ? rate : undefined,
          'estimated': rate && totalBytes && bytesTransferred <= totalBytes ?
            (totalBytes - bytesTransferred) / rate : undefined
        });
      });
    }, internals.ticksRate);

    const onFinish = () => {
      internals.updateProgress(true);
    };

    this.once('end', onFinish);
    this.once('error', onFinish);
  }

  _read(size) {
    const internals = this[kInternals];

    if (internals.onReadCallback) {
      internals.onReadCallback();
    }

    return super._read(size);
  }

  _transform(chunk, encoding, callback) {
    const self = this;
    const internals = this[kInternals];
    const maxRate = internals.maxRate;

    const readableHighWaterMark = this.readableHighWaterMark;

    const timeWindow = internals.timeWindow;

    const divider = 1000 / timeWindow;
    const bytesThreshold = (maxRate / divider);
    const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;

    function pushChunk(_chunk, _callback) {
      const bytes = Buffer.byteLength(_chunk);
      internals.bytesSeen += bytes;
      internals.bytes += bytes;

      if (internals.isCaptured) {
        internals.updateProgress();
      }

      if (self.push(_chunk)) {
        process.nextTick(_callback);
      } else {
        internals.onReadCallback = () => {
          internals.onReadCallback = null;
          process.nextTick(_callback);
        };
      }
    }

    const transformChunk = (_chunk, _callback) => {
      const chunkSize = Buffer.byteLength(_chunk);
      let chunkRemainder = null;
      let maxChunkSize = readableHighWaterMark;
      let bytesLeft;
      let passed = 0;

      if (maxRate) {
        const now = Date.now();

        if (!internals.ts || (passed = (now - internals.ts)) >= timeWindow) {
          internals.ts = now;
          bytesLeft = bytesThreshold - internals.bytes;
          internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
          passed = 0;
        }

        bytesLeft = bytesThreshold - internals.bytes;
      }

      if (maxRate) {
        if (bytesLeft <= 0) {
          // next time window
          return setTimeout(() => {
            _callback(null, _chunk);
          }, timeWindow - passed);
        }

        if (bytesLeft < maxChunkSize) {
          maxChunkSize = bytesLeft;
        }
      }

      if (maxChunkSize && chunkSize > maxChunkSize && (chunkSize - maxChunkSize) > minChunkSize) {
        chunkRemainder = _chunk.subarray(maxChunkSize);
        _chunk = _chunk.subarray(0, maxChunkSize);
      }

      pushChunk(_chunk, chunkRemainder ? () => {
        process.nextTick(_callback, null, chunkRemainder);
      } : _callback);
    };

    transformChunk(chunk, function transformNextChunk(err, _chunk) {
      if (err) {
        return callback(err);
      }

      if (_chunk) {
        transformChunk(_chunk, transformNextChunk);
      } else {
        callback(null);
      }
    });
  }

  setLength(length) {
    this[kInternals].length = +length;
    return this;
  }
}

/* harmony default export */ const helpers_AxiosTransformStream = (AxiosTransformStream);

// EXTERNAL MODULE: external "events"
var external_events_ = __webpack_require__(82361);
;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/readBlob.js
const {asyncIterator} = Symbol;

const readBlob = async function* (blob) {
  if (blob.stream) {
    yield* blob.stream()
  } else if (blob.arrayBuffer) {
    yield await blob.arrayBuffer()
  } else if (blob[asyncIterator]) {
    yield* blob[asyncIterator]();
  } else {
    yield blob;
  }
}

/* harmony default export */ const helpers_readBlob = (readBlob);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/formDataToStream.js





const BOUNDARY_ALPHABET = utils.ALPHABET.ALPHA_DIGIT + '-_';

const textEncoder = new external_util_.TextEncoder();

const CRLF = '\r\n';
const CRLF_BYTES = textEncoder.encode(CRLF);
const CRLF_BYTES_COUNT = 2;

class FormDataPart {
  constructor(name, value) {
    const {escapeName} = this.constructor;
    const isStringValue = utils.isString(value);

    let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${
      !isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ''
    }${CRLF}`;

    if (isStringValue) {
      value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
    } else {
      headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`
    }

    this.headers = textEncoder.encode(headers + CRLF);

    this.contentLength = isStringValue ? value.byteLength : value.size;

    this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;

    this.name = name;
    this.value = value;
  }

  async *encode(){
    yield this.headers;

    const {value} = this;

    if(utils.isTypedArray(value)) {
      yield value;
    } else {
      yield* helpers_readBlob(value);
    }

    yield CRLF_BYTES;
  }

  static escapeName(name) {
      return String(name).replace(/[\r\n"]/g, (match) => ({
        '\r' : '%0D',
        '\n' : '%0A',
        '"' : '%22',
      }[match]));
  }
}

const formDataToStream = (form, headersHandler, options) => {
  const {
    tag = 'form-data-boundary',
    size = 25,
    boundary = tag + '-' + utils.generateString(size, BOUNDARY_ALPHABET)
  } = options || {};

  if(!utils.isFormData(form)) {
    throw TypeError('FormData instance required');
  }

  if (boundary.length < 1 || boundary.length > 70) {
    throw Error('boundary must be 10-70 characters long')
  }

  const boundaryBytes = textEncoder.encode('--' + boundary + CRLF);
  const footerBytes = textEncoder.encode('--' + boundary + '--' + CRLF + CRLF);
  let contentLength = footerBytes.byteLength;

  const parts = Array.from(form.entries()).map(([name, value]) => {
    const part = new FormDataPart(name, value);
    contentLength += part.size;
    return part;
  });

  contentLength += boundaryBytes.byteLength * parts.length;

  contentLength = utils.toFiniteNumber(contentLength);

  const computedHeaders = {
    'Content-Type': `multipart/form-data; boundary=${boundary}`
  }

  if (Number.isFinite(contentLength)) {
    computedHeaders['Content-Length'] = contentLength;
  }

  headersHandler && headersHandler(computedHeaders);

  return external_stream_.Readable.from((async function *() {
    for(const part of parts) {
      yield boundaryBytes;
      yield* part.encode();
    }

    yield footerBytes;
  })());
};

/* harmony default export */ const helpers_formDataToStream = (formDataToStream);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/ZlibHeaderTransformStream.js




class ZlibHeaderTransformStream extends external_stream_.Transform {
  __transform(chunk, encoding, callback) {
    this.push(chunk);
    callback();
  }

  _transform(chunk, encoding, callback) {
    if (chunk.length !== 0) {
      this._transform = this.__transform;

      // Add Default Compression headers if no zlib headers are present
      if (chunk[0] !== 120) { // Hex: 78
        const header = Buffer.alloc(2);
        header[0] = 120; // Hex: 78
        header[1] = 156; // Hex: 9C 
        this.push(header, encoding);
      }
    }

    this.__transform(chunk, encoding, callback);
  }
}

/* harmony default export */ const helpers_ZlibHeaderTransformStream = (ZlibHeaderTransformStream);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/callbackify.js


const callbackify = (fn, reducer) => {
  return utils.isAsyncFn(fn) ? function (...args) {
    const cb = args.pop();
    fn.apply(this, args).then((value) => {
      try {
        reducer ? cb(null, ...reducer(value)) : cb(null, value);
      } catch (err) {
        cb(err);
      }
    }, cb);
  } : fn;
}

/* harmony default export */ const helpers_callbackify = (callbackify);

;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/http.js



























const zlibOptions = {
  flush: external_zlib_.constants.Z_SYNC_FLUSH,
  finishFlush: external_zlib_.constants.Z_SYNC_FLUSH
};

const brotliOptions = {
  flush: external_zlib_.constants.BROTLI_OPERATION_FLUSH,
  finishFlush: external_zlib_.constants.BROTLI_OPERATION_FLUSH
}

const isBrotliSupported = utils.isFunction(external_zlib_.createBrotliDecompress);

const {http: httpFollow, https: httpsFollow} = follow_redirects;

const isHttps = /https:?/;

const supportedProtocols = node.protocols.map(protocol => {
  return protocol + ':';
});

/**
 * If the proxy or config beforeRedirects functions are defined, call them with the options
 * object.
 *
 * @param {Object<string, any>} options - The options object that was passed to the request.
 *
 * @returns {Object<string, any>}
 */
function dispatchBeforeRedirect(options) {
  if (options.beforeRedirects.proxy) {
    options.beforeRedirects.proxy(options);
  }
  if (options.beforeRedirects.config) {
    options.beforeRedirects.config(options);
  }
}

/**
 * If the proxy or config afterRedirects functions are defined, call them with the options
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} configProxy configuration from Axios options object
 * @param {string} location
 *
 * @returns {http.ClientRequestArgs}
 */
function setProxy(options, configProxy, location) {
  let proxy = configProxy;
  if (!proxy && proxy !== false) {
    const proxyUrl = (0,proxy_from_env/* getProxyForUrl */.j)(location);
    if (proxyUrl) {
      proxy = new URL(proxyUrl);
    }
  }
  if (proxy) {
    // Basic proxy authorization
    if (proxy.username) {
      proxy.auth = (proxy.username || '') + ':' + (proxy.password || '');
    }

    if (proxy.auth) {
      // Support proxy auth object form
      if (proxy.auth.username || proxy.auth.password) {
        proxy.auth = (proxy.auth.username || '') + ':' + (proxy.auth.password || '');
      }
      const base64 = Buffer
        .from(proxy.auth, 'utf8')
        .toString('base64');
      options.headers['Proxy-Authorization'] = 'Basic ' + base64;
    }

    options.headers.host = options.hostname + (options.port ? ':' + options.port : '');
    const proxyHost = proxy.hostname || proxy.host;
    options.hostname = proxyHost;
    // Replace 'host' since options is not a URL object
    options.host = proxyHost;
    options.port = proxy.port;
    options.path = location;
    if (proxy.protocol) {
      options.protocol = proxy.protocol.includes(':') ? proxy.protocol : `${proxy.protocol}:`;
    }
  }

  options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
    // Configure proxy for redirected request, passing the original config proxy to apply
    // the exact same logic as if the redirected request was performed by axios directly.
    setProxy(redirectOptions, configProxy, redirectOptions.href);
  };
}

const isHttpAdapterSupported = typeof process !== 'undefined' && utils.kindOf(process) === 'process';

// temporary hotfix

const wrapAsync = (asyncExecutor) => {
  return new Promise((resolve, reject) => {
    let onDone;
    let isDone;

    const done = (value, isRejected) => {
      if (isDone) return;
      isDone = true;
      onDone && onDone(value, isRejected);
    }

    const _resolve = (value) => {
      done(value);
      resolve(value);
    };

    const _reject = (reason) => {
      done(reason, true);
      reject(reason);
    }

    asyncExecutor(_resolve, _reject, (onDoneHandler) => (onDone = onDoneHandler)).catch(_reject);
  })
};

/*eslint consistent-return:0*/
/* harmony default export */ const http = (isHttpAdapterSupported && function httpAdapter(config) {
  return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
    let {data, lookup, family} = config;
    const {responseType, responseEncoding} = config;
    const method = config.method.toUpperCase();
    let isDone;
    let rejected = false;
    let req;

    if (lookup && utils.isAsyncFn(lookup)) {
      lookup = helpers_callbackify(lookup, (entry) => {
        if(utils.isString(entry)) {
          entry = [entry, entry.indexOf('.') < 0 ? 6 : 4]
        } else if (!utils.isArray(entry)) {
          throw new TypeError('lookup async function must return an array [ip: string, family: number]]')
        }
        return entry;
      })
    }

    // temporary internal emitter until the AxiosRequest class will be implemented
    const emitter = new external_events_();

    const onFinished = () => {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(abort);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', abort);
      }

      emitter.removeAllListeners();
    }

    onDone((value, isRejected) => {
      isDone = true;
      if (isRejected) {
        rejected = true;
        onFinished();
      }
    });

    function abort(reason) {
      emitter.emit('abort', !reason || reason.type ? new cancel_CanceledError(null, config, req) : reason);
    }

    emitter.once('abort', reject);

    if (config.cancelToken || config.signal) {
      config.cancelToken && config.cancelToken.subscribe(abort);
      if (config.signal) {
        config.signal.aborted ? abort() : config.signal.addEventListener('abort', abort);
      }
    }

    // Parse url
    const fullPath = buildFullPath(config.baseURL, config.url);
    const parsed = new URL(fullPath, 'http://localhost');
    const protocol = parsed.protocol || supportedProtocols[0];

    if (protocol === 'data:') {
      let convertedData;

      if (method !== 'GET') {
        return settle(resolve, reject, {
          status: 405,
          statusText: 'method not allowed',
          headers: {},
          config
        });
      }

      try {
        convertedData = fromDataURI(config.url, responseType === 'blob', {
          Blob: config.env && config.env.Blob
        });
      } catch (err) {
        throw core_AxiosError.from(err, core_AxiosError.ERR_BAD_REQUEST, config);
      }

      if (responseType === 'text') {
        convertedData = convertedData.toString(responseEncoding);

        if (!responseEncoding || responseEncoding === 'utf8') {
          convertedData = utils.stripBOM(convertedData);
        }
      } else if (responseType === 'stream') {
        convertedData = external_stream_.Readable.from(convertedData);
      }

      return settle(resolve, reject, {
        data: convertedData,
        status: 200,
        statusText: 'OK',
        headers: new core_AxiosHeaders(),
        config
      });
    }

    if (supportedProtocols.indexOf(protocol) === -1) {
      return reject(new core_AxiosError(
        'Unsupported protocol ' + protocol,
        core_AxiosError.ERR_BAD_REQUEST,
        config
      ));
    }

    const headers = core_AxiosHeaders.from(config.headers).normalize();

    // Set User-Agent (required by some servers)
    // See https://github.com/axios/axios/issues/69
    // User-Agent is specified; handle case where no UA header is desired
    // Only set header if it hasn't been set in config
    headers.set('User-Agent', 'axios/' + VERSION, false);

    const onDownloadProgress = config.onDownloadProgress;
    const onUploadProgress = config.onUploadProgress;
    const maxRate = config.maxRate;
    let maxUploadRate = undefined;
    let maxDownloadRate = undefined;

    // support for spec compliant FormData objects
    if (utils.isSpecCompliantForm(data)) {
      const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);

      data = helpers_formDataToStream(data, (formHeaders) => {
        headers.set(formHeaders);
      }, {
        tag: `axios-${VERSION}-boundary`,
        boundary: userBoundary && userBoundary[1] || undefined
      });
      // support for https://www.npmjs.com/package/form-data api
    } else if (utils.isFormData(data) && utils.isFunction(data.getHeaders)) {
      headers.set(data.getHeaders());

      if (!headers.hasContentLength()) {
        try {
          const knownLength = await external_util_.promisify(data.getLength).call(data);
          Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
          /*eslint no-empty:0*/
        } catch (e) {
        }
      }
    } else if (utils.isBlob(data)) {
      data.size && headers.setContentType(data.type || 'application/octet-stream');
      headers.setContentLength(data.size || 0);
      data = external_stream_.Readable.from(helpers_readBlob(data));
    } else if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(new core_AxiosError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          core_AxiosError.ERR_BAD_REQUEST,
          config
        ));
      }

      // Add Content-Length header if data exists
      headers.setContentLength(data.length, false);

      if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
        return reject(new core_AxiosError(
          'Request body larger than maxBodyLength limit',
          core_AxiosError.ERR_BAD_REQUEST,
          config
        ));
      }
    }

    const contentLength = utils.toFiniteNumber(headers.getContentLength());

    if (utils.isArray(maxRate)) {
      maxUploadRate = maxRate[0];
      maxDownloadRate = maxRate[1];
    } else {
      maxUploadRate = maxDownloadRate = maxRate;
    }

    if (data && (onUploadProgress || maxUploadRate)) {
      if (!utils.isStream(data)) {
        data = external_stream_.Readable.from(data, {objectMode: false});
      }

      data = external_stream_.pipeline([data, new helpers_AxiosTransformStream({
        length: contentLength,
        maxRate: utils.toFiniteNumber(maxUploadRate)
      })], utils.noop);

      onUploadProgress && data.on('progress', progress => {
        onUploadProgress(Object.assign(progress, {
          upload: true
        }));
      });
    }

    // HTTP basic authentication
    let auth = undefined;
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password || '';
      auth = username + ':' + password;
    }

    if (!auth && parsed.username) {
      const urlUsername = parsed.username;
      const urlPassword = parsed.password;
      auth = urlUsername + ':' + urlPassword;
    }

    auth && headers.delete('authorization');

    let path;

    try {
      path = buildURL(
        parsed.pathname + parsed.search,
        config.params,
        config.paramsSerializer
      ).replace(/^\?/, '');
    } catch (err) {
      const customErr = new Error(err.message);
      customErr.config = config;
      customErr.url = config.url;
      customErr.exists = true;
      return reject(customErr);
    }

    headers.set(
      'Accept-Encoding',
      'gzip, compress, deflate' + (isBrotliSupported ? ', br' : ''), false
      );

    const options = {
      path,
      method: method,
      headers: headers.toJSON(),
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth,
      protocol,
      family,
      beforeRedirect: dispatchBeforeRedirect,
      beforeRedirects: {}
    };

    // cacheable-lookup integration hotfix
    !utils.isUndefined(lookup) && (options.lookup = lookup);

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
      setProxy(options, config.proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    let transport;
    const isHttpsRequest = isHttps.test(options.protocol);
    options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsRequest ? external_https_ : external_http_;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      if (config.beforeRedirect) {
        options.beforeRedirects.config = config.beforeRedirect;
      }
      transport = isHttpsRequest ? httpsFollow : httpFollow;
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    } else {
      // follow-redirects does not skip comparison, so it should always succeed for axios -1 unlimited
      options.maxBodyLength = Infinity;
    }

    if (config.insecureHTTPParser) {
      options.insecureHTTPParser = config.insecureHTTPParser;
    }

    // Create the request
    req = transport.request(options, function handleResponse(res) {
      if (req.destroyed) return;

      const streams = [res];

      const responseLength = +res.headers['content-length'];

      if (onDownloadProgress) {
        const transformStream = new helpers_AxiosTransformStream({
          length: utils.toFiniteNumber(responseLength),
          maxRate: utils.toFiniteNumber(maxDownloadRate)
        });

        onDownloadProgress && transformStream.on('progress', progress => {
          onDownloadProgress(Object.assign(progress, {
            download: true
          }));
        });

        streams.push(transformStream);
      }

      // decompress the response body transparently if required
      let responseStream = res;

      // return the last request in case of redirects
      const lastRequest = res.req || req;

      // if decompress disabled we should not decompress
      if (config.decompress !== false && res.headers['content-encoding']) {
        // if no content, but headers still say that it is encoded,
        // remove the header not confuse downstream operations
        if (method === 'HEAD' || res.statusCode === 204) {
          delete res.headers['content-encoding'];
        }

        switch (res.headers['content-encoding']) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'x-gzip':
        case 'compress':
        case 'x-compress':
          // add the unzipper to the body stream processing pipeline
          streams.push(external_zlib_.createUnzip(zlibOptions));

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        case 'deflate':
          streams.push(new helpers_ZlibHeaderTransformStream());

          // add the unzipper to the body stream processing pipeline
          streams.push(external_zlib_.createUnzip(zlibOptions));

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        case 'br':
          if (isBrotliSupported) {
            streams.push(external_zlib_.createBrotliDecompress(brotliOptions));
            delete res.headers['content-encoding'];
          }
        }
      }

      responseStream = streams.length > 1 ? external_stream_.pipeline(streams, utils.noop) : streams[0];

      const offListeners = external_stream_.finished(responseStream, () => {
        offListeners();
        onFinished();
      });

      const response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: new core_AxiosHeaders(res.headers),
        config,
        request: lastRequest
      };

      if (responseType === 'stream') {
        response.data = responseStream;
        settle(resolve, reject, response);
      } else {
        const responseBuffer = [];
        let totalResponseBytes = 0;

        responseStream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
            // stream.destroy() emit aborted event before calling reject() on Node.js v16
            rejected = true;
            responseStream.destroy();
            reject(new core_AxiosError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              core_AxiosError.ERR_BAD_RESPONSE, config, lastRequest));
          }
        });

        responseStream.on('aborted', function handlerStreamAborted() {
          if (rejected) {
            return;
          }

          const err = new core_AxiosError(
            'maxContentLength size of ' + config.maxContentLength + ' exceeded',
            core_AxiosError.ERR_BAD_RESPONSE,
            config,
            lastRequest
          );
          responseStream.destroy(err);
          reject(err);
        });

        responseStream.on('error', function handleStreamError(err) {
          if (req.destroyed) return;
          reject(core_AxiosError.from(err, null, config, lastRequest));
        });

        responseStream.on('end', function handleStreamEnd() {
          try {
            let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
            if (responseType !== 'arraybuffer') {
              responseData = responseData.toString(responseEncoding);
              if (!responseEncoding || responseEncoding === 'utf8') {
                responseData = utils.stripBOM(responseData);
              }
            }
            response.data = responseData;
          } catch (err) {
            reject(core_AxiosError.from(err, null, config, response.request, response));
          }
          settle(resolve, reject, response);
        });
      }

      emitter.once('abort', err => {
        if (!responseStream.destroyed) {
          responseStream.emit('error', err);
          responseStream.destroy();
        }
      });
    });

    emitter.once('abort', err => {
      reject(err);
      req.destroy(err);
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      // @todo remove
      // if (req.aborted && err.code !== AxiosError.ERR_FR_TOO_MANY_REDIRECTS) return;
      reject(core_AxiosError.from(err, null, config, req));
    });

    // set tcp keep alive to prevent drop connection by peer
    req.on('socket', function handleRequestSocket(socket) {
      // default interval of sending ack packet is 1 minute
      socket.setKeepAlive(true, 1000 * 60);
    });

    // Handle request timeout
    if (config.timeout) {
      // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
      const timeout = parseInt(config.timeout, 10);

      if (isNaN(timeout)) {
        reject(new core_AxiosError(
          'error trying to parse `config.timeout` to int',
          core_AxiosError.ERR_BAD_OPTION_VALUE,
          config,
          req
        ));

        return;
      }

      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devouring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(timeout, function handleRequestTimeout() {
        if (isDone) return;
        let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
        const transitional = config.transitional || defaults_transitional;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(new core_AxiosError(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? core_AxiosError.ETIMEDOUT : core_AxiosError.ECONNABORTED,
          config,
          req
        ));
        abort();
      });
    }


    // Send the request
    if (utils.isStream(data)) {
      let ended = false;
      let errored = false;

      data.on('end', () => {
        ended = true;
      });

      data.once('error', err => {
        errored = true;
        req.destroy(err);
      });

      data.on('close', () => {
        if (!ended && !errored) {
          abort(new cancel_CanceledError('Request stream has been aborted', config, req));
        }
      });

      data.pipe(req);
    } else {
      req.end(data);
    }
  });
});

const __setProxy = (/* unused pure expression or super */ null && (setProxy));

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/cookies.js





/* harmony default export */ const cookies = (node.isStandardBrowserEnv ?

// Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

// Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })());

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isURLSameOrigin.js





/* harmony default export */ const isURLSameOrigin = (node.isStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })());

;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/xhr.js
















function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = helpers_speedometer(50, 250);

  return e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  };
}

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ const xhr = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = core_AxiosHeaders.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      if (node.isStandardBrowserEnv || node.isStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false); // Let the browser set it
      } else {
        requestHeaders.setContentType('multipart/form-data;', false); // mobile/desktop app frameworks
      }
    }

    let request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    }

    const fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = core_AxiosHeaders.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new core_AxiosError('Request aborted', core_AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new core_AxiosError('Network Error', core_AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = config.transitional || defaults_transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new core_AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? core_AxiosError.ETIMEDOUT : core_AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (node.isStandardBrowserEnv) {
      // Add xsrf header
      const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
        && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new cancel_CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(fullPath);

    if (protocol && node.protocols.indexOf(protocol) === -1) {
      reject(new core_AxiosError('Unsupported protocol ' + protocol + ':', core_AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/adapters.js





const knownAdapters = {
  http: http,
  xhr: xhr
}

utils.forEach(knownAdapters, (fn, value) => {
  if(fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

/* harmony default export */ const adapters = ({
  getAdapter: (adapters) => {
    adapters = utils.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      if((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
        break;
      }
    }

    if (!adapter) {
      if (adapter === false) {
        throw new core_AxiosError(
          `Adapter ${nameOrAdapter} is not supported by the environment`,
          'ERR_NOT_SUPPORT'
        );
      }

      throw new Error(
        utils.hasOwnProp(knownAdapters, nameOrAdapter) ?
          `Adapter '${nameOrAdapter}' is not available in the build` :
          `Unknown adapter '${nameOrAdapter}'`
      );
    }

    if (!utils.isFunction(adapter)) {
      throw new TypeError('adapter is not a function');
    }

    return adapter;
  },
  adapters: knownAdapters
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/dispatchRequest.js









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new cancel_CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = core_AxiosHeaders.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || lib_defaults.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = core_AxiosHeaders.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = core_AxiosHeaders.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/mergeConfig.js





const headersToObject = (thing) => thing instanceof core_AxiosHeaders ? thing.toJSON() : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({caseless}, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/validator.js





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new core_AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        core_AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new core_AxiosError('options must be an object', core_AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new core_AxiosError('option ' + opt + ' must be ' + result, core_AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new core_AxiosError('Unknown option ' + opt, core_AxiosError.ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ const validator = ({
  assertOptions,
  validators
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/Axios.js











const Axios_validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new core_InterceptorManager(),
      response: new core_InterceptorManager()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: Axios_validators.transitional(Axios_validators.boolean),
        forcedJSONParsing: Axios_validators.transitional(Axios_validators.boolean),
        clarifyTimeoutError: Axios_validators.transitional(Axios_validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: Axios_validators.function,
          serialize: Axios_validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = core_AxiosHeaders.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ const core_Axios = (Axios);

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/CancelToken.js




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new cancel_CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ const cancel_CancelToken = (CancelToken);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/spread.js


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isAxiosError.js




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/HttpStatusCode.js
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ const helpers_HttpStatusCode = (HttpStatusCode);

;// CONCATENATED MODULE: ./node_modules/axios/lib/axios.js




















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new core_Axios(defaultConfig);
  const instance = bind(core_Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, core_Axios.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(lib_defaults);

// Expose Axios class to allow class inheritance
axios.Axios = core_Axios;

// Expose Cancel & CancelToken
axios.CanceledError = cancel_CanceledError;
axios.CancelToken = cancel_CancelToken;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = helpers_toFormData;

// Expose AxiosError class
axios.AxiosError = core_AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = core_AxiosHeaders;

axios.formToJSON = thing => helpers_formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = helpers_HttpStatusCode;

axios.default = axios;

// this module should only have a default export
/* harmony default export */ const lib_axios = (axios);


/***/ }),

/***/ 40572:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"application/1d-interleaved-parityfec":{"source":"iana"},"application/3gpdash-qoe-report+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/3gpp-ims+xml":{"source":"iana","compressible":true},"application/3gpphal+json":{"source":"iana","compressible":true},"application/3gpphalforms+json":{"source":"iana","compressible":true},"application/a2l":{"source":"iana"},"application/ace+cbor":{"source":"iana"},"application/activemessage":{"source":"iana"},"application/activity+json":{"source":"iana","compressible":true},"application/alto-costmap+json":{"source":"iana","compressible":true},"application/alto-costmapfilter+json":{"source":"iana","compressible":true},"application/alto-directory+json":{"source":"iana","compressible":true},"application/alto-endpointcost+json":{"source":"iana","compressible":true},"application/alto-endpointcostparams+json":{"source":"iana","compressible":true},"application/alto-endpointprop+json":{"source":"iana","compressible":true},"application/alto-endpointpropparams+json":{"source":"iana","compressible":true},"application/alto-error+json":{"source":"iana","compressible":true},"application/alto-networkmap+json":{"source":"iana","compressible":true},"application/alto-networkmapfilter+json":{"source":"iana","compressible":true},"application/alto-updatestreamcontrol+json":{"source":"iana","compressible":true},"application/alto-updatestreamparams+json":{"source":"iana","compressible":true},"application/aml":{"source":"iana"},"application/andrew-inset":{"source":"iana","extensions":["ez"]},"application/applefile":{"source":"iana"},"application/applixware":{"source":"apache","extensions":["aw"]},"application/at+jwt":{"source":"iana"},"application/atf":{"source":"iana"},"application/atfx":{"source":"iana"},"application/atom+xml":{"source":"iana","compressible":true,"extensions":["atom"]},"application/atomcat+xml":{"source":"iana","compressible":true,"extensions":["atomcat"]},"application/atomdeleted+xml":{"source":"iana","compressible":true,"extensions":["atomdeleted"]},"application/atomicmail":{"source":"iana"},"application/atomsvc+xml":{"source":"iana","compressible":true,"extensions":["atomsvc"]},"application/atsc-dwd+xml":{"source":"iana","compressible":true,"extensions":["dwd"]},"application/atsc-dynamic-event-message":{"source":"iana"},"application/atsc-held+xml":{"source":"iana","compressible":true,"extensions":["held"]},"application/atsc-rdt+json":{"source":"iana","compressible":true},"application/atsc-rsat+xml":{"source":"iana","compressible":true,"extensions":["rsat"]},"application/atxml":{"source":"iana"},"application/auth-policy+xml":{"source":"iana","compressible":true},"application/bacnet-xdd+zip":{"source":"iana","compressible":false},"application/batch-smtp":{"source":"iana"},"application/bdoc":{"compressible":false,"extensions":["bdoc"]},"application/beep+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/calendar+json":{"source":"iana","compressible":true},"application/calendar+xml":{"source":"iana","compressible":true,"extensions":["xcs"]},"application/call-completion":{"source":"iana"},"application/cals-1840":{"source":"iana"},"application/captive+json":{"source":"iana","compressible":true},"application/cbor":{"source":"iana"},"application/cbor-seq":{"source":"iana"},"application/cccex":{"source":"iana"},"application/ccmp+xml":{"source":"iana","compressible":true},"application/ccxml+xml":{"source":"iana","compressible":true,"extensions":["ccxml"]},"application/cdfx+xml":{"source":"iana","compressible":true,"extensions":["cdfx"]},"application/cdmi-capability":{"source":"iana","extensions":["cdmia"]},"application/cdmi-container":{"source":"iana","extensions":["cdmic"]},"application/cdmi-domain":{"source":"iana","extensions":["cdmid"]},"application/cdmi-object":{"source":"iana","extensions":["cdmio"]},"application/cdmi-queue":{"source":"iana","extensions":["cdmiq"]},"application/cdni":{"source":"iana"},"application/cea":{"source":"iana"},"application/cea-2018+xml":{"source":"iana","compressible":true},"application/cellml+xml":{"source":"iana","compressible":true},"application/cfw":{"source":"iana"},"application/city+json":{"source":"iana","compressible":true},"application/clr":{"source":"iana"},"application/clue+xml":{"source":"iana","compressible":true},"application/clue_info+xml":{"source":"iana","compressible":true},"application/cms":{"source":"iana"},"application/cnrp+xml":{"source":"iana","compressible":true},"application/coap-group+json":{"source":"iana","compressible":true},"application/coap-payload":{"source":"iana"},"application/commonground":{"source":"iana"},"application/conference-info+xml":{"source":"iana","compressible":true},"application/cose":{"source":"iana"},"application/cose-key":{"source":"iana"},"application/cose-key-set":{"source":"iana"},"application/cpl+xml":{"source":"iana","compressible":true,"extensions":["cpl"]},"application/csrattrs":{"source":"iana"},"application/csta+xml":{"source":"iana","compressible":true},"application/cstadata+xml":{"source":"iana","compressible":true},"application/csvm+json":{"source":"iana","compressible":true},"application/cu-seeme":{"source":"apache","extensions":["cu"]},"application/cwt":{"source":"iana"},"application/cybercash":{"source":"iana"},"application/dart":{"compressible":true},"application/dash+xml":{"source":"iana","compressible":true,"extensions":["mpd"]},"application/dash-patch+xml":{"source":"iana","compressible":true,"extensions":["mpp"]},"application/dashdelta":{"source":"iana"},"application/davmount+xml":{"source":"iana","compressible":true,"extensions":["davmount"]},"application/dca-rft":{"source":"iana"},"application/dcd":{"source":"iana"},"application/dec-dx":{"source":"iana"},"application/dialog-info+xml":{"source":"iana","compressible":true},"application/dicom":{"source":"iana"},"application/dicom+json":{"source":"iana","compressible":true},"application/dicom+xml":{"source":"iana","compressible":true},"application/dii":{"source":"iana"},"application/dit":{"source":"iana"},"application/dns":{"source":"iana"},"application/dns+json":{"source":"iana","compressible":true},"application/dns-message":{"source":"iana"},"application/docbook+xml":{"source":"apache","compressible":true,"extensions":["dbk"]},"application/dots+cbor":{"source":"iana"},"application/dskpp+xml":{"source":"iana","compressible":true},"application/dssc+der":{"source":"iana","extensions":["dssc"]},"application/dssc+xml":{"source":"iana","compressible":true,"extensions":["xdssc"]},"application/dvcs":{"source":"iana"},"application/ecmascript":{"source":"iana","compressible":true,"extensions":["es","ecma"]},"application/edi-consent":{"source":"iana"},"application/edi-x12":{"source":"iana","compressible":false},"application/edifact":{"source":"iana","compressible":false},"application/efi":{"source":"iana"},"application/elm+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/elm+xml":{"source":"iana","compressible":true},"application/emergencycalldata.cap+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/emergencycalldata.comment+xml":{"source":"iana","compressible":true},"application/emergencycalldata.control+xml":{"source":"iana","compressible":true},"application/emergencycalldata.deviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.ecall.msd":{"source":"iana"},"application/emergencycalldata.providerinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.serviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.subscriberinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.veds+xml":{"source":"iana","compressible":true},"application/emma+xml":{"source":"iana","compressible":true,"extensions":["emma"]},"application/emotionml+xml":{"source":"iana","compressible":true,"extensions":["emotionml"]},"application/encaprtp":{"source":"iana"},"application/epp+xml":{"source":"iana","compressible":true},"application/epub+zip":{"source":"iana","compressible":false,"extensions":["epub"]},"application/eshop":{"source":"iana"},"application/exi":{"source":"iana","extensions":["exi"]},"application/expect-ct-report+json":{"source":"iana","compressible":true},"application/express":{"source":"iana","extensions":["exp"]},"application/fastinfoset":{"source":"iana"},"application/fastsoap":{"source":"iana"},"application/fdt+xml":{"source":"iana","compressible":true,"extensions":["fdt"]},"application/fhir+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/fhir+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/fido.trusted-apps+json":{"compressible":true},"application/fits":{"source":"iana"},"application/flexfec":{"source":"iana"},"application/font-sfnt":{"source":"iana"},"application/font-tdpfr":{"source":"iana","extensions":["pfr"]},"application/font-woff":{"source":"iana","compressible":false},"application/framework-attributes+xml":{"source":"iana","compressible":true},"application/geo+json":{"source":"iana","compressible":true,"extensions":["geojson"]},"application/geo+json-seq":{"source":"iana"},"application/geopackage+sqlite3":{"source":"iana"},"application/geoxacml+xml":{"source":"iana","compressible":true},"application/gltf-buffer":{"source":"iana"},"application/gml+xml":{"source":"iana","compressible":true,"extensions":["gml"]},"application/gpx+xml":{"source":"apache","compressible":true,"extensions":["gpx"]},"application/gxf":{"source":"apache","extensions":["gxf"]},"application/gzip":{"source":"iana","compressible":false,"extensions":["gz"]},"application/h224":{"source":"iana"},"application/held+xml":{"source":"iana","compressible":true},"application/hjson":{"extensions":["hjson"]},"application/http":{"source":"iana"},"application/hyperstudio":{"source":"iana","extensions":["stk"]},"application/ibe-key-request+xml":{"source":"iana","compressible":true},"application/ibe-pkg-reply+xml":{"source":"iana","compressible":true},"application/ibe-pp-data":{"source":"iana"},"application/iges":{"source":"iana"},"application/im-iscomposing+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/index":{"source":"iana"},"application/index.cmd":{"source":"iana"},"application/index.obj":{"source":"iana"},"application/index.response":{"source":"iana"},"application/index.vnd":{"source":"iana"},"application/inkml+xml":{"source":"iana","compressible":true,"extensions":["ink","inkml"]},"application/iotp":{"source":"iana"},"application/ipfix":{"source":"iana","extensions":["ipfix"]},"application/ipp":{"source":"iana"},"application/isup":{"source":"iana"},"application/its+xml":{"source":"iana","compressible":true,"extensions":["its"]},"application/java-archive":{"source":"apache","compressible":false,"extensions":["jar","war","ear"]},"application/java-serialized-object":{"source":"apache","compressible":false,"extensions":["ser"]},"application/java-vm":{"source":"apache","compressible":false,"extensions":["class"]},"application/javascript":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js","mjs"]},"application/jf2feed+json":{"source":"iana","compressible":true},"application/jose":{"source":"iana"},"application/jose+json":{"source":"iana","compressible":true},"application/jrd+json":{"source":"iana","compressible":true},"application/jscalendar+json":{"source":"iana","compressible":true},"application/json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},"application/json-patch+json":{"source":"iana","compressible":true},"application/json-seq":{"source":"iana"},"application/json5":{"extensions":["json5"]},"application/jsonml+json":{"source":"apache","compressible":true,"extensions":["jsonml"]},"application/jwk+json":{"source":"iana","compressible":true},"application/jwk-set+json":{"source":"iana","compressible":true},"application/jwt":{"source":"iana"},"application/kpml-request+xml":{"source":"iana","compressible":true},"application/kpml-response+xml":{"source":"iana","compressible":true},"application/ld+json":{"source":"iana","compressible":true,"extensions":["jsonld"]},"application/lgr+xml":{"source":"iana","compressible":true,"extensions":["lgr"]},"application/link-format":{"source":"iana"},"application/load-control+xml":{"source":"iana","compressible":true},"application/lost+xml":{"source":"iana","compressible":true,"extensions":["lostxml"]},"application/lostsync+xml":{"source":"iana","compressible":true},"application/lpf+zip":{"source":"iana","compressible":false},"application/lxf":{"source":"iana"},"application/mac-binhex40":{"source":"iana","extensions":["hqx"]},"application/mac-compactpro":{"source":"apache","extensions":["cpt"]},"application/macwriteii":{"source":"iana"},"application/mads+xml":{"source":"iana","compressible":true,"extensions":["mads"]},"application/manifest+json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},"application/marc":{"source":"iana","extensions":["mrc"]},"application/marcxml+xml":{"source":"iana","compressible":true,"extensions":["mrcx"]},"application/mathematica":{"source":"iana","extensions":["ma","nb","mb"]},"application/mathml+xml":{"source":"iana","compressible":true,"extensions":["mathml"]},"application/mathml-content+xml":{"source":"iana","compressible":true},"application/mathml-presentation+xml":{"source":"iana","compressible":true},"application/mbms-associated-procedure-description+xml":{"source":"iana","compressible":true},"application/mbms-deregister+xml":{"source":"iana","compressible":true},"application/mbms-envelope+xml":{"source":"iana","compressible":true},"application/mbms-msk+xml":{"source":"iana","compressible":true},"application/mbms-msk-response+xml":{"source":"iana","compressible":true},"application/mbms-protection-description+xml":{"source":"iana","compressible":true},"application/mbms-reception-report+xml":{"source":"iana","compressible":true},"application/mbms-register+xml":{"source":"iana","compressible":true},"application/mbms-register-response+xml":{"source":"iana","compressible":true},"application/mbms-schedule+xml":{"source":"iana","compressible":true},"application/mbms-user-service-description+xml":{"source":"iana","compressible":true},"application/mbox":{"source":"iana","extensions":["mbox"]},"application/media-policy-dataset+xml":{"source":"iana","compressible":true,"extensions":["mpf"]},"application/media_control+xml":{"source":"iana","compressible":true},"application/mediaservercontrol+xml":{"source":"iana","compressible":true,"extensions":["mscml"]},"application/merge-patch+json":{"source":"iana","compressible":true},"application/metalink+xml":{"source":"apache","compressible":true,"extensions":["metalink"]},"application/metalink4+xml":{"source":"iana","compressible":true,"extensions":["meta4"]},"application/mets+xml":{"source":"iana","compressible":true,"extensions":["mets"]},"application/mf4":{"source":"iana"},"application/mikey":{"source":"iana"},"application/mipc":{"source":"iana"},"application/missing-blocks+cbor-seq":{"source":"iana"},"application/mmt-aei+xml":{"source":"iana","compressible":true,"extensions":["maei"]},"application/mmt-usd+xml":{"source":"iana","compressible":true,"extensions":["musd"]},"application/mods+xml":{"source":"iana","compressible":true,"extensions":["mods"]},"application/moss-keys":{"source":"iana"},"application/moss-signature":{"source":"iana"},"application/mosskey-data":{"source":"iana"},"application/mosskey-request":{"source":"iana"},"application/mp21":{"source":"iana","extensions":["m21","mp21"]},"application/mp4":{"source":"iana","extensions":["mp4s","m4p"]},"application/mpeg4-generic":{"source":"iana"},"application/mpeg4-iod":{"source":"iana"},"application/mpeg4-iod-xmt":{"source":"iana"},"application/mrb-consumer+xml":{"source":"iana","compressible":true},"application/mrb-publish+xml":{"source":"iana","compressible":true},"application/msc-ivr+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msc-mixer+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msword":{"source":"iana","compressible":false,"extensions":["doc","dot"]},"application/mud+json":{"source":"iana","compressible":true},"application/multipart-core":{"source":"iana"},"application/mxf":{"source":"iana","extensions":["mxf"]},"application/n-quads":{"source":"iana","extensions":["nq"]},"application/n-triples":{"source":"iana","extensions":["nt"]},"application/nasdata":{"source":"iana"},"application/news-checkgroups":{"source":"iana","charset":"US-ASCII"},"application/news-groupinfo":{"source":"iana","charset":"US-ASCII"},"application/news-transmission":{"source":"iana"},"application/nlsml+xml":{"source":"iana","compressible":true},"application/node":{"source":"iana","extensions":["cjs"]},"application/nss":{"source":"iana"},"application/oauth-authz-req+jwt":{"source":"iana"},"application/oblivious-dns-message":{"source":"iana"},"application/ocsp-request":{"source":"iana"},"application/ocsp-response":{"source":"iana"},"application/octet-stream":{"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},"application/oda":{"source":"iana","extensions":["oda"]},"application/odm+xml":{"source":"iana","compressible":true},"application/odx":{"source":"iana"},"application/oebps-package+xml":{"source":"iana","compressible":true,"extensions":["opf"]},"application/ogg":{"source":"iana","compressible":false,"extensions":["ogx"]},"application/omdoc+xml":{"source":"apache","compressible":true,"extensions":["omdoc"]},"application/onenote":{"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},"application/opc-nodeset+xml":{"source":"iana","compressible":true},"application/oscore":{"source":"iana"},"application/oxps":{"source":"iana","extensions":["oxps"]},"application/p21":{"source":"iana"},"application/p21+zip":{"source":"iana","compressible":false},"application/p2p-overlay+xml":{"source":"iana","compressible":true,"extensions":["relo"]},"application/parityfec":{"source":"iana"},"application/passport":{"source":"iana"},"application/patch-ops-error+xml":{"source":"iana","compressible":true,"extensions":["xer"]},"application/pdf":{"source":"iana","compressible":false,"extensions":["pdf"]},"application/pdx":{"source":"iana"},"application/pem-certificate-chain":{"source":"iana"},"application/pgp-encrypted":{"source":"iana","compressible":false,"extensions":["pgp"]},"application/pgp-keys":{"source":"iana","extensions":["asc"]},"application/pgp-signature":{"source":"iana","extensions":["asc","sig"]},"application/pics-rules":{"source":"apache","extensions":["prf"]},"application/pidf+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pidf-diff+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pkcs10":{"source":"iana","extensions":["p10"]},"application/pkcs12":{"source":"iana"},"application/pkcs7-mime":{"source":"iana","extensions":["p7m","p7c"]},"application/pkcs7-signature":{"source":"iana","extensions":["p7s"]},"application/pkcs8":{"source":"iana","extensions":["p8"]},"application/pkcs8-encrypted":{"source":"iana"},"application/pkix-attr-cert":{"source":"iana","extensions":["ac"]},"application/pkix-cert":{"source":"iana","extensions":["cer"]},"application/pkix-crl":{"source":"iana","extensions":["crl"]},"application/pkix-pkipath":{"source":"iana","extensions":["pkipath"]},"application/pkixcmp":{"source":"iana","extensions":["pki"]},"application/pls+xml":{"source":"iana","compressible":true,"extensions":["pls"]},"application/poc-settings+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/postscript":{"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},"application/ppsp-tracker+json":{"source":"iana","compressible":true},"application/problem+json":{"source":"iana","compressible":true},"application/problem+xml":{"source":"iana","compressible":true},"application/provenance+xml":{"source":"iana","compressible":true,"extensions":["provx"]},"application/prs.alvestrand.titrax-sheet":{"source":"iana"},"application/prs.cww":{"source":"iana","extensions":["cww"]},"application/prs.cyn":{"source":"iana","charset":"7-BIT"},"application/prs.hpub+zip":{"source":"iana","compressible":false},"application/prs.nprend":{"source":"iana"},"application/prs.plucker":{"source":"iana"},"application/prs.rdf-xml-crypt":{"source":"iana"},"application/prs.xsf+xml":{"source":"iana","compressible":true},"application/pskc+xml":{"source":"iana","compressible":true,"extensions":["pskcxml"]},"application/pvd+json":{"source":"iana","compressible":true},"application/qsig":{"source":"iana"},"application/raml+yaml":{"compressible":true,"extensions":["raml"]},"application/raptorfec":{"source":"iana"},"application/rdap+json":{"source":"iana","compressible":true},"application/rdf+xml":{"source":"iana","compressible":true,"extensions":["rdf","owl"]},"application/reginfo+xml":{"source":"iana","compressible":true,"extensions":["rif"]},"application/relax-ng-compact-syntax":{"source":"iana","extensions":["rnc"]},"application/remote-printing":{"source":"iana"},"application/reputon+json":{"source":"iana","compressible":true},"application/resource-lists+xml":{"source":"iana","compressible":true,"extensions":["rl"]},"application/resource-lists-diff+xml":{"source":"iana","compressible":true,"extensions":["rld"]},"application/rfc+xml":{"source":"iana","compressible":true},"application/riscos":{"source":"iana"},"application/rlmi+xml":{"source":"iana","compressible":true},"application/rls-services+xml":{"source":"iana","compressible":true,"extensions":["rs"]},"application/route-apd+xml":{"source":"iana","compressible":true,"extensions":["rapd"]},"application/route-s-tsid+xml":{"source":"iana","compressible":true,"extensions":["sls"]},"application/route-usd+xml":{"source":"iana","compressible":true,"extensions":["rusd"]},"application/rpki-ghostbusters":{"source":"iana","extensions":["gbr"]},"application/rpki-manifest":{"source":"iana","extensions":["mft"]},"application/rpki-publication":{"source":"iana"},"application/rpki-roa":{"source":"iana","extensions":["roa"]},"application/rpki-updown":{"source":"iana"},"application/rsd+xml":{"source":"apache","compressible":true,"extensions":["rsd"]},"application/rss+xml":{"source":"apache","compressible":true,"extensions":["rss"]},"application/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"application/rtploopback":{"source":"iana"},"application/rtx":{"source":"iana"},"application/samlassertion+xml":{"source":"iana","compressible":true},"application/samlmetadata+xml":{"source":"iana","compressible":true},"application/sarif+json":{"source":"iana","compressible":true},"application/sarif-external-properties+json":{"source":"iana","compressible":true},"application/sbe":{"source":"iana"},"application/sbml+xml":{"source":"iana","compressible":true,"extensions":["sbml"]},"application/scaip+xml":{"source":"iana","compressible":true},"application/scim+json":{"source":"iana","compressible":true},"application/scvp-cv-request":{"source":"iana","extensions":["scq"]},"application/scvp-cv-response":{"source":"iana","extensions":["scs"]},"application/scvp-vp-request":{"source":"iana","extensions":["spq"]},"application/scvp-vp-response":{"source":"iana","extensions":["spp"]},"application/sdp":{"source":"iana","extensions":["sdp"]},"application/secevent+jwt":{"source":"iana"},"application/senml+cbor":{"source":"iana"},"application/senml+json":{"source":"iana","compressible":true},"application/senml+xml":{"source":"iana","compressible":true,"extensions":["senmlx"]},"application/senml-etch+cbor":{"source":"iana"},"application/senml-etch+json":{"source":"iana","compressible":true},"application/senml-exi":{"source":"iana"},"application/sensml+cbor":{"source":"iana"},"application/sensml+json":{"source":"iana","compressible":true},"application/sensml+xml":{"source":"iana","compressible":true,"extensions":["sensmlx"]},"application/sensml-exi":{"source":"iana"},"application/sep+xml":{"source":"iana","compressible":true},"application/sep-exi":{"source":"iana"},"application/session-info":{"source":"iana"},"application/set-payment":{"source":"iana"},"application/set-payment-initiation":{"source":"iana","extensions":["setpay"]},"application/set-registration":{"source":"iana"},"application/set-registration-initiation":{"source":"iana","extensions":["setreg"]},"application/sgml":{"source":"iana"},"application/sgml-open-catalog":{"source":"iana"},"application/shf+xml":{"source":"iana","compressible":true,"extensions":["shf"]},"application/sieve":{"source":"iana","extensions":["siv","sieve"]},"application/simple-filter+xml":{"source":"iana","compressible":true},"application/simple-message-summary":{"source":"iana"},"application/simplesymbolcontainer":{"source":"iana"},"application/sipc":{"source":"iana"},"application/slate":{"source":"iana"},"application/smil":{"source":"iana"},"application/smil+xml":{"source":"iana","compressible":true,"extensions":["smi","smil"]},"application/smpte336m":{"source":"iana"},"application/soap+fastinfoset":{"source":"iana"},"application/soap+xml":{"source":"iana","compressible":true},"application/sparql-query":{"source":"iana","extensions":["rq"]},"application/sparql-results+xml":{"source":"iana","compressible":true,"extensions":["srx"]},"application/spdx+json":{"source":"iana","compressible":true},"application/spirits-event+xml":{"source":"iana","compressible":true},"application/sql":{"source":"iana"},"application/srgs":{"source":"iana","extensions":["gram"]},"application/srgs+xml":{"source":"iana","compressible":true,"extensions":["grxml"]},"application/sru+xml":{"source":"iana","compressible":true,"extensions":["sru"]},"application/ssdl+xml":{"source":"apache","compressible":true,"extensions":["ssdl"]},"application/ssml+xml":{"source":"iana","compressible":true,"extensions":["ssml"]},"application/stix+json":{"source":"iana","compressible":true},"application/swid+xml":{"source":"iana","compressible":true,"extensions":["swidtag"]},"application/tamp-apex-update":{"source":"iana"},"application/tamp-apex-update-confirm":{"source":"iana"},"application/tamp-community-update":{"source":"iana"},"application/tamp-community-update-confirm":{"source":"iana"},"application/tamp-error":{"source":"iana"},"application/tamp-sequence-adjust":{"source":"iana"},"application/tamp-sequence-adjust-confirm":{"source":"iana"},"application/tamp-status-query":{"source":"iana"},"application/tamp-status-response":{"source":"iana"},"application/tamp-update":{"source":"iana"},"application/tamp-update-confirm":{"source":"iana"},"application/tar":{"compressible":true},"application/taxii+json":{"source":"iana","compressible":true},"application/td+json":{"source":"iana","compressible":true},"application/tei+xml":{"source":"iana","compressible":true,"extensions":["tei","teicorpus"]},"application/tetra_isi":{"source":"iana"},"application/thraud+xml":{"source":"iana","compressible":true,"extensions":["tfi"]},"application/timestamp-query":{"source":"iana"},"application/timestamp-reply":{"source":"iana"},"application/timestamped-data":{"source":"iana","extensions":["tsd"]},"application/tlsrpt+gzip":{"source":"iana"},"application/tlsrpt+json":{"source":"iana","compressible":true},"application/tnauthlist":{"source":"iana"},"application/token-introspection+jwt":{"source":"iana"},"application/toml":{"compressible":true,"extensions":["toml"]},"application/trickle-ice-sdpfrag":{"source":"iana"},"application/trig":{"source":"iana","extensions":["trig"]},"application/ttml+xml":{"source":"iana","compressible":true,"extensions":["ttml"]},"application/tve-trigger":{"source":"iana"},"application/tzif":{"source":"iana"},"application/tzif-leap":{"source":"iana"},"application/ubjson":{"compressible":false,"extensions":["ubj"]},"application/ulpfec":{"source":"iana"},"application/urc-grpsheet+xml":{"source":"iana","compressible":true},"application/urc-ressheet+xml":{"source":"iana","compressible":true,"extensions":["rsheet"]},"application/urc-targetdesc+xml":{"source":"iana","compressible":true,"extensions":["td"]},"application/urc-uisocketdesc+xml":{"source":"iana","compressible":true},"application/vcard+json":{"source":"iana","compressible":true},"application/vcard+xml":{"source":"iana","compressible":true},"application/vemmi":{"source":"iana"},"application/vividence.scriptfile":{"source":"apache"},"application/vnd.1000minds.decision-model+xml":{"source":"iana","compressible":true,"extensions":["1km"]},"application/vnd.3gpp-prose+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-prose-pc3ch+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-v2x-local-service-information":{"source":"iana"},"application/vnd.3gpp.5gnas":{"source":"iana"},"application/vnd.3gpp.access-transfer-events+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.bsf+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gmop+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gtpc":{"source":"iana"},"application/vnd.3gpp.interworking-data":{"source":"iana"},"application/vnd.3gpp.lpp":{"source":"iana"},"application/vnd.3gpp.mc-signalling-ear":{"source":"iana"},"application/vnd.3gpp.mcdata-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-payload":{"source":"iana"},"application/vnd.3gpp.mcdata-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-signalling":{"source":"iana"},"application/vnd.3gpp.mcdata-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-floor-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-signed+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-init-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-transmission-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mid-call+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ngap":{"source":"iana"},"application/vnd.3gpp.pfcp":{"source":"iana"},"application/vnd.3gpp.pic-bw-large":{"source":"iana","extensions":["plb"]},"application/vnd.3gpp.pic-bw-small":{"source":"iana","extensions":["psb"]},"application/vnd.3gpp.pic-bw-var":{"source":"iana","extensions":["pvb"]},"application/vnd.3gpp.s1ap":{"source":"iana"},"application/vnd.3gpp.sms":{"source":"iana"},"application/vnd.3gpp.sms+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-ext+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.state-and-event-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ussd+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.bcmcsinfo+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.sms":{"source":"iana"},"application/vnd.3gpp2.tcap":{"source":"iana","extensions":["tcap"]},"application/vnd.3lightssoftware.imagescal":{"source":"iana"},"application/vnd.3m.post-it-notes":{"source":"iana","extensions":["pwn"]},"application/vnd.accpac.simply.aso":{"source":"iana","extensions":["aso"]},"application/vnd.accpac.simply.imp":{"source":"iana","extensions":["imp"]},"application/vnd.acucobol":{"source":"iana","extensions":["acu"]},"application/vnd.acucorp":{"source":"iana","extensions":["atc","acutc"]},"application/vnd.adobe.air-application-installer-package+zip":{"source":"apache","compressible":false,"extensions":["air"]},"application/vnd.adobe.flash.movie":{"source":"iana"},"application/vnd.adobe.formscentral.fcdt":{"source":"iana","extensions":["fcdt"]},"application/vnd.adobe.fxp":{"source":"iana","extensions":["fxp","fxpl"]},"application/vnd.adobe.partial-upload":{"source":"iana"},"application/vnd.adobe.xdp+xml":{"source":"iana","compressible":true,"extensions":["xdp"]},"application/vnd.adobe.xfdf":{"source":"iana","extensions":["xfdf"]},"application/vnd.aether.imp":{"source":"iana"},"application/vnd.afpc.afplinedata":{"source":"iana"},"application/vnd.afpc.afplinedata-pagedef":{"source":"iana"},"application/vnd.afpc.cmoca-cmresource":{"source":"iana"},"application/vnd.afpc.foca-charset":{"source":"iana"},"application/vnd.afpc.foca-codedfont":{"source":"iana"},"application/vnd.afpc.foca-codepage":{"source":"iana"},"application/vnd.afpc.modca":{"source":"iana"},"application/vnd.afpc.modca-cmtable":{"source":"iana"},"application/vnd.afpc.modca-formdef":{"source":"iana"},"application/vnd.afpc.modca-mediummap":{"source":"iana"},"application/vnd.afpc.modca-objectcontainer":{"source":"iana"},"application/vnd.afpc.modca-overlay":{"source":"iana"},"application/vnd.afpc.modca-pagesegment":{"source":"iana"},"application/vnd.age":{"source":"iana","extensions":["age"]},"application/vnd.ah-barcode":{"source":"iana"},"application/vnd.ahead.space":{"source":"iana","extensions":["ahead"]},"application/vnd.airzip.filesecure.azf":{"source":"iana","extensions":["azf"]},"application/vnd.airzip.filesecure.azs":{"source":"iana","extensions":["azs"]},"application/vnd.amadeus+json":{"source":"iana","compressible":true},"application/vnd.amazon.ebook":{"source":"apache","extensions":["azw"]},"application/vnd.amazon.mobi8-ebook":{"source":"iana"},"application/vnd.americandynamics.acc":{"source":"iana","extensions":["acc"]},"application/vnd.amiga.ami":{"source":"iana","extensions":["ami"]},"application/vnd.amundsen.maze+xml":{"source":"iana","compressible":true},"application/vnd.android.ota":{"source":"iana"},"application/vnd.android.package-archive":{"source":"apache","compressible":false,"extensions":["apk"]},"application/vnd.anki":{"source":"iana"},"application/vnd.anser-web-certificate-issue-initiation":{"source":"iana","extensions":["cii"]},"application/vnd.anser-web-funds-transfer-initiation":{"source":"apache","extensions":["fti"]},"application/vnd.antix.game-component":{"source":"iana","extensions":["atx"]},"application/vnd.apache.arrow.file":{"source":"iana"},"application/vnd.apache.arrow.stream":{"source":"iana"},"application/vnd.apache.thrift.binary":{"source":"iana"},"application/vnd.apache.thrift.compact":{"source":"iana"},"application/vnd.apache.thrift.json":{"source":"iana"},"application/vnd.api+json":{"source":"iana","compressible":true},"application/vnd.aplextor.warrp+json":{"source":"iana","compressible":true},"application/vnd.apothekende.reservation+json":{"source":"iana","compressible":true},"application/vnd.apple.installer+xml":{"source":"iana","compressible":true,"extensions":["mpkg"]},"application/vnd.apple.keynote":{"source":"iana","extensions":["key"]},"application/vnd.apple.mpegurl":{"source":"iana","extensions":["m3u8"]},"application/vnd.apple.numbers":{"source":"iana","extensions":["numbers"]},"application/vnd.apple.pages":{"source":"iana","extensions":["pages"]},"application/vnd.apple.pkpass":{"compressible":false,"extensions":["pkpass"]},"application/vnd.arastra.swi":{"source":"iana"},"application/vnd.aristanetworks.swi":{"source":"iana","extensions":["swi"]},"application/vnd.artisan+json":{"source":"iana","compressible":true},"application/vnd.artsquare":{"source":"iana"},"application/vnd.astraea-software.iota":{"source":"iana","extensions":["iota"]},"application/vnd.audiograph":{"source":"iana","extensions":["aep"]},"application/vnd.autopackage":{"source":"iana"},"application/vnd.avalon+json":{"source":"iana","compressible":true},"application/vnd.avistar+xml":{"source":"iana","compressible":true},"application/vnd.balsamiq.bmml+xml":{"source":"iana","compressible":true,"extensions":["bmml"]},"application/vnd.balsamiq.bmpr":{"source":"iana"},"application/vnd.banana-accounting":{"source":"iana"},"application/vnd.bbf.usp.error":{"source":"iana"},"application/vnd.bbf.usp.msg":{"source":"iana"},"application/vnd.bbf.usp.msg+json":{"source":"iana","compressible":true},"application/vnd.bekitzur-stech+json":{"source":"iana","compressible":true},"application/vnd.bint.med-content":{"source":"iana"},"application/vnd.biopax.rdf+xml":{"source":"iana","compressible":true},"application/vnd.blink-idb-value-wrapper":{"source":"iana"},"application/vnd.blueice.multipass":{"source":"iana","extensions":["mpm"]},"application/vnd.bluetooth.ep.oob":{"source":"iana"},"application/vnd.bluetooth.le.oob":{"source":"iana"},"application/vnd.bmi":{"source":"iana","extensions":["bmi"]},"application/vnd.bpf":{"source":"iana"},"application/vnd.bpf3":{"source":"iana"},"application/vnd.businessobjects":{"source":"iana","extensions":["rep"]},"application/vnd.byu.uapi+json":{"source":"iana","compressible":true},"application/vnd.cab-jscript":{"source":"iana"},"application/vnd.canon-cpdl":{"source":"iana"},"application/vnd.canon-lips":{"source":"iana"},"application/vnd.capasystems-pg+json":{"source":"iana","compressible":true},"application/vnd.cendio.thinlinc.clientconf":{"source":"iana"},"application/vnd.century-systems.tcp_stream":{"source":"iana"},"application/vnd.chemdraw+xml":{"source":"iana","compressible":true,"extensions":["cdxml"]},"application/vnd.chess-pgn":{"source":"iana"},"application/vnd.chipnuts.karaoke-mmd":{"source":"iana","extensions":["mmd"]},"application/vnd.ciedi":{"source":"iana"},"application/vnd.cinderella":{"source":"iana","extensions":["cdy"]},"application/vnd.cirpack.isdn-ext":{"source":"iana"},"application/vnd.citationstyles.style+xml":{"source":"iana","compressible":true,"extensions":["csl"]},"application/vnd.claymore":{"source":"iana","extensions":["cla"]},"application/vnd.cloanto.rp9":{"source":"iana","extensions":["rp9"]},"application/vnd.clonk.c4group":{"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},"application/vnd.cluetrust.cartomobile-config":{"source":"iana","extensions":["c11amc"]},"application/vnd.cluetrust.cartomobile-config-pkg":{"source":"iana","extensions":["c11amz"]},"application/vnd.coffeescript":{"source":"iana"},"application/vnd.collabio.xodocuments.document":{"source":"iana"},"application/vnd.collabio.xodocuments.document-template":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation-template":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet-template":{"source":"iana"},"application/vnd.collection+json":{"source":"iana","compressible":true},"application/vnd.collection.doc+json":{"source":"iana","compressible":true},"application/vnd.collection.next+json":{"source":"iana","compressible":true},"application/vnd.comicbook+zip":{"source":"iana","compressible":false},"application/vnd.comicbook-rar":{"source":"iana"},"application/vnd.commerce-battelle":{"source":"iana"},"application/vnd.commonspace":{"source":"iana","extensions":["csp"]},"application/vnd.contact.cmsg":{"source":"iana","extensions":["cdbcmsg"]},"application/vnd.coreos.ignition+json":{"source":"iana","compressible":true},"application/vnd.cosmocaller":{"source":"iana","extensions":["cmc"]},"application/vnd.crick.clicker":{"source":"iana","extensions":["clkx"]},"application/vnd.crick.clicker.keyboard":{"source":"iana","extensions":["clkk"]},"application/vnd.crick.clicker.palette":{"source":"iana","extensions":["clkp"]},"application/vnd.crick.clicker.template":{"source":"iana","extensions":["clkt"]},"application/vnd.crick.clicker.wordbank":{"source":"iana","extensions":["clkw"]},"application/vnd.criticaltools.wbs+xml":{"source":"iana","compressible":true,"extensions":["wbs"]},"application/vnd.cryptii.pipe+json":{"source":"iana","compressible":true},"application/vnd.crypto-shade-file":{"source":"iana"},"application/vnd.cryptomator.encrypted":{"source":"iana"},"application/vnd.cryptomator.vault":{"source":"iana"},"application/vnd.ctc-posml":{"source":"iana","extensions":["pml"]},"application/vnd.ctct.ws+xml":{"source":"iana","compressible":true},"application/vnd.cups-pdf":{"source":"iana"},"application/vnd.cups-postscript":{"source":"iana"},"application/vnd.cups-ppd":{"source":"iana","extensions":["ppd"]},"application/vnd.cups-raster":{"source":"iana"},"application/vnd.cups-raw":{"source":"iana"},"application/vnd.curl":{"source":"iana"},"application/vnd.curl.car":{"source":"apache","extensions":["car"]},"application/vnd.curl.pcurl":{"source":"apache","extensions":["pcurl"]},"application/vnd.cyan.dean.root+xml":{"source":"iana","compressible":true},"application/vnd.cybank":{"source":"iana"},"application/vnd.cyclonedx+json":{"source":"iana","compressible":true},"application/vnd.cyclonedx+xml":{"source":"iana","compressible":true},"application/vnd.d2l.coursepackage1p0+zip":{"source":"iana","compressible":false},"application/vnd.d3m-dataset":{"source":"iana"},"application/vnd.d3m-problem":{"source":"iana"},"application/vnd.dart":{"source":"iana","compressible":true,"extensions":["dart"]},"application/vnd.data-vision.rdz":{"source":"iana","extensions":["rdz"]},"application/vnd.datapackage+json":{"source":"iana","compressible":true},"application/vnd.dataresource+json":{"source":"iana","compressible":true},"application/vnd.dbf":{"source":"iana","extensions":["dbf"]},"application/vnd.debian.binary-package":{"source":"iana"},"application/vnd.dece.data":{"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},"application/vnd.dece.ttml+xml":{"source":"iana","compressible":true,"extensions":["uvt","uvvt"]},"application/vnd.dece.unspecified":{"source":"iana","extensions":["uvx","uvvx"]},"application/vnd.dece.zip":{"source":"iana","extensions":["uvz","uvvz"]},"application/vnd.denovo.fcselayout-link":{"source":"iana","extensions":["fe_launch"]},"application/vnd.desmume.movie":{"source":"iana"},"application/vnd.dir-bi.plate-dl-nosuffix":{"source":"iana"},"application/vnd.dm.delegation+xml":{"source":"iana","compressible":true},"application/vnd.dna":{"source":"iana","extensions":["dna"]},"application/vnd.document+json":{"source":"iana","compressible":true},"application/vnd.dolby.mlp":{"source":"apache","extensions":["mlp"]},"application/vnd.dolby.mobile.1":{"source":"iana"},"application/vnd.dolby.mobile.2":{"source":"iana"},"application/vnd.doremir.scorecloud-binary-document":{"source":"iana"},"application/vnd.dpgraph":{"source":"iana","extensions":["dpg"]},"application/vnd.dreamfactory":{"source":"iana","extensions":["dfac"]},"application/vnd.drive+json":{"source":"iana","compressible":true},"application/vnd.ds-keypoint":{"source":"apache","extensions":["kpxx"]},"application/vnd.dtg.local":{"source":"iana"},"application/vnd.dtg.local.flash":{"source":"iana"},"application/vnd.dtg.local.html":{"source":"iana"},"application/vnd.dvb.ait":{"source":"iana","extensions":["ait"]},"application/vnd.dvb.dvbisl+xml":{"source":"iana","compressible":true},"application/vnd.dvb.dvbj":{"source":"iana"},"application/vnd.dvb.esgcontainer":{"source":"iana"},"application/vnd.dvb.ipdcdftnotifaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess2":{"source":"iana"},"application/vnd.dvb.ipdcesgpdd":{"source":"iana"},"application/vnd.dvb.ipdcroaming":{"source":"iana"},"application/vnd.dvb.iptv.alfec-base":{"source":"iana"},"application/vnd.dvb.iptv.alfec-enhancement":{"source":"iana"},"application/vnd.dvb.notif-aggregate-root+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-container+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-generic+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-msglist+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-request+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-response+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-init+xml":{"source":"iana","compressible":true},"application/vnd.dvb.pfr":{"source":"iana"},"application/vnd.dvb.service":{"source":"iana","extensions":["svc"]},"application/vnd.dxr":{"source":"iana"},"application/vnd.dynageo":{"source":"iana","extensions":["geo"]},"application/vnd.dzr":{"source":"iana"},"application/vnd.easykaraoke.cdgdownload":{"source":"iana"},"application/vnd.ecdis-update":{"source":"iana"},"application/vnd.ecip.rlp":{"source":"iana"},"application/vnd.eclipse.ditto+json":{"source":"iana","compressible":true},"application/vnd.ecowin.chart":{"source":"iana","extensions":["mag"]},"application/vnd.ecowin.filerequest":{"source":"iana"},"application/vnd.ecowin.fileupdate":{"source":"iana"},"application/vnd.ecowin.series":{"source":"iana"},"application/vnd.ecowin.seriesrequest":{"source":"iana"},"application/vnd.ecowin.seriesupdate":{"source":"iana"},"application/vnd.efi.img":{"source":"iana"},"application/vnd.efi.iso":{"source":"iana"},"application/vnd.emclient.accessrequest+xml":{"source":"iana","compressible":true},"application/vnd.enliven":{"source":"iana","extensions":["nml"]},"application/vnd.enphase.envoy":{"source":"iana"},"application/vnd.eprints.data+xml":{"source":"iana","compressible":true},"application/vnd.epson.esf":{"source":"iana","extensions":["esf"]},"application/vnd.epson.msf":{"source":"iana","extensions":["msf"]},"application/vnd.epson.quickanime":{"source":"iana","extensions":["qam"]},"application/vnd.epson.salt":{"source":"iana","extensions":["slt"]},"application/vnd.epson.ssf":{"source":"iana","extensions":["ssf"]},"application/vnd.ericsson.quickcall":{"source":"iana"},"application/vnd.espass-espass+zip":{"source":"iana","compressible":false},"application/vnd.eszigno3+xml":{"source":"iana","compressible":true,"extensions":["es3","et3"]},"application/vnd.etsi.aoc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.asic-e+zip":{"source":"iana","compressible":false},"application/vnd.etsi.asic-s+zip":{"source":"iana","compressible":false},"application/vnd.etsi.cug+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvcommand+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-bc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-cod+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-npvr+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvservice+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsync+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvueprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mcid+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mheg5":{"source":"iana"},"application/vnd.etsi.overload-control-policy-dataset+xml":{"source":"iana","compressible":true},"application/vnd.etsi.pstn+xml":{"source":"iana","compressible":true},"application/vnd.etsi.sci+xml":{"source":"iana","compressible":true},"application/vnd.etsi.simservs+xml":{"source":"iana","compressible":true},"application/vnd.etsi.timestamp-token":{"source":"iana"},"application/vnd.etsi.tsl+xml":{"source":"iana","compressible":true},"application/vnd.etsi.tsl.der":{"source":"iana"},"application/vnd.eu.kasparian.car+json":{"source":"iana","compressible":true},"application/vnd.eudora.data":{"source":"iana"},"application/vnd.evolv.ecig.profile":{"source":"iana"},"application/vnd.evolv.ecig.settings":{"source":"iana"},"application/vnd.evolv.ecig.theme":{"source":"iana"},"application/vnd.exstream-empower+zip":{"source":"iana","compressible":false},"application/vnd.exstream-package":{"source":"iana"},"application/vnd.ezpix-album":{"source":"iana","extensions":["ez2"]},"application/vnd.ezpix-package":{"source":"iana","extensions":["ez3"]},"application/vnd.f-secure.mobile":{"source":"iana"},"application/vnd.familysearch.gedcom+zip":{"source":"iana","compressible":false},"application/vnd.fastcopy-disk-image":{"source":"iana"},"application/vnd.fdf":{"source":"iana","extensions":["fdf"]},"application/vnd.fdsn.mseed":{"source":"iana","extensions":["mseed"]},"application/vnd.fdsn.seed":{"source":"iana","extensions":["seed","dataless"]},"application/vnd.ffsns":{"source":"iana"},"application/vnd.ficlab.flb+zip":{"source":"iana","compressible":false},"application/vnd.filmit.zfc":{"source":"iana"},"application/vnd.fints":{"source":"iana"},"application/vnd.firemonkeys.cloudcell":{"source":"iana"},"application/vnd.flographit":{"source":"iana","extensions":["gph"]},"application/vnd.fluxtime.clip":{"source":"iana","extensions":["ftc"]},"application/vnd.font-fontforge-sfd":{"source":"iana"},"application/vnd.framemaker":{"source":"iana","extensions":["fm","frame","maker","book"]},"application/vnd.frogans.fnc":{"source":"iana","extensions":["fnc"]},"application/vnd.frogans.ltf":{"source":"iana","extensions":["ltf"]},"application/vnd.fsc.weblaunch":{"source":"iana","extensions":["fsc"]},"application/vnd.fujifilm.fb.docuworks":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.binder":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.container":{"source":"iana"},"application/vnd.fujifilm.fb.jfi+xml":{"source":"iana","compressible":true},"application/vnd.fujitsu.oasys":{"source":"iana","extensions":["oas"]},"application/vnd.fujitsu.oasys2":{"source":"iana","extensions":["oa2"]},"application/vnd.fujitsu.oasys3":{"source":"iana","extensions":["oa3"]},"application/vnd.fujitsu.oasysgp":{"source":"iana","extensions":["fg5"]},"application/vnd.fujitsu.oasysprs":{"source":"iana","extensions":["bh2"]},"application/vnd.fujixerox.art-ex":{"source":"iana"},"application/vnd.fujixerox.art4":{"source":"iana"},"application/vnd.fujixerox.ddd":{"source":"iana","extensions":["ddd"]},"application/vnd.fujixerox.docuworks":{"source":"iana","extensions":["xdw"]},"application/vnd.fujixerox.docuworks.binder":{"source":"iana","extensions":["xbd"]},"application/vnd.fujixerox.docuworks.container":{"source":"iana"},"application/vnd.fujixerox.hbpl":{"source":"iana"},"application/vnd.fut-misnet":{"source":"iana"},"application/vnd.futoin+cbor":{"source":"iana"},"application/vnd.futoin+json":{"source":"iana","compressible":true},"application/vnd.fuzzysheet":{"source":"iana","extensions":["fzs"]},"application/vnd.genomatix.tuxedo":{"source":"iana","extensions":["txd"]},"application/vnd.gentics.grd+json":{"source":"iana","compressible":true},"application/vnd.geo+json":{"source":"iana","compressible":true},"application/vnd.geocube+xml":{"source":"iana","compressible":true},"application/vnd.geogebra.file":{"source":"iana","extensions":["ggb"]},"application/vnd.geogebra.slides":{"source":"iana"},"application/vnd.geogebra.tool":{"source":"iana","extensions":["ggt"]},"application/vnd.geometry-explorer":{"source":"iana","extensions":["gex","gre"]},"application/vnd.geonext":{"source":"iana","extensions":["gxt"]},"application/vnd.geoplan":{"source":"iana","extensions":["g2w"]},"application/vnd.geospace":{"source":"iana","extensions":["g3w"]},"application/vnd.gerber":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt-response":{"source":"iana"},"application/vnd.gmx":{"source":"iana","extensions":["gmx"]},"application/vnd.google-apps.document":{"compressible":false,"extensions":["gdoc"]},"application/vnd.google-apps.presentation":{"compressible":false,"extensions":["gslides"]},"application/vnd.google-apps.spreadsheet":{"compressible":false,"extensions":["gsheet"]},"application/vnd.google-earth.kml+xml":{"source":"iana","compressible":true,"extensions":["kml"]},"application/vnd.google-earth.kmz":{"source":"iana","compressible":false,"extensions":["kmz"]},"application/vnd.gov.sk.e-form+xml":{"source":"iana","compressible":true},"application/vnd.gov.sk.e-form+zip":{"source":"iana","compressible":false},"application/vnd.gov.sk.xmldatacontainer+xml":{"source":"iana","compressible":true},"application/vnd.grafeq":{"source":"iana","extensions":["gqf","gqs"]},"application/vnd.gridmp":{"source":"iana"},"application/vnd.groove-account":{"source":"iana","extensions":["gac"]},"application/vnd.groove-help":{"source":"iana","extensions":["ghf"]},"application/vnd.groove-identity-message":{"source":"iana","extensions":["gim"]},"application/vnd.groove-injector":{"source":"iana","extensions":["grv"]},"application/vnd.groove-tool-message":{"source":"iana","extensions":["gtm"]},"application/vnd.groove-tool-template":{"source":"iana","extensions":["tpl"]},"application/vnd.groove-vcard":{"source":"iana","extensions":["vcg"]},"application/vnd.hal+json":{"source":"iana","compressible":true},"application/vnd.hal+xml":{"source":"iana","compressible":true,"extensions":["hal"]},"application/vnd.handheld-entertainment+xml":{"source":"iana","compressible":true,"extensions":["zmm"]},"application/vnd.hbci":{"source":"iana","extensions":["hbci"]},"application/vnd.hc+json":{"source":"iana","compressible":true},"application/vnd.hcl-bireports":{"source":"iana"},"application/vnd.hdt":{"source":"iana"},"application/vnd.heroku+json":{"source":"iana","compressible":true},"application/vnd.hhe.lesson-player":{"source":"iana","extensions":["les"]},"application/vnd.hl7cda+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hl7v2+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hp-hpgl":{"source":"iana","extensions":["hpgl"]},"application/vnd.hp-hpid":{"source":"iana","extensions":["hpid"]},"application/vnd.hp-hps":{"source":"iana","extensions":["hps"]},"application/vnd.hp-jlyt":{"source":"iana","extensions":["jlt"]},"application/vnd.hp-pcl":{"source":"iana","extensions":["pcl"]},"application/vnd.hp-pclxl":{"source":"iana","extensions":["pclxl"]},"application/vnd.httphone":{"source":"iana"},"application/vnd.hydrostatix.sof-data":{"source":"iana","extensions":["sfd-hdstx"]},"application/vnd.hyper+json":{"source":"iana","compressible":true},"application/vnd.hyper-item+json":{"source":"iana","compressible":true},"application/vnd.hyperdrive+json":{"source":"iana","compressible":true},"application/vnd.hzn-3d-crossword":{"source":"iana"},"application/vnd.ibm.afplinedata":{"source":"iana"},"application/vnd.ibm.electronic-media":{"source":"iana"},"application/vnd.ibm.minipay":{"source":"iana","extensions":["mpy"]},"application/vnd.ibm.modcap":{"source":"iana","extensions":["afp","listafp","list3820"]},"application/vnd.ibm.rights-management":{"source":"iana","extensions":["irm"]},"application/vnd.ibm.secure-container":{"source":"iana","extensions":["sc"]},"application/vnd.iccprofile":{"source":"iana","extensions":["icc","icm"]},"application/vnd.ieee.1905":{"source":"iana"},"application/vnd.igloader":{"source":"iana","extensions":["igl"]},"application/vnd.imagemeter.folder+zip":{"source":"iana","compressible":false},"application/vnd.imagemeter.image+zip":{"source":"iana","compressible":false},"application/vnd.immervision-ivp":{"source":"iana","extensions":["ivp"]},"application/vnd.immervision-ivu":{"source":"iana","extensions":["ivu"]},"application/vnd.ims.imsccv1p1":{"source":"iana"},"application/vnd.ims.imsccv1p2":{"source":"iana"},"application/vnd.ims.imsccv1p3":{"source":"iana"},"application/vnd.ims.lis.v2.result+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolconsumerprofile+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy.id+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings.simple+json":{"source":"iana","compressible":true},"application/vnd.informedcontrol.rms+xml":{"source":"iana","compressible":true},"application/vnd.informix-visionary":{"source":"iana"},"application/vnd.infotech.project":{"source":"iana"},"application/vnd.infotech.project+xml":{"source":"iana","compressible":true},"application/vnd.innopath.wamp.notification":{"source":"iana"},"application/vnd.insors.igm":{"source":"iana","extensions":["igm"]},"application/vnd.intercon.formnet":{"source":"iana","extensions":["xpw","xpx"]},"application/vnd.intergeo":{"source":"iana","extensions":["i2g"]},"application/vnd.intertrust.digibox":{"source":"iana"},"application/vnd.intertrust.nncp":{"source":"iana"},"application/vnd.intu.qbo":{"source":"iana","extensions":["qbo"]},"application/vnd.intu.qfx":{"source":"iana","extensions":["qfx"]},"application/vnd.iptc.g2.catalogitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.conceptitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.knowledgeitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsmessage+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.packageitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.planningitem+xml":{"source":"iana","compressible":true},"application/vnd.ipunplugged.rcprofile":{"source":"iana","extensions":["rcprofile"]},"application/vnd.irepository.package+xml":{"source":"iana","compressible":true,"extensions":["irp"]},"application/vnd.is-xpr":{"source":"iana","extensions":["xpr"]},"application/vnd.isac.fcs":{"source":"iana","extensions":["fcs"]},"application/vnd.iso11783-10+zip":{"source":"iana","compressible":false},"application/vnd.jam":{"source":"iana","extensions":["jam"]},"application/vnd.japannet-directory-service":{"source":"iana"},"application/vnd.japannet-jpnstore-wakeup":{"source":"iana"},"application/vnd.japannet-payment-wakeup":{"source":"iana"},"application/vnd.japannet-registration":{"source":"iana"},"application/vnd.japannet-registration-wakeup":{"source":"iana"},"application/vnd.japannet-setstore-wakeup":{"source":"iana"},"application/vnd.japannet-verification":{"source":"iana"},"application/vnd.japannet-verification-wakeup":{"source":"iana"},"application/vnd.jcp.javame.midlet-rms":{"source":"iana","extensions":["rms"]},"application/vnd.jisp":{"source":"iana","extensions":["jisp"]},"application/vnd.joost.joda-archive":{"source":"iana","extensions":["joda"]},"application/vnd.jsk.isdn-ngn":{"source":"iana"},"application/vnd.kahootz":{"source":"iana","extensions":["ktz","ktr"]},"application/vnd.kde.karbon":{"source":"iana","extensions":["karbon"]},"application/vnd.kde.kchart":{"source":"iana","extensions":["chrt"]},"application/vnd.kde.kformula":{"source":"iana","extensions":["kfo"]},"application/vnd.kde.kivio":{"source":"iana","extensions":["flw"]},"application/vnd.kde.kontour":{"source":"iana","extensions":["kon"]},"application/vnd.kde.kpresenter":{"source":"iana","extensions":["kpr","kpt"]},"application/vnd.kde.kspread":{"source":"iana","extensions":["ksp"]},"application/vnd.kde.kword":{"source":"iana","extensions":["kwd","kwt"]},"application/vnd.kenameaapp":{"source":"iana","extensions":["htke"]},"application/vnd.kidspiration":{"source":"iana","extensions":["kia"]},"application/vnd.kinar":{"source":"iana","extensions":["kne","knp"]},"application/vnd.koan":{"source":"iana","extensions":["skp","skd","skt","skm"]},"application/vnd.kodak-descriptor":{"source":"iana","extensions":["sse"]},"application/vnd.las":{"source":"iana"},"application/vnd.las.las+json":{"source":"iana","compressible":true},"application/vnd.las.las+xml":{"source":"iana","compressible":true,"extensions":["lasxml"]},"application/vnd.laszip":{"source":"iana"},"application/vnd.leap+json":{"source":"iana","compressible":true},"application/vnd.liberty-request+xml":{"source":"iana","compressible":true},"application/vnd.llamagraphics.life-balance.desktop":{"source":"iana","extensions":["lbd"]},"application/vnd.llamagraphics.life-balance.exchange+xml":{"source":"iana","compressible":true,"extensions":["lbe"]},"application/vnd.logipipe.circuit+zip":{"source":"iana","compressible":false},"application/vnd.loom":{"source":"iana"},"application/vnd.lotus-1-2-3":{"source":"iana","extensions":["123"]},"application/vnd.lotus-approach":{"source":"iana","extensions":["apr"]},"application/vnd.lotus-freelance":{"source":"iana","extensions":["pre"]},"application/vnd.lotus-notes":{"source":"iana","extensions":["nsf"]},"application/vnd.lotus-organizer":{"source":"iana","extensions":["org"]},"application/vnd.lotus-screencam":{"source":"iana","extensions":["scm"]},"application/vnd.lotus-wordpro":{"source":"iana","extensions":["lwp"]},"application/vnd.macports.portpkg":{"source":"iana","extensions":["portpkg"]},"application/vnd.mapbox-vector-tile":{"source":"iana","extensions":["mvt"]},"application/vnd.marlin.drm.actiontoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.conftoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.license+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.mdcf":{"source":"iana"},"application/vnd.mason+json":{"source":"iana","compressible":true},"application/vnd.maxar.archive.3tz+zip":{"source":"iana","compressible":false},"application/vnd.maxmind.maxmind-db":{"source":"iana"},"application/vnd.mcd":{"source":"iana","extensions":["mcd"]},"application/vnd.medcalcdata":{"source":"iana","extensions":["mc1"]},"application/vnd.mediastation.cdkey":{"source":"iana","extensions":["cdkey"]},"application/vnd.meridian-slingshot":{"source":"iana"},"application/vnd.mfer":{"source":"iana","extensions":["mwf"]},"application/vnd.mfmp":{"source":"iana","extensions":["mfm"]},"application/vnd.micro+json":{"source":"iana","compressible":true},"application/vnd.micrografx.flo":{"source":"iana","extensions":["flo"]},"application/vnd.micrografx.igx":{"source":"iana","extensions":["igx"]},"application/vnd.microsoft.portable-executable":{"source":"iana"},"application/vnd.microsoft.windows.thumbnail-cache":{"source":"iana"},"application/vnd.miele+json":{"source":"iana","compressible":true},"application/vnd.mif":{"source":"iana","extensions":["mif"]},"application/vnd.minisoft-hp3000-save":{"source":"iana"},"application/vnd.mitsubishi.misty-guard.trustweb":{"source":"iana"},"application/vnd.mobius.daf":{"source":"iana","extensions":["daf"]},"application/vnd.mobius.dis":{"source":"iana","extensions":["dis"]},"application/vnd.mobius.mbk":{"source":"iana","extensions":["mbk"]},"application/vnd.mobius.mqy":{"source":"iana","extensions":["mqy"]},"application/vnd.mobius.msl":{"source":"iana","extensions":["msl"]},"application/vnd.mobius.plc":{"source":"iana","extensions":["plc"]},"application/vnd.mobius.txf":{"source":"iana","extensions":["txf"]},"application/vnd.mophun.application":{"source":"iana","extensions":["mpn"]},"application/vnd.mophun.certificate":{"source":"iana","extensions":["mpc"]},"application/vnd.motorola.flexsuite":{"source":"iana"},"application/vnd.motorola.flexsuite.adsi":{"source":"iana"},"application/vnd.motorola.flexsuite.fis":{"source":"iana"},"application/vnd.motorola.flexsuite.gotap":{"source":"iana"},"application/vnd.motorola.flexsuite.kmr":{"source":"iana"},"application/vnd.motorola.flexsuite.ttc":{"source":"iana"},"application/vnd.motorola.flexsuite.wem":{"source":"iana"},"application/vnd.motorola.iprm":{"source":"iana"},"application/vnd.mozilla.xul+xml":{"source":"iana","compressible":true,"extensions":["xul"]},"application/vnd.ms-3mfdocument":{"source":"iana"},"application/vnd.ms-artgalry":{"source":"iana","extensions":["cil"]},"application/vnd.ms-asf":{"source":"iana"},"application/vnd.ms-cab-compressed":{"source":"iana","extensions":["cab"]},"application/vnd.ms-color.iccprofile":{"source":"apache"},"application/vnd.ms-excel":{"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},"application/vnd.ms-excel.addin.macroenabled.12":{"source":"iana","extensions":["xlam"]},"application/vnd.ms-excel.sheet.binary.macroenabled.12":{"source":"iana","extensions":["xlsb"]},"application/vnd.ms-excel.sheet.macroenabled.12":{"source":"iana","extensions":["xlsm"]},"application/vnd.ms-excel.template.macroenabled.12":{"source":"iana","extensions":["xltm"]},"application/vnd.ms-fontobject":{"source":"iana","compressible":true,"extensions":["eot"]},"application/vnd.ms-htmlhelp":{"source":"iana","extensions":["chm"]},"application/vnd.ms-ims":{"source":"iana","extensions":["ims"]},"application/vnd.ms-lrm":{"source":"iana","extensions":["lrm"]},"application/vnd.ms-office.activex+xml":{"source":"iana","compressible":true},"application/vnd.ms-officetheme":{"source":"iana","extensions":["thmx"]},"application/vnd.ms-opentype":{"source":"apache","compressible":true},"application/vnd.ms-outlook":{"compressible":false,"extensions":["msg"]},"application/vnd.ms-package.obfuscated-opentype":{"source":"apache"},"application/vnd.ms-pki.seccat":{"source":"apache","extensions":["cat"]},"application/vnd.ms-pki.stl":{"source":"apache","extensions":["stl"]},"application/vnd.ms-playready.initiator+xml":{"source":"iana","compressible":true},"application/vnd.ms-powerpoint":{"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},"application/vnd.ms-powerpoint.addin.macroenabled.12":{"source":"iana","extensions":["ppam"]},"application/vnd.ms-powerpoint.presentation.macroenabled.12":{"source":"iana","extensions":["pptm"]},"application/vnd.ms-powerpoint.slide.macroenabled.12":{"source":"iana","extensions":["sldm"]},"application/vnd.ms-powerpoint.slideshow.macroenabled.12":{"source":"iana","extensions":["ppsm"]},"application/vnd.ms-powerpoint.template.macroenabled.12":{"source":"iana","extensions":["potm"]},"application/vnd.ms-printdevicecapabilities+xml":{"source":"iana","compressible":true},"application/vnd.ms-printing.printticket+xml":{"source":"apache","compressible":true},"application/vnd.ms-printschematicket+xml":{"source":"iana","compressible":true},"application/vnd.ms-project":{"source":"iana","extensions":["mpp","mpt"]},"application/vnd.ms-tnef":{"source":"iana"},"application/vnd.ms-windows.devicepairing":{"source":"iana"},"application/vnd.ms-windows.nwprinting.oob":{"source":"iana"},"application/vnd.ms-windows.printerpairing":{"source":"iana"},"application/vnd.ms-windows.wsd.oob":{"source":"iana"},"application/vnd.ms-wmdrm.lic-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.lic-resp":{"source":"iana"},"application/vnd.ms-wmdrm.meter-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.meter-resp":{"source":"iana"},"application/vnd.ms-word.document.macroenabled.12":{"source":"iana","extensions":["docm"]},"application/vnd.ms-word.template.macroenabled.12":{"source":"iana","extensions":["dotm"]},"application/vnd.ms-works":{"source":"iana","extensions":["wps","wks","wcm","wdb"]},"application/vnd.ms-wpl":{"source":"iana","extensions":["wpl"]},"application/vnd.ms-xpsdocument":{"source":"iana","compressible":false,"extensions":["xps"]},"application/vnd.msa-disk-image":{"source":"iana"},"application/vnd.mseq":{"source":"iana","extensions":["mseq"]},"application/vnd.msign":{"source":"iana"},"application/vnd.multiad.creator":{"source":"iana"},"application/vnd.multiad.creator.cif":{"source":"iana"},"application/vnd.music-niff":{"source":"iana"},"application/vnd.musician":{"source":"iana","extensions":["mus"]},"application/vnd.muvee.style":{"source":"iana","extensions":["msty"]},"application/vnd.mynfc":{"source":"iana","extensions":["taglet"]},"application/vnd.nacamar.ybrid+json":{"source":"iana","compressible":true},"application/vnd.ncd.control":{"source":"iana"},"application/vnd.ncd.reference":{"source":"iana"},"application/vnd.nearst.inv+json":{"source":"iana","compressible":true},"application/vnd.nebumind.line":{"source":"iana"},"application/vnd.nervana":{"source":"iana"},"application/vnd.netfpx":{"source":"iana"},"application/vnd.neurolanguage.nlu":{"source":"iana","extensions":["nlu"]},"application/vnd.nimn":{"source":"iana"},"application/vnd.nintendo.nitro.rom":{"source":"iana"},"application/vnd.nintendo.snes.rom":{"source":"iana"},"application/vnd.nitf":{"source":"iana","extensions":["ntf","nitf"]},"application/vnd.noblenet-directory":{"source":"iana","extensions":["nnd"]},"application/vnd.noblenet-sealer":{"source":"iana","extensions":["nns"]},"application/vnd.noblenet-web":{"source":"iana","extensions":["nnw"]},"application/vnd.nokia.catalogs":{"source":"iana"},"application/vnd.nokia.conml+wbxml":{"source":"iana"},"application/vnd.nokia.conml+xml":{"source":"iana","compressible":true},"application/vnd.nokia.iptv.config+xml":{"source":"iana","compressible":true},"application/vnd.nokia.isds-radio-presets":{"source":"iana"},"application/vnd.nokia.landmark+wbxml":{"source":"iana"},"application/vnd.nokia.landmark+xml":{"source":"iana","compressible":true},"application/vnd.nokia.landmarkcollection+xml":{"source":"iana","compressible":true},"application/vnd.nokia.n-gage.ac+xml":{"source":"iana","compressible":true,"extensions":["ac"]},"application/vnd.nokia.n-gage.data":{"source":"iana","extensions":["ngdat"]},"application/vnd.nokia.n-gage.symbian.install":{"source":"iana","extensions":["n-gage"]},"application/vnd.nokia.ncd":{"source":"iana"},"application/vnd.nokia.pcd+wbxml":{"source":"iana"},"application/vnd.nokia.pcd+xml":{"source":"iana","compressible":true},"application/vnd.nokia.radio-preset":{"source":"iana","extensions":["rpst"]},"application/vnd.nokia.radio-presets":{"source":"iana","extensions":["rpss"]},"application/vnd.novadigm.edm":{"source":"iana","extensions":["edm"]},"application/vnd.novadigm.edx":{"source":"iana","extensions":["edx"]},"application/vnd.novadigm.ext":{"source":"iana","extensions":["ext"]},"application/vnd.ntt-local.content-share":{"source":"iana"},"application/vnd.ntt-local.file-transfer":{"source":"iana"},"application/vnd.ntt-local.ogw_remote-access":{"source":"iana"},"application/vnd.ntt-local.sip-ta_remote":{"source":"iana"},"application/vnd.ntt-local.sip-ta_tcp_stream":{"source":"iana"},"application/vnd.oasis.opendocument.chart":{"source":"iana","extensions":["odc"]},"application/vnd.oasis.opendocument.chart-template":{"source":"iana","extensions":["otc"]},"application/vnd.oasis.opendocument.database":{"source":"iana","extensions":["odb"]},"application/vnd.oasis.opendocument.formula":{"source":"iana","extensions":["odf"]},"application/vnd.oasis.opendocument.formula-template":{"source":"iana","extensions":["odft"]},"application/vnd.oasis.opendocument.graphics":{"source":"iana","compressible":false,"extensions":["odg"]},"application/vnd.oasis.opendocument.graphics-template":{"source":"iana","extensions":["otg"]},"application/vnd.oasis.opendocument.image":{"source":"iana","extensions":["odi"]},"application/vnd.oasis.opendocument.image-template":{"source":"iana","extensions":["oti"]},"application/vnd.oasis.opendocument.presentation":{"source":"iana","compressible":false,"extensions":["odp"]},"application/vnd.oasis.opendocument.presentation-template":{"source":"iana","extensions":["otp"]},"application/vnd.oasis.opendocument.spreadsheet":{"source":"iana","compressible":false,"extensions":["ods"]},"application/vnd.oasis.opendocument.spreadsheet-template":{"source":"iana","extensions":["ots"]},"application/vnd.oasis.opendocument.text":{"source":"iana","compressible":false,"extensions":["odt"]},"application/vnd.oasis.opendocument.text-master":{"source":"iana","extensions":["odm"]},"application/vnd.oasis.opendocument.text-template":{"source":"iana","extensions":["ott"]},"application/vnd.oasis.opendocument.text-web":{"source":"iana","extensions":["oth"]},"application/vnd.obn":{"source":"iana"},"application/vnd.ocf+cbor":{"source":"iana"},"application/vnd.oci.image.manifest.v1+json":{"source":"iana","compressible":true},"application/vnd.oftn.l10n+json":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessdownload+xml":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessstreaming+xml":{"source":"iana","compressible":true},"application/vnd.oipf.cspg-hexbinary":{"source":"iana"},"application/vnd.oipf.dae.svg+xml":{"source":"iana","compressible":true},"application/vnd.oipf.dae.xhtml+xml":{"source":"iana","compressible":true},"application/vnd.oipf.mippvcontrolmessage+xml":{"source":"iana","compressible":true},"application/vnd.oipf.pae.gem":{"source":"iana"},"application/vnd.oipf.spdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.oipf.spdlist+xml":{"source":"iana","compressible":true},"application/vnd.oipf.ueprofile+xml":{"source":"iana","compressible":true},"application/vnd.oipf.userprofile+xml":{"source":"iana","compressible":true},"application/vnd.olpc-sugar":{"source":"iana","extensions":["xo"]},"application/vnd.oma-scws-config":{"source":"iana"},"application/vnd.oma-scws-http-request":{"source":"iana"},"application/vnd.oma-scws-http-response":{"source":"iana"},"application/vnd.oma.bcast.associated-procedure-parameter+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.drm-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.imd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.ltkm":{"source":"iana"},"application/vnd.oma.bcast.notification+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.provisioningtrigger":{"source":"iana"},"application/vnd.oma.bcast.sgboot":{"source":"iana"},"application/vnd.oma.bcast.sgdd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sgdu":{"source":"iana"},"application/vnd.oma.bcast.simple-symbol-container":{"source":"iana"},"application/vnd.oma.bcast.smartcard-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sprov+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.stkm":{"source":"iana"},"application/vnd.oma.cab-address-book+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-feature-handler+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-pcc+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-subs-invite+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-user-prefs+xml":{"source":"iana","compressible":true},"application/vnd.oma.dcd":{"source":"iana"},"application/vnd.oma.dcdc":{"source":"iana"},"application/vnd.oma.dd2+xml":{"source":"iana","compressible":true,"extensions":["dd2"]},"application/vnd.oma.drm.risd+xml":{"source":"iana","compressible":true},"application/vnd.oma.group-usage-list+xml":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+cbor":{"source":"iana"},"application/vnd.oma.lwm2m+json":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+tlv":{"source":"iana"},"application/vnd.oma.pal+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.detailed-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.final-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.groups+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.invocation-descriptor+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.optimized-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.push":{"source":"iana"},"application/vnd.oma.scidm.messages+xml":{"source":"iana","compressible":true},"application/vnd.oma.xcap-directory+xml":{"source":"iana","compressible":true},"application/vnd.omads-email+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-file+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-folder+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omaloc-supl-init":{"source":"iana"},"application/vnd.onepager":{"source":"iana"},"application/vnd.onepagertamp":{"source":"iana"},"application/vnd.onepagertamx":{"source":"iana"},"application/vnd.onepagertat":{"source":"iana"},"application/vnd.onepagertatp":{"source":"iana"},"application/vnd.onepagertatx":{"source":"iana"},"application/vnd.openblox.game+xml":{"source":"iana","compressible":true,"extensions":["obgx"]},"application/vnd.openblox.game-binary":{"source":"iana"},"application/vnd.openeye.oeb":{"source":"iana"},"application/vnd.openofficeorg.extension":{"source":"apache","extensions":["oxt"]},"application/vnd.openstreetmap.data+xml":{"source":"iana","compressible":true,"extensions":["osm"]},"application/vnd.opentimestamps.ots":{"source":"iana"},"application/vnd.openxmlformats-officedocument.custom-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.customxmlproperties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawing+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chart+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.extended-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presentation":{"source":"iana","compressible":false,"extensions":["pptx"]},"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slide":{"source":"iana","extensions":["sldx"]},"application/vnd.openxmlformats-officedocument.presentationml.slide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideshow":{"source":"iana","extensions":["ppsx"]},"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tags+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.template":{"source":"iana","extensions":["potx"]},"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":{"source":"iana","compressible":false,"extensions":["xlsx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.template":{"source":"iana","extensions":["xltx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.theme+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.themeoverride+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.vmldrawing":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document":{"source":"iana","compressible":false,"extensions":["docx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.template":{"source":"iana","extensions":["dotx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.core-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.relationships+xml":{"source":"iana","compressible":true},"application/vnd.oracle.resource+json":{"source":"iana","compressible":true},"application/vnd.orange.indata":{"source":"iana"},"application/vnd.osa.netdeploy":{"source":"iana"},"application/vnd.osgeo.mapguide.package":{"source":"iana","extensions":["mgp"]},"application/vnd.osgi.bundle":{"source":"iana"},"application/vnd.osgi.dp":{"source":"iana","extensions":["dp"]},"application/vnd.osgi.subsystem":{"source":"iana","extensions":["esa"]},"application/vnd.otps.ct-kip+xml":{"source":"iana","compressible":true},"application/vnd.oxli.countgraph":{"source":"iana"},"application/vnd.pagerduty+json":{"source":"iana","compressible":true},"application/vnd.palm":{"source":"iana","extensions":["pdb","pqa","oprc"]},"application/vnd.panoply":{"source":"iana"},"application/vnd.paos.xml":{"source":"iana"},"application/vnd.patentdive":{"source":"iana"},"application/vnd.patientecommsdoc":{"source":"iana"},"application/vnd.pawaafile":{"source":"iana","extensions":["paw"]},"application/vnd.pcos":{"source":"iana"},"application/vnd.pg.format":{"source":"iana","extensions":["str"]},"application/vnd.pg.osasli":{"source":"iana","extensions":["ei6"]},"application/vnd.piaccess.application-licence":{"source":"iana"},"application/vnd.picsel":{"source":"iana","extensions":["efif"]},"application/vnd.pmi.widget":{"source":"iana","extensions":["wg"]},"application/vnd.poc.group-advertisement+xml":{"source":"iana","compressible":true},"application/vnd.pocketlearn":{"source":"iana","extensions":["plf"]},"application/vnd.powerbuilder6":{"source":"iana","extensions":["pbd"]},"application/vnd.powerbuilder6-s":{"source":"iana"},"application/vnd.powerbuilder7":{"source":"iana"},"application/vnd.powerbuilder7-s":{"source":"iana"},"application/vnd.powerbuilder75":{"source":"iana"},"application/vnd.powerbuilder75-s":{"source":"iana"},"application/vnd.preminet":{"source":"iana"},"application/vnd.previewsystems.box":{"source":"iana","extensions":["box"]},"application/vnd.proteus.magazine":{"source":"iana","extensions":["mgz"]},"application/vnd.psfs":{"source":"iana"},"application/vnd.publishare-delta-tree":{"source":"iana","extensions":["qps"]},"application/vnd.pvi.ptid1":{"source":"iana","extensions":["ptid"]},"application/vnd.pwg-multiplexed":{"source":"iana"},"application/vnd.pwg-xhtml-print+xml":{"source":"iana","compressible":true},"application/vnd.qualcomm.brew-app-res":{"source":"iana"},"application/vnd.quarantainenet":{"source":"iana"},"application/vnd.quark.quarkxpress":{"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},"application/vnd.quobject-quoxdocument":{"source":"iana"},"application/vnd.radisys.moml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conn+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-stream+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-base+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-detect+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-sendrecv+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-group+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-speech+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-transform+xml":{"source":"iana","compressible":true},"application/vnd.rainstor.data":{"source":"iana"},"application/vnd.rapid":{"source":"iana"},"application/vnd.rar":{"source":"iana","extensions":["rar"]},"application/vnd.realvnc.bed":{"source":"iana","extensions":["bed"]},"application/vnd.recordare.musicxml":{"source":"iana","extensions":["mxl"]},"application/vnd.recordare.musicxml+xml":{"source":"iana","compressible":true,"extensions":["musicxml"]},"application/vnd.renlearn.rlprint":{"source":"iana"},"application/vnd.resilient.logic":{"source":"iana"},"application/vnd.restful+json":{"source":"iana","compressible":true},"application/vnd.rig.cryptonote":{"source":"iana","extensions":["cryptonote"]},"application/vnd.rim.cod":{"source":"apache","extensions":["cod"]},"application/vnd.rn-realmedia":{"source":"apache","extensions":["rm"]},"application/vnd.rn-realmedia-vbr":{"source":"apache","extensions":["rmvb"]},"application/vnd.route66.link66+xml":{"source":"iana","compressible":true,"extensions":["link66"]},"application/vnd.rs-274x":{"source":"iana"},"application/vnd.ruckus.download":{"source":"iana"},"application/vnd.s3sms":{"source":"iana"},"application/vnd.sailingtracker.track":{"source":"iana","extensions":["st"]},"application/vnd.sar":{"source":"iana"},"application/vnd.sbm.cid":{"source":"iana"},"application/vnd.sbm.mid2":{"source":"iana"},"application/vnd.scribus":{"source":"iana"},"application/vnd.sealed.3df":{"source":"iana"},"application/vnd.sealed.csf":{"source":"iana"},"application/vnd.sealed.doc":{"source":"iana"},"application/vnd.sealed.eml":{"source":"iana"},"application/vnd.sealed.mht":{"source":"iana"},"application/vnd.sealed.net":{"source":"iana"},"application/vnd.sealed.ppt":{"source":"iana"},"application/vnd.sealed.tiff":{"source":"iana"},"application/vnd.sealed.xls":{"source":"iana"},"application/vnd.sealedmedia.softseal.html":{"source":"iana"},"application/vnd.sealedmedia.softseal.pdf":{"source":"iana"},"application/vnd.seemail":{"source":"iana","extensions":["see"]},"application/vnd.seis+json":{"source":"iana","compressible":true},"application/vnd.sema":{"source":"iana","extensions":["sema"]},"application/vnd.semd":{"source":"iana","extensions":["semd"]},"application/vnd.semf":{"source":"iana","extensions":["semf"]},"application/vnd.shade-save-file":{"source":"iana"},"application/vnd.shana.informed.formdata":{"source":"iana","extensions":["ifm"]},"application/vnd.shana.informed.formtemplate":{"source":"iana","extensions":["itp"]},"application/vnd.shana.informed.interchange":{"source":"iana","extensions":["iif"]},"application/vnd.shana.informed.package":{"source":"iana","extensions":["ipk"]},"application/vnd.shootproof+json":{"source":"iana","compressible":true},"application/vnd.shopkick+json":{"source":"iana","compressible":true},"application/vnd.shp":{"source":"iana"},"application/vnd.shx":{"source":"iana"},"application/vnd.sigrok.session":{"source":"iana"},"application/vnd.simtech-mindmapper":{"source":"iana","extensions":["twd","twds"]},"application/vnd.siren+json":{"source":"iana","compressible":true},"application/vnd.smaf":{"source":"iana","extensions":["mmf"]},"application/vnd.smart.notebook":{"source":"iana"},"application/vnd.smart.teacher":{"source":"iana","extensions":["teacher"]},"application/vnd.snesdev-page-table":{"source":"iana"},"application/vnd.software602.filler.form+xml":{"source":"iana","compressible":true,"extensions":["fo"]},"application/vnd.software602.filler.form-xml-zip":{"source":"iana"},"application/vnd.solent.sdkm+xml":{"source":"iana","compressible":true,"extensions":["sdkm","sdkd"]},"application/vnd.spotfire.dxp":{"source":"iana","extensions":["dxp"]},"application/vnd.spotfire.sfs":{"source":"iana","extensions":["sfs"]},"application/vnd.sqlite3":{"source":"iana"},"application/vnd.sss-cod":{"source":"iana"},"application/vnd.sss-dtf":{"source":"iana"},"application/vnd.sss-ntf":{"source":"iana"},"application/vnd.stardivision.calc":{"source":"apache","extensions":["sdc"]},"application/vnd.stardivision.draw":{"source":"apache","extensions":["sda"]},"application/vnd.stardivision.impress":{"source":"apache","extensions":["sdd"]},"application/vnd.stardivision.math":{"source":"apache","extensions":["smf"]},"application/vnd.stardivision.writer":{"source":"apache","extensions":["sdw","vor"]},"application/vnd.stardivision.writer-global":{"source":"apache","extensions":["sgl"]},"application/vnd.stepmania.package":{"source":"iana","extensions":["smzip"]},"application/vnd.stepmania.stepchart":{"source":"iana","extensions":["sm"]},"application/vnd.street-stream":{"source":"iana"},"application/vnd.sun.wadl+xml":{"source":"iana","compressible":true,"extensions":["wadl"]},"application/vnd.sun.xml.calc":{"source":"apache","extensions":["sxc"]},"application/vnd.sun.xml.calc.template":{"source":"apache","extensions":["stc"]},"application/vnd.sun.xml.draw":{"source":"apache","extensions":["sxd"]},"application/vnd.sun.xml.draw.template":{"source":"apache","extensions":["std"]},"application/vnd.sun.xml.impress":{"source":"apache","extensions":["sxi"]},"application/vnd.sun.xml.impress.template":{"source":"apache","extensions":["sti"]},"application/vnd.sun.xml.math":{"source":"apache","extensions":["sxm"]},"application/vnd.sun.xml.writer":{"source":"apache","extensions":["sxw"]},"application/vnd.sun.xml.writer.global":{"source":"apache","extensions":["sxg"]},"application/vnd.sun.xml.writer.template":{"source":"apache","extensions":["stw"]},"application/vnd.sus-calendar":{"source":"iana","extensions":["sus","susp"]},"application/vnd.svd":{"source":"iana","extensions":["svd"]},"application/vnd.swiftview-ics":{"source":"iana"},"application/vnd.sycle+xml":{"source":"iana","compressible":true},"application/vnd.syft+json":{"source":"iana","compressible":true},"application/vnd.symbian.install":{"source":"apache","extensions":["sis","sisx"]},"application/vnd.syncml+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xsm"]},"application/vnd.syncml.dm+wbxml":{"source":"iana","charset":"UTF-8","extensions":["bdm"]},"application/vnd.syncml.dm+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xdm"]},"application/vnd.syncml.dm.notification":{"source":"iana"},"application/vnd.syncml.dmddf+wbxml":{"source":"iana"},"application/vnd.syncml.dmddf+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["ddf"]},"application/vnd.syncml.dmtnds+wbxml":{"source":"iana"},"application/vnd.syncml.dmtnds+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.syncml.ds.notification":{"source":"iana"},"application/vnd.tableschema+json":{"source":"iana","compressible":true},"application/vnd.tao.intent-module-archive":{"source":"iana","extensions":["tao"]},"application/vnd.tcpdump.pcap":{"source":"iana","extensions":["pcap","cap","dmp"]},"application/vnd.think-cell.ppttc+json":{"source":"iana","compressible":true},"application/vnd.tmd.mediaflex.api+xml":{"source":"iana","compressible":true},"application/vnd.tml":{"source":"iana"},"application/vnd.tmobile-livetv":{"source":"iana","extensions":["tmo"]},"application/vnd.tri.onesource":{"source":"iana"},"application/vnd.trid.tpt":{"source":"iana","extensions":["tpt"]},"application/vnd.triscape.mxs":{"source":"iana","extensions":["mxs"]},"application/vnd.trueapp":{"source":"iana","extensions":["tra"]},"application/vnd.truedoc":{"source":"iana"},"application/vnd.ubisoft.webplayer":{"source":"iana"},"application/vnd.ufdl":{"source":"iana","extensions":["ufd","ufdl"]},"application/vnd.uiq.theme":{"source":"iana","extensions":["utz"]},"application/vnd.umajin":{"source":"iana","extensions":["umj"]},"application/vnd.unity":{"source":"iana","extensions":["unityweb"]},"application/vnd.uoml+xml":{"source":"iana","compressible":true,"extensions":["uoml"]},"application/vnd.uplanet.alert":{"source":"iana"},"application/vnd.uplanet.alert-wbxml":{"source":"iana"},"application/vnd.uplanet.bearer-choice":{"source":"iana"},"application/vnd.uplanet.bearer-choice-wbxml":{"source":"iana"},"application/vnd.uplanet.cacheop":{"source":"iana"},"application/vnd.uplanet.cacheop-wbxml":{"source":"iana"},"application/vnd.uplanet.channel":{"source":"iana"},"application/vnd.uplanet.channel-wbxml":{"source":"iana"},"application/vnd.uplanet.list":{"source":"iana"},"application/vnd.uplanet.list-wbxml":{"source":"iana"},"application/vnd.uplanet.listcmd":{"source":"iana"},"application/vnd.uplanet.listcmd-wbxml":{"source":"iana"},"application/vnd.uplanet.signal":{"source":"iana"},"application/vnd.uri-map":{"source":"iana"},"application/vnd.valve.source.material":{"source":"iana"},"application/vnd.vcx":{"source":"iana","extensions":["vcx"]},"application/vnd.vd-study":{"source":"iana"},"application/vnd.vectorworks":{"source":"iana"},"application/vnd.vel+json":{"source":"iana","compressible":true},"application/vnd.verimatrix.vcas":{"source":"iana"},"application/vnd.veritone.aion+json":{"source":"iana","compressible":true},"application/vnd.veryant.thin":{"source":"iana"},"application/vnd.ves.encrypted":{"source":"iana"},"application/vnd.vidsoft.vidconference":{"source":"iana"},"application/vnd.visio":{"source":"iana","extensions":["vsd","vst","vss","vsw"]},"application/vnd.visionary":{"source":"iana","extensions":["vis"]},"application/vnd.vividence.scriptfile":{"source":"iana"},"application/vnd.vsf":{"source":"iana","extensions":["vsf"]},"application/vnd.wap.sic":{"source":"iana"},"application/vnd.wap.slc":{"source":"iana"},"application/vnd.wap.wbxml":{"source":"iana","charset":"UTF-8","extensions":["wbxml"]},"application/vnd.wap.wmlc":{"source":"iana","extensions":["wmlc"]},"application/vnd.wap.wmlscriptc":{"source":"iana","extensions":["wmlsc"]},"application/vnd.webturbo":{"source":"iana","extensions":["wtb"]},"application/vnd.wfa.dpp":{"source":"iana"},"application/vnd.wfa.p2p":{"source":"iana"},"application/vnd.wfa.wsc":{"source":"iana"},"application/vnd.windows.devicepairing":{"source":"iana"},"application/vnd.wmc":{"source":"iana"},"application/vnd.wmf.bootstrap":{"source":"iana"},"application/vnd.wolfram.mathematica":{"source":"iana"},"application/vnd.wolfram.mathematica.package":{"source":"iana"},"application/vnd.wolfram.player":{"source":"iana","extensions":["nbp"]},"application/vnd.wordperfect":{"source":"iana","extensions":["wpd"]},"application/vnd.wqd":{"source":"iana","extensions":["wqd"]},"application/vnd.wrq-hp3000-labelled":{"source":"iana"},"application/vnd.wt.stf":{"source":"iana","extensions":["stf"]},"application/vnd.wv.csp+wbxml":{"source":"iana"},"application/vnd.wv.csp+xml":{"source":"iana","compressible":true},"application/vnd.wv.ssp+xml":{"source":"iana","compressible":true},"application/vnd.xacml+json":{"source":"iana","compressible":true},"application/vnd.xara":{"source":"iana","extensions":["xar"]},"application/vnd.xfdl":{"source":"iana","extensions":["xfdl"]},"application/vnd.xfdl.webform":{"source":"iana"},"application/vnd.xmi+xml":{"source":"iana","compressible":true},"application/vnd.xmpie.cpkg":{"source":"iana"},"application/vnd.xmpie.dpkg":{"source":"iana"},"application/vnd.xmpie.plan":{"source":"iana"},"application/vnd.xmpie.ppkg":{"source":"iana"},"application/vnd.xmpie.xlim":{"source":"iana"},"application/vnd.yamaha.hv-dic":{"source":"iana","extensions":["hvd"]},"application/vnd.yamaha.hv-script":{"source":"iana","extensions":["hvs"]},"application/vnd.yamaha.hv-voice":{"source":"iana","extensions":["hvp"]},"application/vnd.yamaha.openscoreformat":{"source":"iana","extensions":["osf"]},"application/vnd.yamaha.openscoreformat.osfpvg+xml":{"source":"iana","compressible":true,"extensions":["osfpvg"]},"application/vnd.yamaha.remote-setup":{"source":"iana"},"application/vnd.yamaha.smaf-audio":{"source":"iana","extensions":["saf"]},"application/vnd.yamaha.smaf-phrase":{"source":"iana","extensions":["spf"]},"application/vnd.yamaha.through-ngn":{"source":"iana"},"application/vnd.yamaha.tunnel-udpencap":{"source":"iana"},"application/vnd.yaoweme":{"source":"iana"},"application/vnd.yellowriver-custom-menu":{"source":"iana","extensions":["cmp"]},"application/vnd.youtube.yt":{"source":"iana"},"application/vnd.zul":{"source":"iana","extensions":["zir","zirz"]},"application/vnd.zzazz.deck+xml":{"source":"iana","compressible":true,"extensions":["zaz"]},"application/voicexml+xml":{"source":"iana","compressible":true,"extensions":["vxml"]},"application/voucher-cms+json":{"source":"iana","compressible":true},"application/vq-rtcpxr":{"source":"iana"},"application/wasm":{"source":"iana","compressible":true,"extensions":["wasm"]},"application/watcherinfo+xml":{"source":"iana","compressible":true,"extensions":["wif"]},"application/webpush-options+json":{"source":"iana","compressible":true},"application/whoispp-query":{"source":"iana"},"application/whoispp-response":{"source":"iana"},"application/widget":{"source":"iana","extensions":["wgt"]},"application/winhlp":{"source":"apache","extensions":["hlp"]},"application/wita":{"source":"iana"},"application/wordperfect5.1":{"source":"iana"},"application/wsdl+xml":{"source":"iana","compressible":true,"extensions":["wsdl"]},"application/wspolicy+xml":{"source":"iana","compressible":true,"extensions":["wspolicy"]},"application/x-7z-compressed":{"source":"apache","compressible":false,"extensions":["7z"]},"application/x-abiword":{"source":"apache","extensions":["abw"]},"application/x-ace-compressed":{"source":"apache","extensions":["ace"]},"application/x-amf":{"source":"apache"},"application/x-apple-diskimage":{"source":"apache","extensions":["dmg"]},"application/x-arj":{"compressible":false,"extensions":["arj"]},"application/x-authorware-bin":{"source":"apache","extensions":["aab","x32","u32","vox"]},"application/x-authorware-map":{"source":"apache","extensions":["aam"]},"application/x-authorware-seg":{"source":"apache","extensions":["aas"]},"application/x-bcpio":{"source":"apache","extensions":["bcpio"]},"application/x-bdoc":{"compressible":false,"extensions":["bdoc"]},"application/x-bittorrent":{"source":"apache","extensions":["torrent"]},"application/x-blorb":{"source":"apache","extensions":["blb","blorb"]},"application/x-bzip":{"source":"apache","compressible":false,"extensions":["bz"]},"application/x-bzip2":{"source":"apache","compressible":false,"extensions":["bz2","boz"]},"application/x-cbr":{"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},"application/x-cdlink":{"source":"apache","extensions":["vcd"]},"application/x-cfs-compressed":{"source":"apache","extensions":["cfs"]},"application/x-chat":{"source":"apache","extensions":["chat"]},"application/x-chess-pgn":{"source":"apache","extensions":["pgn"]},"application/x-chrome-extension":{"extensions":["crx"]},"application/x-cocoa":{"source":"nginx","extensions":["cco"]},"application/x-compress":{"source":"apache"},"application/x-conference":{"source":"apache","extensions":["nsc"]},"application/x-cpio":{"source":"apache","extensions":["cpio"]},"application/x-csh":{"source":"apache","extensions":["csh"]},"application/x-deb":{"compressible":false},"application/x-debian-package":{"source":"apache","extensions":["deb","udeb"]},"application/x-dgc-compressed":{"source":"apache","extensions":["dgc"]},"application/x-director":{"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},"application/x-doom":{"source":"apache","extensions":["wad"]},"application/x-dtbncx+xml":{"source":"apache","compressible":true,"extensions":["ncx"]},"application/x-dtbook+xml":{"source":"apache","compressible":true,"extensions":["dtb"]},"application/x-dtbresource+xml":{"source":"apache","compressible":true,"extensions":["res"]},"application/x-dvi":{"source":"apache","compressible":false,"extensions":["dvi"]},"application/x-envoy":{"source":"apache","extensions":["evy"]},"application/x-eva":{"source":"apache","extensions":["eva"]},"application/x-font-bdf":{"source":"apache","extensions":["bdf"]},"application/x-font-dos":{"source":"apache"},"application/x-font-framemaker":{"source":"apache"},"application/x-font-ghostscript":{"source":"apache","extensions":["gsf"]},"application/x-font-libgrx":{"source":"apache"},"application/x-font-linux-psf":{"source":"apache","extensions":["psf"]},"application/x-font-pcf":{"source":"apache","extensions":["pcf"]},"application/x-font-snf":{"source":"apache","extensions":["snf"]},"application/x-font-speedo":{"source":"apache"},"application/x-font-sunos-news":{"source":"apache"},"application/x-font-type1":{"source":"apache","extensions":["pfa","pfb","pfm","afm"]},"application/x-font-vfont":{"source":"apache"},"application/x-freearc":{"source":"apache","extensions":["arc"]},"application/x-futuresplash":{"source":"apache","extensions":["spl"]},"application/x-gca-compressed":{"source":"apache","extensions":["gca"]},"application/x-glulx":{"source":"apache","extensions":["ulx"]},"application/x-gnumeric":{"source":"apache","extensions":["gnumeric"]},"application/x-gramps-xml":{"source":"apache","extensions":["gramps"]},"application/x-gtar":{"source":"apache","extensions":["gtar"]},"application/x-gzip":{"source":"apache"},"application/x-hdf":{"source":"apache","extensions":["hdf"]},"application/x-httpd-php":{"compressible":true,"extensions":["php"]},"application/x-install-instructions":{"source":"apache","extensions":["install"]},"application/x-iso9660-image":{"source":"apache","extensions":["iso"]},"application/x-iwork-keynote-sffkey":{"extensions":["key"]},"application/x-iwork-numbers-sffnumbers":{"extensions":["numbers"]},"application/x-iwork-pages-sffpages":{"extensions":["pages"]},"application/x-java-archive-diff":{"source":"nginx","extensions":["jardiff"]},"application/x-java-jnlp-file":{"source":"apache","compressible":false,"extensions":["jnlp"]},"application/x-javascript":{"compressible":true},"application/x-keepass2":{"extensions":["kdbx"]},"application/x-latex":{"source":"apache","compressible":false,"extensions":["latex"]},"application/x-lua-bytecode":{"extensions":["luac"]},"application/x-lzh-compressed":{"source":"apache","extensions":["lzh","lha"]},"application/x-makeself":{"source":"nginx","extensions":["run"]},"application/x-mie":{"source":"apache","extensions":["mie"]},"application/x-mobipocket-ebook":{"source":"apache","extensions":["prc","mobi"]},"application/x-mpegurl":{"compressible":false},"application/x-ms-application":{"source":"apache","extensions":["application"]},"application/x-ms-shortcut":{"source":"apache","extensions":["lnk"]},"application/x-ms-wmd":{"source":"apache","extensions":["wmd"]},"application/x-ms-wmz":{"source":"apache","extensions":["wmz"]},"application/x-ms-xbap":{"source":"apache","extensions":["xbap"]},"application/x-msaccess":{"source":"apache","extensions":["mdb"]},"application/x-msbinder":{"source":"apache","extensions":["obd"]},"application/x-mscardfile":{"source":"apache","extensions":["crd"]},"application/x-msclip":{"source":"apache","extensions":["clp"]},"application/x-msdos-program":{"extensions":["exe"]},"application/x-msdownload":{"source":"apache","extensions":["exe","dll","com","bat","msi"]},"application/x-msmediaview":{"source":"apache","extensions":["mvb","m13","m14"]},"application/x-msmetafile":{"source":"apache","extensions":["wmf","wmz","emf","emz"]},"application/x-msmoney":{"source":"apache","extensions":["mny"]},"application/x-mspublisher":{"source":"apache","extensions":["pub"]},"application/x-msschedule":{"source":"apache","extensions":["scd"]},"application/x-msterminal":{"source":"apache","extensions":["trm"]},"application/x-mswrite":{"source":"apache","extensions":["wri"]},"application/x-netcdf":{"source":"apache","extensions":["nc","cdf"]},"application/x-ns-proxy-autoconfig":{"compressible":true,"extensions":["pac"]},"application/x-nzb":{"source":"apache","extensions":["nzb"]},"application/x-perl":{"source":"nginx","extensions":["pl","pm"]},"application/x-pilot":{"source":"nginx","extensions":["prc","pdb"]},"application/x-pkcs12":{"source":"apache","compressible":false,"extensions":["p12","pfx"]},"application/x-pkcs7-certificates":{"source":"apache","extensions":["p7b","spc"]},"application/x-pkcs7-certreqresp":{"source":"apache","extensions":["p7r"]},"application/x-pki-message":{"source":"iana"},"application/x-rar-compressed":{"source":"apache","compressible":false,"extensions":["rar"]},"application/x-redhat-package-manager":{"source":"nginx","extensions":["rpm"]},"application/x-research-info-systems":{"source":"apache","extensions":["ris"]},"application/x-sea":{"source":"nginx","extensions":["sea"]},"application/x-sh":{"source":"apache","compressible":true,"extensions":["sh"]},"application/x-shar":{"source":"apache","extensions":["shar"]},"application/x-shockwave-flash":{"source":"apache","compressible":false,"extensions":["swf"]},"application/x-silverlight-app":{"source":"apache","extensions":["xap"]},"application/x-sql":{"source":"apache","extensions":["sql"]},"application/x-stuffit":{"source":"apache","compressible":false,"extensions":["sit"]},"application/x-stuffitx":{"source":"apache","extensions":["sitx"]},"application/x-subrip":{"source":"apache","extensions":["srt"]},"application/x-sv4cpio":{"source":"apache","extensions":["sv4cpio"]},"application/x-sv4crc":{"source":"apache","extensions":["sv4crc"]},"application/x-t3vm-image":{"source":"apache","extensions":["t3"]},"application/x-tads":{"source":"apache","extensions":["gam"]},"application/x-tar":{"source":"apache","compressible":true,"extensions":["tar"]},"application/x-tcl":{"source":"apache","extensions":["tcl","tk"]},"application/x-tex":{"source":"apache","extensions":["tex"]},"application/x-tex-tfm":{"source":"apache","extensions":["tfm"]},"application/x-texinfo":{"source":"apache","extensions":["texinfo","texi"]},"application/x-tgif":{"source":"apache","extensions":["obj"]},"application/x-ustar":{"source":"apache","extensions":["ustar"]},"application/x-virtualbox-hdd":{"compressible":true,"extensions":["hdd"]},"application/x-virtualbox-ova":{"compressible":true,"extensions":["ova"]},"application/x-virtualbox-ovf":{"compressible":true,"extensions":["ovf"]},"application/x-virtualbox-vbox":{"compressible":true,"extensions":["vbox"]},"application/x-virtualbox-vbox-extpack":{"compressible":false,"extensions":["vbox-extpack"]},"application/x-virtualbox-vdi":{"compressible":true,"extensions":["vdi"]},"application/x-virtualbox-vhd":{"compressible":true,"extensions":["vhd"]},"application/x-virtualbox-vmdk":{"compressible":true,"extensions":["vmdk"]},"application/x-wais-source":{"source":"apache","extensions":["src"]},"application/x-web-app-manifest+json":{"compressible":true,"extensions":["webapp"]},"application/x-www-form-urlencoded":{"source":"iana","compressible":true},"application/x-x509-ca-cert":{"source":"iana","extensions":["der","crt","pem"]},"application/x-x509-ca-ra-cert":{"source":"iana"},"application/x-x509-next-ca-cert":{"source":"iana"},"application/x-xfig":{"source":"apache","extensions":["fig"]},"application/x-xliff+xml":{"source":"apache","compressible":true,"extensions":["xlf"]},"application/x-xpinstall":{"source":"apache","compressible":false,"extensions":["xpi"]},"application/x-xz":{"source":"apache","extensions":["xz"]},"application/x-zmachine":{"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},"application/x400-bp":{"source":"iana"},"application/xacml+xml":{"source":"iana","compressible":true},"application/xaml+xml":{"source":"apache","compressible":true,"extensions":["xaml"]},"application/xcap-att+xml":{"source":"iana","compressible":true,"extensions":["xav"]},"application/xcap-caps+xml":{"source":"iana","compressible":true,"extensions":["xca"]},"application/xcap-diff+xml":{"source":"iana","compressible":true,"extensions":["xdf"]},"application/xcap-el+xml":{"source":"iana","compressible":true,"extensions":["xel"]},"application/xcap-error+xml":{"source":"iana","compressible":true},"application/xcap-ns+xml":{"source":"iana","compressible":true,"extensions":["xns"]},"application/xcon-conference-info+xml":{"source":"iana","compressible":true},"application/xcon-conference-info-diff+xml":{"source":"iana","compressible":true},"application/xenc+xml":{"source":"iana","compressible":true,"extensions":["xenc"]},"application/xhtml+xml":{"source":"iana","compressible":true,"extensions":["xhtml","xht"]},"application/xhtml-voice+xml":{"source":"apache","compressible":true},"application/xliff+xml":{"source":"iana","compressible":true,"extensions":["xlf"]},"application/xml":{"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},"application/xml-dtd":{"source":"iana","compressible":true,"extensions":["dtd"]},"application/xml-external-parsed-entity":{"source":"iana"},"application/xml-patch+xml":{"source":"iana","compressible":true},"application/xmpp+xml":{"source":"iana","compressible":true},"application/xop+xml":{"source":"iana","compressible":true,"extensions":["xop"]},"application/xproc+xml":{"source":"apache","compressible":true,"extensions":["xpl"]},"application/xslt+xml":{"source":"iana","compressible":true,"extensions":["xsl","xslt"]},"application/xspf+xml":{"source":"apache","compressible":true,"extensions":["xspf"]},"application/xv+xml":{"source":"iana","compressible":true,"extensions":["mxml","xhvml","xvml","xvm"]},"application/yang":{"source":"iana","extensions":["yang"]},"application/yang-data+json":{"source":"iana","compressible":true},"application/yang-data+xml":{"source":"iana","compressible":true},"application/yang-patch+json":{"source":"iana","compressible":true},"application/yang-patch+xml":{"source":"iana","compressible":true},"application/yin+xml":{"source":"iana","compressible":true,"extensions":["yin"]},"application/zip":{"source":"iana","compressible":false,"extensions":["zip"]},"application/zlib":{"source":"iana"},"application/zstd":{"source":"iana"},"audio/1d-interleaved-parityfec":{"source":"iana"},"audio/32kadpcm":{"source":"iana"},"audio/3gpp":{"source":"iana","compressible":false,"extensions":["3gpp"]},"audio/3gpp2":{"source":"iana"},"audio/aac":{"source":"iana"},"audio/ac3":{"source":"iana"},"audio/adpcm":{"source":"apache","extensions":["adp"]},"audio/amr":{"source":"iana","extensions":["amr"]},"audio/amr-wb":{"source":"iana"},"audio/amr-wb+":{"source":"iana"},"audio/aptx":{"source":"iana"},"audio/asc":{"source":"iana"},"audio/atrac-advanced-lossless":{"source":"iana"},"audio/atrac-x":{"source":"iana"},"audio/atrac3":{"source":"iana"},"audio/basic":{"source":"iana","compressible":false,"extensions":["au","snd"]},"audio/bv16":{"source":"iana"},"audio/bv32":{"source":"iana"},"audio/clearmode":{"source":"iana"},"audio/cn":{"source":"iana"},"audio/dat12":{"source":"iana"},"audio/dls":{"source":"iana"},"audio/dsr-es201108":{"source":"iana"},"audio/dsr-es202050":{"source":"iana"},"audio/dsr-es202211":{"source":"iana"},"audio/dsr-es202212":{"source":"iana"},"audio/dv":{"source":"iana"},"audio/dvi4":{"source":"iana"},"audio/eac3":{"source":"iana"},"audio/encaprtp":{"source":"iana"},"audio/evrc":{"source":"iana"},"audio/evrc-qcp":{"source":"iana"},"audio/evrc0":{"source":"iana"},"audio/evrc1":{"source":"iana"},"audio/evrcb":{"source":"iana"},"audio/evrcb0":{"source":"iana"},"audio/evrcb1":{"source":"iana"},"audio/evrcnw":{"source":"iana"},"audio/evrcnw0":{"source":"iana"},"audio/evrcnw1":{"source":"iana"},"audio/evrcwb":{"source":"iana"},"audio/evrcwb0":{"source":"iana"},"audio/evrcwb1":{"source":"iana"},"audio/evs":{"source":"iana"},"audio/flexfec":{"source":"iana"},"audio/fwdred":{"source":"iana"},"audio/g711-0":{"source":"iana"},"audio/g719":{"source":"iana"},"audio/g722":{"source":"iana"},"audio/g7221":{"source":"iana"},"audio/g723":{"source":"iana"},"audio/g726-16":{"source":"iana"},"audio/g726-24":{"source":"iana"},"audio/g726-32":{"source":"iana"},"audio/g726-40":{"source":"iana"},"audio/g728":{"source":"iana"},"audio/g729":{"source":"iana"},"audio/g7291":{"source":"iana"},"audio/g729d":{"source":"iana"},"audio/g729e":{"source":"iana"},"audio/gsm":{"source":"iana"},"audio/gsm-efr":{"source":"iana"},"audio/gsm-hr-08":{"source":"iana"},"audio/ilbc":{"source":"iana"},"audio/ip-mr_v2.5":{"source":"iana"},"audio/isac":{"source":"apache"},"audio/l16":{"source":"iana"},"audio/l20":{"source":"iana"},"audio/l24":{"source":"iana","compressible":false},"audio/l8":{"source":"iana"},"audio/lpc":{"source":"iana"},"audio/melp":{"source":"iana"},"audio/melp1200":{"source":"iana"},"audio/melp2400":{"source":"iana"},"audio/melp600":{"source":"iana"},"audio/mhas":{"source":"iana"},"audio/midi":{"source":"apache","extensions":["mid","midi","kar","rmi"]},"audio/mobile-xmf":{"source":"iana","extensions":["mxmf"]},"audio/mp3":{"compressible":false,"extensions":["mp3"]},"audio/mp4":{"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},"audio/mp4a-latm":{"source":"iana"},"audio/mpa":{"source":"iana"},"audio/mpa-robust":{"source":"iana"},"audio/mpeg":{"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},"audio/mpeg4-generic":{"source":"iana"},"audio/musepack":{"source":"apache"},"audio/ogg":{"source":"iana","compressible":false,"extensions":["oga","ogg","spx","opus"]},"audio/opus":{"source":"iana"},"audio/parityfec":{"source":"iana"},"audio/pcma":{"source":"iana"},"audio/pcma-wb":{"source":"iana"},"audio/pcmu":{"source":"iana"},"audio/pcmu-wb":{"source":"iana"},"audio/prs.sid":{"source":"iana"},"audio/qcelp":{"source":"iana"},"audio/raptorfec":{"source":"iana"},"audio/red":{"source":"iana"},"audio/rtp-enc-aescm128":{"source":"iana"},"audio/rtp-midi":{"source":"iana"},"audio/rtploopback":{"source":"iana"},"audio/rtx":{"source":"iana"},"audio/s3m":{"source":"apache","extensions":["s3m"]},"audio/scip":{"source":"iana"},"audio/silk":{"source":"apache","extensions":["sil"]},"audio/smv":{"source":"iana"},"audio/smv-qcp":{"source":"iana"},"audio/smv0":{"source":"iana"},"audio/sofa":{"source":"iana"},"audio/sp-midi":{"source":"iana"},"audio/speex":{"source":"iana"},"audio/t140c":{"source":"iana"},"audio/t38":{"source":"iana"},"audio/telephone-event":{"source":"iana"},"audio/tetra_acelp":{"source":"iana"},"audio/tetra_acelp_bb":{"source":"iana"},"audio/tone":{"source":"iana"},"audio/tsvcis":{"source":"iana"},"audio/uemclip":{"source":"iana"},"audio/ulpfec":{"source":"iana"},"audio/usac":{"source":"iana"},"audio/vdvi":{"source":"iana"},"audio/vmr-wb":{"source":"iana"},"audio/vnd.3gpp.iufp":{"source":"iana"},"audio/vnd.4sb":{"source":"iana"},"audio/vnd.audiokoz":{"source":"iana"},"audio/vnd.celp":{"source":"iana"},"audio/vnd.cisco.nse":{"source":"iana"},"audio/vnd.cmles.radio-events":{"source":"iana"},"audio/vnd.cns.anp1":{"source":"iana"},"audio/vnd.cns.inf1":{"source":"iana"},"audio/vnd.dece.audio":{"source":"iana","extensions":["uva","uvva"]},"audio/vnd.digital-winds":{"source":"iana","extensions":["eol"]},"audio/vnd.dlna.adts":{"source":"iana"},"audio/vnd.dolby.heaac.1":{"source":"iana"},"audio/vnd.dolby.heaac.2":{"source":"iana"},"audio/vnd.dolby.mlp":{"source":"iana"},"audio/vnd.dolby.mps":{"source":"iana"},"audio/vnd.dolby.pl2":{"source":"iana"},"audio/vnd.dolby.pl2x":{"source":"iana"},"audio/vnd.dolby.pl2z":{"source":"iana"},"audio/vnd.dolby.pulse.1":{"source":"iana"},"audio/vnd.dra":{"source":"iana","extensions":["dra"]},"audio/vnd.dts":{"source":"iana","extensions":["dts"]},"audio/vnd.dts.hd":{"source":"iana","extensions":["dtshd"]},"audio/vnd.dts.uhd":{"source":"iana"},"audio/vnd.dvb.file":{"source":"iana"},"audio/vnd.everad.plj":{"source":"iana"},"audio/vnd.hns.audio":{"source":"iana"},"audio/vnd.lucent.voice":{"source":"iana","extensions":["lvp"]},"audio/vnd.ms-playready.media.pya":{"source":"iana","extensions":["pya"]},"audio/vnd.nokia.mobile-xmf":{"source":"iana"},"audio/vnd.nortel.vbk":{"source":"iana"},"audio/vnd.nuera.ecelp4800":{"source":"iana","extensions":["ecelp4800"]},"audio/vnd.nuera.ecelp7470":{"source":"iana","extensions":["ecelp7470"]},"audio/vnd.nuera.ecelp9600":{"source":"iana","extensions":["ecelp9600"]},"audio/vnd.octel.sbc":{"source":"iana"},"audio/vnd.presonus.multitrack":{"source":"iana"},"audio/vnd.qcelp":{"source":"iana"},"audio/vnd.rhetorex.32kadpcm":{"source":"iana"},"audio/vnd.rip":{"source":"iana","extensions":["rip"]},"audio/vnd.rn-realaudio":{"compressible":false},"audio/vnd.sealedmedia.softseal.mpeg":{"source":"iana"},"audio/vnd.vmx.cvsd":{"source":"iana"},"audio/vnd.wave":{"compressible":false},"audio/vorbis":{"source":"iana","compressible":false},"audio/vorbis-config":{"source":"iana"},"audio/wav":{"compressible":false,"extensions":["wav"]},"audio/wave":{"compressible":false,"extensions":["wav"]},"audio/webm":{"source":"apache","compressible":false,"extensions":["weba"]},"audio/x-aac":{"source":"apache","compressible":false,"extensions":["aac"]},"audio/x-aiff":{"source":"apache","extensions":["aif","aiff","aifc"]},"audio/x-caf":{"source":"apache","compressible":false,"extensions":["caf"]},"audio/x-flac":{"source":"apache","extensions":["flac"]},"audio/x-m4a":{"source":"nginx","extensions":["m4a"]},"audio/x-matroska":{"source":"apache","extensions":["mka"]},"audio/x-mpegurl":{"source":"apache","extensions":["m3u"]},"audio/x-ms-wax":{"source":"apache","extensions":["wax"]},"audio/x-ms-wma":{"source":"apache","extensions":["wma"]},"audio/x-pn-realaudio":{"source":"apache","extensions":["ram","ra"]},"audio/x-pn-realaudio-plugin":{"source":"apache","extensions":["rmp"]},"audio/x-realaudio":{"source":"nginx","extensions":["ra"]},"audio/x-tta":{"source":"apache"},"audio/x-wav":{"source":"apache","extensions":["wav"]},"audio/xm":{"source":"apache","extensions":["xm"]},"chemical/x-cdx":{"source":"apache","extensions":["cdx"]},"chemical/x-cif":{"source":"apache","extensions":["cif"]},"chemical/x-cmdf":{"source":"apache","extensions":["cmdf"]},"chemical/x-cml":{"source":"apache","extensions":["cml"]},"chemical/x-csml":{"source":"apache","extensions":["csml"]},"chemical/x-pdb":{"source":"apache"},"chemical/x-xyz":{"source":"apache","extensions":["xyz"]},"font/collection":{"source":"iana","extensions":["ttc"]},"font/otf":{"source":"iana","compressible":true,"extensions":["otf"]},"font/sfnt":{"source":"iana"},"font/ttf":{"source":"iana","compressible":true,"extensions":["ttf"]},"font/woff":{"source":"iana","extensions":["woff"]},"font/woff2":{"source":"iana","extensions":["woff2"]},"image/aces":{"source":"iana","extensions":["exr"]},"image/apng":{"compressible":false,"extensions":["apng"]},"image/avci":{"source":"iana","extensions":["avci"]},"image/avcs":{"source":"iana","extensions":["avcs"]},"image/avif":{"source":"iana","compressible":false,"extensions":["avif"]},"image/bmp":{"source":"iana","compressible":true,"extensions":["bmp"]},"image/cgm":{"source":"iana","extensions":["cgm"]},"image/dicom-rle":{"source":"iana","extensions":["drle"]},"image/emf":{"source":"iana","extensions":["emf"]},"image/fits":{"source":"iana","extensions":["fits"]},"image/g3fax":{"source":"iana","extensions":["g3"]},"image/gif":{"source":"iana","compressible":false,"extensions":["gif"]},"image/heic":{"source":"iana","extensions":["heic"]},"image/heic-sequence":{"source":"iana","extensions":["heics"]},"image/heif":{"source":"iana","extensions":["heif"]},"image/heif-sequence":{"source":"iana","extensions":["heifs"]},"image/hej2k":{"source":"iana","extensions":["hej2"]},"image/hsj2":{"source":"iana","extensions":["hsj2"]},"image/ief":{"source":"iana","extensions":["ief"]},"image/jls":{"source":"iana","extensions":["jls"]},"image/jp2":{"source":"iana","compressible":false,"extensions":["jp2","jpg2"]},"image/jpeg":{"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},"image/jph":{"source":"iana","extensions":["jph"]},"image/jphc":{"source":"iana","extensions":["jhc"]},"image/jpm":{"source":"iana","compressible":false,"extensions":["jpm"]},"image/jpx":{"source":"iana","compressible":false,"extensions":["jpx","jpf"]},"image/jxr":{"source":"iana","extensions":["jxr"]},"image/jxra":{"source":"iana","extensions":["jxra"]},"image/jxrs":{"source":"iana","extensions":["jxrs"]},"image/jxs":{"source":"iana","extensions":["jxs"]},"image/jxsc":{"source":"iana","extensions":["jxsc"]},"image/jxsi":{"source":"iana","extensions":["jxsi"]},"image/jxss":{"source":"iana","extensions":["jxss"]},"image/ktx":{"source":"iana","extensions":["ktx"]},"image/ktx2":{"source":"iana","extensions":["ktx2"]},"image/naplps":{"source":"iana"},"image/pjpeg":{"compressible":false},"image/png":{"source":"iana","compressible":false,"extensions":["png"]},"image/prs.btif":{"source":"iana","extensions":["btif"]},"image/prs.pti":{"source":"iana","extensions":["pti"]},"image/pwg-raster":{"source":"iana"},"image/sgi":{"source":"apache","extensions":["sgi"]},"image/svg+xml":{"source":"iana","compressible":true,"extensions":["svg","svgz"]},"image/t38":{"source":"iana","extensions":["t38"]},"image/tiff":{"source":"iana","compressible":false,"extensions":["tif","tiff"]},"image/tiff-fx":{"source":"iana","extensions":["tfx"]},"image/vnd.adobe.photoshop":{"source":"iana","compressible":true,"extensions":["psd"]},"image/vnd.airzip.accelerator.azv":{"source":"iana","extensions":["azv"]},"image/vnd.cns.inf2":{"source":"iana"},"image/vnd.dece.graphic":{"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},"image/vnd.djvu":{"source":"iana","extensions":["djvu","djv"]},"image/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"image/vnd.dwg":{"source":"iana","extensions":["dwg"]},"image/vnd.dxf":{"source":"iana","extensions":["dxf"]},"image/vnd.fastbidsheet":{"source":"iana","extensions":["fbs"]},"image/vnd.fpx":{"source":"iana","extensions":["fpx"]},"image/vnd.fst":{"source":"iana","extensions":["fst"]},"image/vnd.fujixerox.edmics-mmr":{"source":"iana","extensions":["mmr"]},"image/vnd.fujixerox.edmics-rlc":{"source":"iana","extensions":["rlc"]},"image/vnd.globalgraphics.pgb":{"source":"iana"},"image/vnd.microsoft.icon":{"source":"iana","compressible":true,"extensions":["ico"]},"image/vnd.mix":{"source":"iana"},"image/vnd.mozilla.apng":{"source":"iana"},"image/vnd.ms-dds":{"compressible":true,"extensions":["dds"]},"image/vnd.ms-modi":{"source":"iana","extensions":["mdi"]},"image/vnd.ms-photo":{"source":"apache","extensions":["wdp"]},"image/vnd.net-fpx":{"source":"iana","extensions":["npx"]},"image/vnd.pco.b16":{"source":"iana","extensions":["b16"]},"image/vnd.radiance":{"source":"iana"},"image/vnd.sealed.png":{"source":"iana"},"image/vnd.sealedmedia.softseal.gif":{"source":"iana"},"image/vnd.sealedmedia.softseal.jpg":{"source":"iana"},"image/vnd.svf":{"source":"iana"},"image/vnd.tencent.tap":{"source":"iana","extensions":["tap"]},"image/vnd.valve.source.texture":{"source":"iana","extensions":["vtf"]},"image/vnd.wap.wbmp":{"source":"iana","extensions":["wbmp"]},"image/vnd.xiff":{"source":"iana","extensions":["xif"]},"image/vnd.zbrush.pcx":{"source":"iana","extensions":["pcx"]},"image/webp":{"source":"apache","extensions":["webp"]},"image/wmf":{"source":"iana","extensions":["wmf"]},"image/x-3ds":{"source":"apache","extensions":["3ds"]},"image/x-cmu-raster":{"source":"apache","extensions":["ras"]},"image/x-cmx":{"source":"apache","extensions":["cmx"]},"image/x-freehand":{"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},"image/x-icon":{"source":"apache","compressible":true,"extensions":["ico"]},"image/x-jng":{"source":"nginx","extensions":["jng"]},"image/x-mrsid-image":{"source":"apache","extensions":["sid"]},"image/x-ms-bmp":{"source":"nginx","compressible":true,"extensions":["bmp"]},"image/x-pcx":{"source":"apache","extensions":["pcx"]},"image/x-pict":{"source":"apache","extensions":["pic","pct"]},"image/x-portable-anymap":{"source":"apache","extensions":["pnm"]},"image/x-portable-bitmap":{"source":"apache","extensions":["pbm"]},"image/x-portable-graymap":{"source":"apache","extensions":["pgm"]},"image/x-portable-pixmap":{"source":"apache","extensions":["ppm"]},"image/x-rgb":{"source":"apache","extensions":["rgb"]},"image/x-tga":{"source":"apache","extensions":["tga"]},"image/x-xbitmap":{"source":"apache","extensions":["xbm"]},"image/x-xcf":{"compressible":false},"image/x-xpixmap":{"source":"apache","extensions":["xpm"]},"image/x-xwindowdump":{"source":"apache","extensions":["xwd"]},"message/cpim":{"source":"iana"},"message/delivery-status":{"source":"iana"},"message/disposition-notification":{"source":"iana","extensions":["disposition-notification"]},"message/external-body":{"source":"iana"},"message/feedback-report":{"source":"iana"},"message/global":{"source":"iana","extensions":["u8msg"]},"message/global-delivery-status":{"source":"iana","extensions":["u8dsn"]},"message/global-disposition-notification":{"source":"iana","extensions":["u8mdn"]},"message/global-headers":{"source":"iana","extensions":["u8hdr"]},"message/http":{"source":"iana","compressible":false},"message/imdn+xml":{"source":"iana","compressible":true},"message/news":{"source":"iana"},"message/partial":{"source":"iana","compressible":false},"message/rfc822":{"source":"iana","compressible":true,"extensions":["eml","mime"]},"message/s-http":{"source":"iana"},"message/sip":{"source":"iana"},"message/sipfrag":{"source":"iana"},"message/tracking-status":{"source":"iana"},"message/vnd.si.simp":{"source":"iana"},"message/vnd.wfa.wsc":{"source":"iana","extensions":["wsc"]},"model/3mf":{"source":"iana","extensions":["3mf"]},"model/e57":{"source":"iana"},"model/gltf+json":{"source":"iana","compressible":true,"extensions":["gltf"]},"model/gltf-binary":{"source":"iana","compressible":true,"extensions":["glb"]},"model/iges":{"source":"iana","compressible":false,"extensions":["igs","iges"]},"model/mesh":{"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},"model/mtl":{"source":"iana","extensions":["mtl"]},"model/obj":{"source":"iana","extensions":["obj"]},"model/step":{"source":"iana"},"model/step+xml":{"source":"iana","compressible":true,"extensions":["stpx"]},"model/step+zip":{"source":"iana","compressible":false,"extensions":["stpz"]},"model/step-xml+zip":{"source":"iana","compressible":false,"extensions":["stpxz"]},"model/stl":{"source":"iana","extensions":["stl"]},"model/vnd.collada+xml":{"source":"iana","compressible":true,"extensions":["dae"]},"model/vnd.dwf":{"source":"iana","extensions":["dwf"]},"model/vnd.flatland.3dml":{"source":"iana"},"model/vnd.gdl":{"source":"iana","extensions":["gdl"]},"model/vnd.gs-gdl":{"source":"apache"},"model/vnd.gs.gdl":{"source":"iana"},"model/vnd.gtw":{"source":"iana","extensions":["gtw"]},"model/vnd.moml+xml":{"source":"iana","compressible":true},"model/vnd.mts":{"source":"iana","extensions":["mts"]},"model/vnd.opengex":{"source":"iana","extensions":["ogex"]},"model/vnd.parasolid.transmit.binary":{"source":"iana","extensions":["x_b"]},"model/vnd.parasolid.transmit.text":{"source":"iana","extensions":["x_t"]},"model/vnd.pytha.pyox":{"source":"iana"},"model/vnd.rosette.annotated-data-model":{"source":"iana"},"model/vnd.sap.vds":{"source":"iana","extensions":["vds"]},"model/vnd.usdz+zip":{"source":"iana","compressible":false,"extensions":["usdz"]},"model/vnd.valve.source.compiled-map":{"source":"iana","extensions":["bsp"]},"model/vnd.vtu":{"source":"iana","extensions":["vtu"]},"model/vrml":{"source":"iana","compressible":false,"extensions":["wrl","vrml"]},"model/x3d+binary":{"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},"model/x3d+fastinfoset":{"source":"iana","extensions":["x3db"]},"model/x3d+vrml":{"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},"model/x3d+xml":{"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},"model/x3d-vrml":{"source":"iana","extensions":["x3dv"]},"multipart/alternative":{"source":"iana","compressible":false},"multipart/appledouble":{"source":"iana"},"multipart/byteranges":{"source":"iana"},"multipart/digest":{"source":"iana"},"multipart/encrypted":{"source":"iana","compressible":false},"multipart/form-data":{"source":"iana","compressible":false},"multipart/header-set":{"source":"iana"},"multipart/mixed":{"source":"iana"},"multipart/multilingual":{"source":"iana"},"multipart/parallel":{"source":"iana"},"multipart/related":{"source":"iana","compressible":false},"multipart/report":{"source":"iana"},"multipart/signed":{"source":"iana","compressible":false},"multipart/vnd.bint.med-plus":{"source":"iana"},"multipart/voice-message":{"source":"iana"},"multipart/x-mixed-replace":{"source":"iana"},"text/1d-interleaved-parityfec":{"source":"iana"},"text/cache-manifest":{"source":"iana","compressible":true,"extensions":["appcache","manifest"]},"text/calendar":{"source":"iana","extensions":["ics","ifb"]},"text/calender":{"compressible":true},"text/cmd":{"compressible":true},"text/coffeescript":{"extensions":["coffee","litcoffee"]},"text/cql":{"source":"iana"},"text/cql-expression":{"source":"iana"},"text/cql-identifier":{"source":"iana"},"text/css":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["css"]},"text/csv":{"source":"iana","compressible":true,"extensions":["csv"]},"text/csv-schema":{"source":"iana"},"text/directory":{"source":"iana"},"text/dns":{"source":"iana"},"text/ecmascript":{"source":"iana"},"text/encaprtp":{"source":"iana"},"text/enriched":{"source":"iana"},"text/fhirpath":{"source":"iana"},"text/flexfec":{"source":"iana"},"text/fwdred":{"source":"iana"},"text/gff3":{"source":"iana"},"text/grammar-ref-list":{"source":"iana"},"text/html":{"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},"text/jade":{"extensions":["jade"]},"text/javascript":{"source":"iana","compressible":true},"text/jcr-cnd":{"source":"iana"},"text/jsx":{"compressible":true,"extensions":["jsx"]},"text/less":{"compressible":true,"extensions":["less"]},"text/markdown":{"source":"iana","compressible":true,"extensions":["markdown","md"]},"text/mathml":{"source":"nginx","extensions":["mml"]},"text/mdx":{"compressible":true,"extensions":["mdx"]},"text/mizar":{"source":"iana"},"text/n3":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["n3"]},"text/parameters":{"source":"iana","charset":"UTF-8"},"text/parityfec":{"source":"iana"},"text/plain":{"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},"text/provenance-notation":{"source":"iana","charset":"UTF-8"},"text/prs.fallenstein.rst":{"source":"iana"},"text/prs.lines.tag":{"source":"iana","extensions":["dsc"]},"text/prs.prop.logic":{"source":"iana"},"text/raptorfec":{"source":"iana"},"text/red":{"source":"iana"},"text/rfc822-headers":{"source":"iana"},"text/richtext":{"source":"iana","compressible":true,"extensions":["rtx"]},"text/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"text/rtp-enc-aescm128":{"source":"iana"},"text/rtploopback":{"source":"iana"},"text/rtx":{"source":"iana"},"text/sgml":{"source":"iana","extensions":["sgml","sgm"]},"text/shaclc":{"source":"iana"},"text/shex":{"source":"iana","extensions":["shex"]},"text/slim":{"extensions":["slim","slm"]},"text/spdx":{"source":"iana","extensions":["spdx"]},"text/strings":{"source":"iana"},"text/stylus":{"extensions":["stylus","styl"]},"text/t140":{"source":"iana"},"text/tab-separated-values":{"source":"iana","compressible":true,"extensions":["tsv"]},"text/troff":{"source":"iana","extensions":["t","tr","roff","man","me","ms"]},"text/turtle":{"source":"iana","charset":"UTF-8","extensions":["ttl"]},"text/ulpfec":{"source":"iana"},"text/uri-list":{"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},"text/vcard":{"source":"iana","compressible":true,"extensions":["vcard"]},"text/vnd.a":{"source":"iana"},"text/vnd.abc":{"source":"iana"},"text/vnd.ascii-art":{"source":"iana"},"text/vnd.curl":{"source":"iana","extensions":["curl"]},"text/vnd.curl.dcurl":{"source":"apache","extensions":["dcurl"]},"text/vnd.curl.mcurl":{"source":"apache","extensions":["mcurl"]},"text/vnd.curl.scurl":{"source":"apache","extensions":["scurl"]},"text/vnd.debian.copyright":{"source":"iana","charset":"UTF-8"},"text/vnd.dmclientscript":{"source":"iana"},"text/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"text/vnd.esmertec.theme-descriptor":{"source":"iana","charset":"UTF-8"},"text/vnd.familysearch.gedcom":{"source":"iana","extensions":["ged"]},"text/vnd.ficlab.flt":{"source":"iana"},"text/vnd.fly":{"source":"iana","extensions":["fly"]},"text/vnd.fmi.flexstor":{"source":"iana","extensions":["flx"]},"text/vnd.gml":{"source":"iana"},"text/vnd.graphviz":{"source":"iana","extensions":["gv"]},"text/vnd.hans":{"source":"iana"},"text/vnd.hgl":{"source":"iana"},"text/vnd.in3d.3dml":{"source":"iana","extensions":["3dml"]},"text/vnd.in3d.spot":{"source":"iana","extensions":["spot"]},"text/vnd.iptc.newsml":{"source":"iana"},"text/vnd.iptc.nitf":{"source":"iana"},"text/vnd.latex-z":{"source":"iana"},"text/vnd.motorola.reflex":{"source":"iana"},"text/vnd.ms-mediapackage":{"source":"iana"},"text/vnd.net2phone.commcenter.command":{"source":"iana"},"text/vnd.radisys.msml-basic-layout":{"source":"iana"},"text/vnd.senx.warpscript":{"source":"iana"},"text/vnd.si.uricatalogue":{"source":"iana"},"text/vnd.sosi":{"source":"iana"},"text/vnd.sun.j2me.app-descriptor":{"source":"iana","charset":"UTF-8","extensions":["jad"]},"text/vnd.trolltech.linguist":{"source":"iana","charset":"UTF-8"},"text/vnd.wap.si":{"source":"iana"},"text/vnd.wap.sl":{"source":"iana"},"text/vnd.wap.wml":{"source":"iana","extensions":["wml"]},"text/vnd.wap.wmlscript":{"source":"iana","extensions":["wmls"]},"text/vtt":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["vtt"]},"text/x-asm":{"source":"apache","extensions":["s","asm"]},"text/x-c":{"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},"text/x-component":{"source":"nginx","extensions":["htc"]},"text/x-fortran":{"source":"apache","extensions":["f","for","f77","f90"]},"text/x-gwt-rpc":{"compressible":true},"text/x-handlebars-template":{"extensions":["hbs"]},"text/x-java-source":{"source":"apache","extensions":["java"]},"text/x-jquery-tmpl":{"compressible":true},"text/x-lua":{"extensions":["lua"]},"text/x-markdown":{"compressible":true,"extensions":["mkd"]},"text/x-nfo":{"source":"apache","extensions":["nfo"]},"text/x-opml":{"source":"apache","extensions":["opml"]},"text/x-org":{"compressible":true,"extensions":["org"]},"text/x-pascal":{"source":"apache","extensions":["p","pas"]},"text/x-processing":{"compressible":true,"extensions":["pde"]},"text/x-sass":{"extensions":["sass"]},"text/x-scss":{"extensions":["scss"]},"text/x-setext":{"source":"apache","extensions":["etx"]},"text/x-sfv":{"source":"apache","extensions":["sfv"]},"text/x-suse-ymp":{"compressible":true,"extensions":["ymp"]},"text/x-uuencode":{"source":"apache","extensions":["uu"]},"text/x-vcalendar":{"source":"apache","extensions":["vcs"]},"text/x-vcard":{"source":"apache","extensions":["vcf"]},"text/xml":{"source":"iana","compressible":true,"extensions":["xml"]},"text/xml-external-parsed-entity":{"source":"iana"},"text/yaml":{"compressible":true,"extensions":["yaml","yml"]},"video/1d-interleaved-parityfec":{"source":"iana"},"video/3gpp":{"source":"iana","extensions":["3gp","3gpp"]},"video/3gpp-tt":{"source":"iana"},"video/3gpp2":{"source":"iana","extensions":["3g2"]},"video/av1":{"source":"iana"},"video/bmpeg":{"source":"iana"},"video/bt656":{"source":"iana"},"video/celb":{"source":"iana"},"video/dv":{"source":"iana"},"video/encaprtp":{"source":"iana"},"video/ffv1":{"source":"iana"},"video/flexfec":{"source":"iana"},"video/h261":{"source":"iana","extensions":["h261"]},"video/h263":{"source":"iana","extensions":["h263"]},"video/h263-1998":{"source":"iana"},"video/h263-2000":{"source":"iana"},"video/h264":{"source":"iana","extensions":["h264"]},"video/h264-rcdo":{"source":"iana"},"video/h264-svc":{"source":"iana"},"video/h265":{"source":"iana"},"video/iso.segment":{"source":"iana","extensions":["m4s"]},"video/jpeg":{"source":"iana","extensions":["jpgv"]},"video/jpeg2000":{"source":"iana"},"video/jpm":{"source":"apache","extensions":["jpm","jpgm"]},"video/jxsv":{"source":"iana"},"video/mj2":{"source":"iana","extensions":["mj2","mjp2"]},"video/mp1s":{"source":"iana"},"video/mp2p":{"source":"iana"},"video/mp2t":{"source":"iana","extensions":["ts"]},"video/mp4":{"source":"iana","compressible":false,"extensions":["mp4","mp4v","mpg4"]},"video/mp4v-es":{"source":"iana"},"video/mpeg":{"source":"iana","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},"video/mpeg4-generic":{"source":"iana"},"video/mpv":{"source":"iana"},"video/nv":{"source":"iana"},"video/ogg":{"source":"iana","compressible":false,"extensions":["ogv"]},"video/parityfec":{"source":"iana"},"video/pointer":{"source":"iana"},"video/quicktime":{"source":"iana","compressible":false,"extensions":["qt","mov"]},"video/raptorfec":{"source":"iana"},"video/raw":{"source":"iana"},"video/rtp-enc-aescm128":{"source":"iana"},"video/rtploopback":{"source":"iana"},"video/rtx":{"source":"iana"},"video/scip":{"source":"iana"},"video/smpte291":{"source":"iana"},"video/smpte292m":{"source":"iana"},"video/ulpfec":{"source":"iana"},"video/vc1":{"source":"iana"},"video/vc2":{"source":"iana"},"video/vnd.cctv":{"source":"iana"},"video/vnd.dece.hd":{"source":"iana","extensions":["uvh","uvvh"]},"video/vnd.dece.mobile":{"source":"iana","extensions":["uvm","uvvm"]},"video/vnd.dece.mp4":{"source":"iana"},"video/vnd.dece.pd":{"source":"iana","extensions":["uvp","uvvp"]},"video/vnd.dece.sd":{"source":"iana","extensions":["uvs","uvvs"]},"video/vnd.dece.video":{"source":"iana","extensions":["uvv","uvvv"]},"video/vnd.directv.mpeg":{"source":"iana"},"video/vnd.directv.mpeg-tts":{"source":"iana"},"video/vnd.dlna.mpeg-tts":{"source":"iana"},"video/vnd.dvb.file":{"source":"iana","extensions":["dvb"]},"video/vnd.fvt":{"source":"iana","extensions":["fvt"]},"video/vnd.hns.video":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.ttsavc":{"source":"iana"},"video/vnd.iptvforum.ttsmpeg2":{"source":"iana"},"video/vnd.motorola.video":{"source":"iana"},"video/vnd.motorola.videop":{"source":"iana"},"video/vnd.mpegurl":{"source":"iana","extensions":["mxu","m4u"]},"video/vnd.ms-playready.media.pyv":{"source":"iana","extensions":["pyv"]},"video/vnd.nokia.interleaved-multimedia":{"source":"iana"},"video/vnd.nokia.mp4vr":{"source":"iana"},"video/vnd.nokia.videovoip":{"source":"iana"},"video/vnd.objectvideo":{"source":"iana"},"video/vnd.radgamettools.bink":{"source":"iana"},"video/vnd.radgamettools.smacker":{"source":"iana"},"video/vnd.sealed.mpeg1":{"source":"iana"},"video/vnd.sealed.mpeg4":{"source":"iana"},"video/vnd.sealed.swf":{"source":"iana"},"video/vnd.sealedmedia.softseal.mov":{"source":"iana"},"video/vnd.uvvu.mp4":{"source":"iana","extensions":["uvu","uvvu"]},"video/vnd.vivo":{"source":"iana","extensions":["viv"]},"video/vnd.youtube.yt":{"source":"iana"},"video/vp8":{"source":"iana"},"video/vp9":{"source":"iana"},"video/webm":{"source":"apache","compressible":false,"extensions":["webm"]},"video/x-f4v":{"source":"apache","extensions":["f4v"]},"video/x-fli":{"source":"apache","extensions":["fli"]},"video/x-flv":{"source":"apache","compressible":false,"extensions":["flv"]},"video/x-m4v":{"source":"apache","extensions":["m4v"]},"video/x-matroska":{"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},"video/x-mng":{"source":"apache","extensions":["mng"]},"video/x-ms-asf":{"source":"apache","extensions":["asf","asx"]},"video/x-ms-vob":{"source":"apache","extensions":["vob"]},"video/x-ms-wm":{"source":"apache","extensions":["wm"]},"video/x-ms-wmv":{"source":"apache","compressible":false,"extensions":["wmv"]},"video/x-ms-wmx":{"source":"apache","extensions":["wmx"]},"video/x-ms-wvx":{"source":"apache","extensions":["wvx"]},"video/x-msvideo":{"source":"apache","extensions":["avi"]},"video/x-sgi-movie":{"source":"apache","extensions":["movie"]},"video/x-smv":{"source":"apache","extensions":["smv"]},"x-conference/x-cooltalk":{"source":"apache","extensions":["ice"]},"x-shader/x-fragment":{"compressible":true},"x-shader/x-vertex":{"compressible":true}}');

/***/ })

};
;
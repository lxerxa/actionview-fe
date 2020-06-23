!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory(require("react"), require("react-modal")) : "function" == typeof define && define.amd ? define([ "react", "react-modal" ], factory) : "object" == typeof exports ? exports.ReactImageLightbox = factory(require("react"), require("react-modal")) : root.ReactImageLightbox = factory(root.react, root["react-modal"]);
}(this, function(__WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__) {
    /******/
    return function(modules) {
        /******/
        /******/
        // The require function
        /******/
        function __webpack_require__(moduleId) {
            /******/
            /******/
            // Check if module is in cache
            /******/
            if (installedModules[moduleId]) /******/
            return installedModules[moduleId].exports;
            /******/
            /******/
            // Create a new module (and put it into the cache)
            /******/
            var module = installedModules[moduleId] = {
                /******/
                exports: {},
                /******/
                id: moduleId,
                /******/
                loaded: !1
            };
            /******/
            /******/
            // Return the exports of the module
            /******/
            /******/
            /******/
            // Execute the module function
            /******/
            /******/
            /******/
            // Flag the module as loaded
            /******/
            return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
            module.loaded = !0, module.exports;
        }
        // webpackBootstrap
        /******/
        // The module cache
        /******/
        var installedModules = {};
        /******/
        /******/
        // Load entry module and return exports
        /******/
        /******/
        /******/
        /******/
        // expose the modules object (__webpack_modules__)
        /******/
        /******/
        /******/
        // expose the module cache
        /******/
        /******/
        /******/
        // __webpack_public_path__
        /******/
        return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
        __webpack_require__.p = "", __webpack_require__(0);
    }([ /* 0 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        module.exports = __webpack_require__(2).default;
    }, /* 1 */
    /***/
    function(module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        // Min image zoom level
        exports.MIN_ZOOM_LEVEL = 0, exports.MAX_ZOOM_LEVEL = 300, exports.ZOOM_RATIO = 1.007, 
        exports.ZOOM_BUTTON_INCREMENT_SIZE = 100, exports.WHEEL_MOVE_X_THRESHOLD = 200, 
        exports.WHEEL_MOVE_Y_THRESHOLD = 1, exports.KEYS = {
            ESC: 27,
            LEFT_ARROW: 37,
            RIGHT_ARROW: 39
        };
    }, /* 2 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function _defineProperty(obj, key, value) {
            return key in obj ? Object.defineProperty(obj, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : obj[key] = value, obj;
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        function _possibleConstructorReturn(self, call) {
            if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !call || "object" != typeof call && "function" != typeof call ? self : call;
        }
        function _inherits(subClass, superClass) {
            if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
                    "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
                Constructor;
            };
        }(), _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
            }
            return target;
        }, _react = __webpack_require__(8), _react2 = _interopRequireDefault(_react), _reactModal = __webpack_require__(9), _reactModal2 = _interopRequireDefault(_reactModal), _util = __webpack_require__(3), _constant = __webpack_require__(1), _style = __webpack_require__(7), _style2 = _interopRequireDefault(_style), styles = _style2.default, _ieVersion = (0, 
        _util.getIEVersion)();
        _ieVersion < 10 && (styles = _extends({}, styles, {
            toolbarSide: styles.toolbarSide + " " + styles.toolbarSideNoFlex,
            toolbarLeftSide: styles.toolbarLeftSide + " " + styles.toolbarLeftSideNoFlex,
            toolbarRightSide: styles.toolbarRightSide + " " + styles.toolbarRightSideNoFlex
        }));
        var ReactImageLightbox = function(_Component) {
            function ReactImageLightbox(props) {
                _classCallCheck(this, ReactImageLightbox);
                var _this = _possibleConstructorReturn(this, (ReactImageLightbox.__proto__ || Object.getPrototypeOf(ReactImageLightbox)).call(this, props));
                return _this.state = {
                    //-----------------------------
                    // Animation
                    //-----------------------------
                    // Lightbox is closing
                    // When Lightbox is mounted, if animation is enabled it will open with the reverse of the closing animation
                    isClosing: !props.animationDisabled,
                    // Component parts should animate (e.g., when images are moving, or image is being zoomed)
                    shouldAnimate: !1,
                    //-----------------------------
                    // Zoom settings
                    //-----------------------------
                    // Zoom level of image
                    zoomLevel: _constant.MIN_ZOOM_LEVEL,
                    //-----------------------------
                    // Image position settings
                    //-----------------------------
                    // Horizontal offset from center
                    offsetX: 0,
                    // Vertical offset from center
                    offsetY: 0
                }, _this.closeIfClickInner = _this.closeIfClickInner.bind(_this), _this.handleImageDoubleClick = _this.handleImageDoubleClick.bind(_this), 
                _this.handleImageMouseWheel = _this.handleImageMouseWheel.bind(_this), _this.handleKeyInput = _this.handleKeyInput.bind(_this), 
                _this.handleMouseUp = _this.handleMouseUp.bind(_this), _this.handleOuterMouseDown = _this.handleOuterMouseDown.bind(_this), 
                _this.handleOuterMouseMove = _this.handleOuterMouseMove.bind(_this), _this.handleOuterMousewheel = _this.handleOuterMousewheel.bind(_this), 
                _this.handleOuterTouchStart = _this.handleOuterTouchStart.bind(_this), _this.handleOuterTouchMove = _this.handleOuterTouchMove.bind(_this), 
                _this.handleCaptionMousewheel = _this.handleCaptionMousewheel.bind(_this), _this.handleWindowResize = _this.handleWindowResize.bind(_this), 
                _this.handleZoomInButtonClick = _this.handleZoomInButtonClick.bind(_this), _this.handleZoomOutButtonClick = _this.handleZoomOutButtonClick.bind(_this), 
                _this.requestClose = _this.requestClose.bind(_this), _this.requestMoveNext = _this.requestMoveNext.bind(_this), 
                _this.requestMovePrev = _this.requestMovePrev.bind(_this), _this;
            }
            return _inherits(ReactImageLightbox, _Component), _createClass(ReactImageLightbox, [ {
                key: "componentWillMount",
                value: function() {
                    // Whether event listeners for keyboard and mouse input have been attached or not
                    this.listenersAttached = !1, // Used to disable animation when changing props.mainSrc|nextSrc|prevSrc
                    this.keyPressed = !1, // Used to store load state / dimensions of images
                    this.imageCache = {}, // Time the last keydown event was called (used in keyboard action rate limiting)
                    this.lastKeyDownTime = 0, // Used for debouncing window resize event
                    this.resizeTimeout = null, // Used to determine when actions are triggered by the scroll wheel
                    this.wheelActionTimeout = null, this.resetScrollTimeout = null, this.scrollX = 0, 
                    this.scrollY = 0, // Used in panning zoomed images
                    this.isDragging = !1, this.dragStartX = 0, this.dragStartY = 0, this.dragStartOffsetX = 0, 
                    this.dragStartOffsetY = 0, // Used to differentiate between images with identical src
                    this.keyCounter = 0, // Used to detect a move when all src's remain unchanged (four or more of the same image in a row)
                    this.moveRequested = !1, this.props.animationDisabled || // Make opening animation play
                    this.setState({
                        isClosing: !1
                    });
                }
            }, {
                key: "componentDidMount",
                value: function() {
                    this.mounted = !0, this.attachListeners(), this.loadAllImages();
                }
            }, {
                key: "componentWillReceiveProps",
                value: function(nextProps) {
                    var _this2 = this, sourcesChanged = !1, prevSrcDict = {}, nextSrcDict = {};
                    this.getSrcTypes().forEach(function(srcType) {
                        _this2.props[srcType.name] !== nextProps[srcType.name] && (sourcesChanged = !0, 
                        prevSrcDict[_this2.props[srcType.name]] = !0, nextSrcDict[nextProps[srcType.name]] = !0);
                    }), (sourcesChanged || this.moveRequested) && (// Reset the loaded state for images not rendered next
                    Object.keys(prevSrcDict).forEach(function(prevSrc) {
                        !(prevSrc in nextSrcDict) && prevSrc in _this2.imageCache && (_this2.imageCache[prevSrc].loaded = !1);
                    }), this.moveRequested = !1, // Load any new images
                    this.loadAllImages(nextProps));
                }
            }, {
                key: "componentWillUnmount",
                value: function() {
                    this.mounted = !1, this.detachListeners();
                }
            }, {
                key: "attachListeners",
                value: function() {
                    this.listenersAttached || (window.addEventListener("resize", this.handleWindowResize), 
                    window.addEventListener("mouseup", this.handleMouseUp), window.addEventListener("touchend", this.handleMouseUp), 
                    // Have to add an extra mouseup handler to catch mouseup events outside of the window
                    //  if the page containing the lightbox is displayed in an iframe
                    (0, _util.isInIframe)() && (window.top.addEventListener("mouseup", this.handleMouseUp), 
                    window.top.addEventListener("touchend", this.handleMouseUp)), this.listenersAttached = !0);
                }
            }, {
                key: "changeZoom",
                value: function(zoomLevel, clientX, clientY) {
                    // Ignore if zoom disabled
                    if (this.props.enableZoom) {
                        // Constrain zoom level to the set bounds
                        var nextZoomLevel = Math.max(_constant.MIN_ZOOM_LEVEL, Math.min(_constant.MAX_ZOOM_LEVEL, zoomLevel));
                        // Ignore requests that don't change the zoom level
                        if (nextZoomLevel !== this.state.zoomLevel) {
                            if (nextZoomLevel === _constant.MIN_ZOOM_LEVEL) // Snap back to center if zoomed all the way out
                            return this.setState({
                                zoomLevel: nextZoomLevel,
                                offsetX: 0,
                                offsetY: 0
                            });
                            var imageBaseSize = this.getBestImageForType("mainSrc");
                            if (null !== imageBaseSize) {
                                var currentZoomMultiplier = this.getZoomMultiplier(), nextZoomMultiplier = this.getZoomMultiplier(nextZoomLevel), boxRect = this.getLightboxRect(), percentXInCurrentBox = "undefined" != typeof clientX ? (clientX - boxRect.left - (boxRect.width - imageBaseSize.width) / 2) / imageBaseSize.width : .5, percentYInCurrentBox = "undefined" != typeof clientY ? (clientY - boxRect.top - (boxRect.height - imageBaseSize.height) / 2) / imageBaseSize.height : .5, currentImageWidth = imageBaseSize.width * currentZoomMultiplier, currentImageHeight = imageBaseSize.height * currentZoomMultiplier, nextImageWidth = imageBaseSize.width * nextZoomMultiplier, nextImageHeight = imageBaseSize.height * nextZoomMultiplier, deltaX = (currentImageWidth - nextImageWidth) * (percentXInCurrentBox - .5), deltaY = (currentImageHeight - nextImageHeight) * (percentYInCurrentBox - .5), nextOffsetX = this.state.offsetX - deltaX, nextOffsetY = this.state.offsetY - deltaY, maxOffsets = this.getMaxOffsets();
                                this.state.zoomLevel > nextZoomLevel && (nextOffsetX = Math.max(maxOffsets.minX, Math.min(maxOffsets.maxX, nextOffsetX)), 
                                nextOffsetY = Math.max(maxOffsets.minY, Math.min(maxOffsets.maxY, nextOffsetY))), 
                                this.setState({
                                    zoomLevel: nextZoomLevel,
                                    offsetX: nextOffsetX,
                                    offsetY: nextOffsetY
                                });
                            }
                        }
                    }
                }
            }, {
                key: "closeIfClickInner",
                value: function(event) {
                    event.target.className.search(/\binner\b/) > -1 && this.requestClose(event);
                }
            }, {
                key: "detachListeners",
                value: function() {
                    this.listenersAttached && (window.removeEventListener("resize", this.handleWindowResize), 
                    window.removeEventListener("mouseup", this.handleMouseUp), window.removeEventListener("touchend", this.handleMouseUp), 
                    (0, _util.isInIframe)() && (window.top.removeEventListener("mouseup", this.handleMouseUp), 
                    window.top.removeEventListener("touchend", this.handleMouseUp)), this.listenersAttached = !1);
                }
            }, {
                key: "getBestImageForType",
                value: function(srcType) {
                    var imageSrc = this.props[srcType], fitSizes = {};
                    if (this.isImageLoaded(imageSrc)) // Use full-size image if available
                    fitSizes = this.getFitSizes(this.imageCache[imageSrc].width, this.imageCache[imageSrc].height); else {
                        if (!this.isImageLoaded(this.props[srcType + "Thumbnail"])) return null;
                        // Fall back to using thumbnail if the image has not been loaded
                        imageSrc = this.props[srcType + "Thumbnail"], fitSizes = this.getFitSizes(this.imageCache[imageSrc].width, this.imageCache[imageSrc].height, !0);
                    }
                    return {
                        src: imageSrc,
                        height: fitSizes.height,
                        width: fitSizes.width
                    };
                }
            }, {
                key: "getFitSizes",
                value: function(width, height, stretch) {
                    var boxSize = this.getLightboxRect(), maxHeight = boxSize.height - 2 * this.props.imagePadding, maxWidth = boxSize.width - 2 * this.props.imagePadding;
                    stretch || (maxHeight = Math.min(maxHeight, height), maxWidth = Math.min(maxWidth, width));
                    var maxRatio = maxWidth / maxHeight, srcRatio = width / height;
                    return maxRatio > srcRatio ? {
                        width: width * maxHeight / height,
                        height: maxHeight
                    } : {
                        width: maxWidth,
                        height: height * maxWidth / width
                    };
                }
            }, {
                key: "getMaxOffsets",
                value: function() {
                    var zoomLevel = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.state.zoomLevel, currentImageInfo = this.getBestImageForType("mainSrc");
                    if (null === currentImageInfo) return {
                        maxX: 0,
                        minX: 0,
                        maxY: 0,
                        minY: 0
                    };
                    var boxSize = this.getLightboxRect(), zoomMultiplier = this.getZoomMultiplier(zoomLevel), maxX = 0;
                    // if there is still blank space in the X dimension, don't limit except to the opposite edge
                    maxX = zoomMultiplier * currentImageInfo.width - boxSize.width < 0 ? (boxSize.width - zoomMultiplier * currentImageInfo.width) / 2 : (zoomMultiplier * currentImageInfo.width - boxSize.width) / 2;
                    var maxY = 0;
                    // if there is still blank space in the Y dimension, don't limit except to the opposite edge
                    return maxY = zoomMultiplier * currentImageInfo.height - boxSize.height < 0 ? (boxSize.height - zoomMultiplier * currentImageInfo.height) / 2 : (zoomMultiplier * currentImageInfo.height - boxSize.height) / 2, 
                    {
                        maxX: maxX,
                        maxY: maxY,
                        minX: -1 * maxX,
                        minY: -1 * maxY
                    };
                }
            }, {
                key: "getSrcTypes",
                value: function() {
                    return [ {
                        name: "mainSrc",
                        keyEnding: "i" + this.keyCounter
                    }, {
                        name: "mainSrcThumbnail",
                        keyEnding: "t" + this.keyCounter
                    }, {
                        name: "nextSrc",
                        keyEnding: "i" + (this.keyCounter + 1)
                    }, {
                        name: "nextSrcThumbnail",
                        keyEnding: "t" + (this.keyCounter + 1)
                    }, {
                        name: "prevSrc",
                        keyEnding: "i" + (this.keyCounter - 1)
                    }, {
                        name: "prevSrcThumbnail",
                        keyEnding: "t" + (this.keyCounter - 1)
                    } ];
                }
            }, {
                key: "getZoomMultiplier",
                value: function() {
                    var zoomLevel = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.state.zoomLevel;
                    return Math.pow(_constant.ZOOM_RATIO, zoomLevel);
                }
            }, {
                key: "getLightboxRect",
                value: function() {
                    return this.outerEl ? this.outerEl.getBoundingClientRect() : {
                        width: (0, _util.getWindowWidth)(),
                        height: (0, _util.getWindowHeight)(),
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    };
                }
            }, {
                key: "handleKeyInput",
                value: function(event) {
                    // Ignore key input during animations
                    if (event.stopPropagation(), !this.isAnimating()) {
                        // Allow slightly faster navigation through the images when user presses keys repeatedly
                        if ("keyup" === event.type) return void (this.lastKeyDownTime -= this.props.keyRepeatKeyupBonus);
                        var keyCode = event.which || event.keyCode, currentTime = new Date();
                        if (!(currentTime.getTime() - this.lastKeyDownTime < this.props.keyRepeatLimit && keyCode !== _constant.KEYS.ESC)) switch (this.lastKeyDownTime = currentTime.getTime(), 
                        keyCode) {
                          // ESC key closes the lightbox
                            case _constant.KEYS.ESC:
                            event.preventDefault(), this.requestClose(event);
                            break;

                          // Left arrow key moves to previous image
                            case _constant.KEYS.LEFT_ARROW:
                            if (!this.props.prevSrc) return;
                            event.preventDefault(), this.keyPressed = !0, this.requestMovePrev(event);
                            break;

                          // Right arrow key moves to next image
                            case _constant.KEYS.RIGHT_ARROW:
                            if (!this.props.nextSrc) return;
                            event.preventDefault(), this.keyPressed = !0, this.requestMoveNext(event);
                        }
                    }
                }
            }, {
                key: "handleOuterMousewheel",
                value: function(event) {
                    var _this3 = this;
                    // Prevent scrolling of the background
                    event.preventDefault(), event.stopPropagation();
                    var xThreshold = _constant.WHEEL_MOVE_X_THRESHOLD, actionDelay = 0, imageMoveDelay = 500;
                    // Prevent rapid-fire zoom behavior
                    if (clearTimeout(this.resetScrollTimeout), this.resetScrollTimeout = setTimeout(function() {
                        _this3.scrollX = 0, _this3.scrollY = 0;
                    }, 300), null === this.wheelActionTimeout && !this.isAnimating()) {
                        if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
                            // handle horizontal scrolls with image moves
                            this.scrollY = 0, this.scrollX += event.deltaX;
                            var bigLeapX = xThreshold / 2;
                            // If the scroll amount has accumulated sufficiently, or a large leap was taken
                            this.scrollX >= xThreshold || event.deltaX >= bigLeapX ? (// Scroll right moves to next
                            this.requestMoveNext(event), actionDelay = imageMoveDelay, this.scrollX = 0) : (this.scrollX <= -1 * xThreshold || event.deltaX <= -1 * bigLeapX) && (// Scroll left moves to previous
                            this.requestMovePrev(event), actionDelay = imageMoveDelay, this.scrollX = 0);
                        }
                        // Allow successive actions after the set delay
                        0 !== actionDelay && (this.wheelActionTimeout = setTimeout(function() {
                            _this3.wheelActionTimeout = null;
                        }, actionDelay));
                    }
                }
            }, {
                key: "handleImageMouseWheel",
                value: function(event) {
                    event.preventDefault();
                    var yThreshold = _constant.WHEEL_MOVE_Y_THRESHOLD;
                    if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) {
                        // If the vertical scroll amount was large enough, perform a zoom
                        if (event.stopPropagation(), Math.abs(event.deltaY) < yThreshold) return;
                        this.scrollX = 0, this.scrollY += event.deltaY, this.changeZoom(this.state.zoomLevel - event.deltaY, event.clientX, event.clientY);
                    }
                }
            }, {
                key: "handleImageDoubleClick",
                value: function(event) {
                    this.state.zoomLevel > _constant.MIN_ZOOM_LEVEL ? // A double click when zoomed in zooms all the way out
                    this.changeZoom(_constant.MIN_ZOOM_LEVEL, event.clientX, event.clientY) : // A double click when zoomed all the way out zooms in
                    this.changeZoom(this.state.zoomLevel + _constant.ZOOM_BUTTON_INCREMENT_SIZE, event.clientX, event.clientY);
                }
            }, {
                key: "handleMouseUp",
                value: function() {
                    var _this4 = this;
                    if (this.isDragging) {
                        this.isDragging = !1;
                        // Snap image back into frame if outside max offset range
                        var maxOffsets = this.getMaxOffsets(), nextOffsetX = Math.max(maxOffsets.minX, Math.min(maxOffsets.maxX, this.state.offsetX)), nextOffsetY = Math.max(maxOffsets.minY, Math.min(maxOffsets.maxY, this.state.offsetY));
                        nextOffsetX === this.state.offsetX && nextOffsetY === this.state.offsetY || (this.setState({
                            offsetX: nextOffsetX,
                            offsetY: nextOffsetY,
                            shouldAnimate: !0
                        }), setTimeout(function() {
                            _this4.setState({
                                shouldAnimate: !1
                            });
                        }, this.props.animationDuration));
                    }
                }
            }, {
                key: "handleMoveStart",
                value: function(clientX, clientY) {
                    // Only allow dragging when zoomed
                    this.state.zoomLevel <= _constant.MIN_ZOOM_LEVEL || (this.isDragging = !0, this.dragStartX = clientX, 
                    this.dragStartY = clientY, this.dragStartOffsetX = this.state.offsetX, this.dragStartOffsetY = this.state.offsetY);
                }
            }, {
                key: "handleOuterMouseDown",
                value: function(event) {
                    event.preventDefault(), this.handleMoveStart(event.clientX, event.clientY);
                }
            }, {
                key: "handleOuterTouchStart",
                value: function(event) {
                    var touchObj = event.changedTouches[0];
                    this.handleMoveStart(parseInt(touchObj.clientX, 10), parseInt(touchObj.clientY, 10));
                }
            }, {
                key: "handleMove",
                value: function(clientX, clientY) {
                    if (this.isDragging) {
                        var newOffsetX = this.dragStartX - clientX + this.dragStartOffsetX, newOffsetY = this.dragStartY - clientY + this.dragStartOffsetY;
                        this.state.offsetX === newOffsetX && this.state.offsetY === newOffsetY || this.setState({
                            offsetX: newOffsetX,
                            offsetY: newOffsetY
                        });
                    }
                }
            }, {
                key: "handleOuterMouseMove",
                value: function(event) {
                    this.handleMove(event.clientX, event.clientY);
                }
            }, {
                key: "handleOuterTouchMove",
                value: function(event) {
                    // We shouldn't go any further if we're not zoomed
                    if (event.preventDefault(), !(this.state.zoomLevel <= _constant.MIN_ZOOM_LEVEL)) {
                        var touchObj = event.changedTouches[0];
                        this.handleMove(parseInt(touchObj.clientX, 10), parseInt(touchObj.clientY, 10));
                    }
                }
            }, {
                key: "handleWindowResize",
                value: function() {
                    clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(this.forceUpdate.bind(this), 100);
                }
            }, {
                key: "handleZoomInButtonClick",
                value: function() {
                    this.changeZoom(this.state.zoomLevel + _constant.ZOOM_BUTTON_INCREMENT_SIZE);
                }
            }, {
                key: "handleZoomOutButtonClick",
                value: function() {
                    this.changeZoom(this.state.zoomLevel - _constant.ZOOM_BUTTON_INCREMENT_SIZE);
                }
            }, {
                key: "handleCaptionMousewheel",
                value: function(event) {
                    if (event.stopPropagation(), this.caption) {
                        var height = this.caption.getBoundingClientRect().height, scrollHeight = this.caption.scrollHeight, scrollTop = this.caption.scrollTop;
                        (event.deltaY > 0 && height + scrollTop >= scrollHeight || event.deltaY < 0 && scrollTop <= 0) && event.preventDefault();
                    }
                }
            }, {
                key: "isAnimating",
                value: function() {
                    return this.state.shouldAnimate || this.state.isClosing;
                }
            }, {
                key: "isImageLoaded",
                value: function(imageSrc) {
                    return imageSrc && imageSrc in this.imageCache && this.imageCache[imageSrc].loaded;
                }
            }, {
                key: "loadImage",
                value: function(imageSrc, callback) {
                    var _this5 = this;
                    // Return the image info if it is already cached
                    if (this.isImageLoaded(imageSrc)) return void setTimeout(function() {
                        callback(null, _this5.imageCache[imageSrc].width, _this5.imageCache[imageSrc].height);
                    }, 1);
                    var that = this, inMemoryImage = new Image();
                    inMemoryImage.onerror = function() {
                        callback("image load error");
                    }, inMemoryImage.onload = function() {
                        that.imageCache[imageSrc] = {
                            loaded: !0,
                            width: this.width,
                            height: this.height
                        }, callback(null, this.width, this.height);
                    }, inMemoryImage.src = imageSrc;
                }
            }, {
                key: "loadAllImages",
                value: function() {
                    var _this6 = this, props = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.props, generateImageLoadedCallback = function(srcType, imageSrc) {
                        return function(err) {
                            // Give up showing image on error
                            // Give up showing image on error
                            // Don't rerender if the src is not the same as when the load started
                            // or if the component has unmounted
                            // Force rerender with the new image
                            return err ? void (window.console && window.console.warn(err)) : void (_this6.props[srcType] === imageSrc && _this6.mounted && _this6.forceUpdate());
                        };
                    };
                    // Load the images
                    this.getSrcTypes().forEach(function(srcType) {
                        var type = srcType.name;
                        // Load unloaded images
                        props[type] && !_this6.isImageLoaded(props[type]) && _this6.loadImage(props[type], generateImageLoadedCallback(type, props[type]));
                    });
                }
            }, {
                key: "requestClose",
                value: function(event) {
                    var _this7 = this, closeLightbox = function() {
                        return _this7.props.onCloseRequest(event);
                    };
                    // With animation
                    // Start closing animation
                    // Perform the actual closing at the end of the animation
                    return this.props.animationDisabled || "keydown" === event.type && !this.props.animationOnKeyInput ? closeLightbox() : (this.setState({
                        isClosing: !0
                    }), void setTimeout(closeLightbox, this.props.animationDuration));
                }
            }, {
                key: "requestMove",
                value: function(direction, event) {
                    var _this8 = this, nextState = {
                        zoomLevel: _constant.MIN_ZOOM_LEVEL,
                        offsetX: 0,
                        offsetY: 0
                    };
                    // Enable animated states
                    this.props.animationDisabled || this.keyPressed && !this.props.animationOnKeyInput || (nextState.shouldAnimate = !0, 
                    setTimeout(function() {
                        return _this8.setState({
                            shouldAnimate: !1
                        });
                    }, this.props.animationDuration)), this.keyPressed = !1, this.moveRequested = !0, 
                    "prev" === direction ? (this.keyCounter--, this.setState(nextState), this.props.onMovePrevRequest(event)) : (this.keyCounter++, 
                    this.setState(nextState), this.props.onMoveNextRequest(event));
                }
            }, {
                key: "requestMoveNext",
                value: function(event) {
                    this.requestMove("next", event);
                }
            }, {
                key: "requestMovePrev",
                value: function(event) {
                    this.requestMove("prev", event);
                }
            }, {
                key: "render",
                value: function() {
                    var _this9 = this, _props = this.props, animationDisabled = _props.animationDisabled, animationDuration = _props.animationDuration, clickOutsideToClose = _props.clickOutsideToClose, discourageDownloads = _props.discourageDownloads, enableZoom = _props.enableZoom, imageTitle = _props.imageTitle, nextSrc = _props.nextSrc, prevSrc = _props.prevSrc, toolbarButtons = _props.toolbarButtons, reactModalStyle = _props.reactModalStyle, _state = this.state, zoomLevel = _state.zoomLevel, offsetX = _state.offsetX, offsetY = _state.offsetY, isClosing = _state.isClosing, boxSize = this.getLightboxRect(), transitionStyle = {};
                    // Transition settings for sliding animations
                    !animationDisabled && this.isAnimating() && (transitionStyle = _extends({}, transitionStyle, {
                        transition: "transform " + animationDuration + "ms"
                    }));
                    // Key endings to differentiate between images with the same src
                    var keyEndings = {};
                    this.getSrcTypes().forEach(function(_ref) {
                        var name = _ref.name, keyEnding = _ref.keyEnding;
                        keyEndings[name] = keyEnding;
                    });
                    // Images to be displayed
                    var images = [], addImage = function(srcType, imageClass) {
                        var baseStyle = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                        // Ignore types that have no source defined for their full size image
                        if (_this9.props[srcType]) {
                            var imageStyle = _extends({}, baseStyle, transitionStyle);
                            zoomLevel > _constant.MIN_ZOOM_LEVEL && (imageStyle.cursor = "move");
                            var bestImageInfo = _this9.getBestImageForType(srcType);
                            if (null === bestImageInfo) {
                                var loadingIcon = void 0;
                                // Fall back to loading icon if the thumbnail has not been loaded
                                return loadingIcon = _ieVersion < 10 ? _react2.default.createElement("div", {
                                    className: styles.loadingContainer__icon
                                }, (0, _util.translate)("Loading...")) : _react2.default.createElement("div", {
                                    className: "ril-loading-circle " + styles.loadingCircle + " " + styles.loadingContainer__icon
                                }, _react2.default.createElement("div", {
                                    className: "ril-loading-circle-point " + styles.loadingCirclePoint
                                }), _react2.default.createElement("div", {
                                    className: "ril-loading-circle-point " + styles.loadingCirclePoint
                                }), _react2.default.createElement("div", {
                                    className: "ril-loading-circle-point " + styles.loadingCirclePoint
                                }), _react2.default.createElement("div", {
                                    className: "ril-loading-circle-point " + styles.loadingCirclePoint
                                }), _react2.default.createElement("div", {
                                    className: "ril-loading-circle-point " + styles.loadingCirclePoint
                                }), _react2.default.createElement("div", {
                                    className: "ril-loading-circle-point " + styles.loadingCirclePoint
                                }), _react2.default.createElement("div", {
                                    className: "ril-loading-circle-point " + styles.loadingCirclePoint
                                }), _react2.default.createElement("div", {
                                    className: "ril-loading-circle-point " + styles.loadingCirclePoint
                                }), _react2.default.createElement("div", {
                                    className: "ril-loading-circle-point " + styles.loadingCirclePoint
                                }), _react2.default.createElement("div", {
                                    className: "ril-loading-circle-point " + styles.loadingCirclePoint
                                }), _react2.default.createElement("div", {
                                    className: "ril-loading-circle-point " + styles.loadingCirclePoint
                                }), _react2.default.createElement("div", {
                                    className: "ril-loading-circle-point " + styles.loadingCirclePoint
                                })), void images.push(_react2.default.createElement("div", {
                                    className: imageClass + " " + styles.image + " not-loaded ril-not-loaded",
                                    style: imageStyle,
                                    key: _this9.props[srcType] + keyEndings[srcType]
                                }, _react2.default.createElement("div", {
                                    className: styles.loadingContainer
                                }, loadingIcon)));
                            }
                            imageStyle.width = bestImageInfo.width, imageStyle.height = bestImageInfo.height;
                            var imageSrc = bestImageInfo.src;
                            discourageDownloads ? (imageStyle.backgroundImage = "url('" + imageSrc + "')", images.push(_react2.default.createElement("div", {
                                className: imageClass + " " + styles.image + " " + styles.imageDiscourager,
                                onDoubleClick: _this9.handleImageDoubleClick,
                                onWheel: _this9.handleImageMouseWheel,
                                style: imageStyle,
                                key: imageSrc + keyEndings[srcType]
                            }, _react2.default.createElement("div", {
                                className: "download-blocker ril-download-blocker " + styles.downloadBlocker
                            })))) : images.push(_react2.default.createElement("img", {
                                className: imageClass + " " + styles.image,
                                onDoubleClick: _this9.handleImageDoubleClick,
                                onWheel: _this9.handleImageMouseWheel,
                                style: imageStyle,
                                src: imageSrc,
                                key: imageSrc + keyEndings[srcType],
                                alt: imageTitle || (0, _util.translate)("Image")
                            }));
                        }
                    }, zoomMultiplier = this.getZoomMultiplier();
                    // Next Image (displayed on the right)
                    addImage("nextSrc", "image-next ril-image-next " + styles.imageNext, ReactImageLightbox.getTransform({
                        x: boxSize.width
                    })), // Main Image
                    addImage("mainSrc", "image-current ril-image-current", ReactImageLightbox.getTransform({
                        x: -1 * offsetX,
                        y: -1 * offsetY,
                        zoom: zoomMultiplier
                    })), // Previous Image (displayed on the left)
                    addImage("prevSrc", "image-prev ril-image-prev " + styles.imagePrev, ReactImageLightbox.getTransform({
                        x: -1 * boxSize.width
                    }));
                    var noop = function() {}, zoomInButtonClasses = [ styles.toolbarItemChild, styles.builtinButton, styles.zoomInButton ], zoomOutButtonClasses = [ styles.toolbarItemChild, styles.builtinButton, styles.zoomOutButton ], zoomInButtonHandler = this.handleZoomInButtonClick, zoomOutButtonHandler = this.handleZoomOutButtonClick;
                    // Disable zooming in when zoomed all the way in
                    zoomLevel === _constant.MAX_ZOOM_LEVEL && (zoomInButtonClasses.push(styles.builtinButtonDisabled), 
                    zoomInButtonHandler = noop), // Disable zooming out when zoomed all the way out
                    zoomLevel === _constant.MIN_ZOOM_LEVEL && (zoomOutButtonClasses.push(styles.builtinButtonDisabled), 
                    zoomOutButtonHandler = noop), // Ignore clicks during animation
                    this.isAnimating() && (zoomInButtonHandler = noop, zoomOutButtonHandler = noop);
                    var modalStyle = {
                        overlay: _extends({
                            zIndex: 1e3,
                            backgroundColor: "transparent"
                        }, reactModalStyle.overlay),
                        content: _extends({
                            backgroundColor: "transparent",
                            overflow: "hidden",
                            // Needed, otherwise keyboard shortcuts scroll the page
                            border: "none",
                            borderRadius: 0,
                            padding: 0,
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        }, reactModalStyle.content)
                    };
                    // DEPRECATION NOTICE
                    // All unprefixed classes (listed below) will be removed in v4.0.0.
                    // Use their `ril-` prefixed alternatives instead.
                    //
                    // DEPRECATED: close, closing, download-blocker, image-current,
                    //             image-next, image-prev, inner, next-button, not-loaded,
                    //             outer, prev-button, toolbar, toolbar-left, toolbar-right,
                    //             zoom-in, zoom-out
                    return _react2.default.createElement(_reactModal2.default, {
                        isOpen: !0,
                        onRequestClose: clickOutsideToClose ? this.requestClose : noop,
                        onAfterOpen: function() {
                            return _this9.outerEl && _this9.outerEl.focus();
                        },
                        style: modalStyle
                    }, _react2.default.createElement("div", {
                        // eslint-disable-line jsx-a11y/no-static-element-interactions
                        // Floating modal with closing animations
                        className: "outer ril-outer " + styles.outer + " " + styles.outerAnimating + (isClosing ? " closing ril-closing " + styles.outerClosing : ""),
                        style: {
                            transition: "opacity " + animationDuration + "ms",
                            animationDuration: animationDuration + "ms",
                            animationDirection: isClosing ? "normal" : "reverse"
                        },
                        ref: function(el) {
                            _this9.outerEl = el;
                        },
                        onWheel: this.handleOuterMousewheel,
                        onMouseMove: this.handleOuterMouseMove,
                        onMouseDown: this.handleOuterMouseDown,
                        onTouchStart: this.handleOuterTouchStart,
                        onTouchMove: this.handleOuterTouchMove,
                        tabIndex: "-1",
                        onKeyDown: this.handleKeyInput,
                        onKeyUp: this.handleKeyInput
                    }, _react2.default.createElement("div", {
                        // eslint-disable-line jsx-a11y/no-static-element-interactions
                        // Image holder
                        className: "inner ril-inner " + styles.inner,
                        onClick: clickOutsideToClose ? this.closeIfClickInner : noop
                    }, images), prevSrc && _react2.default.createElement("button", {
                        // Move to previous image button
                        type: "button",
                        className: "prev-button ril-prev-button " + styles.navButtons + " " + styles.navButtonPrev,
                        key: "prev",
                        onClick: this.isAnimating() ? noop : this.requestMovePrev
                    }), nextSrc && _react2.default.createElement("button", {
                        // Move to next image button
                        type: "button",
                        className: "next-button ril-next-button " + styles.navButtons + " " + styles.navButtonNext,
                        key: "next",
                        onClick: this.isAnimating() ? noop : this.requestMoveNext
                    }), _react2.default.createElement("div", {
                        // Lightbox toolbar
                        className: "toolbar ril-toolbar " + styles.toolbar
                    }, _react2.default.createElement("ul", {
                        className: "toolbar-left ril-toolbar-left " + styles.toolbarSide + " " + styles.toolbarLeftSide
                    }, _react2.default.createElement("li", {
                        className: "ril-toolbar__item " + styles.toolbarItem
                    }, _react2.default.createElement("span", {
                        className: "ril-toolbar__item__child " + styles.toolbarItemChild
                    }, imageTitle))), _react2.default.createElement("ul", {
                        className: [ "toolbar-right", "ril-toolbar-right", styles.toolbarSide, styles.toolbarRightSide ].join(" ")
                    }, toolbarButtons ? toolbarButtons.map(function(button, i) {
                        return _react2.default.createElement("li", {
                            key: i,
                            className: "ril-toolbar__item " + styles.toolbarItem
                        }, button);
                    }) : "", enableZoom && _react2.default.createElement("li", {
                        className: "ril-toolbar__item " + styles.toolbarItem
                    }, _react2.default.createElement("button", {
                        // Lightbox zoom in button
                        type: "button",
                        key: "zoom-in",
                        className: "zoom-in ril-zoom-in " + zoomInButtonClasses.join(" "),
                        onClick: zoomInButtonHandler
                    })), enableZoom && _react2.default.createElement("li", {
                        className: "ril-toolbar__item " + styles.toolbarItem
                    }, _react2.default.createElement("button", {
                        // Lightbox zoom out button
                        type: "button",
                        key: "zoom-out",
                        className: "zoom-out ril-zoom-out " + zoomOutButtonClasses.join(" "),
                        onClick: zoomOutButtonHandler
                    })), _react2.default.createElement("li", {
                        className: "ril-toolbar__item " + styles.toolbarItem
                    }, _react2.default.createElement("button", {
                        // Lightbox close button
                        type: "button",
                        key: "close",
                        className: "ril-close ril-toolbar__item__child" + (" " + styles.toolbarItemChild + " " + styles.builtinButton + " " + styles.closeButton),
                        onClick: this.isAnimating() ? noop : this.requestClose
                    })))), this.props.imageCaption && _react2.default.createElement("div", {
                        // Image caption
                        onWheel: this.handleCaptionMousewheel,
                        onMouseDown: function(event) {
                            return event.stopPropagation();
                        },
                        className: "ril-caption " + styles.caption,
                        ref: function(el) {
                            _this9.caption = el;
                        }
                    }, _react2.default.createElement("div", {
                        className: "ril-caption-content " + styles.captionContent
                    }, this.props.imageCaption))));
                }
            } ], [ {
                key: "getTransform",
                value: function(_ref2) {
                    var _ref2$x = _ref2.x, x = void 0 === _ref2$x ? null : _ref2$x, _ref2$y = _ref2.y, y = void 0 === _ref2$y ? null : _ref2$y, _ref2$zoom = _ref2.zoom, zoom = void 0 === _ref2$zoom ? null : _ref2$zoom, isOldIE = _ieVersion < 10, transforms = [];
                    return null === x && null === y || transforms.push(isOldIE ? "translate(" + (x || 0) + "px," + (y || 0) + "px)" : "translate3d(" + (x || 0) + "px," + (y || 0) + "px,0)"), 
                    null !== zoom && transforms.push(isOldIE ? "scale(" + zoom + ")" : "scale3d(" + zoom + "," + zoom + ",1)"), 
                    _defineProperty({}, isOldIE ? "msTransform" : "transform", 0 === transforms.length ? "none" : transforms.join(" "));
                }
            } ]), ReactImageLightbox;
        }(_react.Component);
        ReactImageLightbox.propTypes = {
            //-----------------------------
            // Image sources
            //-----------------------------
            // Main display image url
            mainSrc: _react.PropTypes.string.isRequired,
            // eslint-disable-line react/no-unused-prop-types
            // Previous display image url (displayed to the left)
            // If left undefined, movePrev actions will not be performed, and the button not displayed
            prevSrc: _react.PropTypes.string,
            // Next display image url (displayed to the right)
            // If left undefined, moveNext actions will not be performed, and the button not displayed
            nextSrc: _react.PropTypes.string,
            //-----------------------------
            // Image thumbnail sources
            //-----------------------------
            // Thumbnail image url corresponding to props.mainSrc
            mainSrcThumbnail: _react.PropTypes.string,
            // eslint-disable-line react/no-unused-prop-types
            // Thumbnail image url corresponding to props.prevSrc
            prevSrcThumbnail: _react.PropTypes.string,
            // eslint-disable-line react/no-unused-prop-types
            // Thumbnail image url corresponding to props.nextSrc
            nextSrcThumbnail: _react.PropTypes.string,
            // eslint-disable-line react/no-unused-prop-types
            //-----------------------------
            // Event Handlers
            //-----------------------------
            // Close window event
            // Should change the parent state such that the lightbox is not rendered
            onCloseRequest: _react.PropTypes.func.isRequired,
            // Move to previous image event
            // Should change the parent state such that props.prevSrc becomes props.mainSrc,
            //  props.mainSrc becomes props.nextSrc, etc.
            onMovePrevRequest: _react.PropTypes.func,
            // Move to next image event
            // Should change the parent state such that props.nextSrc becomes props.mainSrc,
            //  props.mainSrc becomes props.prevSrc, etc.
            onMoveNextRequest: _react.PropTypes.func,
            //-----------------------------
            // Download discouragement settings
            //-----------------------------
            // Enable download discouragement (prevents [right-click -> Save Image As...])
            discourageDownloads: _react.PropTypes.bool,
            //-----------------------------
            // Animation settings
            //-----------------------------
            // Disable all animation
            animationDisabled: _react.PropTypes.bool,
            // Disable animation on actions performed with keyboard shortcuts
            animationOnKeyInput: _react.PropTypes.bool,
            // Animation duration (ms)
            animationDuration: _react.PropTypes.number,
            //-----------------------------
            // Keyboard shortcut settings
            //-----------------------------
            // Required interval of time (ms) between key actions
            // (prevents excessively fast navigation of images)
            keyRepeatLimit: _react.PropTypes.number,
            // Amount of time (ms) restored after each keyup
            // (makes rapid key presses slightly faster than holding down the key to navigate images)
            keyRepeatKeyupBonus: _react.PropTypes.number,
            //-----------------------------
            // Image info
            //-----------------------------
            // Image title
            imageTitle: _react.PropTypes.node,
            // Image caption
            imageCaption: _react.PropTypes.node,
            //-----------------------------
            // Lightbox style
            //-----------------------------
            // Set z-index style, etc., for the parent react-modal (format: https://github.com/reactjs/react-modal#styles )
            reactModalStyle: _react.PropTypes.object,
            // Padding (px) between the edge of the window and the lightbox
            imagePadding: _react.PropTypes.number,
            //-----------------------------
            // Other
            //-----------------------------
            // Array of custom toolbar buttons
            toolbarButtons: _react.PropTypes.arrayOf(_react.PropTypes.node),
            // When true, clicks outside of the image close the lightbox
            clickOutsideToClose: _react.PropTypes.bool,
            // Set to false to disable zoom functionality and hide zoom buttons
            enableZoom: _react.PropTypes.bool
        }, ReactImageLightbox.defaultProps = {
            onMovePrevRequest: function() {},
            onMoveNextRequest: function() {},
            discourageDownloads: !1,
            animationDisabled: !1,
            animationOnKeyInput: !1,
            animationDuration: 300,
            keyRepeatLimit: 180,
            keyRepeatKeyupBonus: 40,
            reactModalStyle: {},
            imagePadding: 10,
            clickOutsideToClose: !0,
            enableZoom: !0
        }, exports.default = ReactImageLightbox;
    }, /* 3 */
    /***/
    function(module, exports) {
        "use strict";
        /**
	 * Get the version of Internet Explorer in use, or undefined
	 *
	 * @return {?number} ieVersion - IE version as an integer, or undefined if not IE
	 */
        function getIEVersion() {
            var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
            return match ? parseInt(match[1], 10) : void 0;
        }
        /**
	 * Placeholder for future translate functionality
	 */
        function translate(str) {
            var replaceStrings = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
            if (!str) return "";
            var translated = str;
            return replaceStrings && Object.keys(replaceStrings).forEach(function(placeholder) {
                translated = translated.replace(placeholder, replaceStrings[placeholder]);
            }), translated;
        }
        function getWindowWidth() {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        }
        function getWindowHeight() {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        }
        // Returns true if this window is rendered as an iframe inside another window
        function isInIframe() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return !0;
            }
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.getIEVersion = getIEVersion, exports.translate = translate, exports.getWindowWidth = getWindowWidth, 
        exports.getWindowHeight = getWindowHeight, exports.isInIframe = isInIframe;
    }, /* 4 */
    /***/
    function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(5)(), // imports
        // module
        exports.push([ module.id, '@-webkit-keyframes closeWindow___2Hlon{0%{opacity:1}to{opacity:0}}@keyframes closeWindow___2Hlon{0%{opacity:1}to{opacity:0}}.outer___2lDXy{background-color:rgba(0,0,0,.85);top:0;left:0;right:0;bottom:0;z-index:1000;width:100%;height:100%}.outerClosing___1EQGK{opacity:0}.image___2FLq2,.inner___1rfRQ{position:absolute;top:0;left:0;right:0;bottom:0}.image___2FLq2{margin:auto;max-width:100%;max-height:100%}.imageNext___1uRqJ,.imagePrev___F6xVQ{@extends .image}.imageDiscourager___3-CUB{background-repeat:no-repeat;background-position:50%;background-size:contain}.navButtons___3kNVF{border:none;position:absolute;top:0;bottom:0;width:20px;height:34px;padding:40px 30px;margin:auto;cursor:pointer;opacity:.7}.navButtons___3kNVF:hover{opacity:1}.navButtons___3kNVF:active{opacity:.7}.navButtonPrev___2vBS8{left:0;background:rgba(0,0,0,.2) url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjM0Ij48cGF0aCBkPSJtIDE5LDMgLTIsLTIgLTE2LDE2IDE2LDE2IDEsLTEgLTE1LC0xNSAxNSwtMTUgeiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg==") no-repeat 50%}.navButtonNext___30R2i{right:0;background:rgba(0,0,0,.2) url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjM0Ij48cGF0aCBkPSJtIDEsMyAyLC0yIDE2LDE2IC0xNiwxNiAtMSwtMSAxNSwtMTUgLTE1LC0xNSB6IiBmaWxsPSIjRkZGIi8+PC9zdmc+") no-repeat 50%}.downloadBlocker___3rU9-{position:absolute;top:0;left:0;right:0;bottom:0;background-image:url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");background-size:cover}.caption___3vDh_,.toolbar___1xYly{background-color:rgba(0,0,0,.5);position:absolute;left:0;right:0;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.caption___3vDh_{bottom:0;max-height:150px;overflow:auto}.captionContent___30kw2{padding:10px 20px;color:#fff}.toolbar___1xYly{top:0;height:50px}.toolbarSide___3FYWk{height:50px;margin:0}.toolbarSideNoFlex___KxqgW{height:auto;line-height:50px;max-width:48%;position:absolute;top:0;bottom:0}.toolbarLeftSide___8beAg{padding-left:20px;padding-right:0;-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;overflow:hidden;text-overflow:ellipsis}.toolbarLeftSideNoFlex___3O3cZ{left:0;overflow:visible}.toolbarRightSide___1Sdfc{padding-left:0;padding-right:20px;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto}.toolbarRightSideNoFlex___oa0FT{right:0}.toolbarItem___3WbMb{display:inline-block;line-height:50px;padding:0;color:#fff;font-size:120%;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.toolbarItemChild___2U_MP{vertical-align:middle}.builtinButton___1zqo6{width:40px;height:35px;cursor:pointer;border:none;opacity:.7}.builtinButton___1zqo6:hover{opacity:1}.builtinButton___1zqo6:active{outline:none}.builtinButtonDisabled___3uvqe{cursor:default;opacity:.5}.builtinButtonDisabled___3uvqe:hover{opacity:.5}.closeButton___3BdAF{background:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48cGF0aCBkPSJtIDEsMyAxLjI1LC0xLjI1IDcuNSw3LjUgNy41LC03LjUgMS4yNSwxLjI1IC03LjUsNy41IDcuNSw3LjUgLTEuMjUsMS4yNSAtNy41LC03LjUgLTcuNSw3LjUgLTEuMjUsLTEuMjUgNy41LC03LjUgLTcuNSwtNy41IHoiIGZpbGw9IiNGRkYiLz48L3N2Zz4=") no-repeat 50%}.zoomInButton___3xtuX{background:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGcgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0iTTEgMTlsNi02Ii8+PHBhdGggZD0iTTkgOGg2Ii8+PHBhdGggZD0iTTEyIDV2NiIvPjwvZz48Y2lyY2xlIGN4PSIxMiIgY3k9IjgiIHI9IjciIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+") no-repeat 50%}.zoomOutButton___38PZx{background:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGcgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0iTTEgMTlsNi02Ii8+PHBhdGggZD0iTTkgOGg2Ii8+PC9nPjxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=") no-repeat 50%}.outerAnimating___2-fZi{-webkit-animation-name:closeWindow___2Hlon;animation-name:closeWindow___2Hlon}@-webkit-keyframes pointFade___2RA5J{0%,19.999%,to{opacity:0}20%{opacity:1}}@keyframes pointFade___2RA5J{0%,19.999%,to{opacity:0}20%{opacity:1}}.loadingCircle___3JNJg{width:60px;height:60px;position:relative}.loadingCirclePoint___3md-S{width:100%;height:100%;position:absolute;left:0;top:0}.loadingCirclePoint___3md-S:before{content:\'\';display:block;margin:0 auto;width:15%;height:15%;background-color:#fff;border-radius:30%;-webkit-animation:pointFade___2RA5J 1.2s infinite ease-in-out both;animation:pointFade___2RA5J 1.2s infinite ease-in-out both}.loadingCirclePoint___3md-S:nth-of-type(1){-webkit-transform:rotate(0deg);transform:rotate(0deg)}.loadingCirclePoint___3md-S:nth-of-type(1):before,.loadingCirclePoint___3md-S:nth-of-type(7):before{-webkit-animation-delay:-1.2s;animation-delay:-1.2s}.loadingCirclePoint___3md-S:nth-of-type(2){-webkit-transform:rotate(30deg);transform:rotate(30deg)}.loadingCirclePoint___3md-S:nth-of-type(8){-webkit-transform:rotate(210deg);transform:rotate(210deg)}.loadingCirclePoint___3md-S:nth-of-type(2):before,.loadingCirclePoint___3md-S:nth-of-type(8):before{-webkit-animation-delay:-1s;animation-delay:-1s}.loadingCirclePoint___3md-S:nth-of-type(3){-webkit-transform:rotate(60deg);transform:rotate(60deg)}.loadingCirclePoint___3md-S:nth-of-type(9){-webkit-transform:rotate(240deg);transform:rotate(240deg)}.loadingCirclePoint___3md-S:nth-of-type(3):before,.loadingCirclePoint___3md-S:nth-of-type(9):before{-webkit-animation-delay:-.8s;animation-delay:-.8s}.loadingCirclePoint___3md-S:nth-of-type(4){-webkit-transform:rotate(90deg);transform:rotate(90deg)}.loadingCirclePoint___3md-S:nth-of-type(10){-webkit-transform:rotate(270deg);transform:rotate(270deg)}.loadingCirclePoint___3md-S:nth-of-type(4):before,.loadingCirclePoint___3md-S:nth-of-type(10):before{-webkit-animation-delay:-.6s;animation-delay:-.6s}.loadingCirclePoint___3md-S:nth-of-type(5){-webkit-transform:rotate(120deg);transform:rotate(120deg)}.loadingCirclePoint___3md-S:nth-of-type(11){-webkit-transform:rotate(300deg);transform:rotate(300deg)}.loadingCirclePoint___3md-S:nth-of-type(5):before,.loadingCirclePoint___3md-S:nth-of-type(11):before{-webkit-animation-delay:-.4s;animation-delay:-.4s}.loadingCirclePoint___3md-S:nth-of-type(6){-webkit-transform:rotate(150deg);transform:rotate(150deg)}.loadingCirclePoint___3md-S:nth-of-type(12){-webkit-transform:rotate(330deg);transform:rotate(330deg)}.loadingCirclePoint___3md-S:nth-of-type(6):before,.loadingCirclePoint___3md-S:nth-of-type(12):before{-webkit-animation-delay:-.2s;animation-delay:-.2s}.loadingCirclePoint___3md-S:nth-of-type(7){-webkit-transform:rotate(180deg);transform:rotate(180deg)}.loadingCirclePoint___3md-S:nth-of-type(13){-webkit-transform:rotate(1turn);transform:rotate(1turn)}.loadingCirclePoint___3md-S:nth-of-type(7):before,.loadingCirclePoint___3md-S:nth-of-type(13):before{-webkit-animation-delay:0ms;animation-delay:0ms}.loadingContainer___2vaJ-{position:absolute;top:0;right:0;bottom:0;left:0}.loadingContainer__icon___1wQQz{color:#fff;position:absolute;top:50%;left:50%;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%)}', "" ]), 
        // exports
        exports.locals = {
            outer: "outer___2lDXy",
            outerClosing: "outerClosing___1EQGK",
            inner: "inner___1rfRQ",
            image: "image___2FLq2",
            imagePrev: "imagePrev___F6xVQ",
            imageNext: "imageNext___1uRqJ",
            imageDiscourager: "imageDiscourager___3-CUB",
            navButtons: "navButtons___3kNVF",
            navButtonPrev: "navButtonPrev___2vBS8",
            navButtonNext: "navButtonNext___30R2i",
            downloadBlocker: "downloadBlocker___3rU9-",
            caption: "caption___3vDh_",
            toolbar: "toolbar___1xYly",
            captionContent: "captionContent___30kw2",
            toolbarSide: "toolbarSide___3FYWk",
            toolbarSideNoFlex: "toolbarSideNoFlex___KxqgW",
            toolbarLeftSide: "toolbarLeftSide___8beAg",
            toolbarLeftSideNoFlex: "toolbarLeftSideNoFlex___3O3cZ",
            toolbarRightSide: "toolbarRightSide___1Sdfc",
            toolbarRightSideNoFlex: "toolbarRightSideNoFlex___oa0FT",
            toolbarItem: "toolbarItem___3WbMb",
            toolbarItemChild: "toolbarItemChild___2U_MP",
            builtinButton: "builtinButton___1zqo6",
            builtinButtonDisabled: "builtinButtonDisabled___3uvqe",
            closeButton: "closeButton___3BdAF",
            zoomInButton: "zoomInButton___3xtuX",
            zoomOutButton: "zoomOutButton___38PZx",
            outerAnimating: "outerAnimating___2-fZi",
            closeWindow: "closeWindow___2Hlon",
            loadingCircle: "loadingCircle___3JNJg",
            loadingCirclePoint: "loadingCirclePoint___3md-S",
            pointFade: "pointFade___2RA5J",
            loadingContainer: "loadingContainer___2vaJ-",
            loadingContainer__icon: "loadingContainer__icon___1wQQz"
        };
    }, /* 5 */
    /***/
    function(module, exports) {
        /*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
        // css base code, injected by the css-loader
        module.exports = function() {
            var list = [];
            // return the list of modules as css string
            // import a list of modules into the list
            return list.toString = function() {
                for (var result = [], i = 0; i < this.length; i++) {
                    var item = this[i];
                    item[2] ? result.push("@media " + item[2] + "{" + item[1] + "}") : result.push(item[1]);
                }
                return result.join("");
            }, list.i = function(modules, mediaQuery) {
                "string" == typeof modules && (modules = [ [ null, modules, "" ] ]);
                for (var alreadyImportedModules = {}, i = 0; i < this.length; i++) {
                    var id = this[i][0];
                    "number" == typeof id && (alreadyImportedModules[id] = !0);
                }
                for (i = 0; i < modules.length; i++) {
                    var item = modules[i];
                    // skip already imported module
                    // this implementation is not 100% perfect for weird media query combinations
                    //  when a module is imported multiple times with different media queries.
                    //  I hope this will never occur (Hey this way we have smaller bundles)
                    "number" == typeof item[0] && alreadyImportedModules[item[0]] || (mediaQuery && !item[2] ? item[2] = mediaQuery : mediaQuery && (item[2] = "(" + item[2] + ") and (" + mediaQuery + ")"), 
                    list.push(item));
                }
            }, list;
        };
    }, /* 6 */
    /***/
    function(module, exports, __webpack_require__) {
        function addStylesToDom(styles, options) {
            for (var i = 0; i < styles.length; i++) {
                var item = styles[i], domStyle = stylesInDom[item.id];
                if (domStyle) {
                    domStyle.refs++;
                    for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j](item.parts[j]);
                    for (;j < item.parts.length; j++) domStyle.parts.push(addStyle(item.parts[j], options));
                } else {
                    for (var parts = [], j = 0; j < item.parts.length; j++) parts.push(addStyle(item.parts[j], options));
                    stylesInDom[item.id] = {
                        id: item.id,
                        refs: 1,
                        parts: parts
                    };
                }
            }
        }
        function listToStyles(list) {
            for (var styles = [], newStyles = {}, i = 0; i < list.length; i++) {
                var item = list[i], id = item[0], css = item[1], media = item[2], sourceMap = item[3], part = {
                    css: css,
                    media: media,
                    sourceMap: sourceMap
                };
                newStyles[id] ? newStyles[id].parts.push(part) : styles.push(newStyles[id] = {
                    id: id,
                    parts: [ part ]
                });
            }
            return styles;
        }
        function insertStyleElement(options, styleElement) {
            var head = getHeadElement(), lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
            if ("top" === options.insertAt) lastStyleElementInsertedAtTop ? lastStyleElementInsertedAtTop.nextSibling ? head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling) : head.appendChild(styleElement) : head.insertBefore(styleElement, head.firstChild), 
            styleElementsInsertedAtTop.push(styleElement); else {
                if ("bottom" !== options.insertAt) throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
                head.appendChild(styleElement);
            }
        }
        function removeStyleElement(styleElement) {
            styleElement.parentNode.removeChild(styleElement);
            var idx = styleElementsInsertedAtTop.indexOf(styleElement);
            idx >= 0 && styleElementsInsertedAtTop.splice(idx, 1);
        }
        function createStyleElement(options) {
            var styleElement = document.createElement("style");
            return styleElement.type = "text/css", insertStyleElement(options, styleElement), 
            styleElement;
        }
        function createLinkElement(options) {
            var linkElement = document.createElement("link");
            return linkElement.rel = "stylesheet", insertStyleElement(options, linkElement), 
            linkElement;
        }
        function addStyle(obj, options) {
            var styleElement, update, remove;
            if (options.singleton) {
                var styleIndex = singletonCounter++;
                styleElement = singletonElement || (singletonElement = createStyleElement(options)), 
                update = applyToSingletonTag.bind(null, styleElement, styleIndex, !1), remove = applyToSingletonTag.bind(null, styleElement, styleIndex, !0);
            } else obj.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (styleElement = createLinkElement(options), 
            update = updateLink.bind(null, styleElement), remove = function() {
                removeStyleElement(styleElement), styleElement.href && URL.revokeObjectURL(styleElement.href);
            }) : (styleElement = createStyleElement(options), update = applyToTag.bind(null, styleElement), 
            remove = function() {
                removeStyleElement(styleElement);
            });
            return update(obj), function(newObj) {
                if (newObj) {
                    if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
                    update(obj = newObj);
                } else remove();
            };
        }
        function applyToSingletonTag(styleElement, index, remove, obj) {
            var css = remove ? "" : obj.css;
            if (styleElement.styleSheet) styleElement.styleSheet.cssText = replaceText(index, css); else {
                var cssNode = document.createTextNode(css), childNodes = styleElement.childNodes;
                childNodes[index] && styleElement.removeChild(childNodes[index]), childNodes.length ? styleElement.insertBefore(cssNode, childNodes[index]) : styleElement.appendChild(cssNode);
            }
        }
        function applyToTag(styleElement, obj) {
            var css = obj.css, media = obj.media;
            if (media && styleElement.setAttribute("media", media), styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
                for (;styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
                styleElement.appendChild(document.createTextNode(css));
            }
        }
        function updateLink(linkElement, obj) {
            var css = obj.css, sourceMap = obj.sourceMap;
            sourceMap && (// http://stackoverflow.com/a/26603875
            css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */");
            var blob = new Blob([ css ], {
                type: "text/css"
            }), oldSrc = linkElement.href;
            linkElement.href = URL.createObjectURL(blob), oldSrc && URL.revokeObjectURL(oldSrc);
        }
        /*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
        var stylesInDom = {}, memoize = function(fn) {
            var memo;
            return function() {
                return "undefined" == typeof memo && (memo = fn.apply(this, arguments)), memo;
            };
        }, isOldIE = memoize(function() {
            return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
        }), getHeadElement = memoize(function() {
            return document.head || document.getElementsByTagName("head")[0];
        }), singletonElement = null, singletonCounter = 0, styleElementsInsertedAtTop = [];
        module.exports = function(list, options) {
            options = options || {}, // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
            // tags it will allow on a page
            "undefined" == typeof options.singleton && (options.singleton = isOldIE()), // By default, add <style> tags to the bottom of <head>.
            "undefined" == typeof options.insertAt && (options.insertAt = "bottom");
            var styles = listToStyles(list);
            return addStylesToDom(styles, options), function(newList) {
                for (var mayRemove = [], i = 0; i < styles.length; i++) {
                    var item = styles[i], domStyle = stylesInDom[item.id];
                    domStyle.refs--, mayRemove.push(domStyle);
                }
                if (newList) {
                    var newStyles = listToStyles(newList);
                    addStylesToDom(newStyles, options);
                }
                for (var i = 0; i < mayRemove.length; i++) {
                    var domStyle = mayRemove[i];
                    if (0 === domStyle.refs) {
                        for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();
                        delete stylesInDom[domStyle.id];
                    }
                }
            };
        };
        var replaceText = function() {
            var textStore = [];
            return function(index, replacement) {
                return textStore[index] = replacement, textStore.filter(Boolean).join("\n");
            };
        }();
    }, /* 7 */
    /***/
    function(module, exports, __webpack_require__) {
        // style-loader: Adds some css to the DOM by adding a <style> tag
        // load the styles
        var content = __webpack_require__(4);
        "string" == typeof content && (content = [ [ module.id, content, "" ] ]);
        // add the styles to the DOM
        __webpack_require__(6)(content, {});
        content.locals && (module.exports = content.locals);
    }, /* 8 */
    /***/
    function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_8__;
    }, /* 9 */
    /***/
    function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_9__;
    } ]);
});
//# sourceMappingURL=react-image-lightbox.js.map

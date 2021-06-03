self["webpackHotUpdateloopro"]("contentScript",{

/***/ "./src/pages/Content/index.js":
/*!************************************!*\
  !*** ./src/pages/Content/index.js ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_print__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/print */ "./src/pages/Content/modules/print.js");
/* module decorator */ module = __webpack_require__.hmd(module);
(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal["default"].signature : function (a) {
  return a;
};


var duration;
var pageHasVideo;
var video;
var startTime;
var pausedTime;
var endTime;

window.onload = function () {
  // Listener for metadata of video
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    video = document.getElementsByTagName("video")[0];

    if (video) {
      // video exists on the page
      duration = video.duration;
      pageHasVideo = duration != null ? true : false;
    } else {
      pageHasVideo = false; //TODO: if page doesn't have video, show dialogue
    }

    switch (message.type) {
      case "pageHasVideo":
        sendResponse(pageHasVideo);
        break;

      case "getDuration":
        sendResponse(duration);
        break;

      default:
        console.error("Unrecognised message: ", message);
    }
  });

  function loop() {
    if (this.currentTime >= endTime) {
      // loop
      video.currentTime = startTime;
    }
  } // Listener to control the video


  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var success = true; // may be false cases in the future

    switch (message.type) {
      case "startLoop":
        startTime = message.startTime;
        endTime = message.endTime; // Add listener to video

        video.addEventListener("timeupdate", loop); // Set speed

        video.playbackRate = message.speed; // start video at startTime

        sendResponse(success);
        break;

      case "pauseLoop":
        // pause video
        video.pause();
        pausedTime = video.currentTime;
        video.removeEventListener("timeupdate", loop);
        sendResponse(success);
        break;

      case "resumeLoop":
        video.currentTime = pausedTime;
        video.addEventListener("timeupdate", loop);
        video.play();

      case "stopLoop":
        // pause video
        video.pause(); // remove video listener

        video.removeEventListener("timeupdate", loop);
        sendResponse(success);
        break;

      case "changeSpeed":
        // change video speed
        video.playbackRate = message.speed;
        sendResponse(success);
        break;

      case "changeStartTime":
        // change startTime
        startTime = message.startTime;
        sendResponse(success);
        break;

      case "changeEndTime":
        // change endTime
        endTime = message.endTime;
        sendResponse(success);
        break;

      default:
        console.error("Unrecognised message: ", message);
    }
  });
}.bind(undefined);

;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(duration, "duration", "/Users/joshuayang/Desktop/Github/loopro/src/pages/Content/index.js");
  reactHotLoader.register(pageHasVideo, "pageHasVideo", "/Users/joshuayang/Desktop/Github/loopro/src/pages/Content/index.js");
  reactHotLoader.register(video, "video", "/Users/joshuayang/Desktop/Github/loopro/src/pages/Content/index.js");
  reactHotLoader.register(startTime, "startTime", "/Users/joshuayang/Desktop/Github/loopro/src/pages/Content/index.js");
  reactHotLoader.register(pausedTime, "pausedTime", "/Users/joshuayang/Desktop/Github/loopro/src/pages/Content/index.js");
  reactHotLoader.register(endTime, "endTime", "/Users/joshuayang/Desktop/Github/loopro/src/pages/Content/index.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("16bbbb80eb14be11c735")
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=contentScript.789e30bd05e6206a676d.hot-update.js.map
import { printLine } from './modules/print';

var duration = 0.0;
var pageHasVideo = false; // default values set here
var video;

var startTime;
var pausedTime;
var endTime;

window.onload = function () {

  function loop() {
    if(this.currentTime >= endTime) {
        // loop
        video.currentTime = startTime;
    }
  }

  function safePlay() {
    var isPlaying = video.currentTime > 0 && !video.paused && !video.ended
    && video.readyState > video.HAVE_CURRENT_DATA;

    if (!isPlaying) {
      video.play();
    }
  }

  // Listener
  chrome.runtime.onMessage.addListener(
      function(message, sender, sendResponse) {
          // Get video metadata when document is loaded
          video = document.getElementsByTagName("video")[0];
          if (video) {
            // video exists on the page
            duration = video.duration;
            pageHasVideo = duration != null ? true : false;
          } else {
            pageHasVideo = false;
            //TODO: if page doesn't have video, show dialogue
          }


          var success = true; // may be false cases in the future

          switch(message.type) {
              case "startLoop":
                  startTime = parseFloat(message.startTime);
                  endTime = parseFloat(message.endTime);

                  // Add listener to video
                  video.addEventListener("timeupdate", loop);
                  // Set speed
                  video.playbackRate = parseFloat(message.speed);
                  // start video at startTime
                  video.currentTime = startTime;
                  safePlay();
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
                  video.pause();
                  safePlay();
              case "stopLoop":
                  // pause video
                  video.pause();
                  // remove video listener
                  video.removeEventListener("timeupdate", loop);
                  sendResponse(success);
                  break;
              case "changeSpeed":
                  // change video speed
                  video.playbackRate = parseFloat(message.speed);
                  sendResponse(success);
                  break;
              case "changeStartTime":
                  // change startTime
                  startTime = parseFloat(message.startTime);
                  sendResponse(success);
                  break;
              case "changeEndTime":
                  // change endTime
                  endTime = parseFloat(message.endTime);
                  sendResponse(success);
                  break;
              case "getVideoData":
                  let data = {duration: duration, pageHasVideo: pageHasVideo};
                  sendResponse(data);
                  break;
              default:
                  console.error("Unrecognised message: ", message);
          }
      }
  );


}.bind(this);

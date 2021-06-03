import React from 'react';
import logo from '../../assets/img/loop-logo.svg';
import './Popup.css';

class Popup extends React.Component {

  constructor(props) {
    super(props);

    this.videoDataGathered = false;

    var that = this;

    chrome.runtime.onMessage.addListener(
        function(message, sender, sendResponse) {
            switch(message.type) {
                case "urlUpdated":
                    this.getVideoData(); // When url updates, update video data
                    break;
                default:
                    console.error("Unrecognised message: ", message);
            }
        }.bind(that)
    );

    // Bind this for various functions
    this.getVideoData = this.getVideoData.bind(this);
    this.startLoop = this.startLoop.bind(this);
    this.pauseLoop = this.pauseLoop.bind(this);
    this.resumeLoop = this.resumeLoop.bind(this);
    this.stopLoop = this.stopLoop.bind(this);

    this.onInputChange = this.onInputChange.bind(this);

    this.loadState = this.loadState.bind(this);
    this.saveState = this.saveState.bind(this);

    // Add listener to get video data when things load
    window.addEventListener('load', this.getVideoData);

    // Create refs used to get html input values
    this.startTime = React.createRef();
    this.endTime = React.createRef();
    this.speed = React.createRef();
    this.logo = React.createRef();

    if (localStorage.getItem("popup_state")) {
      console.log("LOATIND STAGEEE");
      this.loadState();
    } else {
      this.state = {
        duration: "0.0",
        pageHasVideo: false,
        paused: false,
        videoDataGathered: false,
        startTime: "00:00",
        endTime: "00:00",
        speed: "1.0",
      };
    }
    // window.addEventListener('beforeunload', function (e) {
    //                                 e.preventDefault();
    //                                 this.saveState();
    //                                 alert("state saved?");
    //                               }.bind(this));
  }

  showLocalStorage() {
    var i;
    console.log("LOCAL STORAGE");
    for (i = 0; i < localStorage.length; i++)   {
        console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
    }
  }

  loadState() {
    this.state = JSON.parse(localStorage.getItem('popup_state'));
  }
  saveState() {
    localStorage.setItem('popup_state', JSON.stringify(this.state));
  }

  getVideoData() {
    var that = this;
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: "getVideoData"}, (data) => {
          if(typeof data == "undefined") {
              // That's kind of bad
              if(chrome.runtime.lastError) {
                  // We couldn't talk to the content script, probably it's not there
                  console.log("Content script not found!!!");
              }
          } else {
              // set state
              that.setState({duration: data.duration, pageHasVideo: data.pageHasVideo, videoDataGathered: true});
          }
        });
    });
  }

  minToSec(mins) {
    // source: https://stackoverflow.com/questions/8907764/convert-minutes-to-seconds
    var parts = mins.toString().split(':'),
        minutes = +parts[0],
        seconds = +parts[1];
    return (minutes * 60 + seconds).toFixed(3);
  }

  secToMin(sec) {
    // code adapted from https://www.codegrepper.com/code-examples/javascript/convert+minutes+into+seconds+javascript

    sec = parseInt(sec, 10); // convert value to number if it's string
    let hours   = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    if (hours == 0) {
      return minutes+':'+seconds;
    } else {
      return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
    }

  }

  startLoop(e) {
    e.preventDefault();
    if (this.state.paused) {
      this.resumeLoop();
    } else {
      var start = this.minToSec(this.startTime.current.value)
      var end = this.minToSec(this.endTime.current.value)
      console.log(this.speed.current.value)

      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "startLoop",
            startTime: start.toString(),
            endTime: end.toString(),
            speed: this.speed.current.value.toString()
          });
      });

      this.logo.current.className = "App-logo App-logo-anim";
    }
  }

  pauseLoop(e) {
    e.preventDefault();
    this.setState({paused: true});
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: "pauseLoop"})
    });
    this.logo.current.className = "App-logo";
  }

  resumeLoop() {
    this.setState({paused: false});
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: "resumeLoop"})
    });
    this.logo.current.className = "App-logo App-logo-anim";
  }

  stopLoop(e) {
    e.preventDefault();
    this.setState({paused: false});
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: "stopLoop"})
    });
    this.logo.current.className = "App-logo";
  }

  onInputChange(e) {
    e.preventDefault();
    switch (e.target.id) {
      case "startTime":
        this.setState({startTime: e.target.value}, () => {
          this.saveState();
        });
        break;
      case "endTime":
        this.setState({endTime: e.target.value}, () => {
          this.saveState();
        });
        break;
      case "speed":
        this.setState({speed: e.target.value}, () => {
          this.saveState();
        });
        break;
      default:
        console.log("not sure what was changed in input.");
    }
  }

  Main() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Loopro</h1>
          <img src={logo} ref={this.logo} className="App-logo" alt="logo" />
          <p>
            Looks like this page has a video! Set a time interval from 00:00 to {this.secToMin(this.state.duration).toString()}, and press "Loop" to loop the video snippet. Enjoy!
          </p>
          <div className="App-body">
            <label for="startTime">Start time:</label>
            <input type="text" id="startTime" name="start" onChange={this.onInputChange} ref={this.startTime} defaultValue={this.state.startTime}></input><br></br>
            <label for="endTime" style={{padding:"5px"}}>End time:</label>
            <input type="text" id="endTime" name="end" onChange={this.onInputChange} ref={this.endTime} defaultValue={this.state.endTime}></input><br></br>
            <label for="speed" style={{padding:"5px"}}>Speed:</label>
            <input type="text" id="speed" name="speed" onChange={this.onInputChange} ref={this.speed} defaultValue={this.state.speed}></input><br></br>
            <button onClick={this.startLoop} className="Button" >Loop</button>
            <button onClick={this.stopLoop} className="Button">Stop</button>
          </div>
        </header>
      </div>
    );
  }

  Loading() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Loading video data...
          </p>
        </header>
      </div>
    );
  }

  NoVideo() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Video not found on current page. Use Loopro on a different page, or try refreshing.
          </p>
        </header>
      </div>
    );
  }

  render() {
    if (this.state.pageHasVideo) {
      if (this.state.videoDataGathered) {
        return this.Main();
      } else {
        return this.Loading();
      }
    } else {
      return this.NoVideo();
    }
  }
}



export default Popup

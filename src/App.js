
// Copyright @ 2020 ABCOM Information Systems Pvt. Ltd. All Rights Reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ==============================================================================

// Import dependencies
import React, { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import WebCam from "react-webcam";
import "./App.css";
import "react-cam";

// Main function for Application
function App() {
  const webcamref = useRef(null);
  const canvasref = useRef(null);

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamref.current !== "undefined" &&
      webcamref.current !== null &&
      webcamref.current.video.readyState === 4
    ) {
      // Set canvas height and width for video
      canvasref.current.width = webcamref.current.video.videoWidth;
      canvasref.current.height = webcamref.current.video.videoHeight;

      // Make Detections
      const obj = await net.detect(webcamref.current.video);
      const ctx = canvasref.current.getContext("2d");
      drawBoxes(obj, ctx);
    }
  };

  const drawBoxes = (detections, ctx) => {
    // Loop through all detected objects
    detections.forEach((prediction) => {
      // Extract boxes and classes
      const [x, y, width, height] = prediction["bbox"];
      const text = prediction["class"];
      var color;
      if (text === "Person") {
        color = "#FF0000";
      } else if (text === "Bottle" || text === "bottle") {
        color = "#00FF00";
      } else if (text === "Book" || text === "book") {
        color = "#0000FF";
      }

      ctx.strokeStyle = color;
      ctx.font = "24px Arial";

      // Draw rectangles and text
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      ctx.rect(x, y, width, height);
      ctx.stroke();
    });
  };

  const runCoco = async () => {
    const net = await cocossd.load();
    //  Loop and detect objects in realtime
    setInterval(() => {
      detect(net);
    }, 10);
  };

  runCoco();

  return (
    <div className="App">
      <header className="App-header">
        <WebCam
          ref={webcamref}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 800,
            height: 800
          }}
        />
        <canvas
          ref={canvasref}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "left",
            zindex: 8,
          }}
        />
      </header>
    </div>
  );
}

export default App;

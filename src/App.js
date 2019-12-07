import React from 'react';
import logo from './logo.svg';
import c from './cof.png'
import '@vkontakte/vkui/dist/vkui.css';
import {Root, View, Panel, File} from '@vkontakte/vkui'
import base64js from 'base64js';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';
import axios from 'axios';
import MyComponent from 'mobile-canvas-camera'
import './App.css';
import $ from "../node_modules/jquery/dist/jquery";
import SolvedPlace from './SolvedPlace';
const image2base64 = require('image-to-base64');


/*var img;

async function  W(){
  let preimg = document.getElementById('preimg');
  let file = preimg.files[0];
  let reader = new FileReader();
  let blob = new Blob([file], {type: 'image/png'});
  console.log(blob);
   var a  = URL.createObjectURL(file);
   const img = new Image();
   img.src = a;

  const model = await mobilenet.load("model.json","metadata.json");
// Classify the image.
const predictions = await model.classify(img);

console.log('Predictions: ');
console.log(predictions);*/
var all = [];
var isRunning = true;
var find = true;
var faceID;
var level;

const URL = "https://teachablemachine.withgoogle.com/models/yaMiK4Ex/";


   let model, webcam, labelContainer, maxPredictions;


     // Load the image model and setup the webcam

class App extends React.Component{
constructor(props){
  super(props);

  this.state={
    mustShow:false,
    place:'Соборная колокольня'



 };
 this.handleClick=this.handleClick.bind(this);
 this.init = this.init.bind(this);
 this.loop = this.loop.bind(this);
  this.predict = this.predict.bind(this);
}

componentDidMount(e){
  this.init();
}

 random=()=>{
  return Math.floor(Math.random() * Math.floor(maxPredictions));
}

create_all=(prediction)=>{
  for (let i = 0; i < maxPredictions; i++) {
    all.push(prediction[i].className);
  }
}
 async init () {
  //document.body.style.overflow = "hidden"
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    console.log(1);
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    var canvas = document.getElementById("canvas");
    const prediction = await model.predict(canvas);
    this.create_all(prediction);

    console.log(prediction);
  faceID = this.random();
   var newDiv = document.getElementById("fin");
 //  newDiv.innerHTML = "<h1>"+all[faceID]+"</h1>";

   console.log(faceID);
   console.log(all);
    // Convenience function to setup a webcam
    const flip = false; // whether to flip the webcam
    let height1=$('#webcam-container').height();
    let width1=$('#webcam-container').width();
    if(height1>width1){

     webcam = new tmImage.Webcam(height1,width1, flip);

    }
    else{
     webcam = new tmImage.Webcam(width1,height1, flip);
   }
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    let spinner=document.getElementById('spinner');
    spinner.style.display = 'none';
    window.requestAnimationFrame(this.loop);



    document.getElementById("webcam-container").appendChild(webcam.canvas);

}

async loop() {
    if(isRunning == true){
    webcam.update();
    //this.predict();
    window.requestAnimationFrame(this.loop);
  }
}
shot=()=>{
  if(find == true){
   this.predict();
 }

}
  async  predict(){
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
          prediction[i].className + ": " + prediction[i].probability.toFixed(2);
       console.log(classPrediction);
     if(prediction[i].probability.toFixed(2) >= 0.89&&prediction[i].className != 'other'){
       this.setState({place:prediction[i].className});
       this.sucsess();
     }

  }

}

sucsess=(e)=>{
isRunning=false;
 find=false;
 this.setState({mustShow:!this.state.mustShow})
}

next=()=>{
setTimeout(()=>{
 isRunning=true;
 find=true;
   faceID = this.random();
var newDiv = document.getElementById("fin");
newDiv.innerHTML = "<h1>"+all[faceID]+"</h1>";
let line = document.getElementById("webcam-container");
line.style.display = "block";
document.getElementById("webcam-container").appendChild(webcam.canvas);
 window.requestAnimationFrame(this.loop);
},3000)
}

handleClick(e){
  this.shot();
}


render() {
  return (
   <> <div id="webcam-container" onClick={()=>this.shot()} style={{weight:'100vw',height:"100vh",zIndex:"103000",position:"relative"}}/>

<div className="App">


<div id="fin"></div>

<button id="next" style={{display:'none'}} onClick={()=>this.next()}>Следующий</button>
<SolvedPlace visibility={this.state.mustShow}    onClick={this.handleClick} place={this.state.place}/>
    <div id="shotting" onClick={this.handleClick} ></div>

</div>
<div class="spinner" id="spinner"></div>
<canvas id="canvas" style={{display:'none'}}/></>
  );
}}
export default App;

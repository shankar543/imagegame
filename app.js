
const APIURL =
    "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
let movies=[];
let imageIdArray=[];
let bingo=null;
let score=0;
let currentTargetId=""
let container = document.querySelector(".container");
let scorecardTitle = document.getElementsByClassName("scorecard")[0]
let playmusicBtn = document.querySelector("#playmusic");
let scoreEl  = document.querySelector("#score");
let timerEL  = document.querySelector("#timer")
let imagegrid = document.querySelector('.droppableArea')
let categories=['laugh','smile','sleep'];
let moves=0;
let movesEL = document.getElementById("moves");
let timer = {};
let timerEl=document.getElementById("timer");
let minEL=timerEl.querySelector('.minutes')
let secEL=timerEl.querySelector('.seconds')
let hrsEL=timerEl.querySelector('.hours')
let isTimerstarted=false;
let timerInterval=null;
let imageTypes=['.jpg','.jpeg','.png','.gif'];
const inselm = document.getElementById("ins");
let apiArray=[`https://nekos.best/api/v2/${categories[Math.floor(Math.random()*categories.length)]}?amount=10`]
let proxyurl=`https://cors-anywhere.herokuapp.com/`
let footer_container = document.getElementsByClassName('footer-container')[0];
let instruction_container=document.getElementsByClassName("instructions-container")[0];
let ins_close=instruction_container.querySelector(".close");
const audio = document.getElementById("myAudio");
ins_close.addEventListener("click",(e)=>{
e.target.parentElement.parentElement.remove();
 
  container.style.display="none";
  playWithYourOwnImages();
    showMessageDialog();
  if (window.matchMedia("(orientation:protrait)").matches) {
  }
})
function displayInstructions(){
  let paras = inselm.querySelectorAll("p");
  // sorting params in order to add z-index in correct order
  let startindex=0;
  let endindex=paras.length-1;
  while(startindex<endindex){
    [paras[startindex],paras[endindex]]=[paras[endindex],paras[startindex]];
    startindex += 1;
    endindex -= 1;
  }
  // paras.forEach((para,ind,arr)=>{
  //   let relative=document.createElement("div");
  //   relative.classList.add("relative")
  //   let closebtn = document.createElement("div");
  //   closebtn.innerText="X";
  //   relative.appendChild(closebtn);
  //   closebtn.classList.add("close");
  //   closebtn.addEventListener("click",(e)=>{
  //     e.target.parentElement.parentElement.remove();
  //     if(!ins_close.parentElement.querySelector("#ins").children.length){
  //       ins_close.click();
  //     }
  //   });
  //   para.prepend(relative);
  //   para.style.zIndex = arr.length-ind;
  // });
}

function getTimer(totalsec){
let hrs = Math.floor(totalsec/60/60);
let mins = Math.floor(totalsec/60);
let secs = Math.floor(totalsec%60);
hrs=hrs<10?`0${hrs}`:hrs;
mins=mins<10?`0${mins}`:mins;
secs=secs<10?`0${secs}`:secs;
hrsEL.innerText=hrs;
minEL.innerText=mins;
secEL.innerText=secs;
}

function startTimer(){
  scorecardTitle.classList.remove("hidden");
if(isTimerstarted)return;
isTimerstarted=true;
timer.totalsec=0;
timerInterval=setInterval(function(){
timer.totalsec++;
getTimer(timer.totalsec);
},1000);
}

// async function loadPopiularImages(){
//     if(sidebarImageContainer.children.length>30){
//         return;
//     }
// let response =await  fetch(APIURL);
// let result = await response.json();
// movies = result.results;
// movies.forEach(movie => {
//     let {poster_path,title,adult,release_date,overview,vote_average} = movie;
//     if(!poster_path){return;}
//     let imgEL = document.createElement("img");
//     if(poster_path && !adult & vote_average>7){
//        imgEL.src=IMGPATH+poster_path
//        imgEL.addEventListener("dragstart",dragStartHandler)
//        imgEL.setAttribute("id",title);
//        imgEL.setAttribute("draggable",true);
//        imgEL.setAttribute('data-info',overview);
//        sidebarImageContainer.appendChild(imgEL);
//     }
// });
// }

// function dragStartHandler(event) {
//     event.dataTransfer.setData("text/plain", event.target.id);
// }
  

// function dropHandler(event) {
//     event.preventDefault();
//     var imageId = event.dataTransfer.getData("text");
//     imageIdArray.push(imageId);
//     var image = document.getElementById(imageId);
// }

function addReplicationsOfImage(item,gridpositions){
      for(let i=0;i<3;i++){
      let temp=i+1;  
      let imagecontainer = document.createElement('div');
      imagecontainer.style.order = gridpositions[i];
      imagecontainer.classList.add('image-container')
      imagecontainer.innerHTML=`
        <img src="./dummy.jpg" alt="Dummy Image" class="dummy-image">
        <img src="${item.url}" id="${item.anime_name+"_"+temp}" alt="${item.anime_name}" class="main-image">
      `;
      container.append(imagecontainer)
      imagecontainer.addEventListener('click', () => {
        footer_container.remove();
        moves++;
        startTimer();
        movesEL.innerText=moves;
      let iscompleted = Array.from(imagecontainer.classList).includes('completed')
        if(iscompleted)return;
      let img = imagecontainer.querySelector('.main-image');
        currentTargetId=img.getAttribute("id");
        if(!bingo){
          bingo={}
          // bingo.id=currentTargetId.split("_")[0];
          bingo.id = currentTargetId.slice(0,currentTargetId.lastIndexOf("_"))
          bingo.imagenumber=[currentTargetId.slice(currentTargetId.lastIndexOf("_")+1)];
          imagecontainer.classList.add('flipped');
      }
      else if(bingo.id && bingo.id==currentTargetId.slice(0,currentTargetId.lastIndexOf("_"))){
          if(bingo.imagenumber.indexOf(currentTargetId.slice(-1))!=-1){
            return
          }
          imagecontainer.classList.add('flipped');
          bingo.imagenumber.push(currentTargetId.slice(-1))
          if(bingo.imagenumber.length>2){
            score++;
            scoreEl.innerHTML=`${score} `;
          container.querySelectorAll('.flipped').forEach(elm=>{
            elm.classList.remove('flipped');
              elm.classList.add('completed');
             });
             if(container.querySelectorAll('.completed').length == container.querySelectorAll('.image-container').length){
              clearInterval(timerInterval);
              container.innerHTML=""
              displayScoreCard();
             }
           bingo=null;
            
          }
      }else{
        imagecontainer.classList.add('flipped');
          setTimeout(()=>{container.querySelectorAll('.flipped').forEach(elm=>elm.classList.remove('flipped'))},500)
          bingo=null;
      }
      });
    }
}
  
  function dragOverHandler(event) {
    event.preventDefault();
  }
  container.addEventListener("click",function(event){
    if(event.target.getAttribute("id")==currentTargetId){

    }
  })
  function updatevalues(){
    let div =document.createElement("div");
    div.innerHTML=`<div class="tools">
    <span>${varlmlfsn}</span>
    <span id="timer">00:00:00</span>
    <span id="playmusic">music</span>
</div>`
  }

  const fileInput = document.getElementById('fileInput');
  let imageArray = [];
  
 
  
  

async function loadLocalData2(){
try{
  let random_img=[];
const imagedata=[];
while(random_img?.length<11){
  random_img.push(Math.floor(Math.random()*30+1));
}
let images=[];
for(let i=0;i<10;i++){
  images.push(`./images/img_${random_img[i]}.jpg`);
 }
 const response = await Promise.all(images.map(img=>fetch(img)));
 const urls = await Promise.all(response.map(res=>res.blob()));
 let urlslength=urls?.length;
 for(let p=0;p<urlslength;p++){
  let temp={}
  temp["url"]= URL.createObjectURL(urls[p]);
  temp["anime_name"]=images[p].split('.jpg')[0];
  imagedata.push(temp);
 }
 if(imagedata.length==10){
  addReplications(imagedata);
 }
}catch(err){
  alert(err);
}
}

async function loadLocalData(url = './images'){
  let res=null;
  res = await fetch(url);
   if(!res.ok){
    loadLocalData2();
    return;
   }

  let data = ""
if(url.includes('./images')){
  data = await res.text();
}
else{
  data =  await res.json()
}
console.log(data);

let totalimages = 10;
let parser  = new DOMParser();
let doc = parser.parseFromString(data,'text/html');
let imageelements =  doc.querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]');
let images = Array.from(imageelements).map(elm=>{
  let str = elm.getAttribute("href").slice(elm.getAttribute("href").indexOf("img_"))
  return {
  // "url":".".concat(elm.getAttribute("href").split('/brainmemorizationgame')[1]),
  "url":"./images/".concat(str),
  // "anime_name":elm.getAttribute("href").split('/brainmemorizationgame/images/')[1].split(".")[0]}});
  "anime_name":str.split(".jpg")[0]}});
let imagedata = images?images.slice(0,10):data.results.slice(0,10);
addReplications(imagedata);
}

// need to fetch images using complete path to each image 
// loadLocalData();

function addReplications(images){
  container.style.display="grid";
  container.innerHTML="";
  let positions = getRandomPositionsArray(30);
  let i=0;  
images.forEach(image=>{addReplicationsOfImage(image,positions.slice(i,i+3));
  i=i+3;
})
}

async function loadImages(){
    let response = await fetch('https://cors-anywhere.herokuapp.com/'+apiArray[0])
    let data = await response.json();
    // let totalimages = data.results.length;
    addReplications(data.results);
}

function getRandomPositionsArray(size){
  var randomNumbers=[];
  while(randomNumbers.length != 30){
    var num = Math.floor(Math.random()*30+1);
    if(randomNumbers.indexOf(num) == -1){
    randomNumbers.push(num);
    }
  }
  return randomNumbers;
}
// loadLocalData('./sampledata.json');
// loadLocalData('https://cors-anywhere.herokuapp.com/'+apiArray[0]);
function displayScoreCard()
{
  container.classList.add('hideelm');
  scorecardTitle.classList.add("hideelm");
  let overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.innerHTML=`<div class="scoreCardContiner">
  <table>
<thead><tr><th>moves</th><th>hours</th><th>minutes</th><th>seconds</th></tr></thead>
  <tbody>
  <tr><td>${moves}</td><td>${Math.floor(timer.totalsec/60/60)}</td><td>${Math.floor(timer.totalsec/60)}</td><td>${Math.floor(timer.totalsec%60)}</td></tr>
  <tr><button class="startGame" onclick="startGame()">start</button></tr>
  </tbody>
  </table>
  <div class="thankyou">
   <img src="./gameover.jpg">
  </div>
  </div>`  
document.body.append(overlay);
}
function startGame(){
  document.body.appendChild(footer_container);
  imageArray=[];
  document.querySelector('.overlay').remove();
  container.classList.remove('hideelm');
  container.style.display="grid";
  moves=0;
  movesEL.innerText=moves;
  hrsEL.innerText="00";
  minEL.innerText="00";
  secEL.innerText="00";
  isTimerstarted=false;
  score=0;
  scoreEl.innerText=score;
  // loadLocalData('https://cors-anywhere.herokuapp.com/'+apiArray[0]);
  // loadLocalData();
  playWithYourOwnImages();
}
//need to add bg music
function playSound(){
  let audio = new Audio('./audios/win.mp3');
  document.body.appendChild(audio);
  audio.play();
}

// Set to store the hashes of accepted images
let  acceptedImageHashes = new Set();

        function calculateImageHash(imageBytes) {
            var wordArray = CryptoJS.lib.WordArray.create(imageBytes);
            var sha256Hash = CryptoJS.SHA256(wordArray).toString();
            return sha256Hash;
        }

        function isDuplicateImage(imageHash) {
            return acceptedImageHashes.has(imageHash);
        }

        function acceptImage(imageBytes) {
            var imageHash = calculateImageHash(imageBytes);

            if (isDuplicateImage(imageHash)) {
                console.log("Duplicate image. Rejected.");
                return false;
            }
            acceptedImageHashes.add(imageHash);
            console.log("Image accepted.");
            return true;
        }

        function handleImageChange(event) {
            var imageFiles = event.target.files;

            for (var i = 0; i < imageFiles.length; i++) {
               
            }
        }
        
fileInput.addEventListener('change', function () {
          const selectedFiles = fileInput.files;
          if (selectedFiles.length > 0) {
            for (let i = 0; i < Math.min(selectedFiles.length, 30); i++) {
              const file = selectedFiles[i];
              var reader = new FileReader();
              reader.onload = function (e) {
                  var imageBytes = new Uint8Array(e.target.result);
                  if(acceptImage(imageBytes)){
                    const newName = `img_${imageArray?.length?imageArray?.length+1 : i+1}.jpg`;
        
                    // Create an object with the desired format
                    const imageObj = {
                      url: URL.createObjectURL(file),
                      anime_name: newName,
                    };
              
                    // Add the object to the array
                    imageArray.push(imageObj);
                  }else{
                    alert("should not addd duplicate images");
                  }
                  
                };
              reader.readAsArrayBuffer(file);
              
            }
          }
     setTimeout(()=>{
      if(imageArray.length<10){
        let cnt=10-imageArray.length
        let prestr = cnt>1?"images":"image"
        alert(`add ${cnt} more ${prestr}`);
      }else{
        footer_container.remove();
        let imagedata = imageArray?.slice(0,10);
        addReplications(imagedata);
      }
     },1000)
      });

// adding dialogue message on DOMContentLoaded
function showMessageDialog() {
  // Show the message dialog box
  var messageDialog = document.getElementById('landscapeMessage');
  messageDialog.style.display = 'block';
  setTimeout(() => {
    messageDialog.style.display = "none";
    document.body.style.overflow = 'auto';
},5000)
  // Listen for orientation changes
  window.addEventListener('orientationchange', orientationChangeListener);

  // Disable scrolling while the message is shown
  document.body.style.overflow = 'hidden';
}

function orientationChangeListener() {
  // Check the current orientation
 if (window.matchMedia("(orientation: landscape)").matches) {
  // Landscape mode, hide the message and re-enable scrolling
  var messageDialog = document.getElementById('landscapeMessage');
  messageDialog.style.display = 'none';
  document.body.style.overflow = 'auto';

  // Remove the orientation change listener (optional)
  // window.removeEventListener('orientationchange', orientationChangeListener);
}

}

document.addEventListener('DOMContentLoaded',()=>{
  // displayInstructions();
  isInMobileView();
});
//prompt for playing with own images
function playWithYourOwnImages(){
  const decision = window.confirm("want to play with own images?");
  if(decision){
    alert("use upload button forusing loacal images")
    acceptedImageHashes= new Set([]);
  } else {
    footer_container.remove();
    loadLocalData();

  }
}
function isInMobileView() {
  const mobileQuery = window.matchMedia('(max-width: 768px)');
  if (mobileQuery.matches) {
    return true; // It's a mobile device
  } else {
    return false; // It's not a mobile device (could be tablet, desktop, etc.)
  }
}
if (isInMobileView()) {
  showMessageDialog();
} else {
displayInstructions()
}

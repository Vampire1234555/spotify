
let currsong= new Audio();
let songs;
let currfolder;
function formatTime(seconds) {
    if(isNaN(seconds) || seconds<0){
        return "00:00";
    }
    seconds = Math.floor(seconds); // Ensure we get whole seconds
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;


    minutes = String(minutes).padStart(2, '0');
    secs = String(secs).padStart(2, '0');

    return `${minutes}:${secs}`;
}
const playmusic=(track,pause=false)=>{
   
    if(!pause){
        currsong.play()
        play.src="icons/pause.svg"
    }
    currsong.src=`/${currfolder}/` + track;
    currsong.play();
     document.querySelector(".song-info").innerHTML = decodeURI(track)
     document.querySelector(".song-time").innerHTML ="00:00 / 00:00"
    
}
async function getsongs(folder){
    currfolder=folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);

    let response= await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;

    let as=div.getElementsByTagName("a")
     songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL= document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML +`<li> 
        
       
                        <img src="icons/music.svg" alt="">
                        <div class="info">
                            <div class="songname">
                                     ${song.replaceAll("%20"," ")} 
                            </div>
                            <div class="songartist">
                                babar Ali
                            </div>
                        </div>
                        <div class="playnow">
                            <span>playNow</span>
                            <img src="icons/play.svg " alt="">
                        </div>
                  
        
        </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => { 
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });
    return songs;
    
}
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".card-container");
    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const element = array[index];

        if (element.href.includes("/songs")) {
            let url = new URL(element.href);
            let folder = url.href.split("/").slice(-1)[0]; // Last part of the path
            console.log(folder);    
            if(folder!="songs"){

                let b = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
                let songData = await b.json();
                
                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <div class="play">
                            <img src="icons/play-button.svg" alt="">
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h3 class="title">${songData.title}</h3>
                        <p class="description">${songData.description}</p>
                    </div>`;
            }
        }
    }

   
   
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
                playmusic(songs[0])
            });
        });
    
        
}

 // Call the function

async function main(){
    
   await getsongs("songs/atif")
    playmusic(songs[0],true)
    
    //display albums in the page
    displayAlbums()

    
    play.addEventListener("click",()=>{
        if(currsong.paused){
            currsong.play()
            play.src="icons/pause.svg"
        }
        else{
            currsong.pause()
            play.src="icons/play.svg"
        }
    })
    currsong.addEventListener("timeupdate",()=>{
        document.querySelector(".song-time").innerHTML=`${formatTime(currsong.currentTime)}/${formatTime(currsong.duration)}`
        document.querySelector(".circle").style. marginLeft=(currsong.currentTime / currsong.duration)*100 +"%"
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.marginLeft=percent +"%"
        currsong.currentTime=(currsong.duration * percent) /100
    })

 
    
   
} 

main()







document.querySelector(".hamburger").addEventListener("click",e=>{
    document.querySelector(".left").style.left=0+"%"
})


document.querySelector(".cross").addEventListener("click",e=>{
      document.querySelector(".left").style.left=-100+"%"
})

document.querySelector("#previous").addEventListener("click",e=>{
    let index=songs.indexOf(currsong.src.split("/").slice(-1)[0])
    if(index-1>=0){
        playmusic(songs[index-1])

      
    }
})
document.querySelector("#next").addEventListener("click",e=>{
    let index=songs.indexOf(currsong.src.split("/").slice(-1)[0])
    if(index + 1 < songs.length){

        playmusic(songs[index+1])
    }
})

document.querySelector(".range input").addEventListener("change", (e) => {
    currsong.volume = parseInt(e.target.value) / 100;

    if (currsong.volume>0 &&currsong.volume <= 0.5) {
        document.querySelector(".volume img").src = "icons/volume-low-.svg";
    }
    else if(currsong.volume>0.5){
        document.querySelector(".volume img").src = "icons/volume high.svg";
        
    }
    else{
        document.querySelector(".volume img").src = "icons/volume-mute.svg";

    }
    
});

let currsongvol=currsong.volume;
let ismuted=false;
document.querySelector(".volume img").addEventListener("click",()=>{
    if(!ismuted){
        currsong.volume=0;
        ismuted=true;
        document.querySelector(".volume img").src = "icons/volume-mute.svg";

    }
    else{
        currsong.volume=currsongvol
        ismuted=false;
        if (currsong.volume>0 &&currsong.volume <= 0.5) {
            document.querySelector(".volume img").src = "icons/volume-low-.svg";
        }
        else if(currsong.volume>0.5){
            document.querySelector(".volume img").src = "icons/volume high.svg";
            
        }
        
    }
})


















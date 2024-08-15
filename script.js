console.log("Lets write js");
let currentSong=new Audio();
let songs;

function convertSecondsToMinSec(seconds) {
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format minutes and seconds to always be two digits
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds.toFixed(0) : remainingSeconds.toFixed(0);

    // Return the formatted time
    return formattedMinutes + ':' + formattedSeconds;
}

// Example usage
// const time = convertSecondsToMinSec(125);
// console.log(time); // Output: 02:05


async function getSongs(){
    let a= await fetch("http://127.0.0.1:5500/songs/")
    let response =await a.text();
    
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
   let songs=[]
    for(let index=0;index<as.length;index++){
        const element=as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playMusic=(track,pause=false)=>{
    // let audio=new Audio("/songs/"+track)
    currentSong.src="/songs/"+track
    if(!pause){
        currentSong.play()
        play.src="pause.svg"
    }
    // currentSong.play()
    
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"
}
 async function main(){
   
    songs=await getSongs()
    // console.log(songs)
    playMusic(songs[0],true)

    let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Progati</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                            <img class="invert" src="play.svg" alt="">
                        </div></li>`;
                        
    }

         
    

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach( e=>{
    
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    })
   

    // event listner to play,next and prev
    play.addEventListener("click",()=>{

   if(currentSong.paused){
        currentSong.play()
        play.src="pause.svg"
    }
    else{
        currentSong.pause()
        play.src="play.svg"
    }
})


// time update
currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML=`${
        convertSecondsToMinSec(currentSong.currentTime)
    }/${convertSecondsToMinSec(currentSong.duration)}`
    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
})

// seek bar working to move it left and right on clicking
document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent+"%";
    currentSong.currentTime=(currentSong.duration*percent)/100
})

// work pn previous and next
prev.addEventListener("click",()=>{

let index=songs.indexOf( currentSong.src.split("/").slice(-1)[0])
if((index-1)>0){
playMusic(songs[index-1])
}
})

next.addEventListener("click",()=>{

    let index=songs.indexOf( currentSong.src.split("/").slice(-1)[0])
    if((index+1)<songs.length){
    playMusic(songs[index+1])
    }
})

// work on the volume range
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume=parseInt(e.target.value)/100
})

}

main()

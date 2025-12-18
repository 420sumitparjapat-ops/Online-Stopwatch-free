/* ---------- GLOBAL ---------- */
const clickSound = document.getElementById("clickSound");
const timerSound = document.getElementById("timerSound");
const alarmSound = document.getElementById("alarmSound");
let muted = false;

/* ---------- TABS ---------- */
document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab, .tab-content")
      .forEach(el => el.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  };
});

/* ---------- THEME ---------- */
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
};

/* ---------- MUTE ---------- */
document.getElementById("muteToggle").onclick = () => {
  muted = !muted;
};

/* ---------- CLOCK ---------- */
let is24 = true;
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  let ampm = "";
  if (!is24) {
    ampm = h >= 12 ? " PM" : " AM";
    h = h % 12 || 12;
  }
  const t = `${String(h).padStart(2,0)}:${String(now.getMinutes()).padStart(2,0)}:${String(now.getSeconds()).padStart(2,0)}${ampm}`;
  document.getElementById("clockTime").textContent = t;
  document.getElementById("clockDate").textContent = now.toDateString();
}
setInterval(updateClock, 1000);
document.getElementById("formatToggle").onclick = () => is24 = !is24;

/* ---------- STOPWATCH ---------- */
let swTime = 0, swInterval;
function swStart() {
  if (!swInterval) {
    swInterval = setInterval(() => {
      swTime += 10;
      displaySW();
    }, 10);
    playClick();
  }
}
function swPause() {
  clearInterval(swInterval);
  swInterval = null;
  playClick();
}
function swReset() {
  swPause();
  swTime = 0;
  document.getElementById("laps").innerHTML = "";
  displaySW();
  playClick();
}
function swLap() {
  const li = document.createElement("li");
  li.textContent = document.getElementById("swDisplay").textContent;
  document.getElementById("laps").appendChild(li);
}
function displaySW() {
  let ms = swTime % 1000;
  let s = Math.floor(swTime / 1000) % 60;
  let m = Math.floor(swTime / 60000);
  document.getElementById("swDisplay").textContent =
    `${String(m).padStart(2,0)}:${String(s).padStart(2,0)}.${String(ms).padStart(3,0)}`;
}

/* ---------- TIMER ---------- */
let tSec = 0, tInterval;
function timerStart() {
  if (!tInterval) {
    tSec = tSec || (+tH.value||0)*3600 + (+tM.value||0)*60 + (+tS.value||0);
    tInterval = setInterval(() => {
      if (tSec <= 0) {
        clearInterval(tInterval);
        tInterval = null;
        if (!muted) timerSound.play();
        alert("⏰ Time Up!");
      } else {
        tSec--;
        updateTimer();
      }
    }, 1000);
    playClick();
  }
}
function timerPause() {
  clearInterval(tInterval);
  tInterval = null;
}
function timerReset() {
  timerPause();
  tSec = 0;
  updateTimer();
}
function updateTimer() {
  let h = Math.floor(tSec/3600);
  let m = Math.floor(tSec/60)%60;
  let s = tSec%60;
  timerDisplay.textContent =
    `${String(h).padStart(2,0)}:${String(m).padStart(2,0)}:${String(s).padStart(2,0)}`;
}

/* ---------- ALARM ---------- */
let alarms = JSON.parse(localStorage.getItem("alarms")||"[]");
function addAlarm() {
  if (!alarmTime.value) return;
  alarms.push({ time: alarmTime.value, on:true });
  saveAlarms();
  renderAlarms();
}
function renderAlarms() {
  alarmList.innerHTML="";
  alarms.forEach((a,i)=>{
    const li=document.createElement("li");
    li.innerHTML=`${a.time}
      <button onclick="toggleAlarm(${i})">${a.on?"On":"Off"}</button>
      <button onclick="delAlarm(${i})">❌</button>`;
    alarmList.appendChild(li);
  });
}
function toggleAlarm(i){alarms[i].on=!alarms[i].on;saveAlarms();renderAlarms();}
function delAlarm(i){alarms.splice(i,1);saveAlarms();renderAlarms();}
function saveAlarms(){
  localStorage.setItem("alarms",JSON.stringify(alarms));
}
setInterval(()=>{
  const now=new Date();
  const t=now.toTimeString().slice(0,5);
  alarms.forEach(a=>{
    if(a.on && a.time===t){
      if(!muted) alarmSound.play();
      alert("🔔 Alarm!");
      a.on=false;
      saveAlarms();
    }
  });
},1000);
renderAlarms();

/* ---------- SOUND ---------- */
function playClick(){
  if(!muted){ clickSound.currentTime=0; clickSound.play(); }
}

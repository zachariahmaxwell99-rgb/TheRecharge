// ==========================================
// 1. DYNAMIC COUNTDOWN TIMER
// ==========================================
const countdownElement = document.getElementById("days");
if (countdownElement) {
  const countDownDate = new Date("July 31, 2026 16:00:00").getTime();
  const timer = setInterval(function() {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    if (distance < 0) { clearInterval(timer); return; }
    
    document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById("mins").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById("secs").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
  }, 1000);
}

// ==========================================
// 2. MODAL LOGIC (Booking Pop-up)
// ==========================================
const modal = document.getElementById("booking-modal");
if (modal) {
  const bookButtons = document.querySelectorAll('a[href="#book"]');
  bookButtons.forEach(btn => btn.addEventListener("click", (e) => { 
    e.preventDefault(); 
    modal.classList.add("show-modal"); 
  }));
  const closeBtn = document.querySelector(".close-btn");
  if(closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("show-modal"));
  window.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show-modal"); });
}

// ==========================================
// 3. THE DATA HUB (Airports & Pilgrimage)
// ==========================================
const airports = [
  { name: "Sydney", code: "SYD", advice: "Direct to Ballina (BNK) is best.", flights: [{ time: "07:15 AM", airline: "Jetstar", dest: "Ballina (BNK)", drive: "20 min", status: "Recommended" }, { time: "09:40 AM", airline: "Qantas", dest: "Ballina (BNK)", drive: "20 min", status: "Good Timing" }] },
  { name: "Melbourne", code: "MEL", advice: "Grab the early Jetstar direct.", flights: [{ time: "08:30 AM", airline: "Jetstar", dest: "Ballina (BNK)", drive: "20 min", status: "Recommended" }] },
  { name: "Brisbane", code: "BNE", advice: "We recommend the 2-hour drive!", flights: [{ time: "Morning", airline: "Drive", dest: "Lennox Head", drive: "2 hr", status: "Easiest" }] }
];

const pilgrimageData = {
  "ballina": 5, "byron": 4, "lismore": 9, "alstonville": 6, "mullumbimby": 7, "casino": 14, "kyogle": 18, "evans head": 12, "yamba": 25, "grafton": 28,
  "coffs": 45, "port macquarie": 78, "taree": 95, "newcastle": 110, "maitland": 115, "singleton": 125, "gosford": 135,
  "sydney": 158, "parramatta": 162, "penrith": 170, "campbelltown": 175, "wollongong": 185, "nowra": 210, "canberra": 220,
  "tamworth": 92, "armidale": 65, "tenterfield": 48, "inverell": 75, "gunnedah": 105, "dubbo": 165, "mudgee": 155, "orange": 175, "bathurst": 180, "wagga": 260, "albury": 290, "broken hill": 380,
  "tweed": 12, "gold coast": 14, "brisbane": 36, "ipswich": 38, "sunshine coast": 52, "noosa": 58, "gympie": 68, "bundaberg": 98, "rockhampton": 140, "townsville": 240, "cairns": 290,
  "melbourne": 345, "adelaide": 410, "perth": 850, "darwin": 680, "hobart": 420
};

// ==========================================
// 4. SEARCH & QUEST LOGIC (SURPRISE VERSION)
// ==========================================
let selectedMode = "";
const searchInput = document.getElementById("airport-search");
const autocompleteList = document.getElementById("autocomplete-list");
const resultsDiv = document.getElementById("flight-results");

if (searchInput && autocompleteList) {
  searchInput.addEventListener("input", function() {
    const val = this.value.toLowerCase().trim();
    autocompleteList.innerHTML = "";
    if (!val) { autocompleteList.style.display = "none"; return; }
    const filtered = airports.filter(a => a.name.toLowerCase().includes(val) || a.code.toLowerCase().includes(val));
    if (filtered.length > 0) {
      autocompleteList.style.display = "block";
      filtered.forEach(airport => {
        const div = document.createElement("div");
        div.style.padding = "12px"; div.style.cursor = "pointer"; div.style.borderBottom = "1px solid #eee";
        div.innerHTML = `<strong>${airport.name} (${airport.code})</strong>`;
        div.addEventListener("click", () => {
          searchInput.value = `${airport.name} (${airport.code})`;
          autocompleteList.style.display = "none";
          showFlightResults(airport);
        });
        autocompleteList.appendChild(div);
      });
    } else { autocompleteList.style.display = "none"; }
  });
}

function showFlightResults(airport) {
  let rows = airport.flights.map(f => `<tr><td style="padding:10px 0;"><strong>${f.time}</strong></td><td>${f.airline}</td><td>${f.dest}</td><td style="color:#0077b6;">${f.drive}</td><td><span style="background:#0077b6;color:white;padding:2px 8px;border-radius:4px;font-size:0.7rem;">${f.status}</span></td></tr>`).join('');
  resultsDiv.innerHTML = `<h4 style="color:#023047;margin-bottom:10px;">FRIDAY JULY 31</h4><table style="width:100%;text-align:left;border-collapse:collapse;font-size:0.85rem;"><thead><tr style="color:#999;font-size:0.7rem;border-bottom:2px solid #0077b6;"><th>DEPARTS</th><th>AIRLINE</th><th>ARRIVES</th><th>DRIVE</th><th>NOTE</th></tr></thead><tbody>${rows}</tbody></table><a href="https://www.skyscanner.com.au/transport/flights/${airport.code.toLowerCase()}/bnk/260731/" target="_blank" class="button primary-btn" style="display:block;margin-top:20px;text-align:center;">Book Live Flight →</a>`;
}

function showTravelOption(choice) {
  selectedMode = choice;
  document.getElementById('quiz-step').style.display = 'none';
  const flyOption = document.getElementById('fly-option');
  const otherOption = document.getElementById('other-option');
  const msgDiv = document.getElementById('dynamic-message');
  
  if (choice === 'fly') {
    flyOption.style.display = 'block';
  } else {
    otherOption.style.display = 'block';
    if (choice === 'walk') {
      msgDiv.innerHTML = `<h3 style="font-family:'Montserrat';">THE PILGRIMAGE</h3><p>Walking to Lennox Head is a serious undertaking. Enter your starting point to map out your journey.</p>`;
    } else if (choice === 'drive') {
      msgDiv.innerHTML = `<h3 style="font-family:'Montserrat';">THE ROAD TRIP</h3><p>Enter your town to see the route and estimated travel time to Camp Drew.</p>`;
    } else {
      msgDiv.innerHTML = `<h3 style="font-family:'Montserrat';">CARPOOLING</h3><p>Matching opens in June. Enter your town below to register your interest.</p>`;
    }
  }
}

function resetQuiz() {
  document.getElementById('quiz-step').style.display = 'block';
  document.getElementById('fly-option').style.display = 'none';
  document.getElementById('other-option').style.display = 'none';
  const receipt = document.getElementById('receipt-display');
  if(receipt) receipt.innerHTML = "";
}

const calcBtn = document.getElementById('calc-btn');
if (calcBtn) {
  calcBtn.addEventListener('click', function() {
    const townInput = document.getElementById('user-town').value.toLowerCase().trim();
    const receiptDiv = document.getElementById('receipt-display');
    const ticketPrice = 300;
    
    if (!townInput) return alert("Please enter a town name.");

    let hours = 0;
    let foundTown = townInput.toUpperCase();

    for (let key in pilgrimageData) {
      if (townInput.includes(key)) {
        hours = pilgrimageData[key];
        foundTown = key.toUpperCase();
        break; 
      }
    }

    if (hours === 0) {
      const km = prompt("We don't have that town mapped yet! Roughly how many km is it to Lennox Head?");
      if (km && !isNaN(km)) hours = Math.round(km / 5); else return;
    }

    const credit = hours * 10;
    const isFree = credit >= ticketPrice;
    const startDate = new Date("2026-07-31T16:00:00");
    startDate.setHours(startDate.getHours() - hours);
    const dateStr = startDate.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });
    const timeStr = startDate.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

    if (selectedMode === 'walk') {
      receiptDiv.innerHTML = `
        <div class="scroll-reveal visible" style="background:white; border:2px solid #333; padding:25px; font-family:'Courier New', monospace; text-align:left; box-shadow:8px 8px 0 rgba(0,0,0,0.1); margin-top:20px;">
          <h3 style="margin-top:0; color:#023047; font-family:'Montserrat';">WOW! THAT'S A LONG WAY.</h3>
          <p>At the Recharge Conference, we believe hard work should be rewarded. For every hour you walk, you'll save <strong>$10.00</strong> off your ticket price.</p>
          <p>-------------------------</p>
          <p>ORIGIN: ${foundTown}</p>
          <p>TIME:   ${hours} HRS</p>
          <p>-------------------------</p>
          <h2 style="color:#0077b6; margin:15px 0;">CONGRATULATIONS!</h2>
          <p>${isFree ? "If you complete your journey, we'll give you a <strong>FREE TICKET</strong>." : "If you complete your journey, you'll save <strong>$" + credit.toFixed(2) + "</strong> off the ticket price."}</p>
          <p style="font-style:italic; font-size:0.8rem; color:#666;">"But remember, if it's not on Strava, it never happened."</p>
          <div style="background:#f0f0f0; padding:10px; border-left:5px solid #023047; margin-top:15px;">
            <p style="margin:0; font-size:0.85rem;">Leave by: <strong>${dateStr} at ${timeStr}</strong></p>
          </div>
        </div>`;
    } else {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=Camp+Drew+Lennox+Head+NSW&origin=${encodeURIComponent(townInput)}&travelmode=driving`;
      window.open(mapsUrl, '_blank');
    }
  });
}

// ==========================================
// 5. WEATHER & PARTICLE EFFECTS
// ==========================================

const root = document.documentElement;
let worldAngle = Math.PI / 2, walkDist = 0, currentMode = 'shine';

// Weather Palette from your file
const pal = {
    night: { t: "#040b17", b: "#111c3a", h1: "#06121c", h2: "#091a27", h3: "#0c1e2d" },
    day:   { t: "#3a88fe", b: "#a3e5ff", h1: "#1e5631", h2: "#4c9a2a", h3: "#76ba1b" }
};

function setWeather(m) {
    currentMode = m;
    root.style.setProperty('--storm-tint', (m === 'rain') ? '0.5' : '0');
    root.style.setProperty('--particle-opacity', m === 'shine' ? '0' : '1');
    const shiverEl = document.getElementById('shiverEl');
    if(m === 'hail' || m === 'snow') shiverEl.classList.add('shiver-active');
}

function startQuest(hours, town) {
    const targetCredit = hours * 10;
    let currentCredit = 0;
    
    // Auto-weather based on distance
    if (hours > 100) setWeather('snow');
    else if (hours > 50) setWeather('hail');
    else setWeather('shine');

    document.getElementById('scene').classList.remove('is-finished');
    const timer = setInterval(() => {
        currentCredit += (targetCredit / 100);
        if (currentCredit >= targetCredit) {
            clearInterval(timer);
            document.getElementById('scene').classList.add('is-finished');
        }
        document.getElementById('counter').innerText = currentCredit.toFixed(2);
    }, 50);
}

// Infinite Hill Animation Loop
function animate() {
    walkDist += 1.5; 
    const hFgX = walkDist % 800;
    const getFgY = (x) => 30 + Math.sin((x / 800) * Math.PI * 2) * 35;

    document.getElementById('hBg').style.transform = `translate3d(${(walkDist*0.25)%800*-1}px,0,0)`;
    document.getElementById('hMid').style.transform = `translate3d(${(walkDist*0.5)%800*-1}px,0,0)`;
    document.getElementById('hFg').style.transform = `translate3d(${-hFgX}px,0,0)`;
    document.getElementById('trekker').style.transform = `translate3d(0, ${-getFgY(222 + hFgX)}px, 0)`;
    
    requestAnimationFrame(animate);
}
animate();
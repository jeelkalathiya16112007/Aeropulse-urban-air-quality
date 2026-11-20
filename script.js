const CITIES = {
  surat: { name: "Surat, Gujarat", lat: 21.1702, lon: 72.8311 },
  delhi: { name: "New Delhi, Delhi", lat: 28.6139, lon: 77.2090 },
  mumbai: { name: "Mumbai, Maharashtra", lat: 19.0760, lon: 72.8777 },
  ahmedabad: { name: "Ahmedabad, Gujarat", lat: 23.0225, lon: 72.5714 },
  bengaluru: { name: "Bengaluru, Karnataka", lat: 12.9716, lon: 77.5946 },
  kolkata: { name: "Kolkata, West Bengal", lat: 22.5726, lon: 88.3639 },
  jaipur: { name: "Jaipur, Rajasthan", lat: 26.9124, lon: 75.7873 },
  lucknow: { name: "Lucknow, Uttar Pradesh", lat: 26.8467, lon: 80.9462 }
};

const PROFILE_LABELS = {
  family: "Family with Young Children",
  commuter: "Working Professional (Daily Commuter)",
  senior: "Senior Citizen / Respiratory Sensitive",
  student: "Student / Outdoor Sports"
};

let currentState = {
  locationName: "Surat, Gujarat",
  aqi: 85,
  pm25: 28,
  pm10: 62,
  source: "Open-Meteo Air Quality API",
  timestamp: new Date().toLocaleString("en-IN"),
  profile: "family"
};

function classifyAqi(aqi) {
  if (aqi <= 50) {
    return {
      label: "Good Air Quality",
      css: "good",
      mask: "Not required",
      summary: "Air is clean with minimal health risk for all age groups."
    };
  }
  if (aqi <= 100) {
    return {
      label: "Moderate Air Quality",
      css: "moderate",
      mask: "Optional for sensitive groups",
      summary: "Acceptable air quality; unusually sensitive individuals should pace heavy outdoor exertion."
    };
  }
  if (aqi <= 150) {
    return {
      label: "Unhealthy for Sensitive Groups",
      css: "sensitive",
      mask: "KN95 / N95 for kids, seniors & commuters",
      summary: "Children, older adults, and people with asthma should reduce prolonged outdoor activity."
    };
  }
  if (aqi <= 200) {
    return {
      label: "Poor / Unhealthy Air Quality",
      css: "poor",
      mask: "N95 / KN95 recommended outdoors",
      summary: "Everyone may begin to experience respiratory irritation; shift workouts and play indoors."
    };
  }
  return {
    label: "Severe / Very Unhealthy Smog",
    css: "severe",
    mask: "Mandatory N95 / FFP2 mask outdoors",
    summary: "High winter smog risk. Avoid outdoor exertion, keep windows sealed, and filter indoor air."
  };
}

function buildTailoredPlan(aqi, profile) {
  const highPollution = aqi > 150;
  const moderatePollution = aqi > 100 && aqi <= 150;

  if (profile === "family") {
    return {
      routine: highPollution
        ? "Move children's evening park play indoors (board games, indoor yoga) and schedule school drop-offs closer to 8:30 AM instead of early dawn."
        : moderatePollution
        ? "Limit outdoor playground time to 30–40 minutes between 12:00 PM and 4:00 PM, and combine grocery/school errands into one trip."
        : "Enjoy outdoor family walks in green parks while combining local errands into a single low-traffic trip.",
      routineWhy:
        "Children breathe faster per kg of body weight than adults, inhaling more PM2.5 during peak morning/evening smog inversions.",
      indoor: highPollution
        ? "Keep balcony doors closed during traffic rush hours, wet-mop floors instead of dry sweeping, and run an air purifier or DIY box-fan HEPA filter in the kids' bedroom."
        : "Ventilate rooms briefly during sunny afternoon hours when pollutants disperse, and place Snake Plant and Areca Palm indoors.",
      indoorWhy:
        "Wet mopping traps settled heavy dust instead of resuspending PM10 into children's breathing zone.",
      sustainable:
        "Join a neighborhood school carpool or walk short distances under 1 km instead of idling a car outside school gates.",
      sustainableWhy:
        "Eliminating 10 minutes of school-gate engine idling cuts localized tailpipe NO2 and fine particulate spikes right where kids walk."
    };
  }

  if (profile === "commuter") {
    return {
      routine: highPollution
        ? "Shift commute 30 minutes off peak rush hour if possible, keep car AC on 'recirculate' mode, and wear a snug N95 mask on two-wheelers or station walks."
        : "Use metro/bus transit for main corridors and batch evening errands along your direct route home.",
      routineWhy:
        "Roadside PM2.5 concentration along congested Indian corridors can be 2–3x higher during 8–10 AM and 6–9 PM rush hours.",
      indoor:
        "Keep a desktop HEPA purifier or moisture-wicking indoor plants (Peace Lily, Spider Plant) at your workstation and avoid indoor incense/agarbatti smoke.",
      indoorWhy:
        "Combustion smoke from incense or candles adds indoor fine particles on top of outdoor smog entering through office doors.",
      sustainable:
        "Switch 2+ days a week to metro, city bus, or office carpooling, and turn off your vehicle engine at red lights longer than 20 seconds.",
      sustainableWhy:
        "Replacing one 15 km solo petrol commute with public transit prevents ~2.5 kg of CO2 and lowers roadside particulate emissions."
    };
  }

  if (profile === "senior") {
    return {
      routine: highPollution
        ? "Skip early morning outdoor walks (6–8 AM); do gentle indoor stretching and breathing exercises, and step out only between 1:00 PM and 4:00 PM if needed."
        : "Keep walks short (20 minutes) in tree-lined parks away from main roads, carrying prescribed inhalers/medications.",
      routineWhy:
        "Cold morning winter air traps smog near ground level, increasing cardiovascular and bronchial strain in older adults.",
      indoor:
        "Seal window gaps with draft stoppers, use an exhaust fan while cooking with gas/oil, and keep bedroom air clean before sleep.",
      indoorWhy:
        "Cooking fumes can spike indoor PM2.5 above 300 µg/m³ within minutes if kitchen exhaust ventilation is off.",
      sustainable:
        "Order medicines and groceries in consolidated weekly deliveries and use electric/induction cooking where available.",
      sustainableWhy:
        "Consolidating deliveries reduces neighborhood two-wheeler trips while cleaner cooking eliminates indoor combustion pollutants."
    };
  }

  return {
    routine: highPollution
      ? "Move outdoor cricket/football practice to an indoor court or gym, and schedule outdoor study commutes during midday hours."
      : "Keep outdoor sports sessions under 45 minutes in green campus zones and hydrate well.",
    routineWhy:
      "Heavy aerobic exercise increases air intake up to 10x, pulling fine PM2.5 deeper into the lungs when AQI is elevated.",
    indoor:
      "Keep hostel/study room dust-free with damp cloth wiping, avoid aerosol sprays, and cross-ventilate only during clean afternoon windows.",
    indoorWhy:
      "Clean, low-VOC study spaces reduce headaches, eye irritation, and fatigue during exam preparation.",
    sustainable:
      "Cycle or walk for campus trips under 2 km and share e-rickshaws/buses with classmates.",
    sustainableWhy:
      "Active and shared campus mobility cuts per-student transport emissions by over 60%."
  };
}

function renderDashboard() {
  const { locationName, aqi, pm25, pm10, source, timestamp, profile } = currentState;
  const info = classifyAqi(aqi);
  const plan = buildTailoredPlan(aqi, profile);

  document.getElementById("locationTitle").textContent = locationName;
  document.getElementById("profileBadge").textContent = `Profile: ${PROFILE_LABELS[profile]}`;
  document.getElementById("aqiValue").textContent = Math.round(aqi);

  const pill = document.getElementById("aqiPill");
  pill.className = `aqi-pill ${info.css}`;

  document.getElementById("categoryTitle").textContent = info.label;
  document.getElementById("summaryText").textContent = info.summary;
  document.getElementById("pm25Value").textContent = `${pm25} µg/m³`;
  document.getElementById("pm10Value").textContent = `${pm10} µg/m³`;
  document.getElementById("maskValue").textContent = info.mask;
  document.getElementById("sourceMeta").textContent = `Source: ${source} • Last Updated: ${timestamp}`;

  document.getElementById("routineAction").textContent = plan.routine;
  document.getElementById("routineWhy").textContent = plan.routineWhy;
  document.getElementById("indoorAction").textContent = plan.indoor;
  document.getElementById("indoorWhy").textContent = plan.indoorWhy;
  document.getElementById("sustainableAction").textContent = plan.sustainable;
  document.getElementById("sustainableWhy").textContent = plan.sustainableWhy;
}

async function fetchLiveAirQuality(lat, lon, displayName) {
  document.getElementById("categoryTitle").textContent = "Fetching live air quality...";
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("API unavailable");
    const data = await response.json();

    currentState.locationName = displayName;
    currentState.aqi = data.current?.us_aqi ?? 90;
    currentState.pm25 = data.current?.pm2_5 ?? 30;
    currentState.pm10 = data.current?.pm10 ?? 65;
    currentState.source = "Open-Meteo Live Air Quality API (CAMS/Global)";
    currentState.timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
    renderDashboard();
  } catch (err) {
    currentState.locationName = displayName;
    currentState.source = "Fallback Offline Reference (API unreachable)";
    currentState.timestamp = new Date().toLocaleString("en-IN");
    renderDashboard();
  }
}

function answerQuestion(question) {
  const q = question.toLowerCase();
  const { locationName, aqi, pm25, profile } = currentState;
  const plan = buildTailoredPlan(aqi, profile);

  if (q.includes("play") || q.includes("outdoor") || q.includes("child") || q.includes("walk")) {
    return `For ${locationName} (Live AQI ${Math.round(aqi)}, PM2.5 ${pm25} µg/m³) under "${PROFILE_LABELS[profile]}": ${plan.routine} Why: ${plan.routineWhy}`;
  }
  if (q.includes("commute") || q.includes("travel") || q.includes("office") || q.includes("traffic")) {
    return `Commute guidance for ${locationName} at AQI ${Math.round(aqi)}: ${plan.routine} Sustainable option: ${plan.sustainable} (${plan.sustainableWhy})`;
  }
  if (q.includes("indoor") || q.includes("home") || q.includes("purifier") || q.includes("plant")) {
    return `Indoor air plan for ${locationName}: ${plan.indoor} Why it works: ${plan.indoorWhy}`;
  }
  if (q.includes("sustainable") || q.includes("smog") || q.includes("reduce") || q.includes("impact")) {
    return `High-impact sustainable action for ${locationName}: ${plan.sustainable} Direct impact: ${plan.sustainableWhy}`;
  }
  return `In ${locationName} right now, AQI is ${Math.round(aqi)} (PM2.5: ${pm25} µg/m³). For ${PROFILE_LABELS[profile]}: ${plan.routine} Indoors: ${plan.indoor}`;
}

document.getElementById("citySelect").addEventListener("change", (e) => {
  const city = CITIES[e.target.value];
  document.getElementById("customAqi").value = "";
  fetchLiveAirQuality(city.lat, city.lon, city.name);
});

document.getElementById("profileSelect").addEventListener("change", (e) => {
  currentState.profile = e.target.value;
  renderDashboard();
});

document.getElementById("fetchLiveBtn").addEventListener("click", () => {
  const city = CITIES[document.getElementById("citySelect").value];
  document.getElementById("customAqi").value = "";
  fetchLiveAirQuality(city.lat, city.lon, city.name);
});

document.getElementById("geoBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      fetchLiveAirQuality(
        latitude.toFixed(4),
        longitude.toFixed(4),
        `My GPS Location (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`
      );
    },
    () => {
      alert("Location permission denied. Please choose your city from the dropdown.");
    }
  );
});

document.getElementById("simulateBtn").addEventListener("click", () => {
  const val = Number(document.getElementById("customAqi").value);
  if (Number.isNaN(val) || val < 0 || val > 500 || document.getElementById("customAqi").value === "") {
    alert("Please enter a valid AQI number between 0 and 500.");
    return;
  }
  const city = CITIES[document.getElementById("citySelect").value];
  currentState.locationName = `${city.name} (Simulated Scenario)`;
  currentState.aqi = val;
  currentState.pm25 = Math.round(val * 0.42);
  currentState.pm10 = Math.round(val * 0.85);
  currentState.source = "Custom Scenario Simulator";
  currentState.timestamp = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
  renderDashboard();
});

document.getElementById("askBtn").addEventListener("click", () => {
  const q = document.getElementById("userQuestion").value.trim();
  if (!q) return;
  document.getElementById("assistantReply").textContent = answerQuestion(q);
});

document.querySelectorAll(".chip").forEach((btn) => {
  btn.addEventListener("click", () => {
    const q = btn.getAttribute("data-q");
    document.getElementById("userQuestion").value = q;
    document.getElementById("assistantReply").textContent = answerQuestion(q);
  });
});

// Load live Surat data on page open
fetchLiveAirQuality(CITIES.surat.lat, CITIES.surat.lon, CITIES.surat.name);
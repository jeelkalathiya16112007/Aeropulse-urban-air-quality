const CITY_DATA = {
  surat: { name: "Surat", aqi: 84, pm25: 28, pm10: 64 },
  ahmedabad: { name: "Ahmedabad", aqi: 118, pm25: 43, pm10: 96 },
  mumbai: { name: "Mumbai", aqi: 62, pm25: 19, pm10: 48 },
  delhi: { name: "Delhi", aqi: 215, pm25: 94, pm10: 178 }
};

const citySelect = document.getElementById("citySelect");
const customAqiInput = document.getElementById("customAqi");
const analyzeBtn = document.getElementById("analyzeBtn");
const resetBtn = document.getElementById("resetBtn");

const locationNameEl = document.getElementById("locationName");
const aqiValueEl = document.getElementById("aqiValue");
const aqiBadgeEl = document.getElementById("aqiBadge");
const categoryTextEl = document.getElementById("categoryText");
const guidanceTextEl = document.getElementById("guidanceText");
const pm25ValueEl = document.getElementById("pm25Value");
const pm10ValueEl = document.getElementById("pm10Value");
const maskValueEl = document.getElementById("maskValue");

const chatForm = document.getElementById("chatForm");
const questionInput = document.getElementById("questionInput");
const assistantReplyEl = document.getElementById("assistantReply");
const chips = document.querySelectorAll(".chip");

let currentState = {
  name: "Surat",
  aqi: 84,
  pm25: 28,
  pm10: 64
};

function classifyAqi(aqi) {
  const safeAqi = Math.max(0, Math.min(500, Number(aqi) || 0));
  if (safeAqi <= 50) {
    return {
      category: "Good Air Quality",
      guidance: "Clean air conditions. Ideal for outdoor activities, walking, and exercise.",
      mask: "Not needed",
      bg: "#eaf7ee",
      border: "#7bc491",
      color: "#1e7e34"
    };
  }
  if (safeAqi <= 100) {
    return {
      category: "Moderate Air Quality",
      guidance: "Acceptable air quality for most people. Sensitive groups should limit prolonged outdoor exertion.",
      mask: "Optional for sensitive groups",
      bg: "#fff7e6",
      border: "#f0c36d",
      color: "#b26a00"
    };
  }
  if (safeAqi <= 150) {
    return {
      category: "Unhealthy for Sensitive Groups",
      guidance: "Children, older adults, and people with asthma or heart conditions should reduce outdoor exposure.",
      mask: "Recommended outdoors",
      bg: "#fff1e6",
      border: "#f2a65a",
      color: "#9c4200"
    };
  }
  return {
    category: "Poor / Unhealthy Air Quality",
    guidance: "Limit outdoor exercise, keep indoor air clean, and wear a well-fitting mask if going outside.",
    mask: "N95 / respirator recommended",
    bg: "#fdecea",
    border: "#f08b82",
    color: "#b42318"
  };
}

function renderAirQuality() {
  const info = classifyAqi(currentState.aqi);
  locationNameEl.textContent = currentState.name;
  aqiValueEl.textContent = currentState.aqi;
  categoryTextEl.textContent = info.category;
  guidanceTextEl.textContent = info.guidance;
  pm25ValueEl.textContent = `${currentState.pm25} µg/m³`;
  pm10ValueEl.textContent = `${currentState.pm10} µg/m³`;
  maskValueEl.textContent = info.mask;

  aqiBadgeEl.style.backgroundColor = info.bg;
  aqiBadgeEl.style.borderColor = info.border;
  aqiBadgeEl.style.color = info.color;
}

function handleAnalyze() {
  const selectedCity = CITY_DATA[citySelect.value] || CITY_DATA.surat;
  const rawCustom = customAqiInput.value.trim();

  if (rawCustom !== "") {
    const parsed = Number(rawCustom);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 500) {
      assistantReplyEl.textContent = "Please enter a valid AQI number between 0 and 500.";
      return;
    }
    currentState = {
      name: `${selectedCity.name} (Custom)`,
      aqi: Math.round(parsed),
      pm25: Math.max(5, Math.round(parsed * 0.42)),
      pm10: Math.max(10, Math.round(parsed * 0.85))
    };
  } else {
    currentState = { ...selectedCity };
  }

  renderAirQuality();
  assistantReplyEl.textContent = `Updated for ${currentState.name} (AQI ${currentState.aqi}). ${classifyAqi(currentState.aqi).guidance}`;
}

function generateAssistantAnswer(question) {
  const q = question.toLowerCase();
  const aqi = currentState.aqi;

  if (q.includes("run") || q.includes("jog") || q.includes("exercise") || q.includes("outdoor")) {
    if (aqi <= 100) {
      return `At AQI ${aqi} in ${currentState.name}, light to moderate outdoor exercise is generally fine—watch for any throat irritation if you are sensitive.`;
    }
    return `At AQI ${aqi} in ${currentState.name}, skip outdoor running or heavy workouts and move exercise indoors.`;
  }

  if (q.includes("window") || q.includes("ventilation") || q.includes("indoor")) {
    if (aqi <= 100) {
      return `At AQI ${aqi}, brief cross-ventilation during calmer hours is reasonable, though keeping doors/windows closed near busy traffic helps.`;
    }
    return `At AQI ${aqi}, keep windows closed to block outdoor pollutants and run indoor filtration or fans if available.`;
  }

  if (q.includes("kid") || q.includes("child") || q.includes("elder") || q.includes("family") || q.includes("mask")) {
    return `For ${currentState.name} (AQI ${aqi}): ${classifyAqi(aqi).guidance} Mask advice: ${classifyAqi(aqi).mask}.`;
  }

  return `Current status for ${currentState.name} is AQI ${aqi} (${classifyAqi(aqi).category}). ${classifyAqi(aqi).guidance}`;
}

analyzeBtn.addEventListener("click", handleAnalyze);

resetBtn.addEventListener("click", () => {
  customAqiInput.value = "";
  currentState = { ...CITY_DATA[citySelect.value] };
  renderAirQuality();
  assistantReplyEl.textContent = `Loaded sample air quality data for ${currentState.name}.`;
});

citySelect.addEventListener("change", () => {
  if (customAqiInput.value.trim() === "") {
    currentState = { ...CITY_DATA[citySelect.value] };
    renderAirQuality();
  }
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const q = chip.getAttribute("data-question");
    questionInput.value = q;
    assistantReplyEl.textContent = generateAssistantAnswer(q);
  });
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const q = questionInput.value.trim();
  if (!q) return;
  assistantReplyEl.textContent = generateAssistantAnswer(q);
});

renderAirQuality();
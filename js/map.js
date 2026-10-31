
const AREA = {
  name: "Golden Country Homes",
  center: [13.7855681, 121.07302445],
  zoom: 16
};

const REPORTS = [];

/* Sample data. Replace pa rin based on reports data.
const REPORTS = [
  {
    lat: 14.0645,
    lng: 121.2465,
    type: "alert",
    title: "Flooded road",
    note: "Knee-deep near the main gate."
  },
  {
    lat: 14.0628,
    lng: 121.2449,
    type: "help",
    title: "Senior needs assistance",
    note: "Volunteer requested."
  }
];
*/



/* ====== Map ====== */

const map = L.map("map", {
  zoomControl: false
}).setView(AREA.center, AREA.zoom);

// Make the map accessible to script.js
window.map = map;

// Add zoom controls
L.control.zoom({
  position: "bottomright"
}).addTo(map);


/* ====== Modern Map Style ====== */

L.maplibreGL({
  style: "https://tiles.openfreemap.org/styles/bright",
  attribution:
    '&copy; <a href="https://openfreemap.org">OpenFreeMap</a> ' +
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);


/* ====== Map Markers ====== */

const pin = (cls) => L.divIcon({
  className: "",
  html: `<div class="gc-pin ${cls}"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

// Home area marker
L.marker(AREA.center, {
  icon: pin("")
})
  .addTo(map)
  .bindPopup(`<b>${AREA.name}</b>`);

// Home area coverage circle
L.circle(AREA.center, {
  radius: 350,
  color: "#d4aa1f",
  weight: 2,
  fillColor: "#fdd02f",
  fillOpacity: 0.12
}).addTo(map);

// Display sample reports
REPORTS.forEach(r => {
  L.marker([r.lat, r.lng], {
    icon: pin(r.type === "alert" ? "alert" : "")
  })
    .addTo(map)
    .bindPopup(`<b>${r.title}</b><br>${r.note}`);
});

/* ====== GCH Area Location ====== */

document.getElementById("locationName").textContent = AREA.name;

// Return to GCH'S location when clicked
document.getElementById("locationChip").addEventListener("click", () => {
  map.flyTo(AREA.center, AREA.zoom);
});

// Update the connection status
function setStatus(online) {
  const chip = document.getElementById("statusChip");
  const statusText = document.getElementById("statusText");

  // Stop if the status elements do not exist
  if (!chip || !statusText) {
    return;
  }

  chip.classList.toggle("offline", !online);

  statusText.textContent = online ? "Active" : "Offline";
}

// Check the browser's current connection
setStatus(navigator.onLine);

// Update status when the connection changes
addEventListener("online", () => setStatus(true));
addEventListener("offline", () => setStatus(false));


addEventListener("resize", () => {
  map.invalidateSize();
});

/* ====== Use My Current Location ====== */

let meMarker = null;
let meCircle = null;

const locateBtn = document.getElementById("locateBtn");

locateBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Your browser does not support location detection.");
    return;
  }

  locateBtn.classList.add("loading");

  map.locate({
    setView: true,
    maxZoom: 17,
    enableHighAccuracy: true,
    timeout: 15000
  });
});

// When the browser finds the user's location
map.on("locationfound", (e) => {
  locateBtn.classList.remove("loading");

  if (meMarker) {
    map.removeLayer(meMarker);
  }

  if (meCircle) {
    map.removeLayer(meCircle);
  }

  meMarker = L.marker(e.latlng, {
    icon: L.divIcon({
      className: "",
      html: '<div class="gc-me"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    })
  })
    .addTo(map)
    .bindPopup("You are here!")
    .openPopup();

  meCircle = L.circle(e.latlng, {
    radius: e.accuracy,
    color: "#2196f3",
    weight: 1,
    fillOpacity: 0.1
  }).addTo(map);
});

// When the browser cannot find the user's location
map.on("locationerror", (e) => {
  locateBtn.classList.remove("loading");

  if (e.code === 1) {
    alert("Location access was denied. Please allow location access in your browser settings.");
  } else if (e.code === 2) {
    alert("Your current location is unavailable. Check your device's location services.");
  } else if (e.code === 3) {
    alert("The location request timed out. Please try again.");
  } else {
    alert("Unable to get your location: " + e.message);
  }

  console.error("Location error:", e.message);
});
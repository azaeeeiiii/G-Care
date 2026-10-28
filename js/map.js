/* ====== Config: edit these ====== */

const AREA = {
  name: "Golden Country Homes",
  center: [13.7855681, 121.07302445],
  zoom: 16
};

// Sample data. Replace with your backend / Firebase / Supabase feed.
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


/* ====== Location and Status Chips ====== */

// Display the community name
document.getElementById("locationName").textContent = AREA.name;

// Return to the community's location when clicked
document.getElementById("locationChip").addEventListener("click", () => {
  map.flyTo(AREA.center, AREA.zoom);
});

// Update the connection status
function setStatus(online) {
  const chip = document.getElementById("statusChip");

  chip.classList.toggle("offline", !online);

  document.getElementById("statusText").textContent =
    online ? "Active" : "Offline";
}

// Check the browser's current connection
setStatus(navigator.onLine);

// Update status when the connection changes
addEventListener("online", () => setStatus(true));
addEventListener("offline", () => setStatus(false));


/* ====== Keep the Map Sized Correctly ====== */

addEventListener("resize", () => {
  map.invalidateSize();
});


/* ====== Use My Current Location ====== */

let meMarker = null;
let meCircle = null;

const locateBtn = document.getElementById("locateBtn");

locateBtn.addEventListener("click", () => {
  locateBtn.classList.add("loading");

  map.locate({
    setView: true,
    maxZoom: 17,
    enableHighAccuracy: true
  });
});

// When the browser finds the user's location
map.on("locationfound", (e) => {
  locateBtn.classList.remove("loading");

  // Remove the previous location marker and circle
  if (meMarker) map.removeLayer(meMarker);
  if (meCircle) map.removeLayer(meCircle);

  // Add a marker for the user's current location
  meMarker = L.marker(e.latlng, {
    icon: L.divIcon({
      className: "",
      html: '<div class="gc-me"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    })
  })
    .addTo(map)
    .bindPopup("You are here")
    .openPopup();

  // Show the estimated accuracy of the location
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

  alert(
    e.code === 1
      ? "Location access was denied. Allow it in your browser's site settings and try again."
      : "Couldn't get your location. Check that GPS or Wi-Fi is on and try again."
  );
});
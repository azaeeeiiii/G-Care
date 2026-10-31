/* ====== Community Feed ====== */

const NEWS_ITEMS = [
  {
    title: "Flood Advisory: Stay Alert",
    category: "WEATHER UPDATE",
    time: "10 mins ago",
    body: "Heavy rainfall may cause flooding in low-lying areas. Prepare your emergency kits and monitor local advisories.",
    details: "Residents are advised to stay indoors when possible and avoid crossing flooded roads. Keep your phones charged, secure loose items around your home, and follow official announcements from local authorities.",
    location: "Golden Country Homes",
    source: "GCare Community Safety Desk"
  },
  {
    title: "Relief Operations Announced",
    category: "COMMUNITY NEWS",
    time: "30 mins ago",
    body: "Volunteers are encouraged to join the upcoming relief goods packing activity in Alangilan.",
    details: "The community is organizing a relief goods packing activity for families affected by the recent weather conditions. Volunteers may help sort, pack, and prepare essential supplies for distribution.",
    location: "Alangilan Community Hall",
    source: "GCare Volunteer Desk"
  },
  {
    title: "Emergency Kit Checklist",
    category: "SAFETY TIPS",
    time: "1 hour ago",
    body: "Keep drinking water, food, medicines, a flashlight, and important documents ready for emergencies.",
    details: "An emergency kit should contain enough supplies for every household member. Store drinking water, ready-to-eat food, maintenance medicines, a first-aid kit, a flashlight, spare batteries, and copies of important documents in one accessible place.",
    location: "Golden Country Homes",
    source: "GCare Safety Desk"
  },
  {
    title: "Flood Advisory: Stay Alert",
    category: "WEATHER UPDATE",
    time: "2 hours ago",
    body: "Residents are reminded to avoid flooded roads and report unsafe areas through the GCare app.",
    details: "Please do not attempt to drive or walk through areas with fast-moving or deep water. If you see a flooded road or another hazard, use the Report tab to send its location and a short description.",
    location: "Golden Country Homes",
    source: "GCare Community Safety Desk"
  },
  {
    title: "Community Clean-Up Drive",
    category: "COMMUNITY NEWS",
    time: "3 hours ago",
    body: "Join your neighbors this Saturday as we work together to keep Golden Country Homes clean and safe.",
    details: "Residents are invited to help clear litter and maintain shared spaces around the community. Bring drinking water, wear comfortable clothes, and coordinate with the assigned area leaders before starting.",
    location: "Golden Country Homes",
    source: "GCare Community Desk"
  },
  {
    title: "Know Your Evacuation Route",
    category: "SAFETY TIPS",
    time: "4 hours ago",
    body: "Check the community map and familiarize yourself with the nearest safe evacuation area.",
    details: "Knowing your route before an emergency helps your household move quickly and safely. Review the community map, identify at least one alternate route, and agree on a meeting point with your family.",
    location: "Golden Country Homes",
    source: "GCare Safety Desk",
    image: "images/map.png",
    imageAlt: "Community map icon"
  },
  {
    title: "Water Service Maintenance",
    category: "LOCAL UPDATE",
    time: "Yesterday",
    body: "Scheduled maintenance may temporarily affect water service in selected areas of the community.",
    details: "The maintenance team will work on scheduled improvements in the affected service areas. Residents are encouraged to store enough water for essential needs before the maintenance period begins.",
    location: "Selected GCH areas",
    source: "GCare Local Updates"
  },
  {
    title: "Volunteer Orientation",
    category: "VOLUNTEER NEWS",
    time: "Yesterday",
    body: "New volunteers can attend the next orientation to learn how to support community response efforts.",
    details: "The orientation introduces the community response process, volunteer roles, and basic safety reminders. Participants will also learn how to coordinate reports and support relief activities.",
    location: "GCare Community Hall",
    source: "GCare Volunteer Desk"
  },
  {
    title: "Report Community Concerns",
    category: "GCARE REMINDER",
    time: "2 days ago",
    body: "Use the Report tab to send updates about hazards, urgent concerns, or residents who need assistance.",
    details: "Clear and timely reports help the community respond faster. Include the location, describe what happened, and add a photo when it is safe and available.",
    location: "Golden Country Homes",
    source: "GCare Support Team"
  }
];

const feedGrid = document.getElementById("feedGrid");

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function renderFeed() {
  feedGrid.innerHTML = "";

  NEWS_ITEMS.forEach(news => {
  const card = document.createElement("article");
  card.className = "news-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Read details: ${news.title}`);
  card.innerHTML = `
    <h2>${escapeHTML(news.title)}</h2>
    <p class="news-meta">${escapeHTML(news.category)} <span aria-hidden="true">·</span> ${escapeHTML(news.time)}</p>
    <p>${escapeHTML(news.body)}</p>
  `;
  card.addEventListener("click", () => showNewsDetails(news));
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showNewsDetails(news);
    }
  });
  feedGrid.appendChild(card);
  });
}

renderFeed();

const newsDetailsView = document.getElementById("newsDetailsView");

function showNewsDetails(news) {
  newsDetailsView.innerHTML = `
    <button class="news-back-button" type="button">← Back to Feed</button>
    <article class="news-detail">
      <header class="news-detail-header">
        <p class="news-detail-category">${escapeHTML(news.category)}</p>
        <h1>${escapeHTML(news.title)}</h1>
        <p class="news-detail-meta">${escapeHTML(news.time)} <span aria-hidden="true">·</span> ${escapeHTML(news.location)}</p>
      </header>
      ${news.image ? `<img class="news-detail-image" src="${news.image}" alt="${escapeHTML(news.imageAlt)}">` : ""}
      <div class="news-detail-content">
        <section>
          <h2>Overview</h2>
          <p>${escapeHTML(news.body)}</p>
        </section>
        <section>
          <h2>Details</h2>
          <p>${escapeHTML(news.details)}</p>
        </section>
        <section>
          <h2>Reported by</h2>
          <p>${escapeHTML(news.source)}</p>
        </section>
      </div>
    </article>
  `;

  newsDetailsView.hidden = false;
  document.getElementById("feedView").hidden = true;
  document.querySelectorAll(".tab").forEach(tab => tab.removeAttribute("aria-current"));
  newsDetailsView.querySelector(".news-back-button").addEventListener("click", showFeed);
  newsDetailsView.querySelector(".news-back-button").focus();
}

function showFeed() {
  newsDetailsView.hidden = true;
  document.getElementById("feedView").hidden = false;
  document.querySelector('[data-view="feed"]').setAttribute("aria-current", "page");
}

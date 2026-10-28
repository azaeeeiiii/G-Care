/* ====== Bottom Navigation ====== */

const tabs = document.querySelectorAll(".tab");

const views = {
  feed: document.getElementById("feedView"),
  map: document.getElementById("mapView"),
  report: document.getElementById("reportView"),
  volunteer: document.getElementById("volunteerView"),
  profile: document.getElementById("profileView")
};

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const selectedView = tab.dataset.view;

    // Hide all sections
    Object.values(views).forEach(view => {
      view.hidden = true;
    });

    // Show the selected section
    views[selectedView].hidden = false;

    // Highlight the selected navigation button
    tabs.forEach(t => t.removeAttribute("aria-current"));
    tab.setAttribute("aria-current", "page");

    // Refresh the map when returning to it
    if (selectedView === "map") {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  });
});
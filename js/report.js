/* ====== Community News Reporting ====== */

const reportForm = document.getElementById("reportForm");
const reportStatus = document.getElementById("reportStatus");

reportForm.addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(reportForm);
  const imageFile = formData.get("image");
  const value = name => String(formData.get(name) || "").trim();
  const news = {
    title: value("title"),
    category: value("category"),
    time: "Just now",
    body: value("body"),
    details: value("details"),
    location: value("location"),
    source: value("source")
  };

  if (imageFile instanceof File && imageFile.size > 0) {
    const reader = new FileReader();
    reader.addEventListener("load", () => publishReport(news, reader.result));
    reader.addEventListener("error", () => {
      reportStatus.textContent = "The photo could not be uploaded. Please try another image.";
      reportStatus.classList.remove("success");
    });
    reader.readAsDataURL(imageFile);
    return;
  }

  publishReport(news);
});

function publishReport(news, imageData) {
  if (imageData) {
    news.image = imageData;
    news.imageAlt = `Photo attached to ${news.title}`;
  }

  NEWS_ITEMS.unshift(news);
  renderFeed();
  reportForm.reset();
  reportStatus.textContent = "Your report was published to the community feed.";
  reportStatus.classList.add("success");
}

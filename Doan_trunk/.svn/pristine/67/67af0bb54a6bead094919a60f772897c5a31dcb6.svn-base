document.addEventListener("DOMContentLoaded", () => {
  const feedbackList = document.getElementById("feedbackList");
  const ratingFilter = document.getElementById("ratingFilter");

  let feedbacks = [];

  // =====================
  // LOAD FEEDBACK
  // =====================
  fetch("index.php?controller=feedback&action=apiList")
    .then((res) => res.json())
    .then((data) => {
      feedbacks = data;
      renderFeedbacks(data);
    });

  fetch("index.php?controller=feedback&action=apiStats")
    .then((res) => res.json())
    .then((s) => {
      // Tổng feedback
      document.querySelector("#totalReviews").innerText = s.total;

      // Trung bình sao
      document.querySelector("#avgRating").innerText = s.avg_rating;
    });

  // =====================
  // RENDER
  // =====================
  function renderFeedbacks(list) {
    feedbackList.innerHTML = "";

    list.forEach((f) => {
      const div = document.createElement("div");
      div.className = "review";

      div.innerHTML = `
        <div class="review-header">
          <div class="stars">
            ${"★".repeat(f.rating)}${"☆".repeat(5 - f.rating)}
            <strong>${f.rating}.0</strong>
          </div>
          <div>
            <span class="badge">${f.username ?? "Guest"}</span>
          </div>
        </div>

        <div class="title">${f.email ?? ""}</div>

        <div class="text">
          ${f.content}
        </div>
      `;

      feedbackList.appendChild(div);
    });
  }

  // =====================
  // FILTER BY RATING
  // =====================
  ratingFilter.addEventListener("change", () => {
    const value = ratingFilter.value;

    if (value === "all") {
      renderFeedbacks(feedbacks);
    } else {
      renderFeedbacks(feedbacks.filter((f) => f.rating == value));
    }
  });
});

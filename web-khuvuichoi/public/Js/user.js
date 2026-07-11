document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-box input");
  const tbody = document.getElementById("customerTableBody");

  const customerCount = document.getElementById("customerCount");
  const showingCount = document.getElementById("showingCount");

  const logoutBtn = document.getElementById("btnLogout");

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  const detailEmail = document.getElementById("detailEmail");
  const detailStatus = document.getElementById("detailStatus");
  const detailCreated = document.getElementById("detailCreated");
  const detailName = document.getElementById("detailName");

  const btnOpenUser = document.getElementById("btnOpenUser");
  const btnLockUser = document.getElementById("btnLockUser");

  let selectedUser = null; // user đang được chọn

  // ===============================
  // DATA + PAGINATION
  // ===============================
  let users = [];
  let filteredList = [];
  let perPage = 10;
  let currentPage = 1;

  // ===============================
  // 1. LOAD USERS
  // ===============================
  fetch("index.php?controller=user&action=apiList")
    .then((res) => res.json())
    .then((data) => {
      users = data;
      filteredList = data;

      customerCount.innerText = `${data.length} users`;
      renderTable();
    })
    .catch((err) => console.error("LOAD USER ERROR:", err));

  // ===============================
  // 2. RENDER TABLE
  // ===============================
  function renderTable() {
    tbody.innerHTML = "";

    const total = filteredList.length;
    const start = (currentPage - 1) * perPage;
    const end = Math.min(start + perPage, total);

    const pageData = filteredList.slice(start, end);

    pageData.forEach((u) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${u.username}</td>
        <td>••••••••</td>
        <td>${u.email}</td>
        <td>
          <span class="status-tag ${
            u.status === "ACTIVE" ? "active" : "inactive"
          }">
            ${u.status}
          </span>
        </td>
        <td>${formatDate(u.created_at)}</td>
      `;

      tr.addEventListener("click", () => openSidebarWithData(u));

      tbody.appendChild(tr);
    });

    showingCount.innerText = `Showing ${start + 1}–${end} of ${total}`;
    renderPagination();
  }

  // ===============================
  // 3. SEARCH
  // ===============================
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();

    filteredList = users.filter((u) =>
      (u.username + u.email).toLowerCase().includes(keyword)
    );

    currentPage = 1;
    renderTable();
  });

  // ===============================
  // 4. PAGINATION
  // ===============================
  function renderPagination() {
    const totalPages = Math.ceil(filteredList.length / perPage);
    const container = document.getElementById("paginationNumbers");

    container.innerHTML = "";

    const createBtn = (text, disabled, onClick, active = false) => {
      const btn = document.createElement("button");
      btn.innerText = text;
      btn.classList.add("page-btn");
      if (active) btn.classList.add("active");
      btn.disabled = disabled;
      btn.addEventListener("click", onClick);
      container.appendChild(btn);
    };

    createBtn("Previous", currentPage === 1, () => {
      currentPage--;
      renderTable();
    });

    for (let i = 1; i <= totalPages; i++) {
      createBtn(
        i,
        false,
        () => {
          currentPage = i;
          renderTable();
        },
        i === currentPage
      );
    }

    createBtn("Next", currentPage === totalPages, () => {
      currentPage++;
      renderTable();
    });
  }

  // ===============================
  // 5. LOGOUT
  // ===============================
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "index.php?controller=login&action=logout";
    });
  }

  // ===============================
  // UTIL
  // ===============================
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
  }

  // ----------------------------
  // 3. SIDEBAR
  // ----------------------------
  function openSidebarWithData(u) {
    selectedUser = u; // lưu user đang chọn

    detailName.innerText = u.username;
    detailEmail.innerText = "Email: " + u.email;
    detailStatus.innerText = u.status;
    detailCreated.innerText = formatDate(u.created_at);

    // Reset class
    btnOpenUser.classList.remove("disabled");
    btnLockUser.classList.remove("disabled");

    // ======================
    // LOGIC TRẠNG THÁI
    // ======================
    if (u.status === "ACTIVE") {
      // Đang mở → chỉ cho khóa
      btnOpenUser.classList.add("disabled");
      btnOpenUser.disabled = true;

      btnLockUser.disabled = false;
    } else {
      // Đang khóa → chỉ cho mở
      btnLockUser.classList.add("disabled");
      btnLockUser.disabled = true;

      btnOpenUser.disabled = false;
    }

    sidebar.classList.add("active");
    overlay.classList.add("active");
  }

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

  const filterButtons = document.querySelectorAll(".filter-btn");

  console.log(filterButtons.length, "filter buttons detected");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // bỏ active cũ
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const status = btn.dataset.status;

      // ALL
      if (status === "all") {
        filteredList = users;
        currentPage = 1;
        renderTable();
        return;
      }

      // Lọc theo trạng thái
      filteredList = users.filter((u) => u.status === status);

      currentPage = 1;
      renderTable();
    });
  });
  btnLockUser.addEventListener("click", () => {
    if (!selectedUser || selectedUser.status !== "ACTIVE") return;

    if (!confirm("Bạn có chắc muốn KHÓA tài khoản này?")) return;

    fetch("index.php?controller=user&action=updateStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: selectedUser.id,
        status: "BLOCK",
      }),
    })
      .then((res) => res.text())
      .then(() => location.reload());
  });

  btnOpenUser.addEventListener("click", () => {
    if (!selectedUser || selectedUser.status !== "BLOCK") return;

    if (!confirm("Bạn có chắc muốn MỞ tài khoản này?")) return;

    fetch("index.php?controller=user&action=updateStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: selectedUser.id,
        status: "ACTIVE",
      }),
    })
      .then((res) => res.text())
      .then(() => location.reload());
  });
});

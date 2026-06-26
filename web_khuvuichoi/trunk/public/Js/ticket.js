document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("ticketTable");

  const totalTickets = document.getElementById("totalTickets");
  const unusedTickets = document.getElementById("unusedTickets");
  const usedTickets = document.getElementById("usedTickets");
  const totalRevenue = document.getElementById("totalRevenue");

  const statusSelect = document.querySelector("select:nth-of-type(1)");
  const typeSelect = document.querySelector("select:nth-of-type(2)");
  const searchInput = document.getElementById("searchInput");

  const showingCount = document.getElementById("showingCount");
  const paginationNumbers = document.getElementById("paginationNumbers");

  let tickets = [];
  let filteredTickets = [];

  let currentPage = 1;
  let perPage = 10;

  // =====================
  // LOAD STATS
  // =====================
  function loadStats() {
    fetch("index.php?controller=ticket&action=apiStats")
      .then((res) => res.json())
      .then((s) => {
        totalTickets.innerText = s.total;
        unusedTickets.innerText = s.unused;
        usedTickets.innerText = s.used;
        totalRevenue.innerText =  Number(s.revenue ?? 0).toFixed(2)+ "VNĐ";
      });
  }

  // =====================
  // LOAD TICKETS
  // =====================
  function loadTickets() {
    const status = statusSelect.value;
    const type = typeSelect.value;

    fetch(
      `index.php?controller=ticket&action=apiList&status=${status}&type=${type}`
    )
      .then((res) => res.json())
      .then((data) => {
        tickets = data;
        applyFilters();
      });
  }

  // =====================
  // APPLY SEARCH + FILTER
  // =====================
  function applyFilters() {
    const keyword = searchInput.value.toLowerCase().trim();

    filteredTickets = tickets.filter((t) =>
      t.ticket_code.toLowerCase().includes(keyword)
    );

    currentPage = 1;
    renderTable();
  }

  // =====================
  // RENDER TABLE
  // =====================
  function renderTable() {
    tableBody.innerHTML = "";

    const total = filteredTickets.length;
    const start = (currentPage - 1) * perPage;
    const end = Math.min(start + perPage, total);

    const pageData = filteredTickets.slice(start, end);

    pageData.forEach((t) => {
      tableBody.innerHTML += `
        <tr>
          <td>${t.ticket_code}</td>
          <td>#${t.order_id}</td>
          <td>${t.item_type}</td>
          <td>${t.item_name}</td>
          <td>${Number(t.price).toFixed(2)} VNĐ</td>
          <td>${t.created_at}</td>
          <td>
            <span class="status ${t.status === "USED" ? "used" : "unused"}">${
        t.status
      }</span>
          </td>
        </tr>
      `;
    });

    showingCount.innerText = `Showing ${start + 1}-${end} of ${total}`;
    renderPagination(total);
  }

  // =====================
  // PAGINATION
  // =====================
  function renderPagination(totalItems) {
    paginationNumbers.innerHTML = "";

    const totalPages = Math.ceil(totalItems / perPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = "page-btn" + (i === currentPage ? " active" : "");
      btn.innerText = i;

      btn.addEventListener("click", () => {
        currentPage = i;
        renderTable();
      });

      paginationNumbers.appendChild(btn);
    }
  }

  // =====================
  // EVENTS
  // =====================
  statusSelect.addEventListener("change", loadTickets);
  typeSelect.addEventListener("change", loadTickets);

  searchInput.addEventListener("input", applyFilters);

  // INIT
  loadStats();
  loadTickets();
});

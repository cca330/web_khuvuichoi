document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("ticketTable");

  const totalTickets = document.getElementById("totalTickets");
  const unusedTicketsEl = document.getElementById("unusedTickets");
  const usedTicketsEl = document.getElementById("usedTickets");
  const totalRevenue = document.getElementById("totalRevenue");

  const statusSelect = document.getElementById("statusSelect");
  const typeSelect = document.getElementById("typeSelect");
  const searchInput = document.getElementById("searchInput");

  const showingCount = document.getElementById("showingCount");
  const paginationNumbers = document.getElementById("paginationNumbers");

  let tickets = [];
  let filteredTickets = [];

  let currentPage = 1;
  const perPage = 10;

  const STATUS_LABEL = {
    ACTIVE: "Còn hiệu lực",
    EXPIRED: "Hết hạn",
    CANCELLED: "Đã hủy",
  };

  const STATUS_CLASS = {
    ACTIVE: "unused",
    EXPIRED: "used",
    CANCELLED: "used",
  };

  function formatVND(n) {
    return Number(n ?? 0).toLocaleString("vi-VN") + " VNĐ";
  }

  function loadStats() {
    fetch("index.php?controller=ticket&action=apiStats")
      .then((res) => res.json())
      .then((s) => {
        totalTickets.innerText = s.total;
        unusedTicketsEl.innerText = s.unused;
        usedTicketsEl.innerText = s.used;
        totalRevenue.innerText = formatVND(s.revenue);
      });
  }

  function loadTickets() {
    const status = statusSelect.value;
    const type = typeSelect.value;

    fetch(
      `index.php?controller=ticket&action=apiList&status=${status}&type=${type}`,
    )
      .then((res) => res.json())
      .then((data) => {
        tickets = data;
        applyFilters();
      });
  }

  function applyFilters() {
    const keyword = searchInput.value.toLowerCase().trim();

    filteredTickets = tickets.filter((t) =>
      t.ticket_code.toLowerCase().includes(keyword),
    );

    currentPage = 1;
    renderTable();
  }

  function renderTable() {
    tableBody.innerHTML = "";

    const total = filteredTickets.length;
    const start = (currentPage - 1) * perPage;
    const end = Math.min(start + perPage, total);
    const pageData = filteredTickets.slice(start, end);

    pageData.forEach((t) => {
      // LOAI: Combo hay Ve don, dua vao is_combo tu gate_tickets
      const typeLabel = Number(t.is_combo) === 1 ? "Combo" : "Vé đơn";
      // TEN VE: lay tu gate_ticket_name (thay vi item_name cu)
      const ticketName = t.gate_ticket_name ?? "";

      tableBody.innerHTML += `
      <tr>
        <td>${t.ticket_code}</td>
        <td>#${t.order_id}</td>
        <td>${typeLabel}</td>
        <td>${ticketName}</td>
        <td>${formatVND(t.price)}</td>
        <td>${t.created_at}</td>
        <td>
          <span class="status ${STATUS_CLASS[t.status] ?? ""}">${
            STATUS_LABEL[t.status] ?? t.status
          }</span>
        </td>
      </tr>
    `;
    });

    showingCount.innerText =
      total === 0
        ? "Showing 0-0 of 0"
        : `Showing ${start + 1}-${end} of ${total}`;
    renderPagination(total);
  }

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

  statusSelect.addEventListener("change", loadTickets);
  typeSelect.addEventListener("change", loadTickets);
  searchInput.addEventListener("input", applyFilters);

  loadStats();
  loadTickets();
});

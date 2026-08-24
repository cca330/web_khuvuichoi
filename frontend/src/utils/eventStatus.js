export function getEventDisplayStatus(event) {
  // Nếu admin đã chủ động hủy, luôn ưu tiên hiển thị CANCELLED
  if (event.status === "CANCELLED") return "CANCELLED";

  const now = new Date();
  const start = new Date(event.startDatetime);
  const end = new Date(event.endDatetime);

  if (now < start) return "COMING_SOON";
  if (now >= start && now <= end) return "ONGOING";
  return "FINISHED";
}

export function getStatusLabel(status) {
  const labels = {
    COMING_SOON: "Sắp diễn ra",
    ONGOING: "Đang diễn ra",
    FINISHED: "Đã kết thúc",
    CANCELLED: "Đã hủy",
  };
  return labels[status] || status;
}

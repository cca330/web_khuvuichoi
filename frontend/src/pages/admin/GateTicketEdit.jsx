import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ticketsApi from "../../api/ticketsApi";
import GateTicketForm from "./GateTicketForm";

export default function GateTicketEdit() {
  const { id } = useParams();
  const [gateTicket, setGateTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ticketsApi
      .getGateTicketForAdmin(id)
      .then((response) => setGateTicket(response.data))
      .catch(() => setError("Không tìm thấy loại vé"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container">Đang tải...</div>;
  if (error) return <div className="container">{error}</div>;

  return <GateTicketForm initialData={gateTicket} gateTicketId={id} />;
}

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import eventsApi from "../../api/eventsApi";
import EventForm from "./EventForm";

export default function EventEdit() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await eventsApi.getById(id);
      setEvent(res.data);
    } catch (err) {
      setError("Không tìm thấy sự kiện");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Đang tải...</div>;
  if (error) return <div className="container">{error}</div>;

  return <EventForm initialData={event} eventId={id} />;
}

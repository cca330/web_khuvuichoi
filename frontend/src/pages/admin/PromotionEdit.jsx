import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import promotionsApi from "../../api/promotionsApi";
import PromotionForm from "./PromotionForm";

export default function PromotionEdit() {
  const { id } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPromotion();
  }, [id]);

  const fetchPromotion = async () => {
    try {
      setLoading(true);
      const res = await promotionsApi.getById(id);
      setPromotion(res.data);
    } catch (err) {
      setError("Không tìm thấy khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Đang tải...</div>;
  if (error) return <div className="container">{error}</div>;

  return <PromotionForm initialData={promotion} promotionId={id} />;
}

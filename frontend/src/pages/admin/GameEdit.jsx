import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import gamesApi from "../../api/gamesApi";
import GameForm from "./GameForm";

export default function GameEdit() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      setLoading(true);
      const res = await gamesApi.getById(id);
      setGame(res.data);
    } catch (err) {
      setError("Không tìm thấy trò chơi");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Đang tải...</div>;
  if (error) return <div className="container">{error}</div>;

  return <GameForm initialData={game} gameId={id} />;
}

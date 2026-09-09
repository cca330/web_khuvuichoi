DELETE duplicate_feedback
FROM feedbacks duplicate_feedback
JOIN feedbacks older_feedback
  ON older_feedback.user_id = duplicate_feedback.user_id
 AND older_feedback.game_id = duplicate_feedback.game_id
 AND older_feedback.id < duplicate_feedback.id;

ALTER TABLE feedbacks
  ADD UNIQUE KEY uq_feedbacks_user_game (user_id, game_id);
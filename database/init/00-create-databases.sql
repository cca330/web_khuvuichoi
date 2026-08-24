CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS event_db;
CREATE DATABASE IF NOT EXISTS game_db;
CREATE DATABASE IF NOT EXISTS ticket_db;
CREATE DATABASE IF NOT EXISTS promotion_db;

CREATE USER IF NOT EXISTS 'user_app'@'%' IDENTIFIED BY 'user-password-change-me';
CREATE USER IF NOT EXISTS 'event_app'@'%' IDENTIFIED BY 'event-password-change-me';
CREATE USER IF NOT EXISTS 'game_app'@'%' IDENTIFIED BY 'game-password-change-me';
CREATE USER IF NOT EXISTS 'ticket_app'@'%' IDENTIFIED BY 'ticket-password-change-me';
CREATE USER IF NOT EXISTS 'promotion_app'@'%' IDENTIFIED BY 'promotion-password-change-me';

GRANT ALL PRIVILEGES ON user_db.* TO 'user_app'@'%';
GRANT ALL PRIVILEGES ON event_db.* TO 'event_app'@'%';
GRANT ALL PRIVILEGES ON game_db.* TO 'game_app'@'%';
GRANT ALL PRIVILEGES ON ticket_db.* TO 'ticket_app'@'%';
GRANT ALL PRIVILEGES ON promotion_db.* TO 'promotion_app'@'%';
FLUSH PRIVILEGES;
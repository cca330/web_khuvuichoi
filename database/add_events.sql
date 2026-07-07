CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    thumbnail VARCHAR(255) NOT NULL,

    description TEXT,

    location VARCHAR(255),

    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,

    status ENUM(
        'COMING_SOON',
        'ONGOING',
        'FINISHED',
        'CANCELLED'
    ) DEFAULT 'COMING_SOON',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE event_images (

    id INT AUTO_INCREMENT PRIMARY KEY,

    event_id INT NOT NULL,

    image VARCHAR(255) NOT NULL,

    FOREIGN KEY(event_id)
        REFERENCES events(id)
        ON DELETE CASCADE
);

CREATE TABLE event_schedule (

    id INT AUTO_INCREMENT PRIMARY KEY,

    event_id INT NOT NULL,

    schedule_time TIME,

    title VARCHAR(255),

    description TEXT,

    sort_order INT DEFAULT 1,

    FOREIGN KEY(event_id)
        REFERENCES events(id)
        ON DELETE CASCADE
);
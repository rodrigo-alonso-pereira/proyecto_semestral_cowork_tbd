# DDL for User Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# DDL for Workspace Table
CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,  
    name VARCHAR(100) NOT NULL,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# DDL for Reservations Table
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    workspace_id INT REFERENCES workspaces(id),
    user_id INT REFERENCES users(id),
    reservation_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 


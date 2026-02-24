# 🎫 Support Ticket Management System – Backend (Node.js + MySQL)

A secure, role-based backend system for managing company helpdesk tickets. Employees can raise tickets, support staff handle them, and managers track and control the entire workflow.

This system implements **JWT authentication, Role-Based Access Control (RBAC), secure password handling, ticket lifecycle enforcement, and Swagger API documentation**.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcrypt Password Hashing
- Joi Validation
- Swagger UI

---

## 🔐 Features

- Secure login using JWT
- Password hashing using bcrypt
- Role-Based Access Control (RBAC)
  - MANAGER
  - SUPPORT
  - USER
- Ticket lifecycle: OPEN → IN_PROGRESS → RESOLVED → CLOSED
- Enforced status transition rules
- Ticket assignment & commenting
- Ticket status audit logs
- Swagger API documentation

---

## 📂 Project Structure
support-ticket-system/
│
├── src/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── routes/
│ ├── validators/
│ ├── swagger.js
│ └── app.js
│
├── .env
├── package.json
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

git clone Support-Ticket-Management
cd support-ticket-system

### Install Dependencies
npm install

### Setup MySQL Database

create database tiket_db;

use tiket_db;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name ENUM('MANAGER','SUPPORT','USER') NOT NULL UNIQUE
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- store bcrypt hash
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) 
        REFERENCES roles(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') DEFAULT 'OPEN',
    priority ENUM('LOW','MEDIUM','HIGH') DEFAULT 'MEDIUM',
    created_by INT NOT NULL,
    assigned_to INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tickets_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_tickets_assigned_to
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


CREATE TABLE ticket_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE ticket_status_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    old_status ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL,
    new_status ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL,
    changed_by INT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_status_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES tickets(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_status_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

INSERT INTO roles (name) VALUES ('MANAGER'), ('SUPPORT'), ('USER');

INSERT INTO users (name, email, password, role_id)
VALUES (
  'Admin Manager',
  'manager@test.com',
  '$2b$10$tI7YKUzfKwqWo57OVcZlyOw7q5NgTjOcxGUCRLCfLF6jLTDMga0xq',
  (SELECT id FROM roles WHERE name='MANAGER')
);


----

### Run Project

npm run dev

Server will start at: http://localhost:5000


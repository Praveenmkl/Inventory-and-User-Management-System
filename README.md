# 📦 Inventory & User Management System

A full-stack web application designed for managing inventory records and items with image upload capabilities, real-time filtering, full CRUD operations, and a modern responsive user interface.

---

## 🛠️ Technology Stack

### **Frontend**
- **React.js 19** - UI Framework
- **React Router DOM v7** - Client-side Routing
- **Axios** - HTTP Client for API communication
- **Vanilla CSS3** - Modern styling, glassmorphism, responsive design, animations

### **Backend**
- **Java 17** - Core programming language
- **Spring Boot 3 / 4** - REST API framework
- **Spring Data JPA & Hibernate** - ORM & database interactions
- **Maven** - Dependency & build management

### **Database & Storage**
- **MySQL** - Relational database (`inventory` database)
- **Multipart File Upload** - Local image storage under backend server context (`src/main/Upload/`)

---

## 📋 Features

- ➕ **Add New Inventory Item**: Upload item image, specify item name, select category, and add detailed descriptions.
- 🖼️ **Image File Upload**: Support for uploading and viewing item preview thumbnails and high-res modal previews.
- 📋 **Item Listing & Search**: View list of all inventory items with real-time search filtering by name, category, or description.
- ✏️ **Edit & Update**: Full inline edit capability for updating item details and images.
- 🗑️ **Delete Record**: Interactive modal confirmation for safe item deletion.
- ⚡ **Responsive UI**: Sleek, modern user interface with gradient aesthetics, clean tables, dynamic badges, and responsive layouts.

---

## 📂 Project Architecture & Structure

```
Inventory & User Management System/
├── backend/
│   ├── src/main/java/backend/
│   │   ├── Controller/
│   │   │   └── InventoryController.java   # Spring Boot REST Endpoints
│   │   ├── Model/
│   │   │   └── InventoryModel.java        # JPA Entity Model
│   │   ├── Repository/
│   │   │   └── InventoryRepository.java   # Spring Data JPA Repository
│   │   └── Exception/
│   │       └── InventoryNotFoundException.java
│   └── src/main/resources/
│       └── application.properties        # DB configuration & JPA properties
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── Home/                      # Landing Page Component
        │   ├── Item/                      # Item Add & Form Components
        │   └── DisplayItem/               # Inventory Display, Search & Edit Modal
        ├── App.js                         # Application Routes
        ├── index.css                      # Global Design System & CSS Rules
        └── index.js                       # React Entry Point
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Java Development Kit (JDK) 17+**
- **Node.js (v18+ recommended) & npm**
- **MySQL Server (v8.0+)**

---

### 1. Database Setup

1. Open your MySQL client (e.g., MySQL Workbench or Command Line Client).
2. Create a database named `inventory`:

```sql
CREATE DATABASE inventory;
```

3. Update MySQL credentials in `backend/src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/inventory?serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

### 2. Backend Setup & Execution

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Build and run the Spring Boot application using the Maven Wrapper:

   **On Windows (PowerShell / CMD):**
   ```bash
   .\mvnw.cmd spring-boot:run
   ```

   **On Linux / macOS:**
   ```bash
   ./mvnw spring-boot:run
   ```

3. The backend server will start on `http://localhost:8080`.

---

### 3. Frontend Setup & Execution

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm run dev
   ```
   *(or `npm start`)*

4. Open `http://localhost:3000` in your web browser.

---

## 📡 REST API Specifications

| Method | Endpoint | Description | Request Body / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/inventory` | Fetch all inventory items | - |
| `GET` | `/inventory/{id}` | Fetch a single item by ID | - |
| `POST` | `/inventory` | Create a new inventory record | JSON `InventoryModel` |
| `POST` | `/inventory/itemImg` | Upload an item image file | Multipart `file` |
| `PUT` | `/inventory/{id}` | Update existing item by ID | JSON `InventoryModel` |
| `DELETE` | `/inventory/{id}` | Delete item by ID | - |
| `GET` | `/upload/{filename}` | Serve uploaded item image file | - |

---

## 💻 Technical Details & Data Models

### **Inventory Object Schema**
```json
{
  "id": 1,
  "itemName": "Laptop Pro 15",
  "itemCategory": "Electronics",
  "itemDetails": "High performance workstation laptop",
  "itemImage": "laptop-pro.jpg"
}
```

---

## 🤝 Contributing & Maintenance

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git checkout main`)
5. Open a Pull Request

---

## 📄 License

This project is maintained for internal inventory and user management systems.

# Notes Application

A simple full-stack notes application built with Spring Boot for the backend (REST API) and vanilla HTML, CSS, and JavaScript for the frontend. This application allows users to register, log in, and perform CRUD (Create, Read, Update, Delete) operations on their personal notes.

## Table of Contents

-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Prerequisites](#prerequisites)
-   [Setup and Installation](#setup-and-installation)
    -   [Backend (Spring Boot)](#backend-spring-boot)
    -   [Database (PostgreSQL)](#database-postgresql)
    -   [Frontend (HTML/CSS/JS)](#frontend-htmlcssjs)
-   [Usage](#usage)
-   [Authentication Note](#authentication-note)
-   [Future Enhancements](#future-enhancements)

## Features

* **User Authentication:**
    * User Registration (`/api/auth/register`)
    * User Login (`/api/auth/login`)
* **Notes Management (CRUD):**
    * Create New Notes (`POST /api/notes`)
    * View All Notes for the Logged-in User (`GET /api/notes`)
    * View a Specific Note by ID (`GET /api/notes/{id}`)
    * Update Existing Notes (`PUT /api/notes/{id}`)
    * Delete Notes (`DELETE /api/notes/{id}`)
* **Basic User Interface:** A simple web page for interacting with the API (register, login, notes CRUD with inline editing).
* **Data Persistence:** Notes and user data are stored in a PostgreSQL database.
* **Spring Security:** Secure API endpoints requiring user authentication.

## Technologies Used

* **Backend:**
    * Java 17+
    * Spring Boot 3.x
    * Spring Data JPA
    * Spring Security
    * PostgreSQL
    * Lombok
* **Frontend:**
    * HTML5
    * CSS3
    * Vanilla JavaScript (ES6+)

## Prerequisites

Before you begin, ensure you have the following installed:

* **Java Development Kit (JDK) 17 or higher:**
    [Download OpenJDK](https://openjdk.java.net/install/index.html) or [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
* **Apache Maven:**
    [Download Maven](https://maven.apache.org/download.cgi)
* **PostgreSQL:**
    [Download PostgreSQL](https://www.postgresql.org/download/)
* A text editor or IDE (e.g., VS Code, IntelliJ IDEA)

## Setup and Installation

### Backend (Spring Boot)

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd notes-app
    ```
    *(Replace `<your-repository-url>` with the actual URL of your GitHub repository)*

2.  **Configure Database:**
    Open `src/main/resources/application.properties` and update the database connection details:

    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/notesdb # Ensure 'notesdb' is your database name
    spring.datasource.username=your_db_username
    spring.datasource.password=your_db_password
    spring.jpa.hibernate.ddl-auto=update # Automatically update schema (useful for development)
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.format_sql=true
    ```
    *Replace `your_db_username` and `your_db_password` with your PostgreSQL credentials.*

3.  **Build and Run the Backend:**
    Navigate to the `notes-app` directory in your terminal and run:
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend API will start on `http://localhost:8080`.

### Database (PostgreSQL)

1.  **Create the Database:**
    Open your PostgreSQL client (e.g., `psql` in terminal, pgAdmin, DBeaver) and create a database named `notesdb` (or whatever you configured in `application.properties`):
    ```sql
    CREATE DATABASE notesdb;
    ```
    The tables (`users` and `notes`) will be automatically created by Hibernate when the Spring Boot application starts, due to `spring.jpa.hibernate.ddl-auto=update`.

### Frontend (HTML/CSS/JS)

The frontend files (`index.html` and `script.js`) are served directly by the Spring Boot application as static resources.

1.  **Place the Frontend Files:**
    Ensure `index.html` and `script.js` are located in the `src/main/resources/static/` directory within your Spring Boot project structure:

    ```
    notes-app/
    ├── src/
    │   ├── main/
    │   │   ├── java/
    │   │   │   └── com/notesapp/notesapp/
    │   │   │       └── ... (Your Java code)
    │   │   └── resources/
    │   │       ├── application.properties
    │   │       └── static/
    │   │           ├── index.html      # Your main HTML page
    │   │           └── script.js       # Your JavaScript logic
    └── ...
    ```

## Usage

1.  **Start the Backend:** Make sure your Spring Boot application is running (`./mvnw spring-boot:run`).
2.  **Access the Frontend:** Open your web browser and navigate to `http://localhost:8080/`.

You will see the Notes Application interface:

* **Register:** Create a new user account.
* **Login:** Log in with your registered credentials.
* **Notes Management:** After logging in, you can:
    * **Create:** Add new notes with a title and content.
    * **Read:** View your list of notes.
    * **Update:** Click "Edit" on a note, modify the title/content in the inline fields, and click "Save".
    * **Delete:** Click "Delete" to remove a note.
* **Logout:** Click the "Logout" button to clear your session (note: current session state is lost on page refresh).

## Authentication Note

This application currently uses **HTTP Basic Authentication**. This means your username and password are saved in plain JavaScript variables in the frontend while you are logged in.

**Important for Production:** For a real-world application, this is **not secure**. You should implement **JSON Web Token (JWT) authentication** to ensure persistent, secure sessions where credentials are exchanged for a token, which is then used for subsequent authenticated requests.

## Future Enhancements

* **JWT Authentication:** Implement JWT for secure and persistent user sessions.
* **Improved UI/UX:** Enhance the user interface with a modern framework (e.g., React, Vue, Angular) or a CSS framework (e.g., Bootstrap, Tailwind CSS).
* **Form Validation:** Add client-side and server-side validation for inputs.
* **Error Handling:** More user-friendly error messages and feedback.
* **Pagination/Search:** For large numbers of notes.
* **User Roles:** If different types of users are needed.

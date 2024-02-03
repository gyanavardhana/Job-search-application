# Job Search Application

## Overview

Job Search Platform is a web application designed to help users find their dream jobs and assist recruiters in finding the best talent. It offers features such as browsing job listings, applying for jobs, managing applications, and posting job openings with detailed descriptions and PDFs.

## Installation and Getting Started

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB installed and running locally or a MongoDB cluster link

### Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/gyanavardhana/Job-search-application.git
    ```

2. Navigate to the cloned folder:

    ```bash
    cd Job-search-application
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Open `.env` and replace the MongoDB connection string with your own.

5. Start the server:

    ```bash
    npm run dev
    ```

6. Visit [http://localhost:3000/](http://localhost:3000/) in your web browser.


## Features

- **User Authentication**
  - Easy signup and login for candidates and recruiters.
  - Secure authentication using Passport and JWT (JSON Web Tokens).

- **Candidate Features**
  - Browse a wide range of job listings.
  - Apply for jobs with ease.
  - Track application status.
  - Receive alerts for relevant job openings.

- **Recruiter Features**
  - Post jobs with detailed descriptions and PDFs.
  - Manage applications and track progress.

## Tools Used

- **MongoDB**: A NoSQL database used for storing user data, job listings, and application information.
- **Express.js**: A web application framework for Node.js used for handling routes, requests, and responses.
- **Node.js**: A JavaScript runtime environment used for building scalable and fast server-side applications.
- **EJS (Embedded JavaScript)**: A templating language used for generating HTML markup with JavaScript.
- **npm**: The package manager for JavaScript used for installing and managing project dependencies.
- **Tailwind CSS**: A utility-first CSS framework used for styling the application's user interface.

## Project Structure:
    |-- gyanavardhana/
    |-- Job-Search-Application/
        |-- controllers/
            |-- candidate.js
            |-- recruiter.js
        |-- models/
            |-- candidatemodel.js
            |-- recruitermodel.js
            |-- jobsmodel.js
        |-- DB/
            |-- databaseconnection.js
        |-- routes/
            |-- candidateauth.js
            |-- recruiterauth.js
        |-- views/
            |-- Home.ejs
            |-- AppliedJobs.ejs
            |-- candidatejobs.ejs
            |-- candidateprofile.ejs
            |-- contact.ejs
            |-- login.ejs
            |-- pdf-viewer.ejs
            |-- postjob.ejs
            |-- profile.ejs
            |-- recruiterhome.ejs
            |-- signup.ejs
            |-- styles.css
        |-- public/
            |-- all images
            |-- output.css
        |-- .env
        |-- .gitignore
        |-- app.js
        |-- readme.md
        |-- constants.js
        |-- package-lock.json
        |-- package.json
        |-- passport-config.js
        |-- tailwind.config.js








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
    
- **Alerts for User Guidance**:
  - The application implements alert mechanisms to provide guidance and feedback to users.
  - Alerts are triggered in various scenarios such as successful login, failed login attempts, successful job application, etc.
  - These alerts are designed to provide users with instant feedback about their actions and the status of their interactions with the application.
  - They are displayed prominently on the user interface, ensuring that users are aware of important events and actions.
  - The alerts are designed to be user-friendly, informative, and visually appealing, enhancing the overall user experience of the application.

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


# Features:
- ### Home Page:
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/1d3dc945-4544-40a8-88e5-2773746729d1)

- ### Signup as Recruiter & Candidate:
- Recruiter
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/8684cf01-8362-4e5d-8498-5d6a01496eb7)
- Candidate
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/c17c94ae-627a-4ad1-b65c-90544d1dcf81)
  
- ### Login as Recruiter & Candidate:
- Recruiter
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/6026816a-13f7-44ec-ba33-274ccd16e3f9)
- Candidate
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/c87cb814-ecf2-4bf2-93a8-a13146c39ab5)

- ### Contact Page for Queries or Feature Requests:
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/63c3b1b9-3e4b-4ac9-9874-81dbce27e649)

- ### Recruiter Profile page:
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/754c5c6f-a6e1-4df2-ba9f-19cd7cf4a073)

- ### Recruiter JobPosting page:
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/423dbcb7-c983-40da-8fd1-49b78ea929b2)

- ### Recruiter Jobs page:
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/210c03c8-c09c-4069-87f5-64e8a2d539be)
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/d8a52911-a466-4662-950b-62ec0088e5aa)

- ### Recruiter Jobs MoreInfo page:
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/de5bbc90-e76f-40e1-b08d-4299a580b7b2)

- ### Candidate Profile page:
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/01d38113-b2c3-4150-98ec-732feabfeb02)

- ### Candidate Applyjob page:
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/947ff1ae-edb1-47d5-b0a8-f49f985b54ee)

- ### Candidate Applied jobs page:
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/f1675e27-74a0-4693-946e-ce3c0ab84a4b)

- ### Logout Feature for Recruiter & Candidate:
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/01bef59f-221a-4f6d-91a7-7d86379936e7)
  ![image](https://github.com/gyanavardhana/Job-search-application/assets/89439095/342323b4-76d9-46a8-a3b8-744ac64854d3)



# Project Info:

- Codebase: https://github.com/gyanavardhana/Job-search-application.git

# Contributors:
We made a small project we appreciate any changes, suggestion and issues from your side and feel free to raise an issue and pull something useful we appreciate the effort

# Contact:
- mail: gyanavardhanmamidisetti@gmail.com
- github usernames: gyanavardhana

***This is a Project which gives a basic usage demo of Express,Mongodb,Mongoose,ejs,tailwind css,clientside and serverside javascript***








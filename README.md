# 📘 StudyNotion - Online Learning Platform

Welcome to **StudyNotion**, a full-stack EdTech web application built to offer a seamless learning experience for both students and instructors. This platform allows users to create, manage, and enroll in online courses with a modern and responsive UI.

🔗 **Live Demo:** [studynotion-studyplatform.vercel.app](https://studynotion-7zqv.vercel.app)

## 🚀 Features

### ✅ For Students
- Browse and purchase courses through many categories from catalog
- Watch course videos with a secure streaming system
- Track progress through course content
- Leave ratings and reviews for courses

### ✅ For Instructors
- Create and manage courses and lectures
- Upload videos and course materials
- Analyze student engagement with dashboard analytics

### ✅ Authentication
- Login and register with JWT-based authentication
- Forgot password and email verification system

### ✅ Admin Panel
- Admin can create,change and Delete the category
- Manage users, courses, and analytics
- View system-wide statistics

---
## 🧩 Feature Matrix

| Feature              | Student ✅ | Instructor ✅ | Admin ✅ |
|----------------------|------------|----------------|----------|
| Browse Courses       | ✅         | ✅             | ✅       |
| Enroll in Course     | ✅         | ❌             | ❌       |
| Add review in Course | ✅         | ❌             | ❌       |
|Create/Delete/Edit Courses| ❌         | ✅             | ❌       |
|See enrolled students and earned money| ❌         | ✅             | ❌       |
| Upload Content       | ❌         | ✅             | ❌       |
| View Platform Stats  | ❌         | ❌             | ✅       |
| Manage Users         | ❌         | ❌             | ✅       |
| Create Category      | ❌         | ❌             | ✅       |

---
## 🧩 Frontend Overview

The **frontend** of StudyNotion is designed to deliver a responsive, modern, and user-friendly experience for students, instructors, and (future) admins. Built using **React.js**, styled with **Tailwind CSS**, and powered by **Redux Toolkit**, the UI offers seamless navigation and interactivity across all roles.

### 👨‍🎓 Student Experience

- **Homepage**: Introduction to the platform with featured courses and navigation links.
- **Course List**: Displays all available courses along with ratings, instructors, and tags.
- **Course Details Page**: Detailed course view with description, pricing, and review system.
- **Wishlist**: Allows students to save their favorite courses for future access.
- **Cart & Checkout**: Enables adding courses to the cart and securely purchasing them via Razorpay.
- **Course Player**: Post-purchase access to video content and additional materials.
- **Dashboard**: View enrolled courses, progress tracking, and personal learning data.
- **Profile Settings**: Update user information including name, email, and password.

### 👨‍🏫 Instructor Experience

- **Dashboard**: Overview of course stats, ratings, and enrollments.
- **Create Course**: Add new course details including title, description, pricing, and tags.
- **Course Builder**: Upload and manage video lectures, PDFs, and lessons module-wise.
- **Edit Course**: Update existing course details and manage modules.
- **Instructor Profile**: Edit personal and professional details.

### 🧑‍💼 Admin Panel 

- **Admin Dashboard**: Platform-wide analytics including total courses, users, and revenue.
- **User Management**: View and manage students and instructors.
- **Course & category Management**: Create,edit and delete the category and Monitor all courses content.
- **Reports & Metrics**: Access insights about traffic, sales, and engagement.

### 🧰 Technologies Used (Frontend)

- **React.js** – For building interactive UIs
- **Tailwind CSS** – For utility-first styling and responsiveness
- **Redux Toolkit** – For application-level state management
- **React Router DOM** – For navigation and routing
- **Axios** – For secure API interactions

---

## 🛠 Backend Overview

The **backend** of StudyNotion is a monolithic Node.js application built using **Express.js**. It provides secure APIs for authentication, course operations, payments, and media handling. Data is stored in a cloud-hosted **MongoDB Atlas** database, while **MongoDB Compass** is used as a GUI tool for schema inspection, testing, and debugging.

### 🔐 Authentication & Authorization

- **JWT-based authentication** for secure login and registration
- **Role-based access** for students, instructors, and admins
- **Email verification** via OTP using Nodemailer
- **Password reset** with secure tokenized links

### 📚 Course Management Features

- **Instructor CRUD** operations for course creation, update, and deletion
- **Course Content Upload** (videos, Images, etc.) through a modular course builder
- **Students** can enroll, review, and track course progress
- **Ratings & Reviews** system to improve feedback quality

### 💳 Payment Integration

- Integrated with **Razorpay** for real-time, secure payment processing
- Supports cart management and post-payment access authorization

### ☁️ Cloud-Based Media Handling

- Uses **Cloudinary** to upload, optimize, and deliver:
  - Course thumbnails
  - Lecture videos
  - Instructor/student profile images
- Cloud delivery improves performance and saves bandwidth

### 📑 Markdown Support

- Text-based course content supports **Markdown formatting**
- Enables clean, readable formatting for lessons and notes

### 🔧 Technologies Used (Backend)

- **Node.js** – JavaScript runtime for scalable backend services
- **Express.js** – Web application framework with RESTful support
- **MongoDB** – Flexible NoSQL database for storing user and course data
- **Mongoose** – Object Data Modeling (ODM) tool for MongoDB
- **JWT** – For token-based authentication and route protection
- **Bcrypt.js** – For secure password encryption
- **Nodemailer** – To handle emails like verification and password reset
- **Razorpay** – For seamless checkout and payment tracking
- **Cloudinary** – For media storage and optimization


---

## 🧩 Architecture Diagram
- here is a Architecture diagram for better understanding :-
![20250624_1158_image](https://github.com/user-attachments/assets/b2429d3e-acc9-45f8-9b18-0daf00f7d906)
  

---
## Models And Schema
![Screenshot 2025-06-25 230207](https://github.com/user-attachments/assets/dfdeff95-ec7e-4775-a565-a49e807c116f)


---

## 📡 API Routes

This section provides a complete list of RESTful API endpoints used in the StudyNotion platform, categorized by modules and their functionality.


### 🔐 Authentication Routes

| **Endpoint**        | **API Path**                        | **Description**                           |
|---------------------|-------------------------------------|-------------------------------------------|
| Send OTP            | `api/v1/auth/sendotp`               | Send OTP to email for verification        |
| Signup              | `api/v1/auth/signup`                | Register a new user                       |
| Login               | `api/v1/auth/login`                 | Authenticate and login user               |
| Reset Password Token| `api/v1/auth/reset-password-token`  | Generate token to reset password          |
| Reset Password      | `api/v1/auth/reset-password`        | Reset password using token                |
| Change Password     | `api/v1/auth/changepassword`        | Change current password                   |



### 👤 Profile Routes

| **Endpoint**            | **API Path**                           | **Description**                              |
|-------------------------|----------------------------------------|----------------------------------------------|
| Get User Details        | `api/v1/profile/getUserDetails`        | Fetch logged-in user's profile info          |
| Get Enrolled Courses    | `api/v1/profile/getEnrolledCourses`    | Get list of courses the user is enrolled in  |
| Get Instructor Dashboard| `api/v1/profile/instructorDashboard`   | Fetch insights and stats for instructors     |



### 🎓 Student Routes

| **Endpoint**                | **API Path**                            | **Description**                                  |
|-----------------------------|-----------------------------------------|--------------------------------------------------|
| Capture Payment             | `api/v1/payment/capturePayment`         | Initiate course purchase/payment                 |
| Verify Payment              | `api/v1/payment/verifyPayment`          | Confirm payment and enroll user                  |
| Send Payment Success Email  | `api/v1/payment/sendPaymentSuccessEmail`| Send confirmation email after successful payment |



### 📚 Course Management Routes

| **Endpoint**                    | **API Path**                               | **Description**                                  |
|----------------------------------|--------------------------------------------|--------------------------------------------------|
| Get All Courses                 | `api/v1/course/getAllCourses`              | List all published courses                       |
| Get Course Details              | `api/v1/course/getCourseDetails`           | Fetch public course information                  |
| Edit Course                     | `api/v1/course/editCourse`                 | Modify course details                            |
| Show All Categories             | `api/v1/course/showAllCategories`          | Get all course categories                        |
| Create Course                   | `api/v1/course/createCourse`               | Add a new course                                 |
| Add Section                     | `api/v1/course/addSection`                 | Add a section to a course                        |
| Add Subsection                  | `api/v1/course/addSubSection`              | Add a subsection under a section                 |
| Update Section                  | `api/v1/course/updateSection`              | Modify existing section                          |
| Update Subsection               | `api/v1/course/updateSubSection`           | Modify subsection content                        |
| Get Instructor Courses          | `api/v1/course/getInstructorCourses`       | View all courses created by logged-in instructor |
| Delete Section                  | `api/v1/course/deleteSection`              | Remove a section from course                     |
| Delete Subsection               | `api/v1/course/deleteSubSection`           | Remove a subsection                              |
| Delete Course                   | `api/v1/course/deleteCourse`               | Delete entire course                             |
| Get Authenticated Course Detail | `api/v1/course/getFullCourseDetails`       | Get full data for enrolled course                |
| Mark Lecture Completion         | `api/v1/course/updateCourseProgress`       | Track progress for video lessons                 |
| Create Rating                   | `api/v1/course/createRating`               | Post a review and star rating                    |


### 🌟 Ratings & Reviews

| **Endpoint**     | **API Path**                   | **Description**                  |
|------------------|--------------------------------|----------------------------------|
| Get Reviews      | `api/v1/course/getReviews`     | Fetch reviews for all courses   |


### 🗂 Course Categories

| **Endpoint**     | **API Path**                        | **Description**                     |
|------------------|-------------------------------------|-------------------------------------|
| Show Categories  | `api/v1/course/showAllCategories`   | List all available categories       |


### 📖 Catalog Page

| **Endpoint**         | **API Path**                                  | **Description**                              |
|----------------------|-----------------------------------------------|----------------------------------------------|
| Get Category Details | `api/v1/course/getCategoryPageDetails`        | Fetch all courses from a specific category   |


### 📬 Contact Us

| **Endpoint**   | **API Path**               | **Description**                    |
|----------------|----------------------------|------------------------------------|
| Contact Us     | `api/v1/reach/contact`     | Submit contact or support request |


### ⚙️ User Settings

| **Endpoint**            | **API Path**                           | **Description**                          |
|-------------------------|----------------------------------------|------------------------------------------|
| Update Display Picture  | `api/v1/profile/updateDisplayPicture`  | Upload or change profile picture         |
| Update Profile Info     | `api/v1/profile/updateProfile`         | Edit name, bio, or account info          |
| Delete Profile          | `api/v1/profile/deleteProfile`         | Permanently remove user account          |

## 📌 Notes

- All routes follow the base URL: `https://your-backend-domain.com/api/v1/...`
- Most endpoints require JWT-based **authorization headers**
- Instructor/Admin endpoints require **role-based access**



---



## 📁 Project Structure

```bash
Studynotion/
│
├── client/               # React Frontend  
│   └── src/  
│       ├── components/   # Reusable UI components  
│       ├── pages/        # Route-based pages  
│       ├── redux/        # State management files  
│       ├── .env          # Environment variables
│       └── ...  
│
├── server/               # Express Backend  
│   ├── controllers/      # Request handlers  
│   ├── models/           # Mongoose schemas  
│   ├── routes/           # API route handlers  
│   ├── utils/            # Helper utilities  
│   ├── middlewares/      # Custom middleware  
|   └── .env              # Environment variables  
│
├── README.md             # Project overview and documentation  
├── package.json          # NPM package configuration (root/backend)  
└── client/package.json   # NPM package configuration (frontend)  
```


---
## 🤝 Collaboration & Local Setup Guide

To contribute or run this project locally, follow the steps below to set up the development environment on your machine.


### 🔧 Prerequisites

Make sure you have the following installed:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

### 📥 Cloning the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/Premal007/Studynotion.git
cd Studynotion
```
---
### 📦 Installation
```bash
# Install frontend dependencies
cd Studynotion/Studynotion
npm install

# Install backend dependencies
cd ../server2
npm install
```
---
### 🔐 Environment Variables Setup
📁 Frontend (/Studynotion/.env)
Create a .env file in the client/ folder and add:
```bash
VITE_BASE_URL=http://localhost:3000
VITE_API_URL=http://localhost:4000/api/v1
VITE_PORT = 3000
```

📁 Backend (/server2/.env)
Create a .env file in the server/ folder and add:
```bash
PORT=4000
MONGODB_URL=your_mongodb_atlas_url

JWT_SECRET=your_jwt_secret_key

MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_app_password

RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY
RAZORPAY_SECRET=YOUR_RAZORPAY_SECRET

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:3000
FOLDER_NAME= your foldername
```

---

### 🏃‍♂️ Running the Project
Start both the frontend and backend servers:

#### Terminal 1 - Start Backend
```bash
cd server2
npm run dev
```

#### Terminal 2 - Start Frontend
```bash
cd Studynotion
npm start
```

#### Then, open your browser and navigate to:
```bash
http://localhost:3000
```

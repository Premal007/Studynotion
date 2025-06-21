import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useState,useEffect } from 'react'
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar.jsx"
import OpenRoute from "./components/core/Auth/OpenRoute"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from "./pages/VerifyEmail"
import About from './pages/About.jsx'
import PrivateRoute from './components/core/Auth/PrivateRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MyProfile from './components/core/Dashboard/MyProfile.jsx'
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses.jsx'
import Cart from './components/core/Dashboard/Cart/index.jsx'
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from 'react-redux'
import Catalog from './pages/Catalog.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import ViewCourse from './pages/ViewCourse.jsx'
import VideoDetails from './components/core/ViewCourse/VideoDetails.jsx'
import BackToTop from "./components/common/BackToTop.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx"
import Rateus from './pages/Rateus.jsx'
import TermsAndConditions from "./pages/TermsAndConditions";
// import Loading from "./components/common/Loading";
import Loading from "./components/common/Loading";
import Error from "./pages/Error";

import Project from "./pages/Project";
import Chatbot from "./pages/Chatbot";
import Contact from "./pages/Contact";

import CreateCategory from "./components/core/Dashboard/CreateCategory";
import AllStudents from './components/core/Dashboard/AllStudents.jsx'
import AllInstructors from './components/core/Dashboard/AllInstructors.jsx'


function App() {
  const { user } = useSelector((state) => state.profile);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading time for demonstration
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the time as needed
  }, []);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar></Navbar>
      
      <BackToTop/>

      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/project" element={<Project />} />
        <Route path="/rateus" element={<Rateus />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/termsandconditions" element={<TermsAndConditions />} />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings />} />





          {user?.accountType === ACCOUNT_TYPE.ADMIN && (
            <>
              <Route path="dashboard/create-category" element={<CreateCategory />} />
              <Route path="dashboard/all-students" element={<AllStudents />} />
              <Route path="dashboard/all-instructors" element={<AllInstructors />} />
            </>
          )}





          {/* <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              /> */}

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
            </>
          )}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        </Route>

        <Route element={
          <PrivateRoute>
            <ViewCourse />
          </PrivateRoute>
        }>

        {
          user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
            <Route 
              path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />}
            />
            </>
          )
        }

        </Route>
        <Route path="*" element={<Error />} />        

      </Routes>

      {/* <Chatbot/> */}
    </div>
  )
}

export default App



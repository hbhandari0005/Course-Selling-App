import { useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Courses from "./components/Courses";
import Signup from "./components/Signup";
import About from "./components/About";
import ShowCourses from "./components/ShowCourses";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Payment from "./components/Payment";
import UserCourses from "./components/UserCourses";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import CreateCourse from "./components/CreateCourse";
import MyCourses from "./components/MyCourses";

function App() {
  let { courseId, userId } = useParams();
  const [allCourses, setAllCourses] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({});
 useEffect(() => {
  const getData = async () => {
    try {
      const response = await axios.get("https://harshit-course-selling-mern.onrender.com/courses");
      if(response.data){
        setAllCourses(response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }

    const userAtLocalStorage = localStorage.getItem("user");
    if (userAtLocalStorage) {
      const parsedUser = JSON.parse(userAtLocalStorage);
      setLogin(true);
      setUser(parsedUser);
    }
  };

  getData();
}, [refresh]);

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Navbar
          login={login}
          setLogin={setLogin}
          user={user}
          setUser={setUser}
        />
        <main className="main flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={<Login setLogin={setLogin} setUser={setUser} />}
            />
            <Route
              path="/courses"
              element={
                <Courses allCourses={allCourses} user={user} login={login} />
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/aboutus" element={<About />} />
            <Route
              path="/:userId/courses"
              element={<UserCourses login={login} />}
            />
            <Route
              path="/courses"
              element={<ShowCourses courses={allCourses} />}
            />
            <Route
              path="/myCourse"
              element={<MyCourses refresh={refresh} setRefresh={setRefresh} />}
            />
            <Route
              path="/createCourse"
              element={<CreateCourse setRefresh={setRefresh} />}
            />
            <Route
              path="/buy/:courseId"
              element={
                <Payment courses={allCourses} user={user} login={login} />
              }
            />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          toastClassName="toast-class"
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    </>
  );
}

export default App;

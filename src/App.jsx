import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Events from "./pages/Events/Events";
import EventDetail from "./pages/EventDetail/EventDetail";
import AddEvent from "./pages/AddEvent/AddEvent";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route
          path="/addevent"
          element={
            <ProtectedRoute>
              <AddEvent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import "./App.css";
import AddContact from "./components/AddContact";
import ContactsList from "./components/ContactsList";
import Nav from "./components/Nav";
import OTPVerification from "./components/OTPVerification";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import { Routes, Route } from "react-router-dom";
import Protected from "./utils/Protected";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/add" element={<Protected Component={AddContact} />} />
        <Route path="/contacts" element={<Protected Component={ContactsList} />} />
        <Route path="/verify" element={<OTPVerification />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;

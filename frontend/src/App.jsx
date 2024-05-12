import "./App.css";
import AddContact from "./components/AddContact";
import ContactsList from "./components/ContactsList";
import Signin from "./components/Signin";
import Signup from "./components/Signup";

function App() {
  return (
    <>
      <Signup />
      <Signin />
      <AddContact />
      <ContactsList />
    </>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signin from './components/registration/signin/Signin'
import Signup from './components/registration/signup/Signup'
import Dashboard from './components/dashboard/Dashboard'
import Chat from './components/chat/Chat'

function App() {

  const userId = localStorage.getItem("userId");

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Signup />} />

        
        <Route
          path="/dashboard"
          element={userId ? <Dashboard /> : <Navigate to="/signin" />}
        />
        <Route
          path="/chat"
          element={userId ? <Chat /> : <Navigate to="/signin" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

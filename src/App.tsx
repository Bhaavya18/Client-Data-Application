import React from "react";
import { Routes, Route } from "react-router-dom";
import Form from "./components/Form/Form";
import { Home } from "./components/Home/Home";
import { Login } from "./components/Login/Login";
import { UserContextProvider } from "./context/AuthContext";
import { ProtectedRoutes } from "./components/ProtectedRoutes/ProtectedRoutes";
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/create/"
          element={
            <ProtectedRoutes>
              <Form isDisabled={false} />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/view/:id"
          element={
            <ProtectedRoutes>
              <Form isDisabled={true} />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </UserContextProvider>
  );
}

export default App;

/*
Authentication: https://www.youtube.com/watch?v=x62aBvnRCKw
*/

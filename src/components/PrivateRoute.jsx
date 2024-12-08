import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase"; // Ensure your Firebase Auth is correctly configured

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;

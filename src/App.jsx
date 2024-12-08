import React, { useState, useEffect } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { auth } from './firebase/firebase';
import Home from './pages/Home'
import About from './pages/About'
import Homepage from './pages/landingpages/Homepage'
import Forums from './pages/landingpages/Forums'
import Settings from './pages/landingpages/Settings';
import PrivateRoute from './components/PrivateRoute';

function App(){

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/home" element={<PrivateRoute><Homepage user={user}/></PrivateRoute>}/>
          <Route path="/forums" element={ <PrivateRoute><Forums user={user}/></PrivateRoute>}/>
          <Route path="/settings" element={<PrivateRoute><Settings user={user}/></PrivateRoute>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App

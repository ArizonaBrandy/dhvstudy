import React, { useState, useEffect } from "react";
import styles from "./Settings.module.css"
import { useNavigate } from "react-router-dom";
import dhvsuimage from '../../assets/dhvstudypic.png';
import { auth, db } from "../../firebase/firebase";

function Settings({user}){

    console.log(user);

    const [inProfile, setInProfile] = useState(false);
    const [inDashboard, setInDashboard] = useState(false);
    const [inSettings, setInSettings] = useState(false);

    const navigate = useNavigate();

    const handleInProfile = () => {
        setInProfile(true);
        setInDashboard(false);
        setInSettings(false);
    }

    const handleInDashboard = () => {
        setInDashboard(true);
        setInProfile(false);
        setInSettings(false);
    }

    const handleInSettings = () => {
        setInSettings(true);
        setInDashboard(false);
        setInProfile(false);
    }

    const handleSignOut = async () => {
        try {
          await auth.signOut();
          console.log("User signed out successfully.");
          navigate("/home"); // Redirect the user to the home page or login page
        } catch (error) {
          console.error("Error signing out:", error);
        }
    };
      
    return(
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span style={{fontSize: '2rem', color: '#9b3e01'}}>DHVSTUDY</span>
                    <img src={dhvsuimage} alt="" className={styles.dhvsu} onClick={() => navigate("/home")}/>
                    <span style={{fontSize: '1rem', color: '#9b3e01', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigate("/forums")}>FORUMS</span>
                </div>
                <div className={styles.middle}>
                    <div className={styles.middleContainer}>
                        <div className={styles.leftCard}>
                            <div className={styles.cardBox}>
                                <span
                                    className={`${inProfile ? styles.isActive : ""}`}
                                    onClick={handleInProfile}
                                >
                                    Profile
                                </span>
                                <span
                                    className={`${inDashboard ? styles.isActive : ""}`}
                                    onClick={handleInDashboard}
                                >
                                    Dashboard
                                </span>
                                <span
                                    className={`${inSettings ? styles.isActive : ""}`}
                                    onClick={handleInSettings}
                                >
                                    Settings
                                </span>
                            </div>
                        </div>
                        <div className={styles.rightCard}>
                            {inProfile && <div className={styles.profile}>Profile</div>}
                            {inDashboard && <div className={styles.dashboard}>Dashboard</div>}
                            {inSettings && 
                            <div className={styles.settings}>
                                <div className={styles.logoutHolder}>
                                    <div className={styles.logoutButton} onClick={handleSignOut}>Sign out</div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default Settings;
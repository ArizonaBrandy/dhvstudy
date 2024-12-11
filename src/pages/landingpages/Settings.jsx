import React, { useState, useEffect } from "react";
import styles from "./Settings.module.css";
import { useNavigate } from "react-router-dom";
import dhvsuimage from '../../assets/dhvstudypic.png';
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import defaultPicture from '../../assets/defaultProfile.jpg';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import DarkMode from "../../components/DarkMode";

function Settings({ user }) {
    const [inProfile, setInProfile] = useState(false);
    const [inDashboard, setInDashboard] = useState(false);
    const [inSettings, setInSettings] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isEditing, setIsEditing] = useState({ username: false, about: false });
    const [editValues, setEditValues] = useState({ username: "", about: "" });
    const [selectedImage, setSelectedImage] = useState(null);
    
    const currentDate = new Date();

    const handleDateChange = (newDate) => {
        setDate(newDate); 
    };

    useEffect(() => {
        if (user?.uid) {
            const fetchUserData = async () => {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const data = userDocSnap.data();
                        setCurrentUser({
                            id: user.uid,
                            ...data,
                        });
                        setEditValues({
                            username: data.username || "",
                            about: data.about || "",
                        });
                    } else {
                        console.log("User document does not exist.");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchUserData();
        }
    }, [user?.uid]);

    const navigate = useNavigate();

    const handleInProfile = () => {
        setInProfile(true);
        setInDashboard(false);
        setInSettings(false);
    };

    const handleInDashboard = () => {
        setInDashboard(true);
        setInProfile(false);
        setInSettings(false);
    };

    const handleInSettings = () => {
        setInSettings(true);
        setInDashboard(false);
        setInProfile(false);
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            console.log("User signed out successfully.");
            navigate("/home");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleEditToggle = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleInputChange = (field, value) => {
        setEditValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async (field) => {
        try {
            const userDocRef = doc(db, "users", currentUser.id);
            await updateDoc(userDocRef, {
                [field]: editValues[field],
            });
            setCurrentUser((prev) => ({ ...prev, [field]: editValues[field] }));
            setIsEditing((prev) => ({ ...prev, [field]: false }));
            console.log(`${field} updated successfully!`);
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result; // This is the base64 string
                try {
                    // Update Firestore with the base64 image
                    const userDocRef = doc(db, "users", user.uid);
                    await updateDoc(userDocRef, { profileImage: base64Image });
                    setCurrentUser((prev) => ({ ...prev, profileImage: base64Image }));
                    console.log("Profile image updated successfully!");
                } catch (error) {
                    console.error("Error uploading image:", error);
                }
            };
            reader.readAsDataURL(file); // Convert file to base64
        }
    };    

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span style={{ fontSize: '2rem', color: 'var(--body_color)' , cursor: "pointer"}} onClick={() => navigate("/settings")}>DHVSTUDY</span>
                    <img src={dhvsuimage} alt="" className={styles.dhvsu} onClick={() => navigate("/home")} />
                    <span style={{ fontSize: '1rem', color: 'var(--body_color)', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate("/forums")}>FORUMS</span>
                </div>
                <div className={styles.middle}>
                    <div className={styles.middleContainer}>
                        <div className={styles.leftCard}>
                            <div className={styles.cardBox}>
                                <span className={`${inProfile ? styles.isActive : ""}`} onClick={handleInProfile}>Profile</span>
                                <span className={`${inDashboard ? styles.isActive : ""}`} onClick={handleInDashboard}>Dashboard</span>
                                <span className={`${inSettings ? styles.isActive : ""}`} onClick={handleInSettings}>Settings</span>
                            </div>
                        </div>
                        <div className={styles.rightCard}>
                            {inProfile &&
                                <div className={styles.profileCard}>
                                    <div className={styles.profileImageSection}>
                                        <img 
                                            src={
                                                currentUser?.profileImage
                                                    ? currentUser.profileImage 
                                                    : defaultPicture
                                            }
                                            alt="Profile"
                                            className={styles.profileImage} 
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: "none" }}
                                            id="profileImageInput"
                                        />
                                        <label htmlFor="profileImageInput" className={styles.profileImageButton}>
                                            Update Profile Picture
                                        </label>
                                    </div>
                                    <div className={styles.profileDetailsSection}>
                                        {currentUser && (
                                            <>
                                                {/* Username Section */}
                                                <span>Display Name</span>
                                                <div className={styles.textHolder}>
                                                    {isEditing.username ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                value={editValues.username}
                                                                maxLength={25}
                                                                onChange={(e) => handleInputChange("username", e.target.value)}
                                                                className={styles.inputField}
                                                            />
                                                            <div className={styles.buttonHolder}>
                                                                <button className={styles.saveButton} onClick={() => handleSave("username")}>Save</button>
                                                                <button className={styles.cancelButton} onClick={() => handleEditToggle("username")}>Cancel</button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>{currentUser.username}</span>
                                                            <div className={styles.editButton} onClick={() => handleEditToggle("username")}>Edit</div>
                                                        </>
                                                    )}
                                                </div>
                                                {/* About Section */}
                                                <span>About</span>
                                                <div className={styles.textHolder}>
                                                    {isEditing.about ? (
                                                        <>
                                                            <textarea
                                                                value={editValues.about}
                                                                onChange={(e) => handleInputChange("about", e.target.value)}
                                                                className={styles.textareaField}
                                                            />
                                                            <div className={styles.buttonHolder}>
                                                                <button className={styles.saveButton} onClick={() => handleSave("about")}>Save</button>
                                                                <button className={styles.cancelButton} onClick={() => handleEditToggle("about")}>Cancel</button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>{currentUser.about}</span>
                                                            <div className={styles.editButton} onClick={() => handleEditToggle("about")}>Edit</div>
                                                        </>
                                                    )}
                                                </div>
                                                {/* Email Section */}
                                                <span>Email</span>
                                                <div className={styles.textHolder} style={{ marginBottom: '0' }}>
                                                    <span>{currentUser.email}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            }
                            {inDashboard && 
                                <>
                                    <div className={styles.dashboard}>
                                        <div className={styles.digitalClock}>
                                            <span>{(new Date().getHours() % 12 || 12).toString().padStart(2, '0')}</span>
                                            <span>{new Date().getMinutes().toString().padStart(2, '0')}</span>
                                            <span>{new Date().getHours() >= 12 ? 'P.M' : 'A.M'}</span>
                                        </div>
                                        <div className={styles.otherDetails}>
                                            <Calendar value={currentDate} />
                                            <div className={styles.timeSpentDisplay}>
                                                <span>Time Spent using DHVSTUDY</span>
                                                <div className={styles.timeHolder}>
                                                    <i className="fa-solid fa-clock"></i>
                                                    <span>
                                                        {`Created ${Math.floor((new Date() - new Date(currentUser.createdAt.toDate())) / (1000 * 60 * 60 * 24))} days ago`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                            {inSettings &&
                                <div className={styles.settings}>
                                    <div className={styles.logoutHolder}>
                                        <DarkMode/>
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

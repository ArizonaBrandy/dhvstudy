import styles from './Homepage.module.css';
import dhvsuimage from '../../assets/dhvstudypic.png';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/firebase';
import { doc, getDoc, collection, onSnapshot, query, orderBy, addDoc, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function Homepage({user}){

    const [currentUser, setCurrentUser] = useState(null);
    const [modalPlus, setModalPlus] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [roomPasscode, setRoomPasscode] = useState("");
    const [roomImage, setRoomImage] = useState("");
    const [fileName, setFileName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (user?.uid) {
            const fetchUserData = async () => {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setCurrentUser({
                            id: user.uid,
                            ...userDocSnap.data(),
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

    const handleCreateRoom = async () => {
        if (!roomName || !roomImage) {
            toast.warning("Please fill all fields")
            return;
        }

        try {
            const roomsCollection = collection(db, "rooms");
            const newRoomData = {
                roomName,
                roomPasscode,
                ownerId: user?.uid,
                roomImage, // This will be Base64 image
                roomMembers: [user?.uid],
                chats: [],
                createdAt: new Date(),
            };

            const docRef = await addDoc(roomsCollection, newRoomData);
            await updateDoc(doc(db, "rooms", docRef.id), {
                roomId: docRef.id,
            });

            alert("Room created successfully!");
            setRoomName("");
            setRoomPasscode("");
            setRoomImage("");
            setFileName("");
            setModalPlus(false);
            navigate(`/room?id=${docRef.id}`);
        } catch (error) {
            console.error("Error creating room:", error);
            alert("Failed to create room. Please try again.");
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name); // Set the file name
            const reader = new FileReader();
            reader.onload = () => {
                setRoomImage(reader.result); // Base64 string
            };
            reader.readAsDataURL(file); // Read the file as Data URL
        }
    };

    return(
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span style={{fontSize: '2rem', color: 'var(--body_color)', cursor: "pointer"}} onClick={() => navigate("/settings")}>DHVSTUDY</span>
                    <span style={{fontSize: '1rem', color: 'var(--body_color)', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigate("/forums")}>FORUMS</span>
                </div>
                <div className={styles.middle}>
                    <div className={styles.leftBox}>
                        <div className={styles.headerCard}>
                            <span style={{fontSize: '2.2rem', color: 'var(--body_color)'}}>PLACE TO STUDY AND MEETING FOR EVERYONE</span>
                            <span>connect, collaborate, and learn with DHVSTUDY</span>
                        </div>
                        <div className={styles.buttonHolder2}>
                            <div className={styles.createButton2} onClick={() => setModalPlus(true)}>create room</div>
                            <div className={styles.roomsButton} onClick={() => navigate("/rooms")}>rooms</div>
                        </div>
                    </div>
                    <img src={dhvsuimage} alt="Image" className={styles.rightBox} />
                </div>
                <div className={styles.footer}>
                    <span style={{cursor:"pointer"}} onClick={() => {navigate("/about")}}>About us</span>
                    <span>Copyright ©2024 . Designed by GR1</span>
                </div>
                {modalPlus && (
                    <div className={styles.plusModal}>
                        <div className={styles.modalContent}>
                            <div className={styles.headerModal}>CREATE YOUR ROOM</div>
                            <div className={styles.uploadImageHolder}>
                                <div className={styles.bothHolder}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="roomImageUpload"
                                        onChange={handleFileUpload}
                                    />
                                    <label htmlFor="roomImageUpload" className={styles.uploadLabel}>
                                        <i className="fa-solid fa-camera"></i>
                                        <span>UPLOAD ROOMS ICON</span>
                                    </label>
                                </div>
                                {fileName && <p className={styles.fileName}>{fileName}</p>}
                            </div>
                            <div className={styles.inputHolder}>
                                <span>ROOM'S NAME</span>
                                <input
                                    type="text"
                                    placeholder="What’s your room’s name going to be?"
                                    value={roomName}
                                    maxLength={30}
                                    onChange={(e) => setRoomName(e.target.value)}
                                />
                                <span>ROOM'S PASSCODE</span>
                                <input
                                    type="password"
                                    placeholder="Make it secure"
                                    pattern="[0-9]{4}"
                                    maxLength={4}
                                    value={roomPasscode}
                                    onChange={(e) => setRoomPasscode(e.target.value)}
                                />
                            </div>
                            <div className={styles.buttonHolder}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setModalPlus(false)}
                                >
                                    CANCEL
                                </button>
                                <button
                                    className={styles.createButton}
                                    onClick={handleCreateRoom}
                                >
                                    CREATE
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer/>
        </>
    );

}

export default Homepage;
import React, { useEffect, useState } from "react";
import styles from "./Rooms.module.css";
import dhvsuimage from '../../assets/dhvstudypic.png';
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, collection, onSnapshot, query, orderBy, addDoc, updateDoc } from "firebase/firestore";
import noImage from '../../assets/noImage.jpg';

function Rooms({user}){
    const [currentUser, setCurrentUser] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [modalPlus, setModalPlus] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [roomPasscode, setRoomPasscode] = useState("");
    const [roomImage, setRoomImage] = useState("");
    const [fileName, setFileName] = useState("");
    
    const navigate = useNavigate();

    console.log(rooms);

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

    useEffect(() => {
        const roomsRef = collection(db, "rooms");
        const roomsQuery = query(roomsRef, orderBy("createdAt", "desc")); // Order by 'createdAt' in descending order
        
        const unsubscribe = onSnapshot(roomsQuery, (snapshot) => {
            const fetchedRooms = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRooms(fetchedRooms);
        });
    
        return () => unsubscribe();
    }, []);
    

    const handleCreateRoom = async () => {
        if (!roomName || !roomPasscode || !roomImage) {
            alert("Please fill in all fields!");
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
                <div className={styles.plusHolder}>
                    <i className="fa-solid fa-plus" onClick={() => setModalPlus(true)}></i>
                </div>
                <div className={styles.header}>
                    <span
                        style={{ fontSize: '2rem', color: '#9b3e01', cursor: 'pointer' }}
                        onClick={() => navigate('/settings')}
                    >
                        DHVSTUDY
                    </span>
                    <img
                        src={dhvsuimage}
                        alt="Dhvstudy"
                        className={styles.dhvsu}
                        onClick={() => navigate('/home')}
                    />
                    <span
                        style={{ fontSize: '1rem', color: '#9b3e01', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => navigate('/forums')}
                    >
                        FORUMS
                    </span>
                </div>
                <div className={styles.middle}>
                    {rooms.map((room) => (
                        <div 
                            key={room.id} 
                            className={styles.roomCard} 
                            onClick={() => navigate(`/room?id=${room.id}`)} 
                        >
                            <img 
                                src={room.roomImage || noImage} 
                                alt={room.roomName} 
                                className={styles.roomImage} 
                            />
                            <div className={styles.textHolder}>
                                <span>{room.roomName}</span>
                            </div>
                        </div>
                    ))}
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
        </>
    );

}

export default Rooms;
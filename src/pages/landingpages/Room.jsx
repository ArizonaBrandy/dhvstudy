import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, onSnapshot, updateDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import styles from "./Room.module.css";
import defaultProfile from "../../assets/defaultProfile.jpg";
import { toast } from "react-toastify";

function Room({ user }) {
    const [roomId, setRoomId] = useState("");
    const [roomName, setRoomName] = useState("");
    const [isRoomSecure, setIsRoomSecure] = useState(false);
    const [requireAccessToken, setRequireAccessToken] = useState(false);
    const [isUserOwner, setIsUserOwner] = useState(false);
    const [roomMembers, setRoomMembers] = useState([]);
    const [passcodeInput, setPasscodeInput] = useState("");
    const [hasAccess, setHasAccess] = useState(false);
    const [chatMode, setChatMode] = useState(false);
    const [chats, setChats] = useState([]); 
    const [chatInputValue, setChatInputValue] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

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

    // If owner deletes room, redirect to homepage
    useEffect(() => {
        if (!roomId) return;

        const roomDocRef = doc(db, "rooms", roomId);

        // Listen for room deletion
        const unsubscribeRoomDeletion = onSnapshot(
            roomDocRef,
            (docSnapshot) => {
                if (!docSnapshot.exists()) {
                    // Room has been deleted
                    toast.success("You have exited the room");
                    navigate("/home");
                }
            },
            (error) => {
                console.error("Error monitoring room deletion:", error);
            }
        );

        return () => unsubscribeRoomDeletion();
    }, [roomId, navigate]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get("id");
        setRoomId(id);
    
        if (!id) {
            console.error("Room ID not found in the query parameters.");
            return;
        }
        
        // Listen to room data in real-time
        const roomDocRef = doc(db, "rooms", id);
        const unsubscribeRoom = onSnapshot(roomDocRef, async (docSnapshot) => {
            if (docSnapshot.exists()) {
                const roomData = docSnapshot.data();
                setRoomName(roomData.roomName);
                setIsRoomSecure(!!roomData.roomPasscode);
                setRequireAccessToken(!!roomData.roomPasscode);
    
                // Set ownership status
                if (user && user.uid === roomData.ownerId) {
                    setIsUserOwner(true);
                } else {
                    setIsUserOwner(false);
                }

                if (roomData.roomMembers && user?.uid) {
                    const isMember = roomData.roomMembers.includes(user.uid);
                    if (isMember) {
                        setHasAccess(true);  // User has access if they are in the room's members list
                    } else {
                        setHasAccess(false); // User does not have access
                    }
                }
    
                // Fetch room members
                fetchRoomMembers(roomData.roomMembers);
            } else {
                console.log("No such room exists!");
            }
        });
    
        return () => unsubscribeRoom();
    }, [location.search, user]);
    

    const fetchRoomMembers = async (members) => {
        try {
            const memberDetails = await Promise.all(
                members.map(async (memberId) => {
                    const userDocRef = doc(db, "users", memberId);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        return { id: memberId, ...userDocSnap.data() };
                    } else {
                        console.log(`No user found for ID: ${memberId}`);
                        return null;
                    }
                })
            );
            setRoomMembers(memberDetails.filter((member) => member !== null));
        } catch (error) {
            console.error("Error fetching room members:", error);
        }
    };

    const handlePasscodeSubmit = async () => {
        try {
            const roomDocRef = doc(db, "rooms", roomId);
            const roomDocSnap = await getDoc(roomDocRef);
    
            if (roomDocSnap.exists()) {
                const roomData = roomDocSnap.data();
    
                if (roomData.roomPasscode === passcodeInput) {
                    setHasAccess(true);  
    
                    const updatedMembers = [...roomData.roomMembers, user.uid];
                    await updateDoc(roomDocRef, { roomMembers: updatedMembers });
    
                } else {
                    toast.error("Incorrect passcode. Please try again.");
                }
            } else {
                console.error("Room does not exist");
            }
        } catch (error) {
            console.error("Error verifying passcode:", error);
        }
    };

    const handleLeaveOrDeleteRoom = async () => {
        const roomDocRef = doc(db, "rooms", roomId);
    
        try {
            if (isUserOwner) {
                await deleteDoc(roomDocRef);
                toast.error("Room deleted successfully.");
                navigate("/home"); 
            } else {
                await updateDoc(roomDocRef, {
                    roomMembers: arrayRemove(user.uid), 
                });

                toast.error("You have left the room.");
                navigate("/home");
            }

        } catch (error) {
            console.error("Error leaving room:", error);
            toast.error("Failed to leave the room. Try again.");
        }
    };

    useEffect(() => {
        if (roomId) {
            const roomDocRef = doc(db, "rooms", roomId);
            
            const unsubscribeChats = onSnapshot(roomDocRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const roomData = docSnapshot.data();
                    if (roomData.chats) {
                        setChats(roomData.chats);
                    }
                }
            });
    
            return () => unsubscribeChats();
        }
    }, [roomId]);

    const handleSendMessage = async () => {
        if (chatInputValue.trim() === "") return; 
    
        const messageData = {
            createdAt: new Date(),  
            email: currentUser?.email || "unknown@example.com", 
            message: chatInputValue,
            name: currentUser?.username || "Anonymous", 
        };

        setChats((prevChats) => [...prevChats, messageData]);
    
        setChatInputValue("");
    
        try {
            const roomDocRef = doc(db, "rooms", roomId);
            await updateDoc(roomDocRef, {
                chats: [...chats, messageData],  
            });
            console.log("Message sent successfully.");
        } catch (error) {
            console.error("Error sending message to Firestore:", error);
        }
    };
    
    const handleChatInputChange = (e) => {
        setChatInputValue(e.target.value);
    };

    return (
        <>
            {isUserOwner || hasAccess ? (
                <div className={styles.container}>
                    <div className={styles.header}>
                        <span>{roomName || "..."}</span>
                    </div>
                    <div className={styles.middle} onClick={() => setChatMode(false)}>
                        <div className={roomMembers.length === 1 ? styles.memberHolder : styles.memberHolder2}>
                            {roomMembers.length > 0 ? (
                                roomMembers.map((member) => (
                                    <div key={member.id} className={styles.member}>
                                        <img
                                            src={member.profileImage || defaultProfile}
                                            alt={`${member.username}'s profile`}
                                            className={styles.profileImage}
                                        />
                                        <div className={styles.memberName}>{member.username}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No members found.</p>
                            )}
                        </div>
                    </div>
                    <div className={styles.commandHolder}>
                        {chatMode ? (
                            <>
                                <div className={styles.chatBox}>
                                    {chats.length > 0 ? (
                                        chats.map((chat, index) => (
                                            <div key={index} className={styles.messageHolder}>
                                                <div className={styles.details}>
                                                    <span>{chat.name}</span>
                                                    <span>{new Date(chat.createdAt.seconds * 1000).toLocaleString()}</span>
                                                </div>
                                                <span>{chat.message}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No messages yet</p>
                                    )}
                                </div>
                                <div className={styles.chatHolder} >
                                    <input
                                        type="text"
                                        className={styles.chatInput}
                                        placeholder="Message..."
                                        onChange={(e) =>
                                            setChatInputValue(e.target.value)
                                        }
                                        value={chatInputValue}
                                    />
                                    {chatInputValue.length > 0 && (
                                        //This is the send button
                                        <i 
                                            className="fa-solid fa-circle-chevron-right"
                                            style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                                            onClick={handleSendMessage}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSendMessage();
                                                }
                                            }}
                                            tabIndex={0}  // Makes the icon focusable to capture keyboard events
                                            role="button" // Adds semantic meaning that this is an interactive element
                                        ></i>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.otherButtons}>
                                    {/* <i className="fa-solid fa-user-group"></i> */}
                                    <i
                                        className="fa-solid fa-arrow-right-from-bracket"
                                        onClick={handleLeaveOrDeleteRoom}
                                    ></i>
                                </div>
                                <span style={{ paddingBottom: "1rem" }}>CHAT ROOM</span>
                                <div className={styles.messageBox} onClick={() => {setChatMode(true)}}>
                                    <span>Message</span>
                                </div>
                            </>
                        )
                        }
                    </div>
                </div>
            ) : (
                <div className={styles.passcodeContainer}>
                    <div className={styles.passContainerCard}>
                        <h2>{roomName || "Room"} - Password Required</h2>
                        <input
                            type="password"
                            value={passcodeInput}
                            maxLength={4}
                            onChange={(e) => setPasscodeInput(e.target.value)}
                            className={styles.passcodeInput}
                        />
                        <button onClick={handlePasscodeSubmit} className={styles.passcodeButton}>
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Room;

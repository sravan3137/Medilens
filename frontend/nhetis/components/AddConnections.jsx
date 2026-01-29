import React, { useState,useContext } from "react";
// import "../src/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import API from "../src/api";
import {useLocation,useNavigate} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext.jsx';
export default function AddConnections() {
    const location = useLocation();
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);
//   const cards = Array.from({ length: 12 }, (_, i) => ({ id: i + 1 }));
    const {data} = location.state || {};
    // const cards = rec;
    const cards=data || [];
    console.log("R:",data);
    const [userMap,setUserMap] = useState(()=>{
      const map = {};
      cards.forEach(c => {
          map[c.username]=false;
      });
      return map;
    });
    const [addedConnections, setAddedConnections] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [message,setMessage] = useState("");
  const [waiting,setWaiting] = useState(false);

  const makeRequest = async(receiverUsername)=>{
    try{
      
      // Object.entries(userMap).forEach((m,k)=>{
      //   if(m[1]) addedConnections.push(m[0]);
      //   console.log("KV: ",m[0],m[1]);
      // });
      setWaiting(true);
      // setMessage(`Request Sent to ${username}`);
      setTimeout(() => {
        setMessage("");
      }, 3000);
      setUserMap(prev =>({ ...prev,[receiverUsername]:!prev[receiverUsername]}));
      const senderUsername=user.username;
      const res = await API.post('users/newRequest',{senderUsername,receiverUsername});
      // const addedConnections = [];
      // const res = await API.post(`users/addUsers/${username}`,{addedConnections});
      
      setWaiting(false);
  
      console.log("connection added successfully");
    }catch (err) {
      // setUserMap(prev =>({ ...prev,[username]:!prev[username]}));
      console.error("Error at confirmAdd,Offcanvas.jsx connections:", err);
    }
  }
  const handleToggle = (username) => {
    
    
    console.log(userMap[username]);
  };

  

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-5 text-primary fw-bold">Select Connections</h1>

      {/* Grid Layout */}
      <div className="row g-4 mb-5 justify-content-center">
        {cards.map((card) => {
         
          return (
            <div
              key={card.username}
              className="col-6 col-md-4 col-lg-3 d-flex justify-content-center"
            >
              <div
                onClick={() => makeRequest(card.username)}
                className={`card text-white fw-bold shadow-sm border-0`}
                style={{
                  width: "18rem",
                  height: "8rem",
                  backgroundColor: "#63C8FF", // Very light blue background color
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <p className="mb-2">ID: {card.username}</p>
                  <button disabled={waiting || userMap[card.username]}
                    // className={`fs-3 text-white ${
                    //   selected ? "bg-danger" : "bg-success"
                    // } `}
                    style={{
                        backgroundColor: userMap[card.username] ? "#dc3545" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        // width: "30px",
                        // height: "30px",
                        fontSize: "18px",
                        lineHeight: "1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }} // Apply red or green to "+" and "−"
                  > 
                    {userMap[card.username] ? "Pending" : "Send Request"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={()=>{navigate(-1)}}
        className="btn btn-primary btn-lg px-5 fw-semibold"
      >
        Back
      </button>
      <p className="mt-4">{message}</p>
    </div>
  );
}

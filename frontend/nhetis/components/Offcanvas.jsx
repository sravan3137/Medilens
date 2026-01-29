// import React, { useState,useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "../src/App.css";
// import logo from '../src/assets/logo.svg'
// import { useTheme } from "../context/ThemeContext";
// import { Link,useNavigate } from "react-router-dom";

// function Offcanvas(props) {
//   const { theme, setTheme } = useTheme();
//   const [role, setRole] = useState(props.username === "doc");
//   const [patient, setPatient] = useState(null);
//   const [medications, setMedications] = useState(null);
//   const navigate=useNavigate();
//   // Dummy patient list (can come from props / API later)
//   // const patients = ["Patient A", "Patient B", "Patient C", "Patient D"];
//   const doctors= ['Mike Philson','Srikanth Morlarwar','Pooja']
  
//     const [patients, setPatients] = useState([]);
  
//     useEffect(() => {
//       const fetchConnections = async () => {
//         try {
//           const res = await fetch("http://127.0.0.1:8000/api/patients/names");
//           if (!res.ok) throw new Error("Network response was not ok");
  
//           const data = await res.json();
//           setPatients(data);
//           // console.log("p: ",data); 
//         } catch (err) {
//           console.error("Error fetching patient names:", err);
//         }
//       };
  
//       fetchConnections();
//     }, []);
//   const fetchPatientById = async (name) => {
//     try {
//       const send = !name?'David Guzman':name;
//       console.log('s: ',send);
//       const res = await fetch(`http://127.0.0.1:8000/api/patients/by-name/${send}`);
//       if (!res.ok) throw new Error("Network response was not ok");

//       const patient = await res.json();
//       setPatient(patient);
//       return patient;
//     } catch (err) {
//       console.error("Error fetching patient:", err);
//       setPatient(null);
//     }
//   };
//   const fetchMedications = async (id) => {
//     try {
//       const res = await fetch(`http://127.0.0.1:8000/api/patients/medications/${id}`);
//       if (!res.ok) throw new Error("Network response was not ok");

//       const data = await res.json();
//       // console.log()
//       // setPatient({ id: data.patient_id, name: data.name });
//       setMedications(data.medications);
//       return data.medications;
//     } catch (err) {
//       console.error("Error fetching medications:", err);
//     }
//   };

  
//   const handleProfileClick = async (name) => {

//     // Navigate to /profile and pass patient in state
//     try{
//       console.log("N: ",name);
//       const patient = await fetchPatientById(name);
//       const medications = await fetchMedications(patient.patient_id);
//       console.log("p: ",patient);
     
  
//       navigate("/profile", { state: { patient,medications } });
//     }catch(e){
//       console.error("Error atHandleProfileClick,Offcanvas.jsx :", e);
//     }
    
//   };
  
//   return (
//     <div className="pt-3 ps-2 bg-body-tertiary border border-2 border-top-0 border-start-0 " style={{ height: "100vh" }}>
//       <button
//         className="btn"
//         type="button"
//         data-bs-toggle="offcanvas"
//         data-bs-target="#offcanvasScroll"
//         aria-controls="offcanvasScroll"
//       >
//         <div>
//           <img src={logo} alt="MediLens Logo" width={35} height={35} />
//         </div>
//       </button>

//       <div
//         className="offcanvas offcanvas-start bg-body-tertiary p-3"
//         data-bs-scroll="true"
//         data-bs-backdrop="true"
//         tabIndex={-1}
//         id="offcanvasScroll"
//         aria-labelledby="offcanvasScrollLabel"
//       >
//         <div className="offcanvas-header bg-body-tertiary mb-0 pb-0">
//           <h3 className="offcanvas-title fw-bold mt-0" id="offcanvasScrollLabel">
//             MediLens <img className='mb-3' src={logo} alt="MediLens Logo" width={35} height={35} />
//           </h3>

//           <button
//             type="button"
//             className="btn-close"
//             data-bs-dismiss="offcanvas"
//             aria-label="Close"
//           />
//         </div>

//         <div className="bg-body-tertiary m-0 p-0"><hr /></div>

//         <div className="offcanvas-body">
//           {/* Toggle Theme is always visible */}
//           <ul className="nav nav-pills flex-column mb-3">
//             <li className="nav-item">
//               <button
//                 className="btn ps-0"
//                 onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//               >
//                 {theme === "light"
//                   ? <i className="bi bi-brightness-high-fill"></i>
//                   : <i className="bi bi-moon-stars-fill"></i>}
//               </button>
//               Toggle Theme
//             </li>
//           </ul>

//           {/* Conditional rendering */}
//           {role ? (
//             <>
//               <h5 className="fw-bold"><i className="bi bi-people-fill"></i> Patients</h5>
//               <hr />
//               <div className="d-grid gap-2">
//                 {patients.map((p, i) => (
//                   <button key={i} className="btn btn-outline-primary" onClick={()=>handleProfileClick(p)}>
//                     {p}
//                   </button>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <>
              
//               <div className="overflow-y-auto mb-0" style={{ height: "38vh" }}>
//                 {/* <ul className="list-group">
//                   {Array.from({ length: 200 }, (_, i) => (
//                     <li key={i} className="list-group-item list-group-item-action">
//                       Item {i + 1}
//                     </li>
//                   ))}
//                 </ul> */}
//                 <h5 className="fw-bold"><i className="bi bi-people-fill"></i>My Doctors</h5>
//                 <hr />
//                 <div className="d-grid gap-2">
//                   {doctors.map((p, i) => (
//                     <button key={i} className="btn btn-outline-primary" >
//                       {p}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         <div className="d-flex justify-content-between align-items-center mt-3 border p-2 rounded">
//           <div className="fst-italic">{props.username}</div>
//           <div>
//           {role ? (
//       // Just the div (no navigation)
//       <div className="btn p-0" title="Profile">
//         <i className="bi bi-person-circle fs-3 text-secondary"></i>
//       </div>
//     ) : (
//       // Clickable Link (for patients)
//       <button
//         className="btn p-0"
//         title="Profile"
//         onClick={()=>handleProfileClick()}
//       >
//         <i className="bi bi-person-circle fs-3 text-secondary"></i>
//       </button>
//     )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Offcanvas;

import React, { useState, useEffect,useContext} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../src/App.css";
import logo from "../src/assets/logo.svg";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import API from "../src/api";
import { AuthContext } from '../context/AuthContext';
import AddConnections from './AddConnections.jsx';
import Chat from './Chat.jsx';
// import { io } from "socket.io-client";
import socket from '../components/Socket';

function Offcanvas(props) {
  const { logout,user,setConn } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();
  // const [role,setRole] = useState(user.role);
  const [connections, setConnections] = useState([]);
  
  const [addableConnections, setAddableConnections] = useState([]);
  const navigate = useNavigate();
  const [selected,setSelected] = useState("");
  const doctors = ["Mike Philson", "Srikanth Morlarwar", "Pooja"];
  const [hasUnread,setHasUnread]=useState(false);
  const [roomId,setRoomId] = useState([user.username, selected].filter(Boolean).sort().join("_") || "");
  // const roomId = [userId, targetId].sort().join("_");
  // Fetch patients if doctor
  useEffect(() => {
    if(!user) return;
    // console.log("HERE: ",user);
    // if (user.role==="doctor") {
      
      const fetchConnections = async () => {
        try {
          const res = await API.get(`users/getConnections/${user.username}`);
          // console.log("R:",res.data);
          if(res.status===401) {
            await logout();
          }
          // if (!res.ok) throw new Error("Network response was not ok");
          const data =res.data?.connections||"";
          // console.log("D:",res.data);
          setConnections(data);
          setSelected(data[0]);
          setConn(data[0]);
          const cri=[user.username, data[0]].filter(Boolean).sort().join("_") || "";
          setRoomId(cri);
        } catch (err) {
          console.error("Error fetching connections:", err);
        }
      };
      fetchConnections();
      
    // }
  }, [user]);
  useEffect(()=>{
    if(!roomId || roomId==="" || roomId===user?.username) return;
    socket.emit("join-room", { roomId, userId: user.username });
    socket.on("unread-update", ({ receiver, roomId:croomId,read }) => {
      // console.log("unread-update listened");
      if (receiver === user.username && croomId === roomId) {
        // console.log("unread-update updated ",croomId,roomId,receiver,user.username,read);
        setHasUnread(!read);
        // console.log("HURRRAAYY: ",!read);
      }
      // console.log(receiver,user.username,croomId,roomId,read);
    });
    // console.log("READ? "+hasUnread);
    return () =>{
      socket.off("unread-update");  
    };
    
    
  },[roomId]);
  useEffect(() => {
    const handleConnect = () => {
      console.log("SOCKET CONNECTED:", socket.id);
    };
  
    const handleDisconnect = () => {
      console.log("SOCKET DISCONNECTED");
    };
  
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
  
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []); // ← empty deps → runs once
  
  const handleAdd= async ()=>{
    try{
      
      const username = user.username;
      const role = user.role;
      const res = await API.get(`users/getUsers/${role}/${username}`); 
      const data=res.data?.users||[];
      console.log("DD:",res.data);
      setAddableConnections(data);
      navigate('/addConnections',{state:{data}});   
    }catch (err) {
      console.error("Error at handleAdd,Offcanvas.jsx connections:", err);
    }
    console.log("Entered handleAdd");
    
  }
  
  const fetchPatientById = async (id) => {
    try {
      // const send = !name ? "David Guzman" : name;
      const res = await API.get(`patients/${id}`);
      if(res.status===401) {
        await logout();
      }
      // console.log("RRRERR:",res);
      // if (!res.ok) throw new Error(`Network response was not ok ${res.status}`);
       
      return res.data;
    } catch (err) {
      console.error("Error fetching patient:", err);
      return null;
    }
  };

  const fetchMedications = async (id) => {
    try {
      const res = await API.get(`patients/${id}/medications`);
      if(res.status===401) {
        await logout();
      }
      const data =res.data;
      return data.medications;
    } catch (err) {
      console.error("Error fetching medications:", err);
      return [];
    }
  };

  const handleProfileClick = async () => {
    try {
      const role=user.role==="doctor"?'patient':'doctor';
      const id=selected;
      if(role==='patient') {
        const patient = await fetchPatientById(id);
        console.log("P:",patient);
        if (!patient) return;
        const medications = await fetchMedications(patient.patient_id);
        navigate("/profile", { state: { patient, medications } });
      }else navigate("/profile");
    } catch (e) {
      console.error("Error at handleProfileClick, Offcanvas.jsx:", e);
    }
  };
  const handleSelected=(id)=>{
    setSelected(id);
    setConn(id);
    const cri=[user.username, id].filter(Boolean).sort().join("_") || ""
    setRoomId(cri)
  }
  const handleChat = (targetUser)=>{
    // <Chat userId={user.username} targetId={targetUser} />
    // console.log("ROOMID: ",roomId);
    setHasUnread(false);
    navigate(`/chat/${targetUser}/${roomId}`);
  }

  return (
    <div
      className="d-flex flex-column bg-body-tertiary border-end p-3 overflow-y-hidden"
      style={{ width: "320px", minHeight: "100vh" }}
    >
      {/* Header */}
      <h3 className="fw-bold mb-4">
        MediLens{" "}
        <img className="mb-1 ms-2" src={logo} alt="MediLens Logo" width={28} height={28} />
      </h3>

      {/* Toggle Theme */}
      <div className="mb-4">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <i className="bi bi-brightness-high-fill"></i>
          ) : (
            <i className="bi bi-moon-stars-fill"></i>
          )}
        </button>{" "}
        Toggle Theme
      </div>

      {/* Role-specific sections */}
      {user.role==="doctor" ? (
        <>
          <h5 className="fw-bold"><i className="bi bi-people-fill"></i>My Patients</h5>
          <hr />
          <div className="d-grid gap-2 overflow-auto" style={{ maxHeight: "50vh" }}>
            {connections.map((p, i) => (
              <button
                key={i}
                className={`btn me-2`}
                style={{
                  borderColor: selected === p ? '#004080' : '#99ccff', // dark vs light blue
                  color: selected === p ? '#004080' : '#99ccff'
                }}
                onClick={() => handleSelected(p)}
              >
                {p}
              </button>
            ))}
            <button className="btn btn-primary" onClick={handleAdd}>Add Patient</button>
            {/* <button className="btn btn-outline-info">Requests</button> */}
          </div>

        </>
      ) : (
        <>
          <h5 className="fw-bold"><i className="bi bi-people-fill"></i> My Doctors</h5>
          <hr />
          <div className="d-grid gap-2">
            {connections.map((d, i) => (
              <button key={i} 
                      className={`btn me-2`}
                      style={{
                        borderColor: selected === d ? '#004080' : '#99ccff', // dark vs light blue
                        color: selected === d ? '#004080' : '#99ccff'
                      }}
                      onClick={() => handleSelected(d)}
                      >
                {d}
              </button>
            ))}
            <button className="btn btn-primary" onClick={handleAdd}>Add Doctor</button>
            {/* <button className="btn btn-outline-info">Requests</button> */}
          </div>
        </>
      )}
      
        
        <button className="btn btn-outline-info mt-4" onClick={()=>handleProfileClick()}>Profile</button>
        <button className="btn btn-outline-info mt-4 position-relative" onClick={()=>handleChat(selected)}>
            Chat
            {hasUnread && (
              <span
              className="position-absolute top-0 start-100 translate-middle rounded-circle"
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "rgba(13, 110, 253, 0.85)", // Bootstrap info blue with some transparency
                border: "1px solid white", // subtle white border for contrast
                boxShadow: "0 0 3px rgba(13, 110, 253, 0.5)",
              }}
            ></span>
            )}
        </button>
        <button className="btn btn-outline-info mt-4" onClick={()=>navigate('/requests')}>My Requests & Responses</button>
      
      {/* Footer */}
      <div className="mt-auto border-top pt-3 d-flex justify-content-between align-items-center">
        <div className="fst-italic">{user.username}</div>
        {user.role==="doctor" ? (
          <button className="btn p-0" title="Profile" onClick={() => handleProfileClick(user.username,user.role)}>
            <i className="bi bi-person-circle fs-3 text-secondary"></i>
          </button>
        ) : (
          <button className="btn p-0" title="Profile" onClick={() => handleProfileClick(user.username,user.role)}>
            <i className="bi bi-person-circle fs-3 text-secondary"></i>
          </button>
        )}
      </div>
    </div>
  );
}

export default Offcanvas;

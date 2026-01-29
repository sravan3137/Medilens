import React,{useEffect,useContext,useState} from 'react';
import {useNavigate} from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import API from "../src/api";
export default function RequestsAndResponses(){
    const [requests,setRequests] = useState([]);
    const [waiting,setWaiting] = useState(false);
    const {user,logout} = useContext(AuthContext);
    useEffect(()=>{
        if(!user) return;
        const getRequests = async()=>{
            try{
                setWaiting(true);
                console.log("U: ",user);
                const receiverUsername = user.username; 
                const res = await API.get(`/users/getRequests/${receiverUsername}`);
                const reqs = res.data?.requests || [];
                console.log("R:",reqs);
                setRequests((prev)=>{
                    if(reqs.length!==0) {
                        console.log("true");
                        return reqs;
                    }
                    return prev;
                });
                setTimeout(() => {
                    setWaiting(false); 
                }, 1000);
                
                // setTimeout(() => {
                //     console.log("RRR:",requests);
                // }, 5000);
            }catch(e){
                console.log("Error at getRequessts,RequestAndResponses.jsx: ",e);
            }
        };
        getRequests();
    },[user]);
    const handleAction = async(senderUsername,status)=>{
        try{
            setWaiting(true);
            const receiverUsername = user.username;
            const res = await API.put('/users/respond',{status,senderUsername,receiverUsername});
            const data=res.data?.updated;
            console.log("DAT:",data);
            console.log("REQS:",requests);
            setRequests((prev)=>prev.filter(req=>req._id!==data._id));

        }catch(e){
                console.log("Error at handleAction,RequestAndResponses.jsx: ",e);
        }
        finally{
            setWaiting(false);
        }
    }
    return (
        <div className="container mt-4">
            <h4 className="mb-3">Requests</h4>
            {requests.length === 0 ? 
                waiting?(<p>LOading...</p>):(<p>No pending requests </p>)
                
             : (
                // <div></div>
                requests.map((id) => (
                <div
                    key={id}
                    className="d-flex align-items-center justify-content-between mb-2 border rounded p-2"
                >
                    <span className="fw-semibold">Request ID: {id.senderUsername}</span>
                    <div>
                    <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleAction(id.senderUsername, "accept")}
                    >
                        Accept
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleAction(id.senderUsername, "reject")}
                    >
                        Reject
                    </button>
                    </div>
                </div>
            ))
        )}
        </div>
    );
}
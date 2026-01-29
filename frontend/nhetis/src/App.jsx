import './App.css'
import GradientText from '../reactbits/GradientText';
import { useState,useContext,useRef,useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Hello from '../components/Hello';
import UserChatBubble from '../components/UserChatBubble';
import AiChatBubble from '../components/AiChatBubble';
import { RingLoader } from 'react-spinners';
import Offcanvas from '../components/Offcanvas';
import {AuthContext} from '../context/AuthContext';
import API from "../src/api";
import socket from '../components/Socket';
import {Navigate} from 'react-router-dom';
function App() {
  const {user,connection} = useContext(AuthContext);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};
console.log("U: ",user);
useEffect(() => {
  scrollToBottom();
}, [messages]);

  // 👉 Point to Django backend instead of ngrok
  const BASE_URL = "http://localhost:8000";  

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

const sendMessage = async () => {
  if (!userMessage.trim()) return;

  setIsLoading(true);

  const currentUserMessage = userMessage;

  // Add user message to chat
  setMessages((prev) => [
    ...prev,
    { sender: "user", message: currentUserMessage }
  ]);

  setUserMessage('');

  try {
    let id=user?.username;
    if(user?.role==="doctor") id=connection;
    // console.log("C:",id);
    const payload = {
      user_id: id.toUpperCase(),  
      question: currentUserMessage,
      role:user?.role
    };
    const response = await fetch(`${BASE_URL}/users/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if(response.status===401) {
      return <Navigate to="/login" replace />;
    }

    const data = await response.json();      // parse JSON
    const textData = data.answer;
    const imagesData = data.images || {};
    console.log("D: ",imagesData);
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        message: textData || "No answer received.",
        images: imagesData
      }
    ]);


  } catch (error) {
    console.error("Error fetching data:", error,response);
    setMessages((prev) => [
      ...prev,
      { sender: "ai", message: "Sorry, something went wrong. Please try again." }
    ]);
  } finally {
    setIsLoading(false);
  }
};



  return (
    <>




<div className="app-container">
  <div className="row g-0">
    {/* Sidebar (always visible) */}
    <div className="col-auto">
      <Offcanvas username={user.username} />
    </div>

    {/* Main content */}
    <div className="col">
      <div className="main-content p-3">
        <Hello username={user.username} />

        <div className="chat-area overflow-y-auto mb-5" style={{ height: "70vh" }}>
          {messages.map((msg, idx) =>
            msg.sender === "user" ? (
              <UserChatBubble key={idx} message={msg.message} />
            ) : (
              <AiChatBubble key={idx} message={msg.message} images={msg.images} />
            )
          )}

          {isLoading && (
            <div className="mb-4 mx-5 py-2 border-bottom d-flex justify-content-start">
              <RingLoader size={25} color="#0d6efd" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  </div>

  {/* Input Section */}
  <div
    className="container-fluid input-group border border-primary-subtle border-2 rounded-5 p-3 position-fixed mb-3 bottom-0 start-50 translate-middle-x shadow-lg bg-body-tertiary"
    style={{ maxWidth: "800px" }}
  >
    <textarea
      className="form-control border-0 bg-body-tertiary"
      value={userMessage}
      onChange={handleInputChange}
      aria-label="With textarea"
      placeholder="Ask your doubt"
      style={{ resize: "none", height: "4rem" }}
    ></textarea>
    <div className="d-flex justify-content-end mt-3 mx-1">
      <button
        className="btn btn-primary btn-sm rounded-circle d-flex align-items-center justify-content-center pt-1"
        style={{ width: "32px", height: "32px" }}
        onClick={sendMessage}
        disabled={isLoading}
        title="Submit"
      >
        <i className="bi bi-send-fill" style={{ fontSize: "0.9rem" }}></i>
      </button>
    </div>
  </div>
</div>

    </>



  );
}

export default App;
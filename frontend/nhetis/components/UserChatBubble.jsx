import React, { useState } from 'react';

function UserChatBubble({ message }) {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="container d-flex justify-content-end my-4"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative" }}
    >
      <div className="d-flex align-items-center">
        {/* Icon outside the bubble */}
        {hover && (
          <span
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy"}
            style={{
              fontSize: "0.9rem",
              cursor: "pointer",
              marginRight: "0.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <i className={`bi ${copied ? "bi-check" : "bi-copy"}`}></i>
          </span>
        )}

        {/* Message bubble */}
        <div
          className="bg-body-tertiary rounded-start-4 rounded-bottom-4 px-3 py-2 border"
          style={{ maxWidth: "35rem" }}
        >
          {message}
        </div>
      </div>
    </div>
  );
}

export default UserChatBubble;

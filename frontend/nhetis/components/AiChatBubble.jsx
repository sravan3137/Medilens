import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function AiChatBubble({ message, images }) {
  const [displayedText, setDisplayedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  // console.log("B: ",images);
  useEffect(() => {
    if (!message) return;
    setDisplayedText(""); // reset when new message comes
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(message.slice(0, i));
      i++;
      if (i > message.length) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [message]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2s
  };

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) setDisliked(false); // can’t like & dislike together
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (!disliked) setLiked(false);
  };


  return (
    <div className="mb-4 mx-5 py-2 border-bottom position-relative">
      {/* Text */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {displayedText}
      </ReactMarkdown>

      {/* Images (if any) */}
      {images &&
        Object.entries(images).map(([key, base64], idx) => (
          <div key={idx} className="mt-3">
            <h6 className="small text-muted">{key}</h6>
            <img
               src={`data:image/png;base64,${base64}`}
              alt={key}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                border: "1px solid #ddd",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        ))}

      {/* Icon footer */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          fontSize: "0.9rem",
          marginTop: "6px",
          justifyContent: "flex-start",
        }}
      >
        {/* Copy */}
        <i
          className={`bi ${copied ? "bi-check" : "bi-copy"}`}
          style={{ cursor: "pointer" }}
          title={copied ? "Copied!" : "Copy"}
          onClick={handleCopy}
        ></i>

        {/* Like */}
        <i
          className={`bi ${liked ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"}`}
          style={{ cursor: "pointer" }}
          title="Like"
          onClick={handleLike}
        ></i>

        {/* Dislike */}
        <i
          className={`bi ${disliked ? "bi-hand-thumbs-down-fill" : "bi-hand-thumbs-down"}`}
          style={{ cursor: "pointer" }}
          title="Dislike"
          onClick={handleDislike}
        ></i>
      </div>
    </div>
  );
}

export default AiChatBubble;
import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, TextField, Paper, Typography, Button } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const toggleChat = () => setOpen(!open);

  const appendMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    appendMessage("user", text);

    try {
      const res = await fetch(
        "https://n8n.sandi.id/webhook/9bfbf73a-5c39-47f9-85c4-ba5f4bb2ee0c",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        }
      );

      const data = await res.json();
      let botMessage = "Tidak ada balasan";

      if (Array.isArray(data) && data.length > 0) {
        botMessage = data[0].output || botMessage;
      } else if (data.output) {
        botMessage = data.output;
      }

      appendMessage("bot", botMessage);
    } catch (e) {
      appendMessage("bot", "Menunggu balasan");
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <IconButton
        onClick={toggleChat}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          bgcolor: "#FF8C00",
          color: "white",
          boxShadow: 4,
          zIndex: 9999,
          border: "4px solid #FFC45A",
          ":hover": { bgcolor: "#e67e00" },
        }}
      >
        <ChatBubbleIcon fontSize="large" />
      </IconButton>

      {/* Chat Box */}
      <Paper
        elevation={6}
        sx={{
          position: "fixed",
          bottom: 90,
          right: 24,
          width: 320,
          height: 380,
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          zIndex: 9998,
          transform: open ? "scale(1)" : "scale(0.8)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "all .3s ease",
        }}
      >
        {/* Header */}
        <Box sx={{ bgcolor: "#FF8C00", color: "white", p: 1.2, textAlign: "center" }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Assistant SMF
          </Typography>
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, p: 1.5, overflowY: "auto", bgcolor: "#fafafa" }}>
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "80%",
                  bgcolor: msg.sender === "user" ? "#FF8C00" : "#e0e0e0",
                  color: msg.sender === "user" ? "white" : "black",
                  whiteSpace: "pre-line",
                  fontSize: 14,
                }}
              >
                {msg.text}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ display: "flex", borderTop: "1px solid #ddd", p: 1 }}>
          <TextField
            variant="standard"
            placeholder="Ketik pesan..."
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button
            onClick={sendMessage}
            sx={{ ml: 1, bgcolor: "#FF8C00", ":hover": { bgcolor: "#e67e00" } }}
            variant="contained"
          >
            Send
          </Button>
        </Box>
      </Paper>
    </>
  );
}

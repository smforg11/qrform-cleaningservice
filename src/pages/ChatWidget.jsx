


      import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, TextField, Paper, Typography, Button } from "@mui/material";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const messagesEndRef = useRef(null);

  const toggleChat = () => setOpen(!open);

  const appendMessage = (sender, text) => {
    setMessages((prev) => [
      ...prev,
      { sender, text, timestamp: Date.now() },
    ]);
  };

  // 🔹 LOAD + GREETING
  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");

    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed);

      if (parsed.length > 0) {
        setHasInitialized(true);
      }
    } else {
      const welcome = [
        {
          sender: "bot",
          text: "Halo 👋 ada yang bisa saya bantu?",
          timestamp: Date.now(),
        },
      ];

      setMessages(welcome);
      localStorage.setItem("chat_messages", JSON.stringify(welcome));
      setHasInitialized(true);
    }
  }, []);

  // 🔹 SAVE
  useEffect(() => {
    if (hasInitialized) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages, hasInitialized]);

  // 🔹 AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input;
    setInput("");
    appendMessage("user", text);
    setIsTyping(true);

   try {
      const res = await fetch(
       "https://n8n.sarana.id/webhook/9bfbf73a-5c39-47f9-85c4-ba5f4bb2ee0c",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa("itdev:sukroy@12345")}`
          },
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
      appendMessage("bot", "Menunggu balasan...");
    } finally {
      setIsTyping(false);
    }
  };

  function parseMessage(text) {
    if (!text) return "";

    text = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\n/g, "<br>");

    return text;
  }

  // 🔹 RESET CHAT (optional)
  const clearChat = () => {
    localStorage.removeItem("chat_messages");
    setMessages([
      {
        sender: "bot",
        text: "Halo 👋 ada yang bisa saya bantu?",
        timestamp: Date.now(),
      },
    ]);
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
          zIndex: 9999,
        }}
      >
        <img src="/cs.png" style={{ width: 150 }} />
      </IconButton>

      {/* Chat Box */}
      <Paper
        elevation={6}
        sx={{
          position: "fixed",
          bottom: 150,
          right: 24,
          width: 350,
          height: 500,
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
        <Box
          sx={{
            background: "linear-gradient(135deg, #FF8C00, #FF6A00)",
            color: "white",
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src="/cs.png" style={{ width: 35, borderRadius: "50%" }} />
          <Typography sx={{ ml: 1, fontWeight: 600 }}>
            AI SMF Analisis
          </Typography>

          <Button
            size="small"
            onClick={clearChat}
            sx={{ ml: "auto", fontWeight: 600, color: "white" }}
          >
            Reset
          </Button>
        </Box>

        {/* Messages */}
        <Box sx={{ flex: 1, p: 1.5, overflowY: "auto", bgcolor: "#fafafa" }}>
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "80%",
                  bgcolor:
                    msg.sender === "user" ? "#FF8C00" : "#e0e0e0",
                  color:
                    msg.sender === "user" ? "white" : "black",
                  fontSize: 14,
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    msg.sender === "bot"
                      ? parseMessage(msg.text)
                      : msg.text,
                }}
              />

              <Box sx={{ fontSize: 10, color: "gray", mt: 0.3 }}>
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Box>
            </Box>
          ))}

          {isTyping && (
            <Box sx={{ fontSize: 12, color: "gray" }}>
              sedang mengetik...
            </Box>
          )}

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
            sx={{ ml: 1, bgcolor: "#FF8C00" }}
            variant="contained"
          >
            Send
          </Button>
        </Box>
      </Paper>
    </>
  );
}
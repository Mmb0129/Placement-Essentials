import React, { useEffect, useRef, useState } from "react";
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import "./App.css";

function App({ signOut, user }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [status, setStatus] = useState({ message: "", type: "info" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      async function startCamera() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Webcam error:", error);
          setStatus({ message: "⚠️ Could not access webcam.", type: "error" });
        }
      }
      startCamera();
    }
  }, [ready]);

  const captureAndUpload = async () => {
    setStatus({ message: "📸 Capturing image...", type: "info" });

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, 640, 480);
    const dataURL = canvas.toDataURL("image/jpeg");
    const blob = await (await fetch(dataURL)).blob();

    setStatus({ message: "🚀 Uploading image...", type: "info" });

    try {
      const presignedResp = await fetch("https://oapuutgkyf.execute-api.ap-south-1.amazonaws.com/getUploadUrl");
      const { uploadUrl, fileName } = await presignedResp.json();

      const uploadResp = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: blob
      });

      if (uploadResp.ok) {
        setStatus({
          message: `✅ Uploaded as ${fileName}. Attendance will be marked.`,
          type: "success"
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      setStatus({ message: "❌ Upload failed. Try again.", type: "error" });
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      fontFamily: "sans-serif",
      textAlign: "center",
      padding: "20px"
    }}>
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <span style={{ marginRight: "15px" }}>👋 {user.attributes.email}</span>
        <button
          onClick={signOut}
          style={{
            backgroundColor: "#ef4444",
            color: "#fff",
            padding: "8px 15px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}>
          Sign Out
        </button>
      </div>

      {!ready ? (
        <>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "30px" }}>
            👋 Welcome {user.attributes.email}
          </h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "40px" }}>
            Ready to mark your attendance?
          </p>
          <button
            onClick={() => setReady(true)}
            style={{
              backgroundColor: "#22c55e",
              color: "#fff",
              padding: "15px 30px",
              fontSize: "1.1rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.3)"
            }}
          >
            ✅ Ready to Mark Attendance
          </button>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
            📸 Position your face in the camera
          </h1>
          <video
            ref={videoRef}
            width="640"
            height="480"
            style={{
              borderRadius: "12px",
              border: "4px solid #fff",
              marginBottom: "20px"
            }}
            autoPlay
          ></video>
          <button
            onClick={captureAndUpload}
            style={{
              backgroundColor: "#f97316",
              color: "#fff",
              padding: "12px 25px",
              fontSize: "1rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "20px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)"
            }}
          >
            📷 Capture & Upload
          </button>
          <p style={{
            fontSize: "1.1rem",
            color: status.type === "success" ? "#22c55e"
                  : status.type === "error" ? "#f43f5e"
                  : "#fff"
          }}>
            {status.message}
          </p>
          <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }}></canvas>
        </>
      )}
    </div>
  );
}

export default withAuthenticator(App, {
  signUpAttributes: [], // disables asking extra fields
  hideSignUp: true      // 🔥 hides the "Create Account" tab
});

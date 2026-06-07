import React from "react";

export default function LoadingSpinner() {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", padding: "40px" }}>
            <div style={{
                width: "48px",
                height: "48px",
                border: "4px solid #d1d5db",
                borderTopColor: "#111827",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

import { motion } from "framer-motion";
import React from "react";

export default function LoadingSpinner() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                padding: "40px",
            }}
        >
            <motion.div
                style={{
                    width: "48px",
                    height: "48px",
                    border: "4px solid #d1d5db", // light gray
                    borderTopColor: "#111827", // dark gray/black
                    borderRadius: "50%",
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
        </div>
    );
}
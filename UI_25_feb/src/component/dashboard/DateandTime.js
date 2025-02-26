
import { useEffect, useState } from "react";
import { Col} from "react-bootstrap";

export default function DateandTime() {
    const [date, setDate] = useState({ time: "", day: "" });

    useEffect(() => {
        const interval = setInterval(() => {
            
        }, 1000);
        const now = new Date();
            const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            const currentDate = now.toLocaleDateString("en-US", {
                weekday: "short",  
                month: "short",    
                day: "numeric",  
                year: "numeric"    
            });
            setDate({ time: currentTime, day: currentDate });

        return () => clearInterval(interval);
    }, []);

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
                <div
                    className="border p-3 d-flex flex-column justify-content-center align-items-center text-center"
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                        width: "100%",
                        height: "90%",
                        minHeight: "95%", 
                        overflow: "hidden",
                    }}
                >
                    <span style={{ fontSize: "4.3rem" }}>{date.time || "NA"}</span>
                    <span style={{ fontSize: "3rem", color: "#666666", marginTop: "10px" }}>{date.day || "NA"}</span>
                </div>
        </Col>
    );
}


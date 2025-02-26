import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic'; 
import { Col } from "react-bootstrap";

const GeoMaps = () => {
    const [isClient, setIsClient] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        setIsClient(typeof window !== 'undefined');
    }, []);

    useEffect(() => {
        if (isClient && !mapRef.current) {
            import('leaflet').then(L => {
                import('leaflet/dist/leaflet.css');
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                });

                const map = L.map('map', { zoomControl: false }).setView([51.505, -0.09], 13);
                mapRef.current = map;

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                //  {
                //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                // }
            ).
            addTo(map);
                L.marker([51.505, -0.09]).addTo(map)
                    .bindPopup('<b>Location</b>')
                    .openPopup();

                return () => {
                    map.remove();
                    mapRef.current = null;
                };
            });
            
        }
    }, [isClient]);

    if (!isClient) return null; 

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
            <div
                className="border d-flex flex-column"
                style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    width: "100%",
                    height: "90%",
                    minHeight: "94%",
                    padding: "0",
                    overflow: "hidden",
                }}
            >
                <div id="map" style={{ flex: 1, width: "100%", height: "100%" }} />
            </div>
        </Col>
    );
};

export default dynamic(() => Promise.resolve(GeoMaps), { ssr: false }); 

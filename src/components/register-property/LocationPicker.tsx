import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon paths broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationPickerProps {
    latitude: number;
    longitude: number;
    onLocationChange: (lat: number, lng: number) => void;
}

/** Moves the map view whenever the lat/lng props change (e.g. "Use Current Location") */
function MapSync({ latitude, longitude }: { latitude: number; longitude: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([latitude, longitude], map.getZoom());
    }, [latitude, longitude, map]);
    return null;
}

/** Listens for map clicks and fires onLocationChange */
function ClickHandler({
    onLocationChange,
}: {
    onLocationChange: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        click(e) {
            onLocationChange(
                parseFloat(e.latlng.lat.toFixed(6)),
                parseFloat(e.latlng.lng.toFixed(6))
            );
        },
    });
    return null;
}

export function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={14}
            style={{ height: "360px", width: "100%" }}
            className="rounded-lg"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapSync latitude={latitude} longitude={longitude} />
            <ClickHandler onLocationChange={onLocationChange} />
            <Marker position={[latitude, longitude]} />
        </MapContainer>
    );
}

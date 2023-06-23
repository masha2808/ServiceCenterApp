import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";

type PropTypes = {
  mapLatitude: number,
  mapLongitude: number,
  name: string
}
const MapTab = (props: PropTypes) => {
  const defaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [ 32, 51 ],
    iconAnchor: [ 16, 51 ],
    popupAnchor: [ 0, -51 ] 
  });

  return (
    <div className="tab-content">
      <MapContainer center={{ lat: props.mapLatitude, lng: props.mapLongitude }} zoom={15} scrollWheelZoom={false} className="leaflet">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={{ lat: props.mapLatitude, lng: props.mapLongitude }} icon={defaultIcon}>
          <Popup>{ props.name }</Popup>
        </Marker>
      </MapContainer>
    </div>
  ); 
};

export default MapTab;
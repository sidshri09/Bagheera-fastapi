import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { useParams } from "react-router-dom";
import { GoLocation } from "react-icons/go";

const AnyReactComponent = ({ text }) => (
  <div>
    <GoLocation style={{ color: "#f71105", width: "20px", height: "20px" }} />
    {text}
  </div>
);

function Map() {
  const { lat, lng } = useParams();
  const center = {
    lat: 18.516726,
    lng: 73.856255,
  };
  const zoom = 5;

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_ACCESS_KEY }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        <AnyReactComponent
          style={{ fontColor: "red" }}
          lat={lat}
          lng={lng}
          text="Your're Here"
        />
      </GoogleMapReact>
    </div>
  );
}

export default Map;

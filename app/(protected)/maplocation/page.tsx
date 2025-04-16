'use client'

import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const localeList = [{
  id: 1,
  title: 'MDMG WATERS',	
  lat: 28.025480549796182,
  lng: -82.55569240421633
}, {
  id: 2,
  title: 'MDMG BRANDOM',	
  lat: 27.92572374619235,
  lng: -82.28623329072596
}];

const GoogleMapComponent = () => {
  return (
    <LoadScript googleMapsApiKey= {process.env.NEXT_PUBLIC_MAPS_API_KEY || ""} >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={localeList[0]}
        zoom={10} >
        {localeList.map((item) => (                   
          <Marker key={item.id} position={item} title={item.title} />
        ))}     
      </GoogleMap>      
    </LoadScript>
  );
};

export default GoogleMapComponent;
"use client"

import React from 'react';

import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import { Circle } from './component/circle';

const App = () => {
  
  const localeList = [{
    id: 1,
    idCircle: 10,
    title: 'MDMG WATERS',	
    lat: 28.025480549796182,
    lng: -82.55569240421633,
    radius: 10000
  }, {
    id: 2,
    idCircle: 20,
    title: 'MDMG BRANDOM',	
    lat: 27.92572374619235,
    lng: -82.28623329072596,
    radius: 10000
  }];

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY ?? ''}>
      <Map
        defaultCenter={{lat: 28.025480549796182, lng: -82.55569240421633}}       
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI={true}>
        {localeList.map((item) => ( 
            <>
              <Marker key={item.id} position={item} title={item.title} />

              <Circle key={item.idCircle}
                radius={item.radius}
                center={{lng: item.lng, lat: item.lat}}                
                strokeColor={'#0c4cb3'}
                strokeOpacity={1}
                strokeWeight={3}
                fillColor={'#3b82f6'}
                fillOpacity={0.3}
                editable
                draggable /> 
            </>                  
                     
        ))}                
                      
      </Map>      
    </APIProvider>
  );
};
export default App;


'use client';

import React from 'react';
import { Map, Marker } from '@vis.gl/react-google-maps';
import { Circle } from '../ui/circle';

interface RouteMapProps {
  position: { lat: number; lng: number };
}

const AddresMap: React.FC<RouteMapProps> = ({ position }) => {
  return (
    <Map
      className="w-full h-full"
      defaultCenter={{ lat: 0, lng: 0 }}
      center={position}
      defaultZoom={12}
      gestureHandling="greedy"
      fullscreenControl={false}
      mapId="bf51a910020fa25a"
    >
      {/* Optionally, add a marker for the single destination */}
      <Marker position={position} />
      {/*<Circle
          radius={1000}
          center={position}
          strokeColor={'#0c4cb3'}
          strokeOpacity={1}
          strokeWeight={3}
          fillColor={'#3b82f6'}
          fillOpacity={0.3}
          editable={false}
          draggable={false}
        />*/}
    </Map>
  );
};

export default AddresMap;

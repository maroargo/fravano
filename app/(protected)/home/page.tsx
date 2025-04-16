"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { APIProvider, Marker, Map, useMap } from '@vis.gl/react-google-maps';
import { FaSearch, FaUser, FaVideo } from 'react-icons/fa';
import { MdLocationOn, MdChevronLeft } from 'react-icons/md';
import useSWR from 'swr';
import { IAddress } from "@/interfaces/address";
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { DispatchProvider, useDispatch } from '../contexts/DispatchContext';
import { mutate } from "swr";

interface LatLng {
  lat: number;
  lng: number;
}


// Marker SVG
const createMarkerSVG = (): string => {
  return `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 18 9.5 18 14C18 17.866 15.3137 21 12 21C8.68629 21 6 17.866 6 14C6 9.5 12 2 12 2Z" 
        fill="#00B333" 
        stroke="white" 
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `;
};

const formatPlaceId = (id: string) => {
  // Example formatting function (you can adjust this as needed)
  // Split the ID into chunks and add dashes to make it look like a Plus Code
  const chunkedId = id.slice(0, 4) + '-' + id.slice(4, 7) + '-' + id.slice(7, 10);
  return chunkedId;
};

const getAddressSummary = (address: string) => {
  // Example logic: Trim the address to just the first line or a brief summary.
  // You can adjust this depending on your data and what makes sense for your use case.

  const lines = address.split(','); // Split by comma
  if (lines.length > 2) {
    return `${lines[0]}, ${lines[1]}`; // Example: "Street Name, City"
  } else if (lines.length > 1) {
    return lines[0]; // Example: "Street Name"
  }

  return address; // If it's just one line, return it fully
};


const INITIAL_CENTER: LatLng = { lat: 39.8283, lng: -98.5795 }; // Center of the USA
const MIN_ZOOM = 3;
const MAX_ZOOM = 18;
const DEFAULT_ZOOM = 4;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const GoogleMapDispatch: React.FC = () => {
  return (
    <DispatchProvider>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY ?? ''} libraries={['places']}>
        <DispatchContent />
      </APIProvider>
    </DispatchProvider>
  );
};

const DispatchContent: React.FC = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const {
    places,
    setPlaces,
    isExpanded,
    setIsExpanded,
    searchQuery,
    setSearchQuery
  } = useDispatch();
  const map = useMap()

  // Add mapKey state
  const [mapKey, setMapKey] = useState<number>(0);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // const [map, setMap] = useState<google.maps.Map | null>(null);
  const {
    data: addresses,
    error,
    isLoading,
  } = useSWR<IAddress[]>(
    session?.user?.name ? `/api/address/user?userName=${session.user.name}` : null,
    fetcher
  );

  // Add this useEffect to set initial places when addresses are loaded
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setPlaces(() => addresses); 
    }
  }, [addresses, setPlaces]);

  // Add state for map center and zoom


  useEffect(() => {
    if (!places?.length || !map) return;

    try {
      // Initialize bounds
      const bounds = new google.maps.LatLngBounds();

      // Add each place to bounds
      places.forEach((place: IAddress) => {
        const lat = Number(place.lat);
        const lng = Number(place.lng);

        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend(new google.maps.LatLng(lat, lng));
        }
      });

      // Use the map's fitBounds method to adjust the map's center and zoom

      map.fitBounds(bounds);
    } catch (error) {
      console.error("Error calculating bounds:", error);
    }
  }, [places, map]);
  // Function to calculate zoom based on the max difference between latitudes and longitudes


  const handleAddPlace = useCallback(async (selectedPlace: google.maps.places.PlaceResult) => {
    if (!selectedPlace?.geometry?.location) {
      console.error('No location data');
      return;
    }

    if (!session?.user) {
      console.error('No user session');
      return;
    }

    const newPlace = {
      name: session.user.name || '',
      address: selectedPlace.formatted_address || '',
      lat: selectedPlace.geometry.location.lat(),
      lng: selectedPlace.geometry.location.lng(),
      idAddressType: session.user.idAddressType || "",
      idOrganization: session.user.idOrganization || ""
    };
    try {
      // First, save to database
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlace),
      });

      const savedAddress = await response.json();
      if (!response.ok) throw new Error(savedAddress.message || "Failed to save address");

      // Then update local state with the saved address (including the DB-generated ID)
      setPlaces((prev: IAddress[]) => [...prev, savedAddress]);
      setSearchQuery('');
      mutate("/api/addresses"); // Refresh addresses data
    } catch (error) {
      console.error("Error saving address:", error);
      // Handle error (show toast, notification, etc.)
    }
  }, [session, setPlaces, setSearchQuery]);

  const handleRemovePlace = useCallback(async (id: string) => {
    try {
      // First, delete from database
      const response = await fetch(`/api/addresses?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete address");
      }

      // Then update local state
      setPlaces(prev => prev.filter(place => place.id !== id));
      mutate("/api/addresses"); // Refresh addresses data
    } catch (error) {
      console.error("Error deleting address:", error);
      // Handle error (show toast, notification, etc.)
    }
  }, [setPlaces]);

  // Update handlePlaceSelect to use handleAddPlace
  const handlePlaceSelect = useCallback(async () => {
    if (places.length >= 4) {
      alert('Maximum of 4 locations allowed');
      setSearchQuery('');
      return;
    }

    const selectedPlace = autocompleteRef.current?.getPlace();
    if (selectedPlace) {
      await handleAddPlace(selectedPlace);
    }
  }, [places.length, handleAddPlace, setSearchQuery]);

  // Add handleSearchChange function
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    if (!autocompleteRef.current && searchInputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ['name', 'formatted_address', 'geometry'],
      });
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    }
  }, [setSearchQuery, handlePlaceSelect]);

  const isGoogleLoaded = typeof google !== 'undefined';

  // Loading states
  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-[600px] bg-white">
        <div className="relative w-12 h-12">
          <div className="absolute w-12 h-12 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute w-12 h-12 border-4 border-primary rounded-full animate-ping opacity-25"></div>
        </div>
      </div>
    );
  }

  if (error) return <div>Failed to load.</div>;


  return (
    <div className="flex h-screen w-full relative">
      {/* Left Sidebar */}
      <div className={`bg-white h-full transition-all duration-300 ease-in-out relative
        ${isExpanded ? 'w-[400px]' : 'w-0'} border-r border-gray-200`}>
        {/* Search Panel */}
        <div className="p-4">
          <div className="relative flex items-center">
            <FaSearch className="absolute left-3 text-gray-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              placeholder={`Search locations`}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md 
                focus-visible:ring-rojo1 focus-visible:outline-none focus-visible:ring-1"
              disabled={places.length >= 4}
            />
          </div>
        </div>

        {/* Places List */}
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {places.map((place, index) => (
            <div
              key={place.id}
              className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 relative"
            >
              {/* Header with ID, Video Icon, and Speed */}
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium text-gray-800">
                    {formatPlaceId(place.id)}
                  </span>
                  <FaVideo
                    className="text-gray-500 text-xl cursor-pointer hover:text-gray-700"
                    onClick={() => {/* Handle video call */ }}
                  />
                </div>
                <span className="text-gray-600 hover:text-gray-800 text-sm font-medium cursor-pointer" onClick={() => handleRemovePlace(place.id)}>
                  X
                </span>
              </div>

              {/* Address with Icon */}
              <div className="flex items-start gap-2 mb-2">
                <MdLocationOn className="text-gray-400 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-900">
                  {place.address}
                </div>
              </div>

              {/* Driver Name with Icon */}
              <div className="flex items-center gap-2 ml-1">
                <FaUser className="text-gray-400 text-sm" />
                <span className="text-sm text-gray-600">
                  {place.name || 'Unknown Driver'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapse Toggle Button - Positioned half on sidebar, half on map */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute top-4 z-50 bg-white shadow-md hover:bg-gray-50 
          w-6 h-6 flex items-center justify-center rounded-full
          transition-all duration-300 border border-gray-200
          ${isExpanded ? 'left-[400px]' : 'left-0'}`}
        style={{ transform: 'translateX(-50%)' }}
      >
        <MdChevronLeft
          className={`text-xl transition-transform duration-200
            ${isExpanded ? '' : 'rotate-180'}`}
        />
      </button>

      <div className="flex-1">

        <Map
          key={mapKey}
          className='w-full h-full'
          defaultCenter={INITIAL_CENTER}
          defaultZoom={DEFAULT_ZOOM}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              position={{
                lat: Number(place.lat),
                lng: Number(place.lng),
              }}
              icon={isGoogleLoaded ? {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(createMarkerSVG()),
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32),
              } : undefined}
              label={isGoogleLoaded ? {
                text: `${getAddressSummary(place.address)}`,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                className: 'absolute bg-black text-white px-2 py-1 rounded-md shadow-md'
              } : undefined}
              title={place.name}
            />

          ))}
        </Map>
      </div>
    </div>
  );
};

export default GoogleMapDispatch;

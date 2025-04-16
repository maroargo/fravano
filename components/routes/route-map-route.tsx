"use client";

import React, { useEffect, useState, useRef } from "react";
import { Map, useMapsLibrary, useMap, Marker } from "@vis.gl/react-google-maps";
import { IRouteDetail } from "@/interfaces/route";
import { useToast } from "@/hooks/use-toast";

interface RouteMapProps {
    fields: IRouteDetail[]; // Ensure `fields` is passed as an array of IRouteDetail
}

const RouteMapRoute: React.FC<RouteMapProps> = ({ fields }) => {
    const route = fields || [];
    if (route.length < 2) return <></>;

    // Ensure each route detail has a destination
    const filteredRoute = route.filter((detail) => detail.address);
    if (filteredRoute.length > 1) {
        return (
            <Map
                className="w-full h-full"
                defaultCenter={{ lat: route[0].lat, lng: route[0].lng }}
                defaultZoom={12}
                gestureHandling="greedy"
                fullscreenControl={false}
                mapId="bf51a910020fa25a"
            >
                <Directions
                    start={route[0]} // Start is the first route detail
                    end={route[route.length - 1]} // End is the last route detail
                    stops={route.length > 2 ? route.slice(1, -1) : undefined} // Stops are all but the first and last
                />
            </Map>
        );
    }
    if (filteredRoute.length === 1) {
        return (
            <Map
                className="w-full h-full"
                defaultCenter={{ lat: route[0].lat, lng: route[0].lng }}
                defaultZoom={12}
                gestureHandling="greedy"
                fullscreenControl={false}
                mapId="bf51a910020fa25a"
            >
                {/* Optionally, add a marker for the single destination */}
                <Marker position={{ lat: route[0].lat, lng: route[0].lng }} />
            </Map>
        )
    }
};

interface DirectionsProps {
    start: IRouteDetail; // Starting point
    end: IRouteDetail; // Ending point
    stops?: IRouteDetail[]; // Optional stops
}

const Directions: React.FC<DirectionsProps> = ({ start, end, stops }) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const {toast} = useToast()
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

    // Set up DirectionsService and DirectionsRenderer
    useEffect(() => {
        
        if (!routesLibrary || !map) return;

        const directionsServiceInstance = new routesLibrary.DirectionsService();
        const renderer = new routesLibrary.DirectionsRenderer({ map });
        directionsRendererRef.current = renderer;  // Persist directionsRenderer instance
        setDirectionsService(directionsServiceInstance);
        setDirectionsRenderer(renderer);
    }, [routesLibrary, map]);

    // Render directions whenever start, end, or stops change
    useEffect(() => {
        if (
            !directionsService ||
            !directionsRenderer ||
            !directionsRendererRef.current ||
            !start.address ||
            !end.address ||
            !start.lat ||
            !start.lng ||
            !end.lat ||
            !end.lng
        ) {
            return;
        }
        const waypoints = stops?.map((stop) => ({
            location: stop.address,
            stopover: false,
        })) || [];

        directionsService.route({
            origin: start.address,
            destination: end.address,
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints,
            provideRouteAlternatives: true,
        })
            .then((response) => {
                directionsRendererRef.current?.setDirections(response);
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "Error",
                    description: "Error fetching directions:"
                })
            });

    }, [directionsService, directionsRenderer, start, end, stops]);

    return null;
};

export default RouteMapRoute;

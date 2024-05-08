"use client";

import { useState, useEffect, useMemo } from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
  InfoWindow,
} from "@react-google-maps/api";

export default function Map({ data }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [map, setMap] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [labelData, setLabelData] = useState(data);

  //map styling

  const mapStyle = [
    {
      featureType: "landscape.natural",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#e0efef",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "on",
        },
        {
          hue: "#1900ff",
        },
        {
          color: "#c0e8e8",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          lightness: 100,
        },
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [
        {
          visibility: "on",
        },
        {
          lightness: 700,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [
        {
          color: "#7dcdcd",
        },
      ],
    },
  ];

  const mapStyles = {
    height: "70vh",
    width: "133%",
  };

  const defaultCenter = {
    lat: 0,
    lng: 0,
  };

  //center and fit

  useEffect(() => {
    if (map && data.length > 0) {
      const newBounds = new window.google.maps.LatLngBounds();
      data.forEach((event) => {
        const [lat, lng] = event.lat_long.split(",").map(parseFloat);
        newBounds.extend(new window.google.maps.LatLng(lat, lng));
      });
      setBounds(newBounds);
      map.fitBounds(newBounds, {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100,
      });
    }
  }, [map, data]);

  //format

  const duration = useMemo(
    () => (date) => {
      const format = date.split(":");
      let result = "";
      if (parseInt(format[0]) > 0) {
        result += `${format[0]} hrs`;
      }
      if (parseInt(format[1]) > 0) {
        result += ` ${format[1]} mins`;
      }
      return result.trim();
    },
    []
  );
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_AUTH_TOKEN,
      },
    };

    Promise.all(
      data.map((item) => {
        const [lat, long] = item.lat_long.split(",");
        const formattedLat = parseFloat(lat).toFixed(2);
        const formattedLong = parseFloat(long).toFixed(2);
        return fetch(
          `https://api.foursquare.com/v3/places/search?ll=${formattedLat},${formattedLong}`,
          options
        ).then((response) => response.json());
      })
    )
      .then((responses) => {
        const updatedData = data.map((item, index) => {
          const placeName =
            responses[index]?.results[0]?.name || "Unknown Place";
          const placeCategory =
            responses[index]?.results[0]?.categories[0]?.name ||
            "Unknown Category";
          return { ...item, placeName, placeCategory };
        });
        setLabelData(updatedData);
      })
      .catch((err) => console.error(err));
  }, [data]);

  return (
    <section className="w-3/4">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={12}
          center={bounds ? null : defaultCenter}
          options={{
            styles: mapStyle,
          }}
          onLoad={(map) => setMap(map)}
        >
          {labelData.map((event, index) => {
            const [lat, lng] = event.lat_long.split(",").map(parseFloat);
            return (
              <Marker
                key={index}
                position={{ lat, lng }}
                label={{
                  text: `${duration(event.activity_duration_formatted)}
                  ${event.placeName}
                  ${event.placeCategory}`,
                  color: "black",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                icon={{
                  url: "https://static.vecteezy.com/system/resources/previews/011/016/930/original/location-pin-3d-image-for-travel-equipment-location-pin-with-red-color-shade-in-a-3d-effect-gps-location-pin-on-a-transparent-background-free-png.png",
                  scaledSize: new window.google.maps.Size(70, 70),
                }}
                onMouseOver={() => setSelectedEvent(event)}
                onMouseOut={() => setSelectedEvent(null)}
              />
            );
          })}

          {selectedEvent && (
            <InfoWindow
              options={{ pixelOffset: { width: 0, height: -67 } }}
              position={{
                lat: parseFloat(selectedEvent.lat_long.split(",")[0]),
                lng: parseFloat(selectedEvent.lat_long.split(",")[1]),
              }}
              onCloseClick={() => setSelectedEvent(null)}
            >
              <div
                onMouseOver={() => setSelectedEvent(selectedEvent)}
                onMouseOut={() => setSelectedEvent(null)}
              >
                <h2 className="mb-2 text-sm font-bold">
                  {new Date(selectedEvent.start_ts).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  to{" "}
                  {new Date(selectedEvent.end_ts).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </h2>
                <h2 className="text-sm">
                  {duration(selectedEvent.activity_duration_formatted)}
                </h2>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </section>
  );
}

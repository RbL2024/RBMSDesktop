import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { SlCursor } from 'react-icons/sl';
import './gpstrackingPage.css';


export default function GpstrackingPage() {
    const [bikeCoords, setBikeCoords] = useState([]);
    // Get current date and time
    const getCurrentDateTime = () => {
        const currentDate = new Date();
        const options = { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
        return currentDate.toLocaleDateString("en-US", options);
    };


    const defaultBike = bikeCoords;

    const [selectedPlace, setSelectedPlace] = useState(defaultBike.place);
    const [selectedBike, setSelectedBike] = useState({ number: defaultBike.number });
    const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());
    const [mapCoordinates, setMapCoordinates] = useState({ lat: parseFloat(defaultBike.map((bike) => bike.lat)), lng: parseFloat(defaultBike.map((bike) => bike.lng)) });

    const handleBikeClick = (bikeName) => {
        const location = bikeName;

        if (location) {
            setMapCoordinates({ lat: location.lat, lng: location.lng });
            setSelectedPlace(location.place);
            setSelectedBike({ number: location.bikeInfo.bike_id });
            setCurrentDateTime(getCurrentDateTime());
        }
    };

    useEffect(() => {
        // Initialize the map
        let map;
        let marker;
        window.initMap = () => {
            const mapOptions = {
                center: mapCoordinates,
                zoom: 19,
            };
            map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

            marker = new window.google.maps.Marker({
                position: mapCoordinates,
                map: map,
                title: selectedPlace,
            });

        };
        // Function to update the marker's position
        const updateMarkerPosition = (newCoordinates) => {
            if (marker) {
                marker.setPosition(newCoordinates);
                map.panTo(newCoordinates); // Optional: Pan the map to the new position
            }
        };
        const loadMap = async () => {
            try {
                await window.api.loadGoogleMaps();
                initMap();
            } catch (error) {
                console.error('Error loading Google Maps:', error);
            }
        };

        loadMap();
    }, [bikeCoords, mapCoordinates, selectedPlace]);

    const getBikeCoords = async () => {
        try {
            const response = await window.api.getBikeCoords();
            if (response) {
                setBikeCoords(response);
            }
        } catch (error) {
            console.error('Error getting bike coordinates:', error);
        }
    }


    useEffect(() => {
        
        getBikeCoords();
    }, []);
    return (
        <Box className="gps-tracking-container" display="flex" p={4} flexDirection={{ base: 'column', lg: 'row' }}>
            {/* Left Section */}
            <VStack
                className="left-section"
                p={4}
                mb={10}
                borderRadius="20px"
                w={{ base: "100%", lg: "30%" }}
                align="start"
                spacing={2}
                backgroundColor="#E2E2D5"
                maxHeight="80%"
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" w="100%">
                    <Text fontSize="25px" fontWeight="bold">{selectedBike.number}</Text>
                </Box>
                <Text fontSize="sm" color="#4C4C4C">{currentDateTime}</Text>

                <HStack w="100%" mt={1} align="flex-start">
                    {/* <SlCursor color="#6E260E" /> Adjusted margin bottom to align at the top */}
                    <Text fontSize="sm" color="#000000" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" w="calc(100% - 25px)">
                        {selectedPlace}
                    </Text>
                </HStack>

                {/* Bikes List */}
                <VStack
                    w="100%"
                    p={5}
                    mt={6}
                    backgroundColor="#B8B8B8"
                    spacing={3}
                    borderRadius="25px"
                    maxHeight="380px" // Adjust this to control the height
                    overflowY="auto" // Enable vertical scrolling when the content overflows
                >
                    {bikeCoords.map((bike, index) => (
                        <Box
                            key={index}
                            w="100%"
                            p={2}
                            textAlign="center"
                            backgroundColor="#DADADA"
                            borderRadius="20px"
                            fontWeight="medium"
                            color="#333"
                            onClick={() => handleBikeClick(bike)}
                            style={{ cursor: "pointer", transition: "all 0.3s ease" }} // Smooth transition
                            _hover={{
                                backgroundColor: "#9C9C9C",  // Change background color on hover
                                transform: "scale(1.05)",  // Slightly scale the item on hover
                            }}
                        >
                            {bike.bikeInfo.bike_name}
                        </Box>
                    ))}
                </VStack>
            </VStack>

            {/* Right Section */}
            <Box className="right-section" w="70%" ml={4} p={4} bg="#E2E2D5" borderRadius="20px" mr={200} marginBottom={5}>
                <Box className="map-container" mb={1} position="relative">
                    <div id="map" style={{ width: '100%', height: '570px' }}></div>
                </Box>
            </Box>
        </Box>
    );
}

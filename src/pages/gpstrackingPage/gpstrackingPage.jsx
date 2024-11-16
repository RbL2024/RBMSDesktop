import React, { useEffect, useState } from 'react';
import { Box, Text, Avatar, IconButton, VStack, HStack, Spacer, Tooltip } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import './gpstrackingPage.css';

import { PiListNumbersFill } from "react-icons/pi";
import { RiTimerFill } from "react-icons/ri";
import { SlCursor } from "react-icons/sl";
import { MdDirectionsBike } from "react-icons/md";

import fernandez from '../../assets/images/dashboard/profile.png';
import edgar from '../../assets/images/profile/edgar.png';
import naths from '../../assets/images/profile/naths.png';
import irish from '../../assets/images/profile/irish.png';
import bio from '../../assets/images/profile/bio.png';

export default function GpstrackingPage() {
    const [selectedAvatar, setSelectedAvatar] = useState(fernandez); // Track the selected avatar
    const [selectedName, setSelectedName] = useState("Mariella Angelica Fernandez"); // Track the selected avatar's name
    const [selectedPlace, setSelectedPlace] = useState("Acacia St. San Jose"); // Track the selected avatar's place
    const [mapCoordinates, setMapCoordinates] = useState({ lat: 14.7317392, lng: 121.1327249 }); // Default location
    const [userCoordinates, setUserCoordinates] = useState(null);

    // User data with different locations and names
    const userData = [
        { avatar: fernandez, name: "Mariella Angelica Fernandez", coordinates: { lat: 14.7317392, lng: 121.1327249 }, place: "Acacia St. San Jose" },
        { avatar: edgar, name: "Edgar Apostol", coordinates: { lat: 14.738878, lng: 121.142798 }, place: "Magallanes St. San Juan" },
        { avatar: naths, name: "Nathalie Reyes", coordinates: { lat: 14.7337392, lng: 121.1347249 }, place: "Luna St. Mandaluyong" },
        { avatar: irish, name: "Irish Dela Cruz", coordinates: { lat: 14.7347392, lng: 121.1357249 }, place: "Tandang Sora Quezon City" },
        { avatar: bio, name: "Bio Dizon", coordinates: { lat: 14.7357392, lng: 121.1367249 }, place: "Makati Ave. Makati" }
    ];

    // Handle avatar click: update map coordinates and place
    const handleAvatarClick = (avatar, name, coordinates, place) => {
        setSelectedAvatar(avatar); // Update selected avatar image
        setSelectedName(name); // Update selected avatar name
        setSelectedPlace(place); // Update selected place
        setMapCoordinates(coordinates); // Update map coordinates for the selected user

        // Reverse geocode the coordinates into a place name
        const geocoder = new window.google.maps.Geocoder();
        const latLng = new window.google.maps.LatLng(coordinates.lat, coordinates.lng);

        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    setSelectedPlace(results[0].formatted_address); // Set the address as the current place
                } else {
                    console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    };

    // Get current geolocation of the user
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserCoordinates({ lat: latitude, lng: longitude });

                // Reverse geocode the coordinates into a place name
                const geocoder = new window.google.maps.Geocoder();
                const latLng = new window.google.maps.LatLng(latitude, longitude);

                geocoder.geocode({ location: latLng }, (results, status) => {
                    if (status === 'OK') {
                        if (results[0]) {
                            setSelectedPlace(results[0].formatted_address); // Set the address as the current place
                        } else {
                            console.log('No results found');
                        }
                    } else {
                        console.log('Geocoder failed due to: ' + status);
                    }
                });
            });
        }
    }, []);

   //TEST//
    // Add CSS for fade-in and fade-out animations
const styles = document.createElement("style");
styles.innerHTML = `
  .fade-in {
    opacity: 0;
    transition: opacity 0.5s ease-in;
  }
  .fade-in.show {
    opacity: 1;
  }
  .fade-out {
    opacity: 1;
    transition: opacity 0.5s ease-out;
  }
  .fade-out.hide {
    opacity: 0;
  }
`;
document.head.appendChild(styles);

useEffect(() => {
    // Initialize the map when the component mounts or when coordinates or name change
    window.initMap = () => {
        const mapOptions = {
            center: mapCoordinates,
            zoom: 19,
        };
        const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

        // Create marker based on the selected coordinates
        const miniName = selectedName.split(" ").slice(0, 2).join(" ");
        const marker = new window.google.maps.Marker({
            position: mapCoordinates,
            map: map,
            title: miniName,
        });

        // Create info window content with fade-in and fade-out animations
        const infoWindowContent = document.createElement("div");
        infoWindowContent.classList.add("fade-in");
        infoWindowContent.innerHTML = `
          <div style="font-size: 12px; color: #4A4A4A; padding: 8px; text-align: center;">
              <h5 style="font-size: 12px; color: #2A2A2A; margin: 0; padding: 4px; background-color: #D0D0D0; 
              border-radius: 3px;">${selectedPlace}</h5>
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
            content: infoWindowContent,
        });

        // Show the info window with fade-in effect
        const showInfoWindow = () => {
            infoWindow.open(map, marker);
            infoWindowContent.classList.add("show");
            setTimeout(() => {
                infoWindowContent.classList.replace("fade-in", "fade-out");
                setTimeout(() => {
                    infoWindow.close();
                    infoWindowContent.classList.remove("show", "fade-out");
                    infoWindowContent.classList.add("fade-in");
                }, 500); // Adjust timing for fade-out
            }, 3000); // Display for 3 seconds
        };

        // Open the info window with fade-in effect when the map loads
        showInfoWindow();

        // Set event listener for marker click to show and then fade out info window
        marker.addListener('click', showInfoWindow);
    };

    const loadMap = async () => {
        try {
            await window.api.loadGoogleMaps(); // Replace with your actual API key
            initMap();
        } catch (error) {
            console.error('Error loading Google Maps:', error);
        }
    };

    loadMap();
}, [mapCoordinates, selectedName, selectedPlace]);

   //TEST//
    
    return (
        <Box className="gps-tracking-container" display="flex" p={4} flexDirection={{ base: 'column', lg: 'row' }}>
            {/* Left Section - Info & Profile */}
            <VStack className="left-section" p={4} mb={10} borderRadius="20px" w={{ base: "100%", lg: "30%" }} align="start" spacing={2} backgroundColor='#E2E2D5' maxHeight="70%" height={120}>
                <Box display="flex" justifyContent="space-between" alignItems="center" w="100%">
                    <Text fontSize="25px" fontWeight="bold">#014</Text>
                    <IconButton icon={<FaTimes />} variant="ghost" aria-label="Close" mt={-6} borderRadius="full" border="2px solid" fontSize={15} color='#4C4C4C' />
                </Box>
                <Text fontSize="sm" color="#4C4C4C" mt={-5}>11/14/2024, 12:24 AM</Text>
                <HStack mt={2} w="100%">
                    <SlCursor color="#6E260E" style={{ marginTop: '-35px' }} />
                    <Text fontSize="sm" color='#000000' mt={-5} overflow='hidden' textOverflow='ellipsis' whiteSpace='nowrap' width='cal(100% -25px)' display='inline-block'>{selectedPlace}</Text> {/* Display the selected place */}
                </HStack>

                <Spacer flex="1" />

                <Box mt={85} mb={5} p={3} backgroundColor="#E2E2D5" borderRadius="20">
                    <Box className="profile-section" textAlign="center" mt={-47} mb={0} paddingTop={10}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Avatar
                                alt="Description of image"
                                src={selectedAvatar}
                                sx={{ width: 100, height: 100 }}
                            />
                        </div>

                        <Text fontWeight="bold" mb={5}>{selectedName}</Text>

                        <HStack spacing={2} justifyContent="center" mt={180} mb={-5}>
                        <Box
                            className="info-card"
                            style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            width: '100px', // Define a fixed width for truncation
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                            }}
                        >
                            <PiListNumbersFill style={{ fontSize: '1.5rem', color: '#587088' }} />
                                <br />
                                <span style={{ fontSize: '1rem',  color: '#333' }}>BID-JUVKA</span>
                                <br />
                                <span style={{ fontSize: '0.9rem', color: '#587088', marginTop: '10' }}>Bike ID</span>
                                </Box>
                        
                        <Box
                            className="info-card"
                            style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            width: '100px', // Define a fixed width for truncation
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                            }}
                        >
                        <RiTimerFill style={{ fontSize: '1.5rem', color: '#587088' }} />
                                <br />
                                <span style={{ fontSize: '1rem',  color: '#333' }}>2:00 hr/s</span>
                                <br />
                                <span style={{ fontSize: '0.9rem', color: '#587088', marginTop: '10' }}>Duratiion Time</span>
                                </Box>
                                            
                        <Box
                            className="info-card"
                            style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            width: '100px', // Define a fixed width for truncation
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                            }}
                        >
                            <MdDirectionsBike style={{ fontSize: '1.5rem', color: '#587088' }} />
                                <br />
                                <span style={{ fontSize: '1rem',  color: '#333', maxHeight:'40' }}>Japanese Bike</span>
                                <br />
                                <span style={{ fontSize: '0.9rem', color: '#587088', marginTop: '10' }}>Bike Type</span>
                                </Box>
                        </HStack>
                    </Box>
                </Box>
            </VStack>

            {/* Right Section - Map & Avatars */}
            <Box className="right-section" w="70%" ml={4} p={4} bg="#E2E2D5" borderRadius="20px" mr={200}>
                <Box position="absolute" top="10px" left="55%" transform="translateX(-50%)" display="flex" gap="10px" justifyContent="center" marginTop={3} mb={5}>
                    {userData.map((user, index) => (
                        <Tooltip key={index} label={user.name} aria-label={`Tooltip for ${user.name}`}>
                        <Avatar
                            size="md"
                            src={user.avatar}
                            onClick={() => handleAvatarClick(user.avatar, user.name, user.coordinates, user.place)}
                            cursor="pointer"
                        />
                    </Tooltip>
                    ))}
                </Box>

                {/* Map */}
                <Box className="map-container" mt={10} position="relative">
                    <div id="map" style={{ width: '100%', height: '500px' }}></div>
                </Box>
            </Box>
        </Box>
    );
} 
import React, { useEffect } from 'react';
import { Box, Text, Avatar, IconButton, VStack, HStack, Spacer } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import './gpstrackingPage.css';

import { RiCornerUpRightLine } from "react-icons/ri";
import { RiTimerFill } from "react-icons/ri";
import { SlCursor } from "react-icons/sl";
import { MdDirectionsBike } from "react-icons/md";


import fernandez from '../../assets/images/profile/mf.png'; // Adjust the path accordingly
import edgar from '../../assets/images/profile/edgar.png'; // Adjust the path
import naths from '../../assets/images/profile/naths.png';
import irish from '../../assets/images/profile/irish.png';
import bio from '../../assets/images/profile/bio.png';

export default function GpstrackingPage() {
    
    return (
        <Box className="gps-tracking-container" display="flex" p={4}>
            {/* Left Section - Info & Profile */}
            <VStack className="left-section" p={4} mb={20} borderRadius="40px" w="30%" align="start" spacing={2} backgroundColor='#E2E2D5' >
                <Box display="flex" justifyContent="space-between" alignItems="center" w="100%" >
                    <Text fontSize="25px" fontWeight="bold">#014</Text>
                    <IconButton icon={<FaTimes />} variant="ghost" aria-label="Close" mt={-6} borderRadius="full" border="2px solid" fontSize={15} color='#4C4C4C' />
                </Box>
                <Text fontSize="sm" color="#4C4C4C" mt={-5}>11/14/2024, 12:24 AM</Text>
                <HStack mt={2} w="100%">
                    <SlCursor color="#6E260E" style={{ marginTop: '-35px' }} />
                    <Text fontSize="sm" color='#000000' mt={-5}>Acacia St. San Jose</Text>
                </HStack>

                <Spacer flex="1" />

                {/* New Box inside the profile-section */}
                <Box mt={0} mb={5} p={2} backgroundColor="#B8B8B8" borderRadius="20">
                    <Box className="profile-section" textAlign="center" mt={-86} mb={0} paddingTop={10}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Avatar
                                alt="Description of image"
                                src={fernandez}
                                sx={{ width: 100, height: 100 }}
                            />
                        </div>

                        <Text fontWeight="bold" mb={-5}>Mariella Angelica Fernandez</Text>
                        <HStack spacing={2} justifyContent="center" mt={190} mb={-5}>
                            <Box className="info-card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center'
                                }} >
                                <RiCornerUpRightLine
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        fontSize: '1.5rem',
                                        color: '#587088',
                                    }}
                                />
                                <br />
                                2.3 mi<br />distance
                            </Box>
                            <Box className="info-card">
                                <RiTimerFill
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        fontSize: '1.5rem',
                                        justify: 'center',
                                        color: '#587088',
                                        marginLeft: '25px'
                                    }}
                                />
                                <br />
                                1:30 mins<br />timer
                            </Box>
                            <Box className="info-card">
                                <MdDirectionsBike
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        fontSize: '1.5rem',
                                        justify: 'center',
                                        color: '#587088',
                                        marginLeft: '25px'
                                    }}
                                />
                                <br />
                                Jap. bike<br />Adult bike
                            </Box>
                        </HStack>
                    </Box>
                </Box>
            </VStack>

            {/* Right Section - Map & Avatars */}
            <Box className="right-section" w="70%" ml={4} p={4} bg="#E2E2D5" borderRadius="20px" mr={200}>
                <VStack spacing={3} align="start">
                    {[edgar, naths, irish, bio].map((image, index) => (
                        <Avatar key={index} size="md" src={image} />
                    ))}
                </VStack>
                <Box className="map-container" mt={4}>
                    <div id="map" style={{ width: '100%', height: '400px' }}></div>
                </Box>
            </Box>
        </Box>
    );
}

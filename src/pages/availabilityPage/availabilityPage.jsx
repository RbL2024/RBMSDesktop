import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import './availabilityPage.css';
import { Box, Text, Grid, GridItem, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useToast } from '@chakra-ui/react';
import { FormControl, InputGroup, Input, InputLeftAddon, InputRightElement } from '@chakra-ui/react';
import { FiSearch } from "react-icons/fi";
import { CloseIcon } from '@chakra-ui/icons';


import WalkinPage from '../walkinPage/walkinPage.jsx'; // Correct relative import path

export default function AvailablityPage() {
    const inputRef = useRef(null);
    const [fetchedBikes, setFetchedBikes] = useState([]);
    const [bikeIdToDelete, setBikeIdToDelete] = useState(null);
    const [selectedBike, setSelectedBike] = useState(null); // State for the clicked bike
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isSuccessOpen, onOpen: onSuccessOpen, onClose: onSuccessClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [superadmin, setSuperadmin] = useState('');
    const toast = useToast();
    const [isWalkInPage, setIsWalkInPage] = useState(false);  // State to control Walk-In page visibility


    const handleSearch = useCallback(() => {
        const inputValue = 'BID-' + inputRef.current.value.trim();
        console.log(inputValue);
        // Implement search logic here
    }, []);

    const fetchBikes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await window.api.fetchBikes();
            // console.log(res)
            setFetchedBikes(res);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch bikes. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleRemoveBike = async (bikeId) => {
        try {
            const response = await window.api.deleteBike(bikeId);
            if (response.success) {
                onSuccessOpen();  // Open the success modal
                setFetchedBikes((prevBikes) => prevBikes.filter(bike => bike.bike_id !== bikeId));  // Remove bike from state
            } else {
                console.error('Failed to delete bike:', response.message);
                setError('Failed to delete bike. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting bike:', error);
            setError('Error deleting bike. Please try again.');
        } finally {
            setBikeIdToDelete(null);
        }
    };

    const confirmDeleteBike = () => {
        if (bikeIdToDelete) {
            handleRemoveBike(bikeIdToDelete);
        }
        onClose();  // Close the modal
    };

    const handleVacantBikeClick = (bike) => { // Accept bike as a parameter
        setSelectedBike(bike); // Store clicked bike data
        setIsWalkInPage(true); // Switch to Walk-In Page when a vacant bike is clicked
    };

    useEffect(() => {
        fetchBikes();
        const intervalId = setInterval(fetchBikes, 5000);  // Fetch data every 5 seconds

        return () => clearInterval(intervalId);  // Cleanup interval on unmount
    }, [fetchBikes]);

    useEffect(() => {
        setSuperadmin(localStorage.getItem('isSAdmin'));
    }, []);

    const handleUnauthorized = () => {
        toast({
            title: 'Unauthorized',
            description: 'You do not have permission to do this action.',
            status: 'warning',
            duration: 3000,
            position: 'top',
            isClosable: true,
        });
    };

    const renderWalkInPage = () => (
        <WalkinPage bike={selectedBike} /> // Pass the selected bike data as a prop
    );



    return (
        <Box>


            {/* Conditionally render either Availability or Walk-In page */}
            {isWalkInPage ? renderWalkInPage() : (

                <Box mt='10px' w='950px' h='615px' rounded='2xl' shadow='lg' padding='20px' bg='#E2E2D5' overflowY='auto' className='BAvail'>
                    <Box className='legends' display='flex' justifyContent='space-between' w='900px' position='relative'>
                        <Box width='120px' display='flex' alignItems='center' justifyContent='center' gap='12px' ml='75px'>
                            <Box display='flex' alignItems='center' justifyContent='center' gap='5px'>
                                <Box boxSize='12px' bg='#E37383' />
                                <Text fontSize='sm' m={0} mt='2px'>Rented</Text>
                            </Box>
                            <Box display='flex' alignItems='center' justifyContent='center' gap='5px'>
                                <Box boxSize='12px' bg='#939393' />
                                <Text fontSize='sm' m={0} mt='2px'>Vacant</Text>
                            </Box>
                            <Box display='flex' alignItems='center' justifyContent='center' gap='5px'>
                                <Box boxSize='12px' bg='#4396BD' />
                                <Text fontSize='sm' m={0} mt='2px'>User</Text>
                            </Box>
                            <Box display='flex' alignItems='center' justifyContent='center' gap='5px'>
                                <Box boxSize='12px' bg='#f9f871' />
                                <Text fontSize='sm' m={0} mt='2px'>Reserved</Text>
                            </Box>
                        </Box>
                        <Box>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftAddon>
                                        BID-
                                    </InputLeftAddon>
                                    <Input
                                        w='200px'
                                        type='text'
                                        mb={5}
                                        placeholder='Search by bike id'
                                        ref={inputRef}
                                    />
                                    <InputRightElement>
                                        <FiSearch onClick={handleSearch} cursor="pointer" />
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                        </Box>
                    </Box>
                    <Grid templateColumns='repeat(4, 1fr)' gap={'30px'}>
                        {
                            fetchedBikes?.length === 0 ?
                                <Box display='flex' justifyContent='center' alignItems='center' w='100%' h='100%'>
                                    <Text fontSize={32} >No bikes available</Text>
                                </Box>
                                :
                                fetchedBikes?.map((bike) => (
                                    <GridItem
                                        key={bike.bike_id}
                                        w='175px'
                                        h='150px'
                                        bg='#FFFFFF'
                                        rounded='2xl'
                                        shadow='lg'
                                        p='10px'
                                        pos='relative'
                                    >
                                        {/* IMAGE CLICK HANDLER */}
                                        <Box position="absolute" top="0" left="0" right="0" bottom="0" zIndex="0">
                                            <img
                                                src={bike.bike_image_url} // Assuming bike.bike_image_url contains the URL of the image
                                                alt={`Bike ${bike.bike_id}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'fill',
                                                    opacity: bike.bike_status === "VACANT" ? '0.8' : '0.4', // Lower opacity for VACANT bikes
                                                    borderRadius: '12px',
                                                    cursor: bike.bike_status !== "VACANT" ? 'not-allowed' : 'pointer', // Not-allowed for non-VACANT bikes
                                                }}
                                                onClick={() => {
                                                    if (bike.bike_status === "VACANT") {
                                                        handleVacantBikeClick(bike); // Handle the click only if the bike is VACANT
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                                            <Text textAlign='center' m='0'>{bike.bike_id}</Text>
                                            <IconButton
                                                aria-label='Remove bike'
                                                icon={<CloseIcon />}
                                                size='sm'
                                                variant='ghost'
                                                colorScheme='red'
                                                onClick={() => {
                                                    if (superadmin === 'true') {
                                                        setBikeIdToDelete(bike.bike_id); // Set bike ID to delete
                                                        onOpen();
                                                    } else {
                                                        handleUnauthorized();
                                                    }
                                                }}
                                            />
                                        </Box>
                                        {bike.bike_status === 'RENTED' ? (
                                            <Box pos='relative' mt='25%'>
                                                <Box w='100%' h='30px' bg='#F8C8DC' rounded='md' display='flex' alignItems='center' justifyContent='space-between' p='10px' mb='5px'>
                                                    <Text m={0}>Rented</Text>
                                                    <Box boxSize='20px' bg='#E37383' rounded='md' />
                                                </Box>
                                                <Box w='100%' h='30px' bg='#A7C7E7' rounded='md' display='flex' alignItems='center' justifyContent='space-between' p='10px'>
                                                    <Text m={0}>{bike.customerInfo && bike.customerInfo.c_username ? bike.customerInfo.c_username : bike.temporaryInfo.t_username}</Text>
                                                    <Box boxSize='20px' bg='#4396BD' rounded='md' />
                                                </Box>
                                            </Box>
                                        ) : bike.bike_status === 'RESERVED' ? (
                                            <Box pos='relative' mt='46%'>
                                                <Box w='100%' h='30px' bg='#f9f871' rounded='md' display='flex' alignItems='center' justifyContent='space-between' p='10px' mb='5px'>
                                                    <Text m={0} width='100%' textAlign='center'>RESERVED</Text>
                                                </Box>
                                            </Box>
                                        ) : bike.bike_status === 'VACANT' ? (
                                            <Box pos='relative' mt='46%'>
                                                <Box w='100%' h='30px' bg='#939393' rounded='md' display='flex' alignItems='center' justifyContent='space-between' p='10px' mb='5px'>
                                                    <Text m={0} width='100%' textAlign='center' onClick={() => handleVacantBikeClick(bike)} cursor='pointer'>
                                                        VACANT
                                                    </Text>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Box>
                                                <Text m={0} width='100%' textAlign='center'>UNKNOWN STATUS</Text>
                                            </Box>
                                        )}
                                    </GridItem>

                                ))

                        }
                    </Grid>
                </Box>

            )}





            {/* Modal for bike deletion */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Deletion</ModalHeader>
                    <ModalBody>
                        <Text>Are you sure you want to delete this bike?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={confirmDeleteBike}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Success Modal */}
            <Modal isOpen={isSuccessOpen} onClose={onSuccessClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Success</ModalHeader>
                    <ModalBody>
                        <Text>The bike has been successfully removed.</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={onSuccessClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

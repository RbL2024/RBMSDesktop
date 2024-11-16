import React, { useEffect, useRef, useState, useCallback } from 'react';
import './availabilityPage.css';
import { Box, Text, Grid, GridItem, IconButton } from '@chakra-ui/react';
import {
    FormControl,
    InputGroup,
    Input,
    InputLeftAddon,
    InputRightElement
} from '@chakra-ui/react';
import { FiSearch } from "react-icons/fi";
import { CloseIcon } from '@chakra-ui/icons';

const fetchAllbikes = window.api;

export default function AvailablityPage() {
    const inputRef = useRef(null);
    const [fetchedBikes, setFetchedBikes] = useState([]);
    const [bikeToRemove, setBikeToRemove] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = () => {
        const inputValue = 'BID-' + inputRef.current.value;
        console.log(inputValue);
    };

    const fetchBikes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchAllbikes.fetchBikes('fetch-bikes');
            setFetchedBikes(res);
            // console.log(res);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch bikes. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleRemoveBike = async (bikeId) => {
        setBikeToRemove(bikeId); // Set the bike to be removed
        setTimeout(async () => {
            try {
                const response = await fetchAllbikes.deleteBike('delete-bike', bikeId);
                if (response.success) {
                    setFetchedBikes((prevBikes) => prevBikes.filter((bike) => bike.bike_id !== bikeId));
                } else {
                    console.error('Failed to delete bike:', response.message);
                }
            } catch (error) {
                console.error('Error deleting bike:', error);
            } finally {
                setBikeToRemove(null); // Reset the bike to remove after deletion
            }
        }, 300); // Delay to allow the fade-out animation
    };

    useEffect(() => {
        fetchBikes();
        const intervalId = setInterval(fetchBikes, 5000); // Fetch data every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [fetchBikes]);

    return (
        <Box>
            <Box className='legends' display='flex' justifyContent='space-between' w='950px' position='relative'>
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
            <Box mt='10px' w='950px' h='575px' rounded='2xl' shadow='lg' padding='20px' bg='#E2E2D5' overflowY='auto' className='BAvail'>
                <Grid templateColumns='repeat(5, 1fr)' gap={6}>
                    {fetchedBikes.map((bike) => (
                        <GridItem
                            key={bike.bike_id}
                            w='150px'
                            h='150px'
                            bg='#FFFFFF'
                            rounded='2xl'
                            shadow='lg'
                            p='10px'
                            pos='relative'
                            className={`bike-item ${bikeToRemove === bike.bike_id ? 'fade-out' : ''}`}
                        >
                            <Box position='absolute' top='0' left='0' right='0' bottom='0' zIndex='0'>
                                <img
                                    src={bike.bike_image_url} // Assuming bike.imageUrl contains the URL of the image
                                    alt={`Bike ${bike.bike_id}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'fill',
                                        opacity: '0.5', // Adjust opacity as needed
                                        borderRadius: '12px', // Match the rounded corners
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
                                    onClick={() => handleRemoveBike(bike.bike_id)}
                                />
                            </Box>
                            {bike.bike_status === 'RENTED' ? (
                                <Box pos='relative' mt='25%'>
                                    <Box w='100%' h='30px' bg='#F8C8DC' rounded='md' display='flex' alignItems='center' justifyContent='space-between' p='10px' mb='5px'>
                                        <Text m={0}>Rented</Text>
                                        <Box boxSize='20px' bg='#E37383' rounded='md' />
                                    </Box>
                                    <Box w='100%' h='30px' bg='#A7C7E7' rounded='md' display='flex' alignItems='center' justifyContent='space-between' p='10px'>
                                        <Text m={0}>User</Text>
                                        <Box boxSize='20px' bg='#4396BD' rounded='md' />
                                    </Box>
                                </Box>
                            ) : bike.bike_status === 'RESERVED' ? (
                                <Box pos='relative' mt='50%'>
                                    <Box w='100%' h='30px' bg='#f9f871' rounded='md' display='flex' alignItems='center' justifyContent='space-between' p='10px' mb='5px'>
                                        <Text m={0} width='100%' textAlign='center'>RESERVED</Text>
                                    </Box>
                                </Box>
                            ) : bike.bike_status === 'VACANT' ? (
                                <Box pos='relative' mt='50%'>
                                    <Box w='100%' h='30px' bg='#939393' rounded='md' display='flex' alignItems='center' justifyContent='space-between' p='10px' mb='5px'>
                                        <Text m={0} width='100%' textAlign='center'>VACANT</Text>
                                    </Box>
                                </Box>
                            ) : (
                                <Box>
                                    <Text m={0} width='100%' textAlign='center'>UNKNOWN STATUS</Text>
                                </Box>
                            )}
                        </GridItem>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

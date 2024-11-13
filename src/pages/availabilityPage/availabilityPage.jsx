import React, { useEffect, useRef, useState } from 'react';
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

    const handleSearch = () => {
        const inputValue = 'BID-' + inputRef.current.value;
        console.log(inputValue);
    };

    const fetchBikes = async () => {
        try {
            const res = await fetchAllbikes.fetchBikes('fetch-bikes');
            setFetchedBikes(res);
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    };

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
        const intervalId = setInterval(() => {
            fetchBikes(); // Fetch data every 5 seconds
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

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
                            {bike.bike_status === 'rented' ? (
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
                            ) : bike.bike_status === 'reserved' ? (
                                <Box pos='relative' mt='50%'>
                                    <Box w='100%' h='30px' bg='#f9f871' rounded='md' display='flex' alignItems='center' justifyContent='space-between' p='10px' mb='5px'>
                                        <Text m={0} width='100%' textAlign='center'>RESERVED</Text>
                                    </Box>
                                </Box>
                            ) : bike.bike_status === 'vacant' ? (
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

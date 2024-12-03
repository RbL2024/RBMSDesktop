import React, { useState } from 'react';
import {
    Box,
    Flex,
    Text,
    Input,
    Select,
    Button,
    Checkbox,
    Image,
    IconButton, 
    Stack
    
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';


const WalkinPage = ({ bike = {} }) => {
    const [duration, setDuration] = useState(1); // default duration set to 1
    const totalPrice = bike.bike_rent_price * duration; // calculate total price based on duration
  
    const increaseDuration = () => setDuration(prevDuration => prevDuration + 1);
    const decreaseDuration = () => setDuration(prevDuration => (prevDuration > 1 ? prevDuration - 1 : 1)); // Prevent going below 1
  

    return (
        <Box minH="100vh" p={6} display="flex" flexDirection="column" alignItems="center" marginRight={250} >
         
         <Button
            size="md"
            bg="#d9d9d9"
            fontWeight="medium"
            _hover={{ bg: "#c4c4c4" }}
            right={-350}
            >
            <span style={{ fontSize: "25px",  marginRight: "8px" }}>&#8592;</span> Available Bike
            </Button>   
            
            <Flex
                bg="#e5e4d7"
                borderRadius="15"
                boxShadow="md"
                w="100%"
                minH="70vh"
                p={6}
              
                direction="column"
                gap={4}
                mt={-50}
                marginRight={50}
            >
                {/* Form Section */}
                <Text fontSize="md" fontWeight="bold" mt={-1}>
                                    Walk in customers
                                </Text>
                <Flex justifyContent="flex-start" mb={1}>
                    <Box flex="1" mr={4}>
                        <Text mb={1}>First Name</Text>
                        <Input
                            placeholder="First Name"
                            borderColor="#d9d9d9"
                            backgroundColor="white"
                            w="50%"
                            size="md"
                        />
                    </Box>
                    <Box flex="1">
                        <Text mb={1}>Contact Number</Text>
                        <Input
                            placeholder="Contact Number"
                            backgroundColor="white"
                            borderColor="#d9d9d9"
                            w="50%"
                            size="md"
                        />
                    </Box>
                </Flex>
                <Flex justifyContent="space-between">
                    <Box flex="1" mr={4}>
                        <Text mb={1}>Last Name</Text>
                        <Input
                            placeholder="Last Name"
                            backgroundColor="white"
                            borderColor="#d9d9d9"
                            w="50%"
                            size="md"
                        />
                    </Box>
                    <Box flex="1">
                        <Text mb={1}>Age</Text>
                        <Input 
                            placeholder="Age" 
                            borderColor="#d9d9d9" 
                            backgroundColor="white"
                            w="50%"
                            size="md"
                        />
                    </Box>
                </Flex>

                {/* Bike Details Section */}
                <Flex 
                    bg="#f7f7f7"
                    borderRadius="md"
                    p={4}
                    mt={6}
                    boxShadow="sm"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    {/* Image Section */}
                    <Box textAlign="center" >
                    <Text fontSize="md" fontWeight="bold" mt={-1}>
                                    Bike Information
                                </Text>
                        <Image
                            src={bike.bike_image_url || "https://via.placeholder.com/200"}
                            alt={bike.bike_id || "Bike Image"}
                            boxSize="100%"
                            height="150px"
                            objectFit="cover"
                            borderRadius="md"
                            mt={-3}
                        />
                      
                        
                        <Text mt= {1} fontSize="sm" color="gray.500">
                            {bike.bike_status || "Unknown Status"}
                        </Text>
                    </Box>

                    {/* Bike Info Section */}
                    <Box flex="1" ml={6}>
                        {bike ? (
                            <Box >
                               
                                <Text fontSize="md" mt={-3}>
                                    <strong>Bike ID:</strong> {bike.bike_id || "N/A"}
                                </Text>
                                <Text fontSize="md" mt={-3}>
                                    <strong>Bike name:</strong> {bike.bike_name || "N/A"}
                                </Text>
                                <Text fontSize="md" mt={-3}>
                                    <strong>Bike type</strong> {bike.bike_type || "N/A"}
                                </Text>
                               
                                <Text fontSize="md" mt={-3}>
                                    <strong>Price:₱  </strong> {bike.bike_rent_price || "N/A"}
                                </Text>
                                
                                <Stack direction="row" align="center" mt={-3}>
                                <Text fontSize="md">
                                <strong>Duration of use:</strong> {duration} hours
                                </Text>
                                <IconButton
                                icon={<MinusIcon />}
                                onClick={decreaseDuration}
                                aria-label="Decrease Duration"
                                mt={-5}
                                backgroundColor="#32BE9B"
                                _hover={{ backgroundColor: "#50C878" }}
                                size="xs"
                                />
                                <IconButton
                                icon={<AddIcon />}
                                onClick={increaseDuration}
                                aria-label="Increase Duration"
                                mt={-5}
                                backgroundColor="#32BE9B"
                                _hover={{ backgroundColor: "#50C878" }}
                                size="xs"
                                />
                            </Stack>

                            <Text fontSize="md" mt={1} color="red">
                                <strong>Total Price: ₱ </strong> {totalPrice || 'N/A'}
                            </Text>
                            
                            </Box>
                        ) : (
                            <Text fontSize="md" color="gray.500">
                                No bike selected.
                            </Text>
                        )}
                    </Box>
                </Flex>

                {/* Checkbox and Rent Button */}
                <Flex alignItems="center" justifyContent="space-between" mt={1} mb={-3}>
                <Checkbox mt={-2}
                    colorScheme="green"
                    sx={{
                        'span.chakra-checkbox__control': {
                        backgroundColor: 'transparent', // Transparent background initially
                        borderColor: 'green.500', // Green border color
                        },
                        'span.chakra-checkbox__control[data-checked]': {
                        backgroundColor: 'green.500', // Green background when checked
                        borderColor: 'green.500', // Green border when checked
                        },
                    }}
                    >
                    Check this if you allow your child to rent this bike
                    </Checkbox>
                    <Button bg="#405c4f" color="white" _hover={{ bg: "#2e4437" }}>
                        RENT
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default WalkinPage;
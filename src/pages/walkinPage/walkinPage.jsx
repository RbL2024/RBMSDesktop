import React, { useState, useEffect } from 'react';
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
    Stack,
    InputGroup,
    InputLeftAddon,
    Divider,
    useToast
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import AvailabilityPage from '../availabilityPage/availabilityPage.jsx';



const cta = window.api;

const WalkinPage = ({ bike = {} }) => {
    const toast = useToast();
    const [duration, setDuration] = useState(1); // default duration set to 1
    const totalPrice = bike.bike_rent_price * duration; // calculate total price based on duration

    const increaseDuration = () => setDuration(prevDuration => prevDuration + 1);
    const decreaseDuration = () => setDuration(prevDuration => (prevDuration > 1 ? prevDuration - 1 : 1)); // Prevent going below 1

    const [contactNumber, setContactNumber] = useState('');
    const [currentPage, setCurrentPage] = useState('walkin'); // State to manage current page


    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const handleInputChange = (e) => {
        const value = e.target.value;

        // Only allow numeric values and restrict to a maximum of 3 digits
        if (/^\d*$/.test(value) && value.length <= 2) {
            setAge(value);
        }
    };

    const handleAvailableBikeClick = () => {
        setCurrentPage('availability'); // Change the current page to availability
    };

    const clearInputs = () => {
        setFirstName('');
        setLastName('');
        setUsername('');
        setEmail('');
        setAge('');
        setContactNumber('');
    }

    const handleRent = async () => {
        function tempPass(length) {
            let result = '';
            // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            // const characters = '0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            return result;
        }

        const getcurrentTime = getCurrentTimeInAMPM();
        const tor = convertSecondsToTimeWithAMPM(convertTimeToSeconds(getcurrentTime, duration));

        const walkinInfo = {
            name: firstName + ' ' + lastName,
            username: username,
            password: tempPass(5),
            phone: '0' + contactNumber,
            email: email,
            age: age,
            tExp: duration
        }

        const walkinRentInfo = {
            name: firstName + ' ' + lastName,
            phone: '0' + contactNumber,
            email: email,
            bike_id: bike.bike_id,
            duration: duration,
            timeofuse: getcurrentTime,
            returnTime: tor,
            totalBikeRentPrice: totalPrice
        }


        if (firstName === "", lastName === "", username === "", email === "", contactNumber === "", age === "") {
            toast({
                title: 'Blank fields',
                description: 'Please fill out all fields.',
                status: 'error',
                duration: 3000,
                position: 'top',
                isClosable: true,
            });
            return;
        }

        try {

            const res = await cta.saveTempRent(walkinInfo, walkinRentInfo);
            console.log(res);

        } catch (error) {
            console.log('Error creating temporary account:', error);
        }

    }

    useEffect(() => {
        const handleTempAccCreated = (event) => {
            const res = event.detail;
            console.log(res.created);
            if (res.created) {
                toast({
                    title: res.message,
                    status: 'success',
                    duration: 2000,
                    position: 'top',
                    onCloseComplete: () => {
                        clearInputs();
                        setCurrentPage('availability');
                    }
                });
            } else {
                toast({
                    title: res.message,
                    status: 'error',
                    duration: 2000,
                    position: 'top',
                });
            }
        };

        window.addEventListener('temp-acc-created', handleTempAccCreated);

        return () => {
            window.removeEventListener('temp-acc-created', handleTempAccCreated);
        };
    }, []);

    if (currentPage === 'availability') {
        return <AvailabilityPage />; // Render the AvailabilityPage component
    }

    return (
        <Box minH="100vh" p={6} display="flex" flexDirection="column" alignItems="center" marginRight={250}>

            <Button
                size="md"
                bg="#405c4f"
                fontWeight="medium"
                color="white"
                _hover={{ bg: "#2e4437" }}
                right={-350}
                onClick={handleAvailableBikeClick}
            >
                <span style={{ fontSize: "20px", marginRight: "8px" }}>&#8592;</span> Available Bike
            </Button>

            <Flex
                bg="#e5e4d7"
                borderRadius="15"
                boxShadow="md"
                w="100%"
                minH="85vh"
                p={6}

                direction="column"
                gap={4}
                mt={-53}
                marginRight={50}

            >
                {/* Form Section */}
                <Text fontSize="md" fontWeight="bold" mt={-5}>
                    Walk in customers
                </Text>
                <Flex justifyContent="flex-start" mb={-1}>
                    <Box flex="1">
                        <Text mb={1}>First Name</Text>
                        <Input
                            placeholder="First Name"
                            borderColor="#d9d9d9"
                            backgroundColor="white"
                            w="70%"
                            size="md"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Box>
                    <Box flex="1">
                        <Text mb={1}>Username</Text>
                        <Input
                            placeholder="Username"
                            borderColor="#d9d9d9"
                            backgroundColor="white"
                            w="70%"
                            size="md"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Box>
                    <Box flex="1">
                        <Text mb={1}>Email</Text>
                        <Input
                            placeholder="Email"
                            borderColor="#d9d9d9"
                            backgroundColor="white"
                            w="70%"
                            size="md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Box>
                </Flex>
                <Flex justifyContent="flex-start">
                    <Box flex="1">
                        <Text mb={1}>Last Name</Text>
                        <Input
                            placeholder="Last Name"
                            backgroundColor="white"
                            borderColor="#d9d9d9"
                            w="70%"
                            size="md"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Box>
                    <Box flex="1">
                        <Text mb={1}>Age</Text>
                        <Input
                            placeholder="Input age"
                            backgroundColor="white"
                            borderColor="#d9d9d9"
                            w="70%"
                            size="md"
                            value={age}
                            onChange={handleInputChange}
                        />
                    </Box>
                    {/* <Box flex="1">
                        <Text mb={1}>Age</Text>
                        <Select
                        placeholder="Select age"
                        backgroundColor="white"
                        borderColor="#d9d9d9"
                        cursor="pointer"
                        w="70%"
                        size="md"
                        value={age}
                        onChange={handleInputChange}
                        >
                        {Array.from({ length: 99 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                        </Select>
                    </Box> */}

                    <Box flex="1">
                        <Text mb={1}>Contact Number</Text>
                        <InputGroup width="70%">
                            {/* Prefix +63 as static text */}
                            <InputLeftAddon children="+63" backgroundColor="gray.100" />

                            {/* Input for the rest of the contact number */}
                            <Input
                                placeholder="Phone number "
                                backgroundColor="white"
                                borderColor="#d9d9d9"
                                size="md"
                                type="tel"
                                maxLength={10}
                                onChange={(e) => {
                                    // Allow only numbers
                                    const numericText = e.target.value.replace(/[^0-9]/g, '');
                                    setContactNumber(numericText);
                                }}
                                value={contactNumber} // Bind this to the state
                            />
                        </InputGroup>
                    </Box>

                </Flex>

                {/* Bike Details Section */}
                <Flex
                    bg="transparent"
                    borderRadius="md"
                    p={4}
                    mt={6}
                    boxShadow="sm"
                    alignItems="center"
                    justifyContent="space-between"
                    direction="row"
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


                        <Text mt={1} fontSize="sm" color="gray.700">
                            {bike.bike_status || "Unknown Status"}
                        </Text>
                    </Box>

                    {/* Bike Info Section */}
                    <Box flex="1" ml={6}>
                        {bike ? (
                            <Box >
                                <Text fontSize="md" mt={1}>
                                    <strong>Bike ID:</strong> {bike.bike_id || "N/A"}
                                </Text>
                                <Text fontSize="md" mt={-3}>
                                    <strong>Bike name:</strong> {bike.bike_name || "N/A"}
                                </Text>
                                <Text fontSize="md" mt={-3}>
                                    <strong>Bike type</strong> {bike.bike_type || "N/A"}
                                </Text>

                                <Text fontSize="md" mt={-3}>
                                    <strong>Price: ₱  </strong> {bike.bike_rent_price || "N/A"}
                                </Text>

                                <Stack direction="row" align="center" mt={-3}>
                                    <Text fontSize="md">
                                        <strong>Duration of use:</strong>
                                    </Text>
                                    <IconButton
                                        icon={<MinusIcon />}
                                        onClick={decreaseDuration}
                                        aria-label="Decrease Duration"
                                        color="white"
                                        mt={-4}
                                        backgroundColor="#405c4f"
                                        _hover={{ backgroundColor: "#2e4437" }}
                                        size="xs"
                                    />

                                    <Text fontSize="sm" padding="1" width={50} height={7} borderRadius="md" textAlign="center" justifyContent="center" marginTop={0} backgroundColor={"#e5e4d7"}>
                                        {duration}
                                    </Text>

                                    <IconButton
                                        icon={<AddIcon />}
                                        onClick={increaseDuration}
                                        aria-label="Increase Duration"
                                        color="white"
                                        mt={-4}
                                        backgroundColor="#405c4f"
                                        _hover={{ backgroundColor: "#2e4437" }}
                                        size="xs"
                                    />
                                </Stack>
                                <Divider borderColor="black" borderWidth="1px" />


                                <Text fontSize="md" mt={1} color="red">
                                    <strong>Total Price Rent: ₱ </strong> {totalPrice || 'N/A'}
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
                <Flex alignItems="flex-end" justifyContent="space-between" mt={4} mb={-3}>
                    {/* <Checkbox mt={-2}
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
                    </Checkbox> */}
                    <Button bg="#405c4f" color="white" _hover={{ bg: "#2e4437" }} onClick={() => handleRent()}>
                        RENT
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};


const convertTimeToSeconds = (timeString, additionalHours) => {
    // Extract the AM/PM part and remove it from the time string
    const [time, modifier] = timeString.split(' ');

    // Split the time string into hours, minutes, and seconds
    let [hours, minutes] = time.split(':').map(Number);

    // Convert to 24-hour format
    if (modifier === 'PM' && hours < 12) {
        hours += 12; // Convert PM hours
    } else if (modifier === 'AM' && hours === 12) {
        hours = 0; // Convert 12 AM to 0 hours
    }

    // Calculate total seconds from the original time
    const totalSeconds = (hours * 3600) + (minutes * 60);

    // Add the additional hours converted to seconds
    const additionalSeconds = additionalHours * 3600;

    // Return the total time in seconds
    return totalSeconds + additionalSeconds;
}

function convertSecondsToTimeWithAMPM(totalSeconds) {
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    // Determine AM/PM and convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hourIn12Format = hours % 12 || 12; // Convert hour to 12-hour format

    // Format minutes and seconds to always be two digits
    const formattedMinutes = String(minutes).padStart(2, '0');

    // Construct the time string
    return `${hourIn12Format}:${formattedMinutes} ${ampm}`;
}
function getCurrentTimeInAMPM() {
    const now = new Date(); // Get the current date and time

    // Extract hours, minutes, and seconds
    let hours = now.getHours();
    const minutes = now.getMinutes();

    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Format minutes to always be two digits
    const formattedMinutes = String(minutes).padStart(2, '0');

    // Construct the time string
    return `${hours}:${formattedMinutes} ${ampm}`;
}

export default WalkinPage;
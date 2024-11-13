import React, { useEffect, useState } from "react";
import "./dashboardPage.css";
import { Box, Text, Image, Center, Button } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, useToast } from '@chakra-ui/react';
import loc from '../../assets/images/dashboard/loc.png';
import rev from '../../assets/images/dashboard/rev.png';
import bike from '../../assets/images/dashboard/bike.png';
import logo from '../../assets/images/dashboard/RBMSlogo.png';
import { useShared } from '../../contextAPI.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const Card = ({ imageSrc, title, description, cardBgColor, imageBgColor, buttonBgColor, onClick, id }) => {
    return (
        <Box
            w='175px'
            h='225px'
            bg={cardBgColor}
            rounded='2xl'
            shadow='2xl'
            p='10px'
            pos='relative'
            className="cards"
            onClick={onClick}
            id={id}
        >
            <Box
                w='155px'
                h='115px'
                bg={imageBgColor}
                pos='relative'
                rounded='lg'
            >
                <Image
                    src={imageSrc}
                    boxSize='115px'
                    pos='absolute'
                    bottom='-5px'
                    left='20px'
                />
            </Box>
            <Box>
                <Text fontSize='lg' color='#000' m='0' mt='5px' textAlign='left'>
                    {title}
                </Text>
                <Text fontSize='sm' color='#000' m='0' textAlign='left'>
                    {description}
                </Text>
            </Box>
            <Center
                w='125px'
                h='40px'
                bg={buttonBgColor}
                position='absolute'
                bottom='-10px'
                right='-10px'
                shadow='lg'
                roundedTopLeft='50px'
                roundedBottomRight='20px'
                onClick={onClick}
                cursor="pointer"
            >
                <Box as='span' fontSize='sm'>View Details</Box>
            </Center>
        </Box>
    );
};

// Format date to "MMM/DD/YYYY"
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'short' });
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
};

const DashboardPage = () => {
    const { setActiveP, setActiveLink } = useShared();
    const [superadmin, setSuperadmin] = useState('');
    const [getRes, setGetRes] = useState([]);
    const toast = useToast();

    const handleCardClick = (cardName) => {
        setActiveP(cardName);
        setActiveLink(cardName);
    };

    const handleUnauthorized = () => {
        toast({
            title: 'Unauthorized',
            description: 'You do not have permission to view this page.',
            status: 'warning',
            duration: 3000,
            position: 'top',
            isClosable: true,
        });
    };

    useEffect(() => {
        setSuperadmin(localStorage.getItem('isSAdmin'));
    }, []);

    useEffect(() => {
        const gatherRes = async () => {
            try {
                const res = await window.api.getReservationsFIVE();
                const records = res.records || [];
                setGetRes(records);
            } catch (error) {
                console.error(error);
            }
        };
        gatherRes();
        const intervalId = setInterval(gatherRes, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const chartData = getRes.reduce((acc, bike) => {
        const bikeName = bike.name;
        const existingBike = acc.find(item => item.name === bikeName);
        if (existingBike) {
            existingBike.reservations += 1;
        } else {
            acc.push({ name: bikeName, reservations: 1 });
        }
        return acc;
    }, []);

    // Income data for the chart
    const incomeData = [
        { day: "Sun", income: 100 },
        { day: "Mon", income: 200 },
        { day: "Tue", income: 150 },
        { day: "Wed", income: 220 },
        { day: "Thu", income: 1000 },
        { day: "Fri", income: 280 },
        { day: "Sat", income: 250 },
    ];

    return (
        <Box className="animate__animated animate__fadeInRight">
            <Box display='flex' gap='25px'>
                <Card
                    imageSrc={loc}
                    title="GPS TRACKING"
                    description="Current Location"
                    cardBgColor="#50C878"
                    imageBgColor="#43A564"
                    buttonBgColor="#8A9A5B"
                    onClick={() => handleCardClick('Gps Tracking')}
                />
                <Card
                    imageSrc={rev}
                    title="Analytics"
                    description="Revenue"
                    cardBgColor="#32BE9B"
                    imageBgColor="#2AAA8A"
                    buttonBgColor="#93C572"
                    onClick={(superadmin === 'true') ? () => handleCardClick('Analytics') : () => handleUnauthorized()}
                    id='revCard'
                />
                <Card
                    imageSrc={bike}
                    title="Availability"
                    description="Bicycle's Availability"
                    cardBgColor="#90EE90"
                    imageBgColor="#68BA68"
                    buttonBgColor="#96DED1"
                    onClick={() => handleCardClick('Availability')}
                />
             <Box
            position="absolute"
            top="20%"
            right="350px"
            transform="translateY(-50%)"
            background="linear-gradient(135deg, #ff7e5f, #feb47b, #ffd200)"
            padding={3}
            paddingLeft={5}
            paddingRight={5}
            borderRadius={20}
            marginTop={-3}
            boxShadow="0px 4px 15px rgba(0, 0, 0, 0.2), inset 0px 2px 4px rgba(0, 0, 0, 0.1)" // Inner shadow
            animation="borderRotate 6s linear infinite" // Rotating border effect
            _hover={{
            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3), 0px 0px 20px rgba(0, 217, 255, 0.6)", // Glow effect on hover
             }}
            >
            <Image src={logo} boxSize="200px" alt="Logo" animation="bikeMotion 2s ease-in-out infinite" />
            </Box>

                
            </Box>
            <Box display="flex" justifyContent="space-between" mt="50px">
                <Box w="50%">
                    <Box display='flex' alignItems='center' justifyContent='space-between' w='500px'>
                        <Box as="span" fontSize='2xl'>Reservations</Box>
                        <Box as="span" fontSize='md' position='relative' display='flex' right='0' w='120px' cursor='pointer' onClick={() => handleCardClick('Reservation')}>View Details <Box as="span" w='5px' h='20px' bg='#355E3B' display='flex' ml='5px' /></Box>
                    </Box>
                    <TableContainer className='Acctable' maxH='325px' overflowY='auto'>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Reserved Time</Th>
                                    <Th>Duration of use</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {getRes.map((bike, index) => (
                                    <Tr key={index}>
                                        <Td fontSize='sm'>{bike.name}</Td>
                                        <Td fontSize='sm'>{formatDate(bike.reservation_date)}</Td>
                                        <Td fontSize='sm'>{bike.duration} hr/s</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                            <Tfoot>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Reserved Time</Th>
                                    <Th>Duration of use</Th>
                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Monthly Income Chart */}
                <Box w="50%" h="320px" bg="#B2DFDB" p="10px" rounded="lg" shadow="md" textAlign="center" marginRight={300} marginLeft={100} borderRadius={20}>
                    <Text fontSize="lg" fontWeight="bold" mb="10px">Monthly Income</Text>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={incomeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="income"
                                stroke="#000"
                                strokeWidth={2}
                                dot={{ r: 5 }}
                                animationDuration={1500}  // Duration of the animation
                                animationEasing="ease-out"  // Easing type for smooth animation
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <Center
                        w='130px'
                        h='40px'
                        backgroundColor='#8A88B0'
                        position='absolute'
                        bottom='80' 
                        marginBottom={5}
                        right='290px'
                        shadow='lg'
                        roundedBottomLeft='35px'
                        roundedTopRight='20px'
                        cursor="pointer"
                        onClick={() => handleCardClick('Analytics')}
                    >
                        <Box as='span' fontSize='sm'>View Details</Box>
                    </Center>
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardPage;

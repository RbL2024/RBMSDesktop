import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './analyticsPage.css';
import Calendar from 'react-calendar';
import { Box, Text, Grid, GridItem, Flex, CircularProgress, useBreakpointValue } from '@chakra-ui/react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
    const [date, setDate] = useState(new Date());
    const [data, setData] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    const reservations = [
        { id: 1, price: 200 },
    ];

    const users = [
        { id: 1, name: "User A" },
        { id: 2, name: "User B" },
        { id: 3, name: "User C" },
        



    ];

    const MotionBox = motion(Box);
    const MotionText = motion(Text);

    useEffect(() => {
        const total = reservations.reduce((acc, reservation) => acc + reservation.price, 0);
        setTotalSales(total);

        setTotalUsers(users.length);

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const generateMonthlyData = () => {
            return months.map((month) => ({
                name: month,
                sales: Math.floor(Math.random() * 1000 + 100),
            }));
        };
        setData(generateMonthlyData());
    }, []);

    // Define max values for progress calculations
    const maxSales = 10000; // Example max sales
    const maxUsers = 50; // Example max users

    // Calculate percentage values for CircularProgress
    const salesProgress = Math.min((totalSales / maxSales) * 100, 100);
    const usersProgress = Math.min((totalUsers / maxUsers) * 100, 100);

    return (
        <Box p={2} bg="#E2E2D5" borderRadius="md" boxShadow="30" width="100%" mr={500} paddingRight={270}>
            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                <GridItem colSpan={1} bg="#90ADCE" p={10} paddingTop={10} borderRadius="30" width="100%" height="300px" display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
                    <Box />
                    <Text fontSize="lg" color="gray.600">Total Sales</Text>
                    <Text fontSize="2xl" fontWeight="bold">₱ {totalSales.toLocaleString()}</Text>
                </GridItem>

                <GridItem colSpan={1} bg="#E9967A" p={10} paddingTop={10} borderRadius="30" width="100%" height="300px" display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
                    <Box />
                    <Text fontSize="lg" color="gray.600">Total Users</Text>
                    <Text fontSize="2xl" fontWeight="bold">{totalUsers}</Text>
                </GridItem>

                <GridItem colSpan={2} p={4} borderRadius="md">
                    <Box bg="#A8F9D1" height="100%" borderRadius="md" boxShadow="sm" p={2}>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="sales" stroke="#4CAF50" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </GridItem>
            </Grid>

            <Grid templateColumns="repeat(4, 1fr)" gap={3} mt={4}>
                <GridItem colSpan={2} bg="#E2E2D5" p={5} borderRadius="md" boxShadow="sm" gap={1} maxHeight={300} objectFit="cover">
                    <Box style={{ height: '300px', overflow: 'hidden' }}>
                        <Calendar
                            onChange={setDate}
                            value={date}
                            defaultActiveStartDate={new Date(2024, 10, 1)}
                            minDetail="month"
                            nextLabel={<Box display="flex" alignItems="center" justifyContent="center" color="black" borderRadius="full" width="20px" height="20px" mb={10} _hover={{ cursor: 'pointer' }}><FaChevronRight /></Box>}
                            prevLabel={<Box display="flex" alignItems="center" justifyContent="center" color="black" borderRadius="full" width="20px" height="20px" _hover={{ cursor: 'pointer' }}><FaChevronLeft /></Box>}
                        />
                    </Box>
                </GridItem>

                <GridItem colSpan={2} bg="#C0E9E9" p={4} borderRadius="30" boxShadow="lg" _hover={{ boxShadow: '2xl', transform: 'scale(1.02)' }}>
                    <Flex justifyContent="center" alignItems="center" height="100%" direction={{ base: 'column', md: 'row' }} spacing={4}>
                        <CircularProgress value={salesProgress} size={useBreakpointValue({ base: '100px', md: '120px' })} thickness="10px" color="#90ADCE" trackColor="#E9967A" />
                        <MotionBox ml={{ base: 0, md: 4 }} mt={{ base: 4, md: 0 }} textAlign={{ base: 'center', md: 'left' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                            <MotionText fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="#90ADCE">sales</MotionText>
                            <MotionText fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="#E9967A">users</MotionText>
                            
                        </MotionBox>
                    </Flex>
                </GridItem>
            </Grid>
        </Box>
    );
}

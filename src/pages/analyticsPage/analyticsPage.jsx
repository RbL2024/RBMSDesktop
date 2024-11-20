import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './analyticsPage.css';
import Calendar from 'react-calendar';
import { 
    Box, 
    Text, 
    Grid, 
    GridItem, 
    Flex, 
    CircularProgress, 
    useBreakpointValue 
} from '@chakra-ui/react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

export default function AnalyticsPage() {
    const [date, setDate] = useState(new Date(2024, 10, 1)); // Default to November
    const [data, setData] = useState([]); // Data for the current month
    const [totalSales, setTotalSales] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const MotionBox = motion(Box);
    const MotionText = motion(Text);

    // Get the current month's name
    const currentMonthName = date.toLocaleString('default', { month: 'long' });

    useEffect(() => {
        const generateWeeklyData = (year, month) => {
            const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get days in the month
            const weeklyData = [];
            let weekSales = 0;
            let weekStartDay = 1;

            for (let day = 1; day <= daysInMonth; day++) {
                weekSales += Math.floor(Math.random() * 100); // Random sales for the day

                // Every 7th day, push the accumulated sales for the week and reset
                if (day % 7 === 0 || day === daysInMonth) {
                    weeklyData.push({
                        week: `Week ${Math.ceil(day / 7)}`, // Week label
                        sales: weekSales,
                    });
                    weekSales = 0;
                }
            }
            return weeklyData;
        };

        // Generate data for the selected month
        const currentYear = date.getFullYear();
        const currentMonth = date.getMonth();
        const generatedData = generateWeeklyData(currentYear, currentMonth);
        setData(generatedData);
    }, [date]);

    useEffect(() => {
        // Calculate totals for reservations and users
        const reservations = [
            { id: 1, price: 200 },
            { id: 2, price: 300 },
            { id: 3, price: 400 },
        ];

        const users = [
            { id: 1, price: 200 },
            { id: 2, price: 300 },
            { id: 3, price: 400 },
        ];

        const total = reservations.reduce((acc, reservation) => acc + reservation.price, 0);
        setTotalSales(total);

        const totalUserPrice = users.reduce((acc, user) => acc + user.price, 0);
        setTotalPrice(totalUserPrice);
    }, []);

    // Define max values for progress calculations
    const maxSales = 1000; // Example max sales
    const maxPrice = 1000; // Example max totalPrice

    // Calculate percentage values for CircularProgress
    const salesProgress = Math.min((totalSales / maxSales) * 100, 100);
    const priceProgress = Math.min((totalPrice / maxPrice) * 100, 100);

    const handlePrevMonth = () => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() - 1); // Move to the previous month
            return newDate;
        });
    };
    
    const handleNextMonth = () => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + 1); // Move to the next month
            return newDate;
        });
    };

    return (
        <Box p={2} bg="#E2E2D5" borderRadius="md" boxShadow="30" width="100%" mr={500} paddingRight={270}>
            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                <GridItem colSpan={1} bg="#32BE9B" p={10} paddingTop={10} borderRadius="30" width="100%" height="300px" display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
                    <Box />
                    <Text fontSize="lg" color="#2C3E50" fontWeight="bold">ADULT BICYCLE</Text>
                    <Text fontSize="2xl" fontWeight="700">₱ {totalSales.toLocaleString()}</Text>
                </GridItem>

                <GridItem colSpan={1} bg="#F2F7F7" p={10} paddingTop={10} borderRadius="30" width="100%" height="300px" display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
                    <Box />
                    <Text fontSize="lg" color="#2C3E50" fontWeight="bold">KID BICYCLE</Text>
                    <Text fontSize="2xl" fontWeight="700">₱ {totalPrice.toLocaleString()}</Text>
                </GridItem>

                <GridItem colSpan={2} p={4} borderRadius="md">
                    <Box bg="#B2DFDB" height="100%" borderRadius="md" boxShadow="sm" p={2}>
                    <Box display="flex" justifyContent="center" mb={1}>
                        <Text fontSize="medium" fontWeight="bold" color="#4A6274">{currentMonthName} Sales</Text>
                    </Box>
                        <ResponsiveContainer width="100%" height={200} cursor="pointer">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" label={{ value: "Weeks", position: "insideBottomRight", offset: -5 }} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="sales" stroke="#8A88B0" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </GridItem>
            </Grid>

            <Grid templateColumns="repeat(4, 1fr)" gap={3} mt={4}>
                <GridItem
                    colSpan={2}
                    bg="#E2E2D5"
                    p={5}
                    borderRadius="md"
                    boxShadow="sm"
                    gap={1}
                    maxHeight={300}
                >
                    <Box style={{ height: '300px', overflow: 'hidden' }}>
                        <Calendar
                            onChange={setDate}
                            value={date}
                            defaultActiveStartDate={new Date(2024, 10, 1)} // Default to November
                            minDetail="month"
                            showNeighboringMonth={false}
                            nextLabel={
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    color="black"
                                    borderRadius="full"
                                    width="20px"
                                    height="20px"
                                    mb={10}
                                    _hover={{ cursor: 'pointer' }}
                                    onClick={handleNextMonth} // Updated onClick handler
                                >
                                    <FaChevronRight />
                                </Box>
                            }
                            prevLabel={
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    color="black"
                                    borderRadius="full"
                                    width="20px"
                                    height="20px"
                                    _hover={{ cursor: 'pointer' }}
                                    onClick={handlePrevMonth} // Updated onClick handler
                                >
                                    <FaChevronLeft />
                                </Box>
                            }
                            locale="en-US"
                            className="custom-calendar"
                        />
                    </Box>
                </GridItem>

                <GridItem colSpan={2} bg="#F5F1E1" p={4} borderRadius="30" boxShadow="lg" _hover={{ boxShadow: '2xl', transform: 'scale(1.02)' }}>
                <Flex justifyContent="center" alignItems="center" height="100%" direction={{ base: 'column', md: 'row' }} spacing={4}>
                    <Box position="relative" display="inline-block">
                    <CircularProgress value={salesProgress} size={useBreakpointValue({ base: '100px', md: '120px' })} thickness="10px" color="#4A6274" trackColor="#94ACBF" />
                    <MotionText
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        fontSize={{ base: 'md', md: 'lg' }}
                        fontWeight="bold"
                        color="#4A6274"
                    >
                        {salesProgress}%
                    </MotionText>
                    </Box>
                    <MotionBox ml={{ base: 0, md: 4 }} mt={{ base: 4, md: 0 }} textAlign={{ base: 'center', md: 'left' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                    <MotionText fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="#4A6274">Reservation fee</MotionText>
                    <MotionText fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="#94ACBF">Rent sales</MotionText>
                    </MotionBox>
                </Flex>
                </GridItem>
            </Grid>
        </Box>
    );
}

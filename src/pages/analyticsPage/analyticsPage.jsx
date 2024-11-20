import React, { useState, useEffect } from "react";
import { Box, Text, Grid, GridItem, CircularProgress, useBreakpointValue } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsPage() {
    const [data, setData] = useState([]);
    const [adultBicycleSales, setAdultBicycleSales] = useState(0);
    const [kidBicycleSales, setKidBicycleSales] = useState(0);

    const truncateMonth = (month) => {
        const monthMap = {
            January: "Jan",
            February: "Feb",
            March: "Mar",
            April: "Apr",
            May: "May",
            June: "Jun",
            July: "Jul",
            August: "Aug",
            September: "Sep",
            October: "Oct",
            November: "Nov",
            December: "Dec",
        };
        return monthMap[month] || month;
    };

    useEffect(() => {
        // Example monthly sales data for adult and kid bicycles
        const monthlyData = [
            { month: "January", adultSales: 100, kidSales: 50 },
            { month: "February", adultSales: 200, kidSales: 150 },
            { month: "March", adultSales: 300, kidSales: 50 },
            { month: "April", adultSales: 400, kidSales: 300 },
            { month: "May", adultSales: 500, kidSales: 400 },
            { month: "June", adultSales: 600, kidSales: 500 },
            { month: "July", adultSales: 700, kidSales: 600 },
            { month: "August", adultSales: 800, kidSales: 700 },
            { month: "September", adultSales: 900, kidSales: 800 },
            { month: "October", adultSales: 1000, kidSales: 900 },
            { month: "November", adultSales: 100, kidSales: 50 },
            { month: "December", adultSales: 1200, kidSales: 1100 },
        ];

        // Truncate month names
        const truncatedData = monthlyData.map((item) => ({
            ...item,
            month: truncateMonth(item.month),
        }));

        setData(truncatedData);

        // Calculate total adult and kid bicycle sales
        const totalAdultSales = truncatedData.reduce((acc, item) => acc + item.adultSales, 0);
        setAdultBicycleSales(totalAdultSales);

        const totalKidSales = truncatedData.reduce((acc, item) => acc + item.kidSales, 0);
        setKidBicycleSales(totalKidSales);
    }, []);

    // Combine total adult and kid bicycle sales
    const totalSales = adultBicycleSales + kidBicycleSales;

    // Set a maximum sales value (you can adjust this based on your needs)
    const maxSales = 30000; // This could be a static value or dynamic based on your data

    // Calculate progress percentage
    const salesProgress = Math.min((totalSales / maxSales) * 100, 100);

    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box p={4} bg="#E2E2D5" borderRadius="md" boxShadow="lg" width="100%">
            {/* Grid layout for statistics */}
            <Grid templateColumns={isMobile ? "1fr" : "repeat(5, 1fr)"} gap={6}>
                <GridItem
                    bg="#32BE9B"
                    borderRadius="md"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    width="200px"
                >
                    <Text fontSize="lg" color="#2C3E50" fontWeight="bold">
                        Adult Bicycle Sales
                    </Text>
                    <Text fontSize="2xl" fontWeight="700">
                        ₱ {adultBicycleSales.toLocaleString()}
                    </Text>
                </GridItem>

                <GridItem
                    bg="#F2F7F7"
                    p={5}
                    borderRadius="md"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    width="200px"
                >
                    <Text fontSize="lg" color="#2C3E50" fontWeight="bold">
                        Kid Bicycle Sales
                    </Text>
                    <Text fontSize="2xl" fontWeight="700">
                        ₱ {kidBicycleSales.toLocaleString()}
                    </Text>
                </GridItem>

                {/* Single Circular Progress for Total Sales */}
                <GridItem
                    bg="#F5F1E1"
                    p={5}
                    borderRadius="md"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    width="520px"
                >
                    <Box position="relative" display="inline-block">
                        <CircularProgress
                            value={salesProgress}
                            size={isMobile ? "20px" : "100px"}
                            thickness="10px"
                            color="#4A6274"
                            trackColor="#94ACBF"
                        />
                        <Text
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            fontSize={isMobile ? "md" : "lg"}
                            fontWeight="bold"
                            color="#4A6274"
                        >
                            {salesProgress.toFixed(1)}%
                        </Text>
                    </Box>
                    <Text fontSize="lg" fontWeight="bold" color="#4A6274" mt={4}>
                        Total Sales Progress
                    </Text>
                </GridItem>
            </Grid>

            {/* Responsive Chart */}
            <Box mt={6} bg="#B2DFDB" p={5} borderRadius="md" boxShadow="sm" marginRight={250}>
                <Box display="flex" justifyContent="center" mb={4}>
                    <Text fontSize="md" fontWeight="bold" color="#4A6274">
                        Monthly Sales Data
                    </Text>
                </Box>

                <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="4 4" />
                        <XAxis
                            dataKey="month"
                            label={{
                                value: "",
                                position: "insideBottomRight",
                                offset: -1,
                            }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="adultSales"
                            stroke="#32BE9B"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="kidSales"
                            stroke="black"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}

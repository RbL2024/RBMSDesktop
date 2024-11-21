import React, { useState, useEffect } from "react";
import { Box, Text, Grid, GridItem, useBreakpointValue, Select } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AnalyticsPage() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [adultBicycleSales, setAdultBicycleSales] = useState(0);
    const [kidBicycleSales, setKidBicycleSales] = useState(0);
    const [reservationFee, setReservationFee] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState("All Months");

    const monthlyReservationFee = {
        "Jan": 300,
        "Feb": 200,
        "Mar": 600,
        "Apr": 700,
        "May": 500,
        "Jun": 800,
        "Jul": 600,
        "Aug": 400,
        "Sep": 300,
        "Oct": 800,
        "Nov": 300,
        "Dec": 700
    };

    const daysInMonth = {
        "Jan": 31,
        "Feb": 28,
        "Mar": 31,
        "Apr": 30,
        "May": 31,
        "Jun": 30,
        "Jul": 31,
        "Aug": 31,
        "Sep": 30,
        "Oct": 31,
        "Nov": 30,
        "Dec": 31
    };

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
            { month: "January", adultSales: 300, kidSales: 450 },
            { month: "February", adultSales: 200, kidSales: 250 },
            { month: "March", adultSales: 300, kidSales: 50 },
            { month: "April", adultSales: 400, kidSales: 300 },
            { month: "May", adultSales: 400, kidSales: 400 },
            { month: "June", adultSales: 600, kidSales: 500 },
            { month: "July", adultSales: 700, kidSales: 600 },
            { month: "August", adultSales: 800, kidSales: 700 },
            { month: "September", adultSales: 900, kidSales: 800 },
            { month: "October", adultSales: 2000, kidSales: 900 },
            { month: "November", adultSales: 100, kidSales: 50 },
            { month: "December", adultSales: 1200, kidSales: 1100 },
        ];

        // Truncate month names
        const truncatedData = monthlyData.map((item) => ({
            ...item,
            month: truncateMonth(item.month),
        }));

        setData(truncatedData);
        setFilteredData(truncatedData); // Initially show all months

    }, []);

    useEffect(() => {
        if (selectedMonth === "All Months") {
            setFilteredData(data);

            // Recalculate total sales for all months
            const totalAdultSales = data.reduce((acc, item) => acc + item.adultSales, 0);
            setAdultBicycleSales(totalAdultSales);

            const totalKidSales = data.reduce((acc, item) => acc + item.kidSales, 0);
            setKidBicycleSales(totalKidSales);

            // Calculate total reservation fee for all months
            const totalReservationFee = Object.values(monthlyReservationFee).reduce((acc, value) => acc + value, 0);
            setReservationFee(totalReservationFee); // Set total reservation fee
        } else {
            const filtered = data.filter((item) => item.month === selectedMonth);

            // Split sales into days for the selected month
            const daysInSelectedMonth = daysInMonth[selectedMonth];
            const totalAdultSales = filtered[0].adultSales / daysInSelectedMonth;
            const totalKidSales = filtered[0].kidSales / daysInSelectedMonth;
            const totalReservationFee = monthlyReservationFee[selectedMonth] / daysInSelectedMonth;

            // Randomize the daily sales data for the selected month
            const dailyData = Array.from({ length: daysInSelectedMonth }, (_, index) => {
                const randomMultiplier = 0.9 + Math.random() * 0.2; // Random factor between 0.9 and 1.1
                return {
                    day: `Day ${index + 1}`,
                    adultSales: totalAdultSales * randomMultiplier,
                    kidSales: totalKidSales * randomMultiplier,
                    reservationFee: totalReservationFee * randomMultiplier,
                };
            });

            setFilteredData(dailyData);
            setAdultBicycleSales(totalAdultSales * daysInSelectedMonth);
            setKidBicycleSales(totalKidSales * daysInSelectedMonth);
            setReservationFee(totalReservationFee * daysInSelectedMonth);
        }
    }, [selectedMonth, data]);

    // Combine total adult and kid bicycle sales into rental sales
    const rentalSales = adultBicycleSales + kidBicycleSales;

    // Pie chart data for Reservation Fee and Rental Sales
    const pieData = [
        { name: "Reservation Fee", value: reservationFee },
        { name: "Rental Sales", value: rentalSales },
    ];

    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box p={4} bg="#E2E2D5" borderRadius="15px" boxShadow="lg" width="100%">
            {/* Dropdown to select month */}
            <Box mb={4}>
                <Text fontSize="lg" fontWeight="bold" color="#4A6274" mb={2}>
                    Filter by Month
                </Text>
                <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    bg="white"
                    borderRadius="md"
                    width="200px"
                >
                    <option value="All Months">All Months</option>
                    <option value="Jan">January</option>
                    <option value="Feb">February</option>
                    <option value="Mar">March</option>
                    <option value="Apr">April</option>
                    <option value="May">May</option>
                    <option value="Jun">June</option>
                    <option value="Jul">July</option>
                    <option value="Aug">August</option>
                    <option value="Sep">September</option>
                    <option value="Oct">October</option>
                    <option value="Nov">November</option>
                    <option value="Dec">December</option>
                </Select>
            </Box>

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
                    bg="#50C878"
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

                {/* Pie Chart showing Reservation Fee vs Rental Sales */}
                <GridItem
                    bg="#F5F1E1"
                    p={4}
                    borderRadius="md"
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    width="520px"
                    gap={4}
                >
                    {/* Pie chart on the Left */}
                    <Box position="relative" display="inline-block">
                        <PieChart width={isMobile ? 200 : 200} height={isMobile ? 200 : 170}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={isMobile ? 50 : 50}
                                innerRadius={isMobile ? 30 : 40}
                                fill="#C85050 "
                                paddingAngle={5}
                                label
                            >
                                <Cell fill="#C85050 " />
                                <Cell fill="#50C878" />
                            </Pie>

                            {/* Adding "SALES" label in the center */}
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={isMobile ? "13px" : "13px"}
                                fill="#4A6274"
                                fontWeight="bold"
                            >
                                SALES
                            </text>
                        </PieChart>
                    </Box>

                    {/* Text with Info on the Right */}
                    <Box>
                        <Text fontSize="md" fontWeight="bold" color="#4A6274">
                            Reservation Fee: ₱ {reservationFee.toLocaleString()}
                        </Text>
                        <Text fontSize="md" fontWeight="bold" color="#4A6274">
                            Rental Sales: ₱ {rentalSales.toLocaleString()}
                        </Text>
                    </Box>
                </GridItem>
            </Grid>

            {/* Line Chart for Monthly Sales Data */}
            <Box mt={3} bg="#B2DFDB" p={5} borderRadius="md" boxShadow="sm" marginRight={250}>
                <Box display="flex" justifyContent="center" mb={4}>
                    <Text fontSize="md" fontWeight="bold" color="#4A6274">
                        Monthly Sales Data
                    </Text>
                </Box>

                {/* Scrollable container */}
                <Box overflowX="auto" maxWidth="100%">
                    <ResponsiveContainer width="100%" height={isMobile ? 100 : 200}>
                        <LineChart data={filteredData}>
                            <CartesianGrid strokeDasharray="5 5" />
                            <XAxis
                                dataKey={selectedMonth === "All Months" ? "month" : "day"} // Show month or day
                                stroke="#4A6274"
                                tick={{ fontSize: isMobile ? "10px" : "12px" }}
                                tickFormatter={(tick) => tick} // Display day or month
                            />
                            <YAxis
                                stroke="#4A6274"
                                tick={{ fontSize: isMobile ? "10px" : "12px" }}
                                tickFormatter={(value) => `₱ ${value.toLocaleString()}`}
                            />
                            <Tooltip
                                labelFormatter={(label) => `Day: ${label}`}
                                formatter={(value) => `Sales: ₱ ${value.toLocaleString()}`}
                                contentStyle={{
                                    borderRadius: "8px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="adultSales"
                                stroke="#32BE9B"
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="kidSales"
                                stroke="#50C878"
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Box>
    );
}

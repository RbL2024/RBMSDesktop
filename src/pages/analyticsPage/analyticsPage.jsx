import React, { use, useEffect } from "react";
import { Box, Select, Text } from "@chakra-ui/react";
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AnalyticsPage() {
    const currMonth = moment().format('MM');
    const currYear = moment().format('YYYY');

    const [resData, setResData] = React.useState([]);
    const [datatype, setDataType] = React.useState('Reservation');
    const [selMonth, setSelMonth] = React.useState(currMonth);
    const [selYear, setSelYear] = React.useState(currYear);
    const [totalRevenue, setTotalRevenue] = React.useState(0);
    const [totalReservationFee, setTotalReservationFee] = React.useState(0);

    const [bikeData, setbikeData] = React.useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resdata = await window.api.getResData();
                const rentdata = await window.api.getRentData();
                const gatheredData = [...resdata, ...rentdata];


                const bikeTypeCounts = gatheredData.reduce((acc, item) => {
                    acc[item.bike_type] = (acc[item.bike_type] || 0) + 1;
                    return acc;
                }, {});

                setbikeData(bikeTypeCounts);

            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
        const intervalId = setInterval(fetchData, 5000); // 5 seconds interval

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const getResData = async () => {
            try {
                if (datatype === 'Reservation') {
                    const response = await window.api.getResData();
                    // console.log(response);
                    return setResData(response);
                }
                if (datatype === 'Walk-in') {
                    const response = await window.api.getRentData();
                    // console.log(response);
                    return setResData(response);
                }
                // setResData(response);
            } catch (error) {
                console.error(error);
            }
        }
        getResData();
        const intervalId = setInterval(getResData, 5000);

        return () => clearInterval(intervalId);
    }, [datatype]);

    useEffect(() => {
        const filteredDataByYear = resData.filter(item => moment(item.date_gathered).year() === parseInt(selYear));
        const total = filteredDataByYear.reduce((sum, item) => sum + parseInt(item.totalBikeRentPrice, 10), 0);
        const totalResFee = filteredDataByYear.reduce((sum, item) => sum + parseInt(item.totalReservationFee, 10), 0);
        setTotalReservationFee(totalResFee);
        setTotalRevenue(total);
    }, [datatype, resData, selYear]);

    //forFilter
    const months = moment.months();
    const yearsSet = new Set(resData.map(item => moment(item.date_gathered).year()));
    const currentYear = moment().year();
    const years = Array.from(yearsSet).filter(year => year <= currentYear).sort((a, b) => b - a);

    //forChart
    const month = selMonth;
    const year = selYear;
    const days = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
    const daysInMonth = [];
    for (let i = 1; i <= days; i++) {
        daysInMonth.push(i);
    }

    const filteredData = resData.filter(item => {
        const date = moment(item.date_gathered);
        return date.month() + 1 === parseInt(month) && date.year() === parseInt(year);
    });

    const dataByDay = daysInMonth.map(day => {
        const dayData = filteredData.filter(item => moment(item.date_gathered).date() === day);
        const totalForDay = dayData.reduce((sum, item) => sum + parseInt(item.totalBikeRentPrice, 10), 0);
        return totalForDay;
    });

    const dataByDayResFee = daysInMonth.map(day => {
        const dayData = filteredData.filter(item => moment(item.date_gathered).date() === day);
        const totalForDay = dayData.reduce((sum, item) => sum + parseInt(item.totalReservationFee, 10), 0);
        return totalForDay;
    });

    const datasets = [
        {
            label: `${datatype}`,
            data: dataByDay,
            fill: false,
            backgroundColor: 'rgb(209, 230, 28)',
            borderColor: 'rgb(121, 133, 18)',
        }
    ];

    if (datatype === 'Reservation') {
        datasets.push({
            label: `Reservation Fee`,
            data: dataByDayResFee,
            fill: false,
            backgroundColor: 'rgb(183, 28, 230)',
            borderColor: 'rgb(89, 17, 110)',
        });
    }

    const dataByMonth = {
        labels: daysInMonth,
        datasets: datasets,
    }
    const options = {
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Days of the Month '
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Total Bike Rent Price'
                }
            }
        }
    };



    //doughnut
    const doughnutData = {
        labels: ['Adult Bike', 'Kids Bike'],
        datasets: [
            {
                data: Object.values(bikeData), // Replace with your actual data variables
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB']
            }
        ]
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'left',
                labels: {
                    font: {
                        size: 18,
                        family: 'Arial',
                    },
                    padding: 20,
                }
            },
            title: {
                display: true,
                text: 'Bike Types Distribution'
            }
        }
    };

    return (
        <Box p={4} bg="#E2E2D5" borderRadius="15px" boxShadow="lg" w='975px' h='620px'>
            <Box display='flex' justifyContent='flex-end' mb='20px' alignContent={'center'}>
                <Box display='flex' gap='10px'>
                    <Text fontSize={'24px'}>filters:</Text>
                </Box>
                <Box display='flex' gap='10px'>
                    <Select w='200px' bg='white' defaultValue={moment().format('MMMM')} borderRadius='5px' onChange={(e) => {
                        const monthNumber = moment().month(e.target.value).format('MM');
                        setSelMonth(monthNumber);
                    }}>
                        {months.map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </Select>
                    <Select w='200px' bg='white' defaultValue={moment().format('YYYY')} borderRadius='5px' onChange={(e) => setSelYear(e.target.value)}>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </Select>
                    <Select w='200px' bg='white' borderRadius='5px' onChange={(e) => setDataType(e.target.value)}>
                        <option value="Reservation">Reservation</option>
                        <option value="Walk-in">Walk-in</option>
                    </Select>
                </Box>
            </Box>
            <Box display='flex' justifyContent='flex-start' gap='20px' w={'100%'}>
                <Box w='25%' h='175px' bg='white' borderRadius='15px' boxShadow='lg' display='flex' flexDirection='column' justifyContent='space-between' p={4}>
                    <Box>
                        <Text fontSize='24px' textAlign='center' m={0}>Total Revenue </Text>
                        <Text fontSize='18px' textAlign='center' m={0}>({datatype})</Text>
                    </Box>
                    <Text fontSize='24px' textAlign='center' m={0}>&#8369; {totalRevenue}</Text>
                </Box>
                <Box w='25%' h='175px' bg='white' borderRadius='15px' boxShadow='lg' display='flex' flexDirection='column' justifyContent='space-between' p={4}>
                    <Box>
                        <Text fontSize='24px' textAlign='center' m={0}>Total Reservation Fees</Text>
                    </Box>
                    <Text fontSize='24px' textAlign='center' m={0}>&#8369; {totalReservationFee ? `${totalReservationFee}` : 'N/A'}</Text>
                </Box>
                <Box w='50%' h='175px' bg='white' borderRadius='15px' boxShadow='lg'>
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                </Box>
            </Box>
            <Box bg='#EEE0FF' borderRadius='15px' mt='20px'>
                <Bar data={dataByMonth} options={options} height={100} />
            </Box>
        </Box>
    );
}

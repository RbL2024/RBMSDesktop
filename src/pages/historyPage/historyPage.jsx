import React, { useEffect, useState } from 'react'
import './historyPage.css'
import { Box, Text, Select, Button, ScaleFade } from '@chakra-ui/react'
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Tooltip
} from '@chakra-ui/react'


const fetchAdminAcc = window.api;

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'short' }); // Get short month name
    const day = String(date.getDate()).padStart(2, '0'); // Pad single digit days with a leading zero
    return `${month}/${day}/${year}`;
};

export default function UserPage() {
    const [selectedQueue, setselectedQueue] = useState('User-Accounts');
    const [loading, setLoading] = useState(false);
    const [fetchedData, setFetchedData] = useState([]);
    const [isSAdmin, setisSAdmin] = useState('');
    const [selectedRowIndex, setSelectedRowIndex] = useState(null); // Track the selected row index
    const [getRes, setGetRes] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const gatherRes = async () => {
            try {
                const res = await window.api.getReservationsALL();
                // console.log(res.records); 
                const records = res.records || [];

                setGetRes(records);
            } catch (error) {
                console.error(error);
            }
        }
        gatherRes();

        const intervalId = setInterval(gatherRes, 5000);

        // Cleanup function to clear the interval on component unmount
        return () => clearInterval(intervalId);
    }, [])

    const fetchWalkIn = async () => {
        console.log('walkin');
    }

    const fetchReservation = async () => {
        console.log('reservation');
    }


    const handleSelectChange = (event) => {
        setselectedQueue(event.target.value);
        // console.log("Selected Account Type:", event.target.value);
    };


    const handleApply = () => {
        if (selectedQueue === 'walk-in') {
            fetchWalkIn();
        }
        if (selectedQueue === 'reservation') {
            fetchReservation();
        }
    }


    const handleRowClick = (index) => {
        setSelectedRowIndex(index); // Set the selected row index
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...getRes].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <MdArrowDropUp /> : <MdArrowDropDown />;
    };

    return (
        <Box>
            {/* <Box display='flex'>
                <Select icon={<MdArrowDropDown />} w='200px' height='30px' outline='none' border='none' variant='unstyled' value={selectedQueue} onChange={handleSelectChange}>
                    <option value="" hidden>Accounts</option>
                    <option value="reservation">Reservation</option>
                    <option value="walk-in">Walk In</option>
                </Select>
                <Button onClick={handleApply} ml='5px' mr='5px' bg='#355E3B' height='30px' width='120px' color='white' rounded='12px' isLoading={loading}>
                    Apply
                </Button>
            </Box> */}
            <Box mt='10px' bg='#E2E2D5' w='975px' h='585px' shadow='lg' rounded='2xl'>
                <TableContainer className='Acctable' maxH='580px' overflowY='auto' rounded='2xl'>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th cursor="pointer" onClick={() => handleSort('index')}>
                                    No. {getSortIcon('index')}
                                </Th>
                                <Th cursor="pointer" onClick={() => handleSort('name')}>
                                    Name {getSortIcon('name')}
                                </Th>
                                <Th cursor="pointer" onClick={() => handleSort('email')}>
                                    Email {getSortIcon('email')}
                                </Th>
                                <Th cursor="pointer" onClick={() => handleSort('bike_id')}>
                                    Bike ID {getSortIcon('bike_id')}
                                </Th>
                                <Th cursor="pointer" onClick={() => handleSort('reservation_date')}>
                                    Date Reserved/Rented {getSortIcon('reservation_date')}
                                </Th>
                                <Th cursor="pointer" onClick={() => handleSort('phone')}>
                                    Contact No. {getSortIcon('phone')}
                                </Th>
                                <Th cursor="pointer" onClick={() => handleSort('bikeStatus')}>
                                    Remarks {getSortIcon('bikeStatus')}
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {sortedData.map((bike, index) => (
                                <Tr
                                    key={bike._id}
                                    onClick={() => handleRowClick(index)}
                                    bg={selectedRowIndex === index ? 'blue.100' : '#E2E2D5'}
                                    cursor="pointer"
                                >
                                    <Td fontSize='sm'>{index + 1}</Td>
                                    <Td fontSize='sm'>
                                        <Tooltip label={bike.name} aria-label="Name Tooltip">
                                            {bike.name}
                                        </Tooltip>
                                    </Td>
                                    <Td fontSize='sm'>
                                        <Tooltip label={bike.email} aria-label="Email Tooltip">
                                            {bike.email}
                                        </Tooltip>
                                    </Td>
                                    <Td fontSize='sm'>
                                        <Tooltip label={bike.bike_id} aria-label="Bike ID Tooltip">
                                            {bike.bike_id}
                                        </Tooltip>
                                    </Td>
                                    <Td fontSize='sm'>
                                        {bike.reservation_date ? formatDate(bike.reservation_date) : formatDate(bike.rented_date)}
                                    </Td>
                                    <Td fontSize='sm'>
                                        <Tooltip label={bike.phone} aria-label="Phone Tooltip">
                                            {bike.phone}
                                        </Tooltip>
                                    </Td>
                                    <Td fontSize='sm' color={bike.bikeStatus === 'COMPLETE' ? 'green.500' : 'red.500'}>
                                        {bike.bikeStatus}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>No.</Th>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Bike ID</Th>
                                <Th>Date Reserved/Rented</Th>
                                <Th>Contact No.</Th>
                                <Th>Remarks</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

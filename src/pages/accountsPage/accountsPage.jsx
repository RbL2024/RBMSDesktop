import React, { useEffect, useState } from 'react'
import './accountsPage.css'
import { Box, Text, Select, Button, ScaleFade } from '@chakra-ui/react'
import { MdArrowDropDown } from "react-icons/md";
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
} from '@chakra-ui/react'


const fetchAdminAcc = window.api;

export default function UserPage() {
    const [selectedAccountType, setSelectedAccountType] = useState('User-Accounts');
    const [loading, setLoading] = useState(false);
    const [fetchedData, setFetchedData] = useState([]);
    const [isSAdmin, setisSAdmin] = useState('');
    const [selectedRowIndex, setSelectedRowIndex] = useState(null); // Track the selected row index
    

    const fetchUsers = async () => {
        setFetchedData([]);
        setLoading(true);
        try {
            // const url = 'http://localhost:8917/fetchUserAccounts'
            const url = 'https://rbms-backend-g216.onrender.com/fetchUserAccounts'
            const res = await fetchAdminAcc.fetchData(url);
            setFetchedData(res);
            console.log(res);
        } catch (error) {
            console.error('Error fetching data:', err);
        }
        console.log('users');
        setLoading(false);
    }

    const fetchAdmins = async () => {
        setFetchedData([]);
        setLoading(true);
        try {
            const url = 'https://rbms-backend-g216.onrender.com/fetchAdminAccounts'
            const res = await fetchAdminAcc.fetchData(url);
            setFetchedData(res);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
        // console.log('admins');
        
    }

    useEffect(() => {
        setisSAdmin(localStorage.getItem('isSAdmin'));
        if (selectedAccountType === 'User-Accounts') {
            fetchUsers();
        }
    }, [])

    const handleSelectChange = (event) => {
        setSelectedAccountType(event.target.value);
        // console.log("Selected Account Type:", event.target.value);
    };


    const handleApply = () => {
        if (selectedAccountType === 'User-Accounts') {
            fetchUsers();
        }
        if (selectedAccountType === 'Admin-Accounts') {
            fetchAdmins();
        }
    }
    

    const handleRowClick = (index) => {
        setSelectedRowIndex(index); // Set the selected row index
        const selectedRow = fetchedData[index];

    };
    
    
    return (
        <Box>
            <Box display='flex'>
                <Select icon={<MdArrowDropDown />} w='200px' height='30px' outline='none' border='none' variant='unstyled' value={selectedAccountType} onChange={handleSelectChange}>
                    {/* <option value="" hidden>Accounts</option> */}
                    <option value="User-Accounts">User Accounts</option>
                    {isSAdmin==='true' ? <option value="Admin-Accounts">Admin Accounts</option> : ''}
                </Select>
                <Button onClick={handleApply} ml='5px' mr='5px' bg='#355E3B' height='30px' width='120px' color='white' rounded='12px' isLoading={loading}>
                    Apply
                </Button>
            </Box>
            <Box mt='10px' bg='#E2E2D5' w='975px' h='585px' shadow='lg' rounded='2xl'>
                <TableContainer className='Acctable' maxH='580px' overflowY='auto' rounded='2xl'>
                    <Table variant='simple' >
                        <Thead>
                            <Tr>
                                <Th>No.</Th>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Address</Th>
                                <Th>Contact No.</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                selectedAccountType === 'User-Accounts'
                                ? fetchedData.map((admin, index) => (
                                    <Tr
                                        key={index} 
                                        onClick={() => handleRowClick(index)} // Set selected row index on click
                                        bg={selectedRowIndex === index ? 'blue.100' : '#E2E2D5'} // Change background if selected
                                        cursor="pointer" // Change cursor to pointer
                                    >
                                        <Td fontSize='sm'>{index + 1}</Td>
                                        <Td fontSize='sm'>{`${admin.c_last_name}, ${admin.c_first_name}  ${admin.c_middle_name}`}<br/>
                                            {`${admin.c_username}`}
                                        </Td>
                                        <Td fontSize='sm'>{`${admin.c_email}`}</Td>
                                        <Td fontSize='sm'>{`${admin.c_full_address.street}, ${admin.c_full_address.city}, ${admin.c_full_address.province}, (${admin.c_full_address.postalCode})`}</Td>
                                        <Td fontSize='sm'>{`${admin.c_phone}`}</Td>
                                    </Tr>
                                ))
                                :selectedAccountType === 'Admin-Accounts'
                                ?fetchedData.map((admin, index) => (
                                    <Tr
                                        key={index} 
                                        onClick={() => handleRowClick(index)} // Set selected row index on click
                                        bg={selectedRowIndex === index ? 'blue.100' : '#E2E2D5'} // Change background if selected
                                        cursor="pointer" // Change cursor to pointer
                                    >
                                        <Td fontSize='sm'>{index + 1}</Td>
                                        <Td fontSize='sm'>{`${admin.a_last_name}, ${admin.a_first_name}  ${admin.a_middle_name}`}<br/>
                                            {`${admin.a_username}`}
                                        </Td>
                                        <Td fontSize='sm'>{`${admin.a_email}`}</Td>
                                        <Td fontSize='sm'>{`${admin.a_address}`}</Td>
                                        <Td fontSize='sm'>{`${admin.a_contactnum}`}</Td>
                                    </Tr>
                                ))
                                :''
                                
                            }
                            {/* {fetchedData.map((admin, index) => (
                                <Tr
                                    key={index} 
                                    onClick={() => handleRowClick(index)} // Set selected row index on click
                                    bg={selectedRowIndex === index ? 'blue.100' : '#E2E2D5'} // Change background if selected
                                    cursor="pointer" // Change cursor to pointer
                                >
                                    <Td fontSize='sm'>{index + 1}</Td>
                                    <Td fontSize='sm'>{`${admin.a_last_name}, ${admin.a_first_name}  ${admin.a_middle_name}`}<br/>
                                        {`${admin.a_username}`}
                                    </Td>
                                    <Td fontSize='sm'>{`${admin.a_email}`}</Td>
                                    <Td fontSize='sm'>{`${admin.a_address}`}</Td>
                                    <Td fontSize='sm'>{`${admin.a_contactnum}`}</Td>
                                </Tr>
                            ))} */}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>No.</Th>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Address</Th>
                                <Th>Contact No.</Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

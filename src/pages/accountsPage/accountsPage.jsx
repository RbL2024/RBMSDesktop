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
        
        setLoading(true);
        try {
            // const url = 'http://localhost:8917/fetchUserAccounts'
            const url = 'https://rbms-backend-g216.onrender.com/fetchUserAccounts'
            const res = await fetchAdminAcc.fetchData(url);
            setFetchedData(res);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    }

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            // const url = 'http://localhost:8917/fetchAdminAccounts'
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
        // if (selectedAccountType === 'User-Accounts') {
        //     fetchUsers();
        // }
    }, [])

    const handleSelectChange = (event) => {
        setFetchedData([]);
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
                    {isSAdmin === 'true' ? <option value="Admin-Accounts">Admin Accounts</option> : ''}
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
                                    ? fetchedData.length === 0?
                                    <Tr>
                                        <Td colSpan='5' textAlign='center'>No User Accounts , press Apply to refresh</Td>
                                    </Tr>
                                    :fetchedData.map((admin, index) => (
                                        <Tr
                                            key={index}
                                            onClick={() => handleRowClick(index)}
                                            bg={selectedRowIndex === index ? 'blue.100' : '#E2E2D5'}
                                            cursor="pointer"
                                        >
                                            <Td fontSize='sm'>{index + 1}</Td>
                                            <Td fontSize='sm'>
                                                {admin.c_last_name || 'N/A'}, {admin.c_first_name || 'N/A'} {admin.c_middle_name || ''}<br />
                                                {admin.c_username || 'N/A'}
                                            </Td>
                                            <Td fontSize='sm'>{admin.c_email || 'N/A'}</Td>
                                            <Td fontSize='sm'>
                                                {admin.c_full_address?.street || 'N/A'},
                                                {admin.c_full_address?.city || 'N/A'},
                                                {admin.c_full_address?.province || 'N/A'},
                                                ({admin.c_full_address?.postalCode || 'N/A'})
                                            </Td>
                                            <Td fontSize='sm'>{admin.c_phone || 'N/A'}</Td>
                                        </Tr>
                                    ))
                                    
                                    : selectedAccountType === 'Admin-Accounts'
                                        ? 
                                        fetchedData.length === 0?
                                        <Tr>
                                            <Td colSpan='5' textAlign='center'>No Admin Accounts , press Apply to refresh</Td>
                                        </Tr>
                                        :fetchedData.map((admin, index) => (
                                            <Tr
                                                key={index}
                                                onClick={() => handleRowClick(index)}
                                                bg={selectedRowIndex === index ? 'blue.100' : '#E2E2D5'}
                                                cursor="pointer"
                                            >
                                                <Td fontSize='sm'>{index + 1}</Td>
                                                <Td fontSize='sm'>
                                                    {admin.a_last_name || 'N/A'}, {admin.a_first_name || 'N/A'} {admin.a_middle_name || ''}<br />
                                                    {admin.a_username || 'N/A'}
                                                </Td>
                                                <Td fontSize='sm'>{admin.a_email || 'N/A'}</Td>
                                                <Td fontSize='sm'>{admin.a_address || 'N/A'}</Td>
                                                <Td fontSize='sm'>{admin.a_contactnum || 'N/A'}</Td>
                                            </Tr>
                                        ))
                                        : ''
                            }
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

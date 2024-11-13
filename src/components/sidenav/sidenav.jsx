import React, { useEffect, useState } from 'react'
import './sidenav.css'
import { Box, Text, Link, VStack, useDisclosure, Button } from '@chakra-ui/react'
import { MdOutlineDashboard, MdHistoryEdu, MdOutlineDriveFolderUpload, MdShareLocation, MdArrowDropDown } from 'react-icons/md'
import { IoAnalyticsSharp } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { RiTicket2Line } from "react-icons/ri";
import { LuBike } from "react-icons/lu";
import { RxExit } from "react-icons/rx";
import { Icon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

import {useShared} from '../../contextAPI.jsx';

const closeMe = window.api;
const Sidenav = () => {
    // const [activeLink, setActiveLink] = useState('Dashboard');
    const  {activeLink, setActiveLink} = useShared();

    const [isSAdmin, setisSAdmin] = useState('');

    const { setActiveP } = useShared();
    
    
    const handleLinkClick = (linkName) => {
        setActiveLink(linkName);
        // setActivePage(linkName);
        setActiveP(linkName);
        // console.log(linkName);
    };
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleYesClick = () => {
        closeMe.close();
    }
    useEffect(()=>{
        setisSAdmin(localStorage.getItem('isSAdmin'));
    },[])
    return (
        <Box w='200px' height='87vh' shadow='2xl' borderRadius='2xl' bg='#E2E2D5' ml='20px'>
            <VStack pos='relative' w='100%' >
                <Box pos='absolute' w='100%' mt='40px' bg='#E2E2D5'>
                    <Box mb='10px' mt='10px'>
                        <Link className={`nav-links ${activeLink === 'Dashboard' ? 'active' : ''}`} href='#' h='10px' style={{ textDecoration: 'none' }} onClick={() => handleLinkClick('Dashboard')}>
                            <Box className='nav-content' p='7px' display='flex' pl='20px'>
                                <Icon as={MdOutlineDashboard} boxSize={6} mr={2} />
                                <Text m='0' fontSize='16px' pt='2px'>Dashboard</Text>
                            </Box>
                        </Link>
                    </Box>
                    <Box mb='10px' mt='10px'>
                        <Link className={`nav-links ${activeLink === 'User' ? 'active' : ''}`} href='#' h='10px' style={{ textDecoration: 'none' }} onClick={() => handleLinkClick('User')}>
                            <Box className='nav-content' p='7px' display='flex' pl='20px'>
                                <Icon as={FaRegUser} boxSize={6} mr={2} />
                                <Text m='0' fontSize='16px' pt='2px'>Accounts</Text>
                            </Box>
                        </Link>
                    </Box>
                    <Box mb='10px' mt='10px'>
                        <Link className={`nav-links ${activeLink === 'History' ? 'active' : ''}`} href='#' h='10px' style={{ textDecoration: 'none' }} onClick={() => handleLinkClick('History')}>
                            <Box className='nav-content' p='7px' display='flex' pl='20px'>
                                <Icon as={MdHistoryEdu} boxSize={6} mr={2} />
                                <Text m='0' fontSize='16px' pt='2px'>History</Text>
                            </Box>
                        </Link>
                    </Box>
                    {(isSAdmin==='true')?(
                        <Box mb='10px' mt='10px'>
                        <Link className={`nav-links ${activeLink === 'Analytics' ? 'active' : ''}`} href='#' h='10px' style={{ textDecoration: 'none' }} onClick={() => handleLinkClick('Analytics')}>
                            <Box className='nav-content' p='7px' display='flex' pl='20px'>
                                <Icon as={IoAnalyticsSharp} boxSize={6} mr={2} />
                                <Text m='0' fontSize='16px' pt='2px'>Analytics</Text>
                            </Box>
                        </Link>
                    </Box>
                    ): ''}
                    <Box mb='10px' mt='10px'>
                        <Link className={`nav-links ${activeLink === 'Reservation' ? 'active' : ''}`} href='#' h='10px' style={{ textDecoration: 'none' }} onClick={() => handleLinkClick('Reservation')}>
                            <Box className='nav-content' p='7px' display='flex' pl='20px'>
                                <Icon as={RiTicket2Line} boxSize={6} mr={2} />
                                <Text m='0' fontSize='16px' pt='2px'>Reservation</Text>
                            </Box>
                        </Link>
                    </Box>
                    <Box mb='10px' mt='10px'>
                        <Link className={`nav-links ${activeLink === 'Upload' ? 'active' : ''}`} href='#' h='10px' style={{ textDecoration: 'none' }} onClick={() => handleLinkClick('Upload')}>
                            <Box className='nav-content' p='7px' display='flex' pl='20px'>
                                <Icon as={MdOutlineDriveFolderUpload} boxSize={6} mr={2} />
                                <Text m='0' fontSize='16px' pt='2px'>Upload</Text>
                            </Box>
                        </Link>
                    </Box>
                    <Box mb='10px' mt='10px'>
                        <Link className={`nav-links ${activeLink === 'Availability' ? 'active' : ''}`} href='#' h='10px' style={{ textDecoration: 'none' }} onClick={() => handleLinkClick('Availability')}>
                            <Box className='nav-content' p='7px' display='flex' pl='20px'>
                                <Icon as={LuBike} boxSize={6} mr={2} />
                                <Text m='0' fontSize='16px' pt='2px'>Availability</Text>
                            </Box>
                        </Link>
                    </Box>
                    <Box mb='10px' mt='10px'>
                        <Link className={`nav-links ${activeLink === 'Gps Tracking' ? 'active' : ''}`} href='#' h='10px' style={{ textDecoration: 'none' }} onClick={() => handleLinkClick('Gps Tracking')}>
                            <Box className='nav-content' p='7px' display='flex' pl='20px'>
                                <Icon as={MdShareLocation} boxSize={6} mr={2} />
                                <Text m='0' fontSize='16px' pt='2px'>Gps Tracking</Text>
                            </Box>
                        </Link>
                    </Box>


                    <Box mb='10px' mt='100px'>
                        <Link className='nav-links' href='#' h='10px' style={{ textDecoration: 'none' }} onClick={onOpen}>
                            <Box p='7px' display='flex' pl='60px'>
                                <Icon as={RxExit} boxSize={6} mr={2} />
                                <Text m='0' fontSize='16px' pt='2px'>Exit</Text>
                            </Box>
                        </Link>
                    </Box>
                    <Modal isCentered isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Exit Confirm</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Text>Are you sure you want to quit?</Text>
                            </ModalBody>
                            <ModalFooter display='flex' justifyContent='center'>
                                <Box as='button' bg='#355E3B' w='125px' h='30px' color='white' rounded='lg' mr='5px' ml='5px' onClick={handleYesClick}>
                                    Yes
                                </Box>
                                <Box as='button' bg='#AB0505' w='125px' h='30px' color='white' rounded='lg' mr='5px' ml='5px'  onClick={onClose}>
                                    Cancel
                                </Box>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Box>
            </VStack>
        </Box>
    )
}

export default Sidenav;
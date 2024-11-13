import React, { useState, useEffect } from 'react'
import './header.css'
import { Box, Text, Avatar, Link, VStack, Divider, Tooltip, useDisclosure, Button } from '@chakra-ui/react'
import { MdArrowDropDown } from 'react-icons/md';
import { FaCircleMinus } from "react-icons/fa6";
import { Icon } from '@chakra-ui/icons'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton
} from '@chakra-ui/react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Center,
    useToast
} from '@chakra-ui/react'

import { useShared } from '../../contextAPI.jsx'

import Man from '../../assets/images/dashboard/man.png'
const minimizeMe = window.api;
const accountHandling = window.api;
export default function header() {
    const toast = useToast();
    const [sessName, setSessName] = useState('');
    const [showProfMenu, setShowProfMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(makeUser(4));
    const [password, setPassword] = useState(makePass(4));
    // const [password, setPassword] = useState('');
    // const [cpassword, setCPassword] = useState('');

    const [isAdmin, setAdmin] = useState();
    const handleAddAdmin = () => {
        onDrawerOpen(); // Open the drawer when "Add Admin" is clicked
        setShowProfMenu(false); // Close the profile menu
    };
    const toggleProfMenu = () => {
        setShowProfMenu(!showProfMenu);
    };

    useEffect(() => {
        setSessName(localStorage.getItem('sessionUName'));
        setAdmin(localStorage.getItem('isSAdmin'))
        const handleClickOutside = (event) => {
            if (showProfMenu && !event.target.closest('.prof') && !event.target.closest('.profMenu')) {
                setShowProfMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfMenu]);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleYesClick = () => {
        setLoading(true);
        localStorage.clear();

        window.location.reload();
        setLoading(false);
    }

    const minimizeApp = () => {
        // Minimize the app
        minimizeMe.minimize();
    };


    const { setActiveP } = useShared();
    const handleEditProf = (pName) => {
        setActiveP(pName)
        setShowProfMenu(false);
    }
    const handleLogout = () => {
        onOpen();
        setShowProfMenu(false);
    }

    const clearInputs = () => {
        setFirstname('');
        setLastname('');
        setEmail('');
        setUsername(makeUser(4));
        setPassword(makePass(4))

    }

    const handleAccountCreate = async () => {
        try {
            const data = {
                i_first_name: firstname,
                i_last_name: lastname,
                i_email: email,
                i_username: username,
                i_password: password
            }
            const response = await accountHandling.ADMINcheck(data);
            console.log(response.isFound)
            if (response.isFound) {
                alert('already registered')
                clearInputs();
            } else {
                const cRes = await accountHandling.ADMINcreate(data);
                if (cRes.created) {

                    alert('Account created, please check your email for your credentials')
                    clearInputs();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = () => {
        handleAccountCreate();
    }
    return (
        <Box>
            <Box className="header-top" w='97vw' h='3vh' bg='#355E3B' />
            <Tooltip hasArrow label="Minimize" bg='gray.300' color='black'>

                <Box pos='absolute' bg='#355E3B' h='3vh' w='40px' top='0' right='0'>
                    <Icon as={FaCircleMinus} color='Yellow' cursor='pointer' position='absolute' right='5px' mt='3px' onClick={minimizeApp} />
                </Box>
            </Tooltip>
            <Box className="row" h='7vh'>
                <Box className="col-md-6 ">
                    <Box id="company_name">
                        <Text fontSize='34px' fontWeight='extrabold' pl='12px' m='0'>RB<span style={{ color: '#355E3B' }}>MS</span></Text>
                    </Box>
                </Box>
                <Box className="col-md-6">
                    <Box className='d-flex align-items-center justify-content-end' pr='12px'>
                        <Box>
                            <Text m='0' fontWeight='bold' color='gray' >Hey, <span style={{ color: 'black' }}>{sessName}</span></Text>
                            <Text m='0' fontSize='12px' align='end'><span>{(localStorage.getItem('isSAdmin') === 'true') ? 'Super Admin' : 'Admin'}</span></Text>
                        </Box>
                        <Box className='prof d-flex align-items-center' onClick={toggleProfMenu} cursor='pointer'>
                            <Avatar pl='2px' pt={0} size='md' src={Man} />
                            <Icon as={MdArrowDropDown} />
                        </Box>
                        <Box className='profMenu' w='150px' h='fit-content' p='12px' bg='#E2E2D5' pos='absolute' zIndex='999' mt='10rem' shadow='lg' rounded='md' display={showProfMenu ? 'block' : 'none'}>
                            <Box as='button' w='100%' _hover={{ color: '#50C878' }} onClick={() => handleEditProf('Edit Profile')}>
                                <Text m={0} textAlign='right'>Edit Profile</Text>
                            </Box>
                            {
                                isAdmin==='true' ? (
                                    <Box as='button' w='100%' _hover={{ color: '#50C878' }} onClick={handleAddAdmin}>
                                        <Text m={0} textAlign='right'>Add Admin</Text>
                                    </Box>
                                )
                                :''
                            }
                            <Divider orientation='horizontal' m='2px' borderColor='#355E3B' />
                            <Box as='button' w='100%' _hover={{ color: '#50C878' }} onClick={() => handleLogout()}>
                                <Text m={0} textAlign='right'>Logout</Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Modal isCentered isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader textAlign='center'>Logout Confirm</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>Are you sure you want to logout?</Text>
                        </ModalBody>
                        <ModalFooter display='flex' justifyContent='center'>
                            <Button bg='#355E3B' w='125px' h='30px' color='white' rounded='lg' mr='5px' ml='5px' onClick={handleYesClick} isLoading={loading}>
                                Yes
                            </Button>
                            <Box as='button' bg='#AB0505' w='125px' h='30px' color='white' rounded='lg' mr='5px' ml='5px' onClick={onClose}>
                                Cancel
                            </Box>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
            <Drawer
                isOpen={isDrawerOpen}
                placement='right'
                onClose={onDrawerClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Create account for Admin</DrawerHeader>


                    <DrawerBody>
                        <FormControl isRequired mb={5}>
                            <FormLabel m='0'>First name</FormLabel>
                            <Input type='text' value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                        </FormControl>
                        <FormControl isRequired mb={5}>
                            <FormLabel m='0'>Last name</FormLabel>
                            <Input type='text' value={lastname} onChange={(e) => setLastname(e.target.value)} />

                        </FormControl>
                        <FormControl isRequired mb={5}>
                            <FormLabel m='0'>Email</FormLabel>
                            <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />

                        </FormControl>
                        <FormControl isRequired mb={5}>
                            <FormLabel m='0'>Username</FormLabel>
                            <Input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />

                        </FormControl>
                        {/* <FormControl isRequired mb={5}>
                            <FormLabel m='0'>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e)=>setPassword(e.target.value)}/>

                                <InputRightElement>
                                    <Icon
                                        as={showPassword ? FaEyeSlash : FaEye}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >

                                    </Icon>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl isRequired mb={5}>
                            <FormLabel m='0'>Confirm Password</FormLabel>
                            <InputGroup>
                                <Input type={showCPassword ? 'text' : 'password'} value={cpassword} onChange={(e)=>setCPassword(e.target.value)}/>

                                <InputRightElement>
                                    <Icon
                                        as={showCPassword ? FaEyeSlash : FaEye}
                                        onClick={() => setShowCPassword(!showCPassword)}
                                    >

                                    </Icon>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl> */}
                    </DrawerBody>

                    <DrawerFooter pos='relative'>
                        <Box display='flex' justifyContent='center' gap='5px' w='100%'>
                            <Box pos='relative' bg='#355E3B' w='100px' h='40px' rounded='lg' color='white' _hover={{ background: '#244028', color: 'white' }} onClick={handleSubmit}>
                                <Center m={0} w='100%' h='100%'>Submit</Center>
                            </Box>
                            <Box pos='relative' bg='#6c7b6d' w='100px' h='40px' rounded='lg' color='white' _hover={{ background: '#515c52', color: 'white' }} onClick={onDrawerClose}>
                                <Center m={0} w='100%' h='100%'>Cancel</Center>
                            </Box>
                        </Box>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}


function makeUser(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return "ADMIN_" + result;
}

function makePass(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return "ADMIN_" + result;
}
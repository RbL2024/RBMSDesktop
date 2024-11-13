import React from 'react'
import { Box, Text, Avatar, Select, PinInput, PinInputField, HStack } from '@chakra-ui/react'
import defAvatar from '../../assets/images/dashboard/man.png'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Button,
    ButtonGroup,
    useToast,
    Icon,
    InputRightElement,
    InputGroup,
} from '@chakra-ui/react'
import { FaEyeSlash, FaEye } from "react-icons/fa";

const loadAccount = window.api;
const myOTP = makeid(4);

export default function EditprofilePage() {

    const [username, setUsername] = React.useState('')
    const [firstname, setFirstName] = React.useState('')
    const [middlename, setMiddleName] = React.useState('')
    const [lastname, setLastName] = React.useState('')
    const [gender, setGender] = React.useState('')
    const [address, setAddress] = React.useState('')
    const [phone, setPhone] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [npassword, setNPassword] = React.useState('')
    const [confirmNPassword, setConfirmNPassword] = React.useState('')
    const [otp, setOtp] = React.useState('');

    const [showNPass, setShowNPass] = React.useState(false);
    const [showNCPass, setShowNCPass] = React.useState(false);
    

    const [isLoading, setIsLoading] = React.useState(false);

    const [isEditing, setIsEditing] = React.useState(false);
    
    const toast = useToast();

    const handleEditClick = () => {
        setIsEditing(true);
    };
    const handleCancelEdit = () => {
        setIsEditing(false);
    }

    const loadUserInfo = async () => {
        try {
            const myID = localStorage.getItem('userID')
            const lui = await loadAccount.loadUser(myID);

            setUsername(lui.a_username)
            setFirstName(lui.a_first_name)
            setMiddleName(lui.a_middle_name)
            setGender(lui.a_gender)
            setLastName(lui.a_last_name)
            setAddress(lui.a_address)
            setPhone(lui.a_contactnum)
            setEmail(lui.a_email)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSaveChanges = async () => {
        try {
            const myID = localStorage.getItem('userID');
            const data = {
                a_first_name: firstname,
                a_middle_name: middlename,
                a_last_name: lastname,
                a_gender: gender,
                a_address: address,
                a_contactnum: phone,
                a_email: email
            }
            const response = await loadAccount.updateUser(myID, data);
            if (response.updated) {
                toast({
                    title: 'Success',
                    description: 'Changes saved successfully',
                    status: 'success',
                    duration: 2000,
                    onCloseComplete: () => {
                        window.location.reload();
                    }
                })
                localStorage.setItem('sessionUName', response.account.a_first_name);

                setIsEditing(false);
            }
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    React.useEffect(() => {
        loadUserInfo();
    }, [])

    const handleOTPChange = (value) => {
        setOtp(value);
    }
    const handleGetOTP = async () => {
        try {
            setIsLoading(true);
            if (email === '') {
                toast({
                    title: 'Error',
                    description: 'Please input your email first',
                    status: 'error',
                    duration: 2000,
                    position: 'top-right',
                    onCloseComplete: () => {
                        setIsLoading(false);
                    }
                })
            }
            const data = {
                emailTo: email,
                myOTP: myOTP

            }
            const getOtp = await window.api.sendOTP(data)
            if (getOtp) {
                toast({
                    title: 'OTP Sent',
                    description: 'please check your email for OTP',
                    status: 'success',
                    duration: 2000,
                    position: 'top-right',
                    onCloseComplete: () => {
                        setIsLoading(false);
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleResetPass = async () => {
        try {
            const myID = localStorage.getItem('userID');
            const data = {
                a_password: npassword
            }

            if (npassword === '' || confirmNPassword === '' || otp === '') {
                toast({
                    title: 'Error',
                    description: 'Please fill all password fields and OTP',
                    status: 'error',
                    duration: 2000,
                    position: 'top-right',
                })
            } else if (npassword !== confirmNPassword) {
                toast({
                    title: 'Error',
                    description: 'Passwords do not match',
                    status: 'error',
                    duration: 2000,
                    position: 'top-right',
                })
            } else if (otp !== myOTP) {
                console.log(otp, myOTP)
                toast({
                    title: 'Error',
                    description: 'Invalid OTP',
                    status: 'error',
                    duration: 2000,
                    position: 'top-right',
                })
            } else {
                const res = await window.api.updatePass(myID, data);
                if (res.pUpdated) {
                    toast({
                        title: 'Password Updated',
                        description: 'Your password has been updated successfully, use it on your next login',
                        status: 'success',
                        duration: 2000,
                        position: 'top-right',
                    })
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box width='975px' height='625px' bg='#E2E2D5' rounded='2xl' shadow='lg' pos='relative' p='20px'>
            <Box display='flex' width='100%' justifyContent='center'>
                <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column'>
                    <Avatar size='xl' src={defAvatar} />
                    <Text fontSize='xl' fontWeight='bold' m='0'>{username}</Text>
                </Box>
            </Box>
            <Box mt='15px' width='100%' display='flex' justifyContent='center' flexDirection='row' gap='20px'>
                <Box width='45%'>
                    <FormControl mb='12px'>
                        <FormLabel m={0}>First Name</FormLabel>
                        <Input type='Text' bg='#FFFFFF' value={firstname} onChange={(e) => setFirstName(e.target.value)} disabled={!isEditing} />
                    </FormControl>
                    <FormControl mb='12px'>
                        <FormLabel m={0}>Middle Name</FormLabel>
                        <Input type='Text' bg='#FFFFFF' value={middlename} onChange={(e) => setMiddleName(e.target.value)} disabled={!isEditing} />
                    </FormControl>
                    <FormControl mb='12px'>
                        <FormLabel m={0}>Last Name</FormLabel>
                        <Input type='Text' bg='#FFFFFF' value={lastname} onChange={(e) => setLastName(e.target.value)} disabled={!isEditing} />
                    </FormControl>
                    <FormControl mb='12px'>
                        <FormLabel m={0}>Gender</FormLabel>
                        <Select placeholder='Select option' value={gender} onChange={handleGenderChange} bg='#FFFFFF' disabled={!isEditing}>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                        </Select>
                    </FormControl>
                    <FormControl mb='12px'>
                        <FormLabel m={0}>Address</FormLabel>
                        <Input type='Text' bg='#FFFFFF' value={address} onChange={(e) => setAddress(e.target.value)} disabled={!isEditing} />
                    </FormControl>

                </Box>
                <Box width='45%'>
                    <FormControl mb='12px'>
                        <FormLabel m={0}>Contact Number</FormLabel>
                        <Input type='Text' bg='#FFFFFF' value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditing} />
                    </FormControl>
                    <FormControl mb='12px'>
                        <FormLabel m={0}>Email Address</FormLabel>
                        <Input type='Email' bg='#FFFFFF' value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditing} />
                    </FormControl>
                    <FormControl mb='12px'>
                        <FormLabel m={0}>New Password</FormLabel>
                        <InputGroup>
                        <Input type={showNPass?'text':'password'} bg='#FFFFFF' onChange={(e) => setNPassword(e.target.value)} minLength='8' required/>
                            <InputRightElement>
                                <Icon
                                    as={showNPass ? FaEyeSlash : FaEye}
                                    onClick={() => setShowNPass(!showNPass)}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl mb='12px'>
                        <FormLabel m={0}>Confirm New Password</FormLabel>
                        <InputGroup>
                            <Input type={showNCPass?'text':'password'} bg='#FFFFFF' onChange={(e) => setConfirmNPassword(e.target.value)} minLength='8' required/>
                            <InputRightElement>
                                <Icon
                                    as={showNCPass ? FaEyeSlash : FaEye}
                                    onClick={() => setShowNCPass(!showNCPass)}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl mb='12px'>
                        <FormLabel m={0}>One Time Password</FormLabel>
                        <Box display='flex' gap='12px'>
                            <HStack >
                                <PinInput type='alphanumeric' value={otp} onChange={handleOTPChange} >
                                    <PinInputField bg='#FFFFFF' />
                                    <PinInputField bg='#FFFFFF' />
                                    <PinInputField bg='#FFFFFF' />
                                    <PinInputField bg='#FFFFFF' />
                                </PinInput>
                            </HStack>
                            <Box display='flex' >
                                <ButtonGroup isAttached>
                                    <Button as='button' fontSize='sm' bg='#9faf9b' w='98px' rounded='lg' _hover={{ background: '#48666e', color: 'white' }} onClick={handleGetOTP} isLoading={isLoading}>Get OTP</Button>
                                    <Box as='button' fontSize='sm' bg='#ff6380' w='125px' rounded='lg' _hover={{ background: '#612631', color: 'white' }} onClick={handleResetPass}>Reset Password</Box>
                                </ButtonGroup>
                            </Box>
                        </Box>
                    </FormControl>
                </Box>
            </Box>
            <Box display='flex' justifyContent='center' mt='20px' gap='20px'>
                <ButtonGroup >
                    <Button fontSize='sm' bg='#68bb60' w='125px' h='35px' rounded='lg' _hover={{ background: '#386334', color: 'white' }} disabled={!isEditing} onClick={handleSaveChanges}>Save</Button>
                    {
                        !isEditing
                            ? <Button fontSize='sm' bg='#b97c93' w='125px' h='35px' rounded='lg' _hover={{ background: '#805565', color: 'white' }} onClick={handleEditClick}>Edit</Button>
                            : <Button fontSize='sm' bg='#b97c93' w='125px' h='35px' rounded='lg' _hover={{ background: '#805565', color: 'white' }} onClick={handleCancelEdit}>Cancel</Button>
                    }
                </ButtonGroup>
            </Box>
        </Box>
    )
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
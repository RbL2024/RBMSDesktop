import React, { useState, useEffect } from 'react'
import './uploadPage.css'
import { Box, Text, Select } from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Textarea,
    Image,
    Icon,
    Button,
    InputLeftElement,
    InputGroup
} from '@chakra-ui/react'
import { FiUpload } from "react-icons/fi";
import { useToast } from '@chakra-ui/react'

import baseIMG from '../../assets/images/uploadP/baseImg.png'

const uploadBike = window.api;

export default function UploadPage() {
    const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image
    const [bikeName, setBikeName] = useState(''); // State for bike name
    const [bikeDescription, setBikeDescription] = useState(''); // State for bike description
    const [bikePrice, setBikePrice] = useState(''); // State for bike price
    const [bikeNumber, setBikeNumber] = useState(''); // State for bike number
    const [bikeType, setBikeType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast()

    const handleImageChange = (event) => {
        const file = event.target.files[0]; // Get the uploaded file
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result); // Set the image preview
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const inputReset = () => {
        setSelectedImage(null);
        setBikeName('');
        setBikeDescription('');
        setBikePrice('');
        setBikeType('');
        // setBikeNumber(makeid(4))
    }

    const handleReset = () => {
        inputReset();
    };
    const gotData = {
        i_bike_id: bikeNumber,
        i_bike_name: bikeName,
        i_bike_type: bikeType,
        i_bike_rent_price: bikePrice,
        i_bike_desc: bikeDescription,
        i_bike_image: selectedImage
    }


    const handleUpload = async () => {
        try {
            setIsLoading(true);
            if (bikeName === '' || bikeDescription === '' || bikePrice === '' || bikeNumber === '' || bikeType === '') {

                toast({
                    title: 'Please  fill all the fields',
                    status: 'warning',
                    duration: 2000,
                    position: 'bottom'
                })
                setIsLoading(false);
                return;
            }
            if (selectedImage === null) {
                toast({
                    title: 'Please upload image of bike',
                    status: 'warning',
                    duration: 2000,
                    position: 'bottom'
                })
                setIsLoading(false);
                return;
            }

            const response = await uploadBike.uploadBike(gotData);
            console.log('Response from server:', response);
        } catch (error) {
            console.error('Error during upload:', error);
            inputReset();
            setIsLoading(false);
        }
    }
    useEffect(() => {
        const handleBikeUploaded = (event) => {
            const res = event.detail;
            console.log(res.uploaded);
            if (res.uploaded) {
                toast({
                    title: 'Bike uploaded successfully',
                    status: 'success',
                    duration: 2000,
                    position: 'bottom',
                });
            } else {
                toast({
                    title: 'Error uploading bike information',
                    status: 'error',
                    duration: 2000,
                    position: 'bottom',
                });
            }
            setBikeNumber(makeid(4))
            inputReset();
            setIsLoading(false);
        };

        window.addEventListener('bike-uploaded', handleBikeUploaded);

        return () => {
            window.removeEventListener('bike-uploaded', handleBikeUploaded);
        };
    }, []);
    useEffect(() => {
        setBikeNumber(makeid(4));
    }, [])
    return (
        <Box>
            <Box bg='#C0B7C0' w='975px' h='625px' rounded='2xl' shadow='lg' padding='20px'>
                <Box as='span' fontSize='2xl' fontWeight='bold'>UPLOAD</Box>
                <Box display='flex' flexDirection='row' gap='20px'>
                    <Box w='450px'>
                        <FormControl isRequired mb={7} mt={12}>
                            <FormLabel m={0}>Bike Name</FormLabel>
                            <Input bg='#DBDBDB' border='none' focusBorderColor='#c0a2c0' value={bikeName} onChange={(e) => setBikeName(e.target.value)} />
                        </FormControl>
                        <FormControl isRequired mb={7} mt={12}>
                            <FormLabel m={0}>Bike Description</FormLabel>
                            <Textarea bg='#DBDBDB' border='none' h='200px' resize='none' focusBorderColor='#c0a2c0' value={bikeDescription} onChange={(e) => setBikeDescription(e.target.value)} />
                        </FormControl>
                        <FormControl isRequired mb={7} mt={12}>
                            <FormLabel m={0}>Rent Price</FormLabel>
                            <InputGroup>
                                <InputLeftElement>&#8369;</InputLeftElement>
                                <Input type="number" min="0" bg='#DBDBDB' border='none' focusBorderColor='#c0a2c0' value={bikePrice} onChange={(e) => setBikePrice(e.target.value)} />
                            </InputGroup>
                        </FormControl>
                    </Box>
                    <Box w='450px'>
                        <FormControl isRequired mb={7} mt={12}>
                            <FormLabel m={0}>Bike Type</FormLabel>
                            <Select placeholder='Select bike type' bg='#DBDBDB' border='none' focusBorderColor='#c0a2c0' value={bikeType} onChange={(e) => setBikeType(e.target.value)}>
                                <option value='Adult_bicycle'>Adult bike</option>
                                <option value='Kid_bicycle'>Kid bike</option>
                            </Select>

                        </FormControl>
                        <FormControl isRequired mb={7} mt={12}>
                            <FormLabel m={0}>Bike ID</FormLabel>
                            <Input bg='#DBDBDB' border='none' focusBorderColor='#c0a2c0' value={bikeNumber} readOnly />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Upload Picture</FormLabel>
                            <Input
                                id='file-input'
                                type='file'
                                accept='image/*'
                                display='none'
                                onChange={handleImageChange}
                            />
                            <Box
                                className='uploadPic'
                                overflow='hidden'
                                rounded='2xl'
                                backgroundImage={selectedImage ? selectedImage : baseIMG}
                                backgroundSize='contain'
                                backgroundPosition='center'
                                backgroundRepeat='no-repeat'
                                border='solid black 1px'
                                h='200px'
                                w='200px'
                                position='relative'
                                zIndex='98'
                                left='25%'
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                                cursor='pointer'
                                onClick={() => document.getElementById('file-input').click()}

                            >
                                <Icon as={FiUpload} boxSize='75px' color='gray.500' pos='relative' zIndex='97' />

                            </Box>
                            <Box display='flex' justifyContent='center' mt='20px'>

                                <Button as='button' w='120px' h='30px' ml='7px' mr='7px' bg='#794C79' color='white' rounded='md' _hover={{ bg: 'rgb(89, 56, 89)' }} onClick={() => handleUpload()} isLoading={isLoading}>Upload</Button>
                                <Box as='button' w='120px' h='30px' ml='7px' mr='7px' bg='#e07479' color='White' rounded='md' _hover={{ bg: 'rgb(140, 73, 76)' }} onClick={handleReset}>Reset</Box>
                            </Box>

                        </FormControl>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function makeid(length) {
    let result = '';
    // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return 'BID-' + result;
}
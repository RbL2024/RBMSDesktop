import React, { useEffect, useState } from 'react';
import { Box, Text, Stack, Grid, GridItem, Flex, Button, Spinner, Input, Select, Alert } from '@chakra-ui/react';
import axios from 'axios';
import { IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

function getRandomLightColor() {
    let r, g, b;
    do {
        r = Math.floor(Math.random() * 156) + 100;
        g = Math.floor(Math.random() * 156) + 100;
        b = Math.floor(Math.random() * 156) + 100;
    } while (r + g + b < 350);
    return `rgb(${r}, ${g}, ${b})`;
}

function truncateEmail(email, maxLength = 20) {
    const emailParts = email.split('@');
    if (emailParts.length === 2) {
        const localPart = emailParts[0];
        const domain = emailParts[1];
        if (localPart.length > maxLength) {
            return localPart.slice(0, maxLength) + '...' + '@' + domain;
        }
    }
    return email;
}

function truncateText(text = '', maxLength = 20) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}

export default function ReservationPage() {
    const [getRes, setGetRes] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState('');
    const [loadingId, setLoadingId] = useState(null); // Track which button is loading
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const [statusFilter, setStatusFilter] = useState(''); // State for status filter

    useEffect(() => {
        setBackgroundColor(getRandomLightColor());
        const gatherRes = async () => {
            try {
                const res = await window.api.getReservations();
                const records = res.records || [];
                setGetRes(records);
            } catch (error) {
                console.error(error);
            }
        };
        gatherRes();

        const intervalId = setInterval(gatherRes, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleCancel = (reservationId) => {
        setLoadingId(`cancel-${reservationId}`);

        axios.put(`/api/reservations/${reservationId}`, { bikeStatus: 'CANCELED' })
            .then((response) => {
                const updatedReservation = response.data;

                setGetRes((prevReservations) =>
                    prevReservations.map((res) =>
                        res.id === reservationId ? { ...res, bikeStatus: updatedReservation.bikeStatus } : res
                    )
                );
            })
            .catch((error) => {
                console.error('Error updating reservation:', error);
            })
            .finally(() => {
                setLoadingId(null);
            });
    };

    const handleConfirm = async (reservationId, bikeId) => {
        const data = {
            bikeId: bikeId,
            bikeStatus: 'RENTED',
        };

        setLoadingId(`confirm-${reservationId}`);

        try {
            const updateStat = await new Promise((resolve, reject) => {
                window.api.updateToRent(reservationId, data)
                    .then(resolve)
                    .catch(reject);
            });
            // You can update the state or perform additional actions here
            // setGetRes(updateStat.data);
        } catch (error) {
            console.error('Error updating reservation status:', error);
        } finally {
            setLoadingId(null);
        }
    };
    const handleReturn = async (reservationId, bikeId) => {
        const data = {
            bikeId: bikeId,
            bikeStatus: 'vacant',
        };

        setLoadingId(`confirm-${reservationId}`);

        try {
            const updateStat = await new Promise((resolve, reject) => {
                window.api.updateToVacant(reservationId, data)
                    .then(resolve)
                    .catch(reject);
            });
            // You can update the state or perform additional actions here
            // setGetRes(updateStat.data);
        } catch (error) {
            console.error('Error updating reservation status:', error);
        } finally {
            setLoadingId(null);
        }
    };


    const filteredReservations = getRes.filter((reservation) => {
        const matchesSearchTerm = reservation.bike_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? reservation.bikeStatus === statusFilter : true;
        return matchesSearchTerm && matchesStatus;
    });

    return (
        <Box p={3} textAlign="left">

            <Input
                placeholder="Search by Bike ID"
                width="200px"
                background="lightgray"  // background color
                borderRadius="8px"      // rounded corners
                padding="8px 12px"
                mb={5}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"  // subtle shadow
                _focus={{
                    borderColor: "#008CBA",  // Focus with blue color
                    boxShadow: "0 0 6px rgba(0, 140, 186, 0.3)", // Blue glow around input
                    borderWidth: "2px",
                    transition: "all 0.25s ease-in-out", // Focus transition
                }}
                _hover={{
                    borderColor: "#5F9EA0",  // Lighter border color when hovered
                    cursor: "pointer",       // Change the cursor to pointer on hover
                }}
                flexGrow={1}  // Allow input to take up available space
            />
            <IconButton
                aria-label="Search"
                icon={<SearchIcon />}
                onClick={() => {/* Handle search logic */ }}
                ml={2}  // margin-left to give some spacing between the input and icon
                background="transparent"
                _hover={{
                    background: "transparent",
                    cursor: "pointer",
                }}
            />
            <Select
                placeholder="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                ml={2}
                top={-10}
                left={40}
                marginLeft={600}
                marginTop={-19}

                width="200px"
            >
                <option value="RENTED">RENTED</option>
                <option value="CANCELED">CANCELED</option>
                <option value="RESERVED">RESERVED</option>
            </Select>

            <Stack spacing={0}>
                <Box height="calc(100vh - 150px)" overflowY="auto" mr={240} marginTop={-5}>
                    {filteredReservations.map((reservation, index) => (
                        <Box
                            key={index}
                            bg={backgroundColor}
                            p={3}
                            borderRadius="lg"
                            boxShadow="md"
                            position="relative"
                            mb={5}
                            _before={{
                                content: `""`,
                                position: "absolute",
                                left: "0px",
                                top: "0",
                                bottom: "0",
                                width: "2px",
                                borderRadius: "lg",
                                bg: "red.400",
                            }}
                        >
                            <Flex justify="space-between" mb={2} position="relative">
                                <Text fontWeight="bold" fontSize="lg">
                                    {reservation.name}
                                </Text>
                                <Text
                                    color="white"
                                    fontSize="sm"
                                    fontWeight={500}
                                    cursor="pointer"
                                    position="absolute"
                                    top="10px"
                                    padding={2}
                                    borderRadius={10}
                                    right="10px"
                                    backgroundColor={
                                        reservation.bikeStatus === 'RENTED'
                                            ? '#2ECC71'
                                            : reservation.bikeStatus === 'CANCELED'
                                                ? '#E74C3C'
                                                : '#FFC107'
                                    }
                                >
                                    {reservation.bikeStatus === 'RENTED'
                                        ? 'RENTED'
                                        : reservation.bikeStatus === 'CANCELED'
                                            ? 'CANCELED'
                                            : reservation.bikeStatus === 'COMPLETE'
                                                ? 'COMPLETE'
                                                : 'RESERVED'}
                                            
                                </Text>
                            </Flex>

                            <Grid templateColumns="repeat(10, auto)" gap={2} fontSize="sm" paddingBottom={5} >
                                <GridItem>
                                    <Text fontWeight="bold" textAlign="left">
                                        Reservation No.
                                    </Text>
                                    <Text noOfLines={1} textOverflow="ellipsis" whiteSpace="nowrap">
                                        {truncateText(reservation.reservation_number, 10)}
                                    </Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontWeight="bold" textAlign="left">
                                        Date
                                    </Text>
                                    <Text noOfLines={1} textOverflow="ellipsis" whiteSpace="nowrap">
                                        {truncateText(reservation.reservation_date, 8)}
                                    </Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontWeight="bold" textAlign="left">
                                        Email
                                    </Text>
                                    <Text noOfLines={1} textOverflow="ellipsis" whiteSpace="nowrap">
                                        {truncateEmail(reservation.email, 10)}
                                    </Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontWeight="bold" textAlign="left">
                                        Contact No.
                                    </Text>
                                    <Text noOfLines={1} textOverflow="ellipsis" whiteSpace="nowrap">
                                        {reservation.phone}
                                    </Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontWeight="bold" textAlign="left">
                                        Type of Bike
                                    </Text>
                                    <Text noOfLines={1} textOverflow="ellipsis" whiteSpace="nowrap">
                                        {truncateText(reservation.bikeInfo.bike_type, 15)}
                                    </Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontWeight="bold" textAlign="left">
                                        Bike No.
                                    </Text>
                                    <Text noOfLines={1} textOverflow="ellipsis" whiteSpace="nowrap">
                                        {truncateText(reservation.bike_id, 10)}
                                    </Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontWeight="bold" textAlign="left">
                                        Reserved Hr
                                    </Text>
                                    <Text noOfLines={1} textOverflow="ellipsis" whiteSpace="nowrap">
                                        {reservation.timeofuse}
                                    </Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontWeight="bold" textAlign="left">
                                        DurationUse
                                    </Text>
                                    <Text noOfLines={1} textOverflow="ellipsis" whiteSpace="nowrap">
                                        {reservation.duration} hr/s
                                    </Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontWeight="bold" textAlign="left">
                                        ReserveFee
                                    </Text>
                                    <Text noOfLines={1} textOverflow="ellipsis" whiteSpace="nowrap">
                                        {truncateText(reservation.totalReservationFee, 10)}
                                    </Text>
                                </GridItem>
                                <GridItem>
                                    <Text fontWeight="bold" textAlign="left">
                                        Price
                                    </Text>
                                    <Text noOfLines={1} textOverflow="ellipsis" whiteSpace="nowrap">
                                        {truncateText(reservation.totalBikeRentPrice, 6)}
                                    </Text>
                                </GridItem>
                            </Grid>

                            {/* Buttons (Confirm and Cancel) */}
                            <Flex justify="flex-end" gap={3} position="absolute" mb={3} bottom="0px" right="10px">
                                {/*<Button
                                    colorScheme="red"
                                    backgroundColor="#f44336"
                                    size="sm"
                                    borderRadius={12}
                                    onClick={() => handleCancel(reservation._id)}
                                    isLoading={loadingId === `cancel-${reservation._id}`}
                                    loadingText="Canceling..."
                                    disabled={reservation.bikeStatus === 'RENTED' || reservation.bikeStatus === 'CANCELED'}
                                >
                                    Cancel reservation
                                </Button>*/}
                                {reservation.bikeStatus === 'RENTED' ? (
                                    <Button
                                        colorScheme="green"
                                        backgroundColor="#20c997"
                                        size="sm"
                                        borderRadius={12}
                                        onClick={() => handleReturn(reservation._id, reservation.bike_id)}
                                        isLoading={loadingId === `confirm-${reservation._id}`}
                                        loadingText="Confirming..."
                                    >
                                        Returned
                                    </Button>
                                ) : reservation.bikeStatus === 'RESERVED'? (
                                    <Button
                                        colorScheme="green"
                                        backgroundColor="#20c997"
                                        size="sm"
                                        borderRadius={12}
                                        onClick={() => handleConfirm(reservation._id, reservation.bike_id)}
                                        isLoading={loadingId === `confirm-${reservation._id}`}
                                        loadingText="Confirming..."
                                        disabled={reservation.bikeStatus === 'RENTED' || reservation.bikeStatus === 'CANCELED'}
                                    >
                                        Confirm reservation
                                    </Button>
                                ):(
                                    null
                                )
                                
                                }

                            </Flex>
                        </Box>
                    ))}
                </Box>
            </Stack>
        </Box>
    );
}

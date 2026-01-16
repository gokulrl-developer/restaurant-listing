import { Fullscreen, WidthFull } from "@mui/icons-material";
import {
    Container,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Modal,
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import Grid from "@mui/material/Grid"
import { useState } from "react";
import type { Restaurant, RestaurantInput, RestaurantValidationError } from "../types/restaurant.types";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import { createRestaurantAPI } from "../services/restaurantService";
import { toast } from "sonner";
import { RegexValues } from "../constants/regex-values";
import { Messages } from "../constants/messages";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2
};

export default function RestaurantList() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [restaurantInput, setRestaurantInput] = useState<RestaurantInput>({
        name: "",
        address: "",
        contact: ""
    })
    const [errors, setErrors] = useState<RestaurantValidationError>(
        {
            nameError: [],
            addressError: [],
            contactError: []
        }
    )
    const { handleApiError } = useApiErrorHandler();
    const restaurants = [
        {
            restaurantId: 1,
            name: "Spice Garden",
            address: "MG Road, Bangalore",
            contact: "9876543210"
        },
        {
            restaurantId: 2,
            name: "Ocean Delight",
            address: "Beach Road, Kochi",
            contact: "9123456780"
        }
    ];

    const validateRestaurant = () => {
        const { name, address, contact } = restaurantInput;
        const phoneRegex = RegexValues.PHONE_REGEX;
        let errors: RestaurantValidationError = {
            nameError: [],
            addressError: [],
            contactError: []
        }
        if (!name || typeof name !== "string") {
            errors = { ...errors, nameError: [...errors.nameError, Messages.NAME_REQUIRED] }
        }
        if ((name && typeof name === "string") && (name.length < 2 || name.length > 100)) {
            errors = { ...errors, nameError: [...errors.nameError, Messages.NAME_INVALID_LENGTH] }
        }
        if (!address || typeof address !== "string") {
            errors = { ...errors, addressError: [...errors.addressError, Messages.ADDRESS_REQUIRED] }
        }
        if ((address && typeof address === "string") && (address.length < 5 || address.length > 255)) {
            errors = { ...errors, addressError: [...errors.addressError, Messages.ADDRESS_INVALID_LENGTH] }
        }
        if (!contact) {
            errors = { ...errors, contactError: [...errors.contactError, Messages.CONTACTS_REQUIRED] }
        }

        if (contact && (typeof contact !== "string" || phoneRegex.test(contact) === false)) {
            errors = { ...errors, contactError: [...errors.contactError, Messages.CONTACTS_INVALID] }
        }
        return errors;
    }
    const createRestaurant = async () => {
        const validationErrors: RestaurantValidationError = validateRestaurant();
        if (Object.values(validationErrors).every((error: string[]) => error.length === 0) === false) {
            console.log(validationErrors)
            setErrors(validationErrors)
            return;
        }
        try {
            const restaurantWithMessage = await createRestaurantAPI({
                name: restaurantInput.name,
                address: restaurantInput.address,
                contact: restaurantInput.contact
            });
            toast.success(restaurantWithMessage.message);


        } catch (error) {
            console.log(error);
            handleApiError(error)
        }
    }

    const clearErrors = () => {
        setErrors({
            nameError: [],
            addressError: [],
            contactError: []
        })
    }
    // const handleEdit = (restaurant: Restaurant) => {
    //     setSelectedRestaurant(restaurant);
    //     setOpenModal(true);
    // };

    const handleDelete = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setOpenDelete(true);
    };

    return (
        <Container sx={{ mt: 4, minHeight: "100vh", width: "100vw" }}>
            {/* Header */}
            <Grid container mb={3}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "100vw" }}>
                    <Typography variant="h4" align="center">Restaurant Listing</Typography>
                    <Button variant="contained" sx={{ mr: 0, width: "fit-content" }} onClick={() => setShowCreateModal(true)}>
                        Add Restaurant
                    </Button>
                </Box>

                {/* Restaurant Cards */}
                <Grid container spacing={3} sx={{ mt: 3 }}>
                    {restaurants && restaurants.length > 0 && restaurants.map((restaurant) => (
                        <Grid
                            component={"div" as React.ElementType}
                            item
                            xs={12}     // 1 per row on mobile
                            sm={6}      // 2 per row on small screens
                            md={4}      // 3 per row on medium screens
                            key={restaurant.restaurantId} // always include key
                        >
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{restaurant.name}</Typography>
                                    <Typography color="text.secondary">{restaurant.address}</Typography>
                                    <Typography variant="body2" color="text.secondary">{restaurant.contact}</Typography>
                                    <Box sx={{ display: "flex" }}>
                                        <Button onClick={() => setShowCreateModal(true)}>
                                            Edit
                                        </Button>
                                        <Button onClick={() => handleDelete(restaurant)}>
                                            Delete
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            {/* Add */}
            <Modal open={showCreateModal} onClose={() => {
                setShowCreateModal(false);
                clearErrors();
                }}>
                <Box sx={style}>
                    <Typography variant="h6" mb={2}>
                        Add Restaurant
                    </Typography>

                    <TextField
                        fullWidth
                        label="Restaurant Name"
                        margin="normal"
                        value={restaurantInput?.name || ""}
                        onChange={(e) =>
                            setRestaurantInput({ ...restaurantInput, name: e.target.value })
                        }
                    />
                    <Typography variant="caption" color="error">
                        {errors.nameError && errors.nameError.length > 0 &&
                            errors.nameError.join(",")}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Address"
                        margin="normal"
                        value={restaurantInput?.address || ""}
                        onChange={(e) =>
                            setRestaurantInput({ ...restaurantInput, address: e.target.value })
                        }
                    />
                    <Typography variant="caption" color="error">
                        {errors.addressError && errors.addressError.length > 0 &&
                            errors.addressError.join(",")}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Contact"
                        margin="normal"
                        value={restaurantInput?.contact || ""}
                        onChange={(e) =>
                            setRestaurantInput({ ...restaurantInput, contact: e.target.value })
                        }
                    />
                    <Typography variant="caption" color="error">
                        {errors.contactError && errors.contactError.length > 0 &&
                            errors.contactError.join(",")}
                    </Typography>
                    <Grid container justifyContent="flex-end" mt={2}>
                        <Button onClick={() => {
                            setShowCreateModal(false);
                            clearErrors();
                        }} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={() => createRestaurant()}>
                            Save
                        </Button>
                    </Grid>
                </Box>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this restaurant?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>
                        Cancel
                    </Button>
                    <Button color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

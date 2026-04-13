import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Modal,
    Box,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    AppBar,
    Toolbar
} from "@mui/material";
import Grid from "@mui/material/Grid"
import { useEffect, useState } from "react";
import type { Restaurant, RestaurantInput, RestaurantValidationError } from "../types/restaurant.types";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import { createRestaurantAPI, listRestaurantsAPI, removeRestaurantAPI, updateRestaurantAPI } from "../services/restaurantService";
import { toast } from "sonner";
import { RegexValues } from "../constants/regex-values";
import { Messages } from "../constants/messages";
import { red, blueGrey } from "@mui/material/colors";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
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
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [restaurantInput, setRestaurantInput] = useState<RestaurantInput>({
        name: "",
        address: {
            street: "",
            city: "",
            state: "",
            country: "",
            postalCode: ""
        },
        contact: ""
    })
    const [errors, setErrors] = useState<RestaurantValidationError>(
        {
            nameError: [],
            streetError: [],
            cityError: [],
            stateError: [],
            countryError: [],
            postalCodeError: [],
            contactError: []
        }
    )
    const { handleApiError } = useApiErrorHandler();
    useEffect(() => {
        listRestaurants();
    }, [])
    const listRestaurants = async () => {
        try {
            const restaurantsObject = await listRestaurantsAPI();
            console.log(restaurantsObject)
            setRestaurants(restaurantsObject.restaurants)

        } catch (error) {
            console.log("error on fetching restaurants", error);
            handleApiError(error)
        }
    }
    const validateRestaurant = () => {
        const { name, address, contact } = restaurantInput;
        const { street, city, state, country, postalCode } = address;
        const phoneRegex = RegexValues.PHONE_REGEX;
        let errors: RestaurantValidationError = {
            nameError: [],
            streetError: [],
            cityError: [],
            stateError: [],
            countryError: [],
            postalCodeError: [],
            contactError: []
        }
        if (!name || typeof name !== "string") {
            errors = { ...errors, nameError: [...errors.nameError, Messages.NAME_REQUIRED] }
        }
        if ((name && typeof name === "string") && (name.length < 2 || name.length > 100)) {
            errors = { ...errors, nameError: [...errors.nameError, Messages.NAME_INVALID_LENGTH] }
        }
        if (!street || typeof street !== "string") {
            errors = { ...errors, streetError: [...errors.streetError, Messages.STREET_REQUIRED] }
        }
        if ((street && typeof street === "string") && (street.length < 2 || street.length > 100)) {
            errors = { ...errors, streetError: [...errors.streetError, Messages.STREET_REQUIRED] }
        }
        if (!city || typeof city !== "string") {
            errors = { ...errors, cityError: [...errors.cityError, Messages.CITY_REQUIRED] }
        }
        if ((city && typeof city === "string") && (city.length < 2 || city.length > 100)) {
            errors = { ...errors, cityError: [...errors.cityError, Messages.CITY_REQUIRED] }
        }
        if (!state || typeof state !== "string") {
            errors = { ...errors, stateError: [...errors.stateError, Messages.STATE_REQUIRED] }
        }
        if ((state && typeof state === "string") && (state.length < 2 || state.length > 100)) {
            errors = { ...errors, stateError: [...errors.stateError, Messages.STATE_REQUIRED] }
        }
        if (!country || typeof country !== "string") {
            errors = { ...errors, countryError: [...errors.countryError, Messages.COUNTRY_REQUIRED] }
        }
        if ((country && typeof country === "string") && (country.length < 2 || country.length > 100)) {
            errors = { ...errors, countryError: [...errors.countryError, Messages.COUNTRY_REQUIRED] }
        }
        if (!postalCode || typeof postalCode !== "string") {
            errors = { ...errors, postalCodeError: [...errors.postalCodeError, Messages.POSTAL_CODE_REQUIRED] }
        }
        if ((postalCode && typeof postalCode === "string") && (
            !postalCode ||
            postalCode.length < 2 ||
            postalCode.length > 10 ||
            !/^\d+$/.test(postalCode))) {
            errors = { ...errors, postalCodeError: [...errors.postalCodeError, Messages.POSTAL_CODE_REQUIRED] }
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
            listRestaurants();
            setShowCreateModal(false);
            clearRestaurantInput();
            clearErrors()
        } catch (error) {
            console.log(error);
            handleApiError(error)
        }
    }
    const editRestaurant = async () => {
        if (!selectedRestaurant) {
            toast.error("some error occured.Please try again later.");
            return;
        }
        const validationErrors: RestaurantValidationError = validateRestaurant();
        if (Object.values(validationErrors).every((error: string[]) => error.length === 0) === false) {
            console.log(validationErrors)
            setErrors(validationErrors)
            return;
        }
        const updatePayload: Partial<RestaurantInput> = {};

        if (restaurantInput.name !== selectedRestaurant.name) {
            updatePayload.name = restaurantInput.name;
        }

        if ((
            restaurantInput.address.street
            !== selectedRestaurant.address.street ||
            restaurantInput.address.city
            !== selectedRestaurant.address.city ||
            restaurantInput.address.state
            !== selectedRestaurant.address.state ||
            restaurantInput.address.country
            !== selectedRestaurant.address.country ||
            restaurantInput.address.postalCode
            !== selectedRestaurant.address.postalCode
        )) {
            updatePayload.address = restaurantInput.address;
        }

        if (restaurantInput.contact !== selectedRestaurant.contact) {
            updatePayload.contact = restaurantInput.contact;
        }

        if (Object.keys(updatePayload).length === 0) {
            toast.info(Messages.NO_CHANGES_DETECTED);
            return;
        }
        try {
            const restaurantWithMessage = await updateRestaurantAPI({
                ...updatePayload,
                restaurantId: selectedRestaurant.restaurantId.toString(),
            });
            toast.success(restaurantWithMessage.message);
            listRestaurants();
            setShowEditModal(false);
            setSelectedRestaurant(null);
            clearRestaurantInput();
            clearErrors()
        } catch (error) {
            console.log(error);
            handleApiError(error)
        }
    }

    const clearErrors = () => {
        setErrors({
            nameError: [],
            streetError: [],
            cityError: [],
            stateError: [],
            countryError: [],
            postalCodeError: [],
            contactError: []
        })
    }

    const clearRestaurantInput = () => {
        setRestaurantInput({
            name: "",
            address: {
                street: "",
                city: "",
                state: "",
                country: "",
                postalCode: ""
            },
            contact: ""
        })
    }

    const openDeleteModal = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setShowDeleteModal(true);
    };

    const deleteRestaurant = async () => {
        try {
            if (selectedRestaurant === null) {
                toast.error("Some error occured.Please try again later.")
            }
            const deletionResponse = await removeRestaurantAPI(selectedRestaurant!.restaurantId.toString());
            toast.success(deletionResponse.message || Messages.RESTAURANT_REMOVED);
            listRestaurants();
            setSelectedRestaurant(null);
            setShowDeleteModal(false);
        } catch (error) {
            console.log("error deleting restaurant", error);
            handleApiError(error)
        }
    }
    return (
        <Container sx={{ minHeight: "100vh", background: blueGrey[200] }}>
            {/* Header */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ mt: 2 }}>
                    <AppBar position="static" sx={{ background: "black" }}>
                        <Toolbar variant="dense">
                            <Typography variant="h6" sx={{ mx: "auto" }} color="inherit" component="div">
                                RESTAURANT LISTING
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </Box>
                <Box sx={{ mt: 5 }}>
                    <Button
                        variant="contained"
                        onClick={() => setShowCreateModal(true)}
                        sx={{ background: "black" }}
                    >
                        Add Restaurant
                    </Button>
                </Box>
                {/* Restaurant Cards */}
                <Grid container spacing={3} sx={{ mt: 4 }}>
                    {restaurants && restaurants.length > 0 && restaurants.map((restaurant) => (
                        <Grid
                            component={"div" as React.ElementType}
                            item
                            size={{ xs: 12, sm: 6, md: 4 }}
                            key={restaurant.restaurantId}
                        >
                            <Card>
                                <CardContent sx={{ background: "white" }}>
                                    <Typography variant="h6" sx={{ textAlign: "center" }}>{restaurant.name}</Typography>
                                    <Box sx={{ display: "flex", flexDirection: "column"}}>
                                    <Box sx={{ display: "flex", flexDirection: "column"}}>
                                    <Typography color="text.primary" sx={{ overflowWrap: "break-word" }}><LocationOnIcon sx={{ fontSize: "large", color: red[500] }} /> ADDRESS : </Typography>
                                    <Box sx={{ display: "flex", flexDirection: "column",marginLeft:4,marginTop:1,marginBottom:1}}>
                                    <Typography color="text.secondary" sx={{ overflowWrap: "break-word" }}>{restaurant.address.street+","}</Typography>
                                    <Typography color="text.secondary" sx={{ overflowWrap: "break-word" }}>{restaurant.address.city +","}</Typography>
                                    <Typography color="text.secondary" sx={{ overflowWrap: "break-word" }}>{restaurant.address.state +","+restaurant.address.country}</Typography>
                                    <Typography color="text.primary" sx={{ overflowWrap: "break-word" }}>{"Zip : "+restaurant.address.postalCode}</Typography>
                                     </Box>
                                     </Box>
                                    <Typography variant="body2" color="text.secondary"><PhoneIcon sx={{ fontSize: "medium", color: "green" }} />{"PHONE : "+restaurant.contact}</Typography>
                                    <Box sx={{ display: "flex",justifyContent:"space-between" }}>
                                        <Button onClick={() => {
                                            setSelectedRestaurant(restaurant);
                                            setRestaurantInput({
                                                name: restaurant.name,
                                                address:
                                                {
                                                    street: restaurant.address.street,
                                                    city: restaurant.address.city,
                                                    state: restaurant.address.state,
                                                    country: restaurant.address.country,
                                                    postalCode: restaurant.address.postalCode
                                                },
                                                contact: restaurant.contact
                                            })
                                            setShowEditModal(true);
                                        }}
                                            size="small"
                                        >
                                            <EditIcon sx={{ color: "black" }} />
                                        </Button>
                                        <Button onClick={() => openDeleteModal(restaurant)}>
                                            <DeleteOutlineOutlinedIcon sx={{ color: "red" }}/>
                                        </Button>
                                    </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {/* Add */}
            <Modal open={showCreateModal} onClose={() => {
                setShowCreateModal(false);
                clearRestaurantInput();
                clearErrors();
            }}>
                <Box sx={style}>
                    <Typography variant="h6" mb={2}>
                        Add Restaurant
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
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
                            label="Street"
                            margin="normal"
                            value={restaurantInput?.address.street || ""}
                            onChange={(e) =>
                                setRestaurantInput({
                                    ...restaurantInput, address: {
                                        ...restaurantInput.address,
                                        street: e.target.value
                                    }
                                })
                            }
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                        <TextField
                            fullWidth
                            label="City"
                            margin="normal"
                            value={restaurantInput?.address.city || ""}
                            onChange={(e) =>
                                setRestaurantInput({
                                    ...restaurantInput, address: {
                                        ...restaurantInput.address,
                                        city: e.target.value
                                    }
                                })
                            }
                        />
                        <TextField
                            fullWidth
                            label="State"
                            margin="normal"
                            value={restaurantInput?.address.state || ""}
                            onChange={(e) =>
                                setRestaurantInput({
                                    ...restaurantInput, address: {
                                        ...restaurantInput.address,
                                        state: e.target.value
                                    }
                                })
                            }
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                        <TextField
                            fullWidth
                            label="Country"
                            margin="normal"
                            value={restaurantInput?.address.country || ""}
                            onChange={(e) =>
                                setRestaurantInput({
                                    ...restaurantInput, address: {
                                        ...restaurantInput.address,
                                        country: e.target.value
                                    }
                                })
                            }
                        />
                        <TextField
                            fullWidth
                            label="PostalCode"
                            margin="normal"
                            value={restaurantInput?.address.postalCode || ""}
                            onChange={(e) =>
                                setRestaurantInput({
                                    ...restaurantInput, address: {
                                        ...restaurantInput.address,
                                        postalCode: e.target.value
                                    }
                                })
                            }
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
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
                    </Box>
                    <Grid container justifyContent="flex-end" mt={2}>
                        <Button onClick={() => {
                            setShowCreateModal(false);
                            clearRestaurantInput()
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
            {/* Edit */}
            <Modal open={showEditModal} onClose={() => {
                setShowEditModal(false);
                clearRestaurantInput();
                setSelectedRestaurant(null);
                clearErrors();
            }}>
                <Box sx={style}>
                    <Typography variant="h6" mb={2}>
                        Edit Restaurant
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>

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
                            label="Street"
                            margin="normal"
                            value={restaurantInput?.address.street || ""}
                            onChange={(e) =>
                                setRestaurantInput({
                                    ...restaurantInput, address: {
                                        ...restaurantInput.address,
                                        street: e.target.value
                                    }
                                })
                            }
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>

                        <TextField
                            fullWidth
                            label="City"
                            margin="normal"
                            value={restaurantInput?.address.city || ""}
                            onChange={(e) =>
                                setRestaurantInput({
                                    ...restaurantInput, address: {
                                        ...restaurantInput.address,
                                        city: e.target.value
                                    }
                                })
                            }
                        />
                        <TextField
                            fullWidth
                            label="State"
                            margin="normal"
                            value={restaurantInput?.address.state || ""}
                            onChange={(e) =>
                                setRestaurantInput({
                                    ...restaurantInput, address: {
                                        ...restaurantInput.address,
                                        state: e.target.value
                                    }
                                })
                            }
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>

                        <TextField
                            fullWidth
                            label="Country"
                            margin="normal"
                            value={restaurantInput?.address.country || ""}
                            onChange={(e) =>
                                setRestaurantInput({
                                    ...restaurantInput, address: {
                                        ...restaurantInput.address,
                                        country: e.target.value
                                    }
                                })
                            }
                        />
                        <TextField
                            fullWidth
                            label="PostalCode"
                            margin="normal"
                            value={restaurantInput?.address.postalCode || ""}
                            onChange={(e) =>
                                setRestaurantInput({
                                    ...restaurantInput, address: {
                                        ...restaurantInput.address,
                                        postalCode: e.target.value
                                    }
                                })
                            }
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>

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
                    </Box>
                    <Grid container justifyContent="flex-end" mt={2}>
                        <Button onClick={() => {
                            setShowEditModal(false);
                            setSelectedRestaurant(null);
                            clearRestaurantInput()
                            clearErrors();
                        }} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={() => editRestaurant()}>
                            Save
                        </Button>
                    </Grid>
                </Box>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onClose={() => {
                setShowDeleteModal(false);
                setSelectedRestaurant(null);
            }}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this restaurant?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowDeleteModal(false);
                        setSelectedRestaurant(null);
                    }}>
                        Cancel
                    </Button>
                    <Button color="error" variant="contained" onClick={() => deleteRestaurant()}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

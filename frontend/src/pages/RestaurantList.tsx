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
    const [openModal, setOpenModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

    const restaurants = [
        {
            id: 1,
            name: "Spice Garden",
            address: "MG Road, Bangalore",
            contact: "9876543210"
        },
        {
            id: 2,
            name: "Ocean Delight",
            address: "Beach Road, Kochi",
            contact: "9123456780"
        }
    ];

    interface Restaurant {
        name: string,
        address: string,
        contact: string
    }
    const handleAdd = () => {
        setSelectedRestaurant(null);
        setOpenModal(true);
    };

    const handleEdit = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setOpenModal(true);
    };

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
                    <Button variant="contained" sx={{ mr: 0, width: "fit-content" }} onClick={handleAdd}>
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
                            key={restaurant.id} // always include key
                        >
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{restaurant.name}</Typography>
                                    <Typography color="text.secondary">{restaurant.address}</Typography>
                                    <Typography variant="body2" color="text.secondary">{restaurant.contact}</Typography>
                                    <Box sx={{ display: "flex" }}>
                                        <Button onClick={() => handleEdit(restaurant)}>
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
            {/* Add / Edit Modal */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={style}>
                    <Typography variant="h6" mb={2}>
                        {selectedRestaurant ? "Edit Restaurant" : "Add Restaurant"}
                    </Typography>

                    <TextField
                        fullWidth
                        label="Restaurant Name"
                        margin="normal"
                        defaultValue={selectedRestaurant?.name || ""}
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        margin="normal"
                        defaultValue={selectedRestaurant?.address || ""}
                    />
                    <TextField
                        fullWidth
                        label="Contact"
                        margin="normal"
                        defaultValue={selectedRestaurant?.contact || ""}
                    />

                    <Grid container justifyContent="flex-end" mt={2}>
                        <Button onClick={() => setOpenModal(false)} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button variant="contained">
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

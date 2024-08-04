'use client';

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Box, Stack, Typography, Modal, TextField, Button, Snackbar, Alert, IconButton, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const white = "#ffffff";
const black = "#000000";
const searchBarBg = "#f0f0f0"; // Light gray background for search bar
const searchBarTextColor = "#333"; // Dark gray text color for search bar
const backgroundImage = "url('/path/to/your/background.jpg')"; // Replace with your image path

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const updateInventory = async () => {
    setLoading(true);
    try {
      const collectionRef = collection(firestore, "pantry");
      const snapshot = await getDocs(collectionRef);
      const inventoryList = snapshot.docs.map((doc) => ({
        name: doc.id,
        ...doc.data(),
      }));
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setSnackbarMessage("Failed to fetch inventory.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + itemQuantity });
      } else {
        await setDoc(docRef, { quantity: itemQuantity });
      }
      await updateInventory();
      setSnackbarMessage("Item added successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding item:", error);
      setSnackbarMessage("Failed to add item.");
      setSnackbarOpen(true);
    }
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
        await updateInventory();
        setSnackbarMessage("Item removed successfully.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setSnackbarMessage("Failed to remove item.");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemQuantity(1); // Reset quantity
  };

  const handleDetailsOpen = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedItem(null);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        bgcolor: white,
        color: black,
        p: 4,
        backgroundImage: backgroundImage,
        backgroundSize: 'cover',
        minHeight: '100vh',
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor={white}
          border={`2px solid ${white}`}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant="outlined"
              type="number"
              label="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Number(e.target.value))}
              inputProps={{ min: 1 }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName(""); // Clear the input field after adding
                handleClose(); // Close the modal after adding
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={detailsOpen} onClose={handleDetailsClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor={white}
          border={`2px solid ${white}`}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">{selectedItem?.name}</Typography>
          <Typography variant="body1">Quantity: {selectedItem?.quantity}</Typography>
          <Typography variant="body1">Details about the item can go here.</Typography>
          <Button variant="outlined" onClick={handleDetailsClose}>Close</Button>
        </Box>
      </Modal>

      <Box bgcolor={searchBarBg} p={2} mb={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Search items..."
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: searchBarTextColor }} />
                </InputAdornment>
              ),
              style: {
                borderRadius: '25px', // Rounded corners
                padding: '10px 20px', // Padding inside the input
                backgroundColor: '#ffffff', // Background color
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow
              },
            }}
            InputLabelProps={{
              style: { color: searchBarTextColor }, // Label color
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: searchBarTextColor, // Border color
                },
                '&:hover fieldset': {
                  borderColor: white, // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: white, // Border color on focus
                },
              },
            }}
          />
          <IconButton onClick={() => setSearchQuery("")}>
            <ClearIcon sx={{ color: searchBarTextColor }} />
          </IconButton>
        </Stack>
      </Box>

      <Box bgcolor={white} color={black} p={4} borderRadius={2} boxShadow={3}>
        <Typography variant="h2" align="center" gutterBottom>
          Inventory Items
        </Typography>

        {loading ? (
          <Typography variant="h6" align="center">Loading...</Typography>
        ) : (
          <Stack spacing={2}>
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                p={2}
                borderRadius={2}
                boxShadow={1}
                onClick={() => handleDetailsOpen({ name, quantity })}
                sx={{ cursor: 'pointer' }}
              >
                <Typography variant="h6" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>

                <Typography variant="h6" textAlign="center" color={black}>
                  {quantity}
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={() => addItem(name)}>
                    Add
                  </Button>

                  <Button variant="contained" color="error" onClick={() => {
                    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
                      removeItem(name);
                    }
                  }}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
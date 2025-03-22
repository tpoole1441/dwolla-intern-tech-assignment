import Head from "next/head";
import React from "react";
import useSWR from "swr";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
} from "@mui/material";
// Icon for Add Customer button
import { AddRounded, Padding } from "@mui/icons-material";

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  businessName?: string;
};

export type Customers = Customer[];

export type ApiError = {
  code: string;
  message: string;
};

const Home = () => {
  // SWR is a great library for geting data, but is not really a solution
  // for POST requests. You'll want to use either another library or
  // the Fetch API for adding new customers.
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok) throw body;
    return body;
  };
  const { data, error, isLoading } = useSWR<Customers, ApiError>(
    "/api/customers",
    fetcher
  );

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Head>
        <title>Dwolla | Customers</title>
      </Head>
      <main>
        <Box>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {data && (
            <Box
              sx={{
                bgcolor: "white",
                width: "60%",
                alignSelf: "center",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 2,
                }}
              >
                <Typography variant="h6">{data.length} Customers</Typography>
                <Box>
                  <Button
                    variant="contained"
                    onClick={handleClickOpen}
                    endIcon={<AddRounded />}
                  >
                    Add Customer
                  </Button>
                  <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add Customer</DialogTitle>
                    <DialogContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          id="firstName"
                          name="firstName"
                          label="First Name"
                          type="text"
                          variant="outlined"
                          sx={{ width: "30%" }}
                        />
                        <TextField
                          required
                          margin="dense"
                          id="lastName"
                          name="lastName"
                          label="Last Name"
                          type="text"
                          variant="outlined"
                          sx={{ width: "30%" }}
                        />
                        <TextField
                          margin="dense"
                          id="businessName"
                          name="businessName"
                          label="Business Name"
                          type="text"
                          variant="outlined"
                          sx={{ width: "30%" }}
                        />
                      </Box>
                      <TextField
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button variant="contained" onClick={handleClose}>
                        Create
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((customer) => (
                    <TableRow key={customer.email}>
                      <TableCell>
                        {customer.firstName} {customer.lastName}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </main>
    </>
  );
};

export default Home;

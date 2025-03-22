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
  const { data, error, isLoading, mutate } = useSWR<Customers, ApiError>(
    "/api/customers",
    fetcher
  );

  const [newCustomer, setNewCustomer] = React.useState<Customer>({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
  });

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const customerData = {
      firstName: newCustomer.firstName,
      lastName: newCustomer.lastName,
      email: newCustomer.email,
      businessName: newCustomer.businessName,
    };

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        console.log("Customer created successfully!");
        setOpen(false);
        mutate();
      } else {
        console.error("Error creating customer:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    }
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
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              firstName: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              lastName: e.target.value,
                            })
                          }
                        />
                        <TextField
                          margin="dense"
                          id="businessName"
                          name="businessName"
                          label="Business Name"
                          type="text"
                          variant="outlined"
                          sx={{ width: "30%" }}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              businessName: e.target.value,
                            })
                          }
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
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            email: e.target.value,
                          })
                        }
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button variant="contained" onClick={handleSubmit}>
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

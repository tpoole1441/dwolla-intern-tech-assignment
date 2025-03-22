import Head from "next/head";
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

  return (
    <>
      <Head>
        <title>Dwolla | Customers</title>
      </Head>
      <main>
        <Box
          sx={{
            bgcolor: "paper",
            padding: 2,
            container: true,
          }}
        >
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
                  <Button variant="contained" endIcon={<AddRounded />}>
                    Add Customer
                  </Button>
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

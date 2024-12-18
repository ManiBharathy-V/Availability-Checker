import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from "@mui/material";
import axios from "axios";

const MachineTable = () => {
  const [machines, setMachines] = useState([]);

  // Fetch the list of machines from the backend
  const fetchMachines = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/machines");
      setMachines(response.data.machines);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  // Delete a machine by ID
  const deleteMachine = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/machines/${id}`);
      fetchMachines(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting machine:", error);
    }
  };

  useEffect(() => {
    fetchMachines();
    const interval = setInterval(fetchMachines, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom style={{ margin: "16px" }}>
        Virtual Machines Live Status
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>IP Address</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {machines.map((machine) => (
            <TableRow key={machine.id}>
              <TableCell>{machine.id}</TableCell>
              <TableCell>{machine.ip}</TableCell>
              <TableCell>
                <span
                  style={{
                    color:
                      machine.status === "green" ? "green" :
                      machine.status === "red" ? "red" : "orange",
                  }}
                >
                  {machine.status}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteMachine(machine.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MachineTable;

import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import axios from "axios";

const AddMachine = ({ onMachineAdded }) => {
  const [ip, setIp] = useState("");

  const handleAddMachine = async () => {
    if (!ip) return;
    try {
      await axios.post("http://127.0.0.1:5000/machines", { ip });
      setIp("");
      onMachineAdded(); // Notify parent to refresh
    } catch (error) {
      console.error("Error adding machine:", error);
    }
  };

  return (
    <Box display="flex" gap="8px" margin="16px">
      <TextField
        label="IP Address"
        variant="outlined"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleAddMachine}>
        Add Machine
      </Button>
    </Box>
  );
};

export default AddMachine;

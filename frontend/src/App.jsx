import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import MachineTable from "./components/MachineTable";
import AddMachine from "./components/AddMachine";

const App = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshMachines = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Machine Status Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <AddMachine onMachineAdded={refreshMachines} />
        <MachineTable key={refreshKey} />
      </Container>
    </>
  );
};

export default App;

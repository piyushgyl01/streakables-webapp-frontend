import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import AdbIcon from "@mui/icons-material/Adb";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";


function ResponsiveAppBar() {
  return (
    <AppBar position="static">
     <Container maxWidth="xl">
       <Toolbar disableGutters>
         <AdbIcon sx={{ display: "flex", mr: 1 }} />
         <Typography
           variant="h6"
           noWrap
           component={Link}  // Changed to Link
           to="/"           // Changed href to to
           sx={{
             mr: 2, 
             display: "flex",
             fontFamily: "monospace",
             fontWeight: 700,
             letterSpacing: ".3rem",
             color: "inherit", 
             textDecoration: "none",
             flexGrow: 1,
           }}
         >
           STREAKABLE
         </Typography>

         <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
           <Link to="/streakable" style={{ textDecoration: "none", color: "white" }}>Streakable</Link>
           <Link to="/month" style={{ textDecoration: "none", color: "white" }}>Monthly</Link>
           <Link to="/week" style={{ textDecoration: "none", color: "white" }}>Weekly</Link>
           <Link to="/day" style={{ textDecoration: "none", color: "white" }}>Daily</Link>
         </Box>

         <IconButton sx={{ p: 0 }}>
           <Avatar alt="Profile" src="/logo.svg" />
         </IconButton>
       </Toolbar>
     </Container>
   </AppBar>

  );
}

export default ResponsiveAppBar;

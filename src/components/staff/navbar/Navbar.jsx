import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';
import './Navbar.css';

export default function Navbar() {
    const user = useSelector(selectUser).user;

    return (
        <Box className="navbar">
            <AppBar position="static">
                <Toolbar className="toolbar">
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div">
                            Your App Name
                        </Typography>
                    </Box>
                    <Typography variant="h6" component="div" className="user-name">
                        {user.firstName} {user.lastName}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

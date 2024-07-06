import React from 'react';
import { Box, Typography, useTheme, Button } from '@mui/material';
import { tokens } from "../../theme";
const Header = ({ title, subtitle }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box m="10px 0" display="flex" alignItems="center">
                <Typography
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="24px"
                    fontWeight="400"
                >
                    {title}
                </Typography>
            </Box>
        </Box>
    );
};

export default Header;

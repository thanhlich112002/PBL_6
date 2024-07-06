import { Box, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from '../../theme';
import logo from '../img/logo.png';

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box display="flex" justifyContent="space-between" style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', }}>
            <Box
                display="flex"
                backgroundColor={colors.primary[400]}
                borderRadius="3px"

            >
            </Box>
            <Box display="flex" >
                <img src={logo} alt="" style={{ height: "70px", paddingRight: "20px" }} />
            </Box>
        </Box >
    );
};

export default Topbar;
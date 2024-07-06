import { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import "react-pro-sidebar/dist/css/styles.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import StoreIcon from '@mui/icons-material/Store';
import CommentIcon from '@mui/icons-material/Comment';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from "react-router-dom";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CategoryIcon from '@mui/icons-material/Category';

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => { title !== "Đăng xuất" ? setSelected(title) : setSelected("FALTH's FoodDelivery") }}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};

const Sidebara = ({ setSelected, selected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: `white !important`,
                    borderRight: "0.1px solid rgb(230, 230, 230)",
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                },
                "& .pro-inner-item:hover": {
                    color: "#868dfb !important",
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },
            }}
        >
            <ProSidebar collapsed={isCollapsed} backgroundColor="none" height='auto'>
                <Menu iconShape="square">
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <ArrowForwardIcon /> : undefined}
                        style={{
                            margin: "10px 0 20px 0",
                            color: colors.grey[100],
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h3" color={colors.grey[100]}>
                                    Quản lý hệ thống
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <ArrowBackIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Typography
                            variant="h6"
                            color={colors.grey[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Cửa hàng
                        </Typography>
                        <Item
                            title="Danh sách cửa hàng"
                            to="/admin/ManageStore"
                            icon={<StoreIcon />}
                            selected={selected}
                            setSelected={setSelected}

                        />
                        <Item
                            title="Cấp phép cửa hàng"
                            to="/admin/Acceptstore"
                            icon={<AddBusinessIcon />}
                            selected={selected}
                            setSelected={setSelected}

                        />
                        <Typography
                            variant="h6"
                            color={colors.grey[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Người giao hàng
                        </Typography>

                        <Item
                            title="Danh sách Shipper"
                            to="/admin/ViewAllShipper"
                            icon={<LocalShippingIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Cấp phép Shipper"
                            to="/admin/ManageShipper"
                            icon={<CommentIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.grey[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Người dùng
                        </Typography>
                        <Item
                            title="Danh sách người dùng"
                            to="/admin/ManageUser"
                            icon={<PersonOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}

                        />
                        <Typography
                            variant="h6"
                            color={colors.grey[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Admin
                        </Typography>
                        <Item
                            title="Danh mục"
                            to="/admin/category"
                            icon={<CategoryIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="Thống kê"
                            to="/admin"
                            icon={<LeaderboardIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="Đăng xuất"
                            to="/admin/logout"
                            icon={<LogoutIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebara;
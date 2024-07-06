
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import "react-pro-sidebar/dist/css/styles.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CategoryIcon from '@mui/icons-material/Category';
import CommentIcon from '@mui/icons-material/Comment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
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

const Sidebar = ({ selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const Logout = () => {
    console.log("Logout")
  }
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
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
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
                  Cửa hàng
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
              title="Thống kê"
              to="/store"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Thông tin cửa hàng"
              to="/store/info"
              icon={<PersonIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Sản phẩm
            </Typography>
            <Item
              title="Danh sách Sản phẩm"
              to="/store/product"
              icon={<ListAltIcon />}
              selected={selected}
              setSelected={setSelected}

            />
            <Item
              title="Thêm sản phẩm"
              to="/store/Formadd"
              icon={< AddShoppingCartIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Danh mục"
              to="/store/category"
              icon={<CategoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Bán hàng
            </Typography>
            <Item
              title="Danh sách Đơn hàng"
              to="/store/listorder"
              icon={<ListAltIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Phiếu giảm giá"
              to="/store/Voucher"
              icon={<LocalOfferIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Phản hồi
            </Typography>
            <Item
              title="Phản hồi"
              to="/store/feedback"
              icon={<CommentIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Đăng xuất"
              icon={<LogoutIcon />}
              selected={selected}
              setSelected={setSelected}
              onClick={Logout()}
              to="/store/logout"
            />

          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;

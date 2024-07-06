import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import { Button } from "@mui/material";
import Header2 from "../../components/Header/Header";
import axios from 'axios';
import style from './Detailstore.module.css'
import Bill from './Detailstore';
import Accept from '../../components/Accept/Accept';
import { useNavigate } from 'react-router-dom';
import HttpsIcon from '@mui/icons-material/Https';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { toast } from 'react-toastify';
import { MenuItem, Select, FormControl } from "@mui/material";
import LockOpenIcon from '@mui/icons-material/LockOpen';

const ManageStore = ({ setSelected }) => {
    useEffect(() => {
        setSelected("Danh sách cửa hàng");
    }, []);
    const history = useNavigate();
    const redirectToEditProductPage = (id) => {
        history('/admin/Detailstore', { state: id });
    };
    const [mes, setMes] = useState("")
    const [data, setData] = useState([]);
    const [selectActive, setSelectActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openAccept, SetOpenAccept] = useState(false);
    const [status, setStatus] = useState(false)
    const [isLocked, SetisLocked] = useState(false)
    const notify = (er, message) => toast[er](message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
    const handChangestatus = (e) => {
        setStatus(e);
        fetchData(e);
    }
    const formRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (formRef.current && !formRef.current.contains(e.target) && !selectActive) {
                setOpenDetail(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectActive]);

    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');
    const fetchData = async (status) => {
        try {
            const response = await axios.get(`https://falth-api.vercel.app/api/admin/store?isLocked=${status}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const responseData = response.data.data;
            setData(responseData);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };
    const LockStore = async (id, status) => {
        try {
            await axios.patch(`https://falth-api.vercel.app/api/store/lock/${id}`, {
                "isLocked": status
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            notify("success", "Thành công");
            fetchData(status);
        } catch (error) {
            notify("error", "Thất bại");
        }
    };
    const downloadCSVData = async () => {
        try {
            const response = await axios.get('https://falth-api.vercel.app/api/admin/user/export', {
                responseType: 'blob', // Đặt kiểu dữ liệu là blob để xử lý dữ liệu nhị phân
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'userData.csv');
            document.body.appendChild(link);

            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu CSV:', error);
        }
    };

    useEffect(() => {
        fetchData(status);
    }, []);
    const handleopenAcceptClick = (row, status, mes) => {
        setMes(mes)
        SetisLocked(status)
        setSelectedRow(row);
        SetOpenAccept(true);
    };
    const columns = [
        {
            field: "id", headerName: "ID", headerAlign: "center",
            align: "center",
        },
        {
            flex: 2,
            field: "name",
            headerName: "Tên",
            type: "number",
            headerAlign: "center",
            align: "center",
        },
        {
            flex: 3,
            field: "address",
            headerName: "Địa chỉ",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "Detsil",
            headerName: "Xem Chi Tiết",
            headerAlign: "center",
            flex: 1,
            align: "center",
            renderCell: (params) => {
                return (
                    <div>
                        <Button startIcon={<RemoveRedEyeIcon style={{ color: "rgb(33, 150, 243)" }} />} onClick={() => redirectToEditProductPage(params.row._id)}></Button>
                    </div>
                );
            },
        },
        {
            headerName: "Khóa cửa hàng",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                return (
                    <div>
                        {params.row.isLocked ? (
                            <Button startIcon={<LockOpenIcon />} onClick={() => handleopenAcceptClick(params.row, true, "Mở Khóa")}></Button>
                        ) : (
                            <Button startIcon={<HttpsIcon />} onClick={() => handleopenAcceptClick(params.row, false, "Khóa")}></Button>
                        )}
                    </div>
                );
            },
        },

    ];

    const rowsWithUniqueIds = data.map((item, index) => {
        const uniqueId = index;
        return { ...item, id: uniqueId };
    });
    return (
        <Box m="20px" position='relative'>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box> <Header2 title="Danh sách cửa hàng" /></Box>
                <Box>
                    <Button variant="outlined" onClick={() => downloadCSVData()}>
                        Xuất file csv
                    </Button>
                </Box>
            </Box>
            <Box
                m="10px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-columnHeaderTitle": {
                        borderBottom: "none",
                        fontSize: "14px"
                        ,
                        fontWeight: "bold",
                    },
                }}
            >
                {openAccept && (
                    <Accept rows={selectedRow} show={true} handleClose={SetOpenAccept} Status={mes} LockStore={LockStore} isLocked={isLocked} />
                )}
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="5px">
                    <Box sx={{ flexBasis: '16%' }}>
                        <FormControl fullWidth>
                            <Typography component="legend">Trạng thái</Typography>
                            <Select
                                sx={{ alignItems: 'center', height: "40px" }}
                                value={status}
                                defaultChecked={true}
                                onChange={(e) => handChangestatus(e.target.value)}
                            >
                                <MenuItem value={false}>Còn hoạt động</MenuItem>
                                <MenuItem value={true}>Đã Khóa</MenuItem>
                            </Select>
                        </FormControl>

                    </Box>
                    <Box sx={{ flexBasis: '50%' }}>
                        {/* <Typography component="legend">Tìm kiếm</Typography>
                        <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', height: "40px" }}
                        >
                            <IconButton type="button" sx={{ p: '5px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Tên cửa hàng"
                            />

                        </Paper> */}

                    </Box>

                </Box>
                <Box sx={{ height: "70vh", width: '100%' }}>
                    <DataGrid rows={rowsWithUniqueIds} columns={columns}
                        loading={isLoading}
                        initialState={{
                            pagination: {
                                pageSize: 7,
                            },
                        }} />
                </Box>

            </Box >
        </Box >
    );
};
export default ManageStore;

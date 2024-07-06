import React, { useEffect, useState, useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { tokens } from "../../theme";
import { Box, Typography, useTheme } from "@mui/material";
import DetailShipper from './DetailShipper';
import style from "./DetailShipper.module.css";
import Header2 from "../../components/Header/Header";
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Button } from "@mui/material";
import HttpsIcon from '@mui/icons-material/Https';
import Accept from '../../components/Accept/Acceptshiper';
import { toast } from 'react-toastify';
import LockOpenIcon from '@mui/icons-material/LockOpen';
function ManageShipper({ setSelected }) {
    useEffect(() => {
        setSelected("Danh sách Shipper");
    }, []);
    const [data, setData] = useState([]);
    const [selectActive, setSelectActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [status, setStatus] = useState("")
    const formRef = useRef();
    const [openAccept, SetOpenAccept] = useState(false);
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
    const history = useNavigate();
    const redirectToEditProductPage = (id) => {
        history('/admin/DetailShipper', { state: id });
    };
    const LockShipper = async (id) => {
        try {
            await axios.patch(`https://falth-api.vercel.app/api/shipper/${id}/Lock`, {
                "status": status
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            notify("success", "Thành công");
            fetchData();
        } catch (error) {
            notify("error", "Thất bại");
        }
    };



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
    const handleopenAcceptClick = (row) => {

        setStatus("Hoạt Động");
        setSelectedRow(row);
        SetOpenAccept(true);
    };

    const handleopenClick = (row) => {
        setStatus("Tạm Ngừng");
        setSelectedRow(row);
        SetOpenAccept(true);

    };

    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');
    const api = `https://falth-api.vercel.app/api/admin/shipper/`;


    const fetchData = async () => {
        try {
            const response = await axios.get(api, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const responseData = response.data.data;
            console.log(responseData);
            setData(responseData);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const rowsWithUniqueIds = data.map((item, index) => {
        const uniqueId = index;
        return { ...item, id: uniqueId };
    });

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const downloadCSVData = async () => {
        try {
            const response = await axios.get('https://falth-api.vercel.app/api/admin/shipper/export', {
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
    const columns = [
        { field: "id", headerName: "ID" },
        {
            flex: 1,
            field: 'photo',
            headerAlign: "center",
            align: "center",
            headerName: 'Hình ảnh',
            renderCell: (params) => (
                <img
                    src={params.value}
                    alt="Hình ảnh"
                    style={{ width: "50px", height: "50px", borderRadius: "50px" }}
                />
            ),
        },
        {
            flex: 1,
            field: "firstName",
            headerName: "Họ",
            type: "firstName",
            headerAlign: "center",
            align: "center",
        },
        {
            flex: 1,
            field: "lastName",
            headerName: "Tên",
            type: "type",
            headerAlign: "center",
            align: "center",
        },
        {
            flex: 2,
            field: "email",
            headerAlign: "center",
            align: "center",
            headerName: "Email",
        },
        {
            field: "Detail",
            flex: 1,
            headerName: "Xem Chi Tiết",
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                return (
                    <div>
                        <Button startIcon={<RemoveRedEyeIcon style={{ color: "rgb(33, 150, 243)" }} />} onClick={() => redirectToEditProductPage(params.row._id)}></Button>
                    </div >
                );
            },
        },
        {
            headerName: "Khóa tài khoản",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: (params) => (
                params.row.status === "Tạm Ngừng" ?
                    <Button
                        startIcon={<HttpsIcon />}
                        onClick={() => handleopenAcceptClick(params.row)}
                    ></Button>

                    :
                    <Button
                        startIcon={<LockOpenIcon />}
                        onClick={() => handleopenClick(params.row)}
                    ></Button>

            ),
        },

    ];

    return (
        <Box m="20px" position='relative'>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header2 title="Danh sách cửa người giao hàng" />

                {/* <Box>
                    <div className={style.searchBar}>
                        <input
                            type="text"
                            className={style.searchInput}
                            placeholder="Tìm kiếm cửa người giao hàng"
                        // onChange={(e) => Searchproduct(e.target.value)}
                        />
                    </div>


                </Box> */}
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
                    <Accept rows={selectedRow} show={true} handleClose={SetOpenAccept} LockShipper={LockShipper} Status={status === "Tạm ngừng" ? "Mở Khóa" : "Khóa"} />
                )}
                <DataGrid
                    rows={rowsWithUniqueIds}
                    columns={columns}
                    initialState={{
                        pagination: {
                            pageSize: 6,
                        },
                    }}
                    loading={isLoading}
                />
            </Box>
        </Box>
    );
}

export default ManageShipper;

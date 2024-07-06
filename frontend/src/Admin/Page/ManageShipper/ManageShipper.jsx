import React, { useEffect, useState, useRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Box } from "@mui/material";
import DetailShipper from './DetailShipper';
import style from "./DetailShipper.module.css";
import Header2 from "../../components/Header/Header";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Accept from '../../components/Accept/Acceptshiper';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Button } from "@mui/material";
import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';

function ManageShipper({ setSelected }) {
    useEffect(() => {
        setSelected("Cấp phép Shipper");
    }, []);
    const [data, setData] = useState([]);
    const [selectActive, setSelectActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const formRef = useRef();
    const [openAccept, SetOpenAccept] = useState(false);
    const [openLock, SetOpenLock] = useState(false);

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
        console.log(id);
        history('/admin/DetailAcceptShipper', { state: id });
    };
    const AcceptShipper = async (id) => {
        try {
            await axios.patch(`https://falth-api.vercel.app/api/admin/shipper/${id}`, {
                "isAccepted": true
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

    const handleAcceptClick = (row) => {
        setSelectedRow(row);
        SetOpenAccept(true);
    };
    const handleLockClick = (row) => {
        setSelectedRow(row);
        SetOpenLock(true);
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

    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');
    const api = `https://falth-api.vercel.app/api/admin/shipper/approve`;

    const LockShipper = async (id, status) => {
        try {
            await axios.patch(`https://falth-api.vercel.app/api/admin/shipper/${id}`, {
                "isAccepted": false
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

    const columns = [
        { field: "id", headerName: "ID" },
        {
            flex: 1,
            fontsize: 14,
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
            flex: 2,
            field: "firstName",
            headerName: "Họ",
            type: "firstName",
            headerAlign: "center",
            align: "center",
        },
        {
            flex: 2,
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
            field: "Detdsil",
            flex: 1,
            headerName: "Xem",
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Button
                    startIcon={<RemoveRedEyeIcon style={{ color: "rgb(33, 150, 243)" }} />}
                    onClick={() => redirectToEditProductPage(params.row._id)}
                ></Button>
            ),

        },
        {
            field: "Accept",
            headerName: "Chấp nhận",
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                return (

                    <div>
                        <Button startIcon={<CheckCircleOutlineSharpIcon style={{ color: "rgb(0, 139, 69)" }} />} onClick={() => handleAcceptClick(params.row)}></Button>
                    </div >
                );
            },
        },
        {
            field: "Delete",
            headerName: "Từ chối",
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                return (
                    <div>
                        <Button startIcon={<HighlightOffSharpIcon style={{ color: "rgb(253 92 99)" }} onClick={() => handleLockClick(params.row)} />} ></Button>
                    </div >
                );
            },
        },
    ];

    return (
        <Box m="20px" position='relative'>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header2 title="Danh sách người giao hàng chờ xác nhận" />

                {/* <Box>
                    <div className={style.searchBar}>
                        <input
                            type="text"
                            className={style.searchInput}
                            placeholder="Tìm kiếm của hàng..."
                        // onChange={(e) => Searchproduct(e.target.value)}
                        />
                    </div>
                </Box> */}
                <Box>

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
                {openDetail && (
                    <DetailShipper rows={selectedRow} show={true} handleClose={setOpenDetail} />
                )}
                {openAccept && (
                    <Accept rows={selectedRow} show={true} handleClose={SetOpenAccept} AcceptShipper={AcceptShipper} Status={"Cấp phép"} />
                )}

                {openLock && (
                    <Accept rows={selectedRow} show={true} handleClose={SetOpenLock} LockShipper={LockShipper} Status={"Khóa"} />
                )}
                <DataGrid

                    rows={rowsWithUniqueIds}
                    columns={columns}
                    initialState={{
                        pagination: {
                            pageSize: 10,
                        },
                    }}
                    loading={isLoading}
                />

            </Box>
        </Box>
    );
}

export default ManageShipper;

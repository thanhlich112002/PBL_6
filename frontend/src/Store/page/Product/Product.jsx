import React, { useState, useRef, useEffect } from 'react';
import { Box, useTheme, Typography, } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import { Button } from "@mui/material";
import axios from 'axios';
import Delete from './Delete';
import style from './Product.module.css'
import Header2 from "../../components/Header/Header";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Detailfeedback from './fb_product';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { MenuItem, FormControl, Select } from "@mui/material";

const Product = ({ setSelected }) => {
    useEffect(() => {
        setSelected("Danh sách Sản phẩm");
    }, []);
    const [idproduct, setIdproduct] = useState("");
    const [data, setData] = useState([]);
    const [datafb, setDatafb] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const [status, setStatus] = useState(true)
    const [nameproduct, Setnameproduct] = useState("")
    const _idstore = localStorage.getItem('_idstore');
    const handChangestatus = (e) => {
        setStatus(e);
        handleStatus(e);
    }


    const history = useNavigate();
    const redirectToProductPage = () => {
        history('/store/Formadd');
    };
    const redirectToEditProductPage = (id) => {
        history(`/store/Formedit/${id}`, { state: id });
    };
    const formRef = useRef();
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

    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');
    const api = `https://falth-api.vercel.app/api/product/owner/${_id}?limit=100`;
    const Searchproduct = async (name) => {
        console.log(name);
        try {
            const response = await axios.get(`https://falth-api.vercel.app/api/product/owner/${_id}?search=${name}`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const responseData = response.data.data;
            console.log(responseData);
            setData(responseData);
            setIsLoading(false);

        } catch (error) {
            console.log(error);
        }
    }
    const fb = async (row) => {
        try {
            setIdproduct(row._id)
            const response = await axios.get(`https://falth-api.vercel.app/api/product/${row._id}/rating`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            Setnameproduct(row.name)
            const responseData = response.data.data;
            console.log(responseData);
            setDatafb(responseData);
            handleOpenModal()
        } catch (error) {
            console.log(error);
        }
    }
    const handleStatus = async (status) => {
        try {
            const response = await axios.get(`https://falth-api.vercel.app/api/product/owner/${_id}?limit=100`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const responseData = response.data.data;
            console.log(responseData);
            setData(responseData);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }
    const Fbnumber = async (number) => {
        try {
            const response = await axios.get(`https://falth-api.vercel.app/api/product/${idproduct}/rating?${number}`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const responseData = response.data.data;
            console.log(responseData);
            setDatafb(responseData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleStatus(status)
    }, []);

    const handleDeleteClick = (row) => {
        setSelectedRow(row);
        setStatus(row.isAvailable)
        setOpenDelete(true);
        setOpenAdd(false);
    };

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        { field: "id", headerName: "ID" },
        {
            field: "name",
            headerName: "Tên",
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "price",
            headerName: "Giá tiền",
            headerAlign: "center",
            align: "center",
            flex: 1,
            valueFormatter: (params) => {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value);
            },
        },
        {
            field: "isOutofOrder",
            headerName: "Trạng thái",
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                let color;
                switch (params.row.isOutofOrder) {
                    case false:
                        color = "#4caf4fb9";
                        break;
                    case true:
                        color = "#FF5722";
                        break;
                    default:
                        color = "#4caf4fb9";
                }

                return (
                    <Box
                        display="flex"
                        justifyContent="center"
                    >
                        <div style={{ height: "10px", width: "10px", background: color, borderRadius: "30px", }}>
                        </div >
                    </Box>
                );
            },
        },
        {
            field: "Detsil",
            headerName: "Chỉnh sửa",
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {

                return (<div>
                    <Button startIcon={<ModeEditIcon style={{ color: "rgb(103, 58, 183)" }} />} onClick={() => redirectToEditProductPage(params.row._id)}></Button>
                </div >);
            },
        },
        {
            headerName: "Ẩn sản phẩm",
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                return (
                    <div>
                        <Button startIcon={getDeleteButtonIcon(params.row.isAvailable)} onClick={() => handleDeleteClick(params.row)}>
                        </Button>
                    </div >
                );

            },
        },
        {
            field: 'Eyes',
            headerName: 'Xem đánh giá',
            sortable: false,
            editable: false,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <div>
                    <Button startIcon={<RemoveRedEyeIcon style={{ color: "rgb(33, 150, 243)" }} />} onClick={() => fb(params.row)}></Button>
                </div>
            ),
        },

    ];

    const rowsWithUniqueIds = data.map((item, index) => {
        const uniqueId = index;
        return { ...item, id: uniqueId };
    });
    const getDeleteButtonIcon = (isAvailable) => {
        return isAvailable ? <RemoveCircleOutlineIcon style={{ color: 'red' }} /> : <NotInterestedIcon style={{ color: 'red' }} />;
    };

    const getRowId = (row) => row.id;

    const getRowClassName = (params) => {
        return params.row.isAvailable
            ? 'out-of-order-row' : 'normal-row';
    };

    const downloadCSVData = async () => {
        try {
            const response = await axios.get(`https://falth-api.vercel.app/api/owner/store/${_idstore}/export-product`, {
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

    return (
        <Box m="20px" position='relative'>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header2 title="Danh sách sản phẩm" />

                <Box>
                    <div className={style.searchBar}>
                        <input
                            type="text"
                            className={style.searchInput}
                            placeholder="Tìm kiếm sản phẩm..."
                            onChange={(e) => Searchproduct(e.target.value)}
                        />
                    </div>
                </Box>
                <Box >
                    <Button
                        variant="outlined"
                        onClick={() => { redirectToProductPage() }}
                    >
                        Thêm sản phẩm
                    </Button>
                    <Button style={{ marginLeft: "10px" }} variant="outlined" onClick={() => downloadCSVData()}>
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
                        fontSize: "14px",
                        fontWeight: "bold",
                    },
                    "& .normal-row": {
                        backgroundColor: "rgb(230, 230, 230)"
                    },
                    "& .normal-row:hover": {
                        backgroundColor: "rgb(230, 230, 230)"
                    }
                }}

            >
                {
                    openDelete && (
                        <div ref={formRef} className="form-container"
                            style={{ position: "absolute", zIndex: 1000, width: "40%", top: '5%', right: '30%', background: colors.primary[400], border: colors.primary[900] }}>
                            <Box m="20px" >
                                <Delete selectedRow={selectedRow} setOpenDelete={setOpenDelete} fetchData={handleStatus} setOpenNotify={notify} Status={!status} />
                            </Box>
                        </div>
                    )
                }
                <Detailfeedback open={openModal} handleClose={handleCloseModal} datafb={datafb} name={nameproduct} Fbnumber={Fbnumber} fb={fb()} />
                <DataGrid
                    rows={rowsWithUniqueIds}
                    columns={columns}
                    loading={isLoading}
                    getRowId={getRowId}
                    getRowClassName={getRowClassName}
                    initialState={{
                        pagination: {
                            pageSize: 8,
                        },
                    }}
                />
            </Box >
        </Box >
    );
};
export default Product;

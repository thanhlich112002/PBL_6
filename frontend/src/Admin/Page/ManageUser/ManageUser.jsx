import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import axios from 'axios';
import Header2 from "../../components/Header/Header2";
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
const ManageUser = ({ setSelected }) => {
    useEffect(() => {
        setSelected("Danh sách người dùng");
    }, []);
    const [data, setData] = useState([]);
    const [selectActive, setSelectActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [openDetail, setOpenDetail] = useState(true);
    const formRef = useRef();
    const history = useNavigate();
    const redirectToEditProductPage = (row) => {
        history('/admin/detailuser', { state: row });
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
    const api = `https://falth-api.vercel.app/api/admin/user`;
    const fetchData = async () => {
        try {
            const response = await axios.get(api, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const responseData = response.data.data;
            console.log(responseData)
            setData(responseData);

        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDetailClick = (row) => {
        console.log(row);
        redirectToEditProductPage(row)
    };


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        { field: "id", headerName: "ID" },
        {
            flex: 1,
            field: "name",
            headerName: "Tên",
            type: "number",
            headerAlign: "center",
            align: "center",
        },
        {
            flex: 1,
            field: "email",
            headerName: "Email",
            headerAlign: "center",
            align: "center",
        },
        {
            field: "Detsil",
            flex: 1,
            headerName: "Xem Chi Tiết",
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
                return (
                    <Box
                        width="60%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={colors.greenAccent[600]}
                        borderRadius="4px"
                        onClick={() => handleDetailClick(params.row)}
                    >
                        <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                            Xem chi tiết
                        </Typography>
                    </Box>
                );
            },
        },
    ];

    const rowsWithUniqueIds = data.map((item, index) => {
        const uniqueId = index;
        const fullName = `${item.firstName} ${item.lastName}`;
        const phoneNumber = item.contact.phoneNumber;
        return { ...item, phoneNumber: phoneNumber, id: uniqueId, name: fullName };
    });
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


    return (
        <Box m="20px" >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box> <Header2 title="Danh sách người dùng" /></Box>
                <Box>
                    <Button variant="outlined" onClick={() => downloadCSVData()}>
                        Xuất file csv
                    </Button>
                </Box>
            </Box>
            <Box
                display="flex"
                height="75vh"
            >
                <Box
                    m="10px  10px 0 0"
                    width="100%"
                    height="75vh"
                >
                    <DataGrid rows={rowsWithUniqueIds} columns={columns}
                        loading={isLoading}
                        initialState={{
                            pagination: {
                                pageSize: 8,
                            },
                        }} />
                </Box>
            </Box >
        </Box>
    );
};

export default ManageUser;

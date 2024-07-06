import React, { useState, useEffect } from 'react';
import { useTheme, Box } from "@mui/material";
import { tokens } from "../../theme";
import axios from 'axios';
import Loading from '../../components/Loading/Loading'
import Header2 from '../../components/Header/Header2';
import Addcategory from './Addcategory';
import style from './category.css';
import { toast } from 'react-toastify';
import Slider from "react-slick";

const Category = ({ setSelected }) => {
    useEffect(() => {
        setSelected("Danh mục");
    }, []);
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
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentPage, setCurrentPage] = useState(1);
    const [listCat, setlistCat] = useState([]);
    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');
    const api = `https://falth-api.vercel.app/api/category/store/${_id}`;
    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const itemsPerPage = 4;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCatList();
    }, []);
    const fetchData = async (name) => {
        try {
            const response = await axios.get(`https://falth-api.vercel.app/api/product?catName=${name}&limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const responseData = response.data.data.data;
            setData(responseData);
            setTotalPages(Math.ceil(responseData.length / itemsPerPage));
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
        setCurrentPage(1);
    };
    const fetchCatList = async () => {
        try {
            const response = await axios.get(`https://falth-api.vercel.app/api/category`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const responseData = response.data;
            console.log(responseData);
            setlistCat(responseData);
            const firstCatName = responseData[0]?.catName;
            console.log(firstCatName);
            fetchData(firstCatName);
        } catch (error) {
            console.log(error);
        }
    }
    const add = async (dataform) => {
        try {
            await axios.post(`https://falth-api.vercel.app/api/category`, dataform, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            notify("success", "Thêm thành công");
            fetchData();
            fetchCatList();
        } catch (error) {
            notify("error", "Thêm thất bại");
            console.log(error);
        }
    };
    const handlePageChange = (page) => {
        const clampedPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(clampedPage);
    };

    const [startIndex, setStartIndex] = useState(0);

    const handleNextImages = () => {
        setStartIndex((prevIndex) => (prevIndex + 4) % listCat.length);
    };

    const handlePrevImages = () => {
        setStartIndex((prevIndex) => (prevIndex - 4 + listCat.length) % listCat.length);
    };

    const visibleImages = listCat.slice(startIndex, startIndex + 4);
    const repeatedImages = [...visibleImages, ...listCat.slice(0, Math.max(0, 4 - visibleImages.length))];


    return (
        <Box m="10px" position='relative'>
            <Header2 title="Danh mục" />
            <Box
                height="75vh"
            >
                <div className="product">
                    {isLoading ? (
                        <div className="isloading"><Loading /></div>
                    ) : (
                        <>
                            <div style={{ width: "100%", display: "flex" }}>
                                <div className='list'>
                                    {listCat.length > 4 && (
                                        <div className='danhmuc'>
                                            <button onClick={handlePrevImages}><i class="fa-solid fa-circle-chevron-left"></i></button>
                                            {repeatedImages.map((value, index) => (
                                                <div key={index} className='category' onClick={() => fetchData(value.catName)}>
                                                    <div className='imagecat'>
                                                        <img
                                                            style={{ height: "100px", width: "100%" }}
                                                            src={value.photo}
                                                            alt={`category-${index}`}
                                                        />
                                                    </div>
                                                    <span style={{ fontSize: "15px", fontWeight: "500", padding: "3px" }}>{value.catName}</span>
                                                </div>
                                            ))}
                                            <button onClick={handleNextImages}><i class="fa-solid fa-circle-chevron-right"></i></button>
                                        </div>
                                    )}
                                </div>
                                <div className='category' onClick={() => handleOpenModal()}>
                                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}><i style={{ fontSize: "50px", color: "gray" }} class="fa-solid fa-plus"></i>
                                        <span>Thêm danh mục</span></div>
                                </div>
                            </div>
                            <div className="container">
                                {data && data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
                                    <div key={index} className="box">
                                        <div className="img_box">
                                            <img className="image" src={item.images[0]} alt="image" />
                                        </div>
                                        <div className="detail">
                                            <h3>{item.name}</h3>
                                            <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                <p style={{ display: "inline" }}>{item.description}</p>
                                            </div>
                                            <h4>{item.price}</h4>
                                            <h4>Danh mục : {item.category.catName}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div >
                                <ul className="pagination">
                                    <li className={currentPage === 1 ? 'disabled' : ''}>
                                        <a className="" onClick={() => handlePageChange(currentPage - 1)}>
                                            <i className="fa-solid fa-circle-chevron-left" style={{ color: 'red', fontSize: '18px', verticalAlign: 'middle' }}></i>
                                        </a>
                                    </li>
                                    {Array.from({ length: totalPages }).map((_, index) => (
                                        <li key={index} className={currentPage === index + 1 ? 'active' : ''}>
                                            <a className="undefined" href="#" onClick={() => handlePageChange(index + 1)}>{index + 1}</a>
                                        </li>
                                    ))}
                                    <li className={currentPage === totalPages ? 'disabled' : ''}>
                                        <a className="" onClick={() => handlePageChange(currentPage + 1)}>
                                            <i className="fa-solid fa-circle-chevron-right" style={{ color: 'red', fontSize: '18px', verticalAlign: 'middle' }}></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </>

                    )
                    }
                </div >
            </Box >
            <Addcategory open={openModal} handleClose={handleCloseModal} add={add} />
        </Box >
    );
};

export default Category;

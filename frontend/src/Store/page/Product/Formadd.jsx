import React, { useState, useEffect } from 'react';
import { Box } from "@mui/material";
import Header1 from "../../components/Header/Header1";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { FormControl } from 'react-bootstrap';
import Image from "../../components/Image/Image";
import * as yup from 'yup';
import { Formik } from 'formik';
import Loading from '../../components/Loading/Loading'
import style from './Formadd.module.css';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from 'react-router-dom';


const Product = ({ setSelected }) => {

    const [productStatus, setProductStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingbutton, setIsLoadingbutton] = useState(false);
    const history = useNavigate();
    const [images, setImages] = useState([]);
    const [deletedImageUrls, setDeletedImageUrls] = useState([]);
    const [message, setMessage] = useState("");
    const [validated, setValidated] = useState(false);
    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');
    const [Catname, setCatname] = useState([]);
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


    const fetchCatname = async () => {
        try {
            const response = await axios.get(
                `https://falth-api.vercel.app/api/category`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const responseData = response.data;
            console.log(responseData);
            setCatname(responseData);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchCatname();
    }, []);
    useEffect(() => {
        setSelected("Thêm sản phẩm");
    }, []);

    const Addproduct = async (formData) => {
        try {
            setIsLoadingbutton(true);
            await axios.post(`https://falth-api.vercel.app/api/product/owner/${_id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            notify("success", "Thêm thành công");
            history('/store/product');

        } catch (error) {
            notify("error", "Thêm thất bại");
            setIsLoadingbutton(false);
        }
    };
    const priceRegExp = /^[1-9]\d*000$/;


    const schema = yup.object().shape({
        name: yup.string().required("Tên là bắt buộc").min(1, "Tên không được để trống"),
        price: yup.string().required("Giá tiền là bắt buộc").matches(priceRegExp, "Giá tiền không hợp lệ"),
        description: yup.string().required("Mô tả là bắt buộc"),
    });

    const handleSubmit = (values) => {
        console.log('Dữ liệu đã submit:', values);
        let formData = new FormData();
        const tenSanPham = values.name;
        const giaTien = values.price;
        const moTa = values.description;
        const danhMuc = values.category;

        formData.append('catName', danhMuc);
        formData.append('name', tenSanPham);
        formData.append('price', giaTien);
        formData.append('description', moTa);
        formData.append('isOutofOrder', productStatus);
        console.log(images)
        if (images.length === 0) {
            setMessage("Bạn cần chọn ít nhất một hình ảnh.");
        } else {
            images.forEach((image, i) =>
                formData.append('images', image.file)
            );
            Addproduct(formData);
        }
    };


    return (
        <Box m="20px 100px">
            <Header1 title={"Thêm sản phẩm"} to="/store/product" />
            {isLoading ? (
                <div className={style.isloading}><Loading /></div>
            ) : (
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(6, 1fr)"
                    gridAutoRows="5vh"
                    gap="20px"
                    mt="30px"
                >
                    <Box
                        gridColumn="span 4"
                        display="flex"
                        gridRow="span 10"
                    >
                        <div style={{ width: "100%", height: "100%", padding: "20px", gap: "40px", border: " 0.1px solid rgb(223, 223, 223)", borderRadius: "10px" }}>
                            <Formik
                                validationSchema={schema}
                                noValidate validated={validated}
                                onSubmit={handleSubmit}
                                initialValues={{
                                    name: "",
                                    price: "",
                                    description: "",
                                    category: Catname[0].catName

                                }}
                            >
                                {({ handleSubmit, handleChange, values, touched, errors }) => (
                                    <Form noValidate onSubmit={handleSubmit} style={{ width: "100%", height: "100%" }}>
                                        <h5 style={{ paddingBottom: "20px" }}>Thông tin sản phẩm</h5>
                                        <Row className="mb-3" style={{ marginTop: "30px" }}>
                                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                                                <Form.Label>Tên sản phẩm</Form.Label>
                                                <FormControl
                                                    required
                                                    type="text"
                                                    placeholder="Tên sản phẩm"
                                                    defaultValue=""
                                                    name="name"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.name}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.name}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} md="6" controlId="validationCustomUsername">
                                                <Form.Label>Giá tiền</Form.Label>
                                                <InputGroup hasValidation>

                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Giá tiền"
                                                        required
                                                        name="price"
                                                        value={values.price}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.price}
                                                    />
                                                    <InputGroup.Text id="inputGroupPrepend">VND</InputGroup.Text>
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.price}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3" style={{ marginTop: "30px" }}>
                                            <Form.Group
                                                as={Col}
                                                md="12"
                                                controlId="validationFormik103"
                                                className="position-relative"
                                            >
                                                <Form.Label>Mô tả</Form.Label>
                                                <Form.Control
                                                    required
                                                    as="textarea"
                                                    placeholder="Mô tả"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.description}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.description}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3" style={{ marginTop: "30px" }}>
                                            <Form.Group
                                                as={Col}
                                                md="12"
                                                controlId="validationFormik104"
                                                className="position-relative"
                                                justifyContent="bottom"
                                            >
                                                <Form.Label>Danh mục</Form.Label>
                                                <Form.Control
                                                    required
                                                    as="select"
                                                    placeholder="Mô tả"
                                                    name="category"
                                                    value={values.category}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.category}
                                                >
                                                    {Catname.map((option, index) => (
                                                        <option key={index} value={option.catName}>
                                                            {option.catName}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-3" style={{ marginTop: "30px" }}>
                                            {isLoadingbutton ? (
                                                <Form.Group
                                                    as={Col}
                                                    md="12"
                                                    controlId="validationFormik103"
                                                    className="position-relative"
                                                    style={{ display: 'flex', justifyContent: 'center' }}
                                                >
                                                    <Loading />
                                                </Form.Group>


                                            ) : (<Form.Group
                                                as={Col}
                                                md="12"
                                                controlId="validationFormik103"
                                                className="position-relative"
                                                justifyContent="bottom"
                                            >
                                                <Button width="2000px" type="submit" >Lưu</Button>
                                            </Form.Group>
                                            )}
                                        </Row>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </Box>
                    {/* //////////////////////////////////////////////////////////////////// */}
                    <Box
                        gridColumn="span 2"
                        gridRow="span 7"
                        display="flex"
                    >
                        <div style={{
                            width: "100%", padding: "20px", border: " 0.1px solid rgb(223, 223, 223)", borderRadius: "10px"
                        }}>
                            <h5 style={{ marginBottom: "20px" }}>Hình ảnh</h5>
                            <Image images={images} setImages={setImages} setDeletedImageUrls={setDeletedImageUrls} />
                            <h6 style={{ paddingBottom: "20px", color: "red" }}>{message}</h6>
                        </div>

                    </Box>
                    <Box
                        gridColumn="span 2"
                        gridRow="span 3"
                        display="flex"

                    >
                        <div style={{
                            width: "100%",
                            padding: "20px",
                            border: "0.1px solid rgb(223, 223, 223)",
                            borderRadius: "10px"
                        }}>
                            <h5 style={{ paddingBottom: "20px" }}>Trạng thái</h5>
                            <div>
                                <div className="mb-3">
                                    <Form.Check
                                        type="radio"
                                        id="default-radio-1"
                                        label="Hết hàng"
                                        name="default-radio"
                                        onClick={() => setProductStatus(true)}
                                        defaultChecked={productStatus}
                                    />
                                    <Form.Check
                                        type="radio"
                                        id="default-radio-2"
                                        label="Còn hàng"
                                        name="default-radio"
                                        onChange={() => setProductStatus(false)}
                                        defaultChecked={!productStatus}
                                    />
                                </div>
                            </div>

                        </div>
                    </Box>

                </Box>)}
        </Box >
    );
};

export default Product;

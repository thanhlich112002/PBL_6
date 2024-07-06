import React, { useState } from "react";
import soldout from '../../assets/img/sold-out.png'
import close from '../../assets/img/close.jfif'
import { Navigate, useNavigate } from "react-router-dom";
import ProductDetailModal from "../Modal/productDetailModal";
import { getRatingOfProduct } from "../../services/userServices";
const DishInMenuGroup = ({ dish, handleOpen, handleAddToCart, isWithinOperatingHours }) => {
    const navigate = useNavigate()
    const handleAdd = (quantity) => {
        handleAddToCart(dish, quantity);
        handleOpen();
    }

    const [ratings, setRatings] = useState([])
    const [idUser, setIdUser] = useState('')

    const [showModal, setShowModal] = useState(false)
    const handleShowModal = async () => {
        const user = localStorage.getItem("user");
        const userData = JSON.parse(user);
        
        if(userData) {
            setIdUser(userData._id)
        }
            try {
                // setIsLoading(true)
                const data = await getRatingOfProduct(dish._id)
                setRatings({ ...data.data })
            } catch (error) {
                console.error("Lỗi khi lấy thông tin đánh giá:", error);
            }
            setShowModal(true);
        }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div
                class="item-restaurant-row"
                style={{
                    height: 'auto',
                    width: '100%',
                }}
            >
                <div class="row">
                    <div class="col-auto item-restaurant-img" onClick={handleShowModal}>
                        <button class="inline">
                            <img
                                src={dish.images[0]}
                                alt={dish.name}
                                width="60"
                                height="60"
                            />
                        </button>
                    </div>
                    <div class="col item-restaurant-info" onClick={handleShowModal}>
                        <h2 class="item-restaurant-name">
                            {dish.name}
                        </h2>
                        <div class="item-restaurant-desc">{dish.description}</div>
                        {/* <div class="item-restaurant-total">
                            Đã được đặt<span class="txt-bold"
                            >&nbsp;10+&nbsp;</span>lần
                        </div> */}
                    </div>
                    <div class="col-auto item-restaurant-more">
                        <div class="row">
                            <div class="col-auto product-price">
                                <div class="current-price">
                                    {dish.price.toLocaleString('vi-VN')}<span
                                        style={{
                                            fontWeight: '400',
                                            position: 'relative',
                                            top: '-9px',
                                            fontSize: '10px',
                                            right: '0',
                                        }}
                                    >đ</span>
                                </div>
                            </div>
                            <div
                                class="col-auto adding-food-cart txt-right"
                            >
                                {!isWithinOperatingHours ? (
                                    <img
                                        src={close}
                                        alt="Đóng cửa"
                                        style={{ height: '80%', width: '80px' }}
                                    ></img>
                                ) : (
                                    dish.isOutofOrder ? (
                                        <img
                                            src={soldout}
                                            alt="Hết hàng"
                                            style={{ height: '80%', width: '80px' }}
                                        ></img>
                                    ) : (
                                        <div class="btn-adding" onClick={() => handleAdd(1)}>+</div>
                                    )
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ProductDetailModal show={showModal} handleClose={handleCloseModal} product={dish} handleAdd={handleAdd} isWithinOperatingHours={isWithinOperatingHours} ratings={ratings} setRatings={setRatings} idUser={idUser} />
        </div>


    )
}

export default DishInMenuGroup
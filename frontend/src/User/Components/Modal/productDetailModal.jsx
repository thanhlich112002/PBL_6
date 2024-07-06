import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from "react-i18next";
import '../../assets/css/productDetail2.css'
import minus from '../../assets/img/minus.png'
import plus from '../../assets/img/plus.png'
import soldout from '../../assets/img/sold-out.png'
import close from '../../assets/img/close.jfif'
import Comment from "./comment";
const ProductDetailModal = ({ show, handleClose, product, handleAdd, isWithinOperatingHours, ratings, setRatings, idUser }) => {
    const { t } = useTranslation()
    const [quantity, setQuantity] = useState(1)
    const handleIncrease = () => {
        if (quantity < 10) {
            setQuantity(quantity + 1);
        }
    }

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const [selectedImage, setSelectedImage] = useState(product.images[0])
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setSelectedImage(product.images[0])
    }, [product])

    const handleSelectImage = (index) => {
        setSelectedImage(product.images[index]);
        setCurrentIndex(index);
    };

    const handleLeftArrowClick = () => {
        const newIndex = (currentIndex - 1 + product.images.length) % product.images.length;
        setSelectedImage(product.images[newIndex]);
        setCurrentIndex(newIndex);
    };

    const handleRightArrowClick = () => {
        const newIndex = (currentIndex + 1) % product.images.length;
        setSelectedImage(product.images[newIndex]);
        setCurrentIndex(newIndex);
    };

    return (
        <div>
            <Modal className="modal fade bd-example-modal-lg " show={show} handleClose={handleClose} size="lg">
                <Modal.Title style={{ textAlign: 'center', margin: '10px 0 0 0' }}>Chi tiết sản phẩm
                {/* <span class="close" style={{ fontSize: '24px' }} onClick={handleClose}
                    >x</span> */}
                    <button  onClick={handleClose} style={{backgroundColor:'#cf2127', float:'right', marginRight: '10px', padding: '3px 10px 5px 10px', borderRadius:'5px', color:'white'}}>
      x
    </button>
                </Modal.Title>
                <Modal.Header>                   
                </Modal.Header>
                <Modal.Body>
                    <div class="now-detail-restaurant clearfix" style={{ width: '90%', marginLeft: '5%', height: '310px' }}>
                        <div class="container" style={{ width: '100%' }}>
                            <div class="detail-restaurant-img" style={{ width: '48%' }}>
                                <div class="flex flex-column" style={{ width: '100%' }}>
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        class=""
                                        style={{ height: '200px', width: '100%', marginLeft: '0' }}
                                    />

                                    <div class="LmLCVP">
                                        {product.images.map((image, index) => (
                                            <div className={`lnM4pa ${index === currentIndex ? 'selected-image' : ''}`} key={index}>
                                                <div class="OibNSJ">
                                                    <div class="_11mwwv">
                                                        <picture
                                                        ><img
                                                                alt=""
                                                                class="_7D4JtJ"
                                                                src={image}
                                                                onClick={() => handleSelectImage(index)}
                                                            /></picture>
                                                    </div>
                                                    <div class=""></div>
                                                </div>
                                            </div>
                                        ))}
                                        <button class="shopee-icon-button LFMWYe RNDSpb" tabindex="-1" onClick={handleLeftArrowClick}>
                                            <svg
                                                enable-background="new 0 0 13 20"
                                                viewBox="0 0 13 20"
                                                x="0"
                                                y="0"
                                                class="shopee-svg-icon icon-arrow-left-bold"
                                            >
                                                <polygon
                                                    points="4.2 10 12.1 2.1 10 -.1 1 8.9 -.1 10 1 11 10 20 12.1 17.9"
                                                ></polygon>
                                            </svg>
                                        </button>
                                        <button class="shopee-icon-button LFMWYe _41JS8N" tabindex="-1" onClick={handleRightArrowClick}>
                                            <svg
                                                enable-background="new 0 0 13 21"
                                                viewBox="0 0 13 21"
                                                x="0"
                                                y="0"
                                                class="shopee-svg-icon icon-arrow-right-bold"
                                            >
                                                <polygon
                                                    points="11.1 9.9 2.1 .9 -.1 3.1 7.9 11 -.1 18.9 2.1 21 11.1 12 12.1 11"
                                                ></polygon>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-restaurant-info" style={{ width: '48%' }}>
                                <div class="product-essential-detail" style={{ width: '100%' }}>
                                    <h1 class="name-restaurant">
                                        {product.name}
                                    </h1>

                                    <div class="col-md-12 price-block">
                                        <div id="catalog-product-details-price" class="product_price price-block-left ">
                                            <div class="price-box">
                                                <p class="special-price" style={{ margin: '0' }}>
                                                    <span class="price" id="product-price-263345">{(product.price).toLocaleString('vi-VN')}&nbsp;đ</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="rating">
                                        <span class="number-rating">{product.ratingsAverage}</span>
                                        <div class="stars">
                                            <span class=""><i class="fas fa-solid fa-star"></i></span>
                                        </div>
                                        <span style={{ color: '#ee4d2d' }}>{t("ratingInFALTH")}</span>
                                    </div>


                                    <div class="clear"></div>
                                    <div id="catalog-product-details-discount">

                                    </div>

                                    <div class="product-info">
                                        <p>
                                            {product.description}
                                        </p>
                                    </div>

                                    {!isWithinOperatingHours ? (
                                        <img
                                            src={close}
                                            alt="Đóng cửa"
                                            style={{ width: '60%', marginLeft: '15%' }}
                                        ></img>
                                    ) : (
                                        product.isOutofOrder ? (
                                            <img
                                                src={soldout}
                                                alt="Hết hàng"
                                                style={{ width: '60%', marginLeft: '15%' }}
                                            ></img>
                                        ) : (

                                            <div class="product-view-quantity-box">
                                                <div class="product-view-quantity-box-block">
                                                    <a class="btn-subtract-qty" onClick={handleDecrease}>
                                                        <img alt='' style={{ width: '12px', height: 'auto' }} src={minus} /></a>
                                                    <input type="text" name="qty" id="qty" maxvalue="10" minvalue="1" align="center" value={quantity} title="SL" class="input-text qty" readOnly />
                                                    <a class="btn-add-qty" onClick={handleIncrease}><img alt="" style={{ width: '12px', height: 'auto' }} src={plus} /></a>
                                                </div>
                                                <div class="product_view_add_box" style={{ marginLeft: '20px' }}>
                                                    <button type="button" title="Thêm vào giỏ hàng" class="btn-cart-to-cart" onClick={() => handleAdd(quantity)}>
                                                        <i class="fa-solid fa-cart-shopping"></i>
                                                        <span>Thêm vào giỏ hàng</span>
                                                    </button>
                                                </div>
                                            </div>


                                        )
                                    )}


                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="container relative clearfix" style={{ width: '100%' }}>
                        <div class="now-menu-restaurant" style={{ width: '100%' }}>
                            <div class="menu-restaurant-tab">
                                <div class="item active" style={{ fontSize: '20px' }}>Đánh giá </div>
                            </div>
                            <div className="history-table-scroll">

                                <div class="menu-restaurant-content-tab">
                                    <div class="menu-restaurant-container">
                                        <div class="menu-restaurant-detail" style={{ width: '100%' }}>

                                            <Comment product={product} ratings={ratings} idUser={idUser} setRatings={setRatings}/>

                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div class="modal-footer content-center">
                        <div class="relative">
                            <button
                                type="button"
                                class="btn btn-danger btn-width-long"
                                onClick={handleClose}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>

                    {/* </div> */}
                </Modal.Body>
            </Modal>
        </div>
    )

}

export default ProductDetailModal
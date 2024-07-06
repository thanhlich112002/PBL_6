import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from "react-i18next";
import Notify from '../Notify.jsx/Notify'
import LoadingModal from "../Loading/Loading";
import axios from "axios";

const RatingStore = ({ show, handleClose, store }) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        number: '',
        content: '',
        images: []
    });

    const [openNotify, setOpenNotify] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [notify, setNotify] = useState('')

    const handleCloseRating = () => {
        handleClose()
        setFormData({
            number: '',
            content: '',
            images: []
        });
    }

    const handleCloseNotify = () => {
        setOpenNotify(false)
    }

    const handleChangeImg = (e) => {
        const name = e.target.name;
        const files = e.target.files;
        const imagesArray = Array.from(files);

        setFormData({
            ...formData,
            [name]: (formData.images || []).concat(imagesArray),
        });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const [dels, setDels] = useState([]);
    const handleSubmit = async () => {
        const res = new FormData();
        res.append('number', formData.number);
        res.append('content', formData.content);

        // Append each image to the FormData
        if (formData.images && formData.images.length > 0) {
            formData.images.forEach((image, index) => {
                if (image instanceof File) {
                    res.append(`images`, image);
                }
            });
        }
        if (formData.number === '') {
            setNotify(`${t("ratingNotify1")}`)
            setOpenNotify(true)
        } else {
            const token = localStorage.getItem("token");
            try {

                setIsLoading(true);
                const response = await axios.post(`https://falth-api.vercel.app/api/store/${store._id}/rating`, res, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        ContentType: 'multipart/form-data',
                    }
                });

                setNotify(`${t("ratingNotify2")}`)
                setOpenNotify(true)
                handleClose()
            } catch (error) {
                setNotify(`${t("ratingNotify3")}`)
                setOpenNotify(true)
                handleClose()
            } finally {
                setIsLoading(false);
            }
            setFormData({
                number: '',
                content: '',
                images: [],
            });
        }


    };

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, index) => {
            const starValue = index + 1;
            const percentFilled = Math.min(100, Math.max(0, rating - index) * 100);
            const isHalfFilled = percentFilled > 0 && percentFilled < 100;

            return (
                <div className="shopee-rating-stars__star-wrapper" key={index}>
                    <div className="shopee-rating-stars__lit" style={{ width: `${isHalfFilled ? percentFilled : percentFilled}%`, color: '#ffb500' }}>
                        <svg
                            enableBackground="new 0 0 15 15"
                            viewBox="0 0 15 15"
                            x="0"
                            y="0"
                            className="shopee-svg-icon shopee-rating-stars__primary-star icon-rating-solid"
                        >
                            <polygon
                                points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                            ></polygon>
                        </svg>
                    </div>
                </div>
            );
        });
    };
    return (
        <div>
            <Modal className="modal fade modal-customer-feeback" show={show} handleClose={handleClose} size="lg">
                <Modal.Header>
                    <span class="close" style={{ fontSize: '24px' }} onClick={handleCloseRating}
                    >x</span>
                    <div class="modal-header" style={{ color: 'white' }}>{t("rating")} {t("store")}</div>
                </Modal.Header>
                <Modal.Body>
                    <div class="modal-dialog modal-noti" role="document">
                        <div class="modal-content">

                            <div class="modal-body">
                                <div class="slick-slider slick-initialized" dir="ltr">
                                    <div class="slick-list">
                                        <div
                                            class="slick-track"
                                            style={{
                                                opacity: 1,
                                                transform: 'translate3d(0px, 0px, 0px)',
                                                width: '1620px',
                                            }}


                                        >
                                            <div
                                                data-index="0"
                                                class="slick-slide slick-active slick-current"
                                                tabindex="-1"
                                                aria-hidden="false"
                                                style={{ outline: 'none' }}
                                            >
                                                <div>
                                                    <div style={{ width: '540px' }}>
                                                        <div class="review-section">
                                                            <img
                                                                class="image"
                                                                src={store.image}
                                                                alt={store.image}
                                                            />
                                                            <div class="shipper-name" style={{ margin: '0' }}>{store.name}</div>
                                                            <div class="shopee-rating-stars product-rating-overview__stars" style={{ margin: '0' }}>
                                                                <div className="shopee-rating-stars__stars">
                                                                    {renderStars(store.ratingsAverage)}
                                                                </div>
                                                            </div>
                                                            <div >
                                                                <select defaultValue="" className="custom-select" name='number' value={formData.number} onChange={handleChange}>
                                                                    <option value="" selected="selected" disabled>{t("ratingInput1")}</option>
                                                                    <option value={1}>1 {t("star")}</option>
                                                                    <option value={2}>2 {t("stars")}</option>
                                                                    <option value={3}>3 {t("stars")}</option>
                                                                    <option value={4}>4 {t("stars")}</option>
                                                                    <option value={5}>5 {t("stars")}</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="block-comment">
                                                            <textarea
                                                                name="content"
                                                                id=""
                                                                placeholder={t("ratingInput2")}
                                                                maxlength="300"
                                                                value={formData.content} onChange={handleChange}
                                                            ></textarea>
                                                            <div class="upload-image">
                                                                <div style={{ display: 'flex' }}>
                                                                    {/* Hiển thị các ảnh đã chọn */}
                                                                    {formData.images && formData.images.map((image, index) => (
                                                                        <div key={index} style={{ position: 'relative' }}>
                                                                            {image instanceof File ? (
                                                                                <img
                                                                                    src={URL.createObjectURL(image)}
                                                                                    alt={`selected-${index}`}
                                                                                    style={{ width: '60px', height: '60px', margin: '10px' }}
                                                                                />
                                                                            ) : (
                                                                                <img
                                                                                    src={image} // Đặt nguồn ảnh trực tiếp nếu không phải là đối tượng File
                                                                                    alt={`selected-${index}`}
                                                                                    style={{ width: '60px', height: '60px', margin: '10px' }}
                                                                                />
                                                                            )}
                                                                            <span class="btn-delete-tag" style={{ top: '5px', right: '5px' }}
                                                                                onClick={() => {
                                                                                    const newImages = [...formData.images];
                                                                                    const [deletedImage] = newImages.splice(index, 1);
                                                                                    if (!(deletedImage instanceof File)) {

                                                                                        setDels(prevDels => [...(prevDels || []), deletedImage.toString()]);
                                                                                    }

                                                                                    setFormData({ ...formData, images: newImages });
                                                                                }}>x</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div class="item-upload btn-up" style={{ marginTop: '10px' }}>
                                                                    <label
                                                                    ><span class="fa-solid fa-upload" style={{ fontSize: '60px', cursor: 'pointer', marginLeft: '10px' }}></span>
                                                                        <input
                                                                            type="file"
                                                                            multiple=""
                                                                            name="images"
                                                                            accept="image/*"
                                                                            style={{ visibility: 'hidden' }}
                                                                            onChange={handleChangeImg}
                                                                        />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div></div>
                                                        </div>
                                                        <div class="submit-section">
                                                            <button type="button" disabled="" class="btn btn-submit" onClick={handleSubmit}>{t("ratingInput3")}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-backdrop fade under-modal"></div>
                </Modal.Body>
            </Modal>
            {openNotify && (<Notify message={notify} setOpenNotify={setOpenNotify} handleClose={handleCloseNotify} />)}
            {isLoading && (<LoadingModal />)}
        </div>

    )
}
export default RatingStore
import React, { useState } from "react";
import ZoomImage from "./zoomImage";
import moment from "moment";
import DeleteConfirmationModal from "../Modal/deleteDanger";
import UpdateRatingModal from "../Modal/updateRating";
const CommentItem = ({ like, rating, renderStars, idUser, ratings, setRatings, store, product, shipper }) => {
    const [visible, setVisible] = useState(false)
    const [link, setLink] = useState(false)
    const formattedCreateTime = moment.utc(rating.createdAt).format('DD/MM/YYYY HH:mm');
    const handleZoom = (link) => {
        setLink(link);
        setVisible(true);
    }

    // const [liked, setLiked] = useState(false);
    // const [likeCount, setLikeCount] = useState(like);

    // const handleLikeClick = () => {
    //     if (liked) {
    //         setLiked(false);
    //         setLikeCount(likeCount - 1);
    //     } else {
    //         setLiked(true);
    //         setLikeCount(likeCount + 1);
    //     }
    // };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleShowDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true)
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };


    return (
        <div>
            <div class="shopee-product-rating">
                <div class="shopee-product-rating__avatar" >
                    <div class="shopee-avatar">
                        <img
                            class="shopee-avatar__img"
                            alt="a"
                            src={rating.user.photo}
                        />
                    </div>
                </div>
                <div class="shopee-product-rating__main">
                    <div
                        class="shopee-product-rating__author-name"
                    >{rating.user.firstName} {rating.user.lastName}</div>
                    <div class="repeat-purchase-con">
                        {renderStars(rating.number)}
                    </div>
                    <div class="shopee-product-rating__time">
                        {formattedCreateTime} |
                    </div>
                    <div
                        style={{
                            textAlign: 'justify',
                            width: '90%',
                            position: 'relative',
                            boxSizing: 'border-box',
                            margin: '15px 0px',
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: 'rgba(0, 0, 0, 0.87)',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                        }}

                    >
                        {rating.content}

                    </div>
                    <div class="shopee-product-rating__image-list-wrapper">
                        <div class="rating-media-list">
                            <div class="rating-media-list__container">
                                {rating.images.map((image) => (
                                    <div
                                        class="rating-media-list__image-wrapper rating-media-list__image-wrapper--inactive"
                                        onClick={() => handleZoom(image)}
                                    >
                                        <div class="shopee-rating-media-list-image__wrapper">
                                            <div
                                                class="shopee-rating-media-list-image__content"
                                                style={{ backgroundImage: `url(${image})`, }}
                                            >
                                                <div
                                                    class="shopee-rating-media-list-image__content--blur"
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {visible && (<ZoomImage link={link} />)}
                        </div>
                    </div>
                    <div className="shopee-product-rating__actions" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex' }}>
                            {/* <div
                                className={`shopee-product-rating__like-button ${liked ? 'shopee-product-rating__like-button--liked' : ''}`}
                                onClick={handleLikeClick}
                            >
                                <svg
                                    width="14px"
                                    height="13px"
                                    viewBox="0 0 14 13"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0,12.7272727 L2.54545455,12.7272727 L2.54545455,5.09090909 L0,5.09090909 L0,12.7272727 Z M14,5.72727273 C14,5.02727273 13.4272727,4.45454545 12.7272727,4.45454545 L8.71818182,4.45454545 L9.35454545,1.52727273 L9.35454545,1.33636364 C9.35454545,1.08181818 9.22727273,0.827272727 9.1,0.636363636 L8.4,0 L4.2,4.2 C3.94545455,4.39090909 3.81818182,4.70909091 3.81818182,5.09090909 L3.81818182,11.4545455 C3.81818182,12.1545455 4.39090909,12.7272727 5.09090909,12.7272727 L10.8181818,12.7272727 C11.3272727,12.7272727 11.7727273,12.4090909 11.9636364,11.9636364 L13.8727273,7.44545455 C13.9363636,7.31818182 13.9363636,7.12727273 13.9363636,7 L13.9363636,5.72727273 L14,5.72727273 C14,5.79090909 14,5.72727273 14,5.72727273 Z"
                                    ></path>
                                </svg>
                            </div>
                            <div className="shopee-product-rating__like-count">
                                {likeCount}
                            </div> */}
                            {((rating.user._id === null && idUser === rating.user) || (idUser === rating.user._id)) && (
                                <div style={{ display: 'flex'}}>
                                    <button onClick={handleShowModal}><i class="fa-regular fa-pen-to-square" style={{ fontSize: '20px', color: '#cf2127', marginLeft: '20px' }}></i></button>
                                    <button onClick={handleShowDeleteModal}><i class="fa-regular fa-trash-can" style={{ fontSize: '20px', color: '#cf2127', marginLeft: '20px' }}></i></button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            <DeleteConfirmationModal show={showDeleteModal} handleClose={handleCloseDeleteModal} id={rating._id} action='rating' data={ratings} setData={setRatings}/>
            <UpdateRatingModal show={showModal} handleClose={handleCloseModal} {...(store !== null ? { store } : (product !== null ? { product } : {shipper}))} rating={rating} ratings={ratings} setRatings={setRatings}/>
        </div>
    )
}

export default CommentItem
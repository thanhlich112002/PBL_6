import React from "react";

const ZoomImage = ({ link }) => {
    return (
        <div>

            <div className="rating-media-list__zoomed-image rating-media-list__zoomed-image--active">
                <div className="rating-media-list-image-carousel" style={{ transition: 'all 0ms ease 0s' }}>
                    <div className="rating-media-list-image-carousel__item-list-wrapper">
                        <ul className="rating-media-list-image-carousel__item-list" style={{ marginTop: '0px', transform: 'translateX(0px)', transition: 'all 0ms ease 0s' }}>
                            <li className="rating-media-list-image-carousel__item rating-media-list-image-carousel__item--fluid" style={{ padding: '0px 0.625rem' }}>
                                <img
                                    src={link}
                                    alt="rating"
                                    className="rating-media-list__zoomed-image-item"
                                />
                            </li>
                        </ul>
                    </div>
                    <div className="rating-media-list-carousel-arrow rating-media-list-carousel-arrow--prev rating-media-list-carousel-arrow--hint rating-media-list-carousel-arrow--hidden" role="button" tabIndex="0" style={{ opacity: 1, visibility: 'hidden', transform: 'translateX(calc(-50% + 0px))' }}>
                        <svg
                            enableBackground="new 0 0 13 20"
                            viewBox="0 0 13 20"
                            x="0"
                            y="0"
                            className="shopee-svg-icon icon-arrow-left-bold"
                        >
                            <polygon points="4.2 10 12.1 2.1 10 -.1 1 8.9 -.1 10 1 11 10 20 12.1 17.9"></polygon>
                        </svg>
                    </div>
                    <div className="rating-media-list-carousel-arrow rating-media-list-carousel-arrow--next rating-media-list-carousel-arrow--hint rating-media-list-carousel-arrow--hidden" role="button" tabIndex="0" style={{ opacity: 1, visibility: 'hidden', transform: 'translateX(calc(50% - 0px))' }}>
                        <svg
                            enableBackground="new 0 0 13 21"
                            viewBox="0 0 13 21"
                            x="0"
                            y="0"
                            className="shopee-svg-icon icon-arrow-right-bold"
                        >
                            <polygon points="11.1 9.9 2.1 .9 -.1 3.1 7.9 11 -.1 18.9 2.1 21 11.1 12 12.1 11"></polygon>
                        </svg>
                    </div>
                </div>
            </div>
            {/* <div
                class="rating-media-list__zoomed-image rating-media-list__zoomed-image--active"
            >
                <div className="rating-media-list-image-carousel" style={{ transition: 'all 500ms ease 0s', width: '536px' }}>
                    <div className="rating-media-list-image-carousel__item-list-wrapper">
                        <ul
                            className="rating-media-list-image-carousel__item-list"
                            style={{
                                marginTop: '0px',
                                transform: 'translateX(-536px)',
                                transition: 'all 500ms ease 0s'
                            }}
                        >
                            <li className="rating-media-list-image-carousel__item rating-media-list-image-carousel__item--fluid" style={{ padding: '0px 0.625rem' }}>
                                <div className="yc2MHR">
                                    <video
                                        src="https://play-aka.vod.shopee.com/api/v4/11110103/mms/vn-11110103-6jrnl-lk4x4dnyv0l045.16000051691388268.mp4"
                                        controls
                                        className="k9wD+V rating-media-list__zoomed-video-item"
                                        controlsList="nodownload"
                                    ></video>
                                    <svg enableBackground="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0" className="shopee-svg-icon yOoPZ7">
                                        <g opacity=".54">
                                            <g>
                                                <circle cx="7.5" cy="7.5" fill="#040000" r="7.3"></circle>
                                                <path d="m7.5.5c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7m0-.5c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5-3.4-7.5-7.5-7.5z" fill="#ffffff"></path>
                                            </g>
                                        </g>
                                        <path d="m6.1 5.1c0-.2.1-.3.3-.2l3.3 2.3c.2.1.2.3 0 .4l-3.3 2.4c-.2.1-.3.1-.3-.2z" fill="#ffffff"></path>
                                    </svg>
                                </div>
                            </li>
                            <li className="rating-media-list-image-carousel__item rating-media-list-image-carousel__item--fluid" style={{ padding: '0px 0.625rem' }}>
                                <img
                                    src="https://down-bs-vn.img.susercontent.com/vn-11134103-7qukw-lk4x48wrtjb6ed.webp"
                                    alt="rating"
                                    className="rating-media-list__zoomed-image-item"
                                />
                            </li>
                            <li className="rating-media-list-image-carousel__item rating-media-list-image-carousel__item--fluid" style={{ padding: '0px 0.625rem' }}>
                                <img
                                    src="https://down-bs-vn.img.susercontent.com/vn-11134103-7qukw-lk4x48ws8zk2fb.webp"
                                    alt="rating"
                                    className="rating-media-list__zoomed-image-item"
                                />
                            </li>
                            <li className="rating-media-list-image-carousel__item rating-media-list-image-carousel__item--fluid" style={{ padding: '0px 0.625rem' }}>
                                <img
                                    src="https://down-bs-vn.img.susercontent.com/vn-11134103-7qukw-lk4x48wruxvme0.webp"
                                    alt="rating"
                                    className="rating-media-list__zoomed-image-item"
                                />
                            </li>
                        </ul>
                    </div>
                    <div className="rating-media-list-carousel-arrow rating-media-list-carousel-arrow--prev" role="button" tabIndex="0" style={{ opacity: 1, visibility: 'visible', transform: 'translateX(calc(-50% + 0px))' }}>
                        <svg enableBackground="new 0 0 13 20" viewBox="0 0 13 20" x="0" y="0" className="shopee-svg-icon icon-arrow-left-bold">
                            <polygon points="4.2 10 12.1 2.1 10 -.1 1 8.9 -.1 10 1 11 10 20 12.1 17.9"></polygon>
                        </svg>
                    </div>
                    <div className="rating-media-list-carousel-arrow rating-media-list-carousel-arrow--next" role="button" tabIndex="0" style={{ opacity: 1, visibility: 'visible', transform: 'translateX(calc(50% - 0px))' }}>
                        <svg enableBackground="new 0 0 13 21" viewBox="0 0 13 21" x="0" y="0" className="shopee-svg-icon icon-arrow-right-bold">
                            <polygon points="11.1 9.9 2.1 .9 -.1 3.1 7.9 11 -.1 18.9 2.1 21 11.1 12 12.1 11"></polygon>
                        </svg>
                    </div>
                </div>
            </div> */}
        </div>

    )
}

export default ZoomImage
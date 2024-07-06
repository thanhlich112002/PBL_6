import React, { useState, useEffect } from "react";
import '../../assets/css/pcmall.css'
import CommentItem from "../Item/commentItem";
import { useTranslation } from "react-i18next";

const Comment = ({ store, ratings, idUser, setRatings, product, shipper }) => {
    const {t} = useTranslation();
    const [tempRatings, setTempRatings] = useState({});
    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, index) => {
            const percentFilled = Math.min(100, Math.max(0, rating - index) * 100);
            const isHalfFilled = percentFilled > 0 && percentFilled < 100;

            return (
                <div className="shopee-rating-stars__star-wrapper" key={index}>
                    <div className="shopee-rating-stars__lit" style={{ width: `${isHalfFilled ? percentFilled : percentFilled}%`, color: '#ee4d2d' }}>
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
    const [activeFilter, setActiveFilter] = useState('Tất cả');

    const handleFilterClick = async (filter) => {
        setActiveFilter(filter);
        let filteredRatings;
        switch (filter) {
            case 'Tất Cả':
                filteredRatings = { ...ratings };
                break;
            case '1 Sao':
            case '2 Sao':
            case '3 Sao':
            case '4 Sao':
            case '5 Sao':
                filteredRatings = Object.fromEntries(
                    Object.entries(ratings).filter(([key, value]) => value.number === parseInt(filter[0]))
                );
                break;
            case 'Có bình luận':
                filteredRatings = Object.fromEntries(
                    Object.entries(ratings).filter(([key, value]) => value.content && value.content.length > 0)
                );
                break;
            case 'Có hình ảnh':
                filteredRatings = Object.fromEntries(
                    Object.entries(ratings).filter(([key, value]) => value.images && value.images.length > 0)
                );
                break;
            default:
                filteredRatings = { ...ratings };
                break;
        }
        setTempRatings(filteredRatings) 
    };
    useEffect(() => {
        handleFilterClick(activeFilter)
    }, [ratings]);

    const [page, setPage] = useState(1);

    const handlePageClick = (action) => {
        if (action === 'prev' && page > 1) {
            setPage(page - 1);
        } else if (action === 'next' && page < 5) {
            setPage(page + 1);
        }
    };

    return (
        <div>
            <div style={{ display: 'contents' }}>
                <div class="product-ratings" data-nosnippet="true">
                    <div class="product-ratings__header">
                    </div>
                    <div class="product-rating-overview">
                        <div class="product-rating-overview__briefing">
                            <div class="product-rating-overview__score-wrapper">
                                <span class="product-rating-overview__rating-score">
                                    {store ? store.ratingsAverage : (product ? product.ratingsAverage : shipper.ratingsAverage)}
                                </span>
                                <span class="product-rating-overview__rating-score-out-of">
                                    / 5
                                </span>
                            </div>
                            <div class="shopee-rating-stars product-rating-overview__stars">
                                <div className="shopee-rating-stars__stars">
                                    {renderStars(store ? store.ratingsAverage : (product ? product.ratingsAverage : shipper.ratingsAverage))}
                                </div>
                            </div>
                        </div>
                        <div className="product-rating-overview__filters">
                            <div
                                className={`product-rating-overview__filter ${activeFilter === 'Tất cả' ? 'product-rating-overview__filter--active' : ''}`}
                                onClick={() => handleFilterClick('Tất cả')}
                            >
                                {t("all")}
                            </div>
                            <div
                                className={`product-rating-overview__filter ${activeFilter === '5 Sao' ? 'product-rating-overview__filter--active' : ''}`}
                                onClick={() => handleFilterClick('5 Sao')}
                            >5 {t("stars")}</div>
                            <div
                                className={`product-rating-overview__filter ${activeFilter === '4 Sao' ? 'product-rating-overview__filter--active' : ''}`}
                                onClick={() => handleFilterClick('4 Sao')}
                            >4 {t("stars")}</div>
                            <div
                                className={`product-rating-overview__filter ${activeFilter === '3 Sao' ? 'product-rating-overview__filter--active' : ''}`}
                                onClick={() => handleFilterClick('3 Sao')}
                            >3 {t("stars")}</div>
                            <div
                                className={`product-rating-overview__filter ${activeFilter === '2 Sao' ? 'product-rating-overview__filter--active' : ''}`}
                                onClick={() => handleFilterClick('2 Sao')}
                            >2 {t("stars")}</div>
                            <div
                                className={`product-rating-overview__filter ${activeFilter === '1 Sao' ? 'product-rating-overview__filter--active' : ''}`}
                                onClick={() => handleFilterClick('1 Sao')}
                            >1 {t("star")}</div>
                            <div
                                className={`product-rating-overview__filter ${activeFilter === 'Có bình luận' ? 'product-rating-overview__filter--active' : ''}`}
                                onClick={() => handleFilterClick('Có bình luận')}
                            >{t("comments")}</div>
                            <div
                                className={`product-rating-overview__filter ${activeFilter === 'Có hình ảnh' ? 'product-rating-overview__filter--active' : ''}`}
                                onClick={() => handleFilterClick('Có hình ảnh')}
                            >{t("images")}</div>
                        </div>
                    </div>
                    <div class="product-ratings__list" style={{ opacity: '1' }}>
                        <div class="shopee-product-comment-list">
                            {Object.values(tempRatings).map((rating) => (
                                <CommentItem
                                    // like={6}
                                    rating={rating}
                                    renderStars={renderStars}
                                    idUser={idUser}
                                    ratings={ratings}
                                    setRatings={setRatings}
                                    store={store ? store : null}
                                    product={product ? product : null}
                                    shipper={shipper ? shipper : null}
                                />
                            ))}
                        </div>
                        {/* <ul class="pagination">
                            <li class="" onClick={() => handlePageClick('prev')}>
                                <button class="no_hover"><i class="fa-solid fa-circle-chevron-left" style={{ color: 'red', fontSize: '18px', verticalAlign: 'middle' }}></i></button>
                            </li>
                            <li className={`${page === 1 ? 'active' : ''}`}
                                onClick={() => setPage(1)}><button class="" >1</button></li>
                            <li className={`${page === 2 ? 'active' : ''}`}
                                onClick={() => setPage(2)}><button class="" >2</button></li>
                            <li className={`${page === 3 ? 'active' : ''}`}
                                onClick={() => setPage(3)}><button class="" >3</button></li>
                            <li className={`${page === 4 ? 'active' : ''}`}
                                onClick={() => setPage(4)}><button class="" >4</button></li>
                            <li className={`${page === 5 ? 'active' : ''}`}
                                onClick={() => setPage(5)}><button class="" >5</button></li>
                            <li class="" onClick={() => handlePageClick('next')}>
                                <button class="no_hover"><i class="fa-solid fa-circle-chevron-right " style={{ color: 'red', fontSize: '18px', verticalAlign: 'middle' }}></i></button>
                            </li>
                        </ul> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comment
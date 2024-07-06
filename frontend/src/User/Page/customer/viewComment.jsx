import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getRatingOfStore, getStoreById } from "../../services/userServices";
import { useTranslation } from "react-i18next"
import Comment from "../../Components/Modal/comment";
import LoadingModal from "../../Components/Loading/Loading";
const ViewComment = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const storeId = location.state.store.store._id;
    const isWithinOperatingHours = location.state.isWithinOperatingHours;
    const [ratings, setRatings] = useState([])
    const [idUser, setIdUser] = useState('')
    const [store, setStore] = useState({
        name: '',
        image:'',
    });
    const [ratingsAverage, setRatingsAverage] = useState(0)
    useEffect(() => {
        const user = localStorage.getItem("user");
        const userData = JSON.parse(user);
        
        if(userData) {
            setIdUser(userData._id)
        }
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const data = await getRatingOfStore(storeId)
                const storeData = await getStoreById(storeId)
                setStore({...storeData.data})
                setRatings({ ...data.data })
            } catch (error) {
                console.error("Lỗi khi lấy thông tin đánh giá:", error);
            }
            setIsLoading(false)
        }
        fetchData();
    }, []);
    
    return (
        <div>
            <div class="wrapper">
                <div class="now-detail-restaurant clearfix" style={{ width: '80%', marginLeft: '10%', height: '310px' }}>
                    <div class="container">
                        <div class="detail-restaurant-img">
                            <img
                                // src="https://images.foody.vn/res/g119/1184583/prof/s640x400/foody-upload-api-foody-mobile-37-80aba800-230914093440.jpeg"
                                src={store.image}
                                alt={store.name}
                                class=""
                                style={{ height: '250px', width: '100%', marginLeft: '8%' }}
                            />
                        </div>
                        <div class="detail-restaurant-info">

                            <div class="kind-restaurant"><span> {t("store")}</span></div>
                            <h1 class="name-restaurant">
                                {store.name}
                            </h1>
                            <div class="address-restaurant">
                                {store.address}
                            </div>
                            <div class="rating">
                                <span class="number-rating">{store.ratingsAverage}</span>
                                <div class="stars">
                                    <span class=""><i class="fas fa-solid fa-star"></i></span>
                                </div>
                                <span style={{ color: '#ee4d2d' }}>{t("ratingInFALTH")}</span>
                            </div>
                            <div class="view-more-rating">
                                <span
                                    rel="noopener noreferrer nofollow"
                                    target="_blank"
                                    class="number-review"
                                >{store.description}</span>
                            </div>
                            <div class="status-restaurant">
                                <div class="opentime-status">
                                <span
                            className={`stt ${isWithinOperatingHours ? 'online' : 'offline'}`}
                            title={isWithinOperatingHours ? `${t("storeActive")}`: `${t("storeClose")}`}
                        ></span>
                                </div>
                                <div class="time"><i class="far fa-clock"></i>{store.openAt} - {store.closeAt}</div>
                            </div>

                            <div class="share-social clearfix">
                                <div class="share-social-box">
                                    <div
                                        class="fb-like"
                                        data-layout="button"
                                        data-action="like"
                                        data-size="small"
                                        data-show-faces="false"
                                        data-share="true"
                                        data-colorscheme="light"
                                        data-kid-directed-site="false"
                                    ></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="container relative clearfix">
                    <div class="now-menu-restaurant" style={{ width: '100%' }}>
                        <div class="menu-restaurant-tab">
                            <div class="item active" style={{ fontSize: '20px' }}>Đánh giá cửa hàng</div>
                        </div>
                        <div class="menu-restaurant-content-tab">
                            <div class="menu-restaurant-container">
                                <div class="menu-restaurant-detail" style={{ width: '100%' }}>

                                    <Comment store={store} ratings={ratings} idUser={idUser} setRatings={setRatings}/>

                                </div>

                            </div>
                        </div>

                    </div>

                </div>

            </div>
            {isLoading && (<LoadingModal />)}
        </div>
    )
}

export default ViewComment
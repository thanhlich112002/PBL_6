import React, { useState, useEffect, useContext } from "react";
import CartModal from "../../Components/Modal/cart";
import { useLocation } from "react-router-dom";
import { getAllCategoryByStoreId, getVoucherByStoreId } from "../../services/userServices";
import { useTranslation } from "react-i18next";
import MenuGroup from "../../Components/Item/menuGroup";
import { Link, Element } from "react-scroll";
import Skeleton from "../../Components/Skeleton/skeleton";
import { useNavigate } from "react-router-dom";
import ChatBox from "../../Components/Item/chatBox";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
const StoreDetail = () => {
    const { data, createChat, currentUser } = useContext(ChatContext);
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const [searchKey, setSearchKey] = useState('')
    const store = location.state.store.store;
    const [isWithinOperatingHours, setIsWithinOperatingHours] = useState(false);
    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    useEffect(() => {
        const currentTime = new Date();
        const openTime = new Date(currentTime);
        const closeTime = new Date(currentTime);
        openTime.setHours(Number(store.openAt.split(':')[0]), Number(store.openAt.split(':')[1]), 0, 0);
        closeTime.setHours(Number(store.closeAt.split(':')[0]), Number(store.closeAt.split(':')[1]), 0, 0);

        setIsWithinOperatingHours(currentTime >= openTime && currentTime <= closeTime);
    }, [store.openAt, store.closeAt]);
    useEffect(() => {

        const fetchData = async () => {
            try {
                setIsLoading(true)
                const data = await getAllCategoryByStoreId(store._id)
                setCategories(data.data)

            } catch (error) {
                console.error("Lỗi khi lấy thông tin quán ăn:", error);
            }
            setIsLoading(false)
        }
        const getVoucher = async () => {
            try {
                const response = await getVoucherByStoreId(store._id);
                console.log(response.data)
                setDiscounts(response.data)
            } catch (error) {
                console.log("Lỗi khi lấy thông tin voucher", error)
            }
        }
        getVoucher();
        createChat(store.ownerId)
        fetchData();
    }, [store]);

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [discounts, setDiscounts] = useState([])
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            setIsLoggedIn(true)
        }
    }, []);

    const [activeCategory, setActiveCategory] = useState('');

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
    };
    const handleComment = () => {
        navigate("/home/storeComment", { state: { store: { store }, isWithinOperatingHours: isWithinOperatingHours } });
    }

    const [selectedDiscount, setSelectedDiscount] = useState("");
    const handleSelectDiscount = (id) => {
        setSelectedDiscount(id)
    }
    return (
        <div>
            <div class="wrapper">
                <div class="now-detail-restaurant clearfix" style={{ width: '80%', marginLeft: '10%', height: '310px' }}>
                    <div class="container">
                        <div class="detail-restaurant-img">
                            <img
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
                            <div class="rating" style={{ cursor: 'pointer' }} onClick={handleComment}>
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
                                        title={isWithinOperatingHours ? `${t("storeActive")}` : `${t("storeClose")}`}></span>
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
                    <div class="now-menu-restaurant">
                        <div class="menu-restaurant-tab">
                            <div class="item active">{t("menu")}</div>
                        </div>
                        <div class="menu-restaurant-content-tab">
                            <div class="menu-restaurant-container">
                                <div class="menu-restaurant-category">
                                    <div class="list-category" id="scroll-spy">
                                        <div class="scrollbar-container ps">
                                            {isLoading && Array(3).fill(0).map((item, index) => (
                                                <div className="item" key={index} style={{ height: '30px', width: '100px' }}>
                                                    <Skeleton />
                                                </div>
                                            ))}
                                            {categories.map((category) => (
                                                <Link to={category.catName} spy={true} smooth={true} duration={500} offset={-150}>

                                                    <div className="item" key={category._id}>
                                                        <span
                                                            id={`category-link-${category._id}`}
                                                            title={category.catName}
                                                            className={`item-link ${category._id === activeCategory ? 'active' : ''
                                                                }`}
                                                            onClick={() => handleCategoryClick(category._id)}
                                                        >
                                                            {category.catName}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div class="menu-restaurant-detail">
                                {discounts.length > 0 && (
                                    <div class="promotions-order">
                                        {discounts.map((discount) => (
                                            <div id="promotion-item" class="promotion-item">
                                                <div>
                                                    <img
                                                        src="https://images.foody.vn/icon/discount/s/shopeefood_voucher_14.png"
                                                        alt=""
                                                        class="icon-promotion"
                                                    />
                                                    <div class= 'content' style={{fontSize:'14px'}}>
                                                        {discount.name}
                                                    </div>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    )}
                                    <div class="menu-restaurant-list">
                                        <div class="search-items">
                                            <p class="input-group">
                                                <i class="fas fa-search" style={{ cursor: 'pointer' }} ></i>
                                                <input
                                                    type="search"
                                                    name="searchKey"
                                                    placeholder={t("searchDish")}
                                                    value={searchKey}
                                                    onChange={(e) => setSearchKey(e.target.value)}
                                                />
                                            </p>
                                        </div>
                                        <div id="restaurant-item">
                                            <div
                                                aria-label="grid"
                                                aria-readonly="true"
                                                class="ReactVirtualized__Grid ReactVirtualized__List"
                                                role="grid"
                                                tabindex="0"
                                                style={{
                                                    boxSizing: 'border-box',
                                                    direction: 'ltr',
                                                    height: 'auto',
                                                    position: 'relative',
                                                    width: '558px',
                                                    willChange: 'transform',
                                                    overflow: 'auto',
                                                    outline: 'none',
                                                }}
                                            >
                                                <div
                                                    class="ReactVirtualized__Grid__innerScrollContainer"
                                                    role="rowgroup"
                                                    style={{
                                                        width: 'auto',
                                                        height: '2719px',
                                                        maxWidth: '558px',
                                                        maxHeight: '2719px',
                                                        overflow: 'hidden',
                                                        position: 'relative',
                                                    }}
                                                >

                                                    {categories.map((category) => (
                                                        <Element name={category.catName} className="element">

                                                            <MenuGroup
                                                                category={category}
                                                                openModal={openModal}
                                                                store={store}
                                                                search={searchKey}
                                                                isWithinOperatingHours={isWithinOperatingHours}
                                                            />
                                                        </Element>
                                                    ))}

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>
                    {isLoggedIn && (<ChatBox store={store} isWithinOperatingHours={isWithinOperatingHours} currentUser={currentUser} createChat={createChat} data={data} />)}

                </div>

            </div>
            {
                showModal && (
                    <CartModal show={showModal} handleClose={closeModal} handleOpen={openModal} />
                )
            }
        </div >
    )
}

export default StoreDetail
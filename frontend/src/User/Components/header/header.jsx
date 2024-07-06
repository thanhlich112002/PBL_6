import React, { useState, useEffect } from 'react';
import '../../assets/css/header.css'
import { getStoreById, checkStoreOpen } from '../../services/userServices';
import logo from '../../assets/img/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import CartModal from '../Modal/cart';
import { useAuth, useLogout } from '../../services/authContext';
import { useCity } from '../../services/CityContext';
import { useLang } from '../../services/languageContext';
import { useTranslation } from "react-i18next";

const Header = () => {
    const { t } = useTranslation();
    const { isLoggedIn, setIsLoggedIn, userName, setUserName, img, setImg } = useAuth()
    const { selectedLocation, updateLocation, key, updateKey, cart, setCart, productsCount, setProductsCount, selectSearch, setSelectSearch } = useCity();
    const { selectedLang, updateLang } = useLang();
    const [isDropdownLocationOpen, setDropdownLocationOpen] = useState(false);
    const [isDropdownInfoOpen, setDropdownInfoOpen] = useState(false);
    const [isDropdownLangOpen, setDropdownLangOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('icon icon-lag-vn');
    const url = "https://falth-api.vercel.app";
    const [searchResults, setSearchResults] = useState([])

    const toggleDropdownLocation = () => {
        setDropdownLocationOpen(!isDropdownLocationOpen);
    };
    const toggleDropdownInfo = () => {
        setDropdownInfoOpen(!isDropdownInfoOpen);
    };
    const toggleDropdownLang = () => {
        setDropdownLangOpen(!isDropdownLangOpen);
    };

    const [showModal, setShowModal] = useState(false);


    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const navigate = useNavigate();

    const handleNav = ({ nav }) => {
        navigate(`/${nav}`);
    };
    const goHome = () => {
        navigate("/")
    }

    const logout = useLogout();
    function handleLogout() {
        logout();
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // setIsLoggedIn(false)
        navigate("/")
    }

    const cities = ['Hà Nội', 'Hồ Chí Minh', 'Hải Phòng', 'Cần Thơ', 'Đà Nẵng', 'Bắc Ninh', 'Bắc Giang', 'Hà Tĩnh', 'Thái Bình', 'Nam Định', 'Ninh Bình', 'Lào Cai', 'Sơn La', 'Lai Châu', 'Điện Biên', 'Lạng Sơn', 'Bắc Kạn', 'Lâm Đồng', 'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 'An Giang', 'Bạc Liêu', 'Bến Tre', 'Bình Định', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Hà Nam', 'Hà Giang', 'Hà Tây', 'Hà Đông', 'Hà Nội', 'Hải Dương', 'Hải Phòng', 'Hà Tĩnh', 'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên-Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái']
    const handleLocationSelect = (location) => {
        updateLocation(location);
        setDropdownLocationOpen(false)
    }

    const handleSelectLanguage = (iconName, lng) => {
        updateLang(lng)
        setSelectedLanguage(iconName);
        setDropdownLangOpen(false)
    };

    const [tempKey, setTempKey] = useState('');
    const handleSearch = () => {
        updateKey(tempKey)
        setTempKey('')
    };

    const handleInputChange = (event) => {
        setTempKey(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        if (tempKey === "") {
            setSearchResults([])
        } else {
            let api
            if (selectSearch === "store") {
                api = `${url}/api/store?city=${selectedLocation}&isLocked=false&search=${tempKey}&limit=100`
            } else if (selectSearch === "product") {
                api = `${url}/api/product/search?city=${selectedLocation}&search=${tempKey}&limit=100`
            }
            fetch(api)
                .then((response) => response.json())
                .then((data) => {
                    let uniqueResults
                    if (selectSearch === "store") {
                        uniqueResults = data.data
                    } else if (selectSearch === "product") {
                        uniqueResults = data.data
                        //     .filter((item, index, self) =>
                        //   index === self.findIndex((i) => i.store.name === item.store.name));
                    }
                    // Update the state with unique results
                    console.log(api)
                    console.log(uniqueResults)
                    setSearchResults(uniqueResults);
                })
                .catch((error) => {
                    console.error('Lỗi khi gọi API', error);
                });
        }
    }, [selectedLocation, tempKey, selectSearch]);


    useEffect(() => {

        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    setIsLoggedIn(true)
                    const savedUser = localStorage.getItem('user');
                    if (savedUser) {
                        const user = (JSON.parse(savedUser));
                        setUserName(`${user.lastName} ${user.firstName}`)
                        setImg(user.photo)
                    }
                } else {
                    console.error("Token không tồn tại trong local storage");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        }
        fetchData();
    },);

    useEffect(() => {
        const updateCartCount = () => {
            const cartdata = JSON.parse(localStorage.getItem('cart'));
            if (cartdata && cartdata.products) {
                const count = cartdata.products.length;
                setProductsCount(count);
                setCart({
                    ...cart,
                    idStore: cartdata.idStore,
                    nameStore: cartdata.nameStore,
                    products: cartdata.products
                });
            }
        }

        updateCartCount(); // Cập nhật ban đầu
        window.addEventListener('cartUpdated', updateCartCount);

        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
        }
    }, []);

    const handleStore = async (id) => {
        const response = await getStoreById(id)
        const store = response.data
        navigate("/home/storeDetail", { state: { store: { store } } });

    };

    const handleSelectSearch = (e) => {
        setSelectSearch(e.target.value)
        console.log(selectSearch)
    }

    return (
        <div>
            <header class="main-header">
                <div class="container-header">
                    <div class="container">
                        <div class="header-content navbar row justify-content-between align-items-center">
                            <div class="logo-now col-auto">
                                <span onClick={goHome}><img
                                    style={{ width: '100px', height: '50px', backgroundColor: 'white', borderRadius: '5px' }}
                                    src={logo}
                                    alt="FALTH"
                                /></span>
                            </div>
                            <div class="select-local col-auto">
                                <div class="dropdown">
                                    <div
                                        class="dropdown-toggle"
                                        role="button"
                                        id="local-dropdown"
                                        data-toggle="dropdown"
                                        tabindex="0"
                                        aria-haspopup="true"
                                        aria-expanded={isDropdownLocationOpen}
                                        onClick={toggleDropdownLocation}
                                    >
                                        {selectedLocation ? selectedLocation : t("headLocation")}
                                    </div>
                                    {isDropdownLocationOpen && (
                                        <div class="dropdown-menu" style={{ height: '200px', overflow: 'auto' }}>
                                            <button onClick={() => handleLocationSelect('')} style={{ width: '100%', textAlign: 'left' }}>
                                                <div class="dropdown-item">
                                                    <span class="name col" >{t("headLocation")}</span>
                                                </div>
                                            </button>
                                            {cities.map((city, index) => (
                                                <button onClick={() => handleLocationSelect(city)} style={{ width: '100%', textAlign: 'left' }}>
                                                    <div class="dropdown-item">
                                                        <span class="name col" >{city}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div class="main-nav col">
                                <div class="header__search">
                                    <select class="header__search-select" onChange={handleSelectSearch}>
                                        <option value="store">{t("store")}</option>
                                        <option value="product">{t("dish")}</option>
                                    </select>
                                    <div class="header__search-input-wrap">
                                        <input
                                            type="text"
                                            class="header__search-input"
                                            placeholder={t("headSearch")}
                                            value={tempKey}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyPress}
                                        ></input>
                                        {searchResults.length > 0 && (
                                            <div class="now-idea-searching">
                                                <div class="now-list-restaurant-row">
                                                    <h3 class="header__search-history-heading">Kết quả tìm kiếm ({searchResults.length})</h3>
                                                    {searchResults.map((result) => ( 

                                                    <div class="item-restaurant" onClick={() => handleStore(`${selectSearch === "store" ? result._id : result.store._id}`)}>
                                                        <div class="item-content" >
                                                        <div class="img-restaurant">
                                                                <img
                                                                    src={selectSearch === "store" ? result.image : (result.images && result.images[0])}
                                                                    alt="Cơm Gà Nam Chợ Mới - Hoàng Diệu"
                                                                    title="Cơm Gà Nam Chợ Mới - Hoàng Diệu"
                                                                />
                                                            </div>
                                                            <div class="info-restaurant">
                                                                <div class="name-res">{result.name}</div>
                                                                {(selectSearch === "product" && result.store) && (
                                                                    <div class="address-res" style={{color:'black'}}>
                                                                    {result.store.name}
                                                                </div>
                                                                )}
                                                                <div class="address-res">
                                                                    {selectSearch === "store" ? result.address : (result.store && result.store.address)}
                                                                </div>
                                                            </div>
                                                            {/* {(selectSearch === "store"  && result.openAt && result.closeAt) && (

                                                                <div class="opentime-status">
                                                                    <span
                                                                        className={`stt ${checkStoreOpen(result.openAt, result.closeAt) ? 'online' : 'offline'}`}
                                                                        title={checkStoreOpen(result.openAt, result.closeAt) ? `${t("storeActive")}`: `${t("storeClose")}`}
                                                                    ></span>
                                                                </div>
                                                            )} */}
                                                            {((selectSearch === "store" && result.openAt && result.closeAt) || (selectSearch === "product" && result && result.store && result.store.openAt && result.store.closeAt)) && (
    <div class="opentime-status">
        <span
            className={`stt ${checkStoreOpen(
                selectSearch === "store" ? result.openAt : result.store.openAt,
                selectSearch === "store" ? result.closeAt : result.store.closeAt
            ) ? 'online' : 'offline'}`}
            title={checkStoreOpen(
                selectSearch === "store" ? result.openAt : result.store.openAt,
                selectSearch === "store" ? result.closeAt : result.store.closeAt
            ) ? `${t("storeActive")}`: `${t("storeClose")}`}
        ></span>
    </div>
)}
                                                        </div>
                                                    </div>
                                                    
                                                    
                                                ))}
                                                </div>
                                            </div>
                                        )}
                                                {/* <ul class="header__search-history-list">
                                                    {searchResults.map((result) => (
                                                        <li class="header__search-history-item" onClick={() => handleStore(`${selectSearch === "store" ? result._id : result.store._id}`)}>
                                                            <button>{result.name}</button>
                                                        </li>
                                                    ))}
                                                </ul> */}              
                                    </div>
                                    <button class="header__search-btn" onClick={handleSearch}>
                                        <i class="header__search-btn-icon fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="language dropdown col-auto"
                                style={{ backgroundColor: "white", padding: '2px 5px', borderRadius: '5px', marginRight: '5px' }}
                                aria-expanded={isDropdownLangOpen}
                                onClick={toggleDropdownLang}>
                                <div className='dropdown'>
                                    <div
                                        class="dropdown-toggle"
                                        role='button'
                                        id="dropdownMenuButton"
                                        data-toggle="dropdown"
                                        tabindex="0"
                                        aria-haspopup="true"
                                        aria-expanded={isDropdownLangOpen}
                                        onClick={toggleDropdownLang}
                                    >
                                        <span class={selectedLanguage}></span>
                                    </div>
                                    {isDropdownLangOpen && (
                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                                            <button onClick={() => handleSelectLanguage('icon icon-lag-vn', 'vi')} style={{ width: '100%', textAlign: 'left' }}>
                                                <div class="dropdown-item">
                                                    <span class="icon icon-lag-vn"></span>
                                                    <span class="language-item">Vietnamese</span>
                                                </div>
                                            </button>
                                            <button onClick={() => handleSelectLanguage('icon icon-lag-en', 'en')} style={{ width: '100%' }}>
                                                <div class="dropdown-item">
                                                    <span class="icon icon-lag-en"></span>
                                                    <span class="language-item">English</span>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div class="user-acc col-auto">
                                {isLoggedIn ? (
                                    <div class="dropdown">
                                        <div
                                            className="dropdown-toggle"
                                            role="button"
                                            id="user-dropdown"
                                            data-toggle="dropdown"
                                            tabIndex="0"
                                            aria-haspopup="true"
                                            aria-expanded={isDropdownInfoOpen}
                                            onClick={toggleDropdownInfo}
                                        >
                                            <div class="img" style={{ width: 'auto' }}>
                                                <img src={img} alt={userName} />
                                            </div>
                                            <span class="name">{userName}</span>
                                        </div>
                                        {isDropdownInfoOpen && (
                                            <div class="dropdown-menu" aria-labelledby="user-dropdown">
                                                <button onClick={() => handleNav({ nav: "user/orderHistory" })} style={{ width: '100%' }}>

                                                    <div class="dropdown-item" >
                                                        <FontAwesomeIcon style={{ paddingRight: '5px' }} icon={faHistory} />{' '}
                                                        <span class="text">{t("headOrderHis")}</span>
                                                    </div>
                                                </button>
                                                <button onClick={() => handleNav({ nav: "user/profile" })} style={{ width: '100%' }}>

                                                    <div class="dropdown-item">
                                                        <FontAwesomeIcon style={{ paddingRight: '5px' }} icon={faUser} />{' '}
                                                        <span class="text">{t("headInfo")}</span>
                                                    </div>
                                                </button>
                                                <button style={{ width: '100%' }}>

                                                    <div class="dropdown-item" onClick={handleLogout} >
                                                        <FontAwesomeIcon style={{ paddingRight: '5px' }} icon={faSignOutAlt} />{' '}
                                                        <span class="text">{t("Logout")}</span>
                                                    </div>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button type="button" class="btn btn-none-bg btn-login" onClick={() => handleNav({ nav: "signin" })}>{t("title_SI")}</button>
                                )}

                            </div>
                            <div class="header__cart">
                                <div class="header__cart-wrap">
                                    <i class="header__cart-icon fas fa-shopping-cart" onClick={openModal}></i>
                                    <span class="header__cart-notice" onClick={openModal}>{productsCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {showModal && (
                <CartModal show={showModal} handleClose={closeModal} handleOpen={openModal} />
            )}
        </div>
    );
};

export default Header;

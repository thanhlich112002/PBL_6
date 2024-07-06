import React, { useState, useEffect } from 'react';
import nocart from '../../assets/img/no_cart.png'
import CartItem from '../Item/cartItem';
import AddDish from './addDish';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../services/authContext';
import { useTranslation } from 'react-i18next';
import { useCity } from '../../services/CityContext';
import { getStoreById, getFeeShip, checkStoreOpen, checkValidCart } from '../../services/userServices';
import LoadingModal from '../Loading/Loading';
import Notify from '../Notify.jsx/Notify';

const CartModal = ({ show, handleClose, handleOpen }) => {
    const { cart, setCart, productsCount, setProductsCount } = useCity();
    const { t } = useTranslation();
    const { isLoggedIn } = useAuth();
    const [total, setTotal] = useState(0); // Số tiền tổng ban đầu là 0
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [openNotify, setOpenNotify] = useState(false)
    const [message, setMessage] = useState("")

    const handleOrder = async (activity) => {
        if (activity === "order") {
            const storeData = await getStoreById(cart.idStore);
            const isOpen = await checkStoreOpen(storeData.data.openAt, storeData.data.closeAt)
            if(!isOpen) {
                setMessage(`${t("cartNotify1")}`)
                setOpenNotify(true)
            } else {  
                setIsLoading(true)
                const response = await checkValidCart(cart.products)  
                if(response !== 'true') {
                    setMessage(response + `${t("cartNotify2")}`);
                    setOpenNotify(true)
                } else {
                    try {
                        const user = localStorage.getItem("user");
                        const userData = JSON.parse(user);
                        const response = await getFeeShip(cart.idStore)
                        const calArray = response.data
                        const feeShipElement = calArray.find(element => element.contact._id === userData.defaultContact);
                        navigate("/user/order", { state: { total: total, feeDefault: feeShipElement, calArray: calArray } })
                        handleClose()
                    } catch (error) {
                        console.log(error)
                    }
                } 
                setIsLoading(false)                   
            }
        } else {
            handleClose()
            navigate("/signin", {state: { his: 'order', total:total}})
        }

    }

    useEffect(() => {
        const updateCart = () => {
            const cartdata = JSON.parse(localStorage.getItem('cart'));
            if (cartdata && cartdata.products) {
                setCart({
                    ...cart,
                    idStore: cartdata.idStore,
                    nameStore: cartdata.nameStore,
                    openAt: cartdata.openAt,
                    closeAt: cartdata.closeAt,
                    products: cartdata.products
                });
                let temp = 0;
                cartdata.products.forEach(product => {
                    const quantity = product.amount;
                    const price = product.price;
                    const productTotal = quantity * price;
                    temp += productTotal
                });
                setTotal(temp)
            }
        }

        updateCart(); // Cập nhật ban đầu
        window.addEventListener('cartUpdated', updateCart);

        return () => {
            window.removeEventListener('cartUpdated', updateCart);
        }

    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const updateTotalPrice = (id, quantity) => {
        const updatedProducts = cart.products.map(product => {
            if (product._id === id) {
                product.amount = quantity;
            }
            return product;
        });

        setCart({
            ...cart,
            products: updatedProducts
        });
        let tempTotal = 0;
        updatedProducts.forEach(product => {
            const productTotal = product.amount * product.price;
            tempTotal += productTotal;
        });

        setTotal(tempTotal);
    };

    const updateRequest = (id, request) => {
        const updatedProducts = cart.products.map(product => {
            if (product._id === id) {
                product.specialRequest = request;
            }
            return product;
        });

        setCart({
            ...cart,
            products: updatedProducts
        });
    };

    const handleDeleteItem = (id) => {

        const updatedProducts = cart.products.filter((product) => product._id !== id);
        setCart({
            ...cart,
            products: updatedProducts
        });
        const updatedCart = {
            ...cart,
            products: updatedProducts
        };
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        let tempTotal = 0;
        updatedProducts.forEach(product => {
            const productTotal = product.amount * product.price;
            tempTotal += productTotal;
        });

        setTotal(tempTotal);
        const count = updatedCart.products.length;
        setProductsCount(count)
        setIsModalOpen(true)
    };

    useEffect(() => {
        if (productsCount === 0) {
            setCart({
                idStore: '',
                nameStore: '',
                openAt: '',
                closeAt: '',
                products: []
            });
        }
    }, [productsCount]);

    useEffect(() => {
        // Khi isModalOpen thay đổi thành true, mở lại modal
        if (isModalOpen) {
            handleOpen();
            setIsModalOpen(false); // Đặt lại giá trị để tránh việc mở modal liên tục
        }
    }, [isModalOpen, handleOpen]);

    const handleStore = async () => {
        try {
            const storeData = await getStoreById(cart.idStore);
            const store = storeData.data;
            navigate("/home/storeDetail", { state: { store: { store } } });
            handleClose();
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className={`ant-drawer ant-drawer-right ant-drawer-open DrawerWrapper___3chn_ DrawerWrapper--custom`} style={{zIndex:'100000'}}>
                <div className="ant-drawer-mask" onClick={handleClose} ></div>

                <div className="ant-drawer-content-wrapper" style={{ width: '256px' }}>
                    <div className="ant-drawer-content" >
                        <div className="ant-drawer-wrapper-body" style={{ overflow: 'auto', height: '100%' }}>
                            {cart.products.length > 0 ? (
                                <div class="ant-drawer-body">
                                    <div class="Container___3hdF4">
                                        <div class="Header___1IY4t">
                                            <div class="Close___3j6yl" role="button" tabindex="0"
                                            ><div role="button" tabIndex="0" style={{ fontSize: '25px', fontWeight: '300', color: 'black', cursor: 'pointer' }} onClick={handleClose}>x</div></div>
                                            <div class="BlockTitle___2pGA_">
                                                <div class="title___3Sq4y" style={{ fontSize: '30px' }}>{t('cartName')}</div>
                                                {/* <div class="subtitle___1Stq2">
                                                <div class="small___1YhlN CartHeader-Caption-Clock___cBpaH"><i class="fa-regular fa-clock"></i></div>
                                                <span>{t("timeDelivery")} 15 {t("minutes")} ({t("distance")} 1,2 km)</span>
                                            </div> */}
                                            </div>
                                        </div>
                                        <div class="BodyWrapper___31bjI">
                                            <div class="BodyScroller___2bUgC">
                                                <div class="Body___20FKF CartBody___3v3rN">
                                                    <div class="CartMerchantList___3GwGF">
                                                        <div class="CartMerchant CartMerchantList-Item___3mF14">
                                                            <button
                                                                // role="button"
                                                                tabindex="0"
                                                                // href="/vn/vi/restaurant/c%C6%A1m-t%E1%BA%A5m-mi%E1%BB%81n-t%C3%A2y-2-hai-b%C3%A0-tr%C6%B0ng-delivery/5-CYUUNFJYBELDRX?"
                                                                style={{ color: 'inherit', textDecoration: 'none' }}
                                                                onClick={handleStore}
                                                            ><h5>{cart.nameStore}</h5></button>
                                                            <div class="CartItemList___1cspW">
                                                                {cart.products.map((product) => (
                                                                    <CartItem
                                                                        updateTotalPrice={updateTotalPrice}
                                                                        updateRequest={updateRequest}
                                                                        onDelete={handleDeleteItem}
                                                                        product={product}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="Summary___xAbzz">
                                                        <div>
                                                            {t("cartMess1")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="Footer___MhWOA">
                                            <div class="ant-row-flex CartFooter-PriceInfo___1UEeS">
                                                <div class="ant-col-8">{t("total")}</div>
                                                <div class="ant-col-16 CartFooter-Price___1jcoa">
                                                    {total.toLocaleString('vi-VN')} ₫
                                                </div>
                                            </div>
                                            <div>
                                                {isLoggedIn ? (
                                                    <button
                                                        type="button"
                                                        class="ant-btn ant-btn-primary ant-btn-block"
                                                        onClick={() => handleOrder('order')}
                                                    >
                                                        <span>{t("order")}</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        class="ant-btn ant-btn-primary ant-btn-block"
                                                        onClick={() => handleOrder('signin')}
                                                    >
                                                        <span>{t("signinToOrder")}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <div className="ant-drawer-body">
                                    <div className="CartClose___2qcP9">
                                        <div role="button" tabIndex="0" style={{ fontSize: '25px', fontWeight: '300', color: 'black', cursor: 'pointer' }} onClick={handleClose}>x</div>
                                    </div>
                                    <div className="Container___2ODfk">
                                        <div className="InnerContainer___127AT">
                                            <div className="Ilus___1VMHi">
                                                <img src={nocart} alt="" />
                                            </div>
                                            <h5 className="Title___ELm2y">{t("cartTitle")}</h5>
                                            <div className="Caption___2tnhx">{t("cartMess")}</div>
                                            <div className="">
                                                <button type="button" className="ant-btn textButton___2wwqU Button___2IyZ2" onClick={handleClose}>
                                                    <span>{t("cartNav")}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
            {isLoading && (<LoadingModal />)}
            {openNotify && (<Notify message={message} setOpenNotify={setOpenNotify} />)}
        </div>
    );
};

export default CartModal;

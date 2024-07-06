import React, { useState, useEffect } from "react";
import logo from '../../assets/img/logo.png'
import '../../assets/css/b.css'
import PickAddress from "../../Components/Modal/pickAddress";
import { useLocation } from "react-router-dom";
import { useCity } from "../../services/CityContext";
import OrderDishItem from "../../Components/Item/orderedDishItem";
import LoadingModal from "../../Components/Loading/Loading";
import { placeOrder, getFeeShip, getVoucherByStoreId, applyVoucher } from "../../services/userServices";
import ModalVoucher from "../../Components/Modal/modalVoucher";
import moment from "moment";
import { useTranslation } from "react-i18next";
const OrderPage = () => {
  const {t} = useTranslation();
  const [showModalAddress, setShowModalAddress] = useState(false);
  const { cart, setCart, productsCount } = useCity();
  const location = useLocation()
  const total = location.state.total
  const feeDefault = location.state.feeDefault
  const calArray = location.state.calArray
  const [totalPrice, setTotalPrice] = useState(total)
  const [shipFee, setShipFee] = useState(feeDefault.shipCost)
  const [distance, setDistance] = useState(feeDefault.distance)
  const [deliveryTime, setDeliveryTime] = useState(feeDefault.deliveryTime)
  const [totalPayment, setTotalPayment] = useState(totalPrice + shipFee)
  const [selectedContact, setSelectedContact] = useState({})
  const [array, setArray] = useState(calArray)
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState()
  const [showModalVoucher, setShowModalVoucher] = useState(false)
  const [discounts, setDiscounts] = useState([])
  const [selectedVoucher, setSelectedVoucher] = useState();
  const openModalVoucher = () => {
    setShowModalVoucher(true)
  }
  const closeModalVoucher = () => {
    setShowModalVoucher(false)
  }
  const openModalAddress = () => {
    setShowModalAddress(true);
  };

  const closeModalAddress = () => {
    setShowModalAddress(false);
  };

  const handleOrder = async () => {
    try {
      setIsLoading(true)
      const response = await placeOrder(totalPayment, shipFee, selectedContact._id);
      localStorage.removeItem('cart');
      const orderUrl = response.url; // Đặt tên phù hợp với trường cần lấy từ response
      window.open(orderUrl, '_blank'); // '_blank' để mở ở một tab mới
      if(selectedVoucher) {
        await applyVoucher(selectedVoucher._id, response.data._id);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }finally {
      setIsLoading(false);
  }

  };
  
  useEffect(() => {
    let tempTotal = 0;
    cart.products.forEach(product => {
      const productTotal = product.amount * product.price;
      tempTotal += productTotal;
    });
    setTotalPrice(tempTotal);
  }, [cart]);

  useEffect(() => {
    if(selectedVoucher) {
      if(totalPrice < selectedVoucher.conditions.minValues) {
        setSelectedVoucher(null)
      }
    }
  }, [totalPrice]);

  useEffect(() => {
    if (selectedVoucher && selectedVoucher.amount) {
      setTotalPayment(totalPrice + shipFee - selectedVoucher.amount);
    } else {
      setTotalPayment(totalPrice + shipFee);
    }
  }, [totalPrice, shipFee, selectedVoucher]);

  const [contacts, setContacts] = useState([])
  const [defaultContact, setDefaultContact] = useState("")
  useEffect(() => {
    const user = localStorage.getItem("user");
    const userData = JSON.parse(user);
    const defaultContactId = userData.defaultContact;
    const defaultContact = userData.contact.find(contact => contact._id === defaultContactId);
    setDefaultContact(userData.defaultContact)
    setUser(userData);
    setSelectedContact(defaultContact)
    setUserName(userData.firstName + " " + userData.lastName)
    setContacts(userData.contact)
  }, []);

  useEffect(() => {
    const getVoucher = async () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart"))
        const response = await getVoucherByStoreId(cart.idStore);
        setDiscounts(response.data)
      } catch (error) {
        console.log("Lỗi khi lấy thông tin voucher", error)
      }
    }
    getVoucher();
  }, []);
  

  useEffect(() => {
    try {
      const feeShipElement = array.find(element => element.contact._id === selectedContact._id);
      setShipFee(feeShipElement.shipCost)
      setDistance(feeShipElement.distance)
      setDeliveryTime(feeShipElement.deliveryTime)
    } catch (error) {
      console.error("Lỗi khi lấy thông tin phí vận chuyển:", error);
    }
  }, [selectedContact]);

  useEffect(() => {
    const getNewArray = async () => {
      try {
        setIsLoading(true)
        const response = await getFeeShip(cart.idStore)
        const temp = response.data
        setArray(temp)
      } catch (error) {
        console.error("Lỗi khi lấy thông tin phí vận chuyển:", error);
      }
      setIsLoading(false)

    }
    getNewArray()
  }, [contacts]); 

  return (
    <div>
      <div class="eqkueT">
        <div class="YqIqug">
          <div class="container_od">
            <div class="jb8bh0">
              <a class="_4+lJqn" href="/">
                <img src={logo} alt="" style={{ height: '80px', width: '100px' }} />
                <h1 class="eSRYBr">{t("pay")}</h1></a>
            </div>
          </div>
        </div>
        <div role="main" class="OX-2Lj">
          <div class="-p7ULT">
            <div class="vtrWey"></div>
            <div class="_8jJlG8">
              <div class="nU2ylc">
                <div class="MqmqK4">
                  <div class="Iafoll">
                    <svg
                      height="16"
                      viewBox="0 0 12 16"
                      width="12"
                      class="shopee-svg-icon icon-location-marker"
                    >
                      <path
                        d="M6 3.2c1.506 0 2.727 1.195 2.727 2.667 0 1.473-1.22 2.666-2.727 2.666S3.273 7.34 3.273 5.867C3.273 4.395 4.493 3.2 6 3.2zM0 6c0-3.315 2.686-6 6-6s6 2.685 6 6c0 2.498-1.964 5.742-6 9.933C1.613 11.743 0 8.498 0 6z"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <h2>{t("receiveAddress")}</h2>
                </div>
              </div>
              <div class="Jw2Sc-">
                <div>
                  <div class="NYnMjH">
                    <div class="FVWWQy">{userName} | {selectedContact.phoneNumber}</div>
                    <div class="QsWYfx">
                      {selectedContact.address}
                    </div>
                    {(defaultContact && selectedContact._id === defaultContact) && (
                      <div class="uk7Wpm">{t("default")}</div>
                    )}
                  </div>
                </div>
                <button onClick={openModalAddress} class="_3WkjWD div-style">{t("update")}</button>
              </div>
            </div>
          </div>
          <div class="sqxwIi">
            <div class="_3cPNXP">
              <div class="V-sVj2">
                <div class="jNp+ZB ktatB-"><h2 class="_6HCfS6">{t("product")}</h2></div>
                <div class="jNp+ZB _04sLFc" style={{ textAlign: 'left', paddingLeft: '20px' }}>{t("specialRequest")}</div>
                <div class="jNp+ZB">{t("price")}</div>
                <div class="jNp+ZB">{t("amount")}</div>
                <div class="jNp+ZB LBqTli">{t("bill")}</div>
              </div>
            </div>
            <div>
              <div class="o6P-mw">
                <div>
                  <div class="Z7qspM">
                    <div class="vYrpLx">
                      <h3 class="YSl9dN">{cart.nameStore}  <i class="fa-regular fa-clock"></i>   {deliveryTime} {t("minutes")}</h3>
                    </div>
                    {cart.products.map((product) => (

                      <OrderDishItem product={product} />
                    ))}
                  </div>
                </div>
                <div class="Nivkv-">
                  <div class="ULZMSb">
                    <div class="z10ZuQ">{t("totalProduct")} ({productsCount} {t("product")}):</div>
                    <div class="_9F3E9v">{totalPrice.toLocaleString('vi-VN')}₫</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="+w8dNn">
            <div
              class="vc_Card_container vc_Card_fsv vc_Card_inapplicable vc_VoucherStandardTemplate_fsv vc_VoucherStandardTemplate_inapplicable vc_free-shipping-voucher_pc"
            >
              <div class="vc_Card_card">
                <div class="vc_Card_right"></div>
                <div
                  class="vc_VoucherStandardTemplate_template"
                  role="presentation"
                >
                  <div class="vc_VoucherStandardTemplate_left" role="presentation">
                    <div class="jeFLq1">
                      <svg
                        fill="none"
                        viewBox="0 -2 23 22"
                        class="shopee-svg-icon icon-voucher-line"
                      >
                        <g filter="url(#voucher-filter0_d)">
                          <mask id="a" fill="#fff">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M1 2h18v2.32a1.5 1.5 0 000 2.75v.65a1.5 1.5 0 000 2.75v.65a1.5 1.5 0 000 2.75V16H1v-2.12a1.5 1.5 0 000-2.75v-.65a1.5 1.5 0 000-2.75v-.65a1.5 1.5 0 000-2.75V2z"
                            ></path>
                          </mask>
                          <path
                            d="M19 2h1V1h-1v1zM1 2V1H0v1h1zm18 2.32l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zm0 .65l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zm0 .65l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zM19 16v1h1v-1h-1zM1 16H0v1h1v-1zm0-2.12l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zm0-.65l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zm0-.65l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zM19 1H1v2h18V1zm1 3.32V2h-2v2.32h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zm.6 1.56v-.65h-2v.65h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zm.6 1.56v-.65h-2v.65h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zM20 16v-2.13h-2V16h2zM1 17h18v-2H1v2zm-1-3.12V16h2v-2.12H0zm1.4.91a2.5 2.5 0 001.5-2.29h-2a.5.5 0 01-.3.46l.8 1.83zm1.5-2.29a2.5 2.5 0 00-1.5-2.3l-.8 1.84c.18.08.3.26.3.46h2zM0 10.48v.65h2v-.65H0zM.9 9.1a.5.5 0 01-.3.46l.8 1.83A2.5 2.5 0 002.9 9.1h-2zm-.3-.46c.18.08.3.26.3.46h2a2.5 2.5 0 00-1.5-2.3L.6 8.65zM0 7.08v.65h2v-.65H0zM.9 5.7a.5.5 0 01-.3.46l.8 1.83A2.5 2.5 0 002.9 5.7h-2zm-.3-.46c.18.08.3.26.3.46h2a2.5 2.5 0 00-1.5-2.3L.6 5.25zM0 2v2.33h2V2H0z"
                            mask="url(#a)"
                          ></path>
                        </g>
                        <path
                          clip-rule="evenodd"
                          d="M6.49 14.18h.86v-1.6h-.86v1.6zM6.49 11.18h.86v-1.6h-.86v1.6zM6.49 8.18h.86v-1.6h-.86v1.6zM6.49 5.18h.86v-1.6h-.86v1.6z"
                        ></path>
                        <defs>
                          <filter
                            id="voucher-filter0_d"
                            x="0"
                            y="1"
                            width="20"
                            height="16"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            ></feFlood>
                            <feColorMatrix
                              in="SourceAlpha"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            ></feColorMatrix>
                            <feOffset></feOffset>
                            <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
                            <feColorMatrix
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
                            ></feColorMatrix>
                            <feBlend
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow"
                            ></feBlend>
                            <feBlend
                              in="SourceGraphic"
                              in2="effect1_dropShadow"
                              result="shape"
                            ></feBlend>
                          </filter>
                        </defs>
                      </svg>
                      <h2 class="Pd8fbQ">Voucher</h2>
                    </div>
                  </div>
                  <div
                    class="vc_VoucherStandardTemplate_middle"
                    role="presentation"
                    tabindex="0"
                  >
                    {selectedVoucher && (
                      <div>
                        <div class="vc_MainTitle_mainTitle">
                          <div class="vc_MainTitle_text vc_MainTitle_fsvLine">
                            {t("saleOff")} {selectedVoucher.amount.toLocaleString('vi-VN')}₫
                            {/* Giảm {selectedVoucher.amount}₫ */}
                          </div>
                        </div>
                        <div
                          class="vc_Subtitle_subTitle vc_Subtitle_oneLine"
                        >
                          {t("minPrice")} {selectedVoucher.conditions.minValues.toLocaleString('vi-VN')}₫
                          {/* Đơn Tối Thiểu {selectedVoucher.conditions.minValues}₫ */}
                        </div>
                        {/* <div class="vc_Label_label">
                          <div class="vc_Label_shopeeWalletLabel" data-cy="voucher_card_label">
                            <div
                              class="vc_Label_shopeeWalletLabelContent"
                              data-cy="voucher_card_label_content"
                              aria-label="Freeship 25.12"
                              style={{ color: 'red' }}
                            >
                              {selectedVoucher.content3}
                            </div>
                          </div>
                        </div> */}
                        <div
                          class="vc_ProgressBarExpiry_progressBarExpiry"
                        >
                          <div
                            class="vc_ProgressBarExpiry_usageLimitedText vc_ProgressBarExpiry_twoRowsLimitText"
                          >
                            <span
                              class="vc_ProgressBarExpiry_isEndingSoon vc_ProgressBarExpiry_capitalize"
                            >
                            {t("expired")}: {moment.utc(selectedVoucher.conditions.endDate).format('HH:mm DD/MM/YYYY')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                  <div class="vc_VoucherStandardTemplate_right" style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }} role="presentation">
                    <div class="vc_VoucherStandardTemplate_center">
                      <button class="FPhJqC" onClick={openModalVoucher}>{t("chooseVoucher")}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="DS2ZYY">
            <div class="DQ7t9K">
              <h2 class="a11y-visually-hidden">{t("paymentMethod")}</h2>
              <div>
                <div
                  class="checkout-payment-method-view__current checkout-payment-setting"
                >
                  <div class="checkout-payment-method-view__current-title">
                  {t("paymentMethod")}
                  </div>
                  <div class="checkout-payment-setting__payment-methods-tab">
                    <div role="radiogroup">
                      <span>
                        <button
                          class="product-variation product-variation--selected"
                          tabindex="0"
                          role="radio"
                          aria-label="Thẻ Tín dụng/Ghi nợ"
                          aria-disabled="false"
                          aria-checked="false"
                        >
                          {t("onlinePay")}
                          <div class="product-variation__tick">
                            <svg enable-background="new 0 0 12 12" viewBox="0 0 12 12" x="0" y="0" class="shopee-svg-icon icon-tick-bold">
                              <g>
                                <path d="m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c .3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z"></path>
                              </g>
                            </svg>
                          </div>
                        </button>
                      </span>
                      {/* <span><button
                        class="product-variation"
                        tabindex="0"
                        role="radio"
                        aria-label="Thanh toán khi nhận hàng"
                        aria-disabled="false"
                        aria-checked="false"
                      >
                        Thanh toán khi nhận hàng
                      </button></span> */}
                    </div>
                    <div aria-live="polite"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="KQyCj0" aria-live="polite">
              {/* <h2 class="a11y-visually-hidden">Tổng thanh toán:</h2> */}
              <h3 class="Tc17Ac XIEGGF BcITa9">{t("totalProduct")}</h3>
              <div class="Tc17Ac mCEcIy BcITa9">{totalPrice.toLocaleString('vi-VN')}₫</div>
              <h3 class="Tc17Ac XIEGGF RY9Grr">{t("shipFee")} ({distance}km)</h3>
              <div class="Tc17Ac mCEcIy RY9Grr">{shipFee.toLocaleString('vi-VN')}₫</div>
              <h3 class="Tc17Ac XIEGGF RY9Grr2">{t("saleOff")}</h3>
              <div class="Tc17Ac mCEcIy RY9Grr2">-{selectedVoucher ? (selectedVoucher.amount).toLocaleString('vi-VN') : 0}₫</div>
              <h3 class="Tc17Ac XIEGGF n3vdfL">{t("total")}</h3>
              <div class="Tc17Ac kC0GSn mCEcIy n3vdfL">{totalPayment.toLocaleString('vi-VN')}₫</div>
              <div class="uTFqRt">
                <div class="k4VpYA">
                  <div class="C-NSr-">
                    {t("remindOrder1")}
                    <a
                      // href="https://help.shopee.vn/portal/article/77242"
                      target="_blank"
                      rel="noopener noreferrer"
                    > {t("remindOrder2")}</a>
                  </div>
                </div>
                <button
                  class="stardust-button stardust-button--primary stardust-button--large apLZEG"
                  onClick={handleOrder}
                >
                  {t("order")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModalAddress && (
        <PickAddress show={showModalAddress} handleClose={closeModalAddress} user={user} selectedContact={selectedContact} setSelectedContact={setSelectedContact} contacts={contacts} setContacts={setContacts} defaultContact={defaultContact} setDefaultContact={setDefaultContact}/>
      )}
      {isLoading && (<LoadingModal />)}
      {showModalVoucher && (<ModalVoucher handleclose={closeModalVoucher} discounts={discounts} selectedVoucher={selectedVoucher} setSelectedVoucher={setSelectedVoucher} totalPrice={totalPrice}/>)}
    </div>
  )
}
export default OrderPage;
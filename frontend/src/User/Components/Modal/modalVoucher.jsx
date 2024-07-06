import React, { useState } from "react";
import cutlery from '../../assets/img/cutlery.png'
import moment from "moment";
import { useTranslation } from "react-i18next";
const ModalVoucher = ({ handleclose, discounts, selectedVoucher, setSelectedVoucher, totalPrice }) => {
    const {t} = useTranslation();
    const [temp, setTemp] = useState({ ...selectedVoucher })
    const handleRadioChange = (discount) => {
        setTemp({ ...discount });
    };
    const handleSumbmit = () => {
        setSelectedVoucher({ ...temp });
        handleclose();
    };
    const checkUsedVoucher = (users) => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData && userData._id && Array.isArray(users)) {
            const isUsed = users.some(user => user.userId === userData._id);
            return isUsed;
        }
        return false;
    };
    
    return (
        <div class="stardust-popup">
            <div class="stardust-popup__dialog--wrapper">
                <div
                    class="stardust-popup__dialog"
                    role="dialog"
                    aria-labelledby="undefined_stardust-popup-title_1703471828964"
                    aria-describedby=""
                    aria-modal="true"
                >
                    <div class="stardust-popup__dialog--wrapper-top">
                        <div
                            class="stardust-popup-content"
                            id="undefined_stardust-popup-content_1703471828964"
                        >
                            <div class="Rn4RMZ">
                                <div style={{ display: 'contents' }}>
                                    <div>
                                        <div class="shopee-popup-form oS7fgU">
                                            <div class="shopee-popup-form__header">
                                                <div class="shopee-popup-form__title">
                                                    <span tabindex="0">{t("chooseVoucher")}</span>
                                                </div>
                                                <div
                                                    class="stardust-popover"
                                                    id="stardust-popover0"
                                                    tabindex="0"
                                                >
                                                </div>
                                            </div>
                                            <div class="shopee-popup-form__main">
                                                <div class="y5uClx shopee-popup-form__main-container">
                                                    <div class="u6HdhE d9WDAK">
                                                        <div class="iF8vqN BzObne A3W8C5">
                                                            <span tabindex="0">{t("voucherNotify")}</span>
                                                        </div>
                                                        {discounts.map((discount) => (
                                                            <div
                                                                data-testid="vcCard"
                                                                class="vc_Card_container vc_Card_fsv vc_Card_inapplicable vc_VoucherStandardTemplate_fsv vc_VoucherStandardTemplate_inapplicable vc_free-shipping-voucher_pc"
                                                            >
                                                                <div class="vc_Card_card">
                                                                    <div class="vc_Card_left">
                                                                        <div class="vc_Card_sawtooth"></div>
                                                                    </div>
                                                                    <div class="vc_Card_right"></div>
                                                                    <div
                                                                        class="vc_VoucherStandardTemplate_hideOverflow"
                                                                    ></div>
                                                                    <div
                                                                        data-testid="voucher-card"
                                                                        class="vc_VoucherStandardTemplate_template"
                                                                        role="presentation"
                                                                    >
                                                                        <div
                                                                            class="vc_VoucherStandardTemplate_left"
                                                                            role="presentation"
                                                                        >
                                                                            <img
                                                                                style={{ width: '100%', height: '80%' }}
                                                                                alt="Logo"
                                                                                src={cutlery}
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            class="vc_VoucherStandardTemplate_middle"
                                                                            role="presentation"
                                                                            tabindex="0"
                                                                        >
                                                                            <div
                                                                                data-testid="vcLabel"
                                                                                class="vc_Label_label"
                                                                            >
                                                                                <div
                                                                                    class="vc_Label_shopeeWalletLabel"
                                                                                    data-cy="voucher_card_label"
                                                                                >
                                                                                    <div
                                                                                        class="vc_Label_shopeeWalletLabelContent"
                                                                                        data-cy="voucher_card_label_content"
                                                                                        aria-label="Dành riêng cho bạn"
                                                                                        style={{ color: 'red' }}
                                                                                    >
                                                                                        {discount.name}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                data-testid="vcMainTitle"
                                                                                class="vc_MainTitle_mainTitle"
                                                                            >
                                                                                <div
                                                                                    class="vc_MainTitle_text vc_MainTitle_fsvLine"
                                                                                >
                                                                                    {t("saleOff")} {discount.amount.toLocaleString('vi-VN')}₫
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                data-testid="vcSubtitle"
                                                                                class="vc_Subtitle_subTitle vc_Subtitle_oneLine"
                                                                            >
                                                                                {t("minPrice")} {discount.conditions.minValues.toLocaleString('vi-VN')}₫
                                                                            </div>
                                                                            
                                                                            <div
                                                                                data-testid="vcProgressBarExpiry"
                                                                                class="vc_ProgressBarExpiry_progressBarExpiry"
                                                                            >
                                                                                <div
                                                                                    class="vc_ProgressBarExpiry_usageLimitedText vc_ProgressBarExpiry_twoRowsLimitText"
                                                                                >
                                                                                    <span
                                                                                        class="vc_ProgressBarExpiry_isEndingSoon vc_ProgressBarExpiry_capitalize"
                                                                                    >{t("expired")}: {moment.utc(discount.conditions.endDate).format('HH:mm DD/MM/YYYY')}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            class="vc_VoucherStandardTemplate_right"
                                                                            role="presentation"
                                                                        >
                                                                            <div></div>
                                                                            <div class="vc_VoucherStandardTemplate_center" style={{ width: '20px', height: '20px' }}>
                                                                                <input
                                                                                    className={`${totalPrice < discount.conditions.minValues ? "vc_RadioButton_radioDisabled" : ""}`}
                                                                                    type="radio"
                                                                                    id={`discounts-radio-${discount._id}`}
                                                                                    name="discounts-radio-group"
                                                                                    value={discount._id}
                                                                                    checked={temp && temp._id === discount._id}
                                                                                    onChange={() => handleRadioChange(discount)}
                                                                                    disabled={(totalPrice < discount.conditions.minValues) || (checkUsedVoucher(discount.user))}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <div
                                                                                    data-testid="vcTNCLink"
                                                                                    class="vc_TNCLink_tncLink"
                                                                                    role="navigation"
                                                                                    style={{ display: 'none' }}
                                                                                >
                                                                                    <span>Điều Kiện</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {totalPrice < discount.conditions.minValues ? (

                                                                    <span
                                                                        tabindex="-1"
                                                                        class="vc_WarningBanner_link"
                                                                        target="_blank"
                                                                        rel="noreferrer noopener"   
                                                                    ><div class="vc_WarningBanner_warningBanner">
                                                                            <img
                                                                                alt=""
                                                                                class="lazyload vc_WarningBanner_info"
                                                                                loading="lazy"
                                                                                src="https://deo.shopeemobile.com/shopee/shopee-webfepromotion-live-sg/voucher-card@stable/images/4c43f638500f17b7.svg"
                                                                            />{t("voucherNotify1")}
                                                                        </div>
                                                                    </span>
                                                                ) : ( checkUsedVoucher(discount.user) && (
                                                                    <span
                                                                        tabindex="-1"
                                                                        class="vc_WarningBanner_link"
                                                                        target="_blank"
                                                                        rel="noreferrer noopener"   
                                                                    ><div class="vc_WarningBanner_warningBanner">
                                                                            <img
                                                                                alt=""
                                                                                class="lazyload vc_WarningBanner_info"
                                                                                loading="lazy"
                                                                                src="https://deo.shopeemobile.com/shopee/shopee-webfepromotion-live-sg/voucher-card@stable/images/4c43f638500f17b7.svg"
                                                                            />{t("voucherNotify2")}
                                                                        </div>
                                                                    </span>
                                                                ))}

                                                            </div>
                                                        ))}



                                                        <div class="JbRfQk"></div>
                                                    </div>
                                                    <div role="status" aria-label=""></div>
                                                </div>
                                            </div>
                                            <div class="shopee-popup-form__footer">
                                                <div class="asfDVE"></div>
                                                <button class="cancel-btn" onClick={handleclose}>
                                                    <span tabindex="-1" aria-label=" Trở Lại"
                                                    >{t("back")}</span></button>
                                                <button
                                                    type="button"
                                                    class="btn--voucher btn-solid-primary btn--s btn--inline e5P6KA"
                                                    aria-disabled="false"
                                                    onClick={handleSumbmit}
                                                >
                                                    <span tabindex="-1" aria-label=" OK">OK</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="stardust-popup-buttons"></div>
                </div>
            </div>
            <div class="stardust-popup__overlay" style={{ zIndex: '-1' }}></div>
        </div>
    )
}

export default ModalVoucher;
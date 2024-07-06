import React, {useState, useEffect} from "react";
import { useTranslation } from 'react-i18next';

const AddDish = ({show, handleClose, onConfirm, product, updateTotalPrice}) => {
  const {t} = useTranslation()
  const [totalPrice, setTotalPrice] = useState(product.amount * product.price);
  const [specialRequestValue, setSpecialRequestValue] = useState(product.specialRequest);

  const handleDecrease = () => {
    if (product.amount > 1) {
        updateTotalPrice(product._id, product.amount - 1);
    }
};

const handleIncrease = () => {
  if (product.amount < 10) {
      updateTotalPrice(product._id, product.amount + 1);
  }
};

useEffect(() => {
  setTotalPrice(product.amount * product.price);
}, [product.amount, product.price]);

  const handleSpecialRequestChange = (e) => {
    setSpecialRequestValue(e.target.value);
  };

  const handleConfirm = () => {
    onConfirm(specialRequestValue);
    handleClose();
  };

    return(
        <div>
      <div
        class="ant-drawer ant-drawer-right ant-drawer-open DrawerWrapper___3chn_ DrawerWrapper--custom"
      >
        <div class="ant-drawer-mask" onClick={handleClose}></div>
        <div class="ant-drawer-content-wrapper" style={{width: '256px'}} >
          <div class="ant-drawer-content">
            <div
              class="ant-drawer-wrapper-body"
              style={{overflow: 'auto', height: '100%'}}
            >
              <div class="ant-drawer-body">
                <div class="Container___3hdF4">
                  <div class="Header___1IY4t">
                  <div class="Close___3j6yl" role="button" tabindex="0"
                                        ><div role="button" tabIndex="0" style={{ fontSize: '25px', fontWeight: '300', color: 'black', cursor: 'pointer' }} onClick={handleClose}>x</div></div>
                  </div>
                  <div class="BodyWrapper___31bjI">
                    <div class="BodyScroller___2bUgC">
                      <div class="Body___20FKF drawerBody___2Q3Hm">
                        <div class="menuBody___Fjf7x">
                          <div class="firstSection___3BVxR">
                            <div
                              class="ant-row-flex"
                              style={{marginLeft: '-12px', marginRight: '-12px'}}
                            >
                              <div
                                class="ant-col-6"
                                style={{paddingLeft: '12px', paddingRight: '12px'}}
                              >
                                <img
                                  src={product.images[0]}
                                  class="itemImage___r2IN2"
                                  alt=""
                                />
                              </div>
                              <div
                                class="nameAndPrice___1hyH1"
                                style={{
                                  flex: '1 1 0%',
                                  width: '1px',
                                  paddingLeft: '12px',
                                  paddingRight: '12px',
                                }}
                              >
                                <div class="nameAndPriceWrapper___r4GvS">
                                  <h5>{product.name}</h5>
                                </div>
                                <div class="priceInfo___2eeNb">
                                  <h5>{(product.price).toLocaleString('vi-VN')}₫</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="lastSection___3cf8g">
                            <div>
                              <h6 class="sectionTitle___pw1R4">
                                {t('specialRequest')}
                              </h6>
                              <span class="sectionSubtitle___2vloa"
                                >{t('optional')}</span>
                            </div>
                            <textarea
                              // defaultValue={specialRequest === "" ? "" : specialRequest}
                              defaultValue={product.specialRequest} 
                              class="ant-input inputTextArea___3ULyx"
                              maxlength="130"
                              style={{
                                height: '47.6px',
                                minHeight: '47.6px',
                                maxHeight: '87.6px',
                                overflowY : 'hidden',
                              }}
                              onChange={handleSpecialRequestChange}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="Footer___MhWOA">
                    <div>
                      <div
                        class="ant-row-flex"
                        style={{marginLeft: '-12px', marginRight: '-12px'}}
                      >
                        <div
                          class="itemQuantity___307y9"
                          style={{paddingLeft: '12px', paddingRight: '12px'}}
                        >
                          <button
                            tabindex="0"
                            class="quantityButton___1Wsr8"
                            onClick={handleDecrease}
                            ><i class="fa-solid fa-minus" style={{ cursor: 'pointer', fontSize: '20px' }} ></i></button>
                          <div class="itemQuantityNumber___2vbCd">{product.amount}</div>
                          <button
                            tabindex="0"
                            onClick={handleIncrease}
                            class="quantityButton___1Wsr8"
                            ><i class="fa-solid fa-plus" style={{ cursor: 'pointer', fontSize: '20px' }}></i></button>
                        </div>
                        <div
                          class=""
                          style={{
                                  flex: '1 1 0%',
                                  width: '1px',
                                  paddingLeft: '12px',
                                  paddingRight: '12px',
                                }}
                        >
                          <button
                            type="button"
                            class="ant-btn addToCartButton___3-IkG ant-btn-primary"
                            onClick={handleConfirm}
                          >
                            {t('confirm')} - {totalPrice.toLocaleString('vi-VN')} ₫
                          </button>
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
    </div>
    )
}

export default AddDish;
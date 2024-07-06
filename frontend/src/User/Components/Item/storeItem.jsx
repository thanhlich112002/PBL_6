import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { checkStoreOpen } from "../../services/userServices";
const StoreItem = ({ store }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handleStore = () => {
        navigate("/home/storeDetail", { state: { store: { store } } });
    };
    const [isWithinOperatingHours, setIsWithinOperatingHours] = useState(false);
    useEffect(() => {
        setIsWithinOperatingHours(checkStoreOpen(store.openAt, store.closeAt))
    }, [store.openAt, store.closeAt]);
    return (
        <div class="item-restaurant" onClick={handleStore}>
            <div
                target="_blank"
                class="item-content"
            ><div class="img-restaurant">
                    {/* {like === "no" ? null : (
                        <div className="tag-preferred">
                            <i className="fa fa-thumbs-up" aria-hidden="true"></i>{t("storeLike")}
                        </div>
                    )} */}
                    <img
                        src={store.image}
                    />
                </div>
                <div class="info-restaurant">
                    <div class="info-basic-res">
                        <h4
                            class="name-res"
                            title={store.name}
                        >
                            <span
                                class="icon icon-quality-merchant"
                                title="Đây là 1 trong những Merchants được đánh giá cao"></span>{store.name}
                        </h4>
                        <div
                            class="address-res"
                            title={store.address}
                        >
                            {store.address}
                        </div>
                    </div>
                    <p class="content-promotion">
                        <i class="fas star fa-solid fa-star"></i> {store.ratingsAverage}
                        <p class="opening-hours"><i class={`fas fa-solid fa-clock ${isWithinOperatingHours ? 'online' : 'offline'}`}              
                        ></i>{isWithinOperatingHours ? `${t("storeActive")}: `: `${t("storeClose")}: `} {store.openAt}-{store.closeAt}</p>
                    </p>
                    <div class="opentime-status">
                        <span
                            className={`stt ${isWithinOperatingHours ? 'online' : 'offline'}`}
                            title={isWithinOperatingHours ? `${t("storeActive")}`: `${t("storeClose")}`}
                        ></span>
                    </div></div></div>
        </div>
    )
}

export default StoreItem
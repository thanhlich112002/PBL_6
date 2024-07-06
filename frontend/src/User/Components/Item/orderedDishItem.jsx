import React, { useEffect } from "react";
import { useState } from "react";

const OrderDishItem = ({ product }) => {
    const [totalPrice, setTotalPrice] = useState(0)
    useEffect(() => {
        setTotalPrice(product.amount * product.price);
    }, [product.amount, product.price]);
    return (

        <div>
            <div class="KxX-H6">
                <div class="_2OGC7L xBI6Zm">
                    <div class="h3ONzh EOqcX3">
                        <img
                            class="rTOisL"
                            alt="product item"
                            src={product.images[0]}
                            height="40"
                            width="40"
                        />
                        <span class="oEI3Ln"
                        ><span class="gHbVhc"
                        >{product.name}</span></span>
                    </div>
                    <div class="h3ONzh Le31ox">
                        <span class="dVLwMH">{product.specialRequest}</span>
                    </div>
                    <div class="h3ONzh">{product.price.toLocaleString('vi-VN')}₫</div>
                    <div class="h3ONzh">{product.amount}</div>
                    <div class="h3ONzh fHRPUO">{totalPrice.toLocaleString('vi-VN')}₫</div>
                </div>
            </div>
        </div>
    )

}
export default OrderDishItem;
import React, { useEffect } from "react";
import DishInMenuGroup from "./dishInMenuGroup";
import { useCity } from "../../services/CityContext";
import { useState } from "react";
import { getProductByStoreId } from "../../services/userServices";
import Skeleton from "../Skeleton/skeleton";
const MenuGroup = ({ category, openModal, store, search, isWithinOperatingHours }) => {
    const { cart, setCart, setProductsCount } = useCity();
    const [isLoading, setIsLoading] = useState(false)
    const handleOpen = () => {
        openModal()
    }
    const [dishes, setDishes] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const products = await getProductByStoreId(store._id, category.catName, search)
                setDishes(products.data.data)
            } catch (error) {
                console.log("Lỗi khi lấy thông tin món ăn", error)
            }
            setIsLoading(false)
        }
        fetchData();
    }, [search, category])



    const handleAddToCart = (dish, quantity) => {
        const addedDish = {
            _id: dish._id,
            images: dish.images,
            name: dish.name,
            price: dish.price,
            isOutofOrder: dish.isOutofOrder,
            ratingAverage: dish.ratingAverage,
            description: dish.description,
            storeId: dish.storeId,
            amount: quantity,
            specialRequest: "",
        };
        const existingProductIndex = cart.products.findIndex(product => product._id === addedDish._id);
        if (cart.idStore === dish.storeId && existingProductIndex !== -1) {
            // If the dish exists in the cart, update its amount
            const updatedProducts = cart.products.map((product, index) => {
                if (index === existingProductIndex) {
                    return { ...product, amount: Math.min(10, product.amount + quantity) };
                }
                return product;
            });

            const updatedCart = { ...cart, products: updatedProducts };
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            const count = updatedCart.products.length;
            setProductsCount(count);
        } else if (cart.idStore === dish.storeId) {
            // If the dish is not in the cart, add it to the products array
            const updatedProducts = cart.products.concat(addedDish);
            const updatedCart = { ...cart, products: updatedProducts };
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            const count = updatedCart.products.length;
            setProductsCount(count);
        }
        else {
            const newCart = {
                idStore: dish.storeId,
                nameStore: store.name, 
                products: [addedDish],
            };

            setCart(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));

            const count = newCart.products.length;
            setProductsCount(count);
        }
    };

    return (
        <div>
            <div
                class="menu-group"
                id={`category-${category._id}`}
                style={{
                    height: '56px',
                    width: '100%',
                }}
            >
                <div class="title-menu">{category.catName}</div>
            </div>
            {isLoading && Array(4).fill(0).map((item, index) => (
                <div
                key={index}
                class="item-restaurant-row"
                style={{
                    height: '84px',
                    width: '100%',
                }}
            >
                <div class="row">
                    <div class="col-auto item-restaurant-img" style={{ width: '80px', height: '60px' }}>
                        <Skeleton />
                    </div>
                    <div class="col item-restaurant-info">
                        <h2 class="item-restaurant-name" style={{ width: '200px', height: '25px' }}>
                            <Skeleton />
                        </h2>
                        <div class="item-restaurant-desc" style={{ width: '80px', height: '25px', marginTop: '10px' }}><Skeleton /></div>
                    </div>
                    <div class="col-auto item-restaurant-more">
                        <div class="row" style={{ width: '150px', height: '30px' }}>
                            <Skeleton />
                        </div>
                    </div>
                </div>
            </div>
            )) }
            {dishes.map((dish) => (
                <DishInMenuGroup dish={dish} handleOpen={handleOpen} handleAddToCart={handleAddToCart} isWithinOperatingHours={isWithinOperatingHours} />
            ))}
        </div>


    )
}

export default MenuGroup
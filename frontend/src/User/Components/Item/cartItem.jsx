import React, { useState, useEffect } from "react";
import '../../assets/css/cart.css'
import DeleteConfirmationModal from "../Modal/deleteDanger";
import AddDish from "../Modal/addDish";
const CartItem = ({updateTotalPrice, updateRequest, onDelete, product }) => {
    const [totalPrice, setTotalPrice] = useState(product.amount * product.price);
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

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [action, setAction] = useState('');

    const handleShowDeleteModal = (action) => {
        setAction(action)
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const [showModal1, setShowModal1] = useState(false);


    const openModal1 = () => {
        setShowModal1(true);
    };

    const closeModal1 = () => {
        setShowModal1(false);
    };
    const handleAddDishConfirm = (specialRequest) => {
        updateRequest(product._id, specialRequest)       
    };

    return (
        <div>
            <div class="CartItem___2Yzg2 CartItem___j95Ri">
                <div class="ant-row-flex CartItemRow___1A734">
                    <div class="CartItem-ColQty___2ATYU">
                        <div class="QtyControl___2iag0">
                            <div class="QtyLink___x_Jhz"
                            ><i class="fa-solid fa-minus" style={{ cursor: 'pointer' }} onClick={handleDecrease}></i>
                            </div>
                            <div class="QtyControl-Qty___1d4X_">{product.amount}</div>
                            <div class="QtyLink___x_Jhz"
                            ><i class="fa-solid fa-plus" style={{ cursor: 'pointer' }} onClick={handleIncrease}></i></div>
                        </div>
                        <a
                            href="./"
                            class="QtyCounter___Pld6t"
                            role="button"
                            tabindex="0"
                        >1x</a>
                    </div>
                    <div
                        class="CartItem-ColPhoto___1guvj tappable___LOYBZ" onClick={openModal1}
                    >
                        <div
                            class="placeholder___1xbBh CartItem-Photo___nfN4N"
                        >
                            <img
                                alt="Food item"
                                class="realImage___2TyNE show___3oA6B"
                                src={product.images[0]}
                            />
                        </div>
                    </div>
                    <div class="CartItem-ColDetail___25qM5">
                        <div class="ant-row-flex">
                            <div
                                class="CartItem-ColName___19whb tappable___LOYBZ CartItem-ColName-STO" onClick={openModal1}
                            >
                                <div class="CartItem-Name___1U_wi">
                                    {product.name}
                                </div>
                                <div class="CartItem-Comment___XZpCq">
                                    {product.specialRequest}
                                </div>
                            </div>
                            <div class="CartItem-ColPrice___136ai">
                                <div>
                                    <div>{totalPrice.toLocaleString('vi-VN')}₫</div>
                                    <button onClick={() => handleShowDeleteModal('cart')}><i class="fa-solid fa-trash" style={{ color: 'red' }}></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteConfirmationModal show={showDeleteModal} handleClose={handleCloseDeleteModal} handleDelete={onDelete} id={product._id} action={action} />
            {showModal1 && (
                <AddDish
                    show={showModal1}
                    handleClose={closeModal1}
                    onConfirm={handleAddDishConfirm}
                    product={product}
                    updateTotalPrice={updateTotalPrice}
                />
            )}
        </div>
    )
}
export default CartItem
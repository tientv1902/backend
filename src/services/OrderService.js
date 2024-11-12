const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const EmailService = require("../services/EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, user, fullName, address, city, phone, isPaid, paidAt, email } = newOrder;

        const formattedOrderItems = orderItems.map(item => ({
            product: item.id, 
            name: item.name,
            price: item.price,
            amount: item.amount,
            discount: item.discount,
            image: item.image
        }));

        try {
            const updatePromises = orderItems.map(async (order) => {
                const productOrder = await Product.findOneAndUpdate(
                    {
                        _id: order.id,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true } 
                );

                if (!productOrder) {
                    return { status: 'ERR', id: order.id };
                }
                return { status: 'OK', productOrder };
            });

            const results = await Promise.all(updatePromises);

            const outOfStockItems = results.filter(result => result.status === 'ERR').map(item => item.id);
            if (outOfStockItems.length) {
                resolve({
                    status: 'ERR',
                    message: `Product with id ${outOfStockItems.join(', ')} is out of stock`
                });
                return;
            }

            const createdOrder = await Order.create({
                orderItems: formattedOrderItems,
                shippingAddress: {
                    fullName,
                    address,
                    city,
                    phone
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user,
                isPaid,
                paidAt
            });

            if (createdOrder) {
                await EmailService.sendEmailCreateOrder(newOrder);
                resolve({
                    status: 'OK',
                    message: 'Order created and email sent successfully',
                    data: createdOrder
                });
            }
        } catch (e) {
            console.log('Error:', e);
            reject(e);
        }
    });
};


const getOrderDetails = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({ user: userId });

            if (!order) {
                resolve({
                    status: 'ok',
                    message: "The order is not defined"
                });
            } else {
                resolve({
                    status: 'Ok',
                    message: 'Success',
                    data: order
                });
            }
        } catch (e) {
            console.log("Error:", e);
            reject(e);
        }
    });
}

const getDetailsOrderById = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(orderId);  

            if (!order) {
                resolve({
                    status: 'Err',
                    message: "The order is not defined"
                });
            } else {
                resolve({
                    status: 'Ok',
                    message: 'Success',
                    data: order
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const deleteOrderDetails = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                resolve({
                    status: 'ERR',
                    message: "The order is not defined"
                });
                return;
            }

            const updateStockPromises = order.orderItems.map(async (item) => {
                await Product.findByIdAndUpdate(
                    item.product,
                    {
                        $inc: {
                            countInStock: +item.amount,
                            selled: -item.amount 
                        }
                    },
                    { new: true }
                );
            });

            await Promise.all(updateStockPromises);

            await Order.findByIdAndDelete(orderId);
            resolve({
                status: 'OK',
                message: 'Delete order and restock products successfully'
            });
        } catch (e) {
            console.log("Error:", e);
            reject(e);
        }
    });
};

const getAllOrder = () =>{
    return new Promise( async (resolve, reject) =>{
        try{
            const allOrder = await Order.find()
            resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allOrder
                })
        }catch (e){
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getOrderDetails,
    getDetailsOrderById,
    deleteOrderDetails,
    getAllOrder,
}
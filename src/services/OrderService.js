const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, user, fullName, address, city, phone, isPaid, paidAt } = newOrder;

        const formattedOrderItems = orderItems.map(item => ({
            product: item.id, 
            name: item.name,
            price: item.price,
            amount: item.amount,
            discount: item.discount,
            image: item.image
        }));

        try {
            const promise = orderItems.map(async(order) => {
                const productOrder = await Product.findOneAndUpdate(
                    {
                        _id: order.id,
                        countInStock: {$gte: order.amount}
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true } 
                );
                
                if (productOrder) {
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
                        user: user,
                        isPaid, paidAt
                    });
                    
                    if (createdOrder) {
                        return {
                            status: 'Ok',
                            message: 'Success',
                            data: { createdOrder, countInStock: productOrder.countInStock, selled: productOrder.selled }
                        };
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: [order.id]
                    };
                }
            });
            const results = await Promise.all(promise)
            const newData = results && results.filter((item) => item.id)
            if(newData.length){
                resolve({
                    status: 'ERR',
                    message: `Product with id ${newData.join(',')} is out of stock`
                })
            }
            resolve({
                status: 'OK',
                message: 'Success'
            })

        } catch (e) {
            reject(e);
        }
    });
}

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
            
            const checkOrder = await Order.findById(orderId);
            
            if (!checkOrder) {
                resolve({
                    status: 'ERR',
                    message: "The order is not defined"
                });
                return;
            }

            
            await Order.findByIdAndDelete(orderId);
            resolve({
                status: 'OK',
                message: 'Delete order success'
            });
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    createOrder,
    getOrderDetails,
    getDetailsOrderById,
    deleteOrderDetails
}
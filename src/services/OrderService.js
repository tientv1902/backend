const Order = require("../models/OrderProduct")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, user, fullName, address, city, phone } = newOrder;

        const formattedOrderItems = orderItems.map(item => ({
            product: item.id, 
            name: item.name,
            price: item.price,
            amount: item.amount,
            discount: item.discount,
            image: item.image
        }));

        try {
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
            });

            if (createdOrder) {
                resolve({
                    status: 'Ok',
                    message: 'Success',
                    data: createdOrder
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}





module.exports = {
    createOrder,
    
}
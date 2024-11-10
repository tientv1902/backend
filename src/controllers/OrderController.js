const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try{
        console.log('req', req.body)
        const{ paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone} = req.body
        if(!paymentMethod|| !itemsPrice|| !shippingPrice|| !totalPrice|| !fullName|| !address|| !city|| !phone){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required '
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e.message
        })
    }
}

const getOrderDetails = async (req, res) => {
    try{
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required '
            })
        }
        const response = await OrderService.getOrderDetails(userId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;  // Lấy _id của đơn hàng từ URL
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            });
        }
        const response = await OrderService.getDetailsOrderById(orderId);  // Gọi hàm để lấy chi tiết đơn hàng
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
};


const deleteOrderDetails = async (req, res) => {
    try{
        const orderId = req.params.id
        if(!orderId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required '
            })
        }
        const response = await OrderService.deleteOrderDetails(orderId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createOrder,
    getOrderDetails,
    getDetailsOrderById,
    deleteOrderDetails
}
const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController')
const { authUserMiddleware, authMiddleware } = require("../middleware/authMiddleware");

router.post('/create', OrderController.createOrder)
router.get('/order-details/:id',authUserMiddleware, OrderController.getOrderDetails)
router.get('/order-details-by-id/:id', OrderController.getDetailsOrderById)
router.delete('/delete-order/:id',OrderController.deleteOrderDetails)
router.get('/get-all-order',authMiddleware ,OrderController.getAllOrder)

module.exports = router  
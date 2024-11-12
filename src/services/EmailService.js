const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

async function sendEmailCreateOrder(newOrder) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD
        }
    });

    let listItems = '';
    const attachments = newOrder.orderItems.map((order, index) => {
        listItems += `
            <div>
                <p>Sản phẩm: <b>${order.name}</b></p>
                <p>Số lượng: <b>${order.amount}</b> - Giá: <b>${order.price}</b></p>
                <img src="cid:image${index}" alt="Hình sản phẩm" style="width:100px;" />
            </div>
        `;
        return {
            filename: `image${index}.jpg`, 
            path: order.image, 
            cid: `image${index}` 
        };
    });

    try {
        await transporter.sendMail({
            from: process.env.MAIL_ACCOUNT,
            to: process.env.MAIL_ACCOUNT,
            subject: 'Xác nhận đặt hàng thành công',
            html: `<h1>Cảm ơn bạn đã đặt hàng!</h1><p>Thông tin chi tiết đơn hàng:</p> ${listItems}`,
            attachments: attachments
        });
        console.log("Email đã gửi thành công");
    } catch (error) {
        console.error("Gửi email thất bại: ", error);
    }
}

module.exports = {
    sendEmailCreateOrder
};

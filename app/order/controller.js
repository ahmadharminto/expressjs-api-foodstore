import Order from './model.js';
import OrderItem from '../order-item/model.js';
import CartItem from '../cart/model.js';
import DeliveryAddress from '../delivery-address/model.js';
import policyFor from '../auth/policy.js';

export const index = async (req, res, next) => {
    try {
        let policy = policyFor(req.user);
        if (!policy.can('view', 'Order')) {
            return res.status(403).json({
                message: `Unauthorized.`
            });
        }

        let { limit = 10, skip = 0 } = req.query;

        let count = await Order
            .find({user: req.user._id})
            .countDocuments();

        let orders = await Order 
            .find({user: req.user._id})
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('order_items')
            .sort('-createdAt');

        return res.json({
            data: orders.map(order => order.toJSON({virtuals: true})),
            count
        });
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.status(422).json({
                message: err.message, 
                fields: err.errors
            });
        }
        return next(err);
    }
}

export const store = async (req, res, next) => {
    try {
        let policy = policyFor(req.user);
        if (!policy.can('create', 'Order')) {
            return res.status(403).json({
                message: `Unauthorized.`
            });
        }
        let { delivery_fee, delivery_address } = req.body;
        let items = await CartItem.find({ user: req.user._id }).populate('product');
        if (!items?.length) {
            return res.status(422).json({
                message: 'Please add item in cart.', 
                fields: {name: 'items'}
            });
        }
        if (!delivery_address) {
            return res.status(422).json({
                message: 'Delivery address (_id) is required.', 
                fields: {name: 'delivery_address'}
            });
        }
        let address = await DeliveryAddress.findOne({ _id: delivery_address, user: req.user._id });
        if (!address) {
            return res.status(404).json({
                message: 'Delivery address (_id) not found or not belongs to current user.', 
                fields: {name: 'delivery_address'}
            });
        }
        let order = new Order({
            status: 'waiting_payment',
            delivery_fee,
            delivery_address: {
                province: address.province,
                regency: address.regency,
                district: address.district,
                village: address.village,
                detail: address.detail
            },
            user: req.user._id
        });
        await order.save();
        let orderItems = await OrderItem.insertMany(
            items.map(item => ({
                ...item,
                name: item.product.name,
                qty: parseInt(item.qty),
                price: item.product.price,
                total_price: parseInt(item.qty) * item.product.price,
                order: order._id,
                product: item.product._id
            }))
        );
        orderItems.forEach(item => order.order_items.push(item)); 
        order.save();
        await CartItem.deleteMany({ user: req.user._id });
        return res.json(order.populate('order_items'));
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.status(422).json({
                message: err.message, 
                fields: err.errors
            });
        }
        return next(err);
    }
}
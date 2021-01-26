import Cart from './model.js';
import Product from '../product/model.js';
import policyFor from '../auth/policy.js';

export const index = async (req, res, next) => {
    try {
        let policy = policyFor(req.user);

        if (!policy.can('read', 'Cart')) {
            return res.status(403).json({
                message: `Unauthorized.`
            });
        }

        let items = await Cart
            .find({user: req.user._id})
            .populate('product');

        return res.json(items);
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

export const update = async (req, res, next) => {
    try {
        let policy = policyFor(req.user);

        if (!policy.can('update', 'Cart')) {
            return res.status(403).json({
                message: `Unauthorized.`
            });
        }

        const { items } = req.body;
        const productIds = items?.map(itm => itm._id);
        const products = await Product.find({_id: {$in: productIds}});

        let cartItems = items?.map(item => {
            let relatedProduct = products.find(product => product._id.toString() === item._id);
            return {
                _id: relatedProduct._id, 
                product: relatedProduct._id, 
                price: relatedProduct.price, 
                image_url: relatedProduct.image_url, 
                name: relatedProduct.name, 
                user: req.user._id, 
                qty: item.qty,
                total_price: item.qty * relatedProduct.price
            }
        });

        // await Cart.deleteMany({user: req.user._id});
        await Cart.bulkWrite(cartItems.map(item => {
            return {
                updateOne: {
                    filter: {user: req.user._id, product: item.product}, 
                    update: item, 
                    upsert: true
                }
            }
        }));

        return res.json(cartItems);
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

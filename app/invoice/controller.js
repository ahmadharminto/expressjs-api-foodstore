import Invoice from './model.js';
import policyFor from '../auth/policy.js';
import { subject } from '@casl/ability';

export const show = async (req, res, next) => {
    try {
        let { order_id } = req.params;
        let invoice = await Invoice 
            .findOne({order: order_id})
            .populate('order')
            .populate('user');

        if (!invoice) {
            return res.status(404).json({
                message: 'No invoice found for this order.', 
                fields: {name: 'order_id'}
            });
        }

        let policy = policyFor(req.user);
        let subjectInvoice = subject('Invoice', {...invoice, user_id: invoice.user._id});

        if (!policy.can('read', subjectInvoice)) {
            return res.status(403).json({
                message: `Unauthorized.`
            });
        }

        return res.json(invoice);
    } catch (err) {
        return next(err);
    }
};
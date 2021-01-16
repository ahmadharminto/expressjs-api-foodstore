import { subject } from '@casl/ability';
import DeliveryAddress from './model.js';
import policyFor from '../auth/policy.js';

export const index = async (req, res, next) => {
    try {
        let policy = policyFor(req.user);
        if (!policy.can('view', 'DeliveryAddress')) {
            return res.status(403).json({
                message: `Unauthorized.`
            });
        }
        let { limit = 10, skip = 0} = req.query;
        let count = await DeliveryAddress.find({ user: req.user._id}).countDocuments();
        let address = await DeliveryAddress.find({ user: req.user._id })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .sort('-createdAt');
        return res.json({
            data: address,
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

        if (!policy.can('create', 'DeliveryAddress')){
            return res.status(403).json({
                message: `Unauthorized.`
            });
        }

        let payload = req.body; 
        let user = req.user;
        let address = new DeliveryAddress({...payload, user: user._id});
        await address.save(); 
        return res.json(address);
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
        let { id } = req.params;
        let { _id, ...payload } = req.body;
        let address = await DeliveryAddress.findOne({ _id: id});
        let subjectAddress = subject('DeliveryAddress', { ...address, user_id: address.user });
        if (!policy.can('update', subjectAddress)) {
            return res.status(403).json({
                message: `Unauthorized.`
            });
        }
        address = DeliveryAddress.findOneAndUpdate({ _id: id }, payload, { new : true });
        return res.json(address);
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

export const destroy = async (req, res, next) => {
    try {
        let policy = policyFor(req.user);
        let { id } = req.params;
        let address = await DeliveryAddress.findOne({ _id: id});
        let subjectAddress = subject('DeliveryAddress', { ...address, user: address.user });
        if (!policy.can('delete', subjectAddress)) {
            return res.status(403).json({
                message: `Unauthorized.`
            });
        }
        DeliveryAddress.findOneAndDelete({ _id: id });
        return res.json(address);
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
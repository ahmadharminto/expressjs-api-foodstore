import mongoose from 'mongoose';
import Category from './model.js';
import policyFor from '../auth/policy.js';

export const index = async (req, res, next) => {
    try{
        let { limit = 10, skip = 0 } = req.query;
        let products = await Category
            .find()
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        return res.json(products);
    } catch(err) {
        return next(err);
    }
}

export const store = async (req, res, next) => {
    try {
        let policy = policyFor(req.user);

        if (!policy.can('create', 'Category')) {
            return res.status(403).json({
                message: `Unauthorized.`
            });
        }

        let payload = req.body;
        let category = new Category(payload);
        await category.save();
        return res.json(category);
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

        if (!policy.can('update', 'Category')) {
            return res.status(403).json({
                message: `Unauthorized.`
            });
        }

        let payload = req.body;
        let category = await Category.findOneAndUpdate({_id: req.params.id}, payload, {new: true, runValidators: true});
        if (!category) {
            return res.status(404).json({
                message: `Resource ${req.params.id} is not found.`, 
                fields: {name: '_id'}
            });
        }
        return res.json(category);
    } catch (err) {
        console.log(err)
        if (err && err.name === 'ValidationError') {
            return res.status(422).json({
                message: err.message, 
                fields: err.errors
            });
        }
        if (err instanceof mongoose.CastError) {
            return res.status(404).json({
                message: `Resource ${req.params.id} is not found.`, 
                fields: {name: '_id'}
            });
        }
        return next(err);
    }
}

export const destroy = async (req, res, next) => {
    try {
        let policy = policyFor(req.user);

        if (!policy.can('delete', 'Category')) {
            return res.status(403).json({
                message: `Unauthorized.`
            });
        }

        let category = await Category.findOneAndDelete({_id: req.params.id});
        if (!category) {
            return res.status(404).json({
                message: `Resource ${req.params.id} is not found.`, 
                fields: {name: '_id'}
            });
        }
        return res.json(category);
    } catch(err) {
        if (err instanceof mongoose.CastError) {
            return res.status(404).json({
                message: `Resource ${req.params.id} is not found.`, 
                fields: {name: '_id'}
            });
        }
        return next(err);
    }
}
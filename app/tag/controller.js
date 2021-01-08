import mongoose from 'mongoose';
import Tag from './model.js';

export const index = async (req, res, next) => {
    try{
        let { limit = 10, skip = 0 } = req.query;
        let tags = await Tag
            .find()
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        return res.json(tags);
    } catch(err) {
        return next(err);
    }
}

export const store = async (req, res, next) => {
    try {
        let payload = req.body;
        let tag = new Tag(payload);
        await tag.save();
        return res.json(tag);
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
        let payload = req.body;
        let tag = await Tag.findOneAndUpdate({_id: req.params.id}, payload, {new: true, runValidators: true});
        if (!tag) {
            return res.status(404).json({
                message: `Resource ${req.params.id} is not found.`, 
                fields: {name: '_id'}
            });
        }
        return res.json(tag);
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
        let tag = await Tag.findOneAndDelete({_id: req.params.id});
        if (!tag) {
            return res.status(404).json({
                message: `Resource ${req.params.id} is not found.`, 
                fields: {name: '_id'}
            });
        }
        return res.json(tag);
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
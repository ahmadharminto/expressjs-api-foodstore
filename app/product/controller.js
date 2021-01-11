import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import config from '../config.js';
import Product from './model.js';
import Category from '../category/model.js';
import Tag from '../tag/model.js';

export const index = async (req, res, next) => {
    try{
        let { limit = 10, skip = 0, q = '', category = '', tags = [] } = req.query;
        let filters  = {};

        if (q.length) {
            filters = {
                ...filters, 
                name: {$regex: `${q}`, $options: 'i'}
            }
        }

        if (category.length) {
            let _category = await Category.findOne({name: {$regex: `${category}`, $options: 'i'}});
            if (_category) {
                filters = {...filters, category: _category._id}
            } else {
                return res.status(422).json({
                    message: `Resource ${category} is not found.`, 
                    fields: {name: 'category'},
                    hint: 'Use name from /api/categories'
                }); 
            }
        }

        if (tags.length) {
            let _tags = await Tag.find({name: {$in: tags}});
            if (_tags.length) {
                filters = {...filters, tags: {$in: _tags.map(tag => tag._id)}}
            } else {
                return res.status(422).json({
                    message: `Resource tags is not found.`, 
                    fields: {name: 'tags'},
                    hint: 'Use name from /api/tags'
                }); 
            }
        }

        let products = await Product
            .find(filters)
            .populate('category')
            .populate('tags')
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        return res.json(products);
    } catch(err) {
        return next(err);
    }
}

export const store = async (req, res, next) => {
    try {
        let payload = req.body;

        if (payload.category) {
            try {
                let _ = await Category.findOne({_id: payload.category});
            } catch (err) {
                return res.status(422).json({
                    message: `Resource ${payload.category} is not found.`, 
                    fields: {name: 'category'},
                    hint: 'Use _id from /api/categories'
                });
            }
        }

        if (payload.tags && payload.tags.length) {
            try {
                let _ = await Tag.find({_id: {$in: payload.tags}});
            } catch (err) {
                return res.status(422).json({
                    message: `Some resources are not found.`, 
                    fields: {name: 'tags'},
                    hint: 'Use _id from /api/tags'
                });
            }
        }

        if (req.file) {
            let tmp_path = req.file.path; 
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `${config.imageDir}/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    let product = new Product({...payload, image_url: filename});
                    await product.save();
                    return res.json(product);
                } catch (err) {
                    if (err && err.name === 'ValidationError') {
                        return res.status(422).json({
                            message: err.message, 
                            fields: err.errors
                        });
                    }
                    return next(err);
                }
            });

            src.on('error', async() => {
                return next(err);
            });
        } else {
            let product = new Product(payload);
            await product.save();
            return res.json(product);
        }
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

        if (payload.category) {
            try {
                let _ = await Category.findOne({_id: payload.category});
            } catch (err) {
                return res.status(422).json({
                    message: `Resource ${payload.category} is not found.`, 
                    fields: {name: 'category'},
                    hint: 'Use _id from /api/categories'
                });
            }
        }

        if (req.file) {
            let tmp_path = req.file.path; 
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `${config.imageDir}/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    let product = await Product.findOne({_id: req.params.id});
                    if (!product) {
                        return res.status(404).json({
                            message: `Resource ${req.params.id} is not found.`, 
                            fields: {name: '_id'}
                        });
                    }

                    let currentImage = `${config.rootPath}/${config.imageDir}/${product.image_url}`;
                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage)
                    }

                    product = await Product.findOneAndUpdate({_id: req.params.id}, {...payload, image_url: filename}, {new: true, runValidators: true});
                    return res.json(product);
                } catch (err) {
                    if (err instanceof mongoose.CastError) {
                        return res.status(404).json({
                            message: `Resource ${req.params.id} is not found.`, 
                            fields: {name: '_id'}
                        });
                    }
                    if (err && err.name === 'ValidationError') {
                        return res.status(422).json({
                            message: err.message, 
                            fields: err.errors
                        });
                    }
                    return next(err);
                }
            });

            src.on('error', async() => {
                return next(err);
            });
        } else {
            let product = await Product.findOneAndUpdate({_id: req.params.id}, payload, {new: true, runValidators: true});
            if (!product) {
                return res.status(404).json({
                    message: `Resource ${req.params.id} is not found.`, 
                    fields: {name: '_id'}
                });
            }
            return res.json(product);
        }
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
        let product = await Product.findOneAndDelete({_id: req.params.id});
        if (!product) {
            return res.status(404).json({
                message: `Resource ${req.params.id} is not found.`, 
                fields: {name: '_id'}
            });
        }
        let currentImage = `${config.rootPath}/${config.imageDir}/${product.image_url}`;
        if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
        }
        return res.json(product);
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
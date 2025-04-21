import { Departments } from '../../models/index.js';
// import multer from 'multer';
import path from 'path';
import CustomErrorHandler from '../../utils/CustomErrorHandler.js';
import fs from 'fs';
import Joi from 'joi';
// import productSchema from '../validators/productValidator';
const DepartmentsController = {
    // controllers/DepartmentsController.js

    async store(req, res, next) {
        // 1. Validate input
        const departmentSchema = Joi.object({
            DepartmentName: Joi.string().min(3).max(30).required(),
            Remarks: Joi.string().allow('').optional()
        });
    
        const { error } = departmentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
                status: 400,
            });
        }
    
        const { DepartmentName, Remarks } = req.body;
    
        try {
            // 2. Check if department already exists
            const exists = await Departments.findOne({ DepartmentName });
            if (exists) {
                return res.status(409).json({
                    message: 'Department already exists',
                    status: 409,
                    data: exists,
                });
            }
    
            // 3. Create and save new department
            const department = new Departments({
                DepartmentName,
                Remarks,
                updatedAt: new Date(), // This is optional if you're using `timestamps` in schema
            });
    
            const savedDepartment = await department.save();
    
            // 4. Send response
            return res.status(201).json({
                message: 'Department created successfully',
                status: 201,
                data: savedDepartment,
            });
    
        } catch (error) {
            return next(CustomErrorHandler.serverError(error.message));
        }
    },    

    // Update user by ID
    async update(req, res, next) {
        const { id } = req.params;
        const updateSchema = Joi.object({
            DepartmentName: Joi.string().min(3).max(30).required(),
            Remarks: Joi.string().trim().allow('').optional()
        });
    
        const { error } = updateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
    
        try {
            const updatedUser = await Departments.findByIdAndUpdate(
                id,
                {
                    $set: {
                        ...req.body,
                        updatedAt:new Date(),
                    },
                },
                { new: true, runValidators: true }
            ).select('-password');
    
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            res.status(200).json({
                message: 'User updated successfully',
                status: 200,
                data: updatedUser,
            });
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }
    
    ,
    async destroy(req, res, next) {

    },
    // async index(req, res, next) {
    //     try {
    //       const { page = 1, limit = 10 } = req.query;

    //       const pageNum = Number(page);
    //       const limitNum = Number(limit);
    //       const skip = (pageNum - 1) * limitNum;

    //       // Fetch documents and total count simultaneously
    //       const [documents, total] = await Promise.all([
    //         Departments.find()
    //           .select('-updatedAt -__v')
    //           .sort({ _id: -1 })
    //           .skip(skip)
    //           .limit(limitNum),

    //         Departments.countDocuments(),
    //       ]);

    //       return res.status(200).json({
    //         status: 200,
    //         success: true,
    //         message: 'Departments fetched successfully',
    //         data: documents,
    //         meta: {
    //           total,
    //           page: pageNum,
    //           limit: limitNum,
    //           totalPages: Math.ceil(total / limitNum),
    //         },
    //       });

    //     } catch (err) {
    //       return next(CustomErrorHandler.serverError(err.message));
    //     }
    //   },         
    // Backend Controller: departments.controller.js

    async index(req, res, next) {
        try {
            const {
                page = 1,
                limit = 10,
                query = '',
                sortKey = '_id',
                sortOrder = 'desc',
                purchaseChannel = []
            } = {
                page: req.query.page || req.query.pageIndex || 1,
                limit: req.query.limit || req.query.pageSize || 10,
                query: req.query.query || '',
                sortKey: req.query['sort[key]'] || '_id',
                sortOrder: req.query['sort[order]'] || 'desc',
                purchaseChannel: req.query.purchaseChannel || []
            }

            const pageNum = Number(page)
            const limitNum = Number(limit)
            const skip = (pageNum - 1) * limitNum

            const filter = {
                ...(query ? { DepartmentName: { $regex: query, $options: 'i' } } : {}),
                ...(Array.isArray(purchaseChannel) && purchaseChannel.length > 0
                    ? { PurchaseChannel: { $in: purchaseChannel } }
                    : {})
            }

            const sort = { [sortKey]: sortOrder === 'asc' ? 1 : -1 }

            const [documents, total] = await Promise.all([
                Departments.find(filter)
                    .select('-__v -updatedAt')
                    .sort(sort)
                    .skip(skip)
                    .limit(limitNum),
                Departments.countDocuments(filter)
            ])

            const list = documents.map((_data) => ({
                name: _data.DepartmentName,
                remark: _data.Remarks,
                id: _data._id,
                ..._data._doc,
                ..._data
            }))

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Departments fetched successfully',
                list,
                total,
                meta: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum)
                }
            })
        } catch (err) {
            return next(CustomErrorHandler.serverError(err.message))
        }
    }
    ,

    async show(req, res, next) {
        let document;
        try {
            document = await Departments.findOne({ _id: req.params.id }).select(
                '-updatedAt -__v'
            );
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(document);
    },
    async getProducts(req, res, next) {
        let documents;
        try {
            documents = await Product.find({
                _id: { $in: req.body.ids },
            }).select('-updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },
};

export default DepartmentsController;

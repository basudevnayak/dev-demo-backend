import { BusinessNatureTypes } from '../../models/index.js';
import path from 'path';
import CustomErrorHandler from '../../utils/CustomErrorHandler.js';
import fs from 'fs';
import Joi from 'joi';
const BusinessNatureTypesController  = {
    capitalize(str) {
        if (typeof str !== 'string') return '';
        return str
            .trim()
            .split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    },
    async store(req, res, next) {
        const departmentSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            remark: Joi.string().allow('').optional()
        });
        const { error } = departmentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
                status: 400,
            });
        }
        const { name, remark } = req.body;
        try {
            const exists = await BusinessNatureTypes.findOne({ name });
            if (exists) {
                return res.status(409).json({
                    message: 'Department already exists',
                    status: 409,
                    data: exists,
                });
            }

            const department = new BusinessNatureTypes({
                name: name,
                remark,
                updatedAt: new Date(),
            });
            const savedDepartment = await department.save();
            return res.status(201).json({
                message: 'Created successfully',
                status: 201,
                data: savedDepartment,
            });
        } catch (error) {
            return next(CustomErrorHandler.serverError(error.message));
        }
    },
    async update(req, res, next) {
        const { id } = req.params;
        const updateSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            remark: Joi.string().trim().allow('').optional()
        });

        const { error } = updateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        try {
            // 1. Check if the name is already used by another department
            const existingDepartment = await BusinessNatureTypes.findOne({
                name: req.body.name,
                _id: { $ne: id }  // _id not equal to the current document
            });

            if (existingDepartment) {
                return res.status(409).json({ message: 'Name already exists' });
            }

            // 2. Proceed to update if no duplicate
            const updatedDepartment = await BusinessNatureTypes.findByIdAndUpdate(
                id,
                {
                    $set: {
                        ...req.body,
                        updatedAt: new Date(),
                    },
                },
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedDepartment) {
                return res.status(404).json({ message: 'Department not found' });
            }

            res.status(200).json({
                message: 'Updated successfully',
                status: 200,
                data: updatedDepartment,
            });
        } catch (err) {
            return next(CustomErrorHandler.serverError(err.message));
        }
    }
    ,
    async destroy(req, res, next) {
        try {
            let ids = [];

            if (Array.isArray(req.body.ids)) {
                ids = req.body.ids;
            } else if (Array.isArray(req.body.data)) {
                ids = req.body.data.map(item => item.id);
            }

            if (ids.length === 0) {
                return res.status(400).json({
                    message: 'No department IDs provided for deletion.',
                    status: 400,
                });
            }

            const result = await BusinessNatureTypes.deleteMany({ _id: { $in: ids } });

            return res.status(200).json({
                message: `${result.deletedCount} Deleted successfully.`,
                status: 200,
                data: result,
            });
        } catch (err) {
            return next(CustomErrorHandler.serverError(err.message));
        }
    },
    async index(req, res, next) {
        try {
            // Destructure parameters from the request query
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
            };

            // Convert page and limit to numbers
            const pageNum = Number(page);
            const limitNum = Number(limit);
            const skip = (pageNum - 1) * limitNum;

            // Construct filter based on query and purchaseChannel
            const filter = {
                ...(query ? { name: { $regex: query, $options: 'i' } } : {}),
                ...(Array.isArray(purchaseChannel) && purchaseChannel.length > 0
                    ? { PurchaseChannel: { $in: purchaseChannel } }
                    : {})
            };

            // Sorting object
            const sort = { [sortKey]: sortOrder === 'asc' ? 1 : -1 };

            // Fetch documents and total count in parallel
            const [documents, total] = await Promise.all([
                BusinessNatureTypes.find(filter)
                    .select('-__v -updatedAt')
                    .sort(sort)
                    .skip(skip)
                    .limit(limitNum),
                BusinessNatureTypes.countDocuments(filter)
            ]);

            // Map through the documents to capitalize name and add other fields
            const list = documents.map((_data) => ({
                ..._data._doc,
                ..._data,
                name: BusinessNatureTypesController.capitalize(_data.name), // Capitalize the name
                remark: _data.remark,
                id: _data._id,
            }));

            // Return the response
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Fetched successfully',
                list,
                total,
                meta: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum)
                }
            });
        } catch (err) {
            return next(CustomErrorHandler.serverError(err.message));
        }
    },

    async show(req, res, next) {
        let document;
        try {
            document = await BusinessNatureTypes.findOne({ _id: req.params.id }).select(
                '-updatedAt -__v'
            );

            // If the document is found, convert the 'name' field to camelCase
            if (document) {
                document.name = toCamelCase(document.name);
            }

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
    async import(req, res, next) {
        try {
            if (!Array.isArray(req.body) || req.body.length === 0) {
                return res.status(400).json({ message: 'No data provided' });
            }
            const customersToInsert = req.body
                .filter(item => item.name && item.name.trim() !== '')
                .map(item => ({
                    name: item.name,
                    remark: item.remark ? item.remark.trim() : '',
                }));
            if (customersToInsert.length === 0) {
                return res.status(400).json({ message: 'No valid customers to import' });
            }

            // Check for existing department names
            const existingDepartments = await BusinessNatureTypes.find({
                name: { $in: customersToInsert.map(item => item.name) },
            });
            const existingDepartmentNames = existingDepartments.map(department => department.name);
            const newDepartments = customersToInsert.filter(
                item => !existingDepartmentNames.includes(item.name)
            );

            if (newDepartments.length === 0) {
                return res.status(409).json({
                    status: 409,
                    message: 'Some data already exist'
                });
            }
            const savedDepartments = await BusinessNatureTypes.insertMany(newDepartments);
            return res.status(200).json({
                status: 200,
                message: 'Imported successfully',
                insertedCount: savedDepartments.length,
                data: savedDepartments,
                skippedCount: customersToInsert.length - savedDepartments.length,
                skippedDepartments: existingDepartmentNames,
            });
        } catch (err) {
            console.error('Import Error:', err);
            return next(CustomErrorHandler.serverError(err.message));
        }
    },
    async export(req, res, next) {
        try {
            const departments = await BusinessNatureTypes.find({})
                .select('name remark -_id');
            if (departments.length === 0) {
                return res.status(404).json({ message: 'No departments found' });
            }
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Fetched successfully',
                list: departments,  // Send only the selected fields
            });
        } catch (err) {
            console.error('Export Error:', err);
            return next(CustomErrorHandler.serverError(err.message));
        }
    }
};

export default BusinessNatureTypesController ;

import { Company } from '../../models/index.js';
import path from 'path';
import CustomErrorHandler from '../../utils/CustomErrorHandler.js';
import fs from 'fs';
import Joi from 'joi';
import capitalize from '../../utils/capitalize.js';

const CompanyController = {
    async store(req, res, next) {
        let avatarPath = null;
        let galleryPaths = [];
        if (req.files) {
            if (req.files.avatar) {
                avatarPath = `/uploads/${req.files.avatar[0].filename}`; // Avatar file path
            }
            if (req.files.gallery) {
                galleryPaths = req.files.gallery.map(file => `/uploads/${file.filename}`); // Gallery file paths
            }
        }
        const companyValidationSchema = Joi.object({
            CompanyName: Joi.string().required(),
            CompanyCode: Joi.string().required(),
            ClientGroup: Joi.string().required(),
            CompanyEntityType: Joi.string().required(),
            TradingLegalName: Joi.string().required(),
            RegistrationNumberCIN: Joi.string().required(),
            DateOfIncorporation: Joi.date().iso().required(),
            AddressLine1: Joi.string().required(),
            AddressLine2: Joi.string().required(),
            Country: Joi.string().required(),
            StateProvince: Joi.string().required(),
            City: Joi.string().required(),
            ZIPPincode: Joi.string().required(),
            Phone: Joi.string().required(),
            Email: Joi.string().email().required(),
            Remark: Joi.string().allow('', null),
            Website: Joi.string().uri().optional().allow('', null),
            CompanyLogo: Joi.string().optional(),
            avatar: Joi.string().optional(),
        });

        const { error } = companyValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
                status: 400,
            });
        }
        const {
            CompanyName,
            CompanyCode,
            ClientGroup,
            CompanyEntityType,
            TradingLegalName,
            RegistrationNumberCIN,
            DateOfIncorporation,
            AddressLine1,
            AddressLine2,
            Country,
            StateProvince,
            City,
            ZIPPincode,
            Phone,
            Email,
            Website,
            Remark
        } = req.body;
        const data = {
            CompanyName,
            CompanyCode,
            ClientGroup: JSON.parse(ClientGroup),
            CompanyEntityType: JSON.parse(CompanyEntityType),
            TradingLegalName,
            RegistrationNumberCIN,
            DateOfIncorporation,
            AddressLine1,
            AddressLine2,
            Country: JSON.parse(Country),
            StateProvince: JSON.parse(StateProvince),
            City,
            ZIPPincode,
            Phone,
            Email,
            Website,
            Remark,
            companyLogo: avatarPath
        };
        try {
            const existingCompany = await Company.findOne({ CompanyName: req.body.CompanyName });
            if (existingCompany) {
                return res.status(409).json({
                    message: 'already exists',
                    status: 409,
                    data: existingCompany,
                });
            }
            const newCompany = new Company({
                ...data,
                updatedAt: new Date(),
            });

            const savedCompany = await newCompany.save();
            return res.status(201).json({
                message: 'created successfully',
                status: 201,
                data: savedCompany,
            });
        } catch (err) {
            return next(CustomErrorHandler.serverError(err.message));
        }
    },
    async update(req, res, next) {
        const { id } = req.params;

        // Define Joi validation schema
        const companyValidationSchema = Joi.object({
            CompanyName: Joi.string().required(),
            CompanyCode: Joi.string().required(),
            ClientGroup: Joi.string().required(),
            CompanyEntityType: Joi.string().required(),
            TradingLegalName: Joi.string().required(),
            RegistrationNumberCIN: Joi.string().required(),
            DateOfIncorporation: Joi.date().iso().required(),
            AddressLine1: Joi.string().required(),
            AddressLine2: Joi.string().optional(),
            Country: Joi.string().required(),
            StateProvince: Joi.string().required(),
            City: Joi.string().required(),
            ZIPPincode: Joi.string().required(),
            Phone: Joi.string().required(),
            Email: Joi.string().email().required(),
            Remark: Joi.string().allow('', null),
            Website: Joi.string().uri().optional().allow('', null),
            CompanyLogo: Joi.string().optional(),
        });

        // Validate the incoming request body
        const { error } = companyValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        let avatarPath = null;
        let galleryPaths = [];

        // Handle file uploads
        if (req.files) {
            if (req.files.avatar) {
                avatarPath = `/uploads/${req.files.avatar[0].filename}`; // Avatar file path
            }
            if (req.files.gallery) {
                galleryPaths = req.files.gallery.map(file => `/uploads/${file.filename}`); // Gallery file paths
            }
        }

        // Destructure request body
        const {
            CompanyName,
            CompanyCode,
            ClientGroup,
            CompanyEntityType,
            TradingLegalName,
            RegistrationNumberCIN,
            DateOfIncorporation,
            AddressLine1,
            AddressLine2,
            Country,
            StateProvince,
            City,
            ZIPPincode,
            Phone,
            Email,
            Website,
            Remark
        } = req.body;

        // Prepare data to update
        const data = {
            CompanyName,
            CompanyCode,
            ClientGroup: JSON.parse(ClientGroup),
            CompanyEntityType: JSON.parse(CompanyEntityType),
            TradingLegalName,
            RegistrationNumberCIN,
            DateOfIncorporation,
            AddressLine1,
            AddressLine2,
            Country: JSON.parse(Country),
            StateProvince: JSON.parse(StateProvince),
            City,
            ZIPPincode,
            Phone,
            Email,
            Website,
            Remark,
            companyLogo: avatarPath,
        };
        try {
            // 1. Check if another company already exists with the same CompanyName
            const existingCompanyWithSameName = await Company.findOne({
                CompanyName,
                _id: { $ne: id }, // Exclude the current company being updated
            });

            if (existingCompanyWithSameName) {
                return res.status(409).json({ message: 'Company name already exists' });
            }

            // 2. Proceed to update if no duplicate company name is found
            const updatedCompany = await Company.findByIdAndUpdate(
                id,
                {
                    $set: {
                        ...data,
                        updatedAt: new Date(),
                    },
                },
                { new: true, runValidators: true }
            ).select('-password'); // Exclude password field from the response

            // If company is not found, send a 404 error
            if (!updatedCompany) {
                return res.status(404).json({ message: 'Company not found' });
            }

            // Respond with the updated company details
            res.status(200).json({
                message: 'Updated successfully',
                status: 200,
                data: updatedCompany,
            });
        } catch (err) {
            // Handle any errors that occur during the process
            return next(CustomErrorHandler.serverError(err.message));
        }
    },
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

            const result = await Company.deleteMany({ _id: { $in: ids } });

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
                Company.find(filter)
                    .select('-__v -updatedAt')
                    .sort(sort)
                    .skip(skip)
                    .limit(limitNum),
                Company.countDocuments(filter)
            ]);

            // Map through the documents to capitalize name and add other fields
            const list = documents.map((_data) => ({
                ..._data._doc,
                ..._data,
                GroupName: capitalize(_data.GroupName), // Capitalize the name
                GroupCode: _data.GroupCode,
                Remark: _data.Remark,
                id: _data._id,
                Country: _data.Country.label
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
            document = await Company.findOne({ _id: req.params.id }).select(
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
            const existingDepartments = await Company.find({
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
            const savedDepartments = await Company.insertMany(newDepartments);
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
            const departments = await Company.find({})
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

export default CompanyController;

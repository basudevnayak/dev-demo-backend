import { SubLocation } from '../../models/index.js';
import path from 'path';
import CustomErrorHandler from '../../utils/CustomErrorHandler.js';
import fs from 'fs';
import Joi from 'joi';
import capitalize from '../../utils/capitalize.js';
import multer from 'multer';
import Counter from '../../models/common/Counter.js';
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = './uploads';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);  // Create upload folder if it doesn't exist
//     }
//     cb(null, uploadDir);  // Define where to store the uploaded files
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);  // Get file extension
//     const filename = `${Date.now()}${ext}`;  // Generate a unique file name using timestamp
//     cb(null, filename);  // Define the file name
//   }
// });
// const upload = multer({ storage });
const SubLocationController = {
    async store(req, res, next) {
        try {
            const data = JSON.parse(req.body.data);
            let avatarPath = null;
            let galleryPaths = [];

            if (req.files) {
                if (req.files.avatar) {
                    avatarPath = `/uploads/${req.files.avatar[0].filename}`;
                }
                if (req.files.gallery) {
                    galleryPaths = req.files.gallery.map(file => `/uploads/${file.filename}`);
                }
            }
            const lastEntry = await SubLocation.findOne().sort({ serial_id: -1 }).select('serial_id');
            const lastSerialId = lastEntry?.serial_id || 11100;
            const newSerialId = lastSerialId + 1;
            const newData = {
                ...data,
                serial_id: newSerialId,
                AgreementUpload: galleryPaths[0],
                Logo: galleryPaths[1],
                updatedAt: new Date(),
            };

            const newSubLocation = new SubLocation(newData);
            const saved = await newSubLocation.save();

            return res.status(201).json({
                message: 'Created successfully',
                status: 201,
                data: saved,
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
                ...(query ? { Location: { $regex: query, $options: 'i' } } : {}),
                ...(Array.isArray(purchaseChannel) && purchaseChannel.length > 0
                    ? { PurchaseChannel: { $in: purchaseChannel } }
                    : {})
            };

            // Sorting object
            const sort = { [sortKey]: sortOrder === 'asc' ? 1 : -1 };

            // Fetch documents and total count in parallel
            const [documents, total] = await Promise.all([
                SubLocation.find(filter)
                    .select('-__v -updatedAt')
                    .sort(sort)
                    .skip(skip)
                    .limit(limitNum),
                SubLocation.countDocuments(filter)
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
        try {
            const documents = await SubLocation.find({ serial_id: req.params.id }).select('-updatedAt -__v');
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Fetched successfully',
                list:documents
            });

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(document);
    },
    // async getProducts(req, res, next) {
    //     let documents;
    //     try {
    //         documents = await Product.find({
    //             _id: { $in: req.body.ids },
    //         }).select('-updatedAt -__v');
    //     } catch (err) {
    //         return next(CustomErrorHandler.serverError());
    //     }
    //     return res.json(documents);
    // },
    // async import(req, res, next) {
    //     try {
    //         if (!Array.isArray(req.body) || req.body.length === 0) {
    //             return res.status(400).json({ message: 'No data provided' });
    //         }
    //         const customersToInsert = req.body
    //             .filter(item => item.name && item.name.trim() !== '')
    //             .map(item => ({
    //                 name: item.name,
    //                 remark: item.remark ? item.remark.trim() : '',
    //             }));
    //         if (customersToInsert.length === 0) {
    //             return res.status(400).json({ message: 'No valid customers to import' });
    //         }

    //         // Check for existing department names
    //         const existingDepartments = await Company.find({
    //             name: { $in: customersToInsert.map(item => item.name) },
    //         });
    //         const existingDepartmentNames = existingDepartments.map(department => department.name);
    //         const newDepartments = customersToInsert.filter(
    //             item => !existingDepartmentNames.includes(item.name)
    //         );

    //         if (newDepartments.length === 0) {
    //             return res.status(409).json({
    //                 status: 409,
    //                 message: 'Some data already exist'
    //             });
    //         }
    //         const savedDepartments = await Company.insertMany(newDepartments);
    //         return res.status(200).json({
    //             status: 200,
    //             message: 'Imported successfully',
    //             insertedCount: savedDepartments.length,
    //             data: savedDepartments,
    //             skippedCount: customersToInsert.length - savedDepartments.length,
    //             skippedDepartments: existingDepartmentNames,
    //         });
    //     } catch (err) {
    //         console.error('Import Error:', err);
    //         return next(CustomErrorHandler.serverError(err.message));
    //     }
    // },
    // async export(req, res, next) {
    //     try {
    //         const departments = await Company.find({})
    //             .select('name remark -_id');
    //         if (departments.length === 0) {
    //             return res.status(404).json({ message: 'No departments found' });
    //         }
    //         return res.status(200).json({
    //             status: 200,
    //             success: true,
    //             message: 'Fetched successfully',
    //             list: departments,  // Send only the selected fields
    //         });
    //     } catch (err) {
    //         console.error('Export Error:', err);
    //         return next(CustomErrorHandler.serverError(err.message));
    //     }
    // }
};

export default SubLocationController;

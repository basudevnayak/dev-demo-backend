import { AwardTypes } from '../../models/index.js';
import CustomErrorHandler from '../../utils/CustomErrorHandler.js';
import QRCode from 'qrcode';
import Joi from 'joi';
const QrCodeController = {
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
            const exists = await AwardTypes.findOne({ name });
            if (exists) {
                return res.status(409).json({
                    message: 'Department already exists',
                    status: 409,
                    data: exists,
                });
            }

            const department = new AwardTypes({
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
    async qrCodeGenerate(req, res, next) {
        const schema = Joi.object({
            phone: Joi.string().min(1).required(),
        });
        
        const { error } = schema.validate(req.params);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
                status: 400,
            });
        }
        
        const { phone } = req.params;

        try {
            const qrCodeDataUrl = await QRCode.toDataURL(phone);
            return res.status(200).json({
                message: 'QR code generated successfully',
                status: 200,
                data: {
                    phone,
                    qrCode: qrCodeDataUrl, // base64 QR code string
                },
            });
        } catch (err) {
            return next(CustomErrorHandler.serverError(err.message));
        }
    }
}

export default QrCodeController;

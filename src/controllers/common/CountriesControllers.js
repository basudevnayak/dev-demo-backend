import { Countries } from '../../models/index.js';
import capitalize  from '../../utils/capitalize.js'
const StatesController = {
    async index(req, res, next) {
        try {
            const statesList = await Countries.find().select('-__v -updatedAt').sort({ name: 1 });
            const total = statesList.length;
            const list = statesList.map((_data) => ({
                ..._data._doc,
                name: capitalize(_data.name),
                code: _data.code,
                id: _data._id,
                idCode: _data.id,
            }));
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Fetched successfully',
                list,
                total,
            });
        } catch (err) {
            return next(CustomErrorHandler.serverError(err.message));
        }
    }

};

export default StatesController;
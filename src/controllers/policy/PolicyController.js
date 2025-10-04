import { Policies } from "../../models/index.js";
import { REFRESH_SECRET } from "../../config/index.js";
import JwtService from "../../utils/JwtService.js";

const PolicyController = {
  // ✅ Get all policies
  async index(req, res) {
    try {
      // const policies = await Policies.find();
      const userGmail = req.headers['email']
      const policies = await Policies.find({ userGmail })
      const data = policies.map(p => ({
        ...p.toObject(),
        nextDueDate: p.nextDueDate,
        investedSoFar: p.investedSoFar
      }));
      return res.json({ status: 200, data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Create new policy
  async create(req, res) {
    try {
      const userGmail = req.headers['usergmail'];
      const {
        createDate,       // string: "YYYY-MM-DD"
        planTerm,         // number of years
        installmentFreq,  // "Monthly", "Quarterly", "Yearly"
        ...rest
      } = req.body;
      const startDate = new Date(createDate);
      const endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + Number(planTerm));
      const installmentDates = [];
      let current = new Date(startDate);

      let monthsToAdd;
      switch (installmentFreq) {
        case "Monthly":
          monthsToAdd = 1;
          break;
        case "Quarterly":
          monthsToAdd = 3;
          break;
        case "Yearly":
          monthsToAdd = 12;
          break;
        default:
          monthsToAdd = 0; // no installments
      }
      if (monthsToAdd > 0) {
        const totalInstallments = (Number(planTerm) * 12) / monthsToAdd;
        for (let i = 0; i < totalInstallments; i++) {
          current = new Date(current.setMonth(current.getMonth() + monthsToAdd));
          installmentDates.push(new Date(current));
        }
      }
      const policyData = {
        ...rest,
        userGmail,
        createDate: startDate,
        endDate,
        installmentFreq,
        installmentDates
      };
      const policy = new Policies(policyData);
      const result = await policy.save();
      const access_token = JwtService.sign({ _id: result._id, role: result.role });
      return res.status(201).json({
        message: "Policy created successfully",
        status: 201,
        data: result,
        token: access_token,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error creating policy",
        status: 400,
        error: err.message,
      });
    }
  },
  async show(req, res) {
    try {
      const policy = await Policies.findById(req.params.id);
      if (!policy) {
        return res.status(404).json({
          message: "Policy not found",
          status: 404,
        });
      }
      return res.status(200).json({
        message: "Policy fetched successfully",
        status: 200,
        data: policy,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error fetching policy",
        status: 500,
        error: err.message,
      });
    }
  },

  // ✅ Update policy
  async update(req, res) {
    try {
      const updated = await Policies.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(404).json({
          message: "Policy not found",
          status: 404,
        });
      }

      return res.status(200).json({
        message: "Policy updated successfully",
        status: 200,
        data: updated,
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error updating policy",
        status: 400,
        error: err.message,
      });
    }
  },

  // ✅ Delete policy
  async destroy(req, res) {
    try {
      const deleted = await Policies.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          message: "Policy not found",
          status: 404,
        });
      }

      return res.status(200).json({
        message: "Policy deleted successfully",
        status: 200,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error deleting policy",
        status: 500,
        error: err.message,
      });
    }
  },
};

export default PolicyController;

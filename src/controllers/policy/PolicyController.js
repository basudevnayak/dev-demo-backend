import { Policies } from "../../models/index.js";
import { REFRESH_SECRET } from "../../config/index.js";
import JwtService from "../../utils/JwtService.js";

const PolicyController = {
  // ✅ Get all policies
  async index(req, res) {
    try {
      const policies = await Policies.find();
      if (!policies || policies.length === 0) {
        return res.status(404).json({
          message: "No policies found",
          status: 404,
        });
      }
      return res.status(200).json({
        message: "Policies fetched successfully",
        status: 200,
        data: policies,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Server error fetching policies",
        status: 500,
        error: err.message,
      });
    }
  },

  // ✅ Create new policy
  async create(req, res) {
    try {
         const policyData = {
      ...req.body,
      status: "active",
    };
      const policy = new Policies(policyData);
      const result = await policy.save();

      // Access token (optional for policies)
      const access_token = JwtService.sign({ _id: result._id, role: result.role });
      const refresh_token = JwtService.sign(
        { _id: result._id, role: result.role },
        "1y",
        REFRESH_SECRET
      );

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

  // ✅ Get single policy by ID
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

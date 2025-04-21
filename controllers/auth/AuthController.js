import { User, RefreshToken } from "../../models/index.js";
import generateToken from "../../utils/generateToken.js";
import { REFRESH_SECRET } from "../../config/index.js";
import JwtService from "../../utils/JwtService.js";
import Joi from 'joi';
import bcrypt from 'bcrypt';
import CustomErrorHandler from "../../utils/CustomErrorHandler.js";
const AuthController = {
  // Assuming User is your Mongoose model
  async index(req, res, next) {
    try {
      // Fetch all users from the database, excluding the password for security
      const users = await User.find().select('-password'); // Excludes the password field

      // If no users are found
      if (!users || users.length === 0) {
        return res.status(404).json({
          message: 'No users found',
          status: 404,
        });
      }

      // Send the list of users back in the response
      res.status(200).json({
        message: 'Users fetched successfully',
        status: 200,
        data: users,
      });
    } catch (err) {
      return next(err);
    }
  },

  async register(req, res, next) {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      repeat_password: Joi.ref('password'),
      phoneNumber: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .message('Phone number must be exactly 10 digits.')
        .required(),
      role: Joi.string().valid('admin', 'user').default('user'), // Default to 'user'
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        status: 400,
      });
    }

    const { name, email, password, phoneNumber, role } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      console.log(existingUser)
      if (existingUser) {
        return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user with the specified role (either 'admin' or 'user')
      const user = new User({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        role, // Store the role in the database
      });

      // Save the user to the database
      const result = await user.save();

      // Generate tokens (access token and refresh token)
      const access_token = JwtService.sign({ _id: result._id, role: result.role });
      const refresh_token = JwtService.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);

      // Respond with the user data and the tokens
      res.json({
        user: {
          id: result._id,
          userName: result.name,
          email: result.email,
          phoneNumber: result.phoneNumber,
          role: result.role, // Return role in response
        },
        access_token,
        refresh_token,
      });
    } catch (err) {
      return next(err);
    }
  },

  async login(req, res, next) {
    // Validation schema for email and password
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    });

    // Validate the input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error); // Pass validation error to the next middleware
    }

    try {
      // Look for the user by email
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // Compare the submitted password with the hashed password in the database
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // Generate the access token
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

      // Save the refresh token to the database (whitelist it)
      await RefreshToken.create({ token: refresh_token });

      // Return the user data and the tokens
      res.json({
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
          avatar: user.avatar, // Optional, if you have avatar in your user schema
          authority: user.role === 'admin' ? ['admin', 'user'] : ['user'],
          accountUserName: user.accountUserName || user.email, // You can return custom name here
        },
        token: access_token,
      });
    } catch (err) {
      return next(err); // Pass any other errors to the next middleware
    }
  },
  async logout(req, res, next) {
    try {
      // validation
      const refreshSchema = Joi.object({
        refresh_token: Joi.string().required(),
      });
      const { error } = refreshSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      try {
        await RefreshToken.deleteOne({ token: req.body.refresh_token });
      } catch (err) {
        return next(new Error('Something went wrong in the database'));
      }
      res.json({ status: 1 });
    } catch (error) {
      res.json({ error });
    }
  },
  async destroy(req, res, next) {
    const { userId } = req.params;
    try {
      // Ensure the user exists
      const user = await User.findById("6804cd4d0d6481a34cdf855a");
      console.log(user)
      if (!user) {
        return next(CustomErrorHandler.notFound('User not found.'));
      }

      // Delete the user from the database
      await User.findByIdAndDelete(userId);

      // Optionally, you may want to also delete associated data such as refresh tokens
      await RefreshToken.deleteMany({ userId });

      res.status(200).json({
        message: 'User deleted successfully',
        status: 200,
      });
    } catch (err) {
      return next(err);
    }
  }
};




export default AuthController;

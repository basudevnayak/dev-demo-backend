import CustomErrorHandler from '../utils/CustomErrorHandler.js';
import JwtService from '../utils/JwtService.js';

const auth = async (req, res, next) => {
  const token = req?.cookies?.token;

  if (!token) return res.redirect('/');

  try {
    const { _id, role } = await JwtService.verify(token);
    req.user = { _id, role };
    next();
    // return res.redirect('/dashboard');
  } catch (err) {
    console.log("Token invalid:", err.message);
    return res.redirect('/');
  }
};

export default auth;

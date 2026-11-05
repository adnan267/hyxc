import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { Admin } from '../models/index.js';
import { HttpError, asyncHandler } from '../utils/helpers.js';

/* ---------- JWT auth for admin routes ---------- */
export const requireAdmin = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new HttpError(401, 'Authentication required');
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new HttpError(401, 'Session expired. Please sign in again.');
  }
  const admin = await Admin.findById(payload.id);
  if (!admin) throw new HttpError(401, 'Account no longer exists');
  req.admin = admin;
  next();
});

/* ---------- Zod validation ---------- */
export const validate = (schema) => (req, _res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    next(err);
  }
};

/* ---------- 404 + error handler ---------- */
export const notFound = (req, _res, next) => next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(422).json({
      message: 'Please check the highlighted fields.',
      errors: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => ({ field: e.path, message: e.message })),
    });
  }
  if (err.code === 11000) return res.status(409).json({ message: 'A record with the same unique value already exists.' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid identifier.' });
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: status >= 500 ? 'Something went wrong on our side.' : err.message });
};

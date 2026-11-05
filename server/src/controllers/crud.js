import { asyncHandler, HttpError, pick, slugify } from '../utils/helpers.js';

/**
 * Generic CRUD factory used for Services, Projects and Testimonials.
 * - Public handlers only return published records.
 * - Admin handlers return everything and allow writes.
 */
export function createCrud(Model, { fields, sort = { createdAt: -1 }, slugField = null, publicFilter = { published: true } }) {
  const pickBody = (body) => {
    const data = pick(body, fields);
    if (slugField && data.slug) data.slug = slugify(data.slug);
    return data;
  };

  return {
    // ---- public ----
    listPublic: asyncHandler(async (req, res) => {
      const filter = { ...publicFilter };
      if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
      if (req.query.featured === 'true') filter.featured = true;
      const limit = Math.min(parseInt(req.query.limit, 10) || 100, 200);
      res.json(await Model.find(filter).sort(sort).limit(limit).lean());
    }),
    getPublic: asyncHandler(async (req, res) => {
      const doc = await Model.findOne({ ...publicFilter, slug: req.params.slug }).lean();
      if (!doc) throw new HttpError(404, 'Not found');
      res.json(doc);
    }),
    // ---- admin ----
    listAdmin: asyncHandler(async (_req, res) => res.json(await Model.find().sort(sort).lean())),
    getAdmin: asyncHandler(async (req, res) => {
      const doc = await Model.findById(req.params.id).lean();
      if (!doc) throw new HttpError(404, 'Not found');
      res.json(doc);
    }),
    create: asyncHandler(async (req, res) => {
      const doc = await Model.create(pickBody(req.body));
      res.status(201).json(doc);
    }),
    update: asyncHandler(async (req, res) => {
      const doc = await Model.findById(req.params.id);
      if (!doc) throw new HttpError(404, 'Not found');
      doc.set(pickBody(req.body));
      await doc.save();
      res.json(doc);
    }),
    remove: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw new HttpError(404, 'Not found');
      res.json({ message: 'Deleted' });
    }),
  };
}

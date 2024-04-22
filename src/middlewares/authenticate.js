// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';

export default function authenticate(req, res, next) {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    req.managerId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
}

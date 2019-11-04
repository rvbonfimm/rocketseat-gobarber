import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';
import * as yup from 'yup';

class SessionController {
  async store(req, res) {
    const schema = yup.object().shape({
      email: yup.string().email(),
      password: yup.string().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation errors' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const passwordMatch = await user.checkPassword(password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();

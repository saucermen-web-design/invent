import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import { createUser, pool } from '../models/user';
import rateLimit from 'express-rate-limit';
import { RowDataPacket, OkPacket } from 'mysql2';

const SALT_ROUNDS = 10;

// Limit requests to /login to 5 requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please wait a minute and try again",
});

const router: Router = Router();

router.get('/new', (req: Request, res: Response) => {
  res.render('users/new');
});

router.post('/users/signup', async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await createUser(username, hashedPassword, email);
    res.redirect('/users/login');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/login', (req: Request, res: Response) => {
  res.render('users/login');
});

router.post('/login', limiter, async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
    if (Array.isArray(rows) && rows.length > 0) {
      const { id, username, password: hashedPassword, email } = rows[0] as RowDataPacket;
      const doesPasswordMatch = await bcrypt.compare(password, hashedPassword);
      if (doesPasswordMatch) {
        req.session.userId = id;
        res.redirect('/items');
      } else {
        res.redirect('/users/login');
      }
    } else {
      res.redirect('/users/login');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/dashboard', (req: Request, res: Response) => {
  if (req.session.userId) {
    const user = req.session.userId;
    res.render('users/dashboard', { user });
  } else {
    res.redirect('/users/login');
  }
});

router.get('/logout', (req: Request, res: Response) => {
  req.session.destroy();
  res.redirect('/');
});

export default router;

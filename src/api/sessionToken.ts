// pages/api/proxy.ts

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { tokenData } = req.body;
    if (!tokenData) {
      throw new NoTokenDataError('no token data');
    }

    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) {
      throw new NoSessionSecret('no session secret');
    }

    const expiresIn = '10m';

    const token = jwt.sign(tokenData, sessionSecret, { expiresIn });
    res.setHeader('Set-Cookie', `sessionToken=${token}; Path=/; Max-Age=${expiresIn}; SameSite=Lax`);

    return res.status(201).json({ message: 'ok' });
  } catch (err) {
    if (err instanceof NoTokenDataError) {
      console.error(err);
      return res.status(400).json({ message: err.message });
    }

    if (err instanceof NoSessionSecret) {
      console.error(err.message);
      return res.status(500).json({ message: err.message });
    }
  }
}

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

class NoTokenDataError extends CustomError {}
class NoSessionSecret extends CustomError {}

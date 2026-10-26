import { config } from '../lib/handler.js';

export default function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  res.status(200).json(config(process.env));
}

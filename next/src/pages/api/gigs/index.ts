import type { NextApiRequest, NextApiResponse } from 'next';
import { getEventsUrl } from '@/helpers/ticketmaster';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { date } = req.query;

  const url = getEventsUrl(new Date(date as string));

  const response = await fetch(url);
  const data = await response.json();

  res.status(200).json(data);
}

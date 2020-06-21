import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req;

  if (method !== 'POST') {
    res.status(404).end();
  }

  try {
    const { data, headers: returnedHeaders } = await axios.post('http://localhost:8080/dev/login', body, { headers });
    Object.keys(returnedHeaders).forEach(key => res.setHeader(key, returnedHeaders[key]));
    res.status(200).json(data);
  } catch (e) {
    const { response } = e;
    const { status, data } = response;
    res.status(status).json(data);
  }
}
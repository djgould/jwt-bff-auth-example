import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body } = req;

  if (method !== 'GET') {
    res.status(404).end();
  }

  try {
    const { data, headers: returnedHeaders } = await axios.get('http://localhost:8080/dev/refresh', { headers });
    Object.keys(returnedHeaders).forEach(key => res.setHeader(key, returnedHeaders[key]));
    console.log('data', data);
    console.log('headers', headers);
    res.status(200).json(data);
  } catch (e) {
    const { response } = e;
    const { status, data } = response;
    res.status(status).json(data);
  }
}
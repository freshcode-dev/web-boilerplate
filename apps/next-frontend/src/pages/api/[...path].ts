import httpProxy from 'http-proxy'
import { INTERNAL_API_BASE_URL } from '@/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

const proxy = httpProxy.createProxyServer()

// Make sure that we don't parse JSON bodies on this route:
export const config = {
	api: {
		bodyParser: false,
	},
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse): Promise<void> {
	return new Promise((resolve, reject) => {
		proxy.web(req, res, { target: INTERNAL_API_BASE_URL, changeOrigin: true }, (err) => {
			if (err) {
				return reject(err)
			}
			resolve()
		})
	})
}

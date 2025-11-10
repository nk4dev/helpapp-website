export default function handler(
    req,
    res,
) {
    if (req.method === 'GET') {
        res.status(200).json({ status: 'API is working' });
    } else if (req.method === 'POST') {
        const { data } = req.body;
        res.status(200).json({ receivedData: data, status: 'Data received successfully' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
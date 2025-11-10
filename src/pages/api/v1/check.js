export default function handler(
    req,
    res,
) {
    try {

        if (req.method === 'GET') {
            res.status(200).json({ status: 'API is working' });
        } else if (req.method === 'POST') {
            // Expecting JSON body in the shape: { "data": "A" }
            // Fall back to legacy { text: "..." } or raw string body for compatibility.
            let data;
            if (req.body && typeof req.body === 'object') {
                if (typeof req.body.data !== 'undefined') {
                    data = req.body.data;
                } else if (typeof req.body.text !== 'undefined') {
                    data = req.body.text; // legacy support
                }
            } else if (typeof req.body === 'string') {
                // raw body as string
                data = req.body;
            }

            if (typeof data === 'undefined' || data === null) {
                return res.status(400).json({ error: 'Invalid request body. Expected JSON: {"data": "..."}' });
            }

            // Respond with the received data (you can replace this with real processing)
            return res.status(200).json({ data });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
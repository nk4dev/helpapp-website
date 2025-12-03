import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            try {
                const places = await prisma.place.findMany({ orderBy: { createdAt: 'desc' } });
                return res.status(200).json(places);
            } catch (dbErr) {
                console.error('Prisma error in /place/list', dbErr);
                if (dbErr && (dbErr.code === 'ECONNREFUSED' || (dbErr.cause && dbErr.cause.code === 'ECONNREFUSED'))) {
                    return res.status(503).json({ error: 'Database unavailable', details: 'Cannot connect to database (ECONNREFUSED)' });
                }
                // Return 500 with details for developer debugging
                return res.status(500).json({ error: 'Prisma error', details: dbErr.message });
            }
        }
        if (req.method === 'POST') {
            // Accepts a filter query, or insert could be handled by /add
            return res.status(405).json({ error: 'Use /add to insert' });
        }
        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API /place/list error', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
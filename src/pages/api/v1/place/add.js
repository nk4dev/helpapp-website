import prisma from '../../../../lib/prisma';
// const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { name, description, category, latitude, longitude } = req.body;
    if (!name || !category || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const place = await prisma.place.create({
      data: {
        name,
        description: description || '',
        category,
        latitude,
        longitude,
      },
    });

    res.status(201).json(place);
  } catch (err) {
    console.error('API /place/add error', err);
    // More friendly error when DB is down
    if (err && (err.code === 'ECONNREFUSED' || (err.cause && err.cause.code === 'ECONNREFUSED'))) {
      return res.status(503).json({ error: 'Database unavailable', details: 'Cannot connect to database (ECONNREFUSED)' });
    }
    res.status(500).json({ error: 'Internal error', details: err.message });
  }
}

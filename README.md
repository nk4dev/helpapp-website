helpapp

## API Routes
`/api/data/helper`
`/api/data/location`
`/api/data/user`
`/api/data/spot`

`/api/signal/up`

## Development
Install dependencies and start dev server:

```pwsh
bun install
bun run dev
```

## Mapbox Setup
To enable the map page at `pages/places` create a `.env.local` file:

```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_public_token_here
```

Get a public access token from: https://account.mapbox.com/
Then restart the dev server. Missing token will log an error in console.

## Firebase Environment
Ensure these are set in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Prisma (Local dev)

This app includes a Prisma schema for storing `Place` entries. For local development we use SQLite.

Commands:

```pwsh
# Install dependencies
bun install

# If using Postgres (recommended in production), set DATABASE_URL in .env (example below)
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/machimaka"

# Generate Prisma client
npx prisma generate

# Create migrations and apply to Postgres (this will interact with your Postgres server)
# - If starting from scratch and you don't have matching migrations, you may need
#   to remove the existing migrations folder and run the following to create a new migration:
npx prisma migrate dev --name init_places_schema

# Start dev server
bun run dev
```

If you change `prisma/schema.prisma`, re-run the migrate and generate commands.


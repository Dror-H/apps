## HO TO RUN THE BACKEND FOR THE FIRST TIME

### 1 RUN:

`npm run database:down && npm run database:up`

`dotenv -e apps/audiences-api/.env -- npx prisma migrate deploy --schema ./apps/audiences-api/prisma/schema.prisma`

`npm run start audiences-api`

### 2 Login with facebook for the first time

https://localhost:3001/auth/facebook/login

### 3 CALL THE NEXT ENDPOINTS IN THIS ORDER:

https://localhost:3001/cron/crawl-facebook-accounts
https://localhost:3001/cron/seed-facebook-segments
https://localhost:3001/cron/rebuild-index

```
npm run prisma -- generate --schema=./apps/audiences-api/prisma/schema.prisma
```

## Create new migration

`dotenv -e apps/audiences-api/.env -- npx prisma migrate dev --create-only --schema ./apps/audiences-api/prisma/schema.prisma`
`npm run prisma -- generate --schema=./apps/audiences-api/prisma/schema.prisma`

# Prisma next auth

This is a [T3 Stack](https://create.t3.gg/) project using Next Auth (credentials), Prisma, shadcn, ...

## Getting Started

First copy the `.env.dist` file to `.env` and fill in the necessary values.

```bash
cp .env.dist .env
```

Then install the dependencies:

```bash
pnpm install
```

Then make sure the database is up to date:

```bash
pnpm prisma db push
pnpm prisma generate
```

Then run the development server:

```bash
pnpm dev
```
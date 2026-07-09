# NestJS with Prisma + Neon Serverless PostgreSQL

This project is a NestJS application integrated with **Prisma ORM** and **Neon** serverless PostgreSQL.

---

## 🚀 Getting Started

### 1. Prerequisites & Environment Setup
Make sure you have your PostgreSQL connection string from Neon.

Create/update your `.env` file in the root of the `prisma-neon` directory:
```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require"
```
> [!IMPORTANT]
> Under Prisma v7, the database connection URL is declared and managed in the `.env` file and mapped in `prisma.config.ts`, not inside `schema.prisma`.

---

## 🛠️ Prisma Configuration & Commands

We have added helper commands in `package.json` to simplify your workflow:

### **Generate Client Types**
Run this whenever you change your schema to regenerate the Prisma client types locally:
```bash
npm run prisma:generate
```

### **Run Migrations**
Apply your schema changes to the database and generate a new migration:
```bash
npm run prisma:migrate
```

### **Push Schema to Database**
Pushes the state of your Prisma schema file directly to the database without creating a migration file. This is ideal for rapid prototyping or early development:
```bash
npm run prisma:push
```

### **Open Prisma Studio**
Launch the graphical browser-based database manager to view/edit your data:
```bash
npm run prisma:studio
```

---

## 🆚 `prisma db push` vs `prisma migrate dev`

When syncing your schema changes with your database, you can choose between two commands:

| Feature / Aspect | `npm run prisma:push` | `npm run prisma:migrate` |
| :--- | :--- | :--- |
| **How it works** | Directly updates the database schema to match your `schema.prisma`. | Generates SQL migration files and executes them. |
| **History** | **No history** is saved. | Saves a chronological **SQL migration history** in `prisma/migrations/`. |
| **Speed** | **Fast** (best for rapid prototyping, quick test databases). | **Slower** (requires naming migrations and generating SQL). |
| **Production Ready** | ⚠️ No. Avoid using this in production. | Yes. Always use migrations for production. |
| **Use case** | Local prototyping, ephemeral/temp databases, serverless DB changes. | Shared team projects, staging, and production environments. |

---

## 📐 Schema Definition

Define your models in `prisma/schema.prisma`. 

*Example model configuration:*
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

---

## 💉 Using Prisma in NestJS Code

We have initialized a wrapper around the `PrismaClient` to handle the connection lifecycle and hook up the PostgreSQL driver adapter required by Prisma 7:

### 1. The Prisma Service (`src/prisma/prisma.service.ts`)
This class extends `PrismaClient` with the pg-driver pool adapter, automatically connecting on startup and disconnecting on shutdown:
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### 2. The Prisma Module (`src/prisma/prisma.module.ts`)
This exports the `PrismaService` so you can use it in other NestJS feature modules:
```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 3. Usage Example (Injecting Prisma Service)
To use it in your controllers or services, import `PrismaModule` into your module and inject `PrismaService`:

```typescript
// users.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
})
export class UsersModule {}
```

```typescript
// users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }
}
```

---

## 🏃 Running NestJS Development Server

Start compilation in watch mode:
```bash
npm run start:dev
```

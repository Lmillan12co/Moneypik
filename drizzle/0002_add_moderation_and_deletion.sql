-- Moneypik — Migración 0002: moderación de contenido y borrado de cuenta.
--
-- Se aplica con: pnpm db:push  (drizzle-kit generate && drizzle-kit migrate)
-- contra la base de datos MySQL de producción, DESPUÉS de copiar
-- drizzle/schema.ts al repo y ANTES de desplegar el backend con los
-- routers nuevos. Hacer copia de seguridad de la base antes de migrar.
--
-- Crea solo 3 tablas nuevas; no toca ninguna tabla existente.

CREATE TABLE `reports` (
  `id` int AUTO_INCREMENT NOT NULL,
  `reporterUserId` int NOT NULL,
  `postId` int,
  `reportedUserId` int,
  `reason` enum('spam','contenido_sexual','violencia','acoso','fraude','otro') NOT NULL,
  `details` text,
  `status` enum('pending','reviewed','action_taken','dismissed') DEFAULT 'pending' NOT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);

CREATE TABLE `userBlocks` (
  `id` int AUTO_INCREMENT NOT NULL,
  `blockerUserId` int NOT NULL,
  `blockedUserId` int NOT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT `userBlocks_id` PRIMARY KEY(`id`)
);

CREATE TABLE `deletionRequests` (
  `id` int AUTO_INCREMENT NOT NULL,
  `email` varchar(320) NOT NULL,
  `userId` int,
  `status` enum('pending','completed') DEFAULT 'pending' NOT NULL,
  `requestedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `processedAt` timestamp,
  CONSTRAINT `deletionRequests_id` PRIMARY KEY(`id`)
);

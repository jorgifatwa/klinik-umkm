-- Create enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'KONSULTAN', 'UMKM');
CREATE TYPE "ConsultationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- Create users table
CREATE TABLE "User" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text,
  "email" text NOT NULL UNIQUE,
  "passwordHash" text,
  "role" "Role" NOT NULL DEFAULT 'UMKM',
  "emailVerified" timestamp(3),
  "image" text,
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt" timestamp(3) NOT NULL DEFAULT now()
);

-- Create business profiles
CREATE TABLE "BusinessProfile" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL UNIQUE,
  "businessName" text NOT NULL,
  "industry" text NOT NULL,
  "establishedYear" integer NOT NULL,
  "employeeCount" integer NOT NULL,
  "monthlyRevenue" double precision NOT NULL,
  "monthlyProfit" double precision NOT NULL,
  "initialCapital" double precision NOT NULL,
  "location" text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt" timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "BusinessProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create financial assessments
CREATE TABLE "FinancialAssessment" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  "monthlyRevenue" double precision NOT NULL,
  "priorRevenue" double precision NOT NULL,
  "operatingCost" double precision NOT NULL,
  "payrollCost" double precision NOT NULL,
  "otherCost" double precision NOT NULL,
  "totalDebt" double precision NOT NULL,
  "monthlyInstallment" double precision NOT NULL,
  "businessCapital" double precision NOT NULL,
  "cashBalance" double precision NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt" timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "FinancialAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create financial scores
CREATE TABLE "FinancialScore" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "assessmentId" uuid NOT NULL UNIQUE,
  "profitabilityScore" integer NOT NULL,
  "liquidityScore" integer NOT NULL,
  "debtScore" integer NOT NULL,
  "growthScore" integer NOT NULL,
  "finalScore" integer NOT NULL,
  "category" text NOT NULL,
  "strengths" text[] NOT NULL,
  "weaknesses" text[] NOT NULL,
  "recommendations" text[] NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "FinancialScore_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "FinancialAssessment"("id") ON DELETE CASCADE
);

-- Create roadmaps
CREATE TABLE "Roadmap" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  "assessmentId" uuid,
  "target3Months" text NOT NULL,
  "target6Months" text NOT NULL,
  "target1Year" text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt" timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "Roadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "Roadmap_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "FinancialAssessment"("id") ON DELETE SET NULL
);

-- Create roadmap tasks
CREATE TABLE "RoadmapTask" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "roadmapId" uuid NOT NULL,
  "title" text NOT NULL,
  "completed" boolean NOT NULL DEFAULT false,
  CONSTRAINT "RoadmapTask_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE
);

-- Create consultants
CREATE TABLE "Consultant" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL UNIQUE,
  "bio" text NOT NULL,
  "speciality" text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt" timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "Consultant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create consultations
CREATE TABLE "Consultation" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  "consultantId" uuid NOT NULL,
  "scheduledAt" timestamp(3) NOT NULL,
  "status" "ConsultationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt" timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "Consultation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "Consultation_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "Consultant"("id") ON DELETE CASCADE
);

-- Create consultation notes
CREATE TABLE "ConsultationNote" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "consultationId" uuid NOT NULL,
  "content" text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "ConsultationNote_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE
);

-- Create categories for articles
CREATE TABLE "Category" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL UNIQUE,
  "slug" text NOT NULL UNIQUE,
  "createdAt" timestamp(3) NOT NULL DEFAULT now()
);

-- Create articles
CREATE TABLE "Article" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "excerpt" text NOT NULL,
  "content" text NOT NULL,
  "published" boolean NOT NULL DEFAULT false,
  "categoryId" uuid NOT NULL,
  "authorId" uuid NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt" timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT,
  CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create templates
CREATE TABLE "Template" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "description" text NOT NULL,
  "filePath" text NOT NULL,
  "category" text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now()
);

-- Create forum topics
CREATE TABLE "ForumTopic" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "content" text NOT NULL,
  "category" text NOT NULL,
  "authorId" uuid NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt" timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "ForumTopic_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create forum comments
CREATE TABLE "ForumComment" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "topicId" uuid NOT NULL,
  "authorId" uuid NOT NULL,
  "content" text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "ForumComment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic"("id") ON DELETE CASCADE,
  CONSTRAINT "ForumComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create forum likes
CREATE TABLE "ForumLike" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "topicId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "ForumLike_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic"("id") ON DELETE CASCADE,
  CONSTRAINT "ForumLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "ForumLike_topicId_userId_key" UNIQUE ("topicId", "userId")
);

-- Create chat history
CREATE TABLE "ChatHistory" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  "sessionId" text NOT NULL,
  "question" text NOT NULL,
  "answer" text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "ChatHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

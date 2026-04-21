import fs from "fs";
import path from "path";

export interface EnvValidationError {
  missing: string[];
  suggestions: string[];
}

const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
] as const;

const RECOMMENDED_ENV_VARS = [
  "PORT",
  "NODE_ENV",
  "REDIS_URL",
  "LOG_LEVEL",
  "LOG_DIR",
] as const;

export function validateEnvironment(): void {
  const envPath = path.join(process.cwd(), ".env");
  const envExists = fs.existsSync(envPath);
  const examplePath = path.join(process.cwd(), "env.example");
  const exampleExists = fs.existsSync(examplePath);

  if (!envExists) {
    throw new Error(`Missing required .env file. See error above for details.`);
  }

  const envContent = fs.readFileSync(envPath, "utf-8");
  const envLines = envContent.split("\n");

  const missingRequired: string[] = [];
  const missingRecommended: string[] = [];

  for (const varName of REQUIRED_ENV_VARS) {
    if (!envContent.includes(`${varName}=`)) {
      missingRequired.push(varName);
    }
  }

  for (const varName of RECOMMENDED_ENV_VARS) {
    if (!envContent.includes(`${varName}=`)) {
      missingRecommended.push(varName);
    }
  }

  if (missingRequired.length > 0) {
  }

  if (missingRecommended.length > 0 && process.env.NODE_ENV === "development") {
  }

  const hasEmptyValues = envLines.some((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return false;
    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=");
    return (
      !key.startsWith("#") && (value === "" || value === '""' || value === "''")
    );
  });

  if (hasEmptyValues) {
  }
}

export function getEnvSuggestions(): string[] {
  const suggestions: string[] = [];

  if (!process.env.DATABASE_URL) {
    suggestions.push(
      "DATABASE_URL=postgresql://username:password@localhost:5432/dbname",
    );
  }

  if (!process.env.JWT_SECRET) {
    suggestions.push("JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars");
  }

  if (!process.env.JWT_REFRESH_SECRET) {
    suggestions.push(
      "JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-min-32-chars",
    );
  }

  if (!process.env.REDIS_URL) {
    suggestions.push("REDIS_URL=redis://localhost:6379");
  }

  return suggestions;
}

export function logEnvironmentInfo(): void {
}

if (require.main === module) {
  try {
    validateEnvironment();
    logEnvironmentInfo();
  } catch (error) {
    process.exit(1);
  }
}

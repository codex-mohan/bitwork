import { write } from "bun";

const TASKS = [{ path: "packages/db/.env", name: "Database Package" }];

console.log("\nEnvironment Setup\n");
console.log(
  "This script will set up the environment variables for your applications."
);
console.log("It will create .env files in packages/db.\n");

// biome-ignore lint/suspicious/noAlert: CLI script
const dbUrl = prompt("Enter your DATABASE_URL:");

if (!dbUrl?.trim()) {
  console.error("Error: DATABASE_URL cannot be empty.");
  process.exit(1);
}

// biome-ignore lint/suspicious/noAlert: CLI script
const groqKey = prompt("Enter your GROQ_API_KEY (press Enter to skip):");
const openaiKey = prompt(
  "Enter your OPENAI_API_KEY for TTS (press Enter to skip):"
);

const dbContent = `DATABASE_URL="${dbUrl.trim()}"\n`;
const webContent = `DATABASE_URL="${dbUrl.trim()}"
${groqKey?.trim() ? `GROQ_API_KEY="${groqKey.trim()}"` : "# GROQ_API_KEY is optional but recommended for AI features"}
${openaiKey?.trim() ? `OPENAI_API_KEY="${openaiKey.trim()}"` : "# OPENAI_API_KEY is optional but required for TTS features"}
`;

console.log("\n");

try {
  await write("packages/db/.env", dbContent);
  console.log("Wrote to Database Package (.env)");
} catch (error) {
  console.error("Failed to write to Database Package:", error);
}

try {
  await write("apps/web/.env.local", webContent);
  console.log("Wrote to Web App (.env.local)");
} catch (error) {
  console.error("Failed to write to Web App:", error);
}

console.log("\n✨ Setup complete! You can now run 'bun dev'.\n");

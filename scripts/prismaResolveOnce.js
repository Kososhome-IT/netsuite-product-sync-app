import { execSync } from "child_process";

const MIGRATION_NAME = "20260123235803_updated_inventory_log";

if (process.env.NODE_ENV !== "production") {
  console.log("Skipping migration resolve (not production)");
  process.exit(0);
}


function run() {
  try {
    console.log("Checking Prisma migration status...");

    execSync("npx prisma migrate status", { stdio: "inherit" });

    console.log("Resolving failed migration safely...");

    execSync(
      `npx prisma migrate resolve --applied ${MIGRATION_NAME}`,
      { stdio: "inherit" }
    );

    console.log("Migration marked as applied successfully.");
  } catch (error) {
    console.error("Migration resolve failed:", error.message);
    process.exit(1);
  }
}

run();

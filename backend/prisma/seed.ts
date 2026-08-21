import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";
import { cryptoService } from "../src/services/crypto.service.js";

const SEED_USER_PASSWORD = "password123";
const seedPasswordHash = await cryptoService.hash(SEED_USER_PASSWORD);

const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedDataDir = path.join(__dirname, "seed-data");

function readCsv(fileName: string): Record<string, string>[] {
  const content = readFileSync(path.join(seedDataDir, fileName), "utf-8");
  return parse(content, { columns: true, skip_empty_lines: true });
}

function toNullable(value: string | undefined): string | null {
  return value === "" || value === undefined ? null : value;
}

async function main() {
  const existing = await prisma.category.count();
  if (existing > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  const categories = readCsv("categories.csv");
  const areas = readCsv("areas.csv");
  const ingredients = readCsv("ingredients.csv");
  const users = readCsv("users.csv");
  const recipes = readCsv("recipes.csv");
  const recipeIngredients = readCsv("recipe_ingredients.csv");
  const testimonials = readCsv("testimonials.csv");

  const categoryIdByName = new Map(categories.map((c) => [c.name, c.id]));
  const areaIdByName = new Map(areas.map((a) => [a.name, a.id]));

  const missingCategories = new Set(
    recipes.filter((r) => !categoryIdByName.has(r.category)).map((r) => r.category),
  );
  const missingAreas = new Set(recipes.filter((r) => !areaIdByName.has(r.area)).map((r) => r.area));
  if (missingCategories.size || missingAreas.size) {
    throw new Error(
      `recipes.csv references unknown category(ies) [${[...missingCategories]}] or area(ies) [${[...missingAreas]}]`,
    );
  }

  await prisma.category.createMany({
    data: categories.map((c) => ({ id: c.id, name: c.name })),
    skipDuplicates: true,
  });

  await prisma.area.createMany({
    data: areas.map((a) => ({ id: a.id, name: a.name })),
    skipDuplicates: true,
  });

  await prisma.ingredient.createMany({
    data: ingredients.map((i) => ({
      id: i.id,
      name: i.name,
      description: toNullable(i.description),
      img: toNullable(i.img),
    })),
    skipDuplicates: true,
  });

  await prisma.user.createMany({
    data: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: toNullable(u.avatar),
      passwordHash: seedPasswordHash,
    })),
    skipDuplicates: true,
  });

  await prisma.recipe.createMany({
    data: recipes.map((r) => ({
      id: r.id,
      title: r.title,
      instructions: r.instructions,
      description: toNullable(r.description),
      image: toNullable(r.thumb),
      time: r.time ? Number(r.time) : null,
      categoryId: categoryIdByName.get(r.category)!,
      areaId: areaIdByName.get(r.area)!,
      ownerId: r.owner_id,
    })),
    skipDuplicates: true,
  });

  await prisma.recipeIngredient.createMany({
    data: recipeIngredients.map((ri) => ({
      recipeId: ri.recipe_id,
      ingredientId: ri.ingredient_id,
      measure: toNullable(ri.measure),
    })),
    skipDuplicates: true,
  });

  await prisma.testimonial.createMany({
    data: testimonials.map((t) => ({
      id: t.id,
      ownerId: t.owner_id,
      testimonial: t.testimonial,
    })),
    skipDuplicates: true,
  });

  console.log("Seed completed:", {
    categories: categories.length,
    areas: areas.length,
    ingredients: ingredients.length,
    users: users.length,
    recipes: recipes.length,
    recipeIngredients: recipeIngredients.length,
    testimonials: testimonials.length,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

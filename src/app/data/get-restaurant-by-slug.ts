import { db } from "@/lib/prisma";

export const getRestarauntBySlug = (slug: string) => {
  const restaurant = await db.restaurant.findUnique({ where: { slug } });
  return restaurant;
};

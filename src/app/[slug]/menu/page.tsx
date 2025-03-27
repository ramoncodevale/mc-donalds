import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RestaurantHeader from "./components/header";
import RestaurantCategories from "./components/categories";

interface RestaurantMenuPageProps {
  params?: { slug?: string };
  searchParams?: { consumptionMethod?: string };
}

const isConsumptionMethodValid = (consumptionMethod?: string) => {
  return !consumptionMethod || ["DINE_IN", "TAKEAWAY"].includes(consumptionMethod.toUpperCase());
};

const RestaurantMenuPage = async ({ params, searchParams }: RestaurantMenuPageProps) => {
  const slug = params?.slug || "";
  const consumptionMethod = searchParams?.consumptionMethod || "";

  if (!isConsumptionMethodValid(consumptionMethod)) {
    return notFound();
  }

  try {
    const restaurant = await db.restaurant.findUnique({
      where: { slug },
      include: {
        menuCategories: {
          include: { products: true },
        },
      },
    });

    if (!restaurant) {
      return notFound();
    }

    return (
      <div>
        <RestaurantHeader restaurant={restaurant} />
        <RestaurantCategories restaurant={restaurant} />
      </div>
    );
  } catch (error) {
    console.error("Erro ao buscar restaurante:", error);
    return notFound();
  }
};

export default RestaurantMenuPage;

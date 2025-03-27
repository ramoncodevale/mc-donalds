"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MenuCategory, Prisma } from "@prisma/client";
import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";
import Products from "./products";
import { CartContext } from "../contexts/cart";
import { formatCurrency } from "@/helpers/format-currency";

interface RestaurantCategoriesProps {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      menuCategories: {
        include: { products: true };
      };
    };
  }>;
}

const RestaurantCategories = ({ restaurant }: RestaurantCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(
    restaurant.menuCategories.length > 0 ? restaurant.menuCategories[0] : null
  );

  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error("CartContext deve estar dentro de um CartProvider.");
  }

  const { products, total, toggleCart, totalQuantity } = cartContext;

  const handleCategoryClick = (category: MenuCategory) => {
    setSelectedCategory(category);
  };

  return (
    <div className="relative z-50 mt-[-2.5rem] rounded-t-3xl bg-white">
      <div className="p-5">
        <div className="flex items-center gap-2">
          <Image
            src={restaurant.avatarImageUrl}
            alt={restaurant.name}
            height={45}
            width={45}
            className="rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">{restaurant.name}</h2>
            <p className="text-xs opacity-55">{restaurant.description}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-green-500">
          <ClockIcon size={12} />
          <p>Aberto</p>
        </div>
      </div>

      <ScrollArea className="w-full">
        <div className="flex w-max space-x-4 p-4 pt-0">
          {restaurant.menuCategories.map((category) => (
            <Button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              variant={selectedCategory?.id === category.id ? "default" : "secondary"}
              size="sm"
              className="rounded-full"
              aria-selected={selectedCategory?.id === category.id}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar />
      </ScrollArea>

      {selectedCategory && (
        <>
          <h3 className="px-5 font-semibold pt-2">{selectedCategory.name}</h3>
          <Products products={selectedCategory.products} />
        </>
      )}

      {products.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 flex w-full items-center justify-between border-t bg-white px-5 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Total dos pedidos</p>
            <p className="text-sm font-semibold">
              {formatCurrency(total)}
              <span className="text-xs font-normal text-muted-foreground">
                / {totalQuantity} {totalQuantity > 1 ? "itens" : "item"}
              </span>
            </p>
          </div>
          <Button onClick={toggleCart}>Ver sacola</Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantCategories;

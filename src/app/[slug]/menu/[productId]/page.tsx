import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductHeader from "./components/product-header";

interface ProductPageProps {
  params: { slug: string; productId: string };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug, productId } = params;

  if (!productId) {
    return notFound();
  }

  const product = await db.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return notFound();
  }

  return (
    <div>
      <ProductHeader product={product} />
      <h1>Product Page</h1>
      <p>Slug: {slug}</p>
      <p>Product ID: {productId}</p>
    </div>
  );
};

export default ProductPage;

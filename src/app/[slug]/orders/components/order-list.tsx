import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/format-currency";
import { OrderStatus, Prisma } from "@prisma/client";
import { ChevronsLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";

interface OrderListProps {
  orders: Array<
    Prisma.OrderGetPayload<{
      include: {
        restaurant: {
          select: {
            name: true;
            avatarImageUrl: true;
          };
        };
        orderProducts: {
          include: {
            product: true;
          };
        };
      };
    }>
  >;
}


const getStatusLabel = (status: OrderStatus) => {
  if (status === "FINISHED") return "Finalizado";
  if (status === "IN_PREPARATION") return "Em preparo";
  if (status === "PENDING") return "Pendente";
  if (status === "PAYMENT_CONFIRMED") return "Pagamento confirmado";
  if (status === "PAYMENT_FAILED") return "Pagamento falhou";
  return "";
};

const OrderList = ({ orders }: OrderListProps) => {
  return (
    <div className="space-y-6 p-6">
      <Button size="icon" variant="secondary" className="rounded-full">
        <ChevronsLeftIcon />
      </Button>
      <div className="flex items-center">
        <ScrollTextIcon />
        <h2 className="text-lg font-semibold">Meus Pedidos</h2>
      </div>
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="space-y-4 p-5">
            <div 
             className={`w-fit rounded-full px-2 py-1 text-xs font-semibold text-white ${([OrderStatus.PAYMENT_CONFIRMED, OrderStatus.FINISHED] as OrderStatus[]).includes(order.status) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"} `}
             >
               {getStatusLabel(order.status)}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-5 w-5">
                <Image
                  src={order.restaurant.avatarImageUrl}
                  alt={order.restaurant.name}
                  className="rounded-lg"
                  fill
                />
              </div>
              <p className="text-sm font-semibold">{order.restaurant.name}</p>
            </div>
            <Separator />
            <div className="space-y-2">
            {order.orderProducts.map(OrderProduct => (
                <div key={OrderProduct.id} className="flex items-center gap-2">
                 <div className="h-5 w-5 flex items-center rounded-full text-white bg-gray-400 text-xs font-semibold">
                   {OrderProduct.quantity}
                 </div>
                 <p className="text-sm">{OrderProduct.product.name}</p>
                </div>
            ))}
            </div>
            <Separator />
            <p className="text-sm font-medium">{formatCurrency(order.total)}</p>          
            </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderList;
 
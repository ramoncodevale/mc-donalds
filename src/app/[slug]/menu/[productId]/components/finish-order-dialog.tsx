"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "next/navigation";
import { PatternFormat } from "react-number-format";
import { ConsumptionMethod } from "@prisma/client";

import { createOrder } from "../../actions/create-order";
import { isValidCpf } from "../../helpers/cpf";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext, useTransition } from "react";
import { CartContext } from "../../contexts/cart";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório." }),
  cpf: z
    .string()
    .trim()
    .min(1, { message: "O CPF é obrigatório." })
    .refine((value) => isValidCpf(value), { message: "CPF inválido." }),
});

type FormSchema = z.infer<typeof formSchema>;

interface FinishOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FinishOrderDialog = ({ open, onOpenChange }: FinishOrderDialogProps) => {
  const { products } = useContext(CartContext);
  const searchParams = useSearchParams();
  const [isPending, startTransiction] = useTransition();
  const { slug } = useParams<{ slug: string }>();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", cpf: "" },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      const consumptionMethod = searchParams.get(
        "consumptionMethod",
      ) as ConsumptionMethod;
      startTransiction(async () => {
        await createOrder({
          consumptionMethod,
          customerCpf: data.cpf,
          customerName: data.name,
          products,
          slug,
        });
        onOpenChange(false);
        toast.success("Pedido finalizado com sucesso!");
      });
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline">Finalizar Pedido</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Finalizar Pedido</DrawerTitle>
          <DrawerDescription>
            Insira suas informações abaixo para finalizar o seu pedido.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu CPF</FormLabel>
                    <FormControl>
                      <PatternFormat
                        format="###.###.###-##"
                        customInput={Input}
                        placeholder="Digite seu CPF..."
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DrawerFooter>
                <Button
                  type="submit"
                  variant="destructive"
                  className="rounded-full"
                  disabled={isPending}
                >
                  {isPending && <LoaderIcon className="animate-spin" />}
                  Finalizar Pedido
                </Button>
                <DrawerClose asChild>
                  <Button className="w-full rounded-full" variant="outline">
                    Cancelar
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FinishOrderDialog;

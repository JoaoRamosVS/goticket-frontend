import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutSubmitButtonProps {
  isSubmitting: boolean;
}

export default function CheckoutSubmitButton({ isSubmitting }: CheckoutSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="w-full py-6 text-xl font-bold shadow-2xl bg-linear-to-b from-primary to-[#2959b9] mt-2 rounded-4xl hover:scale-98"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="size-4 animate-spin mr-2" />
          Finalizando pedido...
        </>
      ) : (
        "Finalizar pedido"
      )}
    </Button>
  );
}

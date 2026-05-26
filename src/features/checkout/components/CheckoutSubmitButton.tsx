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
      className="w-full h-12 rounded-xl text-base font-semibold shadow-2xl bg-linear-to-l from-primary to-[#2959b9] mt-2"
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

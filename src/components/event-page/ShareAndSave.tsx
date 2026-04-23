import { Heart, Share } from "lucide-react"
import { Button } from "../ui/button"

const ShareAndSave = () => {
  return (
    <div className="flex w-full px-4 gap-2">
        <Button
            className="flex-1 bg-linear-to-l from-primary to-[#2959b9] 
            text-primary-foreground rounded-4xl hover:scale-95 transition-all duration-375"
        >
            <Share className="size-4" />
            Compartilhar
        </Button>

        <Button
            className="flex-1 bg-linear-to-r from-primary to-[#2959b9] 
            text-primary-foreground rounded-4xl hover:scale-95 transition-all duration-375"
        >
            <Heart className="size-4" />
            Adicionar aos favoritos
        </Button>
    </div>
  )
}

export default ShareAndSave
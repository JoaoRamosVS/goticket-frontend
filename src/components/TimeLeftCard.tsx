import { useEffect, useState } from 'react'
import { Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const TimeLeftCard = () => {

    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const updateVisualTimer = () => {
            const expirationSorted = localStorage.getItem('tokenExpiration');
            if (!expirationSorted) setTimeLeft(0);

            const now = Date.now();
            const differenceTime = Number(expirationSorted) - now;

            setTimeLeft(differenceTime > 0 ? Math.floor(differenceTime / 1000) : 0)
        }

        updateVisualTimer();
        const timer = setInterval(updateVisualTimer, 1000)

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    const isLowTime = timeLeft < 300; // Less than 5 minutes

    return (
        <Card className={`border-2 transition-all ${isLowTime ? 'border-destructive shadow-lg shadow-destructive/20' : 'border-primary/50'}`}>
            <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                    {isLowTime ? (
                        <AlertCircle className={`size-6 ${isLowTime ? 'text-destructive animate-pulse' : 'text-primary'}`} />
                    ) : (
                        <Clock className="size-6 text-primary" />
                    )}
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Sessão expira em</p>
                        <p className={`text-2xl font-bold ${isLowTime ? 'text-destructive' : 'text-foreground'}`}>
                            {formatTime(timeLeft)}
                        </p>
                    </div>
                </div>
                <Badge 
                    variant={isLowTime ? "destructive" : "secondary"}
                    className="text-base px-4 py-2"
                >
                    {isLowTime ? 'Expirando em breve' : 'Ativo'}
                </Badge>
            </CardContent>
        </Card>
    )
}

export default TimeLeftCard
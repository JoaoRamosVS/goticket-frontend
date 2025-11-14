import { useEffect, useState } from 'react'

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

    return (
        <div className="container mx-auto my-8 bg-emerald-800 text-white text-center font-semibold text-2xl p-4 rounded-full">
            Seu login expira em: {timeLeft} segundos
        </div>
    )
}

export default TimeLeftCard
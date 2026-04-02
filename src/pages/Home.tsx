import BannerSlider from "@/components/home/BannerSlider";
import HighlightEvents from "@/components/home/HighlightEvents";
import RegisterCallCTA from "@/components/home/RegisterCallCTA";

const Home = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-background pt-24">
            <BannerSlider />
            <HighlightEvents />
            <RegisterCallCTA />
        </div>
    );
};

export default Home;
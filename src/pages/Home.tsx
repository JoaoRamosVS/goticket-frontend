import BannerSlider from "@/components/home/BannerSlider";
import HighlightEvents from "@/components/home/HighlightEvents";
import RegisterCallCTA from "@/components/home/RegisterCallCTA";
import SearchBar from "@/components/home/SearchBar";
import CategoriesGrid from "@/components/home/CategoriesGrid";

const Home = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-background pt-24">
            <BannerSlider />
            <SearchBar />
            <CategoriesGrid />
            <HighlightEvents />
            <RegisterCallCTA />
        </div>
    );
};

export default Home;
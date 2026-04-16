import BannerSlider from "@/components/home/BannerSlider";
import HighlightEvents from "@/components/home/HighlightEvents";
import RegisterCallCTA from "@/components/home/RegisterCallCTA";
import SearchBar from "@/components/home/SearchBar";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import EventsCarousel from "@/components/home/EventsCarousel";
import FAQSection from "@/components/global/FAQSection/FAQSection";

const Home = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-background pt-24">
            <BannerSlider />
            <SearchBar />
            <HighlightEvents title="Em destaque para você" />
            <CategoriesGrid />
            <EventsCarousel title="Esportes" />
            <EventsCarousel title="Música" />
            <EventsCarousel title="Festivais" />
            <EventsCarousel title="Perto de você" />
            <FAQSection />
            <RegisterCallCTA />
        </div>
    );
};

export default Home;
import BannerSlider from "@/components/home/BannerSlider";
import HighlightEvents from "@/components/home/HighlightEvents";
import RegisterCallCTA from "@/components/home/RegisterCallCTA";
import SearchBar from "@/components/home/SearchBar";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import EventsCarousel from "@/components/home/EventsCarousel";
import FAQSection from "@/components/global/FAQSection/FAQSection";
import useEvents from "@/hooks/useEvents";

const Home = () => {
    const { events } = useEvents({ page: 0, pageSize: 20 });

    const bannerEvents = events.slice(0, 4);
    const highlightEvents = events.slice(0, 4);

    return (
        <div className="min-h-screen pt-24">
            <BannerSlider events={bannerEvents} />
            <SearchBar />
            <HighlightEvents title="Em destaque para você" events={highlightEvents} />
            <CategoriesGrid />
            <EventsCarousel title="Esportes" events={events} />
            <EventsCarousel title="Música" events={events} />
            <RegisterCallCTA />
            <EventsCarousel title="Festivais" events={events} />
            <EventsCarousel title="Perto de você" events={events} />
            <FAQSection />
        </div>
    );
};

export default Home;

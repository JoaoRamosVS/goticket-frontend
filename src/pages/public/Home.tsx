import BannerSlider from "@/features/public-landing/components/home/BannerSlider";
import HighlightEvents from "@/features/public-landing/components/home/HighlightEvents";
import RegisterCallCTA from "@/features/public-landing/components/home/RegisterCallCTA";
import SearchBar from "@/features/public-landing/components/home/SearchBar";
import CategoriesGrid from "@/features/public-landing/components/home/CategoriesGrid";
import EventsCarousel from "@/features/public-landing/components/home/EventsCarousel";
import FAQSection from "@/features/public-landing/components/FAQSection/FAQSection";
import useEvents from "@/features/public-landing/hooks/useEvents";
import MainLayout from "@/layouts/MainLayout";

const Home = () => {
    const { events } = useEvents({ page: 0, pageSize: 20 });

    const bannerEvents = events.slice(0, 4);
    const highlightEvents = events.slice(0, 4);

    return (
        <MainLayout>
            <div className="min-h-screen pt-24">
                <BannerSlider events={bannerEvents} />
                <SearchBar />
                <HighlightEvents title="Em destaque para você" events={highlightEvents} />
                <CategoriesGrid />
                <EventsCarousel title="Esportes" events={events.slice(0,8)} />
                <EventsCarousel title="Música" events={events.slice(4,12)} />
                <RegisterCallCTA />
                <EventsCarousel title="Festivais" events={events.slice(8,16)} />
                <EventsCarousel title="Perto de você" events={events.slice(12,20)} />
                <FAQSection />
            </div>
        </MainLayout>
    );
};

export default Home;

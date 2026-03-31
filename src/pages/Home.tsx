import BannerSlider from "@/components/home/BannerSlider";

const Home = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-background pt-24">
            <div className="container mx-auto px-4 py-8 space-y-8">
                <BannerSlider />
            </div>
        </div>
    );
};

export default Home;
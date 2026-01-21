import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

function HomePage() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <Features />
                {/* Steps, Testimonials, FAQ, Contact sections will be added later */}
            </main>
            <Footer />
        </>
    );
}

export default HomePage;

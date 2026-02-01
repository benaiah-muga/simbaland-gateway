import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroElectronics from '@/assets/hero-electronics.jpg';
import heroAutomotive from '@/assets/hero-automotive.jpg';
import heroMobile from '@/assets/hero-mobile.jpg';

const slides = [
  {
    id: 1,
    image: heroElectronics,
    title: 'Premium Home Appliances',
    subtitle: 'Transform your home with quality appliances',
    cta: 'Shop Now',
    link: '/category/home-appliances'
  },
  {
    id: 2,
    image: heroAutomotive,
    title: 'Ride in Style',
    subtitle: 'Explore our range of reliable motorbikes',
    cta: 'View Collection',
    link: '/category/automotive'
  },
  {
    id: 3,
    image: heroMobile,
    title: 'ZTE | nubia Smartphones',
    subtitle: 'Experience cutting-edge mobile technology',
    cta: 'Discover More',
    link: '/category/zte-nubia'
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="hero-overlay absolute inset-0" />
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto container-padding flex items-center">
            <div
              className={`max-w-xl text-primary-foreground transform transition-all duration-700 delay-300 ${
                index === currentSlide
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-10 opacity-0'
              }`}
            >
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-4 leading-tight">
                {slide.title}
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-primary-foreground/80">
                {slide.subtitle}
              </p>
              <a
                href={slide.link}
                className="btn-accent text-base sm:text-lg px-8 py-4"
              >
                {slide.cta}
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-card/20 backdrop-blur-sm text-primary-foreground hover:bg-card/40 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-card/20 backdrop-blur-sm text-primary-foreground hover:bg-card/40 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-accent'
                : 'w-2 bg-primary-foreground/50 hover:bg-primary-foreground/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;

import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const destinations = [
  {
    name: "Santorini",
    country: "Greece",
    description:
      "Sun-bleached cliffs, sapphire domes, and sunsets that turn the Aegean into liquid gold.",
    image: "/images/destination-santorini.jpg",
  },
  {
    name: "Kyoto",
    country: "Japan",
    description:
      "Ancient shrines, maple-lined paths, and the quiet rhythm of a city that honors its past.",
    image: "/images/destination-kyoto.jpg",
  },
  {
    name: "Marrakech",
    country: "Morocco",
    description:
      "A labyrinth of riads, spice-scented souks, and Moorish courtyards waiting to be discovered.",
    image: "/images/destination-marrakech.jpg",
  },
];

const features = [
  {
    title: "Hand-Crafted Itineraries",
    body: "Every journey is designed around your pace, passions, and the moments you want to remember forever.",
  },
  {
    title: "Local Insiders",
    body: "We partner with guides, chefs, and hosts who reveal the stories and flavors tourists rarely find.",
  },
  {
    title: "Seamless Travel",
    body: "From private transfers to dinner reservations, we handle the details so you can stay present.",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DestinationsSection />
        <FeaturesSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-primary-foreground">
          <CompassIcon className="h-7 w-7" />
          <span className="font-heading text-xl font-semibold tracking-tight">
            Fortune Travels
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-primary-foreground/90 md:flex">
          <a href="#destinations" className="transition-colors hover:text-primary-foreground">
            Destinations
          </a>
          <a href="#experiences" className="transition-colors hover:text-primary-foreground">
            Experiences
          </a>
          <a href="#journal" className="transition-colors hover:text-primary-foreground">
            Journal
          </a>
          <a
            href="#newsletter"
            className="rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-primary-foreground/20"
          >
            Plan a trip
          </a>
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-end pb-20 pt-32 lg:items-center lg:pb-0 lg:pt-0">
      <div className="absolute inset-0">
        <img
          src="/images/hero-travel.jpg"
          alt="Sunset over a Mediterranean coastal village"
          width={1920}
          height={1088}
          className="h-full w-full object-cover"
          priority={true}
        />
        <div className="absolute inset-0 bg-hero-gradient" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Curated journeys
          </p>
          <h1 className="mt-4 font-heading text-5xl leading-[1.1] text-primary-foreground md:text-6xl lg:text-7xl">
            Wander well. Travel deeper.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-primary-foreground/80">
            Fortune Travels designs extraordinary itineraries for curious souls — blending
            comfort, culture, and a touch of the unexpected.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#destinations"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
            >
              Explore destinations
            </a>
            <a
              href="#newsletter"
              className="inline-flex items-center justify-center rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3 text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/20"
            >
              Start planning
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function DestinationsSection() {
  return (
    <section id="destinations" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Featured</p>
          <h2 className="mt-3 font-heading text-4xl text-foreground md:text-5xl">
            Destinations that inspire
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three places we’re dreaming about right now — each chosen for its beauty, soul, and
            stories.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <article
              key={destination.name}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={destination.image}
                  alt={`${destination.name}, ${destination.country}`}
                  width={800}
                  height={1008}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-heading text-2xl text-card-foreground">{destination.name}</h3>
                  <span className="text-sm font-medium text-muted-foreground">
                    {destination.country}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {destination.description}
                </p>
                <button className="mt-5 text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                  View itinerary →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="experiences" className="border-y border-border bg-secondary/50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Why Fortune
            </p>
            <h2 className="mt-3 font-heading text-4xl text-foreground md:text-5xl">
              Travel that feels like yours
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              We believe the best trips are personal. That’s why we listen first, then design an
              experience that matches your idea of magic.
            </p>
            <a
              href="#newsletter"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Begin your journey
            </a>
          </div>

          <div className="grid gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-background p-6 shadow-sm"
              >
                <h3 className="font-heading text-xl text-foreground">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section id="newsletter" className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Stay curious</p>
        <h2 className="mt-3 font-heading text-4xl text-foreground md:text-5xl">
          Get travel inspiration in your inbox
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join our journal for destination guides, hidden gems, and exclusive itineraries — no spam,
          just wonder.
        </p>
        <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30 sm:w-80"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 lg:flex-row lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <CompassIcon className="h-6 w-6" />
          <span className="font-heading text-lg font-semibold">Fortune Travels</span>
        </Link>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Fortune Travels. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
    </svg>
  );
}

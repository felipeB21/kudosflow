import { Testimonials } from "@/components/unique-testimonial";

export default function ExplorePage() {
  return (
    <div>
      <main className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Explore KudosFlow
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover how others are building trust with automated social proof.
          </p>
        </div>

        <div className="space-y-10">
          <Testimonials />
          <Testimonials />
          <Testimonials />
          <Testimonials />
          <Testimonials />
        </div>
      </main>
    </div>
  );
}

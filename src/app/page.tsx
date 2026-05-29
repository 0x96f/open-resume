import { Hero } from "home/Hero";
import { Steps } from "home/Steps";
import { Features } from "home/Features";

export default function Home() {
  return (
    <main className="mx-auto max-w-screen-xl bg-dot px-8 pb-16 text-gray-900 lg:px-12">
      <Hero />
      <Steps />
      <Features />
    </main>
  );
}

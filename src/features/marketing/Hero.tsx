import Link from "next/link";
import { AutoTypingResume } from "home/AutoTypingResume";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="grid items-center gap-10 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
      <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
        <h1 className="text-primary pb-2 text-4xl font-bold lg:text-5xl">
          Create a professional
          <br />
          resume easily
        </h1>
        <p className="mt-3 text-lg lg:text-xl">
          With this free and open-source resume builder
        </p>
        <Button asChild className="mt-6">
          <Link href="/resume-import">
            Create Resume
            <span className="ml-1" aria-hidden="true">
              →
            </span>
          </Link>
        </Button>
        <p className="ml-5 mt-3 text-sm text-gray-600">No sign up required</p>
      </div>
      <div className="flex justify-center lg:justify-end">
        <AutoTypingResume />
      </div>
    </section>
  );
};

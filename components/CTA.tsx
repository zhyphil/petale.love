import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="bg-petale-900 py-20 sm:py-28">
      <div className="container-mx">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Offrez à votre compagnon le portrait qu'il mérite.
          </h2>
          <p className="mt-4 text-lg text-petale-100">
            3 portraits gratuits. Aucune carte requise. 30 secondes.
          </p>

          <Link
            href="/studio"
            className="group mt-10 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-petale-900 shadow-lg transition hover:bg-petale-100"
          >
            Essayer maintenant
            <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
          </Link>

          <p className="mt-6 text-sm text-petale-200">
            ou écrivez-nous à{' '}
            <a href="mailto:hello@petale.app" className="underline hover:text-white">
              hello@petale.app
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
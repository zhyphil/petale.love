import Link from 'next/link';
import { ArrowRight, Sparkles, Shield } from 'lucide-react';
import { EmailForm } from './EmailForm';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(200, 120, 56, 0.15), transparent 60%)',
        }}
      />

      <div className="container-mx pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Pre-headline tag */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-petale-100 px-4 py-1.5 text-sm font-medium text-petale-800">
            <Sparkles className="h-4 w-4" />
            Pour la Journée du Souvenir Animal · 13 septembre
          </div>

          {/* Main headline */}
          <h1 className="font-display text-3xl font-bold tracking-tight text-petale-950 sm:text-5xl md:text-6xl">
            Le portrait artistique de votre compagnon,
            <span className="block text-petale-600">en 30 secondes.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-8 text-petale-800 sm:text-xl">
            Téléchargez une photo de votre chien, chat ou lapin.
            <span className="font-semibold"> 3 portraits gratuits</span> générés par IA.
            Vous aimez ? Recevez 42 autres dans 12 styles.
            <span className="font-semibold"> Vente définitive — téléchargement immédiat.</span>
          </p>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/studio"
              className="btn-primary group w-full sm:w-auto"
              aria-label="Essayer maintenant"
            >
              Essayer maintenant
              <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="#examples" className="btn-secondary w-full sm:w-auto">
              Voir des exemples
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-petale-700">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-petale-600" />
              6 portraits gratuits · 48 dans le pack complet
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-petale-600" />
              Téléchargement définitif
            </span>
            <span className="hidden sm:inline">·</span>
            <span>Vos photos ne sont jamais partagées</span>
          </div>

          {/* Email waitlist (below the fold) */}
          <div className="mt-16">
            <EmailForm />
          </div>
        </div>
      </div>
    </section>
  );
}
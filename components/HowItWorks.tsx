const steps = [
  {
    n: '1',
    title: 'Téléchargez une photo',
    description:
      'Choisissez une photo claire de votre animal, petale bien visible. JPEG ou PNG, jusqu’à 10 Mo.',
  },
  {
    n: '2',
    title: 'Recevez 3 portraits gratuits',
    description:
      'En 30 secondes, notre IA vous envoie 3 styles différents. Voyez le résultat avant de payer.',
  },
  {
    n: '3',
    title: 'Payez seulement si vous aimez',
    description:
      '€9.99 pour 50 portraits supplémentaires dans 12 styles. Ou ne payez rien — votre appel.',
  },
  {
    n: '4',
    title: 'Téléchargez et partagez',
    description:
      'Fichiers HD, libres de droits. Imprimez, partagez sur Instagram, envoyez en faire-part.',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-mx">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-petale-950 sm:text-4xl">
            Comment ça marche
          </h2>
          <p className="mt-4 text-lg text-petale-700">
            Zéro piège, zéro surprise. Vous voyez avant de payer.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-petale-600 font-display text-2xl font-bold text-white shadow-md">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-petale-950">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-petale-700">
                    {s.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
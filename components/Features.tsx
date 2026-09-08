const features = [
  {
    title: 'Vos photos restent privées',
    description:
      "Hébergement en Europe, suppression automatique après 30 jours. Nous ne revendons jamais vos données.",
    icon: '🔒',
  },
  {
    title: '12 styles artistiques',
    description:
      'Aquarelle, huile, manga, pop art, Renaissance… Chaque portrait est unique, prêt à être imprimé en poster.',
    icon: '🎨',
  },
  {
    title: '3 portraits gratuits avant de payer',
    description:
      'Contrairement à Petpix et DreamPets, vous voyez le résultat avant. Pas de piège, pas de paywall caché.',
    icon: '✨',
  },
  {
    title: 'Téléchargement définitif',
    description:
      'Si le portrait ne ressemble pas à votre animal, on vous rembourse. Sans question.',
    icon: '💛',
  },
];

export function Features() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-mx">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-petale-950 sm:text-4xl">
            Pourquoi petale est différent
          </h2>
          <p className="mt-4 text-lg text-petale-700">
            On est aussi des propriétaires d'animaux. On a vécu les frustrations.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-petale-100 bg-petale-50 p-6 transition hover:border-petale-300 hover:bg-white hover:shadow-lg"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-petale-950">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-petale-700">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
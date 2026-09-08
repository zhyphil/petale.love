const faqs = [
  {
    q: 'Est-ce que ça ressemble vraiment à mon animal ?',
    a: "Notre IA est entraînée pour préserver les traits distinctifs (couleur du pelage, forme du petale, posture). Pour les races communes, le résultat est très fidèle. Pour les races rares ou mélangées, on recommande le Pack Saison avec LoRA personnalisé (à venir en v0.2).",
  },
  {
    q: "Que faites-vous de mes photos ?",
    a: "Elles sont hébergées en Europe (Supabase, datacenter Frankfurt), chiffrées en transit, et automatiquement supprimées après 30 jours. Nous ne les utilisons jamais pour entraîner des modèles, ne les partageons jamais.",
  },
  {
    q: 'Comment fonctionne le remboursement ?',
    a: "Vous avez 7 jours après l'achat. Un email à hello@petale.app suffit. On rembourse sous 48h via Stripe — pas de questions, pas de conditions cachées.",
  },
  {
    q: 'Pourquoi pas gratuit ?',
    a: "Les 3 portraits gratuits le sont vraiment. Le Pack 50 finance les serveurs, l'API Replicate (~$0.04 par portrait) et le développement. On vous prévient toujours avant de débiter.",
  },
  {
    q: 'Mes photos sont-elles vues par des humains ?',
    a: "Non. Le pipeline est 100% automatisé. Aucune équipe de modération ne voit vos images. Pour le contenu que vous téléchargez ensuite sur les réseaux sociaux, c'est votre choix.",
  },
];

export function FAQ() {
  return (
    <section className="bg-petale-50 py-20 sm:py-28">
      <div className="container-mx">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-petale-950 sm:text-4xl">
            Questions fréquentes
          </h2>

          <div className="mt-12 space-y-6">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-petale-200 bg-white p-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-semibold text-petale-950">
                  <span>{f.q}</span>
                  <span className="text-petale-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-petale-700">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export function Pricing() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-mx">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-petale-950 sm:text-4xl">
            Tarifs simples
          </h2>
          <p className="mt-4 text-lg text-petale-700">
            Payez une fois, téléchargez tout. Pas d’abonnement caché.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Free tier */}
          <div className="flex flex-col rounded-3xl border-2 border-petale-100 bg-petale-50 p-8">
            <h3 className="font-display text-2xl font-bold text-petale-950">Essai gratuit</h3>
            <p className="mt-2 text-sm text-petale-700">Pour tester sans risque</p>
            <p className="mt-6 font-display text-4xl font-bold text-petale-950">0 €</p>
            <ul className="mt-6 space-y-3 text-sm text-petale-800">
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>3 portraits générés</span>
              </li>
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>6 styles au choix (watercolor, renaissance, manga...)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>Résolution HD</span>
              </li>
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>Aucune carte requise</span>
              </li>
            </ul>
            <a href="/studio" className="btn-secondary mt-8 w-full">
              Commencer
            </a>
          </div>

          {/* Standard tier — recommended */}
          <div className="relative flex flex-col rounded-3xl border-2 border-petale-600 bg-white p-8 shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-petale-600 px-4 py-1 text-xs font-semibold text-white shadow">
              Le plus populaire
            </div>
            <h3 className="font-display text-2xl font-bold text-petale-950">Pack 48</h3>
            <p className="mt-2 text-sm text-petale-700">10 styles × 5 variantes, tous les formats</p>
            <p className="mt-6 font-display text-4xl font-bold text-petale-950">
              9,99 €
              <span className="ml-2 text-base font-medium text-petale-600">une seule fois</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-petale-800">
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>50 portraits HD (10 styles × 5 variantes)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>10 styles au choix</span>
              </li>
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>Formats carrés + verticaux + stories</span>
              </li>
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>Libres de droits</span>
              </li>
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>Téléchargement définitif après paiement</span>
              </li>
            </ul>
            <a href="/studio" className="btn-primary mt-8 w-full">
              Essayer maintenant
            </a>
          </div>

          {/* Premium tier — seasonal */}
          <div className="flex flex-col rounded-3xl border-2 border-petale-100 bg-petale-50 p-8">
            <h3 className="font-display text-2xl font-bold text-petale-950">Pack Saison</h3>
            <p className="mt-2 text-sm text-petale-700">Noël · St-Valentin · Halloween</p>
            <p className="mt-6 font-display text-4xl font-bold text-petale-950">
              19,99 €
              <span className="ml-2 text-base font-medium text-petale-600">limité</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-petale-800">
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>Tout le Pack 48</span>
              </li>
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>+ 30 portraits saisonniers exclusifs</span>
              </li>
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>Carte postale numérique prête à envoyer</span>
              </li>
              <li className="flex gap-2">
                <span className="text-petale-600">✓</span>
                <span>Idéal cadeau</span>
              </li>
            </ul>
            <button disabled className="btn-secondary mt-8 w-full opacity-60">
              Bientôt disponible
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
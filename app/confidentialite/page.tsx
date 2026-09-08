import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité · petale',
  description: 'Comment petale collecte, utilise et protège vos données personnelles (RGPD/GDPR).',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="container-mx prose prose-museau mx-auto max-w-3xl py-16">
      <header>
        <p className="text-sm uppercase tracking-wide text-museau-600">
          Dernière mise à jour : 8 septembre 2026
        </p>
        <h1 className="font-display text-4xl font-bold text-museau-950">
          Politique de confidentialité
        </h1>
      </header>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          1. Qui sommes-nous&nbsp;?
        </h2>
        <p>
          <strong>petale</strong> est un service édité par Haoyu (auto-entrepreneur), basé à
          Paris, France. Pour toute question relative à vos données personnelles, contactez-nous
          à&nbsp;: <a href="mailto:customer@petale.love">customer@petale.love</a>.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          2. Quelles données collectons-nous&nbsp;?
        </h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>Photo de votre animal</strong> : envoyée uniquement pour générer le
            portrait via notre modèle d&apos;IA. Supprimée automatiquement après 30 jours.
          </li>
          <li>
            <strong>Adresse e-mail</strong> : pour vous envoyer les portraits générés et le
            reçu de paiement. Jamais partagée à des tiers.
          </li>
          <li>
            <strong>Données de paiement</strong> : traitées exclusivement par notre prestataire
            Stripe. Nous ne stockons aucun numéro de carte.
          </li>
          <li>
            <strong>Logs techniques</strong> : adresse IP anonymisée pour la sécurité (Vercel).
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          3. Combien de temps conservons-nous vos données&nbsp;?
        </h2>
        <ul className="list-disc pl-6">
          <li>Photos originales : <strong>30 jours</strong> après génération, puis suppression automatique.</li>
          <li>Portraits générés : conservés tant que votre compte est actif.</li>
          <li>E-mails : conservés tant que vous ne demandez pas leur suppression.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          4. Vos droits (RGPD)
        </h2>
        <p>Conformément au RGPD, vous disposez des droits suivants&nbsp;:</p>
        <ul className="list-disc pl-6">
          <li>Droit d&apos;accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit à l&apos;effacement («&nbsp;droit à l&apos;oubli&nbsp;»)</li>
          <li>Droit à la portabilité</li>
          <li>Droit d&apos;opposition au traitement</li>
        </ul>
        <p>
          Pour exercer ces droits, écrivez à <a href="mailto:customer@petale.love">customer@petale.love</a>. Réponse
          sous 30 jours.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          5. Hébergement et transferts
        </h2>
        <p>
          Vos données sont hébergées dans l&apos;Union européenne (Supabase&nbsp;: région
          Frankfurt/Ireland). Aucune donnée n&apos;est transférée hors UE.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          6. Cookies
        </h2>
        <p>
          petale n&apos;utilise que des cookies strictement nécessaires (session Stripe). Aucun
          cookie publicitaire ou de tracking tiers.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          7. Contact DPO
        </h2>
        <p>
          Pour toute réclamation&nbsp;: <a href="mailto:customer@petale.love">customer@petale.love</a>. Vous pouvez
          aussi saisir la <a href="https://www.cnil.fr/fr/plaintes">CNIL</a> (Commission
          nationale de l&apos;informatique et des libertés).
        </p>
      </section>

      <footer className="mt-12 border-t border-museau-200 pt-6 text-sm text-museau-700">
        <p>
          © 2026 petale · Fait avec amour à Paris · SIRET&nbsp;: [à compléter après
          immatriculation]
        </p>
      </footer>
    </article>
  );
}
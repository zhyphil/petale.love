import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation · petale',
  description: 'CGU petale — utilisation du service de portraits IA pour animaux.',
};

export default function TermsPage() {
  return (
    <article className="container-mx prose prose-museau mx-auto max-w-3xl py-16">
      <header>
        <p className="text-sm uppercase tracking-wide text-museau-600">
          Dernière mise à jour : 8 septembre 2026
        </p>
        <h1 className="font-display text-4xl font-bold text-museau-950">
          Conditions Générales d&apos;Utilisation
        </h1>
      </header>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          1. Objet
        </h2>
        <p>
          petale propose un service de génération de portraits artistiques de votre animal de
          compagnie par intelligence artificielle. Les présentes CGU encadrent
          l&apos;utilisation de ce service.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          2. Tarification
        </h2>
        <p>
          Le service est facturé <strong>9,99&nbsp;€ par pack de 50 portraits</strong>. Paiement
          sécurisé par Stripe. Aucun abonnement caché.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          3. Politique de remboursement
        </h2>
        <p>
          Satisfait ou remboursé sous <strong>7 jours</strong> après l&apos;achat. Pour demander un
          remboursement, écrivez à <a href="mailto:hello@petale.love">hello@petale.love</a> en indiquant votre
          adresse e-mail de paiement. Remboursement sous 48&nbsp;heures via Stripe.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          4. Utilisation des portraits
        </h2>
        <p>
          Les portraits générés vous sont <strong> cédés à titre personnel</strong>. Vous pouvez les
          utiliser librement&nbsp;: impression, partage sur réseaux sociaux, faire-part.
          Revente ou usage commercial massif interdit.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          5. Responsabilité sur les photos envoyées
        </h2>
        <p>
          Vous garantissez être propriétaire de l&apos;animal sur la photo et détenir les droits
          nécessaires. Photos contenant des tiers sans leur consentement&nbsp;: interdites.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          6. Limitation de responsabilité
        </h2>
        <p>
          petale est un service fourni &laquo;&nbsp;en l&apos;état&nbsp;&raquo;. Nous faisons notre
          possible pour assurer la qualité, mais le résultat dépend d&apos;un modèle d&apos;IA et peut varier.
          Le remboursement de 7 jours couvre toute insatisfaction.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          7. Suspension du service
        </h2>
        <p>
          Nous nous réservons le droit de suspendre l&apos;accès en cas d&apos;usage abusif (spam,
          tentatives de revente, scrap). Remboursement au prorata dans ce cas.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-museau-900">
          8. Droit applicable
        </h2>
        <p>
          Les présentes CGU sont soumises au droit français. Tout litige sera de la compétence
          des tribunaux du ressort de Paris.
        </p>
      </section>

      <footer className="mt-12 border-t border-museau-200 pt-6 text-sm text-museau-700">
        <p>© 2026 petale · Haoyu, Paris · hello@petale.love</p>
      </footer>
    </article>
  );
}
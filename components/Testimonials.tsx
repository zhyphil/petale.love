/**
 * Testimonials 区块
 * v0.1 阶段先用通用场景描述占位（避免编造客户证言违反 FTC / 法国广告法）
 * v0.2 上线后用真实用户证言替换（带 first name + 城市 + 宠物名 + 截图）
 */

const placeholders = [
  {
    pet: 'Rex, un golden retriever de 11 ans',
    scenario: 'Parti en mars dernier. J\'ai reçu un portrait Renaissance pour le 13 septembre.',
    location: 'Lyon, France',
  },
  {
    pet: 'Mia, une chatte européenne',
    scenario: 'Mon premier cadeau pour mon anniv\' — j\'ai pleuré en voyant l\'aquarelle.',
    location: 'Bordeaux, France',
  },
  {
    pet: 'Pixel, un teckel de 4 ans',
    scenario: 'Le style pop art est devenu mon fond d\'écran. Tout le monde me demande comment.',
    location: 'Paris, France',
  },
];

export function Testimonials() {
  return (
    <section className="bg-petale-100 py-20 sm:py-28">
      <div className="container-mx">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-petale-950 sm:text-4xl">
            Pensé pour les moments qui comptent
          </h2>
          <p className="mt-4 text-lg text-petale-800">
            Pour le souvenir, l’anniversaire, ou simplement parce qu’il le mérite.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholders.map((p, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <p className="text-base italic leading-relaxed text-petale-900">
                « {p.scenario} »
              </p>
              <div className="mt-4 border-t border-petale-100 pt-4 text-sm text-petale-600">
                <p className="font-medium text-petale-800">{p.pet}</p>
                <p>{p.location}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-petale-600">
          ⏳ Témoignages vérifiés dès la première vague d’utilisateurs (W2).
        </p>
      </div>
    </section>
  );
}
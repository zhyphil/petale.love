/**
 * Examples 区块
 * 注：v0.1 阶段先用 placeholder 图片占位，部署前替换为真实生成图
 * 来源建议：先用 Replicate Flux 生成 6-8 张示范图，自用且不侵权
 */

const examples = [
  { style: 'Aquarelle', image: 'https://replicate.delivery/xezq/JqRd84qnikbsEZfL9tflkaE0vTvdaQvxmoffAuu2518gm5tc.png?width=400' },
  { style: 'Huile Renaissance', image: 'https://replicate.delivery/xezq/QVWtaklpYfVVfEqx57rc9TdAte2vPJ3b6gafDm9kDjggm5tc.png?width=400' },
  { style: 'Manga', image: 'https://replicate.delivery/xezq/rzg309VykBYHPd64QexaC9RQevgAHreOqcfLkPvoH9meMzb5.png?width=400' },
  { style: 'Pop Art', image: 'https://replicate.delivery/xezq/NQ8CH9e1lB3dZClvNzbWudxKz1Djwgshr4Ikmf4kZWc1ZeWu.png?width=400' },
  { style: 'Cyberpunk', image: 'https://replicate.delivery/xezq/kvWfK3AJmIxbRSYAYlPoEWHMJ4rTiF1W8WYPtKMCmVxBNvlL.png?width=400' },
  { style: 'Noël', image: 'https://replicate.delivery/xezq/6hXV1wjrOEZwAx6B1NrfvxMgqZnDi0A2SrPQ6FmtTowVNvlL.png?width=400' },
];

export function Examples() {
  return (
    <section id="examples" className="bg-petale-50 py-20 sm:py-28">
      <div className="container-mx">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-petale-950 sm:text-4xl">
            10 styles. 50 portraits. Une seule photo.
          </h2>
          <p className="mt-4 text-lg text-petale-700">
            Du Renaissance au cyberpunk, en passant par les thèmes saisonniers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {examples.map((ex) => (
            <div
              key={ex.style}
              className={`group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${ex.gradient} shadow-sm transition hover:scale-105 hover:shadow-xl`}
            >
              {/* v0.1.41: 真实生成的猫肖像（用猫订单的 6 张 v1 图） */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ex.image}
                alt={`Portrait style ${ex.style}`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-xs font-semibold text-white">{ex.style}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-petale-600">
          💡 Tous les portraits sont générés en HD. Parfaits pour Instagram, faire-part, ou un poster 30×40 cm à imprimer.
        </p>
      </div>
    </section>
  );
}
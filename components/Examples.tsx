/**
 * Examples 区块
 * 注：v0.1 阶段先用 placeholder 图片占位，部署前替换为真实生成图
 * 来源建议：先用 Replicate Flux 生成 6-8 张示范图，自用且不侵权
 */

const examples = [
  { style: 'Aquarelle', pet: 'Chat', gradient: 'from-petale-200 to-petale-400' },
  { style: 'Huile Renaissance', pet: 'Chien', gradient: 'from-amber-200 to-amber-500' },
  { style: 'Manga', pet: 'Chat', gradient: 'from-pink-200 to-rose-400' },
  { style: 'Pop Art', pet: 'Chien', gradient: 'from-yellow-200 to-orange-400' },
  { style: 'Cyberpunk', pet: 'Chat', gradient: 'from-purple-300 to-indigo-500' },
  { style: 'Noël', pet: 'Chien', gradient: 'from-red-200 to-red-400' },
];

export function Examples() {
  return (
    <section id="examples" className="bg-petale-50 py-20 sm:py-28">
      <div className="container-mx">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-petale-950 sm:text-4xl">
            12 styles. 50 portraits. Une seule photo.
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
              {/* 占位：实际部署前替换为真实生成图 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl opacity-30">
                  {ex.pet === 'Chat' ? '🐱' : '🐶'}
                </span>
              </div>
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
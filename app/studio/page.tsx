'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Loader2, Check, X } from 'lucide-react';
import Image from 'next/image';

interface Portrait {
  style: string;
  url: string;
}

const STYLE_LABELS: Record<string, string> = {
  watercolor: 'Aquarelle',
  renaissance: 'Renaissance',
  manga: 'Manga',
  'pop-art': 'Pop Art',
  cyberpunk: 'Cyberpunk',
  noel: 'Noël',
  aquarium: 'Aquarium',
  'stone-age': 'Préhistorique',
  'medieval-knight': 'Chevalier',
  astronaut: 'Astronaute',
  'vintage-film': 'Film 70s',
  impressionist: 'Impressionniste',
};

export default function StudioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [portraits, setPortraits] = useState<Portrait[]>([]);
  const [stage, setStage] = useState<'upload' | 'preview' | 'checkout' | 'success'>('upload');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 读 URL 参数：Stripe 跳回时带 ?success=true=  或 ?canceled=true
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setStage('success');
    } else if (params.get('canceled') === 'true') {
      setStage('upload');
    }
  }, []);

  function handleFile(f: File) {
    if (f.size > 10 * 1024 * 1024) {
      setError('Image trop volumineuse (max 10 Mo)');
      return;
    }
    if (!f.type.startsWith('image/')) {
      setError('Format non supporté (JPEG ou PNG)');
      return;
    }
    setError(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  async function generatePreviews() {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      // v0.1：先把图片上传到 /tmp 公开 URL（简化版，v0.2 走 Supabase Storage）
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Échec de l'upload de l'image");
      }

      const { url: imageUrl, uploadId } = await uploadRes.json();
      setUploadId(uploadId); // 保存到 state 供 checkout 用

      // 调用生成 API
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, mode: 'free-preview' }),
      });

      if (!genRes.ok) {
        throw new Error('La génération a échoué');
      }

      const data = await genRes.json();
      setPortraits(data.portraits);
      setStage('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  async function startCheckout() {
    if (!email || !file) return;
    setLoading(true);
    setError(null);

    try {
      // 重新上传（简化：复用之前的 imageUrl）
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const { url: imageUrl } = await uploadRes.json();

      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, imageUrl, uploadId }),
      });

      if (!checkoutRes.ok) throw new Error('Checkout échoué');

      const { url } = await checkoutRes.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-petale-50">
      {/* Header */}
      <header className="border-b border-petale-200 bg-white">
        <div className="container-mx flex items-center justify-between py-4">
          <a href="/" className="font-display text-2xl font-bold text-petale-950">
            petale
          </a>
          <a href="/" className="text-sm text-petale-700 hover:text-petale-950">
            ← Retour à l'accueil
          </a>
        </div>
      </header>

      <main className="container-mx max-w-4xl py-12">
        {stage === 'upload' && (
          <UploadStage
            preview={preview}
            onFile={handleFile}
            onSubmit={generatePreviews}
            loading={loading}
            error={error}
            fileInputRef={fileInputRef}
          />
        )}

        {stage === 'preview' && portraits.length > 0 && (
          <PreviewStage
            portraits={portraits}
            onContinue={(e) => {
              setEmail(e);
              setStage('checkout');
            }}
            onRestart={() => {
              setFile(null);
              setPreview(null);
              setPortraits([]);
              setStage('upload');
            }}
          />
        )}

        {stage === 'checkout' && (
          <CheckoutStage
            email={email}
            loading={loading}
            error={error}
            onChangeEmail={setEmail}
            onSubmit={startCheckout}
            onBack={() => setStage('preview')}
          />
        )}

        {stage === 'success' && <SuccessStage />}
      </main>
    </div>
  );
}

// ===== Stage components =====

function UploadStage({
  preview,
  onFile,
  onSubmit,
  loading,
  error,
  fileInputRef,
}: {
  preview: string | null;
  onFile: (f: File) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div>
      <h1 className="text-center font-display text-3xl font-bold text-petale-950 sm:text-4xl">
        Téléchargez la photo de votre compagnon
      </h1>
      <p className="mt-3 text-center text-petale-700">
        JPEG ou PNG · max 10 Mo · visage bien visible
      </p>

      <div className="mt-10">
        {!preview ? (
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-petale-300 bg-white p-12 transition hover:border-petale-500"
          >
            <Upload className="h-12 w-12 text-petale-500" />
            <p className="mt-4 text-base font-medium text-petale-900">
              Cliquez ou glissez une photo ici
            </p>
            <p className="mt-1 text-sm text-petale-600">
              Vos photos ne sont jamais partagées
            </p>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-3xl bg-white shadow-lg">
              <Image src={preview} alt="Preview" fill className="object-cover" />
            </div>
            <div className="text-center">
              <button
                onClick={onSubmit}
                disabled={loading}
                className="btn-primary text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Génération en cours…
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Générer 3 portraits gratuits
                  </>
                )}
              </button>
              <p className="mt-3 text-xs text-petale-600">
                ~30 secondes · Aucune carte requise
              </p>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}

function PreviewStage({
  portraits,
  onContinue,
  onRestart,
}: {
  portraits: Portrait[];
  onContinue: (email: string) => void;
  onRestart: () => void;
}) {
  const [email, setEmail] = useState('');

  return (
    <div>
      <div className="text-center">
        <Check className="mx-auto h-12 w-12 text-green-600" />
        <h1 className="mt-4 font-display text-3xl font-bold text-petale-950 sm:text-4xl">
          Voici vos 6 portraits gratuits
        </h1>
        <p className="mt-3 text-petale-700">
          Vous aimez ? Obtenez 42 autres pour €9,99.
          <br />
          Pas convaincu ? Aucun engagement.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {portraits.map((p) => (
          <div
            key={p.style}
            className="overflow-hidden rounded-2xl bg-white shadow-lg"
          >
            <div className="relative aspect-square">
              <Image src={p.url} alt={STYLE_LABELS[p.style]} fill className="object-cover" />
            </div>
            <div className="p-3 text-center text-sm font-semibold text-petale-800">
              {STYLE_LABELS[p.style]}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border-2 border-petale-600 bg-white p-8 shadow-xl">
        <h2 className="text-center font-display text-2xl font-bold text-petale-950">
          Débloquez les 42 autres portraits
        </h2>
        <p className="mt-2 text-center text-petale-700">
          10 styles × 5 variantes · 50 portraits HD
        </p>

        <div className="mt-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.fr"
            required
            className="block w-full rounded-xl border border-petale-300 px-4 py-3 text-petale-950 placeholder-petale-400 focus:border-petale-500 focus:outline-none"
            aria-label="Votre email pour recevoir les portraits"
          />
          <button
            onClick={() => email && onContinue(email)}
            disabled={!email}
            className="btn-primary mt-3 w-full text-lg"
          >
            Continuer · €9,99
          </button>
        </div>

        <button onClick={onRestart} className="mt-4 w-full text-sm text-petale-600 hover:text-petale-800">
          Changer de photo
        </button>
      </div>
    </div>
  );
}

function CheckoutStage({
  email,
  loading,
  error,
  onChangeEmail,
  onSubmit,
  onBack,
}: {
  email: string;
  loading: boolean;
  error: string | null;
  onChangeEmail: (e: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-center font-display text-3xl font-bold text-petale-950">
        Finalisation de la commande
      </h1>

      <div className="mt-8 rounded-3xl border border-petale-200 bg-white p-6 shadow-lg">
        <div className="flex items-baseline justify-between border-b border-petale-100 pb-4">
          <span className="text-petale-700">Pack 50 portraits</span>
          <span className="font-display text-2xl font-bold text-petale-950">9,99 €</span>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-petale-700">
          <li>✓ 50 portraits HD</li>
          <li>✓ 12 styles au choix</li>
          <li>✓ Téléchargement définitif après paiement</li>
        </ul>

        <div className="mt-6">
          <label className="block text-sm font-medium text-petale-800">
            Email pour recevoir vos portraits
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-petale-300 px-4 py-3 text-petale-950 focus:border-petale-500 focus:outline-none"
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={loading || !email}
          className="btn-primary mt-6 w-full text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Redirection vers Stripe…
            </>
          ) : (
            'Payer 9,99 € avec Stripe'
          )}
        </button>

        <button onClick={onBack} className="mt-3 w-full text-sm text-petale-600 hover:text-petale-800">
          ← Retour
        </button>

        {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
      </div>

      <p className="mt-4 text-center text-xs text-petale-600">
        Paiement sécurisé par Stripe · Carte bancaire · Apple Pay
      </p>
    </div>
  );
}

function SuccessStage() {
  return (
    <div className="text-center">
      <Check className="mx-auto h-16 w-16 text-green-600" />
      <h1 className="mt-6 font-display text-3xl font-bold text-petale-950 sm:text-4xl">
        Merci ! Vos portraits arrivent.
      </h1>
      <p className="mt-3 text-petale-700">
        Vous recevrez vos 50 portraits HD dans quelques minutes par email.
      </p>
      <a href="/" className="btn-secondary mt-8">
        Retour à l'accueil
      </a>
    </div>
  );
}
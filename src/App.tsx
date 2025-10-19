// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  Check,
  Dog,
  Cat,
  Shield,
  Sparkles,
  HeartHandshake,
  Video as VideoIcon,
  Building2,
  Phone,
  Mail,
  Menu,
  X,
  ArrowUp,
  Download,
} from "lucide-react";

/* ---------- Mini utilitaire CSS ---------- */
function cx(...cls) {
  return cls.filter(Boolean).join(" ");
}

/* ---------- Bouton réutilisable ---------- */
function Button({ variant = "solid", className = "", children, ...props }) {
  const base = "px-4 py-2 rounded-2xl text-sm transition inline-flex items-center gap-2";
  const styles =
    variant === "outline"
      ? "border border-slate-700 text-slate-100 hover:bg-slate-800"
      : variant === "ghost"
      ? "text-slate-300 hover:text-white"
      : "bg-indigo-600 text-white hover:bg-indigo-700";
  return (
    <button className={cx(base, styles, className)} {...props}>
      {children}
    </button>
  );
}

/* ---------- Données produit (prix modifié à 4000€) ---------- */
const robots = [
  {
    id: "r1",
    name: "Compagnon SYMPA",
    short:
      "Robot d'accompagnement pour seniors — sécurité, assistance et présence quotidienne.",
    price: 4000, // <-- prix mis à jour ici
    features: [
      "Aide à la mobilité légère",
      "Surveillance santé basique",
      "Appels d'urgence automatiques",
      "Interaction vocale chaleureuse",
    ],
    img: null,
  },
  {
    id: "r2",
    name: "Gardien JOIE",
    short: "Robot de surveillance domestique et assistance sociale.",
    price: 4000, // même prix
    features: ["Détection de chutes", "Notif. famille", "Agenda vocal"],
    img: null,
  },
];

/* ---------- Section commentaires (avec retours touchants) ---------- */
const defaultComments = [
  {
    id: "c1",
    name: "Marie, 72 ans",
    text:
      "Depuis que j'ai SYMPA à la maison, je me sens moins seule. Il me tient compagnie et rappelle mes rendez-vous — ça me rassure énormément.",
    date: "2025-08-12",
  },
  {
    id: "c2",
    name: "Antoine (fils de Gérard)",
    text:
      "Mon père a retrouvé le sourire. Le robot n'a pas remplacé les visites, mais il a donné un vrai plus pour sa sécurité et sa liberté.",
    date: "2025-06-30",
  },
  {
    id: "c3",
    name: "Nadia, 65 ans",
    text:
      "Je me promène plus sereinement maintenant. Quand j'oublie quelque chose, le robot m'aide et me rassure. C'est devenu presque un ami.",
    date: "2025-09-05",
  },
];

function Price({ value }) {
  return <span className="text-2xl font-bold">{value.toLocaleString()} €</span>;
}

/* ---------- Composant principal ---------- */
export default function App() {
  const [comments, setComments] = useState(() => {
    try {
      const stored = localStorage.getItem("site_comments_v1");
      return stored ? JSON.parse(stored) : defaultComments;
    } catch {
      return defaultComments;
    }
  });

  const [form, setForm] = useState({ name: "", text: "" });

  useEffect(() => {
    try {
      localStorage.setItem("site_comments_v1", JSON.stringify(comments));
    } catch {}
  }, [comments]);

  function handleAddComment(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    const newComment = {
      id: "c" + Date.now(),
      name: form.name.trim(),
      text: form.text.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    setComments((c) => [newComment, ...c]);
    setForm({ name: "", text: "" });
  }

  function handleRemove(id) {
    if (!confirm("Supprimer ce commentaire ?")) return;
    setComments((c) => c.filter((x) => x.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold">DO/USYS — Robots d'accompagnement</h1>
          <nav className="flex gap-4 items-center">
            <Button variant="ghost" className="text-slate-300">Accueil</Button>
            <Button variant="ghost" className="text-slate-300">Produits</Button>
            <Button variant="ghost" className="text-slate-300">Contact</Button>
          </nav>
        </div>
        <p className="mt-4 text-slate-300 max-w-2xl">
          Solutions pour le maintien à domicile — sécurité, interaction et autonomie.
        </p>
      </header>

      <main className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
        {/* ----- Produits ----- */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Nos robots</h2>
          <div className="space-y-4">
            {robots.map((r) => (
              <article key={r.id} className="bg-slate-800 p-4 rounded-2xl shadow">
                <div className="flex items-start gap-4">
                  <div className="w-28 h-20 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300">
                    {/* image placeholder */}
                    <Sparkles size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{r.name}</h3>
                        <p className="text-sm text-slate-300">{r.short}</p>
                      </div>
                      <div className="text-right">
                        <Price value={r.price} />
                        <div className="text-xs text-slate-400">prix public conseillé</div>
                      </div>
                    </div>

                    <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
                      {r.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check size={16} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex gap-2">
                      <Button>Demander une démo</Button>
                      <Button variant="outline">Voir la fiche</Button>
                      <Button variant="ghost" className="ml-auto">Brochure <Download size={14} /></Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ----- Commentaires particuliers ----- */}
        <aside>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-semibold">Commentaires — Témoignages</h2>
            <div className="text-sm text-slate-400">Retours véridiques & touchants</div>
          </div>

          <div className="space-y-4">
            <form onSubmit={handleAddComment} className="bg-slate-800 p-4 rounded-2xl">
              <div className="mb-3">
                <label className="block text-xs text-slate-300 mb-1">Votre nom</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  className="w-full bg-slate-700 rounded px-3 py-2 text-slate-100 text-sm"
                  placeholder="Ex: Lucie, 68 ans"
                />
              </div>
              <div className="mb-3">
                <label className="block text-xs text-slate-300 mb-1">Votre retour</label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm((s) => ({ ...s, text: e.target.value }))}
                  className="w-full bg-slate-700 rounded px-3 py-2 text-slate-100 text-sm"
                  rows={3}
                  placeholder="Racontez brièvement ce que le robot a changé pour vous ou un proche..."
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit">Ajouter mon commentaire</Button>
                <Button variant="ghost" onClick={() => setForm({ name: "", text: "" })}>Effacer</Button>
                <div className="ml-auto text-xs text-slate-400">Les commentaires sont publics</div>
              </div>
            </form>

            <div className="space-y-3">
              {comments.length === 0 ? (
                <div className="text-slate-400">Aucun commentaire pour l'instant — soyez le premier.</div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="bg-slate-800 p-3 rounded-xl relative">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-medium">
                        {c.name.split(" ").map((n) => n[0]).slice(0,2).join("")}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="font-semibold">{c.name}</div>
                            <div className="text-xs text-slate-400">{c.date}</div>
                          </div>
                          <div className="text-slate-400 text-sm flex items-center gap-2">
                            <span>Approuvé</span>
                            <Check size={16} />
                          </div>
                        </div>

                        <p className="mt-2 text-slate-200">{c.text}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(c.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-white"
                      title="Supprimer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 text-sm text-slate-400">
            <strong>Note :</strong> Les témoignages proviennent de particuliers et familles utilisant nos solutions.
          </div>
        </aside>
      </main>

      <footer className="max-w-5xl mx-auto mt-12 text-slate-500 text-sm">
        <hr className="border-slate-800 mb-4" />
        <div className="flex items-center justify-between">
          <div>© {new Date().getFullYear()} DO/USYS — Tous droits réservés</div>
          <div className="flex items-center gap-4">
            <a className="hover:text-slate-200">Mentions légales</a>
            <a className="hover:text-slate-200">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

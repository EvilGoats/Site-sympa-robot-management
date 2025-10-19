import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Dog,
  Cat,
  Sparkles,
  Video as VideoIcon,
  Menu,
  X,
  ArrowUp,
  Download,
} from "lucide-react";

/* ---------- Mini UI kit (sans lib externe) ---------- */
function cx(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}
function Button({
  variant = "solid",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
}) {
  const base = "px-4 py-2 rounded-2xl text-sm transition";
  const styles =
    variant === "outline"
      ? "border border-slate-700 text-slate-100 hover:bg-slate-800"
      : variant === "ghost"
      ? "text-slate-300 hover:text-white"
      : "bg-indigo-600 text-white hover:bg-indigo-700";
  return <button className={cx(base, styles, className)} {...props} />;
}
function Card({
  className = "",
  children,
}: {
  className?: string;
  children: any;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-slate-800 shadow-sm bg-slate-900",
        className
      )}
    >
      {children}
    </div>
  );
}
function CardHeader({ children }: { children: any }) {
  return <div className="p-4 border-b border-slate-800">{children}</div>;
}
function CardTitle({
  className = "",
  children,
}: {
  className?: string;
  children: any;
}) {
  return <h3 className={cx("font-semibold", className)}>{children}</h3>;
}
function CardContent({
  className = "",
  children,
}: {
  className?: string;
  children: any;
}) {
  return <div className={cx("p-4", className)}>{children}</div>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "h-10 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
        props.className
      )}
    />
  );
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(
        "rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400",
        props.className
      )}
    />
  );
}

/* ---------- Types commentaires ---------- */
type Review = {
  id: string;
  name: string;
  text: string;
  date: string; // ISO string
};

/* ---------- App ---------- */
export default function SympaLanding() {
  // Assets basés sur PUBLIC_URL (utile pour GitHub Pages)
  const BASE_URL = process.env.PUBLIC_URL || "";
  const LOGO = `${BASE_URL}/logo-sympa.png`;
  const VIDEO_SRC = `${BASE_URL}/veo-demo.mp4`;
  const POSTER = `${BASE_URL}/poster-veo.jpg`;

  // State & navigation
  const [showContact, setShowContact] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<
    "features" | "video" | "pricing" | "reviews" | "events" | "faq" | null
  >(null);

  // --- Commentaires (localStorage) ---
  const DEFAULT_REVIEWS: Review[] = [
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
        "Mon père a retrouvé le sourire. Le robot n'a pas remplacé les visites, mais il a apporté un vrai plus pour sa sécurité et sa liberté.",
      date: "2025-06-30",
    },
    {
      id: "c3",
      name: "Nadia, 65 ans",
      text:
        "Je me promène plus sereinement maintenant. Quand j'oublie quelque chose, le robot m'aide et me rassure. C'est presque un ami.",
      date: "2025-09-05",
    },
  ];
  const STORAGE_KEY = "sympa_reviews_v1";

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Review[]) : DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  });
  const [reviewForm, setReviewForm] = useState<{ name: string; text: string }>(
    { name: "", text: "" }
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      /* ignore */
    }
  }, [reviews]);

  function addReview(e: React.FormEvent) {
    e.preventDefault();
    const name = reviewForm.name.trim();
    const text = reviewForm.text.trim();
    if (!name || !text) return;
    const newReview: Review = {
      id: "c" + Date.now(),
      name,
      text,
      date: new Date().toISOString().slice(0, 10),
    };
    setReviews((r) => [newReview, ...r]);
    setReviewForm({ name: "", text: "" });
  }

  function removeReview(id: string) {
    if (!confirm("Supprimer ce commentaire ?")) return;
    setReviews((r) => r.filter((x) => x.id !== id));
  }

  // injecte police + favicon + scroll doux
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");
    const linkFont = document.createElement("link");
    linkFont.rel = "stylesheet";
    linkFont.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap";
    document.head.appendChild(linkFont);

    const linkIcon = document.createElement("link");
    linkIcon.rel = "icon";
    linkIcon.type = "image/png";
    linkIcon.href = LOGO;
    document.head.appendChild(linkIcon);

    const root = document.getElementById("root");
    if (root) (root as HTMLElement).style.fontFamily = `'Poppins', ui-sans-serif, system-ui`;
  }, [LOGO]);

  // Scrollspy simple (ajout de "reviews")
  useEffect(() => {
    const sections = ["features", "video", "pricing", "reviews", "events", "faq"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    function onScroll() {
      let current: typeof active = null;
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          current = sec.id as typeof active;
        }
      });
      setActive(current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  const navLinkCls = (id: NonNullable<typeof active>) =>
    cx(
      "hover:text-indigo-400",
      active === id ? "text-indigo-400 font-semibold" : "text-slate-300"
    );

  // succès du formulaire contact
  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setShowContact(false);
      setContactSent(false);
    }, 1500);
  }

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased" id="top">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <a href="#top" className="flex items-center gap-2">
            <img src={LOGO} alt="Logo SYMPA" className="h-9 w-9 object-contain" />
            <span className="font-semibold tracking-tight">Projet SYMPA</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className={navLinkCls("features")}>Fonctionnalités</a>
            <a href="#video" className={navLinkCls("video")}>Vidéo</a>
            <a href="#pricing" className={navLinkCls("pricing")}>Offres</a>
            <a href="#reviews" className={navLinkCls("reviews")}>Commentaires</a>
            <a href="#events" className={navLinkCls("events")}>Événements</a>
            <a href="#faq" className={navLinkCls("faq")}>FAQ</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button className="rounded-2xl hidden md:inline-flex" onClick={() => setShowContact(true)}>
              Contact
            </Button>
            <button
              className="md:hidden p-2 rounded-xl border border-slate-700"
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="Ouvrir le menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900/95">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">
              {["features","video","pricing","reviews","events","faq"].map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  className={navLinkCls(id as NonNullable<typeof active>)}
                >
                  {id === "features" ? "Fonctionnalités" :
                   id === "video"    ? "Vidéo" :
                   id === "pricing"  ? "Offres" :
                   id === "reviews"  ? "Commentaires" :
                   id === "events"   ? "Événements" : "FAQ"}
                </a>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setShowContact(true);
                  setMenuOpen(false);
                }}
              >
                Contact
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-4 py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100/10 px-3 py-1 text-indigo-300 text-xs font-medium">
              <Sparkles className="h-4 w-4" /> Nouveau • Compagnon robotique personnalisable
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
              Le compagnon qui <span className="text-indigo-400">veille</span>,{" "}
              <br className="hidden sm:block" />
              écoute et protège
            </h1>
            <p className="mt-4 text-slate-300 text-lg">
              SYMPA aide les personnes âgées à domicile : assistance en douceur,
              détection des situations à risque et présence rassurante.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#video">
                <Button className="rounded-2xl">
                  <VideoIcon className="mr-2 h-4 w-4" />
                  Voir la démo
                </Button>
              </a>
              <a href="#pricing">
                <Button variant="outline" className="rounded-2xl">
                  Découvrir les offres
                </Button>
              </a>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-indigo-400" /> Assistance au relevage (guidage et support)
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-indigo-400" /> Interaction naturelle (voix, gestes, routines)
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-indigo-400" /> Apparence <b>personnalisable</b> : chien ou chat
              </li>
            </ul>
          </div>
          <div className="relative flex justify-center items-center">
            <img src={LOGO} alt="Logo SYMPA" className="h-40 w-40 opacity-80 animate-pulse" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Fonctionnalités</h2>
          <p className="mt-2 text-slate-300">Configurables selon vos envies, conçues pour rassurer et assister.</p>

          <div className="mt-8 grid md:grid-cols-4 gap-6">
            {[
              {
                src: "https://picsum.photos/seed/robotdog/800/600",
                txt: "Chien robot – configuré (couleurs, yeux LED, accessoires).",
              },
              {
                src: "https://picsum.photos/seed/robotcat/800/600",
                txt: "Chat robot – configuré (mouvements, sons, motifs).",
              },
              {
                src: "https://picsum.photos/seed/doggrandma/800/600",
                txt: "Assistance en promenade : vigilance & présence rassurante.",
              },
              {
                src: "https://picsum.photos/seed/catbed/800/600",
                txt: "Veille de nuit : proximité discrète, alerte si besoin.",
              },
            ].map((c, i) => (
              <Card key={i} className="overflow-hidden group">
                <img
                  src={c.src}
                  alt=""
                  className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <CardContent className="text-sm text-slate-300">{c.txt}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section id="video" className="py-16 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold">Découvrez la vidéo</h2>
            <p className="mt-2 text-slate-300">
              SYMPA en situation réelle : assistance, interaction et présence rassurante.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-indigo-400" /> Versions « chien » et « chat »
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-indigo-400" /> Slogan : <i>« SYMPA, le compagnon qui veille et protège »</i>
              </li>
            </ul>
          </div>

          <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-xl bg-slate-800">
            <video
              controls
              playsInline
              muted
              preload="auto"
              className="w-full h-full object-cover"
              src={VIDEO_SRC}
              poster={POSTER}
            >
              <source src={VIDEO_SRC} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos HTML5.
            </video>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-3">
          <a
            href={VIDEO_SRC}
            download
            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 underline"
          >
            <Download className="h-4 w-4" />
            Télécharger la vidéo
          </a>
        </div>
      </section>

      {/* OFFRES */}
      <section id="pricing" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Offres</h2>
          <p className="mt-2 text-slate-300">Choisissez l’option qui convient à vos besoins. Tarifs de lancement v1.</p>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="border-indigo-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dog className="h-5 w-5 text-indigo-400" /> Achat
                  <span className="bg-indigo-700/40 text-indigo-200 text-xs px-2 py-1 rounded-full ml-2">
                    Garantie 5 ans
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                {/* PRIX MIS À JOUR */}
                <div className="text-3xl font-bold">4 000 €</div>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-indigo-400" /> Contrat de maintenance <b>5 ans</b> inclus
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-indigo-400" /> Installation & paramétrage
                  </li>
                </ul>
                <Button className="rounded-2xl w-full" onClick={() => setShowContact(true)}>
                  Obtenir une offre
                </Button>
              </CardContent>
            </Card>

            <Card className="border-indigo-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cat className="h-5 w-5 text-indigo-400" /> Location
                  <span className="bg-emerald-700/30 text-emerald-200 text-xs px-2 py-1 rounded-full ml-2">
                    Souple
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <div className="text-3xl font-bold">50 € / mois</div>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-indigo-400" /> Robot inclus (chien ou chat)
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-indigo-400" /> Mises à jour & télésurveillance
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 text-indigo-400" /> Échange standard en 48h
                  </li>
                </ul>
                <Button variant="outline" className="rounded-2xl w-full" onClick={() => setShowContact(true)}>
                  Essayer 3 mois
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* COMMENTAIRES — TÉMOIGNAGES */}
      <section id="reviews" className="py-16 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-bold">Commentaires – Témoignages de particuliers</h2>
            <span className="text-xs rounded-full px-3 py-1 bg-indigo-700/40 text-indigo-200 border border-indigo-500/30">
              Vos retours comptent
            </span>
          </div>

          {/* Formulaire */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Partager votre expérience</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={addReview}>
                <div className="grid md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Votre nom (ex. Lucie, 68 ans)"
                    value={reviewForm.name}
                    onChange={(e) =>
                      setReviewForm((s) => ({ ...s, name: e.target.value }))
                    }
                    required
                  />
                  <Input
                    placeholder="Optionnel: relation (ex. fils de…)"
                    onChange={() => void 0}
                    className="opacity-60"
                  />
                </div>
                <Textarea
                  placeholder="Racontez brièvement ce que le robot a changé pour vous ou un proche…"
                  rows={4}
                  value={reviewForm.text}
                  onChange={(e) =>
                    setReviewForm((s) => ({ ...s, text: e.target.value }))
                  }
                  required
                />
                <div className="flex items-center gap-2">
                  <Button type="submit" className="rounded-2xl">Publier</Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setReviewForm({ name: "", text: "" })}
                    className="rounded-2xl"
                  >
                    Effacer
                  </Button>
                  <span className="ml-auto text-xs text-slate-400">
                    Les commentaires sont publics (stockés sur votre appareil).
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Liste des avis */}
          <div className="mt-6 grid gap-4">
            {reviews.length === 0 ? (
              <div className="text-slate-400">
                Aucun commentaire pour l’instant — soyez le premier.
              </div>
            ) : (
              reviews.map((c) => (
                <div key={c.id} className="relative rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-medium">
                      {c.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-xs text-slate-400">
                          {new Date(c.date).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                      <p className="mt-2 text-slate-200">{c.text}</p>
                      <div className="mt-2 text-xs text-emerald-300 inline-flex items-center gap-1">
                        <Check className="h-4 w-4" /> Approuvé
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeReview(c.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-white"
                    title="Supprimer"
                    aria-label="Supprimer le commentaire"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="py-16 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-bold">Événements</h2>
            <span className="text-xs rounded-full px-3 py-1 bg-indigo-700/40 text-indigo-200 border border-indigo-500/30">
              Nouveau
            </span>
          </div>

          <div className="mt-6 rounded-3xl overflow-hidden border border-indigo-700/40 bg-gradient-to-br from-indigo-900/50 to-slate-900">
            <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6 md:gap-10 items-center">
              <div className="md:col-span-2">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-200 bg-indigo-700/30 border border-indigo-600/40 rounded-full px-3 py-1">
                  Offre de lancement
                </div>
                <h3 className="mt-3 text-2xl font-semibold">
                  Parmi les <span className="text-indigo-300">100 premiers robots achetés</span>, une chance de{" "}
                  <span className="text-emerald-300">gagner 1 000 €</span> 🎉
                </h3>
                <p className="mt-2 text-slate-300 text-sm">
                  Tirage au sort parmi les 100 premières commandes (1 gagnant).
                  Règlement disponible sur demande. Offre valable jusqu’à épuisement du stock de lancement.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button className="rounded-2xl" onClick={() => setShowContact(true)}>Je participe</Button>
                  <Button variant="outline" className="rounded-2xl" onClick={() => window.location.assign("#pricing")}>
                    Voir les offres
                  </Button>
                </div>
              </div>

              <div className="md:justify-self-end w-full">
                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
                  <div className="text-sm text-slate-300">Compteur de lancement</div>
                  <div className="mt-2 text-3xl font-bold">100</div>
                  <div className="text-xs text-slate-400">places disponibles au tirage</div>
                  <div className="mt-4 text-xs text-slate-400">
                    * Exemple statique pour la démo (non connecté).
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
              <div className="font-medium">Plus d’événements à venir</div>
              <p className="text-sm mt-1">
                Démonstrations en EHPAD, journées portes ouvertes et ateliers aidants. Restez connectés !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6 text-sm text-slate-300">
          <Card>
            <CardHeader><CardTitle>Le robot est-il sûr ?</CardTitle></CardHeader>
            <CardContent>Oui, SYMPA suit un plan sécurité et des tests de qualification. Les aides au relevage sont guidées et surveillées.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Mes données sont-elles protégées ?</CardTitle></CardHeader>
            <CardContent>Minimisation des données, consentements clairs, hébergement conforme RGPD.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Chien ou chat, puis-je changer ?</CardTitle></CardHeader>
            <CardContent>Oui, apparence personnalisable à l’achat et adaptable.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Quelle maintenance ?</CardTitle></CardHeader>
            <CardContent>Mises à jour à distance et support sous 48h.</CardContent>
          </Card>
        </div>
      </section>

      {/* CONTACT MODAL */}
      {showContact && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal>
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">Nous écrire</h3>
              <button className="text-slate-400 hover:text-slate-200" onClick={() => setShowContact(false)}>✕</button>
            </div>
            {contactSent ? (
              <div className="mt-6 rounded-xl border border-emerald-700 bg-emerald-900/30 text-emerald-200 p-4">
                Merci ! Votre message a bien été envoyé.
              </div>
            ) : (
              <form className="mt-4 grid gap-3" onSubmit={handleContactSubmit}>
                <Input placeholder="Nom" required />
                <Input type="email" placeholder="Email" required />
                <Textarea placeholder="Votre message…" rows={4} required />
                <Button className="rounded-2xl" type="submit">Envoyer</Button>
                <p className="text-xs text-slate-400">
                  En soumettant, vous acceptez notre politique de confidentialité.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {year} Projet SYMPA – Le compagnon qui veille et protège</p>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-slate-200">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-slate-200">Offres</a>
            <a href="#reviews" className="hover:text-slate-200">Commentaires</a>
            <a href="#events" className="hover:text-slate-200">Événements</a>
            <a onClick={() => setShowContact(true)} className="hover:text-slate-200 cursor-pointer">Contact</a>
          </div>
        </div>
      </footer>

      {/* Back-to-top */}
      <Button
        variant="solid"
        className="fixed bottom-6 right-6 rounded-full p-3 shadow-lg"
        aria-label="Remonter en haut"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}

import { useState } from 'react';
import { Wine, Sparkles, Globe, TrendingUp, Heart, ChevronRight, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';

type Category = 'all' | 'red' | 'white' | 'sparkling' | 'exploration';

const suggestions = [
  {
    title: 'Châteauneuf-du-Pape',
    subtitle: 'Southern Rhône, France',
    description: 'Rich, full-bodied red with dark fruit, garrigue herbs, and spice. A classic that rewards cellaring.',
    tag: 'red' as const,
    reason: 'Bold red lovers',
    pairings: ['Lamb', 'Aged cheese', 'Mushroom risotto'],
    priceRange: '€€€',
  },
  {
    title: 'Grüner Veltliner',
    subtitle: 'Wachau, Austria',
    description: 'Peppery, refreshing white with white peach and mineral backbone. Endlessly versatile at the table.',
    tag: 'white' as const,
    reason: 'Crisp white fans',
    pairings: ['Wiener Schnitzel', 'Sushi', 'Asparagus'],
    priceRange: '€€',
  },
  {
    title: 'Crémant d\'Alsace',
    subtitle: 'Alsace, France',
    description: 'Elegant bubbles with notes of green apple and brioche — Champagne quality at a fraction of the price.',
    tag: 'sparkling' as const,
    reason: 'Sparkling seekers',
    pairings: ['Oysters', 'Brunch', 'Goat cheese'],
    priceRange: '€€',
  },
  {
    title: 'Ribera del Duero Reserva',
    subtitle: 'Castilla y León, Spain',
    description: 'Deep Tempranillo with dark cherry, leather, and vanilla from oak aging. Powerful yet elegant.',
    tag: 'red' as const,
    reason: 'Spanish wine curious',
    pairings: ['Grilled steak', 'Chorizo', 'Manchego'],
    priceRange: '€€€',
  },
  {
    title: 'Sancerre',
    subtitle: 'Loire Valley, France',
    description: 'Benchmark Sauvignon Blanc — racy acidity, citrus, and flinty minerality from limestone soils.',
    tag: 'white' as const,
    reason: 'Mineral-driven whites',
    pairings: ['Goat cheese salad', 'Shellfish', 'Herb chicken'],
    priceRange: '€€',
  },
  {
    title: 'Barolo',
    subtitle: 'Piedmont, Italy',
    description: 'The "King of Wines" — powerful Nebbiolo with rose, tar, and incredible aging potential.',
    tag: 'red' as const,
    reason: 'Italian wine lovers',
    pairings: ['Truffle pasta', 'Braised beef', 'Porcini'],
    priceRange: '€€€€',
  },
  {
    title: 'Prosecco Superiore DOCG',
    subtitle: 'Valdobbiadene, Italy',
    description: 'Delicate, floral bubbles with pear and white flowers. The perfect aperitivo.',
    tag: 'sparkling' as const,
    reason: 'Casual celebrations',
    pairings: ['Aperitivo', 'Light seafood', 'Fruit tarts'],
    priceRange: '€',
  },
  {
    title: 'Albariño',
    subtitle: 'Rías Baixas, Spain',
    description: 'Aromatic coastal white with peach, salinity, and vibrant acidity. Made for seafood.',
    tag: 'white' as const,
    reason: 'Coastal exploration',
    pairings: ['Grilled octopus', 'Ceviche', 'Paella'],
    priceRange: '€€',
  },
];

const categories: { value: Category; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'All', icon: Sparkles },
  { value: 'red', label: 'Reds', icon: Wine },
  { value: 'white', label: 'Whites', icon: Globe },
  { value: 'sparkling', label: 'Sparkling', icon: TrendingUp },
];

const tagColors: Record<string, string> = {
  red: 'bg-wine-red/20 text-wine-red-light border-wine-red/30',
  white: 'bg-wine-white-grape/20 text-wine-white-grape border-wine-white-grape/30',
  sparkling: 'bg-wine-sparkling/20 text-wine-sparkling border-wine-sparkling/30',
  exploration: 'bg-accent/20 text-accent border-accent/30',
};

const SuggestionsPage = () => {
  const [active, setActive] = useState<Category>('all');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const filtered = active === 'all' ? suggestions : suggestions.filter(s => s.tag === active);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-10 pb-2 px-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-accent" />
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Curated for you</p>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Discover</h1>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setActive(cat.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  active === cat.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wine of the day highlight */}
      <div className="px-5 py-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 p-5">
          <div className="absolute top-3 right-3">
            <Badge className="bg-accent/20 text-accent border border-accent/30 text-[10px]">
              Wine of the Day
            </Badge>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Wine className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight">{suggestions[new Date().getDay() % suggestions.length].title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{suggestions[new Date().getDay() % suggestions.length].subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-2">
                {suggestions[new Date().getDay() % suggestions.length].description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestion cards */}
      <div className="flex-1 px-5 space-y-3 pb-28">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-muted-foreground">{filtered.length} suggestions</p>
        </div>

        {filtered.map((s, i) => {
          const isExpanded = expandedIdx === i;
          return (
            <Card
              key={i}
              className="overflow-hidden bg-card/80 backdrop-blur border-border hover:border-primary/30 transition-all duration-300 cursor-pointer"
              onClick={() => setExpandedIdx(isExpanded ? null : i)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="outline" className={`text-[10px] capitalize border ${tagColors[s.tag] || ''}`}>
                        {s.tag}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{s.priceRange}</span>
                    </div>
                    <h3 className="font-semibold text-base leading-tight">{s.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.subtitle}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 mt-2 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                </div>

                <p className={`text-sm text-muted-foreground leading-relaxed mt-2 ${isExpanded ? '' : 'line-clamp-2'}`}>
                  {s.description}
                </p>

                {isExpanded && (
                  <div className="mt-4 space-y-3 animate-fade-in">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Heart className="w-3 h-3" /> Best for
                      </p>
                      <p className="text-sm text-foreground">{s.reason}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Pairs with
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.pairings.map((p) => (
                          <span key={p} className="text-xs bg-muted/80 text-muted-foreground rounded-full px-2.5 py-1">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default SuggestionsPage;

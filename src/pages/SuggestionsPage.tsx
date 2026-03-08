import { Lightbulb, Wine, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BottomNav from '@/components/BottomNav';

const suggestions = [
  {
    title: 'Try a Grüner Veltliner',
    description: 'Based on your love for crisp whites, this Austrian classic offers peppery freshness and citrus notes.',
    tag: 'White',
  },
  {
    title: 'Explore Ribera del Duero',
    description: 'If you enjoy bold reds, this Spanish region produces deep Tempranillo wines with dark fruit and spice.',
    tag: 'Red',
  },
  {
    title: 'Crémant d\'Alsace',
    description: 'A fantastic sparkling alternative to Champagne — elegant bubbles at a fraction of the price.',
    tag: 'Sparkling',
  },
];

const SuggestionsPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-display font-bold">Suggestions</h1>
        </div>
        <p className="text-muted-foreground text-sm">Wines we think you'll love</p>
      </div>

      <div className="flex-1 px-6 space-y-4 pb-28">
        {suggestions.map((s, i) => (
          <Card key={i} className="p-5 bg-card border-border">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wine className="w-4 h-4 text-primary" />
                <h3 className="font-display font-semibold">{s.title}</h3>
              </div>
              <Badge variant="secondary" className="text-xs">{s.tag}</Badge>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default SuggestionsPage;

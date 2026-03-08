import { Tables } from '@/integrations/supabase/types';
import StarRating from './StarRating';
import { Wine, MapPin, Grape, Calendar, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type WineRow = Tables<'wines'>;

const colorBadgeMap: Record<string, string> = {
  red: 'bg-wine-red/20 text-wine-red-light',
  white: 'bg-wine-white-grape/20 text-wine-white-grape',
  rosé: 'bg-wine-rosé/20 text-wine-rosé',
  sparkling: 'bg-wine-sparkling/20 text-wine-sparkling',
  dessert: 'bg-wine-gold/20 text-wine-gold',
  orange: 'bg-accent/20 text-accent',
};

interface WineCardProps {
  wine: WineRow;
  onEdit: (wine: WineRow) => void;
  onDelete: (id: string) => void;
}

const WineCard = ({ wine, onEdit, onDelete }: WineCardProps) => {
  return (
    <div className="group bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {wine.color && (
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-sans font-medium', colorBadgeMap[wine.color] || 'bg-muted text-muted-foreground')}>
                {wine.color}
              </span>
            )}
            {wine.vintage && (
              <span className="text-xs text-muted-foreground font-sans flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {wine.vintage}
              </span>
            )}
          </div>
          <h3 className="font-display text-lg font-semibold truncate">{wine.name}</h3>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground font-sans">
            {wine.region && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {wine.region}
              </span>
            )}
            {wine.grape_variety && (
              <span className="flex items-center gap-1">
                <Grape className="w-3.5 h-3.5" /> {wine.grape_variety}
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <Wine className="w-10 h-10 text-primary/40" />
        </div>
      </div>

      {wine.rating && (
        <div className="mt-3">
          <StarRating rating={wine.rating} readonly size="sm" />
        </div>
      )}

      {wine.notes && (
        <p className="mt-3 text-sm text-muted-foreground font-sans line-clamp-2 italic">
          "{wine.notes}"
        </p>
      )}

      <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(wine)}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-sans transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          onClick={() => onDelete(wine.id)}
          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 font-sans transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Remove
        </button>
      </div>
    </div>
  );
};

export default WineCard;

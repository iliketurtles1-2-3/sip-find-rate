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
    <div className="group bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 animate-fade-in">
      {/* Wine image */}
      {wine.image_url ? (
        <div className="w-full aspect-[3/2] overflow-hidden">
          <img
            src={wine.image_url}
            alt={wine.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full aspect-[3/2] bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
          <Wine className="w-10 h-10 text-muted-foreground/20" />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5">
          {wine.color && (
            <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider', colorBadgeMap[wine.color] || 'bg-muted text-muted-foreground')}>
              {wine.color}
            </span>
          )}
          {wine.vintage && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <Calendar className="w-3 h-3" />
              {wine.vintage}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-base leading-tight truncate">{wine.name}</h3>

        <div className="flex flex-wrap gap-2.5 mt-2 text-xs text-muted-foreground">
          {wine.region && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {wine.region}
            </span>
          )}
          {wine.grape_variety && (
            <span className="flex items-center gap-1">
              <Grape className="w-3 h-3" /> {wine.grape_variety}
            </span>
          )}
        </div>

        {wine.rating && (
          <div className="mt-2.5">
            <StarRating rating={wine.rating} readonly size="sm" />
          </div>
        )}

        {wine.notes && (
          <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2 italic leading-relaxed">
            "{wine.notes}"
          </p>
        )}

        <div className="flex gap-3 mt-3 pt-3 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(wine)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-3 h-3" /> Edit
          </button>
          <button
            onClick={() => onDelete(wine.id)}
            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default WineCard;

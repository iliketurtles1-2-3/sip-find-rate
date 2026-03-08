import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarRating from './StarRating';
import { Tables } from '@/integrations/supabase/types';

type WineRow = Tables<'wines'>;

const WINE_COLORS = ['red', 'white', 'rosé', 'sparkling', 'dessert', 'orange'] as const;

interface AddWineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (wine: {
    name: string;
    vintage: number | null;
    region: string;
    grape_variety: string;
    color: string;
    rating: number | null;
    notes: string;
  }) => void;
  editWine?: WineRow | null;
}

const AddWineDialog = ({ open, onOpenChange, onSave, editWine }: AddWineDialogProps) => {
  const [name, setName] = useState('');
  const [vintage, setVintage] = useState('');
  const [region, setRegion] = useState('');
  const [grapeVariety, setGrapeVariety] = useState('');
  const [color, setColor] = useState('');
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editWine) {
      setName(editWine.name);
      setVintage(editWine.vintage?.toString() || '');
      setRegion(editWine.region || '');
      setGrapeVariety(editWine.grape_variety || '');
      setColor(editWine.color || '');
      setRating(editWine.rating || 0);
      setNotes(editWine.notes || '');
    } else {
      setName('');
      setVintage('');
      setRegion('');
      setGrapeVariety('');
      setColor('');
      setRating(0);
      setNotes('');
    }
  }, [editWine, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      vintage: vintage ? parseInt(vintage, 10) : null,
      region,
      grape_variety: grapeVariety,
      color,
      rating: rating > 0 ? rating : null,
      notes,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editWine ? 'Edit Wine' : 'Add a Bottle'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div className="space-y-2">
            <Label htmlFor="wine-name">Wine Name *</Label>
            <Input
              id="wine-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Château Margaux"
              required
              className="bg-muted border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vintage">Vintage</Label>
              <Input
                id="vintage"
                type="number"
                value={vintage}
                onChange={(e) => setVintage(e.target.value)}
                placeholder="2019"
                min={1900}
                max={2030}
                className="bg-muted border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {WINE_COLORS.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Bordeaux, France"
                className="bg-muted border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grape">Grape Variety</Label>
              <Input
                id="grape"
                value={grapeVariety}
                onChange={(e) => setGrapeVariety(e.target.value)}
                placeholder="Cabernet Sauvignon"
                className="bg-muted border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <StarRating rating={rating} onChange={setRating} size="lg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Tasting Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dark cherry, tobacco, hints of oak..."
              rows={3}
              className="bg-muted border-border resize-none"
            />
          </div>

          <Button type="submit" className="w-full">
            {editWine ? 'Save Changes' : 'Add to Cellar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWineDialog;

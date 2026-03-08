import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarRating from './StarRating';
import { Tables } from '@/integrations/supabase/types';
import { Camera, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type WineRow = Tables<'wines'>;

const WINE_COLORS = ['red', 'white', 'rosé', 'sparkling', 'dessert', 'orange'] as const;

const WINE_REGIONS = [
  'Bordeaux, France',
  'Burgundy, France',
  'Champagne, France',
  'Rhône Valley, France',
  'Loire Valley, France',
  'Alsace, France',
  'Tuscany, Italy',
  'Piedmont, Italy',
  'Veneto, Italy',
  'Rioja, Spain',
  'Ribera del Duero, Spain',
  'Napa Valley, USA',
  'Sonoma, USA',
  'Willamette Valley, USA',
  'Barossa Valley, Australia',
  'Marlborough, New Zealand',
  'Mendoza, Argentina',
  'Stellenbosch, South Africa',
  'Mosel, Germany',
  'Douro Valley, Portugal',
  'Wachau, Austria',
] as const;

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
    image_url?: string | null;
  }) => void;
  editWine?: WineRow | null;
}

const AddWineDialog = ({ open, onOpenChange, onSave, editWine }: AddWineDialogProps) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [vintage, setVintage] = useState('');
  const [region, setRegion] = useState('');
  const [grapeVariety, setGrapeVariety] = useState('');
  const [color, setColor] = useState('');
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editWine) {
      setName(editWine.name);
      setVintage(editWine.vintage?.toString() || '');
      setRegion(editWine.region || '');
      setGrapeVariety(editWine.grape_variety || '');
      setColor(editWine.color || '');
      setRating(editWine.rating || 0);
      setNotes(editWine.notes || '');
      setImageUrl(editWine.image_url || null);
      setImagePreview(editWine.image_url || null);
    } else {
      setName('');
      setVintage('');
      setRegion('');
      setGrapeVariety('');
      setColor('');
      setRating(0);
      setNotes('');
      setImageUrl(null);
      setImagePreview(null);
    }
  }, [editWine, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from('wine-photos')
      .upload(filePath, file, { upsert: true });

    if (!error) {
      const { data: { publicUrl } } = supabase.storage
        .from('wine-photos')
        .getPublicUrl(filePath);
      setImageUrl(publicUrl);
    }
    setUploading(false);
  };

  const removeImage = () => {
    setImageUrl(null);
    setImagePreview(null);
  };

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
      image_url: imageUrl,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editWine ? 'Edit Wine' : 'Log a Bottle'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo upload */}
          <div className="space-y-2">
            <Label>Photo</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {imagePreview ? (
              <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden border border-border bg-muted">
                <img src={imagePreview} alt="Wine" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {uploading && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[3/2] rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-muted/50 transition-all"
              >
                <Camera className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Tap to add a photo</span>
              </button>
            )}
          </div>

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
              <Label>Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {WINE_REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
            ) : editWine ? 'Save Changes' : 'Add to Cellar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWineDialog;

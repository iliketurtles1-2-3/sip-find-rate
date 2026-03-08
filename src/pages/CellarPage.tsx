import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import WineCard from '@/components/WineCard';
import AddWineDialog from '@/components/AddWineDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Wine, Star, Grape, Filter, SlidersHorizontal } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type WineItem = Tables<'wines'>;

const colorFilters = ['all', 'red', 'white', 'rosé', 'sparkling', 'dessert', 'orange'] as const;

const CellarPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [wines, setWines] = useState<WineItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editWine, setEditWine] = useState<WineItem | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchWines = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setWines(data);
    if (error) console.error(error);
    setLoading(false);
  };

  useEffect(() => {
    fetchWines();
  }, [user]);

  const handleSave = async (wineData: {
    name: string;
    vintage: number | null;
    region: string;
    grape_variety: string;
    color: string;
    rating: number | null;
    notes: string;
    image_url?: string | null;
  }) => {
    if (!user) return;

    if (editWine) {
      const { error } = await supabase
        .from('wines')
        .update({ ...wineData, image_url: wineData.image_url ?? editWine.image_url })
        .eq('id', editWine.id);
      if (!error) {
        toast({ title: 'Updated', description: `${wineData.name} has been updated.` });
        fetchWines();
      }
    } else {
      const { error } = await supabase
        .from('wines')
        .insert({ ...wineData, user_id: user.id, image_url: wineData.image_url ?? null });
      if (!error) {
        toast({ title: 'Added', description: `${wineData.name} added to your cellar.` });
        fetchWines();
      }
    }
    setEditWine(null);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('wines').delete().eq('id', id);
    if (!error) {
      setWines(prev => prev.filter(w => w.id !== id));
      toast({ title: 'Removed', description: 'Wine removed from your cellar.' });
    }
  };

  const handleEdit = (wine: WineItem) => {
    setEditWine(wine);
    setDialogOpen(true);
  };

  const filteredWines = wines
    .filter(w => activeFilter === 'all' || w.color === activeFilter)
    .filter((w) =>
      [w.name, w.region, w.grape_variety, w.color, w.notes]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(search.toLowerCase()))
    );

  const stats = {
    total: wines.length,
    avgRating: wines.filter(w => w.rating).length > 0
      ? (wines.reduce((sum, w) => sum + (w.rating || 0), 0) / wines.filter(w => w.rating).length).toFixed(1)
      : '—',
    varieties: new Set(wines.map(w => w.grape_variety).filter(Boolean)).size,
    regions: new Set(wines.map(w => w.region).filter(Boolean)).size,
  };

  return (
    <div className="min-h-screen relative bg-background">
      {/* Header */}
      <div className="pt-10 pb-4 px-5">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Your Collection</p>
            <h1 className="text-3xl font-bold tracking-tight">Cellar</h1>
          </div>
          <Button
            size="sm"
            onClick={() => { setEditWine(null); setDialogOpen(true); }}
            className="rounded-full gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Wine
          </Button>
        </div>

        {/* Stats strip */}
        {wines.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
            {[
              { icon: Wine, label: 'Bottles', value: stats.total, color: 'text-primary' },
              { icon: Star, label: 'Avg Rating', value: stats.avgRating, color: 'text-accent' },
              { icon: Grape, label: 'Varieties', value: stats.varieties, color: 'text-wine-rosé' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 bg-card/80 backdrop-blur border border-border rounded-2xl px-4 py-3 min-w-[130px]">
                <stat.icon className={`w-5 h-5 ${stat.color} shrink-0`} />
                <div>
                  <p className="text-lg font-bold leading-none">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <main className="px-5 pb-28">
        {/* Search + filter */}
        {wines.length > 0 && (
          <div className="space-y-3 mb-5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search wines, regions, grapes..."
                className="pl-10 bg-card/80 backdrop-blur border-border rounded-xl h-11"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {colorFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all ${
                    activeFilter === f
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wine grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-card/50 border border-border rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : filteredWines.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredWines.map((wine) => (
              <WineCard key={wine.id} wine={wine} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        ) : wines.length === 0 ? (
          <div className="text-center py-16 space-y-5">
            <div className="w-20 h-20 rounded-full bg-card border-2 border-dashed border-border flex items-center justify-center mx-auto">
              <Wine className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Start your collection</h2>
              <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                Log your first bottle and begin tracking your wine journey.
              </p>
            </div>
            <Button
              onClick={() => { setEditWine(null); setDialogOpen(true); }}
              className="rounded-full gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Your First Wine
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No wines match "<span className="text-foreground">{search}</span>"</p>
          </div>
        )}
      </main>

      <BottomNav />

      <AddWineDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editWine={editWine}
      />
    </div>
  );
};

export default CellarPage;

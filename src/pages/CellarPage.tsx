import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';
import WineCard from '@/components/WineCard';
import AddWineDialog from '@/components/AddWineDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Wine, LogOut } from 'lucide-react';

type WineRow = Tables<'wines'>;

const CellarPage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [wines, setWines] = useState<WineRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editWine, setEditWine] = useState<WineRow | null>(null);
  const [search, setSearch] = useState('');

  const fetchWines = async () => {
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setWines(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWines();
  }, []);

  const handleSave = async (wineData: {
    name: string;
    vintage: number | null;
    region: string;
    grape_variety: string;
    color: string;
    rating: number | null;
    notes: string;
  }) => {
    if (editWine) {
      const { error } = await supabase
        .from('wines')
        .update(wineData)
        .eq('id', editWine.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Updated', description: `${wineData.name} has been updated.` });
      }
    } else {
      const { error } = await supabase
        .from('wines')
        .insert({ ...wineData, user_id: user!.id });

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Added', description: `${wineData.name} added to your cellar.` });
      }
    }

    setEditWine(null);
    fetchWines();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('wines').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Removed', description: 'Wine removed from your cellar.' });
      fetchWines();
    }
  };

  const handleEdit = (wine: WineRow) => {
    setEditWine(wine);
    setDialogOpen(true);
  };

  const filteredWines = wines.filter((w) =>
    [w.name, w.region, w.grape_variety, w.color, w.notes]
      .filter(Boolean)
      .some((field) => field!.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: wines.length,
    avgRating: wines.filter(w => w.rating).length > 0
      ? (wines.reduce((sum, w) => sum + (w.rating || 0), 0) / wines.filter(w => w.rating).length).toFixed(1)
      : '—',
    topColor: wines.length > 0
      ? Object.entries(
          wines.reduce((acc, w) => {
            if (w.color) acc[w.color] = (acc[w.color] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
      : '—',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <div className="container max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <Wine className="w-6 h-6 text-wine-gold" />
            <h1 className="text-xl font-display font-bold">Cellar</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => { setEditWine(null); setDialogOpen(true); }}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Wine
            </Button>
            <button
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        {wines.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Bottles', value: stats.total },
              { label: 'Avg Rating', value: stats.avgRating },
              { label: 'Favorite', value: stats.topColor },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-display font-bold capitalize">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-sans mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        {wines.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your cellar..."
              className="pl-10 bg-card border-border"
            />
          </div>
        )}

        {/* Wine Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredWines.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredWines.map((wine) => (
              <WineCard key={wine.id} wine={wine} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        ) : wines.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Wine className="w-16 h-16 text-muted-foreground/20 mx-auto" />
            <h2 className="text-2xl font-display font-semibold">Your cellar is empty</h2>
            <p className="text-muted-foreground font-sans">Add your first bottle to start tracking.</p>
            <Button onClick={() => { setEditWine(null); setDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-1" /> Add Your First Wine
            </Button>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12 font-sans">No wines match "{search}"</p>
        )}
      </main>

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

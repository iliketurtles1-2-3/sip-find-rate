import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import WineCard from '@/components/WineCard';
import AddWineDialog from '@/components/AddWineDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

type WineItem = {
  id: string;
  name: string;
  vintage: number | null;
  region: string | null;
  grape_variety: string | null;
  color: string | null;
  rating: number | null;
  notes: string | null;
  image_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

const CellarPage = () => {
  const { toast } = useToast();
  const [wines, setWines] = useState<WineItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editWine, setEditWine] = useState<WineItem | null>(null);
  const [search, setSearch] = useState('');

  const handleSave = (wineData: {
    name: string;
    vintage: number | null;
    region: string;
    grape_variety: string;
    color: string;
    rating: number | null;
    notes: string;
  }) => {
    if (editWine) {
      setWines(prev => prev.map(w => w.id === editWine.id ? { ...w, ...wineData, updated_at: new Date().toISOString() } : w));
      toast({ title: 'Updated', description: `${wineData.name} has been updated.` });
    } else {
      const newWine: WineItem = {
        id: crypto.randomUUID(),
        ...wineData,
        image_url: null,
        user_id: 'local',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setWines(prev => [newWine, ...prev]);
      toast({ title: 'Added', description: `${wineData.name} added to your cellar.` });
    }
    setEditWine(null);
  };

  const handleDelete = (id: string) => {
    setWines(prev => prev.filter(w => w.id !== id));
    toast({ title: 'Removed', description: 'Wine removed from your cellar.' });
  };

  const handleEdit = (wine: WineItem) => {
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
    <div className="min-h-screen relative bg-background">

      <main className="container max-w-5xl mx-auto px-4 py-8 pb-24">
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

        {filteredWines.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredWines.map((wine) => (
              <WineCard key={wine.id} wine={wine} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        ) : wines.length === 0 ? (
          <div className="text-center py-20 space-y-4">
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

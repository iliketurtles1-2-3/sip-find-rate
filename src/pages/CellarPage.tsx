import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Search, Wine, Package, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';

type InventoryItem = {
  id: string;
  user_id: string;
  wine_id: string;
  quantity: number;
  location: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  drink_by: string | null;
  created_at: string;
  updated_at: string;
  wine: {
    id: string;
    name: string;
    vintage: number | null;
    region: string | null;
    grape_variety: string | null;
    color: string | null;
    image_url: string | null;
  };
};

const colorDot: Record<string, string> = {
  red: 'bg-wine-red',
  white: 'bg-wine-white-grape',
  rosé: 'bg-wine-rosé',
  sparkling: 'bg-wine-sparkling',
  dessert: 'bg-amber-600',
  orange: 'bg-orange-500',
};

const colorOptions = ['red', 'white', 'rosé', 'sparkling', 'dessert', 'orange'];

const CellarPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [wines, setWines] = useState<{ id: string; name: string; vintage: number | null; color: string | null }[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addMode, setAddMode] = useState<'existing' | 'new'>('existing');
  const [selectedWineId, setSelectedWineId] = useState('');
  const [addQuantity, setAddQuantity] = useState(1);
  const [addLocation, setAddLocation] = useState('');
  // New wine fields
  const [newName, setNewName] = useState('');
  const [newVintage, setNewVintage] = useState('');
  const [newRegion, setNewRegion] = useState('');
  const [newColor, setNewColor] = useState('red');
  const [newGrape, setNewGrape] = useState('');

  const fetchInventory = async () => {
    if (!user) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('cellar_inventory')
      .select('*, wine:wines(id, name, vintage, region, grape_variety, color, image_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setInventory(data as unknown as InventoryItem[]);
    if (error) console.error(error);
    setLoading(false);
  };

  const fetchWines = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('wines')
      .select('id, name, vintage, color')
      .eq('user_id', user.id)
      .order('name');
    if (data) setWines(data);
  };

  useEffect(() => {
    fetchInventory();
    fetchWines();
  }, [user]);

  const updateQuantity = async (item: InventoryItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      await supabase.from('cellar_inventory').delete().eq('id', item.id);
      setInventory(prev => prev.filter(i => i.id !== item.id));
      toast({ title: 'Removed', description: `${item.wine.name} removed from cellar.` });
    } else {
      await supabase.from('cellar_inventory').update({ quantity: newQty }).eq('id', item.id);
      setInventory(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQty } : i));
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setAddMode('existing');
    setSelectedWineId('');
    setAddQuantity(1);
    setAddLocation('');
    setNewName('');
    setNewVintage('');
    setNewRegion('');
    setNewColor('red');
    setNewGrape('');
  };

  const handleAdd = async () => {
    if (!user) return;

    let wineId = selectedWineId;

    if (addMode === 'new') {
      if (!newName.trim()) return;
      // Create the wine first (untasted — no rating, no notes)
      const { data: newWine, error: wineErr } = await supabase
        .from('wines')
        .insert({
          user_id: user.id,
          name: newName.trim(),
          vintage: newVintage ? parseInt(newVintage) : null,
          region: newRegion || null,
          color: newColor,
          grape_variety: newGrape || null,
          rating: null,
          notes: null,
        })
        .select('id')
        .single();
      if (wineErr || !newWine) {
        toast({ title: 'Error', description: wineErr?.message || 'Failed to create wine.', variant: 'destructive' });
        return;
      }
      wineId = newWine.id;
      fetchWines();
    }

    if (!wineId) return;

    const existing = inventory.find(i => i.wine_id === wineId);
    if (existing) {
      await updateQuantity(existing, addQuantity);
    } else {
      const { error } = await supabase.from('cellar_inventory').insert({
        user_id: user.id,
        wine_id: wineId,
        quantity: addQuantity,
        location: addLocation || null,
      });
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    }
    toast({ title: 'Added', description: 'Wine added to your cellar.' });
    resetForm();
    fetchInventory();
  };

  const totalBottles = inventory.reduce((sum, i) => sum + i.quantity, 0);

  const filtered = inventory.filter(i =>
    [i.wine.name, i.wine.region, i.wine.grape_variety, i.location]
      .filter(Boolean)
      .some(f => f!.toLowerCase().includes(search.toLowerCase()))
  );

  const canSubmit = addMode === 'existing' ? !!selectedWineId : !!newName.trim();

  return (
    <div className="min-h-screen relative bg-background">
      <div className="fixed inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />

      {/* Header */}
      <div className="pt-10 pb-4 px-5">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Inventory</p>
            <h1 className="text-3xl font-bold tracking-tight">Cellar</h1>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-full gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Stock
          </Button>
        </div>

        {/* Stats */}
        {inventory.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur border border-border rounded-2xl px-4 py-3 min-w-[130px]">
              <Package className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-lg font-bold leading-none">{totalBottles}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Bottles</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur border border-border rounded-2xl px-4 py-3 min-w-[130px]">
              <Wine className="w-5 h-5 text-accent shrink-0" />
              <div>
                <p className="text-lg font-bold leading-none">{inventory.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Wines</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <main className="px-5 pb-28">
        {/* Add form */}
        {showAddForm && (
          <Card className="p-4 mb-5 space-y-3 bg-card/80 backdrop-blur border-border animate-fade-in">
            <p className="text-sm font-semibold">Add wine to cellar</p>

            {/* Mode toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setAddMode('existing')}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  addMode === 'existing'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground border border-border'
                }`}
              >
                From Diary
              </button>
              <button
                onClick={() => setAddMode('new')}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  addMode === 'new'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground border border-border'
                }`}
              >
                New Wine
              </button>
            </div>

            {addMode === 'existing' ? (
              <select
                value={selectedWineId}
                onChange={e => setSelectedWineId(e.target.value)}
                className="w-full h-11 rounded-xl bg-background border border-border px-3 text-sm"
              >
                <option value="">Select a wine from your diary...</option>
                {wines.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} {w.vintage ? `(${w.vintage})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-2">
                <Input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Wine name *"
                  className="bg-background border-border rounded-xl h-11"
                />
                <div className="flex gap-2">
                  <Input
                    value={newVintage}
                    onChange={e => setNewVintage(e.target.value)}
                    placeholder="Vintage"
                    type="number"
                    className="w-24 bg-background border-border rounded-xl h-11"
                  />
                  <Input
                    value={newRegion}
                    onChange={e => setNewRegion(e.target.value)}
                    placeholder="Region"
                    className="flex-1 bg-background border-border rounded-xl h-11"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newGrape}
                    onChange={e => setNewGrape(e.target.value)}
                    placeholder="Grape variety"
                    className="flex-1 bg-background border-border rounded-xl h-11"
                  />
                  <select
                    value={newColor}
                    onChange={e => setNewColor(e.target.value)}
                    className="h-11 rounded-xl bg-background border border-border px-3 text-sm capitalize"
                  >
                    {colorOptions.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Input
                type="number"
                min={1}
                value={addQuantity}
                onChange={e => setAddQuantity(parseInt(e.target.value) || 1)}
                placeholder="Qty"
                className="w-20 bg-background border-border rounded-xl h-11"
              />
              <Input
                value={addLocation}
                onChange={e => setAddLocation(e.target.value)}
                placeholder="Location (e.g. Rack A, Shelf 2)"
                className="flex-1 bg-background border-border rounded-xl h-11"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!canSubmit} className="rounded-full flex-1">
                Add to Cellar
              </Button>
              <Button variant="outline" onClick={resetForm} className="rounded-full">
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Search */}
        {inventory.length > 0 && (
          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search wines, locations..."
              className="pl-10 bg-card/80 backdrop-blur border-border rounded-xl h-11"
            />
          </div>
        )}

        {/* Inventory list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card/50 border border-border rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map(item => (
              <Card key={item.id} className="p-4 bg-card/80 backdrop-blur border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.wine.image_url ? (
                      <img src={item.wine.image_url} alt={item.wine.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full ${colorDot[item.wine.color || ''] || 'bg-muted-foreground/30'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight truncate">{item.wine.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[item.wine.vintage, item.wine.region].filter(Boolean).join(' · ')}
                    </p>
                    {item.location && (
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {item.location}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item, -1)}
                      className="w-8 h-8 rounded-full bg-muted/80 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item, 1)}
                      className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors text-primary"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-16 space-y-5">
            <div className="w-20 h-20 rounded-full bg-card border-2 border-dashed border-border flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Your cellar is empty</h2>
              <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                Start tracking your wine inventory — add from your diary or log a new bottle.
              </p>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="rounded-full gap-1.5">
              <Plus className="w-4 h-4" /> Add Your First Bottle
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No wines match "<span className="text-foreground">{search}</span>"</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default CellarPage;

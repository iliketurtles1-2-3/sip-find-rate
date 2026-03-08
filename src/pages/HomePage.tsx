import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Wine, Star, MapPin, Sparkles, Settings } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import RegionIcon from '@/components/RegionIcon';
import vineyardBg from '@/assets/vineyard-bg.png';
import { supabase } from '@/integrations/supabase/client';

const dailyPicks = [
  { name: 'Châteauneuf-du-Pape', note: 'Rich, full-bodied red with dark fruit and spice. Perfect for a cozy evening.' },
  { name: 'Sancerre Blanc', note: 'Crisp Loire Valley white with mineral notes and citrus. Ideal with seafood.' },
  { name: 'Barolo Riserva', note: 'The king of Italian wines — powerful tannins with rose and tar aromas.' },
  { name: 'Marlborough Sauvignon Blanc', note: 'Vibrant New Zealand white bursting with passionfruit and fresh herbs.' },
  { name: 'Amarone della Valpolicella', note: 'Intense dried-grape red with chocolate and cherry. A showstopper.' },
  { name: 'Grüner Veltliner', note: 'Austrian peppery white — refreshing, dry, and endlessly versatile.' },
  { name: 'Côtes du Rhône', note: 'Approachable southern French blend. Ripe fruit, gentle spice, great value.' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, avgRating: '—', topRegion: '—' });
  const pick = dailyPicks[new Date().getDay()];

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: wines } = await supabase.from('wines').select('rating, region').eq('user_id', user.id);
      if (!wines) return;
      const rated = wines.filter(w => w.rating);
      const regions = wines.reduce((acc, w) => {
        if (w.region) acc[w.region] = (acc[w.region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const topRegion = Object.entries(regions).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
      setStats({
        total: wines.length,
        avgRating: rated.length ? (rated.reduce((s, w) => s + (w.rating || 0), 0) / rated.length).toFixed(1) : '—',
        topRegion,
      });
    };
    load();
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${vineyardBg})` }} />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-background -z-10" />
      <div className="fixed inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/95 to-transparent -z-10" />

      <button
        onClick={() => navigate('/settings')}
        className="fixed top-5 right-5 z-50 p-2 rounded-full text-muted-foreground/50 hover:text-muted-foreground transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>

      <div className="pt-40 px-5">
        {/* Dashboard block — ~25vh */}
        <div className="h-[25vh] flex gap-3">
          {/* Left — recommendation (wider) */}
          <div className="w-2/5 rounded-2xl bg-card/80 backdrop-blur-md border border-border p-3 flex flex-col">
            <div className="flex items-center gap-1.5 text-accent mb-2">
              <Sparkles className="w-3 h-3" />
              <span className="text-[9px] font-medium uppercase tracking-wider">Pick of the day</span>
            </div>
            <div className="w-full aspect-[4/3] rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center mb-2 overflow-hidden">
              <Wine className="w-6 h-6 text-muted-foreground/30" />
            </div>
            <p className="text-xs font-semibold text-foreground leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>{pick.name}</p>
            <p className="text-[10px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">{pick.note}</p>
          </div>

          {/* Right — stats grid */}
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3">
            <div className="rounded-2xl bg-card/80 backdrop-blur-md border border-border p-4 flex flex-col justify-center items-center">
              <Wine className="w-4 h-4 text-primary mb-1" />
              <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>{stats.total}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Bottles</p>
            </div>
            <div className="rounded-2xl bg-card/80 backdrop-blur-md border border-border p-4 flex flex-col justify-center items-center">
              <Star className="w-4 h-4 text-accent mb-1" />
              <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>{stats.avgRating}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Rating</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-card/80 backdrop-blur-md border border-border p-4 flex items-center gap-3">
              {stats.topRegion !== '—' ? (
                <RegionIcon region={stats.topRegion} className="w-10 h-10 shrink-0" />
              ) : (
                <MapPin className="w-4 h-4 text-primary shrink-0" />
              )}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Top Region</p>
                <p className="text-sm font-semibold text-foreground capitalize" style={{ fontFamily: "'Outfit', sans-serif" }}>{stats.topRegion}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="pb-32 px-6 text-center">
        <Button
          size="lg"
          onClick={() => navigate('/diary')}
          className="rounded-full px-8">
          <Plus className="w-4 h-4 mr-2" /> Log New Wine
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;
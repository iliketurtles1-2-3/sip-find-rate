import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import vineyardBg from '@/assets/vineyard-bg.png';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex flex-col">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${vineyardBg})` }} />
      
      <div className="fixed inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent -z-10" />

      <div className="flex-1 flex flex-col items-center justify-end pb-32 px-6 text-center">
        <h1 className="text-5xl sm:text-6xl font-display font-bold tracking-tight leading-tight mb-4">
          Your Wine
          <br />
          <span className="text-primary">Journey</span>
        </h1>
        

        
        <Button
          size="lg"
          onClick={() => navigate('/cellar')}
          className="rounded-full px-8">
          
          Open Cellar <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <BottomNav />
    </div>);

};

export default HomePage;
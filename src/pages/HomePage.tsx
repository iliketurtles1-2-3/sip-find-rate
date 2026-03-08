import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import vineyardBg from '@/assets/vineyard-bg.png';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex flex-col">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${vineyardBg})` }} />
      
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-background -z-10" />
      <div className="fixed inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/95 to-transparent -z-10" />

      <div className="pt-20 px-6 text-center">
        



        
      </div>

      <div className="flex-1" />

      <div className="pb-32 px-6 text-center">
        <Button
          size="lg"
          onClick={() => navigate('/cellar')}
          className="rounded-full px-8">
          <Plus className="w-4 h-4 mr-2" /> Log New Wine
        </Button>
      </div>

      <BottomNav />
    </div>);

};

export default HomePage;
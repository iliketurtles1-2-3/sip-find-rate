import bordeaux from '@/assets/regions/bordeaux.png';
import burgundy from '@/assets/regions/burgundy.png';
import tuscany from '@/assets/regions/tuscany.png';
import napa from '@/assets/regions/napa.png';
import rioja from '@/assets/regions/rioja.png';
import champagne from '@/assets/regions/champagne.png';
import rhone from '@/assets/regions/rhone.png';
import mosel from '@/assets/regions/mosel.png';
import { MapPin } from 'lucide-react';

const regionMap: Record<string, string> = {
  bordeaux,
  burgundy,
  bourgogne: burgundy,
  tuscany,
  toscana: tuscany,
  'napa valley': napa,
  napa,
  california: napa,
  rioja,
  champagne,
  rhône: rhone,
  rhone,
  'côtes du rhône': rhone,
  mosel,
  moselle: mosel,
};

function matchRegion(region: string): string | null {
  const lower = region.toLowerCase().trim();
  for (const [key, img] of Object.entries(regionMap)) {
    if (lower.includes(key) || key.includes(lower)) {
      return img;
    }
  }
  return null;
}

interface RegionIconProps {
  region: string;
  className?: string;
}

const RegionIcon = ({ region, className = 'w-10 h-10' }: RegionIconProps) => {
  const img = matchRegion(region);
  if (!img) {
    return <MapPin className={`${className} text-primary`} />;
  }
  return <img src={img} alt={region} className={`${className} object-contain rounded-lg`} />;
};

export default RegionIcon;

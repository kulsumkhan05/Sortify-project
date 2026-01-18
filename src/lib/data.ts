import { type LucideIcon, Newspaper, Package, Factory, GlassWater, Leaf, Smartphone, Biohazard } from 'lucide-react';

export type WasteCategory = {
  name: string;
  id: 'paper' | 'plastic' | 'metal' | 'glass' | 'biodegradable' | 'e-waste' | 'hazardous';
  Icon: LucideIcon;
};

export const wasteCategories: Record<string, WasteCategory> = {
  paper: { id: 'paper', name: 'Paper', Icon: Newspaper },
  plastic: { id: 'plastic', name: 'Plastic', Icon: Package },
  metal: { id: 'metal', name: 'Metal', Icon: Factory },
  glass: { id: 'glass', name: 'Glass', Icon: GlassWater },
  biodegradable: { id: 'biodegradable', name: 'Biodegradable / Organic', Icon: Leaf },
  'e-waste': { id: 'e-waste', name: 'E-waste', Icon: Smartphone },
  hazardous: { id: 'hazardous', name: 'Hazardous', Icon: Biohazard },
};

export const wasteCategoryList = Object.values(wasteCategories);

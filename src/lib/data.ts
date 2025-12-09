import { type LucideIcon, Newspaper, Package, Factory, GlassWater, Leaf, Biohazard, Shirt } from 'lucide-react';

export type WasteCategory = {
  name: string;
  id: 'paper' | 'plastic' | 'metal' | 'glass' | 'biodegradable' | 'hazardous' | 'textile';
  Icon: LucideIcon;
};

export const wasteCategories: Record<string, WasteCategory> = {
  paper: { id: 'paper', name: 'Paper', Icon: Newspaper },
  plastic: { id: 'plastic', name: 'Plastic', Icon: Package },
  metal: { id: 'metal', name: 'Metal', Icon: Factory },
  glass: { id: 'glass', name: 'Glass', Icon: GlassWater },
  biodegradable: { id: 'biodegradable', name: 'Biodegradable', Icon: Leaf },
  hazardous: { id: 'hazardous', name: 'Hazardous', Icon: Biohazard },
  textile: { id: 'textile', name: 'Textile', Icon: Shirt },
};

export const wasteCategoryList = Object.values(wasteCategories);

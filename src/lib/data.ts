import { type LucideIcon, Newspaper, Package, Factory, GlassWater, Leaf } from 'lucide-react';

export type WasteCategory = {
  name: string;
  id: 'paper' | 'plastic' | 'metal' | 'glass' | 'biodegradable';
  Icon: LucideIcon;
};

export const wasteCategories: Record<string, WasteCategory> = {
  paper: { id: 'paper', name: 'Paper', Icon: Newspaper },
  plastic: { id: 'plastic', name: 'Plastic', Icon: Package },
  metal: { id: 'metal', name: 'Metal', Icon: Factory },
  glass: { id: 'glass', name: 'Glass', Icon: GlassWater },
  biodegradable: { id: 'biodegradable', name: 'Biodegradable / Organic', Icon: Leaf },
};

export const wasteCategoryList = Object.values(wasteCategories);

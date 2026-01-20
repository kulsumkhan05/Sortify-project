import { type LucideIcon, Newspaper, Package, Factory, GlassWater, Box, Trash2 } from 'lucide-react';

export type WasteCategory = {
  name: string;
  id: 'paper' | 'plastic' | 'metal' | 'glass' | 'cardboard' | 'trash';
  Icon: LucideIcon;
};

export const wasteCategories: Record<string, WasteCategory> = {
  paper: { id: 'paper', name: 'Paper', Icon: Newspaper },
  plastic: { id: 'plastic', name: 'Plastic', Icon: Package },
  metal: { id: 'metal', name: 'Metal', Icon: Factory },
  glass: { id: 'glass', name: 'Glass', Icon: GlassWater },
  cardboard: { id: 'cardboard', name: 'Cardboard', Icon: Box },
  trash: { id: 'trash', name: 'Trash', Icon: Trash2 },
};

export const wasteCategoryList = Object.values(wasteCategories);

"use client";

import { Package, ShoppingBag } from "lucide-react";

interface DonationItem {
  name: string;
  quantity: number;
}

interface DonationItemsDisplayProps {
  items: DonationItem[];
  type: 'VIVRES' | 'NON_VIVRES';
  compact?: boolean;
}

export default function DonationItemsDisplay({ 
  items, 
  type, 
  compact = false 
}: DonationItemsDisplayProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const getIcon = () => {
    return type === 'VIVRES' ? '🍎' : '📚';
  };

  const getTotalQuantity = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-xl">{getIcon()}</span>
        <span className="text-slate-600">
          {items.length} article{items.length > 1 ? 's' : ''} 
          <span className="text-slate-400 ml-1">
            ({getTotalQuantity()} unités)
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Package className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-slate-800">
          Articles donnés ({items.length})
        </h4>
      </div>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">{getIcon()}</span>
              </div>
              <div>
                <p className="font-medium text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">
                  Quantité: {item.quantity}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                {item.quantity}
              </div>
              <div className="text-xs text-slate-500">unités</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">
          Total
        </span>
        <span className="text-lg font-bold text-blue-600">
          {getTotalQuantity()} unités
        </span>
      </div>
    </div>
  );
}

// Composant pour l'aperçu dans les listes
export function DonationItemsSummary({ 
  items, 
  type 
}: { 
  items: DonationItem[], 
  type: 'VIVRES' | 'NON_VIVRES' 
}) {
  if (!items || items.length === 0) {
    return null;
  }

  const getIcon = () => type === 'VIVRES' ? '🍎' : '📚';
  const getTotalQuantity = () => items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
      <span className="text-lg">{getIcon()}</span>
      <span className="text-sm font-medium text-blue-800">
        {items.length} article{items.length > 1 ? 's' : ''}
      </span>
      <span className="text-xs text-blue-600">
        ({getTotalQuantity()} unités)
      </span>
    </div>
  );
}

// Composant pour les tooltips avec détails
export function DonationItemsTooltip({ 
  items 
}: { 
  items: DonationItem[] 
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 border border-slate-200 max-w-xs">
      <p className="text-xs font-semibold text-slate-600 mb-2">
        Détail des articles :
      </p>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-xs text-slate-700 flex items-center justify-between">
            <span>{item.name}</span>
            <span className="font-medium text-blue-600 ml-2">
              ×{item.quantity}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
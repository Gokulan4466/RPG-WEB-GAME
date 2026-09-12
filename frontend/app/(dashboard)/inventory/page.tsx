'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Package, Shield, CheckCircle2, Wand2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { apiRequest } from '../../../lib/api';
import { InventoryItem } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function InventoryPage() {
  const { refreshCharacter } = useAuth();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    const res = await apiRequest<InventoryItem[]>('/inventory');
    if (res.success && res.data) {
      setInventory(res.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleEquip = async (invItem: InventoryItem) => {
    setActionLoadingId(invItem.id);
    const endpoint = invItem.isEquipped
      ? `/inventory/${invItem.id}/unequip`
      : `/inventory/${invItem.id}/equip`;

    const res = await apiRequest(endpoint, { method: 'POST' });
    setActionLoadingId(null);

    if (res.success) {
      await fetchInventory();
      await refreshCharacter();
    } else {
      alert(res.error?.message || 'Failed to update item equipment status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 font-rpg">
          HERO INVENTORY
        </h1>
        <p className="text-xs text-slate-400">
          Manage your acquired cosmetic frames, titles, badges, and active glowing themes.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-900/60 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : inventory.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <Package className="w-16 h-16 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-slate-300 font-rpg">Your inventory backpack is empty.</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Visit the Hero Bazaar shop to acquire awesome titles, avatar frames, and glowing themes!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.map((inv) => {
            const item = inv.item;
            const isEquipped = inv.isEquipped;
            const isLoadingThis = actionLoadingId === inv.id;

            return (
              <Card
                key={inv.id}
                className={`flex flex-col justify-between space-y-4 transition duration-300 ${
                  isEquipped
                    ? 'border-amber-400/60 shadow-gold-glow bg-slate-900/90'
                    : 'hover:border-white/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 border border-white/10 text-amber-400 font-rpg">
                      {item.category}
                    </span>
                    {isEquipped && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-wider font-rpg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>EQUIPPED</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-amber-500/30 shrink-0 flex items-center justify-center text-amber-400">
                      {item.category === 'TITLE' ? (
                        <Wand2 className="w-6 h-6" />
                      ) : item.category === 'FRAME' ? (
                        <Shield className="w-6 h-6" />
                      ) : (
                        <Sparkles className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-100 font-rpg leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">Acquired {new Date(inv.acquiredAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <Button
                    variant={isEquipped ? 'outline' : 'gold'}
                    size="sm"
                    onClick={() => handleEquip(inv)}
                    disabled={isLoadingThis}
                    className="w-full font-rpg"
                  >
                    {isLoadingThis
                      ? 'PROCESSING...'
                      : isEquipped
                      ? 'UNEQUIP ITEM'
                      : 'EQUIP TO CHARACTER'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Coins, CheckCircle2, AlertCircle, Sparkles, Shield, Wand2, Flame } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { apiRequest } from '../../../lib/api';
import { Item, Character } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function ShopPage() {
  const { character, updateCharacterState } = useAuth();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchShopItems = useCallback(async () => {
    setLoading(true);
    const res = await apiRequest<Item[]>('/shop');
    if (res.success && res.data) {
      setItems(res.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchShopItems();
  }, [fetchShopItems]);

  const handlePurchase = async (item: Item) => {
    if (!character) return;
    setMessage(null);

    if (character.gold < item.priceGold) {
      setMessage({
        type: 'error',
        text: `Insufficient Gold! Required: ${item.priceGold} Gold. You have: ${character.gold} Gold. Complete quests to earn Gold!`,
      });
      return;
    }

    setPurchasingId(item.id);

    const res = await apiRequest<{ character: Character; inventoryItem: any }>(`/shop/${item.id}/purchase`, {
      method: 'POST',
    });

    setPurchasingId(null);

    if (res.success && res.data) {
      updateCharacterState(res.data.character);
      setMessage({
        type: 'success',
        text: `Successfully purchased "${item.name}"! Available in your Inventory.`,
      });
      fetchShopItems();
    } else {
      setMessage({
        type: 'error',
        text: res.error?.message || 'Item purchase failed.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel-gold border border-amber-500/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-rpg font-bold text-xs">
            <ShoppingBag className="w-4 h-4" />
            <span>ARMORY & MERCHANT SHOP</span>
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 font-rpg">
            HERO BAZAAR
          </h1>
          <p className="text-xs text-slate-300">
            Spend your hard-earned quest Gold on prestigious titles, avatar frames, glowing themes, and badges!
          </p>
        </div>

        {character && (
          <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-950/90 border border-amber-400/50 shadow-gold-glow shrink-0">
            <Coins className="w-6 h-6 text-amber-400 animate-pulse" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Gold Wallet</div>
              <div className="text-xl font-black text-amber-400 font-rpg">{character.gold} G</div>
            </div>
          </div>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Item Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-900/60 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const isPurchasing = purchasingId === item.id;
            const isOwned = item.isOwned;

            return (
              <Card
                key={item.id}
                className="flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition duration-300 relative overflow-hidden"
              >
                {/* Rarity Pill */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 border border-white/10 text-amber-400 font-rpg">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {item.rarity}
                  </span>
                </div>

                {/* Item Details */}
                <div className="space-y-2 text-center my-2">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 shadow-gold-glow">
                    {item.category === 'TITLE' ? (
                      <Wand2 className="w-7 h-7" />
                    ) : item.category === 'FRAME' ? (
                      <Shield className="w-7 h-7" />
                    ) : (
                      <Sparkles className="w-7 h-7" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-100 font-rpg leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                </div>

                {/* Price & Purchase CTA */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-center gap-1 text-sm font-bold text-amber-400 font-rpg">
                    <Coins className="w-4 h-4" />
                    <span>{item.priceGold} Gold</span>
                  </div>

                  {isOwned ? (
                    <div className="w-full py-2 text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/30 font-rpg flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>OWNED IN INVENTORY</span>
                    </div>
                  ) : (
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => handlePurchase(item)}
                      disabled={isPurchasing}
                      className="w-full font-rpg"
                    >
                      {isPurchasing ? 'PURCHASING...' : 'BUY ITEM'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

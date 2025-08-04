import { useState, useEffect, useCallback } from 'react';

export interface PaymentDetail {
  name: string;
  card_name: string;
  card_number: string;
  expiry: string;
  cvv: string;
  creation: string;
  status?: 'active' | 'inactive';
}

export function useUserCards(userId: string | null) {
  const [cards, setCards] = useState<PaymentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    if (!userId) {
      setCards([]);
      setLoading(false);
      setError('No user ID');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(' https://newhrms.muftaah.com/api/method/alphax_erp.api.payment.get_user_payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      const cardsArr = data.message?.data || [];
      const cardsWithStatus = cardsArr.map((card: PaymentDetail) => ({
        ...card,
        status: (card.status || 'active').toLowerCase(),
      }));
      setCards(cardsWithStatus);
    } catch (err) {
      setError('Failed to fetch payment details');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return { cards, loading, error, refresh: fetchCards };
} 
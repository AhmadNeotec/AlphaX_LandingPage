import React, { useState, useEffect } from 'react';
import { withApiAuthHeaders } from '@api/authHeaders';
import { FiEdit2, FiSave, FiX, FiTrash2, FiToggleLeft, FiToggleRight, FiPlus } from 'react-icons/fi';
import { enqueueSnackbar } from 'notistack';

const tabOptions = [
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
  { key: 'longterm', label: 'Long-term' },
];
type TabKey = 'monthly' | 'yearly' | 'longterm';
const columnsConfig: Record<TabKey, { label: string; key: string }[]> = {
  monthly: [
    { label: 'Module', key: 'module_name' },
    { label: '1 Month', key: 'm1' },
    { label: '3 Months', key: 'm3' },
  ],
  yearly: [
    { label: 'Module', key: 'module_name' },
    { label: 'Module Price per year (SAR)', key: 'year_price' },
    { label: '1 Year', key: 'y1' },
    { label: '2 Years', key: 'y2' },
    { label: '3 Years', key: 'y3' },
    { label: '5 Years', key: 'y5' },
  ],
  longterm: [
    { label: 'Module', key: 'module_name' },
    { label: '2 Years', key: 'y2' },
    { label: '3 Years', key: 'y3' },
    { label: '5 Years', key: 'y5' },
  ],
};

const ModulePricingManagement: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('monthly');
  const [pricingRows, setPricingRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingRowIdx, setEditingRowIdx] = useState<number | null>(null);
  const [rowDraft, setRowDraft] = useState<any>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<any>({});
  const [addLoading, setAddLoading] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem('tk');

  useEffect(() => {
    const fetchPricing = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.ModulePricing.get_module_pricing', {
          method: 'GET',
          headers: withApiAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch pricing data');
        const data = await res.json();
        // Normalize disabled to boolean
        const rows = (data.message || []).map((row: any) => {
          console.log('Fetched row.disabled raw value:', row.module_name, row.disabled);
          return {
            ...row,
            disabled: row.disabled === 1 || row.disabled === "1" || row.disabled === true || row.disabled === "true"
          };
        });
        setPricingRows(rows);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, [token]);

  const startEdit = (idx: number) => {
    setEditingRowIdx(idx);
    setRowDraft({ ...pricingRows[idx] });
  };

  const cancelEdit = () => {
    setEditingRowIdx(null);
    setRowDraft({});
  };

  const handleRowInputChange = (key: string, value: string) => {
    setRowDraft((prev: any) => ({ ...prev, [key]: value }));
  };

  const saveRow = async (idx: number) => {
    setSaving(true);
    setError(null);
    try {
      const { module_name, ...data } = rowDraft;
      // Always send disabled: false by default
      const payload = { module_name, data: { ...data, disabled: false } };
      console.log('Saving row, payload:', payload);
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.ModulePricing.update_module_pricing', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify(payload),
      });
      console.log('API response status:', res.status);
      const result = await res.json();
      console.log('API response body:', result);
      if (!res.ok) throw new Error('Failed to update pricing for ' + module_name);
      if (result.message && result.message.success) {
        enqueueSnackbar(`Pricing updated for ${result.message.updated}`, { variant: 'success' });
      }
      setPricingRows((prev) => prev.map((row, i) => (i === idx ? { ...rowDraft, disabled: false } : row)));
      setEditingRowIdx(null);
      setRowDraft({});
    } catch (err: any) {
      console.error('Error in saveRow:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  // Enable/disable module pricing row
  const setModuleDisabled = async (idx: number, disabled: boolean) => {
    setSaving(true);
    setError(null);
    try {
      const row = pricingRows[idx];
      const payload = { module_name: row.module_name, disabled: disabled ? 1 : 0 };
      console.log('set_module_pricing_disabled payload:', payload);
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.ModulePricing.set_module_pricing_disabled', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify(payload),
      });
      console.log('set_module_pricing_disabled response status:', res.status);
      const result = await res.json();
      console.log('set_module_pricing_disabled response body:', result);
      if (!res.ok || !result.message || !result.message.success) throw new Error('Failed to update enable/disable for ' + row.module_name);
      enqueueSnackbar(`Module ${row.module_name} ${disabled ? 'disabled' : 'enabled'} successfully!`, { variant: 'success' });
      setPricingRows((prev) => prev.map((r, i) => (i === idx ? { ...r, disabled } : r)));
    } catch (err: any) {
      console.error('Error in setModuleDisabled:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddInputChange = (key: string, value: string) => {
    setAddForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setError(null);
    try {
      const payload = {
        module_name: addForm.module_name,
        m1: Number(addForm.m1) || 0,
        m3: Number(addForm.m3) || 0,
        year_price: Number(addForm.year_price) || 0,
        y1: Number(addForm.y1) || 0,
        y2: Number(addForm.y2) || 0,
        y3: Number(addForm.y3) || 0,
        y5: Number(addForm.y5) || 0,
        disabled: addForm.disabled ? 1 : 0,
      };
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.ModulePricing.add_module_pricing', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok || !result.message || !result.message.success) throw new Error('Failed to add module');
      setPricingRows((prev) => [
        { ...payload },
        ...prev,
      ]);
      setShowAddModal(false);
      setAddForm({});
      enqueueSnackbar('Module added successfully!', { variant: 'success' });
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setAddLoading(false);
    }
  };

  const columns = columnsConfig[tab];
  const rows = pricingRows;
  const tableMinWidth =
    tab === 'yearly'
      ? 'min-w-[1000px]'
      : tab === 'longterm'
      ? 'min-w-[700px]'
      : 'min-w-[600px]';

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2 drop-shadow">Module Pricing Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your modules and their pricing plans</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2 text-lg"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus className="text-xl" /> Add Module
          </button>
          {tabOptions.map((t) => (
            <button
              key={t.key}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 focus:outline-none ring-2 text-base ${tab === t.key ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white ring-[#2563eb] scale-105 shadow-lg' : 'bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#2a2a33]'}`}
              onClick={() => setTab(t.key as TabKey)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {/* Add Module Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-[#23232a] dark:to-[#232F3E] rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-gray-200 dark:border-gray-700 relative animate-fadeInUp">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
              onClick={() => setShowAddModal(false)}
              title="Close"
            >
              <FiX />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-[#232F3E] dark:text-white drop-shadow">Add New Module</h3>
            <form onSubmit={handleAddModule} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#232F3E] dark:text-white">Module Name</label>
                <input
                  type="text"
                  required
                  value={addForm.module_name || ''}
                  onChange={e => handleAddInputChange('module_name', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* Currency fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-[#232F3E] dark:text-white">1 Month (SAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addForm.m1 || ''}
                    onChange={e => handleAddInputChange('m1', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-[#232F3E] dark:text-white">3 Months (SAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addForm.m3 || ''}
                    onChange={e => handleAddInputChange('m3', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-[#232F3E] dark:text-white">Year Price (SAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addForm.year_price || ''}
                    onChange={e => handleAddInputChange('year_price', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-[#232F3E] dark:text-white">1 Year (SAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addForm.y1 || ''}
                    onChange={e => handleAddInputChange('y1', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-[#232F3E] dark:text-white">2 Years (SAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addForm.y2 || ''}
                    onChange={e => handleAddInputChange('y2', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-[#232F3E] dark:text-white">3 Years (SAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addForm.y3 || ''}
                    onChange={e => handleAddInputChange('y3', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-[#232F3E] dark:text-white">5 Years (SAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addForm.y5 || ''}
                    onChange={e => handleAddInputChange('y5', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              {/* Disabled toggle */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={!!addForm.disabled}
                  onChange={e => handleAddInputChange('disabled', e.target.checked ? '1' : '0')}
                  id="add-module-disabled"
                />
                <label htmlFor="add-module-disabled" className="text-sm font-semibold text-[#232F3E] dark:text-white">Disabled</label>
              </div>
              <button
                type="submit"
                disabled={addLoading}
                className="mt-4 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:from-indigo-700 hover:to-blue-600 hover:shadow-xl transition-all duration-200 text-lg flex items-center gap-2 justify-center"
              >
                {addLoading ? 'Adding...' : (<><FiPlus className="text-xl" /> Add Module</>)}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* End Add Module Modal */}
      <div className="overflow-x-auto rounded-3xl mt-6 shadow-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white/80 to-blue-50 dark:from-[#23232a]/80 dark:to-[#232F3E]/60 backdrop-blur-md">
        {loading ? (
          <div className="text-center py-8 text-lg font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
        ) : (
          <table className={`${tableMinWidth} text-left border-separate border-spacing-0 bg-transparent rounded-xl shadow-lg`}>
            <thead>
              <tr className="text-[#232F3E] dark:text-white text-base font-bold">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base drop-shadow">{col.label}</th>
                ))}
                <th className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base drop-shadow">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.module_name}
                  className={
                    `text-[#232F3E] dark:text-white text-sm md:text-base font-medium transition-all duration-200 hover:scale-[1.01] hover:shadow-2xl ${
                      idx % 2 === 1 ? 'bg-white/60 dark:bg-[#23232a]/80' : 'bg-blue-50/60 dark:bg-[#232F3E]/40'
                    }` +
                    (row.disabled ? ' bg-red-100 dark:bg-red-900/30' : '')
                  }
                  style={{ boxShadow: row.disabled ? '0 2px 8px 0 rgba(255,0,0,0.10)' : '0 2px 8px 0 rgba(31,38,135,0.10)' }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 md:px-6 py-3 md:py-4 font-semibold">
                      {editingRowIdx === idx && col.key !== 'module_name' ? (
                        <input
                          type="number"
                          step="0.01"
                          value={rowDraft[col.key] ?? ''}
                          onChange={e => handleRowInputChange(col.key, e.target.value)}
                          className="w-20 md:w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner"
                        />
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                  <td className="px-4 md:px-6 py-3 md:py-4 flex gap-3 items-center">
                    {editingRowIdx === idx ? (
                      <>
                        <button onClick={() => saveRow(idx)} disabled={saving} title="Save" className="rounded-full p-2 bg-green-100 hover:bg-green-500 hover:text-white shadow transition-all duration-200" aria-label="Save">
                          <FiSave className="w-5 h-5" />
                        </button>
                        <button onClick={cancelEdit} disabled={saving} title="Cancel" className="rounded-full p-2 bg-gray-100 hover:bg-gray-400 hover:text-white shadow transition-all duration-200" aria-label="Cancel">
                          <FiX className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(idx)}
                          disabled={saving || row.disabled}
                          title="Edit"
                          className="rounded-full p-2 bg-blue-100 hover:bg-blue-500 hover:text-white shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Edit"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setModuleDisabled(idx, !row.disabled)}
                          disabled={saving}
                          title={row.disabled ? 'Enable' : 'Disable'}
                          className={`rounded-full p-2 shadow transition-all duration-200 transform hover:scale-110 focus:outline-none ${row.disabled ? 'bg-yellow-100 hover:bg-yellow-500 hover:text-white' : 'bg-green-100 hover:bg-green-500 hover:text-white'}`}
                          aria-label={row.disabled ? 'Enable' : 'Disable'}
                        >
                          <span className="inline-block transition-transform duration-200">
                            {row.disabled ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                          </span>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="mt-6 flex flex-col items-center gap-2">
          {error && <span className="text-red-600 font-semibold">{error}</span>}
        </div>
      </div>
    </div>
  );
};

export default ModulePricingManagement; 
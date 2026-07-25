import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

export interface ChartItem {
  id: string;
  name: string;
  prefix: string;
  category: string;
  count: number;
  maleCount: number;
  femaleCount: number;
}

interface Props {
  data: ChartItem[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Anak-anak': '#f59e0b', // amber-500
  'Remaja': '#6366f1',    // indigo-500
  'Dewasa': '#10b981',    // emerald-500
  'Umum': '#334155'       // slate-700
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as ChartItem;
    return (
      <div style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
        fontSize: '12px',
        border: '1px solid #334155',
        minWidth: '200px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #334155',
          paddingBottom: '6px',
          marginBottom: '8px'
        }}>
          <span style={{ fontWeight: 800, color: '#fbbf24' }}>{item.name}</span>
          <span style={{
            background: '#1e293b',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#94a3b8'
          }}>
            [{item.prefix}]
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ color: '#94a3b8' }}>Kategori:</span>
          <span style={{ fontWeight: 700, color: CATEGORY_COLORS[item.category] || '#38bdf8' }}>{item.category}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ color: '#94a3b8' }}>Total Peserta:</span>
          <strong style={{ color: '#ffffff', fontWeight: 800 }}>{item.count} Orang</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#cbd5e1' }}>
          <span>👨 Laki-Laki: {item.maleCount}</span>
          <span>👩 Perempuan: {item.femaleCount}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const RechartsRegistrationChart: React.FC<Props> = ({ data }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredData = activeCategory === 'ALL'
    ? data
    : data.filter(item => item.category === activeCategory);

  return (
    <div style={{ width: '100%', fontFamily: 'sans-serif' }}>
      {/* Category Pills Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Filter Kategori Recharts:</span>
        {['ALL', 'Anak-anak', 'Remaja', 'Dewasa', 'Umum'].map(cat => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 800,
                border: isSelected ? '1px solid #dc2626' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#fee2e2' : '#f8fafc',
                color: isSelected ? '#991b1b' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat === 'ALL' ? 'Semua' : cat}
            </button>
          );
        })}
      </div>

      {/* Recharts BarChart */}
      {filteredData.length > 0 ? (
        <div style={{ width: '100%', height: 280, backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px 8px 8px 0px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingBottom: '10px' }}
              />
              <Bar
                dataKey="count"
                name="Total Peserta"
                radius={[8, 8, 0, 0]}
                barSize={38}
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.category] || '#dc2626'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
          Tidak ada data pendaftaran untuk kategori yang dipilih.
        </div>
      )}
    </div>
  );
};

export default RechartsRegistrationChart;

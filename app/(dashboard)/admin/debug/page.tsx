// app/(dashboard)/admin/debug/page.tsx
"use client";

import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function DebugDashboard() {
  const [results, setResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const apis = [
    { name: 'Overview', url: '/api/admin/stats/overview?period=30d' },
    { name: 'Users', url: '/api/admin/stats/users?period=30d' },
    { name: 'Donations', url: '/api/admin/stats/donations?period=30d' },
    { name: 'Projects', url: '/api/admin/stats/projects?period=30d' },
    { name: 'Engagement', url: '/api/admin/stats/engagements?period=30d' },
    { name: 'Top Donors', url: '/api/admin/stats/top-donors?limit=5&period=all' },
  ];

  const testAllAPIs = async () => {
    setTesting(true);
    const testResults = [];

    for (const api of apis) {
      const start = Date.now();
      try {
        const response = await fetch(api.url);
        const duration = Date.now() - start;
        const data = await response.json();

        testResults.push({
          name: api.name,
          url: api.url,
          status: response.status,
          ok: response.ok,
          duration,
          data: data,
          error: null
        });
      } catch (error) {
        const duration = Date.now() - start;
        testResults.push({
          name: api.name,
          url: api.url,
          status: 0,
          ok: false,
          duration,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setResults(testResults);
    setTesting(false);
  };

  const getStatusIcon = (result: any) => {
    if (!result) return <AlertCircle className="w-5 h-5 text-gray-400" />;
    if (result.ok) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (result: any) => {
    if (!result) return 'border-gray-200';
    if (result.ok) return 'border-green-200 bg-green-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            🔧 Dashboard Admin - Page de Debug
          </h1>
          <p className="text-slate-600 mb-4">
            Testez toutes les APIs pour identifier les problèmes
          </p>

          <button
            onClick={testAllAPIs}
            disabled={testing}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Test en cours...' : 'Tester toutes les APIs'}
          </button>
        </div>

        {results.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                📊 Résumé des Tests
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600">
                    {results.filter(r => r.ok).length}
                  </div>
                  <div className="text-sm text-green-700">APIs OK</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-3xl font-bold text-red-600">
                    {results.filter(r => !r.ok).length}
                  </div>
                  <div className="text-sm text-red-700">APIs en erreur</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {(results.reduce((sum, r) => sum + r.duration, 0) / results.length).toFixed(0)}ms
                  </div>
                  <div className="text-sm text-blue-700">Durée moyenne</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow border-2 ${getStatusColor(result)} p-6`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result)}
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {result.name}
                        </h3>
                        <p className="text-sm text-slate-500">{result.url}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${result.ok ? 'text-green-600' : 'text-red-600'}`}>
                        {result.status}
                      </div>
                      <div className="text-sm text-slate-500">{result.duration}ms</div>
                    </div>
                  </div>

                  {result.error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="font-semibold text-red-800 mb-2">Erreur:</div>
                      <pre className="text-sm text-red-700 whitespace-pre-wrap">
                        {result.error}
                      </pre>
                    </div>
                  )}

                  {result.ok && result.data && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-slate-800">
                          Données reçues:
                        </div>
                        <button
                          onClick={() => {
                            const el = document.getElementById(`data-${index}`);
                            if (el) {
                              el.classList.toggle('hidden');
                            }
                          }}
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          Voir/Masquer JSON
                        </button>
                      </div>
                      
                      <div className="text-sm text-slate-600 mb-2">
                        {result.data.success !== undefined && (
                          <div>✓ Success: {String(result.data.success)}</div>
                        )}
                        {result.data.data && (
                          <div>✓ Data object present</div>
                        )}
                        {result.data.kpis && (
                          <div>✓ KPIs present</div>
                        )}
                      </div>

                      <pre
                        id={`data-${index}`}
                        className="hidden text-xs bg-slate-800 text-slate-100 p-4 rounded overflow-x-auto max-h-96"
                      >
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {results.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              Cliquez sur "Tester toutes les APIs" pour commencer le diagnostic
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
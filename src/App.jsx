import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Scale, 
  CheckCircle, 
  AlertTriangle, 
  X,
  ClipboardList,
  Globe // Novo ícone para o seletor de idiomas
} from 'lucide-react';

// --- Dicionário de Traduções (I18n) ---
const TRANSLATIONS = {
  pt: {
    debit: 'Débito',
    credit: 'Crédito',
    balance: 'Saldo',
    debitBalance: 'Saldo Devedor',
    creditBalance: 'Saldo Credor',
    accountName: 'Nome da Conta',
    addEntry: 'Lançar',
    ref: 'Ref.',
    notes: 'Notas explicativas...',
    deleteAccount: 'Excluir Conta',
    deleteEntry: 'Excluir lançamento',
    appTitle: 'Razonete Pro',
    appSubtitle: 'O famoso gráfico em T',
    doubleEntryOk: 'Partidas Dobradas: OK',
    discrepancy: 'Divergência',
    newAccount: 'Novo Razonete',
    trialBalance: 'Balancete',
    export: 'Exportar',
    clearAll: 'Limpar Tudo',
    emptyWorkspace: 'Espaço de trabalho vazio',
    startAdding: 'Comece adicionando o seu primeiro razonete.',
    confirmation: 'Confirmação',
    confirmDeleteAll: 'Tem certeza que deseja apagar todos os razonetes? Todo o trabalho será perdido.',
    confirmDeleteOne: 'Tem certeza que deseja excluir este razonete permanentemente?',
    cancel: 'Cancelar',
    deleteAll: 'Apagar Tudo',
    delete: 'Excluir',
    trialBalanceTitle: 'Balancete de Verificação',
    trialBalanceSubtitle: 'Resumo de saldos por conta',
    tableAccounts: 'Contas',
    tableDebit: 'Saldo Devedor',
    tableCredit: 'Saldo Credor',
    totals: 'TOTAIS',
    balanced: 'Balancete Fechado',
    balancedMsg: 'O método das partidas dobradas foi respeitado.',
    unbalanced: 'Divergência Encontrada',
    unbalancedMsg: 'Há uma diferença de {diff} entre débitos e créditos.',
    close: 'Fechar',
    nature: 'Natureza',
    type: 'Tipo',
    value: 'Valor',
    debtor: 'Devedora',
    creditor: 'Credora'
  },
  en: {
    debit: 'Debit',
    credit: 'Credit',
    balance: 'Balance',
    debitBalance: 'Debit Balance',
    creditBalance: 'Credit Balance',
    accountName: 'Account Name',
    addEntry: 'Add',
    ref: 'Ref.',
    notes: 'Explanatory notes...',
    deleteAccount: 'Delete Account',
    deleteEntry: 'Delete Entry',
    appTitle: 'T-Account Pro',
    appSubtitle: 'The famous T-chart',
    doubleEntryOk: 'Double Entry: OK',
    discrepancy: 'Discrepancy',
    newAccount: 'New Account',
    trialBalance: 'Trial Balance',
    export: 'Export',
    clearAll: 'Clear All',
    emptyWorkspace: 'Empty workspace',
    startAdding: 'Start by adding your first T-account.',
    confirmation: 'Confirmation',
    confirmDeleteAll: 'Are you sure you want to delete all accounts? All work will be lost.',
    confirmDeleteOne: 'Are you sure you want to delete this account permanently?',
    cancel: 'Cancel',
    deleteAll: 'Delete All',
    delete: 'Delete',
    trialBalanceTitle: 'Trial Balance',
    trialBalanceSubtitle: 'Account balance summary',
    tableAccounts: 'Accounts',
    tableDebit: 'Debit Balance',
    tableCredit: 'Credit Balance',
    totals: 'TOTALS',
    balanced: 'Balanced',
    balancedMsg: 'The double-entry method was respected.',
    unbalanced: 'Discrepancy Found',
    unbalancedMsg: 'There is a difference of {diff} between debits and credits.',
    close: 'Close',
    nature: 'Nature',
    type: 'Type',
    value: 'Value',
    debtor: 'Debit',
    creditor: 'Credit'
  },
  es: {
    debit: 'Débito',
    credit: 'Crédito',
    balance: 'Saldo',
    debitBalance: 'Saldo Deudor',
    creditBalance: 'Saldo Acreedor',
    accountName: 'Nombre de la Cuenta',
    addEntry: 'Agregar',
    ref: 'Ref.',
    notes: 'Notas explicativas...',
    deleteAccount: 'Eliminar Cuenta',
    deleteEntry: 'Eliminar entrada',
    appTitle: 'Razonete Pro',
    appSubtitle: 'El famoso gráfico en T',
    doubleEntryOk: 'Partida Doble: OK',
    discrepancy: 'Discrepancia',
    newAccount: 'Nueva Cuenta',
    trialBalance: 'Balance',
    export: 'Exportar',
    clearAll: 'Borrar Todo',
    emptyWorkspace: 'Espacio de trabajo vacío',
    startAdding: 'Comience agregando su primera cuenta T.',
    confirmation: 'Confirmación',
    confirmDeleteAll: '¿Está seguro de que desea eliminar todas las cuentas? Todo el trabajo se perderá.',
    confirmDeleteOne: '¿Está seguro de que desea eliminar esta cuenta permanentemente?',
    cancel: 'Cancelar',
    deleteAll: 'Borrar Todo',
    delete: 'Eliminar',
    trialBalanceTitle: 'Balance de Comprobación',
    trialBalanceSubtitle: 'Resumen de saldos por cuenta',
    tableAccounts: 'Cuentas',
    tableDebit: 'Saldo Deudor',
    tableCredit: 'Saldo Acreedor',
    totals: 'TOTALES',
    balanced: 'Balance Cuadrado',
    balancedMsg: 'Se respetó el método de partida doble.',
    unbalanced: 'Discrepancia Encontrada',
    unbalancedMsg: 'Hay una diferencia de {diff} entre débitos y créditos.',
    close: 'Cerrar',
    nature: 'Naturaleza',
    type: 'Tipo',
    value: 'Valor',
    debtor: 'Deudora',
    creditor: 'Acreedora'
  }
};

// --- Configurações de Localização ---
const LOCALE_CONFIG = {
  pt: { locale: 'pt-BR', currency: 'BRL' },
  en: { locale: 'en-US', currency: 'USD' },
  es: { locale: 'es-ES', currency: 'EUR' }
};

// --- Utilitários de Formatação Dinâmicos ---
const formatCurrency = (value, lang = 'pt') => {
  const config = LOCALE_CONFIG[lang];
  return new Intl.NumberFormat(config.locale, { style: 'currency', currency: config.currency }).format(value);
};

const formatNumber = (value, lang = 'pt') => {
  const config = LOCALE_CONFIG[lang];
  return new Intl.NumberFormat(config.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};

// --- Componente: Visual do T (CSS Puro) ---
const TAccountVisual = ({ entries, onDeleteEntry, lang, t }) => {
  const debits = entries.filter(e => e.type === 'DEBIT');
  const credits = entries.filter(e => e.type === 'CREDIT');

  return (
    <div className="relative w-full mt-6 mb-2">
      {/* Linha Horizontal do T */}
      <div className="border-t-2 border-slate-400 w-full absolute top-8 left-0 z-0"></div>
      {/* Linha Vertical do T */}
      <div className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 border-l-2 border-slate-400 z-0 h-[calc(100%-32px)]"></div>

      {/* Cabeçalhos */}
      <div className="flex justify-between text-xs font-bold text-slate-400 px-2 mb-2 h-6 items-center">
        <span className="w-1/2 pl-2">{t.debit}</span>
        <span className="w-1/2 text-right pr-2">{t.credit}</span>
      </div>

      {/* Área de Listas */}
      <div className="flex w-full h-40 relative z-10">
        {/* Lista de Débitos */}
        <div className="w-1/2 pr-3 pl-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200">
          {debits.map(entry => (
            <div key={entry.id} className="group flex justify-between items-center py-1 border-b border-transparent hover:bg-blue-50/80 rounded px-1 transition-colors">
              <div className="flex items-center gap-1 min-w-0">
                <button 
                  onClick={() => onDeleteEntry(entry.id)}
                  className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity p-1"
                  title={t.deleteEntry}
                >
                  <Trash2 size={12} />
                </button>
                <span className="text-[10px] text-slate-500 font-medium truncate max-w-[50px]" title={entry.ref}>
                  {entry.ref && `(${entry.ref})`}
                </span>
              </div>
              <span className="text-blue-700 font-semibold text-sm tabular-nums">
                {formatNumber(entry.value, lang)}
              </span>
            </div>
          ))}
        </div>

        {/* Lista de Créditos */}
        <div className="w-1/2 pl-3 pr-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 text-right">
          {credits.map(entry => (
            <div key={entry.id} className="group flex justify-end items-center py-1 border-b border-transparent hover:bg-red-50/80 rounded px-1 transition-colors">
              <span className="text-red-700 font-semibold text-sm tabular-nums">
                {formatNumber(entry.value, lang)}
              </span>
              <div className="flex items-center gap-1 min-w-0 ml-auto pl-2 flex-row-reverse">
                <button 
                  onClick={() => onDeleteEntry(entry.id)}
                  className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity p-1"
                  title={t.deleteEntry}
                >
                  <Trash2 size={12} />
                </button>
                <span className="text-[10px] text-slate-500 font-medium truncate max-w-[50px]" title={entry.ref}>
                  {entry.ref && `(${entry.ref})`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Componente: Cartão do Razonete ---
const RazoneteCard = ({ data, onUpdate, onDeleteRequest, lang, t }) => {
  const [inputs, setInputs] = useState({ debit: '', credit: '', ref: '' });

  const totals = useMemo(() => {
    const debit = data.entries.filter(e => e.type === 'DEBIT').reduce((acc, curr) => acc + curr.value, 0);
    const credit = data.entries.filter(e => e.type === 'CREDIT').reduce((acc, curr) => acc + curr.value, 0);
    return { debit, credit, balance: debit - credit };
  }, [data.entries]);

  const handleAddEntry = () => {
    const newEntries = [...data.entries];
    const ref = inputs.ref.trim();
    let added = false;

    if (inputs.debit && parseFloat(inputs.debit) > 0) {
      newEntries.push({ id: crypto.randomUUID(), type: 'DEBIT', value: parseFloat(inputs.debit), ref });
      added = true;
    }
    if (inputs.credit && parseFloat(inputs.credit) > 0) {
      newEntries.push({ id: crypto.randomUUID(), type: 'CREDIT', value: parseFloat(inputs.credit), ref });
      added = true;
    }

    if (added) {
      onUpdate({ ...data, entries: newEntries });
      setInputs({ debit: '', credit: '', ref: '' });
      document.getElementById(`debit-${data.id}`)?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddEntry();
  };

  const handleDeleteEntry = (entryId) => {
    const newEntries = data.entries.filter(e => e.id !== entryId);
    onUpdate({ ...data, entries: newEntries });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 p-4 flex flex-col gap-3 w-full transition-all duration-200 relative group">
      {/* Cabeçalho do Card */}
      <div className="relative pr-8"> 
        <input 
          type="text" 
          value={data.title}
          onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          className="text-lg font-bold text-slate-800 w-full border-b border-transparent focus:border-blue-500 outline-none placeholder-slate-400 bg-transparent"
          placeholder={t.accountName}
        />
        <button 
          type="button"
          onClick={() => onDeleteRequest(data.id)}
          className="absolute -top-1 -right-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition-all z-10"
          title={t.deleteAccount}
        >
          <X size={18} />
        </button>
      </div>

      <TAccountVisual entries={data.entries} onDeleteEntry={handleDeleteEntry} lang={lang} t={t} />

      <div className={`
        flex justify-between items-center p-2 rounded-lg border text-sm font-bold
        ${totals.balance >= 0 
          ? 'bg-blue-50 border-blue-100 text-blue-800' 
          : 'bg-red-50 border-red-100 text-red-800'}
      `}>
        <span className="text-xs uppercase tracking-wider opacity-80">
          {totals.balance >= 0 ? t.debitBalance : t.creditBalance}
        </span>
        <span className="text-base">
          {formatCurrency(Math.abs(totals.balance), lang)}
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="absolute left-2 top-2 text-blue-300 text-xs font-bold pointer-events-none">D</span>
            <input 
              id={`debit-${data.id}`}
              type="number" 
              step="0.01"
              value={inputs.debit}
              onChange={(e) => setInputs({ ...inputs, debit: e.target.value })}
              onKeyDown={handleKeyDown}
              className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded text-sm text-blue-700 font-semibold focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
              placeholder="0,00"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2 top-2 text-red-300 text-xs font-bold pointer-events-none">C</span>
            <input 
              type="number" 
              step="0.01"
              value={inputs.credit}
              onChange={(e) => setInputs({ ...inputs, credit: e.target.value })}
              onKeyDown={handleKeyDown}
              className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded text-sm text-red-700 font-semibold focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
              placeholder="0,00"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputs.ref}
            onChange={(e) => setInputs({ ...inputs, ref: e.target.value })}
            onKeyDown={handleKeyDown}
            className="w-2/3 px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-400 outline-none"
            placeholder={t.ref}
          />
          <button 
            onClick={handleAddEntry}
            className="w-1/3 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            {t.addEntry}
          </button>
        </div>
      </div>

      <textarea 
        value={data.comment}
        onChange={(e) => onUpdate({ ...data, comment: e.target.value })}
        className="w-full text-xs p-2 border border-slate-200 rounded resize-y min-h-[40px] bg-slate-50 focus:bg-white focus:border-blue-400 outline-none transition-colors"
        placeholder={t.notes}
      />
    </div>
  );
};

// --- Componente: Modal do Balancete de Verificação ---
const TrialBalanceModal = ({ isOpen, onClose, razonetes, lang, t }) => {
  if (!isOpen) return null;

  // Lógica de Agregação (Data Aggregation)
  const reportData = useMemo(() => {
    return razonetes.map(r => {
      const totalD = r.entries.filter(e => e.type === 'DEBIT').reduce((acc, c) => acc + c.value, 0);
      const totalC = r.entries.filter(e => e.type === 'CREDIT').reduce((acc, c) => acc + c.value, 0);
      const balance = totalD - totalC;

      return {
        id: r.id,
        title: r.title || 'Conta sem nome',
        debitBalance: balance > 0 ? balance : 0,
        creditBalance: balance < 0 ? Math.abs(balance) : 0
      };
    }).sort((a, b) => a.title.localeCompare(b.title));
  }, [razonetes]);

  const totals = useMemo(() => {
    return reportData.reduce((acc, curr) => ({
      debit: acc.debit + curr.debitBalance,
      credit: acc.credit + curr.creditBalance
    }), { debit: 0, credit: 0 });
  }, [reportData]);

  const isBalanced = Math.abs(totals.debit - totals.credit) < 0.01;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header do Modal */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{t.trialBalanceTitle}</h2>
              <p className="text-sm text-slate-500">{t.trialBalanceSubtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Corpo do Relatório */}
        <div className="overflow-auto p-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-300">
                <th className="py-3 px-4 text-left w-1/2">{t.tableAccounts}</th>
                <th className="py-3 px-4 text-right w-1/4 text-blue-700">{t.tableDebit}</th>
                <th className="py-3 px-4 text-right w-1/4 text-red-700">{t.tableCredit}</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="py-3 px-4 font-medium text-slate-700">{row.title}</td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-600 font-medium">
                    {row.debitBalance > 0 ? formatNumber(row.debitBalance, lang) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-600 font-medium">
                    {row.creditBalance > 0 ? formatNumber(row.creditBalance, lang) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Rodapé do Relatório (Totais) */}
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-base">
                <td className="py-4 px-4 text-slate-800">{t.totals}</td>
                <td className="py-4 px-4 text-right text-blue-700 tabular-nums">
                  {formatNumber(totals.debit, lang)}
                </td>
                <td className="py-4 px-4 text-right text-red-700 tabular-nums">
                  {formatNumber(totals.credit, lang)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Status de Validação */}
          <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 border ${isBalanced ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {isBalanced ? (
              <>
                <CheckCircle size={24} />
                <div>
                  <p className="font-bold">{t.balanced}</p>
                  <p className="text-sm opacity-90">{t.balancedMsg}</p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle size={24} />
                <div>
                  <p className="font-bold">{t.unbalanced}</p>
                  <p className="text-sm opacity-90">{t.unbalancedMsg.replace('{diff}', formatCurrency(Math.abs(totals.debit - totals.credit), lang))}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer do Modal */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal App ---
const App = () => {
  const [razonetes, setRazonetes] = useState([]);
  const [isTrialBalanceOpen, setIsTrialBalanceOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('pt'); // Estado do idioma
  const t = TRANSLATIONS[currentLang]; // Atalho para as traduções
   
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    type: null, // 'SINGLE' | 'ALL'
    targetId: null 
  });

  useEffect(() => {
    const saved = localStorage.getItem('razonetes_react_v1');
    if (saved) {
      setRazonetes(JSON.parse(saved));
    } else {
      setRazonetes([
        {
          id: 'demo-1',
          title: 'Caixa (Ativo)',
          entries: [
            { id: 'e1', type: 'DEBIT', value: 1000, ref: 'Cap. Social' },
            { id: 'e2', type: 'CREDIT', value: 200, ref: 'Mat. Escrit.' }
          ],
          comment: 'Disponibilidade imediata.'
        },
        {
          id: 'demo-2',
          title: 'Capital Social (PL)',
          entries: [
            { id: 'e3', type: 'CREDIT', value: 1000, ref: 'Integralização' }
          ],
          comment: 'Capital dos sócios.'
        }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('razonetes_react_v1', JSON.stringify(razonetes));
  }, [razonetes]);

  const globalStatus = useMemo(() => {
    let totalD = 0;
    let totalC = 0;
    razonetes.forEach(r => {
      totalD += r.entries.filter(e => e.type === 'DEBIT').reduce((acc, c) => acc + c.value, 0);
      totalC += r.entries.filter(e => e.type === 'CREDIT').reduce((acc, c) => acc + c.value, 0);
    });
    return {
      totalD,
      totalC,
      diff: totalD - totalC,
      isBalanced: Math.abs(totalD - totalC) < 0.01
    };
  }, [razonetes]);

  const addRazonete = () => {
    setRazonetes([
      ...razonetes, 
      { id: crypto.randomUUID(), title: '', entries: [], comment: '' }
    ]);
  };

  const updateRazonete = (updatedRazonete) => {
    setRazonetes(razonetes.map(r => r.id === updatedRazonete.id ? updatedRazonete : r));
  };

  const requestDelete = (id) => {
    setConfirmModal({ isOpen: true, type: 'SINGLE', targetId: id });
  };

  const requestClearAll = () => {
    setConfirmModal({ isOpen: true, type: 'ALL', targetId: null });
  };

  const confirmAction = () => {
    if (confirmModal.type === 'SINGLE' && confirmModal.targetId) {
      setRazonetes(razonetes.filter(r => r.id !== confirmModal.targetId));
    } else if (confirmModal.type === 'ALL') {
      setRazonetes([]);
    }
    setConfirmModal({ isOpen: false, type: null, targetId: null });
  };

  const exportCSV = () => {
    let csv = "data:text/csv;charset=utf-8,\uFEFF";
    csv += `ID_${t.accountName};${t.accountName};${t.nature};${t.type};${t.value};${t.ref};Nota\n`;
    razonetes.forEach(r => {
      r.entries.forEach(e => {
        const row = [
          r.id,
          `"${r.title}"`,
          e.type === 'DEBIT' ? t.debtor : t.creditor,
          e.type === 'DEBIT' ? 'Debito' : 'Credito', // Mantendo interno para consistência
          e.value.toFixed(2).replace('.', ','),
          `"${e.ref}"`,
          `"${r.comment.replace(/\n/g, ' ')}"`
        ];
        csv += row.join(";") + "\n";
      });
    });
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `razonetes_export_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-blue-200 shadow-lg">
              <Scale size={24} weight="bold" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">{t.appTitle}</h1>
              <p className="text-xs text-slate-500 mt-1">{t.appSubtitle}</p>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-sm transition-colors ${globalStatus.isBalanced ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {globalStatus.isBalanced ? (
              <>
                <CheckCircle size={18} />
                <span>{t.doubleEntryOk}</span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} />
                <span>{t.discrepancy}: {formatCurrency(globalStatus.diff, currentLang)}</span>
              </>
            )}
          </div>

          <div className="flex gap-2 items-center">
            {/* Seletor de Idioma */}
            <div className="relative group mr-2">
              <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1" title="Mudar Idioma">
                <Globe size={20} />
                <span className="text-xs font-bold uppercase">{currentLang}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl py-1 hidden group-hover:block w-32 z-50">
                <button onClick={() => setCurrentLang('pt')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${currentLang === 'pt' ? 'font-bold text-blue-600' : 'text-slate-600'}`}>Português</button>
                <button onClick={() => setCurrentLang('en')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${currentLang === 'en' ? 'font-bold text-blue-600' : 'text-slate-600'}`}>English</button>
                <button onClick={() => setCurrentLang('es')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${currentLang === 'es' ? 'font-bold text-blue-600' : 'text-slate-600'}`}>Español</button>
              </div>
            </div>

            <button onClick={addRazonete} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm active:scale-95">
              <Plus size={16} /> {t.newAccount}
            </button>
            
            <button onClick={() => setIsTrialBalanceOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition shadow-sm active:scale-95">
              <ClipboardList size={16} /> {t.trialBalance}
            </button>
            
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm active:scale-95">
              <Download size={16} /> {t.export}
            </button>
            <button onClick={requestClearAll} className="px-3 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm" title={t.clearAll}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-6">
        {razonetes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
            <Scale size={64} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-medium text-slate-500">{t.emptyWorkspace}</h3>
            <p className="text-slate-400">{t.startAdding}</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 items-start">
            {razonetes.map(razonete => (
              <RazoneteCard 
                key={razonete.id} 
                data={razonete} 
                onUpdate={updateRazonete} 
                onDeleteRequest={requestDelete}
                lang={currentLang}
                t={t}
              />
            ))}
          </div>
        )}
      </main>

      <TrialBalanceModal 
        isOpen={isTrialBalanceOpen} 
        onClose={() => setIsTrialBalanceOpen(false)} 
        razonetes={razonetes} 
        lang={currentLang}
        t={t}
      />

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-amber-500 mb-4">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold text-slate-800">{t.confirmation}</h3>
            </div>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
              {confirmModal.type === 'ALL' 
                ? t.confirmDeleteAll 
                : t.confirmDeleteOne}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition"
              >
                {t.cancel}
              </button>
              <button 
                onClick={confirmAction}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-600/20"
              >
                {confirmModal.type === 'ALL' ? t.deleteAll : t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

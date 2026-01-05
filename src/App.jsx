import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from "firebase/firestore";
import { 
  Plus, 
  Trash2, 
  Download, 
  Scale, 
  CheckCircle, 
  AlertTriangle, 
  X,
  ClipboardList,
  Globe,
  Archive,
  ArchiveRestore,
  FileSpreadsheet,
  Linkedin,
  Calendar,
  Coffee, 
  Copy,   
  Check,
  Folder,
  FolderPlus,
  ChevronDown,
  MoreHorizontal,
  Eraser,
  LogIn,
  LogOut,
  Cloud,
  CloudOff,
  CloudAlert // Ícone para erro na nuvem
} from 'lucide-react';

// --- CONFIGURAÇÃO DO FIREBASE (MODO DIRETO PARA WEB) ---
const firebaseConfig = {
  apiKey: "AIzaSyDByE5IapjOxWUJHeJ9u6Zen-XPdmRD7cg",
  authDomain: "razonete.firebaseapp.com",
  projectId: "razonete",
  storageBucket: "razonete.firebasestorage.app",
  messagingSenderId: "292066184172",
  appId: "1:292066184172:web:da7dbc37c08475bd024ec9",
  measurementId: "G-MC6L9DKQ80"
};

// Inicialização segura
let auth, db;
if (firebaseConfig.apiKey) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn("Erro ao inicializar Firebase.", error);
  }
}

// --- TELEMETRIA: Google Analytics 4 Helper ---
const sendGAEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

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
    export: 'Exportar CSV',
    clearAll: 'Limpar Tudo',
    emptyWorkspace: 'Espaço de trabalho vazio',
    emptyArchived: 'Nenhum razonete arquivado',
    startAdding: 'Comece adicionando o seu primeiro razonete.',
    confirmation: 'Confirmação',
    confirmDeleteAll: 'Tem certeza que deseja apagar todos os razonetes visíveis deste projeto? Todo o trabalho será perdido.',
    confirmDeleteOne: 'Tem certeza que deseja excluir este razonete permanentemente?',
    cancel: 'Cancelar',
    deleteAll: 'Apagar Tudo',
    delete: 'Excluir',
    trialBalanceTitle: 'Balancete de Verificação',
    trialBalanceSubtitle: 'Resumo de saldos por conta (Visíveis)',
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
    creditor: 'Credora',
    archive: 'Arquivar',
    unarchive: 'Desarquivar',
    showArchived: 'Ver Arquivados',
    showActive: 'Ver Ativos',
    archivedView: 'Modo Arquivo',
    exportExcel: 'Exportar Excel',
    developedBy: 'Desenvolvido por', 
    role: 'Contador & Cientista de Dados',
    date: 'Data',
    period: 'Período',
    startDate: 'Data Inicial',
    endDate: 'Data Final',
    filter: 'Filtrar',
    supportProject: 'Apoiar Projeto',
    supportTitle: 'Apoie o Razonete Pro',
    supportDesc: 'Esta ferramenta é gratuita. Se ela ajuda no seu trabalho ou estudos, considere fazer um Pix de qualquer valor.',
    bonusText: '🎁 Bônus: Envie o comprovante para o LinkedIn do autor e receba o "Guia Prático de Auditoria Digital com Razonete Pro" em PDF.',
    pixKey: 'Chave Pix (E-mail):',
    copy: 'Copiar',
    copied: 'Copiado!',
    bankName: 'Banco: Nubank (Nu Pagamentos)',
    projects: 'Cenários / Projetos',
    newProject: 'Novo Projeto',
    projectNamePlaceholder: 'Nome do Cliente ou Cenário',
    create: 'Criar',
    deleteProject: 'Excluir Projeto',
    confirmDeleteProject: 'Tem certeza? Isso apagará o projeto e todos os razonetes dentro dele.',
    defaultProject: 'Geral (Principal)',
    inProject: 'em',
    moreOptions: 'Mais Opções',
    language: 'Idioma',
    login: 'Entrar com Google',
    logout: 'Sair',
    syncing: 'A salvar...',
    cloudStorage: 'Nuvem Ativa',
    cloudError: 'Erro ao Salvar (Verifique Conexão/Login)',
    localStorage: 'Modo Local'
  },
  en: {
    debit: 'Debit', credit: 'Credit', balance: 'Balance', debitBalance: 'Debit Balance', creditBalance: 'Credit Balance', accountName: 'Account Name', addEntry: 'Add', ref: 'Ref.', notes: 'Explanatory notes...', deleteAccount: 'Delete Account', deleteEntry: 'Delete Entry', appTitle: 'T-Account Pro', appSubtitle: 'The famous T-chart', doubleEntryOk: 'Double Entry: OK', discrepancy: 'Discrepancy', newAccount: 'New Account', trialBalance: 'Trial Balance', export: 'Export CSV', clearAll: 'Clear All', emptyWorkspace: 'Empty workspace', emptyArchived: 'No archived accounts', startAdding: 'Start by adding your first T-account.', confirmation: 'Confirmation', confirmDeleteAll: 'Are you sure you want to delete all visible accounts? All work will be lost.', confirmDeleteOne: 'Are you sure you want to delete this account permanently?', cancel: 'Cancel', deleteAll: 'Delete All', delete: 'Delete', trialBalanceTitle: 'Trial Balance', trialBalanceSubtitle: 'Account balance summary (Visible)', tableAccounts: 'Accounts', tableDebit: 'Debit Balance', tableCredit: 'Credit Balance', totals: 'TOTALS', balanced: 'Balanced', balancedMsg: 'The double-entry method was respected.', unbalanced: 'Discrepancy Found', unbalancedMsg: 'There is a difference of {diff} between debits and credits.', close: 'Close', nature: 'Nature', type: 'Type', value: 'Value', debtor: 'Debit', creditor: 'Credit', archive: 'Archive', unarchive: 'Unarchive', showArchived: 'Show Archived', showActive: 'Show Active', archivedView: 'Archive Mode', exportExcel: 'Export to Excel', developedBy: 'Developed by', role: 'Contador & Data Scientist', date: 'Date', period: 'Period', startDate: 'Start Date', endDate: 'End Date', filter: 'Filter',
    supportProject: 'Support Project',
    supportTitle: 'Support Razonete Pro',
    supportDesc: 'This tool is free. If it helps you, consider donating.',
    bonusText: '🎁 Bonus: Send the receipt to the author\'s LinkedIn to get the "Digital Audit Guide" PDF.',
    pixKey: 'Pix Key (Email):',
    copy: 'Copy',
    copied: 'Copied!',
    bankName: 'Bank: Nubank',
    projects: 'Scenarios / Projects',
    newProject: 'New Project',
    projectNamePlaceholder: 'Client Name or Scenario',
    create: 'Create',
    deleteProject: 'Delete Project',
    confirmDeleteProject: 'Are you sure? This will delete the project and all accounts within it.',
    defaultProject: 'General (Main)',
    inProject: 'in',
    moreOptions: 'More Options',
    language: 'Language',
    login: 'Login with Google',
    logout: 'Logout',
    syncing: 'Saving...',
    cloudStorage: 'Cloud Active',
    cloudError: 'Save Error (Check Connection/Login)',
    localStorage: 'Local Mode'
  },
  es: {
    debit: 'Débito', credit: 'Crédito', balance: 'Saldo', debitBalance: 'Saldo Deudor', creditBalance: 'Saldo Acreedor', accountName: 'Nombre de la Cuenta', addEntry: 'Agregar', ref: 'Ref.', notes: 'Notas explicativas...', deleteAccount: 'Eliminar Cuenta', deleteEntry: 'Eliminar entrada', appTitle: 'Razonete Pro', appSubtitle: 'El famoso gráfico en T', doubleEntryOk: 'Partida Doble: OK', discrepancy: 'Discrepancia', newAccount: 'Nueva Cuenta', trialBalance: 'Balance', export: 'Exportar CSV', clearAll: 'Borrar Todo', emptyWorkspace: 'Espacio de trabajo vacío', emptyArchived: 'No hay cuentas archivadas', startAdding: 'Comience agregando su primera cuenta T.', confirmation: 'Confirmación', confirmDeleteAll: '¿Está seguro de que desea eliminar todas las cuentas visibles? Todo el trabajo se perderá.', confirmDeleteOne: '¿Está seguro de que desea eliminar esta cuenta permanentemente?', cancel: 'Cancelar', deleteAll: 'Borrar Todo', delete: 'Eliminar', trialBalanceTitle: 'Balance de Comprobación', trialBalanceSubtitle: 'Resumen de saldos por cuenta (Visibles)', tableAccounts: 'Cuentas', tableDebit: 'Saldo Deudor', tableCredit: 'Saldo Acreedor', totals: 'TOTALES', balanced: 'Balance Cuadrado', balancedMsg: 'Se respetó el método de partida doble.', unbalanced: 'Discrepancia Encontrada', unbalancedMsg: 'Hay una diferencia de {diff} entre débitos y créditos.', close: 'Cerrar', nature: 'Naturaleza', type: 'Tipo', value: 'Valor', debtor: 'Deudora', creditor: 'Acreedora', archive: 'Archivar', unarchive: 'Desarchivar', showArchived: 'Ver Archivados', showActive: 'Ver Activos', archivedView: 'Modo Archivo', exportExcel: 'Exportar a Excel', developedBy: 'Desarrollado por', role: 'Contador & Científico de Datos', date: 'Fecha', period: 'Período', startDate: 'Fecha Inicio', endDate: 'Fecha Fin', filter: 'Filtrar',
    supportProject: 'Apoyar Proyecto',
    supportTitle: 'Apoye Razonete Pro',
    supportDesc: 'Esta herramienta es gratuita. Considere donar si le es útil.',
    bonusText: '🎁 Bono: Envíe el recibo al LinkedIn del autor para recibir la "Guía de Auditoría Digital" en PDF.',
    pixKey: 'Llave Pix (Email):',
    copy: 'Copiar',
    copied: '¡Copiado!',
    bankName: 'Banco: Nubank',
    projects: 'Escenarios / Proyectos',
    newProject: 'Nuevo Proyecto',
    projectNamePlaceholder: 'Nombre del Cliente o Escenario',
    create: 'Crear',
    deleteProject: 'Eliminar Proyecto',
    confirmDeleteProject: '¿Seguro? Esto eliminará el proyecto y todas sus cuentas.',
    defaultProject: 'General (Principal)',
    inProject: 'en',
    moreOptions: 'Más Opciones',
    language: 'Idioma',
    login: 'Entrar con Google',
    logout: 'Salir',
    syncing: 'Guardando...',
    cloudStorage: 'Nube Activa',
    cloudError: 'Error al Guardar',
    localStorage: 'Modo Local'
  }
};

const LOCALE_CONFIG = {
  pt: { locale: 'pt-BR', currency: 'BRL' },
  en: { locale: 'en-US', currency: 'USD' },
  es: { locale: 'es-ES', currency: 'EUR' }
};

const formatCurrency = (value, lang = 'pt') => {
  const config = LOCALE_CONFIG[lang];
  return new Intl.NumberFormat(config.locale, { style: 'currency', currency: config.currency }).format(value);
};

const formatNumber = (value, lang = 'pt') => {
  const config = LOCALE_CONFIG[lang];
  return new Intl.NumberFormat(config.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};

const formatDateShort = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}`;
};

// --- CONSTANTES ---
const PIX_KEY = "tiago7.amorim@gmail.com"; 
const PIX_PAYLOAD = "00020126450014BR.GOV.BCB.PIX0123tiago7.amorim@gmail.com5204000053039865802BR5921Tiago de Amorim Silva6009SAO PAULO62140510RmsnKreSgc63040778";
const QR_CODE_URL = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(PIX_PAYLOAD);

// --- Componentes ---
const TAccountVisual = ({ entries, onDeleteEntry, lang, t }) => {
  const debits = entries.filter(e => e.type === 'DEBIT');
  const credits = entries.filter(e => e.type === 'CREDIT');

  const renderEntry = (entry, isRightAligned = false) => (
    <div key={entry.id} className={`group flex items-center py-1 border-b border-transparent hover:bg-slate-100 rounded px-1 transition-colors ${isRightAligned ? 'justify-end' : 'justify-between'}`}>
      {!isRightAligned && (
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <button onClick={() => onDeleteEntry(entry.id)} className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity p-1 flex-shrink-0" title={t.deleteEntry}><Trash2 size={12} /></button>
          <div className="flex flex-col leading-none truncate">
            <span className="text-[10px] text-slate-500 font-medium truncate" title={entry.ref}>{entry.ref}</span>
            {entry.date && (<span className="text-[9px] text-slate-400">{formatDateShort(entry.date)}</span>)}
          </div>
        </div>
      )}
      <span className={`text-sm font-semibold tabular-nums ${isRightAligned ? 'text-red-700' : 'text-blue-700'}`}>{formatNumber(entry.value, lang)}</span>
      {isRightAligned && (
        <div className="flex items-center gap-1 min-w-0 flex-1 flex-row-reverse ml-2">
          <button onClick={() => onDeleteEntry(entry.id)} className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity p-1 flex-shrink-0" title={t.deleteEntry}><Trash2 size={12} /></button>
          <div className="flex flex-col leading-none truncate items-end">
            <span className="text-[10px] text-slate-500 font-medium truncate" title={entry.ref}>{entry.ref}</span>
            {entry.date && (<span className="text-[9px] text-slate-400">{formatDateShort(entry.date)}</span>)}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative w-full mt-6 mb-2">
      <div className="border-t-2 border-slate-400 w-full absolute top-8 left-0 z-0"></div>
      <div className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 border-l-2 border-slate-400 z-0 h-[calc(100%-32px)]"></div>
      <div className="flex justify-between text-xs font-bold text-slate-400 px-2 mb-2 h-6 items-center">
        <span className="w-1/2 pl-2">{t.debit}</span><span className="w-1/2 text-right pr-2">{t.credit}</span>
      </div>
      <div className="flex w-full h-40 relative z-10">
        <div className="w-1/2 pr-3 pl-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200">{debits.map(entry => renderEntry(entry, false))}</div>
        <div className="w-1/2 pl-3 pr-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 text-right">{credits.map(entry => renderEntry(entry, true))}</div>
      </div>
    </div>
  );
};

const RazoneteCard = ({ data, onUpdate, onDeleteRequest, onArchive, lang, t }) => {
  const today = new Date().toISOString().split('T')[0];
  const [inputs, setInputs] = useState({ debit: '', credit: '', ref: '', date: today });

  const totals = useMemo(() => {
    const debit = data.entries.filter(e => e.type === 'DEBIT').reduce((acc, curr) => acc + curr.value, 0);
    const credit = data.entries.filter(e => e.type === 'CREDIT').reduce((acc, curr) => acc + curr.value, 0);
    return { debit, credit, balance: debit - credit };
  }, [data.entries]);

  const handleAddEntry = () => {
    const newEntries = [...data.entries];
    const ref = inputs.ref.trim();
    const date = inputs.date;
    let added = false;
    const createEntry = (type, value) => ({ id: crypto.randomUUID(), type, value: parseFloat(value), ref, date });

    if (inputs.debit && parseFloat(inputs.debit) > 0) { 
        newEntries.push(createEntry('DEBIT', inputs.debit)); 
        sendGAEvent('post_entry', { type: 'DEBIT', value: parseFloat(inputs.debit), currency: lang === 'pt' ? 'BRL' : (lang === 'en' ? 'USD' : 'EUR') });
        added = true; 
    }
    if (inputs.credit && parseFloat(inputs.credit) > 0) { 
        newEntries.push(createEntry('CREDIT', inputs.credit)); 
        sendGAEvent('post_entry', { type: 'CREDIT', value: parseFloat(inputs.credit), currency: lang === 'pt' ? 'BRL' : (lang === 'en' ? 'USD' : 'EUR') });
        added = true; 
    }

    if (added) {
      onUpdate({ ...data, entries: newEntries });
      setInputs({ debit: '', credit: '', ref: '', date: inputs.date }); 
      document.getElementById(`debit-${data.id}`)?.focus();
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleAddEntry(); };
  const handleDeleteEntry = (entryId) => { onUpdate({ ...data, entries: data.entries.filter(e => e.id !== entryId) }); };

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 p-4 flex flex-col gap-3 w-full transition-all duration-200 relative group ${data.archived ? 'opacity-90 border-dashed border-slate-300' : ''}`}>
      <div className="relative pr-16">
        <input type="text" value={data.title} onChange={(e) => onUpdate({ ...data, title: e.target.value })} className="text-lg font-bold text-slate-800 w-full border-b border-transparent focus:border-blue-500 outline-none placeholder-slate-400 bg-transparent" placeholder={t.accountName} disabled={data.archived} />
        <div className="absolute -top-1 -right-2 flex gap-1 z-10">
          <button type="button" onClick={() => onArchive(data.id)} className={`rounded-full p-2 transition-all ${data.archived ? 'text-blue-500 hover:bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`} title={data.archived ? t.unarchive : t.archive}>
            {data.archived ? <ArchiveRestore size={18} /> : <Archive size={18} />}
          </button>
          <button type="button" onClick={() => onDeleteRequest(data.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition-all" title={t.deleteAccount}><X size={18} /></button>
        </div>
      </div>
      <div className={data.archived ? 'pointer-events-none grayscale-[0.5]' : ''}>
        <TAccountVisual entries={data.entries} onDeleteEntry={handleDeleteEntry} lang={lang} t={t} />
        <div className={`flex justify-between items-center p-2 rounded-lg border text-sm font-bold ${totals.balance >= 0 ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          <span className="text-xs uppercase tracking-wider opacity-80">{totals.balance >= 0 ? t.debitBalance : t.creditBalance}</span>
          <span className="text-base">{formatCurrency(Math.abs(totals.balance), lang)}</span>
        </div>
      </div>
      {!data.archived && (
        <div className="flex flex-col gap-2 mt-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-2 top-2 text-blue-300 text-xs font-bold pointer-events-none">D</span>
              <input id={`debit-${data.id}`} type="number" step="0.01" value={inputs.debit} onChange={(e) => setInputs({ ...inputs, debit: e.target.value })} onKeyDown={handleKeyDown} className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded text-sm text-blue-700 font-semibold focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" placeholder="0,00" />
            </div>
            <div className="relative">
              <span className="absolute left-2 top-2 text-red-300 text-xs font-bold pointer-events-none">C</span>
              <input type="number" step="0.01" value={inputs.credit} onChange={(e) => setInputs({ ...inputs, credit: e.target.value })} onKeyDown={handleKeyDown} className="w-full pl-6 pr-2 py-2 border border-slate-200 rounded text-sm text-red-700 font-semibold focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all" placeholder="0,00" />
            </div>
          </div>
          <div className="flex gap-2">
            <input type="date" value={inputs.date} onChange={(e) => setInputs({ ...inputs, date: e.target.value })} className="w-1/3 px-2 py-2 border border-slate-200 rounded text-sm focus:border-blue-400 outline-none text-slate-600" title={t.date} />
            <input type="text" value={inputs.ref} onChange={(e) => setInputs({ ...inputs, ref: e.target.value })} onKeyDown={handleKeyDown} className="w-1/3 px-3 py-2 border border-slate-200 rounded text-sm focus:border-blue-400 outline-none" placeholder={t.ref} />
            <button onClick={handleAddEntry} className="w-1/3 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-1">{t.addEntry}</button>
          </div>
        </div>
      )}
      <textarea value={data.comment} onChange={(e) => onUpdate({ ...data, comment: e.target.value })} className="w-full text-xs p-2 border border-slate-200 rounded resize-y min-h-[40px] bg-slate-50 focus:bg-white focus:border-blue-400 outline-none transition-colors" placeholder={t.notes} disabled={data.archived} />
    </div>
  );
};

const TrialBalanceModal = ({ isOpen, onClose, razonetes, lang, t, projectName }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      sendGAEvent('view_item_list', { item_list_name: 'balancete_verificacao', item_list_id: 'report_trial_balance' });
    }
  }, [isOpen]);

  const reportData = useMemo(() => {
    if (!isOpen) return [];
    return razonetes.map(r => {
      const filteredEntries = r.entries.filter(entry => {
        if (!entry.date) return true;
        const entryDate = entry.date;
        const start = startDate ? startDate : '0000-01-01';
        const end = endDate ? endDate : '9999-12-31';
        return entryDate >= start && entryDate <= end;
      });
      const totalD = filteredEntries.filter(e => e.type === 'DEBIT').reduce((acc, c) => acc + c.value, 0);
      const totalC = filteredEntries.filter(e => e.type === 'CREDIT').reduce((acc, c) => acc + c.value, 0);
      const balance = totalD - totalC;
      return { id: r.id, title: r.title || 'Conta sem nome', debitBalance: balance > 0 ? balance : 0, creditBalance: balance < 0 ? Math.abs(balance) : 0 };
    }).sort((a, b) => a.title.localeCompare(b.title));
  }, [razonetes, startDate, endDate, isOpen]);

  const totals = useMemo(() => {
    return reportData.reduce((acc, curr) => ({ debit: acc.debit + curr.debitBalance, credit: acc.credit + curr.creditBalance }), { debit: 0, credit: 0 });
  }, [reportData]);

  if (!isOpen) return null;
  const isBalanced = Math.abs(totals.debit - totals.credit) < 0.01;

  const exportToExcel = () => {
    sendGAEvent('file_download', { file_extension: 'csv_excel', file_name: 'balancete', project: projectName });
    let csv = "data:text/csv;charset=utf-8,\uFEFF";
    csv += `${t.projects}: ${projectName}\n`;
    csv += `${t.period}: ${startDate || 'Inicio'} - ${endDate || 'Hoje'}\n`; 
    csv += `${t.tableAccounts};${t.tableDebit};${t.tableCredit}\n`;
    reportData.forEach(row => {
        const debit = row.debitBalance > 0 ? row.debitBalance.toFixed(2).replace('.', ',') : '0,00';
        const credit = row.creditBalance > 0 ? row.creditBalance.toFixed(2).replace('.', ',') : '0,00';
        csv += `"${row.title}";${debit};${credit}\n`;
    });
    csv += `${t.totals};${totals.debit.toFixed(2).replace('.', ',')};${totals.credit.toFixed(2).replace('.', ',')}\n`;
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `balancete_${projectName.replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col gap-4 bg-slate-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg"><ClipboardList size={24} /></div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{t.trialBalanceTitle}</h2>
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-slate-500">{t.trialBalanceSubtitle}</p>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-medium">{projectName}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} className="text-slate-500" /></button>
          </div>
          <div className="flex flex-wrap gap-4 items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600"><Calendar size={18} /><span className="font-semibold text-sm">{t.period}:</span></div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col"><label className="text-[10px] text-slate-400 font-bold uppercase">{t.startDate}</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-sm text-slate-700 outline-none focus:border-blue-500" /></div>
              <span className="text-slate-400 mt-3">→</span>
              <div className="flex flex-col"><label className="text-[10px] text-slate-400 font-bold uppercase">{t.endDate}</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-sm text-slate-700 outline-none focus:border-blue-500" /></div>
            </div>
            {(startDate || endDate) && (<button onClick={() => { setStartDate(''); setEndDate(''); }} className="ml-auto text-xs text-red-500 hover:text-red-700 hover:underline mt-3">{t.clearAll}</button>)}
          </div>
        </div>
        <div className="overflow-auto p-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-300"><th className="py-3 px-4 text-left w-1/2">{t.tableAccounts}</th><th className="py-3 px-4 text-right w-1/4 text-blue-700">{t.tableDebit}</th><th className="py-3 px-4 text-right w-1/4 text-red-700">{t.tableCredit}</th></tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="py-3 px-4 font-medium text-slate-700">{row.title}</td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-600 font-medium">{row.debitBalance > 0 ? formatNumber(row.debitBalance, lang) : '-'}</td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-600 font-medium">{row.creditBalance > 0 ? formatNumber(row.creditBalance, lang) : '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-base"><td className="py-4 px-4 text-slate-800">{t.totals}</td><td className="py-4 px-4 text-right text-blue-700 tabular-nums">{formatNumber(totals.debit, lang)}</td><td className="py-4 px-4 text-right text-red-700 tabular-nums">{formatNumber(totals.credit, lang)}</td></tr>
            </tfoot>
          </table>
          <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 border ${isBalanced ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {isBalanced ? (<><CheckCircle size={24} /><div><p className="font-bold">{t.balanced}</p><p className="text-sm opacity-90">{t.balancedMsg}</p></div></>) : (<><AlertTriangle size={24} /><div><p className="font-bold">{t.unbalanced}</p><p className="text-sm opacity-90">{t.unbalancedMsg.replace('{diff}', formatCurrency(Math.abs(totals.debit - totals.credit), lang))}</p></div></>)}
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
          <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition shadow-sm active:scale-95"><FileSpreadsheet size={16} />{t.exportExcel}</button>
          <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition">{t.close}</button>
        </div>
      </div>
    </div>
  );
};

const DonationModal = ({ isOpen, onClose, t }) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (isOpen) {
      sendGAEvent('begin_checkout', { items: [{ name: 'Doacao Pix' }] });
    }
  }, [isOpen]);

  if (!isOpen) return null;
  const handleCopy = () => { 
    navigator.clipboard.writeText(PIX_KEY); 
    setCopied(true); 
    sendGAEvent('select_content', { content_type: 'pix_key', item_id: 'copy_button' });
    setTimeout(() => setCopied(false), 2000); 
  };
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <div className="h-32 bg-gradient-to-br from-amber-400 to-orange-500 relative flex items-center justify-center">
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm shadow-inner"><Coffee size={48} className="text-white" /></div>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition"><X size={20} /></button>
        </div>
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{t.supportTitle}</h3>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">{t.supportDesc}</p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <div className="flex justify-center mb-4"><div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100"><img src={QR_CODE_URL} alt="QR Code Pix" className="w-40 h-40 mix-blend-multiply" /></div></div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.pixKey}</p>
              <div className="flex gap-2">
                <input type="text" value={PIX_KEY} readOnly className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 font-mono outline-none" />
                <button onClick={handleCopy} className={`px-3 py-2 rounded border transition-all flex items-center gap-2 font-medium text-sm ${copied ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? t.copied : t.copy}</button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">{t.bankName}</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-left flex gap-3">
            <div className="flex-shrink-0 text-amber-500 mt-0.5"><Linkedin size={20} /></div>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">{t.bonusText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectManager = ({ projects, currentProjectId, onChangeProject, onCreateProject, onDeleteProject, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];

  const handleCreate = () => {
    if (newProjectName.trim()) {
      sendGAEvent('create_group', { group_name: 'project' });
      onCreateProject(newProjectName);
      setNewProjectName('');
      setIsCreating(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-sm w-full md:w-auto justify-between min-w-[200px]">
        <div className="flex items-center gap-2 truncate">
          <Folder size={18} className="text-blue-600" />
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.projects}</span>
            <span className="font-semibold text-slate-700 truncate max-w-[150px]">{currentProject?.name}</span>
          </div>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            {!isCreating ? (
              <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition"><FolderPlus size={16} />{t.newProject}</button>
            ) : (
              <div className="flex flex-col gap-2 p-1">
                <input type="text" autoFocus placeholder={t.projectNamePlaceholder} value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
                <div className="flex gap-2"><button onClick={handleCreate} className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700">{t.create}</button><button onClick={() => setIsCreating(false)} className="flex-1 bg-slate-200 text-slate-600 text-xs py-1.5 rounded hover:bg-slate-300">{t.cancel}</button></div>
              </div>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {projects.map(project => (
              <div key={project.id} className="group flex items-center justify-between px-2 py-1 hover:bg-slate-50">
                <button onClick={() => { onChangeProject(project.id); setIsOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition text-left ${currentProjectId === project.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'}`}>
                  <Folder size={16} className={currentProjectId === project.id ? 'fill-blue-200' : ''} /><span className="truncate">{project.name}</span>{currentProjectId === project.id && <Check size={14} className="ml-auto" />}
                </button>
                {project.id !== 'default' && (
                  <button onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition" title={t.deleteProject}><Trash2 size={14} /></button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
};

// --- MENU DE MAIS OPÇÕES E AUTH ---
const MoreOptionsMenu = ({ onExport, onClear, onChangeLang, currentLang, t, user, onLogin, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition" title={t.moreOptions}><MoreHorizontal size={20} /></button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="py-1">
            {/* Seção de Login / Perfil */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-slate-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">{user.email?.[0]?.toUpperCase()}</div>
                    )}
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-bold text-slate-700 truncate">{user.displayName || 'Usuário'}</span>
                      <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
                    </div>
                  </div>
                  <button onClick={() => { onLogout(); setIsOpen(false); }} className="text-xs flex items-center gap-1 text-red-600 hover:text-red-800 hover:underline"><LogOut size={12} /> {t.logout}</button>
                </div>
              ) : (
                <button onClick={() => { onLogin(); setIsOpen(false); }} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm"><LogIn size={14} /> {t.login}</button>
              )}
            </div>

            <div className="px-4 py-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{t.language}</span>
              <div className="flex gap-1">
                {['pt', 'en', 'es'].map(lang => (
                  <button key={lang} onClick={() => { onChangeLang(lang); sendGAEvent('select_content', { content_type: 'language', item_id: lang }); setIsOpen(false); }} className={`flex-1 text-xs py-1 rounded border ${currentLang === lang ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{lang.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <button onClick={() => { onExport(); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"><Download size={16} /> {t.export}</button>
            <button onClick={() => { onClear(); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Eraser size={16} /> {t.clearAll}</button>
          </div>
        </div>
      )}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
};

const App = () => {
  const [razonetes, setRazonetes] = useState([]);
  const [projects, setProjects] = useState([{ id: 'default', name: 'Geral (Principal)' }]);
  const [currentProjectId, setCurrentProjectId] = useState('default');
  const [isTrialBalanceOpen, setIsTrialBalanceOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false); 
  const [currentLang, setCurrentLang] = useState('pt');
  const [showArchived, setShowArchived] = useState(false); 
  const t = TRANSLATIONS[currentLang];
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, targetId: null });
  const [deleteProjectModal, setDeleteProjectModal] = useState({ isOpen: false, projectId: null });
  
  // Auth State
  const [user, setUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  // Novo Estado: Controla erro de gravação
  const [saveError, setSaveError] = useState(false);

  // Monitorar Autenticação
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && db) {
        setIsSyncing(true);
        setSaveError(false); // Reseta erro ao logar
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.projects) setProjects(data.projects);
            if (data.razonetes) setRazonetes(data.razonetes);
          } else {
            // Primeiro login: Salva o estado local na nuvem
            await setDoc(userDocRef, {
              projects: projects,
              razonetes: razonetes,
              lastUpdate: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Erro ao sincronizar login:", error);
          setSaveError(true);
        } finally {
          setIsSyncing(false);
        }
      }
    });
    return () => unsubscribe();
  }, []); // Executa uma vez no mount para configurar o listener

  // Load Inicial (Local Storage) - Só roda se NÃO estiver logado ou antes do auth
  useEffect(() => {
    // Se estiver logado, o onAuthStateChanged cuida dos dados.
    // Se não, carregamos do localStorage.
    if (!user) {
      const savedProjects = localStorage.getItem('razonetes_projects_v1');
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedRazonetes = localStorage.getItem('razonetes_react_v1');
      if (savedRazonetes) {
        let parsedData = JSON.parse(savedRazonetes);
        const today = new Date().toISOString().split('T')[0];
        let hasChanges = false;
        const migratedData = parsedData.map(r => {
          let updatedR = { ...r };
          updatedR.entries = r.entries.map(e => {
            if (!e.date) { hasChanges = true; return { ...e, date: today }; }
            return e;
          });
          if (!updatedR.projectId) { updatedR.projectId = 'default'; hasChanges = true; }
          return updatedR;
        });
        setRazonetes(migratedData);
        if (hasChanges) localStorage.setItem('razonetes_react_v1', JSON.stringify(migratedData));
      } else {
        // Dados Demo
        setRazonetes([
          { id: 'demo-1', projectId: 'default', title: 'Caixa (Ativo)', entries: [{ id: 'e1', type: 'DEBIT', value: 1000, ref: 'Cap. Social', date: new Date().toISOString().split('T')[0] }, { id: 'e2', type: 'CREDIT', value: 200, ref: 'Mat. Escrit.', date: new Date().toISOString().split('T')[0] }], comment: 'Disponibilidade imediata.', archived: false },
          { id: 'demo-2', projectId: 'default', title: 'Capital Social (PL)', entries: [{ id: 'e3', type: 'CREDIT', value: 1000, ref: 'Integralização', date: new Date().toISOString().split('T')[0] }], comment: 'Capital dos sócios.', archived: false }
        ]);
      }
    }
  }, [user]);

  // Persistência Unificada (Local + Cloud)
  useEffect(() => {
    // 1. Sempre salva localmente (Backup/Offline)
    localStorage.setItem('razonetes_react_v1', JSON.stringify(razonetes));
    localStorage.setItem('razonetes_projects_v1', JSON.stringify(projects));

    // 2. Se logado, salva na nuvem (Debounce simples para evitar muitas escritas)
    if (user && db) {
      const saveToCloud = async () => {
        setIsSyncing(true); // Indica que começou a salvar
        try {
          await setDoc(doc(db, "users", user.uid), {
            projects,
            razonetes,
            lastUpdate: new Date().toISOString(),
            email: user.email // Útil para contato se permitido
          }, { merge: true });
          setSaveError(false); // Sucesso
        } catch (e) {
          console.error("Erro ao salvar na nuvem", e);
          setSaveError(true); // Ativa o alerta vermelho
        } finally {
           // Pequeno delay para mostrar o ícone de salvamento
           setTimeout(() => setIsSyncing(false), 500);
        }
      };
      
      const timeoutId = setTimeout(saveToCloud, 2000); // Espera 2s após última mudança
      return () => clearTimeout(timeoutId);
    }
  }, [razonetes, projects, user]);

  const handleLogin = async () => {
    if (!auth) return;
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      sendGAEvent('login', { method: 'google' });
    } catch (error) {
      console.error("Login failed", error);
      alert(`Erro no Login: ${error.code} - ${error.message}`);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      // Limpa estado ou recarrega do local?
      // O useEffect do LocalStorage vai rodar quando user for null? Não automaticamente pois user é dependência.
      // Melhor recarregar a página para garantir estado limpo do local storage
      window.location.reload(); 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const currentProjectRazonetes = useMemo(() => {
    return razonetes.filter(r => r.projectId === currentProjectId); 
  }, [razonetes, currentProjectId]);

  const visibleRazonetes = useMemo(() => {
    return currentProjectRazonetes.filter(r => showArchived ? r.archived : !r.archived);
  }, [currentProjectRazonetes, showArchived]);

  const globalStatus = useMemo(() => {
    let totalD = 0;
    let totalC = 0;
    visibleRazonetes.forEach(r => {
      totalD += r.entries.filter(e => e.type === 'DEBIT').reduce((acc, c) => acc + c.value, 0);
      totalC += r.entries.filter(e => e.type === 'CREDIT').reduce((acc, c) => acc + c.value, 0);
    });
    return { totalD, totalC, diff: totalD - totalC, isBalanced: Math.abs(totalD - totalC) < 0.01 };
  }, [visibleRazonetes]);

  const handleCreateProject = (name) => {
    const newProject = { id: crypto.randomUUID(), name };
    setProjects([...projects, newProject]);
    setCurrentProjectId(newProject.id);
    sendGAEvent('create_group', { group_name: 'project' });
  };

  const handleDeleteProjectRequest = (projectId) => { setDeleteProjectModal({ isOpen: true, projectId }); };

  const confirmDeleteProject = () => {
    const pid = deleteProjectModal.projectId;
    if (pid) {
      setProjects(projects.filter(p => p.id !== pid));
      setRazonetes(razonetes.filter(r => r.projectId !== pid));
      if (currentProjectId === pid) setCurrentProjectId('default');
    }
    setDeleteProjectModal({ isOpen: false, projectId: null });
  };

  const addRazonete = () => {
    if (showArchived) setShowArchived(false);
    sendGAEvent('create_item', { item_category: 'razonete', project_id: currentProjectId });
    setRazonetes([...razonetes, { id: crypto.randomUUID(), projectId: currentProjectId, title: '', entries: [], comment: '', archived: false }]);
  };

  const updateRazonete = (updatedRazonete) => { setRazonetes(razonetes.map(r => r.id === updatedRazonete.id ? updatedRazonete : r)); };
  
  const toggleArchive = (id) => {
    sendGAEvent('archive_content', { content_type: 'razonete', item_id: id });
    setRazonetes(razonetes.map(r => r.id === id ? { ...r, archived: !r.archived } : r)); 
  };
  
  const requestDelete = (id) => { setConfirmModal({ isOpen: true, type: 'SINGLE', targetId: id }); };
  const requestClearAll = () => { setConfirmModal({ isOpen: true, type: 'ALL', targetId: null }); };

  const confirmAction = () => {
    if (confirmModal.type === 'SINGLE' && confirmModal.targetId) {
      setRazonetes(razonetes.filter(r => r.id !== confirmModal.targetId));
    } else if (confirmModal.type === 'ALL') {
      const idsToDelete = visibleRazonetes.map(r => r.id);
      setRazonetes(razonetes.filter(r => !idsToDelete.includes(r.id)));
    }
    setConfirmModal({ isOpen: false, type: null, targetId: null });
  };

  const exportCSV = () => {
    sendGAEvent('file_download', { file_extension: 'csv', file_name: 'exportacao_dados', project: projects.find(p => p.id === currentProjectId)?.name });
    let csv = "data:text/csv;charset=utf-8,\uFEFF";
    const currentProjectName = projects.find(p => p.id === currentProjectId)?.name || 'Projeto';
    csv += `Projeto;ID_${t.accountName};${t.accountName};Status;${t.nature};${t.type};${t.value};${t.ref};${t.date};Nota\n`;
    const projectRazonetes = razonetes.filter(r => r.projectId === currentProjectId);
    projectRazonetes.forEach(r => {
      r.entries.forEach(e => {
        const row = [
          `"${currentProjectName}"`,
          r.id,
          `"${r.title}"`,
          r.archived ? 'Arquivado' : 'Ativo',
          e.type === 'DEBIT' ? t.debtor : t.creditor,
          e.type === 'DEBIT' ? 'Debito' : 'Credito', 
          e.value.toFixed(2).replace('.', ','),
          `"${e.ref}"`,
          e.date || '', 
          `"${r.comment.replace(/\n/g, ' ')}"`
        ];
        csv += row.join(";") + "\n";
      });
    });
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `razonetes_${currentProjectName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4 flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="flex items-center gap-3">
              <div className={`text-white p-2 rounded-lg shadow-lg transition-colors ${showArchived ? 'bg-slate-600 shadow-slate-200' : 'bg-blue-600 shadow-blue-200'}`}>
                {showArchived ? <Archive size={24} /> : <Scale size={24} weight="bold" />}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">
                  {t.appTitle} {showArchived && <span className="text-slate-400 text-sm font-normal">({t.archivedView})</span>}
                </h1>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  {t.appSubtitle}
                  {/* Indicador de Status da Nuvem */}
                  {user ? (
                    saveError ? (
                      <span className="ml-2 flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200" title={t.cloudError}>
                        <CloudAlert size={10} /> {t.cloudError}
                      </span>
                    ) : (
                      <span className={`ml-2 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${isSyncing ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                        <Cloud size={10} /> {isSyncing ? t.syncing : t.cloudStorage}
                      </span>
                    )
                  ) : (
                    <span className="ml-2 flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                      <CloudOff size={10} /> {t.localStorage}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="hidden md:block h-8 w-px bg-slate-200 mx-2"></div>
            <ProjectManager projects={projects} currentProjectId={currentProjectId} onChangeProject={setCurrentProjectId} onCreateProject={handleCreateProject} onDeleteProject={handleDeleteProjectRequest} t={t} />
          </div>

          <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-sm transition-colors ${globalStatus.isBalanced ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {globalStatus.isBalanced ? (
              <><CheckCircle size={18} /><span>{t.doubleEntryOk}</span></>
            ) : (
              <><AlertTriangle size={18} /><span>{t.discrepancy}: {formatCurrency(globalStatus.diff, currentLang)}</span></>
            )}
            <span className="ml-1 text-xs opacity-60 font-normal border-l border-current pl-2">
              {projects.find(p => p.id === currentProjectId)?.name}
            </span>
          </div>

          <div className="flex gap-2 items-center flex-wrap justify-end">
            <button onClick={() => setIsDonationOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 text-sm font-semibold rounded-lg hover:bg-amber-200 transition shadow-sm border border-amber-200">
              <Coffee size={16} /> 
              <span className="hidden sm:inline">{t.supportProject}</span>
            </button>

            <button onClick={() => setShowArchived(!showArchived)} className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition shadow-sm active:scale-95 ${showArchived ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
              {showArchived ? <Scale size={16} /> : <Archive size={16} />} 
              {showArchived ? t.showActive : t.showArchived}
            </button>

            <button onClick={addRazonete} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm active:scale-95 shadow-blue-600/20">
              <Plus size={16} /> <span className="hidden sm:inline">{t.newAccount}</span>
            </button>
            
            <button onClick={() => setIsTrialBalanceOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-900 transition shadow-sm active:scale-95">
              <ClipboardList size={16} /> <span className="hidden sm:inline">{t.trialBalance}</span>
            </button>

            <MoreOptionsMenu 
              onExport={exportCSV} 
              onClear={requestClearAll} 
              onChangeLang={setCurrentLang} 
              currentLang={currentLang} 
              t={t}
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-6">
        {visibleRazonetes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-50">
            {showArchived ? <Archive size={64} className="text-slate-300 mb-4" /> : <Scale size={64} className="text-slate-300 mb-4" />}
            <h3 className="text-xl font-medium text-slate-500">{showArchived ? t.emptyArchived : t.emptyWorkspace}</h3>
            <p className="text-slate-400">{showArchived ? '' : t.startAdding}<br/><span className="text-xs opacity-70 mt-2 block">Projeto Atual: {projects.find(p => p.id === currentProjectId)?.name}</span></p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 items-start">
            {visibleRazonetes.map(razonete => (
              <RazoneteCard key={razonete.id} data={razonete} onUpdate={updateRazonete} onDeleteRequest={requestDelete} onArchive={toggleArchive} lang={currentLang} t={t} />
            ))}
          </div>
        )}
      </main>

      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} t={t} />
      <TrialBalanceModal isOpen={isTrialBalanceOpen} onClose={() => setIsTrialBalanceOpen(false)} razonetes={visibleRazonetes} lang={currentLang} t={t} projectName={projects.find(p => p.id === currentProjectId)?.name || 'Geral'} />

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-amber-500 mb-4"><AlertTriangle size={24} /><h3 className="text-lg font-bold text-slate-800">{t.confirmation}</h3></div>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">{confirmModal.type === 'ALL' ? t.confirmDeleteAll : t.confirmDeleteOne}</p>
            <div className="flex justify-end gap-3"><button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition">{t.cancel}</button><button onClick={confirmAction} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-600/20">{confirmModal.type === 'ALL' ? t.deleteAll : t.delete}</button></div>
          </div>
        </div>
      )}

      {deleteProjectModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200 border-2 border-red-100">
            <div className="flex items-center gap-3 text-red-500 mb-4"><AlertTriangle size={24} /><h3 className="text-lg font-bold text-slate-800">{t.deleteProject}</h3></div>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">{t.confirmDeleteProject}</p>
            <div className="flex justify-end gap-3"><button onClick={() => setDeleteProjectModal({ isOpen: false, projectId: null })} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition">{t.cancel}</button><button onClick={confirmDeleteProject} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-lg shadow-red-600/20">{t.delete}</button></div>
          </div>
        </div>
      )}

      {/* TRACKING: Link de Perfil no Footer */}
      <footer className="w-full text-center py-8 text-slate-400 text-sm mt-12 border-t border-slate-100">
        <div className="flex flex-col items-center gap-2">
          <p className="flex items-center gap-1.5">{t.developedBy} <span className="font-bold text-slate-600">Tiago de Amorim Silva</span><span className="text-slate-300">•</span><span className="text-slate-500">{t.role}</span></p>
          <a 
            href="https://linkedin.com/in/tiagodeamorimsilva" 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => sendGAEvent('generate_lead', { source: 'footer_link', type: 'linkedin' })}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
          >
            <Linkedin size={14} />
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;

import { Board } from "@/components/board/Board";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <h1 className="text-xl font-bold text-slate-900">KanbanFlow</h1>
        <div className="hidden items-center gap-3 text-xs text-slate-400 sm:flex">
          <span><kbd className="rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">N</kbd> New card</span>
          <span><kbd className="ml-0.5 rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">1</kbd><kbd className="ml-0.5 rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">2</kbd><kbd className="ml-0.5 rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">3</kbd> Focus column</span>
          <span><kbd className="rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">Esc</kbd> Close</span>
        </div>
      </header>
      <Board />
    </div>
  );
}

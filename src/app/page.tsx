import { Board } from "@/components/board/Board";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <h1 className="text-xl font-bold text-slate-900">KanbanFlow</h1>
      </header>
      <Board />
    </div>
  );
}

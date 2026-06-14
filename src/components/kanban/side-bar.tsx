export function Sidebar() {
  const lockedItems = ["Projetos", "Equipe", "Relatórios", "Configurações"];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900 p-6">
      <h1 className="text-xl font-bold">Kanplan Light</h1>
      <p className="mt-1 text-sm text-slate-400">Gestão para PMEs</p>

      <nav className="mt-8 space-y-2 text-sm">
        <a className="block rounded-lg bg-slate-800 px-3 py-2 text-white">
          Kanban
        </a>

        <div className="my-4 border-t border-slate-800" />

        {lockedItems.map((item) => (
          <div
            key={item}
            className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-slate-600"
          >
            <span>{item}</span>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">
              Light
            </span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
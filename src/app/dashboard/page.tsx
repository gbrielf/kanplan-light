"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/kanban/side-bar";
import { KpiCard } from "@/components/kanban/kpi-card";

type MemberStatus = "IDLE" | "HEALTHY" | "ATTENTION" | "OVERLOADED";
type ProjectStatus = "PLANNING" | "ACTIVE" | "AT_RISK" | "COMPLETED";

type MemberCapacity = {
  id: string;
  name: string;
  role: string | null;
  activeTasks: number;
  overdueTasks: number;
  capacityScore: number;
  status: MemberStatus;
};

type DashboardTask = {
  id: string;
  title: string;
  priority: string;
  status: string;
  dueDate: string;
  project: {
    name: string;
  };
  assignee: {
    id: string;
    name: string;
  };
};

type DashboardProject = {
  id: string;
  name: string;
  status: ProjectStatus;
  priority: string;
  dueDate: string;
  tasks: Array<{
    id: string;
    status: string;
    dueDate: string;
  }>;
};

type DashboardData = {
  kpis: {
    totalProjects: number;
    totalTasks: number;
    overdueTasks: number;
    tasksAtRisk: number;
    overloadedMembers: number;
    idleMembers: number;
    completedThisWeek: number;
    averageCompletionTimeInDays: number;
  };
  health: {
    overdueTasks: DashboardTask[];
    tasksAtRisk: DashboardTask[];
    overloadedMembers: MemberCapacity[];
    idleMembers: MemberCapacity[];
  };
  membersCapacity: MemberCapacity[];
  projects: DashboardProject[];
  tasks: DashboardTask[];
  members: {
    id: string;
    name: string;
  }[];
};

const memberStatusLabel: Record<MemberStatus, string> = {
  IDLE: "Ocioso",
  HEALTHY: "Saudável",
  ATTENTION: "Atenção",
  OVERLOADED: "Sobrecarregado",
};

const memberStatusClass: Record<MemberStatus, string> = {
  IDLE: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
  HEALTHY: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  ATTENTION: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  OVERLOADED: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
};

const projectStatusLabel: Record<ProjectStatus, string> = {
  PLANNING: "Planejamento",
  ACTIVE: "Ativo",
  AT_RISK: "Em risco",
  COMPLETED: "Concluído",
};

const projectStatusClass: Record<ProjectStatus, string> = {
  PLANNING: "bg-violet-500/10 text-violet-400",
  ACTIVE: "bg-emerald-500/10 text-emerald-400",
  AT_RISK: "bg-rose-500/10 text-rose-400",
  COMPLETED: "bg-zinc-500/10 text-zinc-400",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const response = await fetch("/api/dashboard");
    const dashboard = await response.json();
    setData(dashboard);
  }

  return (
    <main className="h-screen overflow-hidden bg-[#080808] text-white">
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="shrink-0 border-b border-white/5 bg-[#0C0C0C] px-8 py-6">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-zinc-600">
              Painel gerencial
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Números para o Ricardo sair da reunião de segunda-feira com
              clareza sobre prazos, capacidade do time e prioridades.
            </p>
          </header>

          <div className="custom-scrollbar flex-1 overflow-auto p-8">
            {!data ? (
              <div className="flex items-center gap-3 text-sm text-zinc-600">
                <div className="h-1 w-1 animate-pulse rounded-full bg-zinc-600" />
                Carregando dashboard…
              </div>
            ) : (
              <div className="space-y-6">
                {/* KPI Strip */}
                <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <KpiCard
                    title="Tarefas atrasadas"
                    value={data.kpis.overdueTasks}
                    description="exigem ação imediata"
                    variant="danger"
                  />
                  <KpiCard
                    title="Prazos em risco"
                    value={data.kpis.tasksAtRisk}
                    description="vencem em até 48h"
                    variant="warning"
                  />
                  <KpiCard
                    title="Sobrecarga"
                    value={data.kpis.overloadedMembers}
                    description="membros afogados"
                    variant="info"
                  />
                  <KpiCard
                    title="Ociosos"
                    value={data.kpis.idleMembers}
                    description="capacidade disponível"
                    variant="neutral"
                  />
                  <KpiCard
                    title="Concluídas"
                    value={data.kpis.completedThisWeek}
                    description="na semana"
                    variant="success"
                  />
                </section>

                {/* Main grid */}
                <section className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
                  {/* Team capacity */}
                  <div className="rounded-2xl border border-white/5 bg-[#0F0F0F] p-6">
                    <div className="mb-6 flex items-start justify-between">
                      <div>
                        <h2 className="text-base font-semibold text-white">
                          Capacidade da equipe
                        </h2>
                        <p className="mt-0.5 text-sm text-zinc-600">
                          Quem está sobrecarregado, saudável ou ocioso.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {data.membersCapacity.map((member) => {
                        const memberTasks = data.tasks.filter(
                          (task) =>
                            task.assignee.id === member.id &&
                            task.status !== "DONE"
                        );
                        const isExpanded = expandedMemberId === member.id;

                        return (
                          <div
                            key={member.id}
                            className="rounded-xl border border-white/5 bg-[#141414] transition-colors hover:border-white/10"
                          >
                            <div className="grid items-center gap-4 p-4 md:grid-cols-[1.4fr_0.9fr_1fr_auto]">
                              {/* Name */}
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {member.name}
                                </p>
                                <p className="mt-0.5 text-xs text-zinc-600">
                                  {member.role ?? "Sem função"}
                                </p>
                              </div>

                              {/* Tasks count */}
                              <div className="space-y-0.5 text-xs text-zinc-500">
                                <p>
                                  <span className="font-medium text-zinc-300">
                                    {member.activeTasks}
                                  </span>{" "}
                                  tarefas ativas
                                </p>
                                <p>
                                  <span className="font-medium text-rose-400">
                                    {member.overdueTasks}
                                  </span>{" "}
                                  atrasadas
                                </p>
                              </div>

                              {/* Score bar */}
                              <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                  <span className="text-xs text-zinc-600">
                                    Carga
                                  </span>
                                  <span className="text-xs font-medium text-zinc-400">
                                    {member.capacityScore}
                                  </span>
                                </div>
                                <div className="h-1 rounded-full bg-white/5">
                                  <div
                                    className="h-1 rounded-full bg-white/60 transition-all"
                                    style={{
                                      width: `${Math.min(
                                        member.capacityScore * 10,
                                        100
                                      )}%`,
                                    }}
                                  />
                                </div>
                                <span
                                  className={`mt-2.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${memberStatusClass[member.status]}`}
                                >
                                  {memberStatusLabel[member.status]}
                                </span>
                              </div>

                              {/* Toggle */}
                              <button
                                onClick={() =>
                                  setExpandedMemberId(
                                    isExpanded ? null : member.id
                                  )
                                }
                                className="rounded-lg border border-white/8 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-white/20 hover:text-white"
                              >
                                {isExpanded ? "Ocultar" : "Ver tarefas"}
                              </button>
                            </div>

                            {/* Expanded tasks */}
                            {isExpanded && (
                              <div className="border-t border-white/5 p-4 pt-4">
                                {memberTasks.length === 0 ? (
                                  <p className="text-xs text-zinc-600">
                                    Nenhuma tarefa ativa atribuída a este
                                    membro.
                                  </p>
                                ) : (
                                  <div className="grid gap-2.5 md:grid-cols-2">
                                    {memberTasks.map((task) => (
                                      <div
                                        key={task.id}
                                        className="rounded-xl border border-white/5 bg-[#0C0C0C] p-3.5"
                                      >
                                        <p className="mb-3 text-sm font-medium leading-snug text-white">
                                          {task.title}
                                        </p>

                                        <div>
                                          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                                            Responsável
                                          </label>
                                          <select
                                            value={task.assignee.id}
                                            onChange={async (event) => {
                                              await fetch(
                                                `/api/tasks/${task.id}`,
                                                {
                                                  method: "PATCH",
                                                  headers: {
                                                    "Content-Type":
                                                      "application/json",
                                                  },
                                                  body: JSON.stringify({
                                                    assigneeId:
                                                      event.target.value,
                                                  }),
                                                }
                                              );
                                              loadDashboard();
                                            }}
                                            className="w-full rounded-lg border border-white/8 bg-[#141414] px-2.5 py-1.5 text-xs text-white transition hover:border-white/20 focus:outline-none"
                                          >
                                            {data.members.map((m) => (
                                              <option key={m.id} value={m.id}>
                                                {m.name}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        <p className="mt-3 text-xs font-semibold text-zinc-300">
                                          {task.project.name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-zinc-600">
                                          {task.status} ·{" "}
                                          {formatDate(task.dueDate)}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right column: overdue + at-risk */}
                  <div className="space-y-5">
                    {/* Overdue */}
                    <div className="rounded-2xl border border-white/5 bg-[#0F0F0F] p-6">
                      <h2 className="text-base font-semibold text-white">
                        Prazos estourados
                      </h2>
                      <p className="mb-4 mt-0.5 text-xs text-rose-400/80">
                        O que o Ricardo precisa cobrar hoje.
                      </p>

                      <div className="space-y-2">
                        {data.health.overdueTasks.slice(0, 4).map((task) => (
                          <div
                            key={task.id}
                            className="rounded-xl border border-rose-500/10 bg-black/15 p-3 transition hover:border-rose-400/20 hover:bg-rose-500/8"
                          >
                            <p className="text-sm font-medium leading-snug text-white">
                              {task.title}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                              {task.project.name} · {task.assignee.name}
                            </p>
                            <p className="mt-1.5 text-xs font-medium text-rose-400">
                              Venceu em {formatDate(task.dueDate)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* At risk */}
                    <div className="rounded-2xl border border-white/5 bg-[#0F0F0F] p-6">
                      <h2 className="text-base font-semibold text-white">
                        Alertas preventivos
                      </h2>
                      <p className="mb-4 mt-0.5 text-xs text-amber-400/80">
                        Tarefas que vencem nas próximas 48h.
                      </p>

                      <div className="space-y-2">
                        {data.health.tasksAtRisk.slice(0, 4).map((task) => (
                          <div
                            key={task.id}
                            className="rounded-xl border border-amber-500/10 bg-black/15 p-3 transition hover:border-amber-400/20 hover:bg-amber-500/8"
                          >
                            <p className="text-sm font-medium leading-snug text-white">
                              {task.title}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                              {task.project.name} · {task.assignee.name}
                            </p>
                            <p className="mt-1.5 text-xs font-medium text-amber-400">
                              Vence em {formatDate(task.dueDate)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Projects health */}
                <section className="rounded-2xl border border-white/5 bg-[#0F0F0F] p-6">
                  <div className="mb-5">
                    <h2 className="text-base font-semibold text-white">
                      Saúde dos projetos
                    </h2>
                    <p className="mt-0.5 text-sm text-zinc-600">
                      Onde o trabalho está concentrado e quais projetos precisam
                      de acompanhamento.
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {data.projects.map((project) => {
                      const openTasks =
                        project.status === "COMPLETED"
                          ? 0
                          : project.tasks.filter(
                              (task) => task.status !== "DONE"
                            ).length;

                      return (
                        <div
                          key={project.id}
                          className="rounded-xl border border-white/5 bg-[#141414] p-4 transition hover:border-white/10"
                        >
                          <div className="mb-3 flex items-start justify-between gap-2">
                            <h3 className="text-sm font-medium leading-snug text-white">
                              {project.name}
                            </h3>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${projectStatusClass[project.status]}`}
                            >
                              {projectStatusLabel[project.status]}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-600">
                            <span className="font-medium text-zinc-300">
                              {openTasks}
                            </span>{" "}
                            tarefas abertas
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-600">
                            Prazo:{" "}
                            <span className="text-zinc-400">
                              {formatDate(project.dueDate)}
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
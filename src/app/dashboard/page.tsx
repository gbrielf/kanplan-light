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
  IDLE: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  HEALTHY: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  ATTENTION: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  OVERLOADED: "bg-red-500/15 text-red-300 border-red-500/30",
};

const projectStatusLabel: Record<ProjectStatus, string> = {
  PLANNING: "Planejamento",
  ACTIVE: "Ativo",
  AT_RISK: "Em risco",
  COMPLETED: "Concluído",
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
    <main className="h-screen overflow-hidden bg-[#0B0B0B] text-white">
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="shrink-0 border-b border-[#2B2B2B] px-8 py-5">
            <p className="text-sm text-slate-400">Painel gerencial</p>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Números para o Ricardo sair da reunião de segunda-feira com
              clareza sobre prazos, capacidade do time e prioridades.
            </p>
          </header>

          <div className="custom-scrollbar flex-1 overflow-auto p-8">
            {!data ? (
              <p className="text-slate-400">Carregando dashboard...</p>
            ) : (
              <div className="space-y-6">
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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

                <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                  <div className="rounded-2xl border border-[#2B2B2B] bg-[#181919] p-6">
                    <div className="mb-5">
                      <h2 className="text-xl font-semibold">
                        Capacidade da equipe
                      </h2>
                      <p className="text-sm text-slate-400">
                        Mostra quem está sobrecarregado, saudável ou ocioso.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {data.membersCapacity.map((member) => {
  const memberTasks = data.tasks.filter(
    (task) => task.assignee.id === member.id && task.status !== "DONE"
  );

  const isExpanded = expandedMemberId === member.id;

  return (
    <div
      key={member.id}
      className="rounded-xl border border-[#2B2B2B] bg-[#0B0B0B] p-4"
    >
      <div className="grid items-center gap-4 md:grid-cols-[1.3fr_0.8fr_1fr_auto]">
        <div>
          <p className="font-medium">{member.name}</p>
          <p className="text-sm text-slate-500">
            {member.role ?? "Sem função"}
          </p>
        </div>

        <div className="text-sm text-slate-400">
          <p>{member.activeTasks} tarefas ativas</p>
          <p>{member.overdueTasks} atrasadas</p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Score de carga</span>
            <span>{member.capacityScore}</span>
          </div>

          <div className="h-2 rounded-full bg-[#2B2B2B]">
            <div
              className="h-2 rounded-full bg-white"
              style={{
                width: `${Math.min(member.capacityScore * 10, 100)}%`,
              }}
            />
          </div>

          <span
            className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
              memberStatusClass[member.status]
            }`}
          >
            {memberStatusLabel[member.status]}
          </span>
        </div>

        <button
          onClick={() =>
            setExpandedMemberId(isExpanded ? null : member.id)
          }
          className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-white/30 hover:text-white"
        >
          {isExpanded ? "Ocultar" : "Ver tarefas"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 border-t border-[#2B2B2B] pt-4">
          {memberTasks.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhuma tarefa ativa atribuída a este membro.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {memberTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-[#2B2B2B] bg-[#181919] p-3"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-white">
                      {task.title}
                    </p>

                    <div className="mt-3">
  <label className="mb-1 block text-xs text-slate-500">
    Responsável
  </label>

  <select
    value={task.assignee.id}
    onChange={async (event) => {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assigneeId: event.target.value,
        }),
      });

      loadDashboard();
    }}
    className="w-full rounded-lg border border-[#2B2B2B] bg-[#0B0B0B] px-3 py-2 text-xs text-white"
  >
    {data.members.map((member) => (
      <option key={member.id} value={member.id}>
        {member.name}
      </option>
    ))}
  </select>
</div>
                  </div>

                  <p className="text-xs text-slate-400">
                    {task.project.name}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Status: {task.status} • Prazo:{" "}
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

                  <div className="space-y-6">
                    <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6">
                      <h2 className="text-xl font-semibold text-red-200">
                        Prazos estourados
                      </h2>
                      <p className="mb-4 text-sm text-red-200/70">
                        O que o Ricardo precisa cobrar hoje.
                      </p>

                      <div className="space-y-3">
                        {data.health.overdueTasks.slice(0, 4).map((task) => (
                          <div
                            key={task.id}
                            className="rounded-xl bg-black/30 p-3"
                          >
                            <p className="text-sm font-medium">{task.title}</p>
                            <p className="text-xs text-slate-400">
                              {task.project.name} • {task.assignee.name}
                            </p>
                            <p className="mt-1 text-xs text-red-300">
                              Venceu em {formatDate(task.dueDate)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6">
                      <h2 className="text-xl font-semibold text-amber-200">
                        Alertas preventivos
                      </h2>
                      <p className="mb-4 text-sm text-amber-200/70">
                        Tarefas que vencem nas próximas 48h.
                      </p>

                      <div className="space-y-3">
                        {data.health.tasksAtRisk.slice(0, 4).map((task) => (
                          <div
                            key={task.id}
                            className="rounded-xl bg-black/30 p-3"
                          >
                            <p className="text-sm font-medium">{task.title}</p>
                            <p className="text-xs text-slate-400">
                              {task.project.name} • {task.assignee.name}
                            </p>
                            <p className="mt-1 text-xs text-amber-300">
                              Vence em {formatDate(task.dueDate)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#2B2B2B] bg-[#181919] p-6">
                  <div className="mb-5">
                    <h2 className="text-xl font-semibold">
                      Saúde dos projetos
                    </h2>
                    <p className="text-sm text-slate-400">
                      Onde o trabalho está concentrado e quais projetos precisam
                      de acompanhamento.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {data.projects.map((project) => {
                      const openTasks =
                        project.status === "COMPLETED"
                          ? 0
                          : project.tasks.filter((task) => task.status !== "DONE").length;

                      return (
                        <div
                          key={project.id}
                          className="rounded-xl border border-[#2B2B2B] bg-[#0B0B0B] p-4"
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <h3 className="font-medium">{project.name}</h3>
                            <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-300">
                              {projectStatusLabel[project.status]}
                            </span>
                          </div>

                          <p className="text-sm text-slate-400">
                            {openTasks} tarefas abertas
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            Prazo: {formatDate(project.dueDate)}
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
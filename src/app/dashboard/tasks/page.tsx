"use client";

import React, { useState } from "react";
import { useApp, Task, SubTask } from "@/context/AppContext";
import {
  Plus,
  Trash2,
  CheckCircle,
  Calendar,
  Grid,
  List,
  ChevronRight,
  ChevronLeft,
  Clock,
  Tag,
  AlertTriangle,
  FolderOpen
} from "lucide-react";

type TaskView = "list" | "kanban" | "calendar";

export default function Taskboard() {
  const { tasks, addTask, updateTaskStatus, deleteTask, updateTask } = useApp();
  const [currentView, setCurrentView] = useState<TaskView>("list");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [category, setCategory] = useState("Work");
  const [deadline, setDeadline] = useState("2026-07-05");
  const [estTime, setEstTime] = useState(1);
  const [notes, setNotes] = useState("");
  
  // Subtasks in Form
  const [subtaskInput, setSubtaskInput] = useState("");
  const [tempSubtasks, setTempSubtasks] = useState<{ title: string; completed: boolean }[]>([]);

  // Task detail modal state
  const [activeTaskDetail, setActiveTaskDetail] = useState<Task | null>(null);

  // Calendar state: July 2026 (current time is July 4, 2026)
  const currentYear = 2026;
  const currentMonth = 6; // 0-indexed, July is 6
  const monthName = "July 2026";
  
  // July 2026 starts on a Wednesday (index 3)
  const daysInJuly = 31;
  const startDayOffset = 3; 

  const handleAddTempSubtask = () => {
    if (!subtaskInput.trim()) return;
    setTempSubtasks([...tempSubtasks, { title: subtaskInput.trim(), completed: false }]);
    setSubtaskInput("");
  };

  const handleRemoveTempSubtask = (idx: number) => {
    setTempSubtasks(tempSubtasks.filter((_, i) => i !== idx));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedSubtasks: SubTask[] = tempSubtasks.map((st, i) => ({
      id: `s-${Date.now()}-${i}`,
      title: st.title,
      completed: st.completed
    }));

    addTask({
      title: title.trim(),
      priority,
      status: "Todo",
      deadline,
      estTime,
      category,
      subtasks: formattedSubtasks,
      notes: notes.trim() || undefined
    });

    // Reset Form
    setTitle("");
    setPriority("Medium");
    setCategory("Work");
    setDeadline("2026-07-05");
    setEstTime(1);
    setNotes("");
    setTempSubtasks([]);
    setIsModalOpen(false);
  };

  const toggleSubtaskCompletion = (task: Task, subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateTask({ ...task, subtasks: updatedSubtasks });
  };

  // Helper: Get tasks due on a specific calendar day in YYYY-MM-DD
  const getTasksForDay = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-07-${formattedDay}`;
    return tasks.filter((t) => t.deadline === dateStr);
  };

  return (
    <div className="space-y-6">
      {/* Title Bar & View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Taskboard</h2>
          <p className="text-xs sm:text-sm text-slate-400">Organize, estimate, and complete your deep work targets</p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Toggles */}
          <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-900 text-xs">
            <button
              onClick={() => setCurrentView("list")}
              className={`p-2 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === "list" ? "bg-slate-900 text-cyan-400" : "text-slate-450 hover:text-slate-200"
              }`}
            >
              <List size={14} /> <span className="hidden md:inline">List</span>
            </button>
            <button
              onClick={() => setCurrentView("kanban")}
              className={`p-2 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === "kanban" ? "bg-slate-900 text-cyan-400" : "text-slate-450 hover:text-slate-200"
              }`}
            >
              <Grid size={14} /> <span className="hidden md:inline">Kanban</span>
            </button>
            <button
              onClick={() => setCurrentView("calendar")}
              className={`p-2 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === "calendar" ? "bg-slate-900 text-cyan-400" : "text-slate-450 hover:text-slate-200"
              }`}
            >
              <Calendar size={14} /> <span className="hidden md:inline">Calendar</span>
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white flex items-center justify-center gap-2 neon-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus size={16} /> Create Task
          </button>
        </div>
      </div>

      {/* VIEW: List View */}
      {currentView === "list" && (
        <div className="space-y-6">
          {["Todo", "In Progress", "Completed"].map((status) => {
            const statusTasks = tasks.filter((t) => t.status === status);
            return (
              <div key={status} className="glass-card p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      status === "Todo" ? "bg-slate-500" :
                      status === "In Progress" ? "bg-cyan-400 animate-pulse" :
                      "bg-emerald-400"
                    }`}></span>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-100 uppercase tracking-wide">
                      {status} ({statusTasks.length})
                    </h3>
                  </div>
                </div>

                {statusTasks.length === 0 ? (
                  <p className="text-xs text-slate-500 font-bold py-4 text-center">No tasks in this category</p>
                ) : (
                  <div className="divide-y divide-slate-900/60">
                    {statusTasks.map((t) => (
                      <div key={t.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5">
                            {status !== "Completed" && (
                              <button
                                onClick={() => updateTaskStatus(t.id, "Completed")}
                                className="w-5 h-5 rounded-md border border-slate-700 hover:border-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center transition-all cursor-pointer"
                              >
                                <div className="w-2.5 h-2.5 bg-transparent rounded-sm"></div>
                              </button>
                            )}
                            <h4
                              onClick={() => setActiveTaskDetail(t)}
                              className={`text-sm sm:text-base font-bold text-slate-200 hover:text-cyan-400 cursor-pointer transition-colors truncate max-w-[280px] sm:max-w-xl ${
                                status === "Completed" ? "line-through text-slate-500" : ""
                              }`}
                            >
                              {t.title}
                            </h4>
                          </div>

                          {/* Quick indicators */}
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] sm:text-xs font-semibold text-slate-500">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                              t.priority === "High" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                              t.priority === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            }`}>
                              {t.priority}
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag size={12} className="text-violet-400" /> {t.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} className="text-cyan-400" /> {t.estTime} hrs
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-orange-400" /> Due: {t.deadline}
                            </span>
                          </div>

                          {/* Subtasks inline preview */}
                          {t.subtasks && t.subtasks.length > 0 && (
                            <div className="mt-3 pl-7 space-y-1.5 border-l-2 border-slate-900">
                              {t.subtasks.map((st) => (
                                <label key={st.id} className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-350 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={st.completed}
                                    disabled={status === "Completed"}
                                    onChange={() => toggleSubtaskCompletion(t, st.id)}
                                    className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-0 cursor-pointer"
                                  />
                                  <span className={st.completed ? "line-through text-slate-500" : ""}>{st.title}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          {status === "Todo" && (
                            <button
                              onClick={() => updateTaskStatus(t.id, "In Progress")}
                              className="px-3 py-1.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 hover:bg-cyan-500/10 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                            >
                              Start Focus
                            </button>
                          )}
                          {status === "In Progress" && (
                            <button
                              onClick={() => updateTaskStatus(t.id, "Todo")}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                            >
                              Pause Task
                            </button>
                          )}
                          <button
                            onClick={() => deleteTask(t.id)}
                            className="p-2 rounded-lg bg-red-950/10 border border-red-500/10 hover:border-red-500/30 text-red-400 transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: Kanban Board */}
      {currentView === "kanban" && (
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {["Todo", "In Progress", "Completed"].map((status) => {
            const statusTasks = tasks.filter((t) => t.status === status);
            return (
              <div key={status} className="glass-card p-4 rounded-2xl flex flex-col max-h-[700px]">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      status === "Todo" ? "bg-slate-500" :
                      status === "In Progress" ? "bg-cyan-400 animate-pulse" :
                      "bg-emerald-400"
                    }`}></span>
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-100">{status}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-450 border border-slate-850 text-[10px] font-bold">
                    {statusTasks.length}
                  </span>
                </div>

                {/* Column Scrollable Area */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 kanban-column-scroll min-h-[300px]">
                  {statusTasks.length === 0 ? (
                    <div className="py-12 text-center text-xs font-bold text-slate-600">Column is empty</div>
                  ) : (
                    statusTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-xl bg-slate-950/50 border border-slate-900/80 hover:border-slate-800 transition-all space-y-3 group"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4
                            onClick={() => setActiveTaskDetail(t)}
                            className="font-bold text-xs sm:text-sm text-slate-200 hover:text-cyan-400 cursor-pointer line-clamp-2"
                          >
                            {t.title}
                          </h4>
                          <button
                            onClick={() => deleteTask(t.id)}
                            className="text-slate-650 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {t.notes && <p className="text-[11px] text-slate-500 line-clamp-2">{t.notes}</p>}

                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider ${
                            t.priority === "High" ? "bg-red-500/10 text-red-400" :
                            t.priority === "Medium" ? "bg-amber-500/10 text-amber-400" :
                            "bg-cyan-500/10 text-cyan-400"
                          }`}>
                            {t.priority}
                          </span>
                          <span className="text-slate-550 flex items-center gap-0.5"><Clock size={10} /> {t.estTime}h</span>
                          <span className="text-slate-550 flex items-center gap-0.5"><Calendar size={10} /> {t.deadline.split("-")[2]} July</span>
                        </div>

                        {/* Column Transition Arrows */}
                        <div className="flex justify-end gap-1.5 border-t border-slate-900/60 pt-3">
                          {status !== "Todo" && (
                            <button
                              onClick={() => updateTaskStatus(t.id, status === "Completed" ? "In Progress" : "Todo")}
                              className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 transition-all cursor-pointer"
                              title="Move back"
                            >
                              <ChevronLeft size={12} />
                            </button>
                          )}
                          {status !== "Completed" && (
                            <button
                              onClick={() => updateTaskStatus(t.id, status === "Todo" ? "In Progress" : "Completed")}
                              className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-750 text-cyan-400 transition-all cursor-pointer"
                              title="Move forward"
                            >
                              <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: Calendar View */}
      {currentView === "calendar" && (
        <div className="glass-card p-5 sm:p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-100">{monthName}</h3>
            <span className="text-xs text-slate-450 font-bold">Time zone: GMT+5:45</span>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-450 uppercase tracking-widest border-b border-slate-900 pb-3 mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid Blocks */}
          <div className="grid grid-cols-7 gap-2">
            {/* Pad the empty cells of start day offset */}
            {Array.from({ length: startDayOffset }).map((_, idx) => (
              <div key={`offset-${idx}`} className="aspect-square bg-slate-950/20 border border-slate-900/30 rounded-xl"></div>
            ))}

            {/* Render actual days */}
            {Array.from({ length: daysInJuly }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayTasks = getTasksForDay(dayNum);
              return (
                <div
                  key={`day-${dayNum}`}
                  className="aspect-square bg-slate-950/40 border border-slate-900/60 rounded-xl p-1.5 sm:p-2 flex flex-col justify-between hover:border-slate-800 transition-all"
                >
                  <span className="text-xs font-bold text-slate-450">{dayNum}</span>
                  
                  {/* Task counts or dots */}
                  <div className="flex flex-col gap-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setActiveTaskDetail(t)}
                        className={`text-[8px] sm:text-[9px] font-black truncate px-1 rounded cursor-pointer leading-tight uppercase ${
                          t.status === "Completed" ? "bg-emerald-500/10 text-emerald-400" :
                          t.priority === "High" ? "bg-red-500/10 text-red-400" :
                          "bg-cyan-500/10 text-cyan-400"
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[7px] font-bold text-violet-400 text-center">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: Create Task Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <h3 className="text-xl font-black text-slate-100">Create New Goal</h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Code marketing page layout"
                  className="w-full px-4 py-2.5 text-sm glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm glass-input bg-[#0b0b12]"
                  >
                    <option value="Work">💼 Work</option>
                    <option value="Study">📚 Study</option>
                    <option value="Health">💪 Health</option>
                    <option value="Life">🌱 Life</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Task["priority"])}
                    className="w-full px-3 py-2.5 text-sm glass-input bg-[#0b0b12]"
                  >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🔵 Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm glass-input bg-[#0b0b12]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Est. Time (hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    min="0.1"
                    value={estTime}
                    onChange={(e) => setEstTime(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm glass-input bg-[#0b0b12]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Subtasks</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    placeholder="e.g. Design components"
                    className="flex-1 px-3 py-2 text-sm glass-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddTempSubtask}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-black text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
                {/* Temp subtasks list */}
                {tempSubtasks.length > 0 && (
                  <div className="mt-2.5 p-2 rounded-xl bg-slate-950/50 border border-slate-900 space-y-1.5">
                    {tempSubtasks.map((st, i) => (
                      <div key={i} className="flex justify-between items-center text-xs text-slate-350 px-2 py-0.5">
                        <span>• {st.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTempSubtask(i)}
                          className="text-red-400 font-bold hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase mb-1.5">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional details..."
                  rows={2}
                  className="w-full px-4 py-2.5 text-sm glass-input"
                ></textarea>
              </div>

              <div className="flex gap-4 border-t border-slate-900 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-350 hover:text-white font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-black text-xs cursor-pointer shadow-md"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Task Detail and Notes expander */}
      {activeTaskDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel border border-slate-800/85 rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex justify-between items-start gap-4">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                activeTaskDetail.priority === "High" ? "bg-red-500/10 text-red-400" :
                activeTaskDetail.priority === "Medium" ? "bg-amber-500/10 text-amber-400" :
                "bg-cyan-500/10 text-cyan-400"
              }`}>
                {activeTaskDetail.priority} Priority
              </span>
              <span className="text-[10px] text-slate-500 font-bold">Category: {activeTaskDetail.category}</span>
            </div>

            <h3 className="text-lg font-black text-slate-150 leading-snug">{activeTaskDetail.title}</h3>
            
            {activeTaskDetail.notes && (
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-450 uppercase flex items-center gap-1"><FolderOpen size={12} /> Notes</div>
                <p className="text-xs text-slate-350 leading-relaxed bg-slate-950/30 p-3 rounded-xl border border-slate-900/60">{activeTaskDetail.notes}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-450 bg-slate-950/40 p-3 rounded-xl border border-slate-900/40">
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Est Hours</span>
                <span className="text-slate-200 font-black">{activeTaskDetail.estTime} hrs</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Deadline</span>
                <span className="text-slate-200 font-black">{activeTaskDetail.deadline}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTaskDetail(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

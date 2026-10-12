import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ListOrdered,
  Kanban,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MoveRight,
  Filter,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { repository } from '../services/repository';
import { ScheduleEngine, WorkloadAnalysis } from '../services/scheduleEngine';
import { TimelineTask, UserPreferences, TaskStatus, TaskType } from '../types/userData';

export const TimelinePage: React.FC = () => {
  const [tasks, setTasks] = useState<TimelineTask[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'roadmap' | 'weekly'>('calendar');
  const [filterType, setFilterType] = useState<TaskType | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<TimelineTask | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [isAddCustomModalOpen, setIsAddCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customType, setCustomType] = useState<TaskType>('practice');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [customDuration, setCustomDuration] = useState(60);

  // Month navigation for calendar view
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const loadData = async () => {
    const [tList, prefs] = await Promise.all([
      repository.getTimelineTasks(),
      repository.getPreferences(),
    ]);
    setTasks(tList);
    setPreferences(prefs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus: TaskStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await repository.updateTimelineTask(taskId, { status: nextStatus });
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
  };

  const handleReschedule = async () => {
    if (!selectedTask || !newDate) return;
    await repository.updateTimelineTask(selectedTask.id, { scheduledDate: newDate, status: 'pending' });
    setTasks((prev) =>
      prev.map((t) => (t.id === selectedTask.id ? { ...t, scheduledDate: newDate } : t))
    );
    setIsRescheduleModalOpen(false);
    setSelectedTask(null);
  };

  const handleAddCustomTask = async () => {
    if (!customTitle.trim()) return;
    const newTask: TimelineTask = {
      id: 'task_custom_' + Date.now(),
      title: customTitle.trim(),
      scheduledDate: customDate,
      durationMinutes: customDuration,
      taskType: customType,
      status: 'pending',
      orderIndex: tasks.length + 1,
    };
    await repository.saveTimelineTasks([newTask]);
    setTasks((prev) => [...prev, newTask]);
    setIsAddCustomModalOpen(false);
    setCustomTitle('');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterType === 'all') return true;
    return t.taskType === filterType;
  });

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EAE8]">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1D1A39]">
            My Personal Timeline
          </h1>
          <p className="text-xs sm:text-sm text-[#7E6C7C] mt-1">
            Genuinely editable calendar, roadmap, and weekly board. Respects prerequisites and buffers.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddCustomModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Study Session / Buffer
          </Button>
        </div>
      </div>

      {/* VIEW SELECTOR & FILTERS */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F6] border border-[#F0EAE8] rounded-xl text-xs font-semibold">
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'calendar' ? 'bg-white text-[#1D1A39] shadow-xs' : 'text-[#7E6C7C]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar View</span>
          </button>
          <button
            onClick={() => setViewMode('roadmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'roadmap' ? 'bg-white text-[#1D1A39] shadow-xs' : 'text-[#7E6C7C]'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Ordered Roadmap</span>
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'weekly' ? 'bg-white text-[#1D1A39] shadow-xs' : 'text-[#7E6C7C]'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Weekly Board</span>
          </button>
        </div>

        {/* Task type filter */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[#7E6C7C] mr-1">Filter:</span>
          {(['all', 'lesson', 'practice', 'revision', 'buffer'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all capitalize ${
                filterType === type
                  ? 'bg-[#1D1A39] text-white'
                  : 'bg-[#FAF7F6] text-[#574459] hover:bg-[#F3ECE9]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <Card className="p-4 sm:p-6 overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE8]">
            <h3 className="font-display font-bold text-lg text-[#1D1A39]">{monthName}</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg text-[#7E6C7C] hover:bg-[#FAF7F6] border border-[#E2D6D4]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg text-[#7E6C7C] hover:bg-[#FAF7F6] border border-[#E2D6D4]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-[#7E6C7C] py-2 border-b border-[#F0EAE8]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2">
            {/* Blank offset days */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`blank-${i}`} className="min-h-24 rounded-xl bg-gray-50/40 p-1 opacity-40" />
            ))}

            {/* Days in month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayTasks = filteredTasks.filter((t) => t.scheduledDate === dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={dayNum}
                  className={`min-h-24 sm:min-h-28 rounded-xl border p-1.5 sm:p-2 flex flex-col justify-between transition-colors ${
                    isToday
                      ? 'border-[#451952] bg-[#451952]/5'
                      : 'border-[#F0EAE8] bg-[#FFFDFC] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-mono font-bold ${isToday ? 'text-[#451952]' : 'text-[#1D1A39]'}`}>
                      {dayNum}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-semibold text-[#7E6C7C]">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Tasks in day */}
                  <div className="space-y-1 my-1 overflow-y-auto max-h-16">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setSelectedTask(task);
                          setNewDate(task.scheduledDate);
                          setIsRescheduleModalOpen(true);
                        }}
                        className={`p-1 rounded text-[10px] truncate font-medium cursor-pointer transition-colors ${
                          task.status === 'completed'
                            ? 'bg-emerald-100/70 text-emerald-800 line-through'
                            : task.taskType === 'buffer'
                            ? 'bg-[#F39F5A]/20 text-[#8F470D]'
                            : task.taskType === 'revision'
                            ? 'bg-[#AE445A]/15 text-[#AE445A]'
                            : 'bg-[#1D1A39]/10 text-[#1D1A39]'
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[9px] text-[#7E6C7C] block text-center">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end">
                    {isToday && (
                      <span className="text-[9px] font-bold text-[#451952] uppercase">Today</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* VIEW 2: ORDERED ROADMAP VIEW */}
      {viewMode === 'roadmap' && (
        <Card className="divide-y divide-[#F0EAE8]">
          <CardHeader>
            <CardTitle>Sequential Task Dependency Order</CardTitle>
            <CardDescription>
              Tasks ordered strictly by learning sequence and prerequisite safety.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {filteredTasks.map((t, idx) => (
              <div
                key={t.id}
                className="py-3 flex items-center justify-between gap-4 group hover:bg-[#FAF7F6] px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.status === 'completed'}
                    onChange={() => handleToggleStatus(t.id, t.status)}
                    className="w-4 h-4 rounded text-[#451952] focus:ring-[#451952] cursor-pointer"
                  />
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        t.status === 'completed' ? 'line-through text-[#7E6C7C]' : 'text-[#1D1A39]'
                      }`}
                    >
                      {t.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#7E6C7C] mt-0.5">
                      <span>Date: {t.scheduledDate}</span>
                      <span>·</span>
                      <span>{t.durationMinutes} mins</span>
                      <span>·</span>
                      <span className="capitalize">{t.taskType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="tag" size="xs">
                    {t.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setSelectedTask(t);
                      setNewDate(t.scheduledDate);
                      setIsRescheduleModalOpen(true);
                    }}
                  >
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* VIEW 3: WEEKLY PLANNING BOARD */}
      {viewMode === 'weekly' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Pending Lessons', 'Practice & Revisions', 'Completed This Week'].map((colTitle, colIdx) => {
            const colTasks = filteredTasks.filter((t) => {
              if (colIdx === 0) return t.status === 'pending' && t.taskType === 'lesson';
              if (colIdx === 1) return t.status === 'pending' && t.taskType !== 'lesson';
              return t.status === 'completed';
            });

            return (
              <Card key={colTitle} className="bg-[#FAF7F6] border-[#EADBDA]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">{colTitle}</CardTitle>
                    <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-[#E2D6D4]">
                      {colTasks.length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {colTasks.length === 0 ? (
                    <p className="text-xs text-[#7E6C7C] text-center py-6">No tasks in this lane</p>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 bg-white rounded-xl border border-[#F0EAE8] shadow-2xs hover:border-[#E2D6D4] transition-all"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-semibold capitalize text-[#AE445A]">
                            {task.taskType}
                          </span>
                          <span className="text-[10px] font-mono text-[#7E6C7C]">{task.scheduledDate}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#1D1A39]">{task.title}</h4>
                        <div className="mt-2 pt-2 border-t border-[#F0EAE8] flex items-center justify-between text-xs">
                          <span className="text-[11px] text-[#7E6C7C]">{task.durationMinutes} mins</span>
                          <button
                            onClick={() => handleToggleStatus(task.id, task.status)}
                            className="text-xs font-semibold text-[#451952] hover:underline"
                          >
                            {task.status === 'completed' ? 'Mark Pending' : 'Complete'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        title="Reschedule Study Activity"
        description="Shift this task to a new target date without breaking prerequisite ordering."
      >
        {selectedTask && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#FAF7F6] border border-[#F0EAE8] text-xs">
              <span className="font-bold text-[#1D1A39] block">{selectedTask.title}</span>
              <span className="text-[#7E6C7C] mt-0.5 block">
                Currently scheduled for {selectedTask.scheduledDate}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1A39] mb-1.5">New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm font-mono focus:ring-2 focus:ring-[#451952]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsRescheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleReschedule}>
                Confirm Reschedule
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ADD CUSTOM TASK MODAL */}
      <Modal
        isOpen={isAddCustomModalOpen}
        onClose={() => setIsAddCustomModalOpen(false)}
        title="Add Custom Study Session or Buffer"
        description="Add a practice session, mock assessment, or buffer day to your calendar."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Session Title</label>
            <input
              type="text"
              placeholder="e.g. Solve LeetCode Top 5 Medium DP problems"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#451952]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Task Type</label>
              <select
                value={customType}
                onChange={(e) => setCustomType(e.target.value as any)}
                className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-[#451952]"
              >
                <option value="practice">Practice Problems</option>
                <option value="lesson">Concept Study</option>
                <option value="revision">Revision / Spaced Review</option>
                <option value="mock">Mock Interview</option>
                <option value="buffer">Buffer Day</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Duration (Mins)</label>
              <input
                type="number"
                value={customDuration}
                onChange={(e) => setCustomDuration(Number(e.target.value))}
                className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm font-mono focus:ring-2 focus:ring-[#451952]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1A39] mb-1">Scheduled Date</label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full bg-[#FFFDFC] border border-[#E2D6D4] rounded-xl px-3.5 py-2 text-sm font-mono focus:ring-2 focus:ring-[#451952]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsAddCustomModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddCustomTask}>
              Add to Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

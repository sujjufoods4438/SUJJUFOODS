import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Clock,
  CheckSquare,
  UserCheck,
  LogOut,
  LogIn,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers,
  Factory,
  ShieldCheck,
  Users
} from 'lucide-react';
import {
  checkInAttendanceApi,
  checkOutAttendanceApi,
  fetchAttendanceApi,
  fetchEmployeeTasksApi,
  completeEmployeeTaskApi,
} from '../../services/api';

export const EmployeeDashboard: React.FC = () => {
  const employeeNav = [
    { label: 'My Shift & Tasks', path: '/employee/dashboard', icon: <CheckSquare className="w-4 h-4" /> },
  ];

  const [attendance, setAttendance] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [attRes, taskRes] = await Promise.all([fetchAttendanceApi(), fetchEmployeeTasksApi()]);
      if (attRes?.attendance) setAttendance(attRes.attendance);
      if (taskRes?.tasks) setTasks(taskRes.tasks);
    } catch (err) {
      console.error('Failed to load employee data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const hasCheckedIn = attendance.some((r) => r.status === 'present');

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setStatusMsg(null);
      const res = await checkInAttendanceApi({
        employeeId: 'EMP-014',
        employeeName: 'Ravi Teja (Plant Ops)',
        role: 'Packaging Line Supervisor',
        location: 'Visakhapatnam Manufacturing Unit - Floor B',
      });
      if (res?.success) {
        setStatusMsg({ type: 'success', text: res.message });
        await loadData();
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Error recording attendance check-in' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setStatusMsg(null);
      const res = await checkOutAttendanceApi('EMP-014');
      if (res?.success) {
        setStatusMsg({ type: 'success', text: res.message });
        await loadData();
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Error recording attendance check-out' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      setActionLoading(true);
      const res = await completeEmployeeTaskApi(taskId);
      if (res?.success) {
        await loadData();
      }
    } catch (err) {
      console.error('Failed to complete task', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout portalTitle="Employee Floor Portal" portalRole="employee" navItems={employeeNav}>
      <div className="space-y-8">
        {/* Header */}
        <div className="sujju-gradient rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-sujju-gold text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Plant Operations & Quality Compliance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Shift Checklist & Task Station
            </h2>
            <p className="text-xs text-sujju-green-200 mt-1">
              Log daily shift attendance, complete packaging benchmarks, and maintain statutory batch standards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!hasCheckedIn ? (
              <button
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Shift Check-In</span>
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Shift Check-Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Msg */}
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* 2-Column: Shift Status + Daily Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shift Status Summary */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-sujju-green" />
                <h3 className="text-lg font-bold text-gray-900">Shift Status</h3>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  hasCheckedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {hasCheckedIn ? 'ON DUTY' : 'OFF DUTY'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Employee:</span>
                <strong className="text-gray-800">Ravi Teja (EMP-014)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Assigned Station:</span>
                <strong className="text-gray-800">250g Pouch Packaging Line</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Factory Facility:</span>
                <strong className="text-gray-800">Visakhapatnam Corridor</strong>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-500 space-y-1">
              <div>Recent Check-In Time:</div>
              <div className="font-mono font-bold text-gray-900">
                {attendance[0]?.checkInTime
                  ? new Date(attendance[0].checkInTime).toLocaleTimeString()
                  : 'No check-in today yet'}
              </div>
            </div>
          </div>

          {/* Daily Shift Checklist */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-sujju-green" />
                <h3 className="text-lg font-bold text-gray-900">Daily Plant Station Checklist</h3>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {tasks.filter((t) => t.isCompleted).length} of {tasks.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
                    task.isCompleted ? 'bg-gray-50/70 border-gray-200' : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => !task.isCompleted && handleCompleteTask(task.id)}
                      disabled={task.isCompleted || actionLoading}
                      className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center transition ${
                        task.isCompleted
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'border-2 border-gray-300 hover:border-sujju-green'
                      }`}
                    >
                      {task.isCompleted && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <div
                        className={`text-sm font-semibold ${
                          task.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
                        }`}
                      >
                        {task.taskTitle}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold uppercase px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                          {task.department}
                        </span>
                        <span
                          className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                            task.priority === 'high'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  {task.isCompleted ? (
                    <span className="text-xs text-emerald-700 font-semibold flex-shrink-0">
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="text-xs font-bold text-sujju-green hover:underline flex-shrink-0"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

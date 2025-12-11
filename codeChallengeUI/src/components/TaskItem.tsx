import React from "react";
import { Check, Loader2, Circle } from "lucide-react";
import type { Task } from "../types/task.types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  isUpdating: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  isUpdating,
}) => {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all duration-200
      ${
        task.completed
          ? "bg-emerald-50 border-emerald-200"
          : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm"
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        disabled={isUpdating}
        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all
        ${
          task.completed
            ? "bg-emerald-500 border-emerald-500"
            : "border-slate-300 hover:border-blue-500"
        } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isUpdating ? (
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        ) : task.completed ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <Circle className="w-4 h-4 text-transparent" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm md:text-base font-medium break-words transition-all
          ${
            task.completed
              ? "text-slate-500 line-through"
              : "text-slate-900"
          }`}
        >
          {task.title}
        </p>
      </div>

      <span className="flex-shrink-0 px-3 py-1 text-[0.7rem] font-mono font-semibold bg-slate-100 text-slate-600 rounded-full">
        #{task.id}
      </span>
    </div>
  );
};

"use client";
import { useState, useEffect } from "react";

type Priority = "high" | "medium" | "low";
type Category = "すべて" | "仕事" | "プライベート" | "買い物";

export default function TodoApp() {
  const [todos, setTodos] = useState<{ text: string; note: string; completed: boolean; priority: Priority; dueDate: string; alerted: boolean; category: Category }[]>([]);
  const [input, setInput] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("すべて"); // 表示中のカテゴリ
  const [inputCategory, setInputCategory] = useState<Category>("仕事"); // 入力中のカテゴリ
  const [searchQuery, setSearchQuery] = useState("");
  const [alarmMessage, setAlarmMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("my-todos");
    if (saved) {
      const activeTodos = JSON.parse(saved).filter((todo: any) => !todo.completed);
      setTodos(activeTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("my-todos", JSON.stringify(todos));
  }, [todos]);

  // アラームタイマー（修正版）
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTodos((currentTodos) => {
        let hasChanged = false;
        const nextTodos = currentTodos.map((todo) => {
          if (todo.dueDate && !todo.alerted && !todo.completed) {
            if (new Date(todo.dueDate) <= now) {
              if (Notification.permission === "granted") {
                new Notification("⏰ アラーム", { body: todo.text });
              }
              setAlarmMessage(`⏰ 時間です！\n【${todo.text}】`);
              hasChanged = true;
              return { ...todo, alerted: true };
            }
          }
          return todo;
        });
        return hasChanged ? nextTodos : currentTodos;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { text: input, note, completed: false, priority, dueDate, alerted: false, category: inputCategory }]);
    setInput(""); setNote(""); setPriority("medium"); setDueDate("");
  };

  // フィルタリング処理（検索 ＋ カテゴリ絞り込み）
  const filteredTodos = todos
    .filter(todo => {
      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase()) || todo.note.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "すべて" || todo.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 font-sans text-slate-200">
      {alarmMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
          <div className="bg-red-600 p-8 rounded-3xl text-center max-w-sm w-full shadow-2xl animate-bounce">
            <p className="text-xl font-bold mb-6 whitespace-pre-wrap">{alarmMessage}</p>
            <button onClick={() => setAlarmMessage(null)} className="bg-white text-red-600 px-8 py-2 rounded-full font-black">了解！</button>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto bg-slate-800 rounded-3xl shadow-2xl p-6 border border-slate-700">
        <h1 className="text-3xl font-black mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Next Todo Pro</h1>

        {/* カテゴリー切り替えタブ */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {(["すべて", "仕事", "プライベート", "買い物"] as Category[]).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-400"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 検索 */}
        <input
          type="text"
          placeholder="🔍 検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-6 px-4 py-2 bg-slate-700 rounded-xl border border-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 入力フォーム */}
        <div className="flex flex-col gap-3 mb-8 bg-slate-700/50 p-4 rounded-2xl border border-slate-600">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="何をする？" className="flex-1 bg-slate-700 px-4 py-2 rounded-lg outline-none" />
            <select value={inputCategory} onChange={(e) => setInputCategory(e.target.value as Category)} className="bg-slate-700 text-xs p-2 rounded-lg outline-none border border-slate-500">
              <option value="仕事">💼 仕事</option>
              <option value="プライベート">🏠 宅</option>
              <option value="買い物">🛒 買</option>
            </select>
          </div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="メモ（任意）" className="bg-slate-700 px-4 py-2 rounded-lg text-sm h-14 resize-none outline-none" />
          <div className="grid grid-cols-2 gap-2">
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="bg-slate-700 text-sm p-2 rounded-lg outline-none border border-slate-600">
              <option value="high">🔥 高</option>
              <option value="medium">⚡ 中</option>
              <option value="low">💤 低</option>
            </select>
            <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-slate-700 text-xs p-2 rounded-lg outline-none border border-slate-600" />
          </div>
          <button onClick={addTodo} className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 rounded-xl font-black shadow-lg">追加</button>
        </div>

        {/* リスト表示 */}
        <ul className="space-y-4">
          {filteredTodos.map((todo) => {
            const originalIndex = todos.findIndex(t => t === todo);
            return (
              <li key={originalIndex} className="bg-slate-700/40 border border-slate-600 p-4 rounded-2xl flex items-start gap-3">
                <input type="checkbox" checked={todo.completed} onChange={() => {
                  const newTodos = [...todos];
                  newTodos[originalIndex].completed = true;
                  setTodos(newTodos);
                }} className="w-6 h-6 rounded-full mt-1 accent-emerald-500" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-600 px-2 py-0.5 rounded text-slate-300 uppercase font-bold">{todo.category}</span>
                    <span className="font-bold text-lg truncate">{todo.text}</span>
                  </div>
                  {todo.note && <p className="text-sm text-slate-400 mt-1">{todo.note}</p>}
                  {todo.dueDate && (
                    <div className="text-xs mt-2 font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400 w-fit">
                      {todo.dueDate.replace("T", " ")}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

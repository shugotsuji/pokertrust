'use client';

import React, { useMemo, useState } from "react";

// Minimal, single-file demo for recording tournament results and previewing an OG-style share card
// Tailwind styles assumed. No backend. Data lives in component state.

export default function PokerResultDemo() {
  const [name, setName] = useState("Shugo");
  const [handle, setHandle] = useState("@0xshugo");
  const [region, setRegion] = useState("Tokyo, JP");
  const [bio, setBio] = useState("NLH / Live / JOPT, AJPC, WPT");

  const [achievements, setAchievements] = useState<AchievementForm[]>([
    {
      event_name: "JOPT #23 Main",
      org: "JOPT",
      date: "2025-09-12",
      buyin: 100000,
      field_size: 1430,
      place: 56,
      payout: 220000,
      proof_url: "https://example.com/jopt23-result",
    },
  ]);

  const [draft, setDraft] = useState<AchievementForm>({
    event_name: "",
    org: "",
    date: "",
    buyin: 0,
    field_size: 0,
    place: 0,
    payout: 0,
    proof_url: "",
  });

  type AchievementForm = {
    event_name: string;
    org: string;
    date: string; // yyyy-mm-dd
    buyin: number; // JPY
    field_size: number;
    place: number; // 0 means DNP/No cash
    payout: number; // JPY, 0 if no cash
    proof_url: string;
  };

  const stats = useMemo(() => {
    const within12m = achievements.filter((a) => {
      if (!a.date) return false;
      const dt = new Date(a.date);
      const now = new Date();
      const past = new Date(now);
      past.setMonth(past.getMonth() - 12);
      return dt >= past && dt <= now;
    });
    const games = within12m.length || 0;
    const cashes = within12m.filter((a) => (a.payout || 0) > 0).length || 0;
    const itm = games ? Math.round((cashes / games) * 100) : 0;
    const buyinSum = within12m.reduce((s, a) => s + (a.buyin || 0), 0);
    const payoutSum = within12m.reduce((s, a) => s + (a.payout || 0), 0);
    const roi = buyinSum > 0 ? Math.round(((payoutSum - buyinSum) / buyinSum) * 100) : 0;
    return { games, cashes, itm, buyinSum, payoutSum, roi };
  }, [achievements]);

  const top3 = useMemo(() => {
    return [...achievements]
      .sort((a, b) => (b.payout || 0) - (a.payout || 0))
      .slice(0, 3);
  }, [achievements]);

  const addAchievement = () => {
    if (!draft.event_name || !draft.date) return;
    setAchievements((prev) => [
      ...prev,
      { ...draft, buyin: +draft.buyin || 0, payout: +draft.payout || 0, field_size: +draft.field_size || 0, place: +draft.place || 0 },
    ]);
    setDraft({ event_name: "", org: "", date: "", buyin: 0, field_size: 0, place: 0, payout: 0, proof_url: "" });
  };

  const removeAchievement = (idx: number) => {
    setAchievements((prev) => prev.filter((_, i) => i !== idx));
  };

  const profileSnippetJP = useMemo(() => {
    return `トーナメント成績: ITM(直近12ヶ月) ${stats.itm}% · 代表成績ピン留め · 実績と証跡→ your.link/${handle.replace("@", "")}`;
  }, [stats.itm, handle]);

  const profileSnippetEN = useMemo(() => {
    return `Poker results · 12-mo ITM ${stats.itm}% · Top finishes pinned · Proofs: your.link/${handle.replace("@", "")}`;
  }, [stats.itm, handle]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-5">
        {/* Left column: Form */}
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold">Poker Result Card — Demo</h1>
          <p className="text-sm text-neutral-600">超簡易MVP: 実績入力 → 統計 → シェアカードのプレビュー（ダウンロードはプロトタイプ）。</p>

          <section className="bg-white rounded-2xl shadow p-4 space-y-3">
            <h2 className="font-semibold">プロフィール</h2>
            <div className="grid grid-cols-2 gap-3">
              <label className="col-span-1 text-sm">名前/表示名
                <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full rounded-xl border p-2" />
              </label>
              <label className="col-span-1 text-sm">ハンドル
                <input value={handle} onChange={(e)=>setHandle(e.target.value)} className="mt-1 w-full rounded-xl border p-2" />
              </label>
              <label className="col-span-1 text-sm">地域
                <input value={region} onChange={(e)=>setRegion(e.target.value)} className="mt-1 w-full rounded-xl border p-2" />
              </label>
              <label className="col-span-2 text-sm">自己紹介
                <input value={bio} onChange={(e)=>setBio(e.target.value)} className="mt-1 w-full rounded-xl border p-2" />
              </label>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow p-4 space-y-3">
            <h2 className="font-semibold">実績追加</h2>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">大会名
                <input value={draft.event_name} onChange={(e)=>setDraft({...draft, event_name: e.target.value})} className="mt-1 w-full rounded-xl border p-2" />
              </label>
              <label className="text-sm">主催
                <input value={draft.org} onChange={(e)=>setDraft({...draft, org: e.target.value})} className="mt-1 w-full rounded-xl border p-2" />
              </label>
              <label className="text-sm">日付
                <input type="date" value={draft.date} onChange={(e)=>setDraft({...draft, date: e.target.value})} className="mt-1 w-full rounded-xl border p-2" />
              </label>
              <label className="text-sm">Buy-in (JPY)
                <input type="number" value={draft.buyin} onChange={(e)=>setDraft({...draft, buyin: Number(e.target.value)})} className="mt-1 w-full rounded-xl border p-2" />
              </label>
              <label className="text-sm">Field Size
                <input type="number" value={draft.field_size} onChange={(e)=>setDraft({...draft, field_size: Number(e.target.value)})} className="mt-1 w-full rounded-xl border p-2" />
              </label>
              <label className="text-sm">順位 (0=ノーキャッシュ)
                <input type="number" value={draft.place} onChange={(e)=>setDraft({...draft, place: Number(e.target.value)})} className="mt-1 w-full rounded-xl border p-2" />
              </label>
              <label className="text-sm">Payout (JPY)
                <input type="number" value={draft.payout} onChange={(e)=>setDraft({...draft, payout: Number(e.target.value)})} className="mt-1 w-full rounded-xl border p-2" />
              </label>
              <label className="col-span-2 text-sm">Proof URL（運営リザルト等）
                <input value={draft.proof_url} onChange={(e)=>setDraft({...draft, proof_url: e.target.value})} className="mt-1 w-full rounded-xl border p-2" />
              </label>
            </div>
            <button onClick={addAchievement} className="w-full rounded-xl bg-black text-white py-2 font-medium hover:opacity-90">実績を追加</button>
          </section>

          <section className="bg-white rounded-2xl shadow p-4 space-y-3">
            <h2 className="font-semibold">プロフィール用スニペット</h2>
            <div>
              <label className="text-xs font-medium">日本語</label>
              <textarea readOnly value={profileSnippetJP} className="w-full rounded-xl border p-2 text-sm" rows={2} />
            </div>
            <div>
              <label className="text-xs font-medium">English</label>
              <textarea readOnly value={profileSnippetEN} className="w-full rounded-xl border p-2 text-sm" rows={2} />
            </div>
          </section>
        </div>

        {/* Right column: List + Card preview */}
        <div className="md:col-span-3 space-y-4">
          <section className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">実績一覧（{achievements.length}）</h2>
            </div>
            <ul className="divide-y divide-neutral-200">
              {achievements.map((a, i) => (
                <li key={i} className="py-3 flex items-start gap-3">
                  <div className="grow">
                    <div className="font-medium">{a.event_name} <span className="text-xs text-neutral-500">{a.org}</span></div>
                    <div className="text-sm text-neutral-700">{a.date} ・ Buy-in ¥{a.buyin.toLocaleString()} ・ Field {a.field_size || "-"} ・ Place {a.place || "-"} ・ Payout ¥{(a.payout||0).toLocaleString()}</div>
                    {a.proof_url && (
                      <a href={a.proof_url} target="_blank" className="text-xs text-blue-600 underline">Proof</a>
                    )}
                  </div>
                  <button onClick={()=>removeAchievement(i)} className="text-xs px-2 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200">削除</button>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">統計（自動計算 / 直近12ヶ月）</h2>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat label="Games" value={stats.games} />
              <Stat label="ITM %" value={stats.itm + "%"} />
              <Stat label="ROI %" value={(isFinite(stats.roi) ? stats.roi : 0) + "%"} />
            </div>
          </section>

          {/* OG card preview */}
          <section className="bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-2xl p-6 text-white shadow relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-white/10" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold tracking-tight">{name}</div>
                  <div className="text-sm opacity-80">{handle} ・ {region}</div>
                  <div className="text-xs opacity-80 mt-1">{bio}</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-extrabold">{stats.itm}<span className="text-base align-super">%</span></div>
                  <div className="text-xs opacity-80">12-mo ITM</div>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs uppercase opacity-70 tracking-widest">Top Finishes</div>
                <div className="mt-2 grid md:grid-cols-3 grid-cols-1 gap-2">
                  {top3.map((a, i) => (
                    <div key={i} className="bg-white/10 rounded-xl p-3">
                      <div className="text-sm font-semibold truncate">{a.event_name}</div>
                      <div className="text-xs opacity-80 truncate">{a.org} ・ {a.date}</div>
                      <div className="text-sm mt-1">Place {a.place || "-"} ・ ¥{(a.payout||0).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="text-xs opacity-80">Proofs & full history → your.link/{handle.replace("@","")}</div>
                <div className="text-xs opacity-80">ROI {isFinite(stats.roi) ? stats.roi : 0}%</div>
              </div>
            </div>
          </section>

          <section className="text-xs text-neutral-500">
            <p>※ 本デモは情報公開用途のみ。金銭の仲介・エスクロー・出資募集を行いません。</p>
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-neutral-900 text-white p-4">
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
}

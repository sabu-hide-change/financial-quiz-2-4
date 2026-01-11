import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle,
  BookmarkCheck,
  LayoutList,
  ArrowRight,
  Check
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// --- クイズデータ定義 ---
const QUIZ_DATA = [
  {
    id: 1,
    title: "キャッシュの範囲",
    question: "キャッシュ・フロー計算書における現金及び現金同等物として、最も適切なものはどれか。",
    options: [
      "当座預金",
      "取得日から6ヶ月以内に償還されるコマーシャルペーパー",
      "決算日から3ヶ月以内に満期の来る定期預金",
      "取得日から6ヶ月以内に満期の来る定期預金"
    ],
    correct: 0,
    explanation: "キャッシュフロー計算書の「キャッシュ」は、「現金」と「現金同等物」を合わせたものです。\n●現金：手許現金、当座預金、普通預金など（定期預金は含まない）。\n●現金同等物：取得日から満期・償還日までの期間が3ヶ月以内の短期投資。決算日ではなく取得日が基準です。",
  },
  {
    id: 2,
    title: "間接法の非資金項目",
    question: "以下に掲げる当期のキャッシュ・フロー計算書（単位：千円）のうち、空欄ＡとＢに入る数値の組み合わせとして、最も適切なものはどれか。",
    image: "https://images.placeholder.com/600x200?text=CF:+Net+Income+30000,+Depreciation(A),+Allowance(B)", // 実際の画像パスがある場合は差し替え
    isTable: true,
    tableData: {
      header: ["項目", "金額"],
      rows: [["税引前当期純利益", "30,000"], ["減価償却費", "( A )"], ["貸倒引当金の増加額", "( B )"]]
    },
    options: [
      "Ａ： 6,000　Ｂ：－500",
      "Ａ：－6,000　Ｂ：－500",
      "Ａ：－6,000　Ｂ： 500",
      "Ａ： 6,000　Ｂ： 500"
    ],
    correct: 3,
    explanation: "非資金費用（減価償却費、貸倒引当金の増加）はキャッシュの流出を伴わない費用であるため、間接法では利益に加算（プラス）します。したがって、共にプラスの符号となります。",
  },
  {
    id: 3,
    title: "営業活動以外の損益",
    question: "以下に掲げる当期のキャッシュ・フロー計算書（単位：千円）のうち、空欄ＡとＢに入る数値の組み合わせとして、最も適切なものはどれか。",
    isTable: true,
    tableData: {
      header: ["項目", "金額"],
      rows: [["税引前当期純利益", "40,000"], ["減価償却費", "2,000"], ["貸倒引当金の増加額", "500"], ["受取利息及び受取配当金", "( A )"], ["支払利息", "( B )"]]
    },
    options: [
      "Ａ： 3,000　Ｂ：－5,000",
      "Ａ：－3,000　Ｂ：－5,000",
      "Ａ：－3,000　Ｂ： 5,000",
      "Ａ： 3,000　Ｂ： 5,000"
    ],
    correct: 2,
    explanation: "「営業活動以外の損益」は、小計より上で投資・財務活動の影響を除くために、損益計算書の符号を逆にします。受取利息（益）はマイナス、支払利息（損）はプラスで調整します。",
  },
  {
    id: 4,
    title: "営業活動で生じる資産と負債",
    question: "以下に掲げるキャッシュ・フロー計算書、貸借対照表に基づいて、空欄Ａ～Ｄに入る組み合わせとして適切なものはどれか。",
    isTable: true,
    tableData: {
      header: ["科目", "前期末", "当期末"],
      rows: [["売上債権", "10,000", "20,000"], ["棚卸資産", "12,000", "6,000"]]
    },
    options: [
      "Ａ：売上債権の増加額 Ｂ：－10,000 Ｃ：棚卸資産の減少額 Ｄ： 6,000",
      "Ａ：売上債権の増加額 Ｂ： 10,000 Ｃ：棚卸資産の減少額 Ｄ： 6,000",
      "Ａ：売上債権の増加額 Ｂ：－10,000 Ｃ：棚卸資産の減少額 Ｄ：－6,000",
      "Ａ：売上債権の減少額 Ｂ：－10,000 Ｃ：棚卸資産の増加額 Ｄ： 6,000"
    ],
    correct: 0,
    explanation: "資産の増加＝キャッシュマイナス、資産の減少＝キャッシュプラスです。\n売上債権：10,000→20,000（増加額10,000）⇒マイナス表示\n棚卸資産：12,000→6,000（減少額6,000）⇒プラス表示",
  },
  {
    id: 5,
    title: "小計以降の調整",
    question: "以下に掲げる資料について、空欄ＡとＢに入る数値の組み合わせとして、最も適切なものはどれか。",
    isTable: true,
    tableData: {
      header: ["項目", "前期末", "当期末 / 損益"],
      rows: [["前受利息", "500", "800"], ["未払利息", "400", "900"], ["受取利息・配当金", "-", "5,000"], ["支払利息", "-", "7,000"]]
    },
    options: [
      "Ａ： 5,300　Ｂ：－7,500",
      "Ａ： 5,300　Ｂ：－6,500",
      "Ａ： 4,700　Ｂ：－6,500",
      "Ａ： 4,700　Ｂ：－7,500"
    ],
    correct: 1,
    explanation: "利息受取額＝受取利息(5000)＋前受利息増加(300)＝5,300\n利息支払額＝－支払利息(7000)＋未払利息増加(500)＝－6,500\n小計より下は実際の現金の動き（収支）を計算します。",
  },
  {
    id: 6,
    title: "直接法 営業収入",
    question: "以下の資料に基づいて、直接法の営業収入の計算式として適切なものはどれか。",
    isTable: true,
    tableData: {
      header: ["科目", "金額"],
      rows: [["売上高", "150,000"], ["売上債権(増加)", "20,000"], ["貸倒引当金(増加)", "100"], ["貸倒引当金繰入", "200"], ["貸倒損失", "100"]]
    },
    options: [
      "150,000 － 20,000 － 200",
      "150,000 － 20,000 － 100",
      "150,000 ＋ 20,000 － 200",
      "150,000 ＋ 20,000 － 100"
    ],
    correct: 0,
    explanation: "営業収入 ＝ 売上高 － 売上債権増加額 － 当期貸倒高\n当期貸倒高 ＝ －貸倒引当金増加(100) ＋ 繰入(200) ＋ 貸倒損失(100) ＝ 200\nしたがって、150,000 － 20,000 － 200 となります。",
  },
  {
    id: 7,
    title: "直接法 仕入支出",
    question: "以下の資料に基づいて、原材料または商品の仕入支出として最も適切なものはどれか。",
    isTable: true,
    tableData: {
      header: ["科目", "前期末", "当期末 / 費用"],
      rows: [["棚卸資産", "80,000", "90,000"], ["仕入債務", "40,000", "50,000"], ["売上原価", "-", "30,000"]]
    },
    options: [
      "－50,000",
      "－30,000",
      "－20,000",
      "－10,000"
    ],
    correct: 1,
    explanation: "仕入支出 ＝ －売上原価(30,000) － 棚卸資産増加(10,000) ＋ 仕入債務増加(10,000) ＝ －30,000",
  },
  {
    id: 8,
    title: "直接法 人件費支出",
    question: "以下の資料に基づいて、人件費支出として最も適切なものはどれか。",
    isTable: true,
    tableData: {
      header: ["科目", "前期末", "当期末 / 費用"],
      rows: [["未払給料", "100", "400"], ["給料(費用)", "-", "3,000"]]
    },
    options: [
      "－3,500",
      "－3,100",
      "－2,700",
      "－2,500"
    ],
    correct: 2,
    explanation: "人件費支出 ＝ －給料費用(3,000) ＋ 未払給料増加(300) ＝ －2,700",
  },
  {
    id: 9,
    title: "投資活動の項目",
    question: "投資活動によるキャッシュフローの項目として、最も不適切なものはどれか。",
    options: [
      "有形固定資産の売却による収入",
      "有価証券の売却による収入",
      "投資有価証券の売却による収入",
      "貸付金の回収による収入",
      "株式の発行による収入"
    ],
    correct: 4,
    explanation: "「株式の発行による収入」は資金調達活動であるため、財務活動によるキャッシュ・フローに区分されます。それ以外は投資（資産の運用）に関する項目です。",
  },
  {
    id: 10,
    title: "投資活動によるCF 有形固定資産",
    question: "次の資料に基づいて、有形固定資産の売却による収入(A)として最も適切なものを選べ。",
    isTable: true,
    tableData: {
      header: ["科目", "前期末", "当期末"],
      rows: [["有形固定資産", "6,000", "5,000"], ["減価償却累計額", "-1,000", "-1,060"], ["固定資産売却損", "-", "100"], ["当期減価償却費", "-", "200"]]
    },
    options: [
      "500",
      "650",
      "760",
      "800"
    ],
    correct: 2,
    explanation: "売却資産の取得原価 = 6000 - 5000 = 1000\n売却分累計額 = 1000(期首) + 200(当期費) - 1060(期末) = 140\n売却資産の簿価 = 1000 - 140 = 860\n現金収入 = 簿価(860) - 売却損(100) = 760",
  },
  {
    id: 11,
    title: "財務活動によるCF 1",
    question: "以下の資料に基づいて、空欄ＡとＢに入る組み合わせとして、最も適切なものはどれか。",
    isTable: true,
    tableData: {
      header: ["科目", "前期末", "当期末"],
      rows: [["長期貸付金", "600", "300"], ["長期借入金", "1,000", "500"]]
    },
    options: [
      "Ａ：長期貸付金の回収による収入 Ｂ： 300",
      "Ａ：長期貸付金の貸付による支出 Ｂ：－300",
      "Ａ：長期借入による収入 Ｂ： 500",
      "Ａ：長期借入れの返済による支出 Ｂ：－500"
    ],
    correct: 3,
    explanation: "「長期貸付金」は投資活動CFです。「長期借入金」は財務活動CFです。\n長期借入金が1,000→500に減少したため、500の返済（支出）となります。",
  },
  {
    id: 12,
    title: "財務活動によるCF 2",
    question: "以下の資料に基づいて、空欄Ａ～Ｄに入る組み合わせとして適切なものはどれか。",
    isTable: true,
    tableData: {
      header: ["科目", "前期末", "当期末"],
      rows: [["資本金", "1,000", "1,500"], ["配当支払(注記)", "-", "200"]]
    },
    options: [
      "Ａ：自己株式の取得による支出 Ｂ：－500 Ｃ：配当金の支払額 Ｄ：－100",
      "Ａ：自己株式の取得による支出 Ｂ：－500 Ｃ：配当金の支払額 Ｄ：－200",
      "Ａ：株式の発行による収入 Ｂ： 500 Ｃ：配当金の支払額 Ｄ：－200",
      "Ａ：株式の発行による収入 Ｂ： 500 Ｃ：配当金の支払額 Ｄ：－100"
    ],
    correct: 2,
    explanation: "資本金が1000→1500に増加したので、株式発行による収入500。\n配当金の支払額は注記の200がそのままキャッシュアウトとなります。",
  }
];

// --- サブコンポーネント: 表表示 ---
const TableDisplay = ({ data }) => (
  <div className="my-4 overflow-hidden rounded-lg border border-blue-100">
    <table className="w-full text-sm text-left">
      <thead className="bg-blue-50 text-blue-700">
        <tr>
          {data.header.map((h, i) => (
            <th key={i} className="px-4 py-2 font-bold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white">
        {data.rows.map((row, i) => (
          <tr key={i} className="border-t border-blue-50">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2 text-gray-700">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- メインアプリケーション ---
export default function App() {
  const [screen, setScreen] = useState('menu'); // menu, summary, quiz, result
  const [quizMode, setQuizMode] = useState('all'); // all, incorrect, review
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { id: { choice, isCorrect } }
  const [showExplanation, setShowExplanation] = useState(false);
  
  // localStorage保存用
  const [db, setDb] = useState(() => {
    const saved = localStorage.getItem('smart_quiz_2_4_db');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('smart_quiz_2_4_db', JSON.stringify(db));
  }, [db]);

  // モードに基づいた問題リストの抽出
  const filteredQuizzes = useMemo(() => {
    if (quizMode === 'all') return QUIZ_DATA;
    if (quizMode === 'incorrect') return QUIZ_DATA.filter(q => db[q.id]?.lastResult === 'incorrect');
    if (quizMode === 'review') return QUIZ_DATA.filter(q => db[q.id]?.reviewNeeded);
    return QUIZ_DATA;
  }, [quizMode, db]);

  const currentQuiz = filteredQuizzes[currentIdx];

  // 回答処理
  const handleSelect = (idx) => {
    if (showExplanation) return;
    const isCorrect = idx === currentQuiz.correct;
    setUserAnswers({ ...userAnswers, [currentQuiz.id]: { choice: idx, isCorrect } });
    
    setDb(prev => ({
      ...prev,
      [currentQuiz.id]: {
        ...prev[currentQuiz.id],
        lastResult: isCorrect ? 'correct' : 'incorrect',
      }
    }));
    setShowExplanation(true);
  };

  const toggleReview = () => {
    setDb(prev => ({
      ...prev,
      [currentQuiz.id]: {
        ...prev[currentQuiz.id],
        reviewNeeded: !prev[currentQuiz.id]?.reviewNeeded
      }
    }));
  };

  const nextQuestion = () => {
    if (currentIdx < filteredQuizzes.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowExplanation(false);
    } else {
      setScreen('result');
    }
  };

  const stats = useMemo(() => {
    const solved = Object.keys(db).length;
    const correctCount = Object.values(db).filter(v => v.lastResult === 'correct').length;
    return [
      { name: '正解', value: correctCount, color: '#3b82f6' },
      { name: '不正解', value: solved - correctCount, color: '#f87171' },
      { name: '未着手', value: QUIZ_DATA.length - solved, color: '#e5e7eb' },
    ];
  }, [db]);

  // --- スクリーン描画 ---

  if (screen === 'menu') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-8 font-sans antialiased text-slate-900">
        <header className="w-full max-w-2xl text-center mb-8">
          <div className="inline-flex p-3 bg-blue-100 rounded-2xl mb-4">
            <Activity className="text-blue-600 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">スマート問題集 2-4</h1>
          <p className="text-slate-500 mt-2 font-medium">キャッシュ・フロー計算書</p>
        </header>

        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 sm:p-8 border border-slate-100">
          <div className="h-64 w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {stats.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4">
            <button 
              onClick={() => { setQuizMode('all'); setScreen('summary'); }}
              className="flex items-center justify-between p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold group shadow-lg shadow-blue-200"
            >
              <div className="flex items-center gap-4">
                <BookOpen className="w-6 h-6" />
                <div className="text-left">
                  <span>全問題に挑戦</span>
                  <p className="text-xs font-normal opacity-80">全12問を順番に解く</p>
                </div>
              </div>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button 
                disabled={!QUIZ_DATA.some(q => db[q.id]?.lastResult === 'incorrect')}
                onClick={() => { setQuizMode('incorrect'); setCurrentIdx(0); setScreen('quiz'); }}
                className="flex flex-col items-center p-5 bg-red-50 text-red-600 rounded-2xl border-2 border-red-100 hover:bg-red-100 transition-all disabled:opacity-40"
              >
                <XCircle className="w-8 h-8 mb-2" />
                <span className="font-bold">前回不正解のみ</span>
                <span className="text-xs opacity-70 mt-1">{QUIZ_DATA.filter(q => db[q.id]?.lastResult === 'incorrect').length}問</span>
              </button>
              <button 
                disabled={!QUIZ_DATA.some(q => db[q.id]?.reviewNeeded)}
                onClick={() => { setQuizMode('review'); setCurrentIdx(0); setScreen('quiz'); }}
                className="flex flex-col items-center p-5 bg-amber-50 text-amber-600 rounded-2xl border-2 border-amber-100 hover:bg-amber-100 transition-all disabled:opacity-40"
              >
                <BookmarkCheck className="w-8 h-8 mb-2" />
                <span className="font-bold">要復習のみ</span>
                <span className="text-xs opacity-70 mt-1">{QUIZ_DATA.filter(q => db[q.id]?.reviewNeeded).length}問</span>
              </button>
            </div>
            
            <button 
              onClick={() => setScreen('summary')}
              className="flex items-center justify-center gap-2 p-4 text-slate-500 hover:text-slate-800 transition-colors font-semibold"
            >
              <LayoutList className="w-5 h-5" />
              問題一覧・履歴を確認
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'summary') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <button onClick={() => setScreen('menu')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold">
            <ChevronLeft /> メニューへ戻る
          </button>
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
            <LayoutList className="text-blue-600" /> 問題一覧
          </h2>
          <div className="grid gap-3">
            {QUIZ_DATA.map((q, idx) => {
              const res = db[q.id];
              return (
                <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg text-sm font-bold">{idx + 1}</span>
                    <div>
                      <h4 className="font-bold text-slate-700">{q.title}</h4>
                      <div className="flex gap-3 mt-1">
                        {res?.lastResult === 'correct' && <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1"><Check className="w-3 h-3"/>前回正解</span>}
                        {res?.lastResult === 'incorrect' && <span className="text-[10px] text-red-500 font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/>前回不正解</span>}
                        {res?.reviewNeeded && <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1"><BookmarkCheck className="w-3 h-3"/>要復習</span>}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setQuizMode('all'); setCurrentIdx(idx); setScreen('quiz'); }}
                    className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                  >
                    挑戦
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'quiz') {
    const userAns = userAnswers[currentQuiz.id];
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex flex-col items-center antialiased">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setScreen('menu')} className="p-2 hover:bg-white rounded-xl transition-all">
              <Home className="text-slate-400" />
            </button>
            <div className="text-sm font-black text-blue-600 bg-blue-50 px-4 py-1 rounded-full">
              問題 {currentIdx + 1} / {filteredQuizzes.length}
            </div>
            <div className="w-8" />
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 transition-all">
            <div className="h-1.5 bg-slate-100">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${((currentIdx + 1) / filteredQuizzes.length) * 100}%` }}
              />
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg mb-2 tracking-widest uppercase italic">Question</span>
                <h3 className="text-xl font-bold leading-relaxed text-slate-800">{currentQuiz.question}</h3>
              </div>

              {currentQuiz.isTable && <TableDisplay data={currentQuiz.tableData} />}

              <div className="grid gap-3">
                {currentQuiz.options.map((opt, i) => {
                  let styles = "p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between font-semibold ";
                  if (showExplanation) {
                    if (i === currentQuiz.correct) styles += "border-blue-500 bg-blue-50 text-blue-800 ";
                    else if (userAns?.choice === i) styles += "border-red-500 bg-red-50 text-red-800 ";
                    else styles += "border-slate-50 text-slate-400 ";
                  } else {
                    styles += "border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600 ";
                  }

                  return (
                    <button key={i} onClick={() => handleSelect(i)} className={styles}>
                      <span>{opt}</span>
                      {showExplanation && i === currentQuiz.correct && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
                      {showExplanation && userAns?.choice === i && i !== currentQuiz.correct && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className={`p-4 rounded-2xl mb-6 flex items-start gap-4 ${userAns?.isCorrect ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'} border`}>
                    {userAns?.isCorrect ? <CheckCircle2 className="text-blue-600 mt-1 shrink-0" /> : <AlertCircle className="text-red-500 mt-1 shrink-0" />}
                    <div>
                      <p className={`font-bold ${userAns?.isCorrect ? 'text-blue-800' : 'text-red-800'}`}>
                        {userAns?.isCorrect ? '正解です！' : '不正解です'}
                      </p>
                      <p className="text-sm mt-1 opacity-80 leading-relaxed font-medium">正解：{currentQuiz.options[currentQuiz.correct]}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                    <h4 className="text-sm font-black text-slate-400 mb-3 uppercase tracking-tighter italic">Explanation</h4>
                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">{currentQuiz.explanation}</p>
                    
                    <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={db[currentQuiz.id]?.reviewNeeded || false} 
                          onChange={toggleReview}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm font-bold text-slate-500 group-hover:text-amber-500 transition-colors">要復習リストに追加</span>
                      </label>
                      <button 
                        onClick={nextQuestion}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg"
                      >
                        {currentIdx < filteredQuizzes.length - 1 ? '次の問題へ' : '結果を見る'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'result') {
    const sessionCorrect = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const sessionTotal = filteredQuizzes.length;
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-100">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">お疲れ様でした！</h2>
          <p className="text-slate-500 font-medium mb-8">今回の結果はこちらです</p>
          
          <div className="flex justify-center gap-8 mb-8">
            <div>
              <p className="text-4xl font-black text-blue-600">{sessionCorrect}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Correct</p>
            </div>
            <div className="w-px bg-slate-100" />
            <div>
              <p className="text-4xl font-black text-slate-300">{sessionTotal}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total</p>
            </div>
          </div>

          <button 
            onClick={() => { setScreen('menu'); setUserAnswers({}); setCurrentIdx(0); }}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
          >
            メニュー画面に戻る
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// --- シンプルなアイコン定義 ---
const Trophy = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);
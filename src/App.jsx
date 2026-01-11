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
  Bookmark,
  LayoutList,
  ArrowRight,
  Check,
  Activity,
  Calculator,
  Table as TableIcon,
  Trophy
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// --- クイズデータ (スマート問題集2-4 全12問 完全収録) ---
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
    explanation: "キャッシュフロー計算書の「キャッシュ」は、「現金及び現金同等物」のことを表します。「現金及び現金同等物」は、「現金」と「現金同等物」を合わせたものです。\n\n●「現金」の考え方\n手許現金だけでなく当座預金、普通預金などの預金も含まれます。一方、定期預金は「現金」に含まれません。いつでも引き出すことの出来るキャッシュが「現金」と考えます。\n\n●「現金同等物」の考え方\n容易に換金可能で、元本がほぼ保証される短期投資を指します。具体的には「取得した日から満期までの期間が3ヶ月以内」であることが基準となります。定期預金、譲渡性預金、コマーシャルペーパーなどが該当します。",
  },
  {
    id: 2,
    title: "間接法の非資金項目",
    question: "以下に掲げる当期のキャッシュ・フロー計算書（単位：千円）のうち、空欄ＡとＢに入る数値の組み合わせとして、最も適切なものはどれか。",
    tableData: {
      title: "キャッシュ・フロー計算書（一部）",
      header: ["項目", "金額"],
      rows: [
        ["Ⅰ 営業活動によるキャッシュ・フロー", ""],
        ["　税引前当期純利益", "30,000"],
        ["　減価償却費", "( A )"],
        ["　貸倒引当金の増加額", "( B )"],
        ["　(以下省略)", ""]
      ]
    },
    options: [
      "Ａ： 6,000　Ｂ：－500",
      "Ａ：－6,000　Ｂ：－500",
      "Ａ：－6,000　Ｂ： 500",
      "Ａ： 6,000　Ｂ： 500"
    ],
    correct: 3,
    explanation: "非資金費用には「減価償却費」と「貸倒引当金」があります。これらは損益計算書の損益のうち、キャッシュの出入りを伴わない「非資金項目の調整」です。\n\n●減価償却費：費用としてマイナスされている利益にその分をプラス（加算）する必要があります。\n●貸倒引当金：増加した分だけ利益にプラス（加算）する必要があります。\n符号を逆に覚えてしまわないように注意しましょう。",
  },
  {
    id: 3,
    title: "営業活動以外の損益",
    question: "以下に掲げる当期のキャッシュ・フロー計算書（単位：千円）のうち、空欄ＡとＢに入る数値の組み合わせとして、最も適切なものはどれか。",
    tableData: {
      title: "キャッシュ・フロー計算書（一部）",
      header: ["項目", "金額"],
      rows: [
        ["Ⅰ 営業活動によるキャッシュ・フロー", ""],
        ["　税引前当期純利益", "40,000"],
        ["　減価償却費", "2,000"],
        ["　貸倒引当金の増加額", "500"],
        ["　受取利息及び受取配当金", "( A )"],
        ["　支払利息", "( B )"],
        ["　(以下省略)", ""]
      ]
    },
    options: [
      "Ａ： 3,000　Ｂ：－5,000",
      "Ａ：－3,000　Ｂ：－5,000",
      "Ａ：－3,000　Ｂ： 5,000",
      "Ａ： 3,000　Ｂ： 5,000"
    ],
    correct: 2,
    explanation: "営業活動以外の損益には「受取利息及び受取配当金」、「支払利息」、「有形固定資産売却益」などがあります。これらは投資活動や財務活動の区分に記載されるべき項目のため、営業活動CFから除去する必要があります。\n調整のためには「損益計算書の符号を逆」にして記載します。収益（受取利息）はマイナス、費用（支払利息）はプラスとして調整します。",
  },
  {
    id: 4,
    title: "間接法 営業活動で生じる資産と負債",
    question: "以下に掲げる当期のキャッシュ・フロー計算書、貸借対照表に基づいて、空欄Ａ～Ｄに入る数値の組み合わせとして、最も適切なものはどれか。",
    tableData: {
      title: "貸借対照表（一部）",
      header: ["科目", "前期末", "当期末"],
      rows: [
        ["売上債権", "10,000", "20,000"],
        ["棚卸資産", "12,000", "6,000"]
      ]
    },
    options: [
      "Ａ：売上債権の増加額 Ｂ：－10,000 Ｃ：棚卸資産の減少額 Ｄ： 6,000",
      "Ａ：売上債権の増加額 Ｂ： 10,000 Ｃ：棚卸資産の減少額 Ｄ： 6,000",
      "Ａ：売上債権の増加額 Ｂ：－10,000 Ｃ：棚卸資産の減少額 Ｄ：－6,000",
      "Ａ：売上債権の減少額 Ｂ：－10,000 Ｃ：棚卸資産の増加額 Ｄ： 6,000"
    ],
    correct: 0,
    explanation: "●資産が増加 → キャッシュマイナス（例：売上債権が増える＝まだ代金を回収できていない）\n●資産が減少 → キャッシュプラス（例：棚卸資産が減る＝在庫が売れて現金化した）\n\n【本問のケース】\n売上債権：前期10,000 → 当期20,000（10,000増加）⇒ キャッシュフローでは「－10,000」\n棚卸資産：前期12,000 → 当期6,000（6,000減少）⇒ キャッシュフローでは「6,000」",
  },
  {
    id: 5,
    title: "小計以降の調整",
    question: "以下に掲げる当期のキャッシュ・フロー計算書、貸借対照表、損益計算書について、空欄ＡとＢに入る数値の組み合わせとして、最も適切なものはどれか。",
    tableData: {
      title: "各種資料（一部）",
      header: ["項目", "前期末", "当期末 / 損益額"],
      rows: [
        ["(B/S) 前受利息", "500", "800"],
        ["(B/S) 未払利息", "400", "900"],
        ["(P/L) 受取利息・配当金", "-", "5,000"],
        ["(P/L) 支払利息", "-", "7,000"]
      ]
    },
    options: [
      "Ａ： 5,300　Ｂ：－7,500",
      "Ａ： 5,300　Ｂ：－6,500",
      "Ａ： 4,700　Ｂ：－6,500",
      "Ａ： 4,700　Ｂ：－7,500"
    ],
    correct: 1,
    explanation: "小計以降は実際のキャッシュの動き（受取額・支払額）を計算します。\n\n●利息の受取額(A) ＝ P/L受取利息(5,000) ＋ 前受利息増加額(300) ＝ 5,300\n●利息の支払額(B) ＝ －P/L支払利息(7,000) ＋ 未払利息増加額(500) ＝ －6,500\n\n小計の前（調整項目）と、小計の以降（実際の収支）では符号の意味が異なることに注意しましょう。小計以降は受取ならプラス、支払ならマイナスです。",
  },
  {
    id: 6,
    title: "直接法 営業収入",
    question: "以下の貸借対照表、損益計算書に基づいて、キャッシュ・フロー計算書（直接法）の営業収入の計算式として、最も適切なものはどれか。",
    tableData: {
      title: "資料（一部）",
      header: ["科目", "前期末 / P/L項目", "当期末 / 金額"],
      rows: [
        ["売上債権", "30,000", "50,000"],
        ["貸倒引当金", "300", "400"],
        ["売上高", "-", "150,000"],
        ["貸倒引当金繰入額", "-", "200"],
        ["貸倒損失", "-", "100"]
      ]
    },
    options: [
      "150,000 － 20,000 － 200",
      "150,000 － 20,000 － 100",
      "150,000 ＋ 20,000 － 200",
      "150,000 ＋ 20,000 － 100"
    ],
    correct: 0,
    explanation: "直接法の営業収入 ＝ 売上高 － 売上債権増加額 － 当期貸倒高\n\n1. 売上債権増加額 ＝ 50,000 － 30,000 ＝ 20,000\n2. 当期貸倒高 ＝ －貸倒引当金増加額(100) ＋ 繰入額(200) ＋ 貸倒損失(100) ＝ 200\n\nよって式は「150,000 － 20,000 － 200」となります。貸倒れの分だけさらにキャッシュがマイナスされる点に注目してください。",
  },
  {
    id: 7,
    title: "直接法 仕入支出",
    question: "以下の貸借対照表、損益計算書に基づいて、キャッシュ・フロー計算書（直接法）の原材料または商品の仕入支出として、最も適切なものはどれか。",
    tableData: {
      title: "資料（一部）",
      header: ["科目", "前期末", "当期末 / P/L金額"],
      rows: [
        ["棚卸資産", "80,000", "90,000"],
        ["仕入債務", "40,000", "50,000"],
        ["売上原価", "-", "30,000"]
      ]
    },
    options: [
      "－50,000",
      "－30,000",
      "－20,000",
      "－10,000"
    ],
    correct: 1,
    explanation: "仕入支出 ＝ －売上原価 － 棚卸資産増加額 ＋ 仕入債務増加額\n\n1. 売上原価：30,000 (支出なのでマイナス)\n2. 棚卸資産増加：90,000 － 80,000 ＝ 10,000 (在庫増＝資金流出なのでマイナス)\n3. 仕入債務増加：50,000 － 40,000 ＝ 10,000 (債務増＝支払を待ってもらっているのでプラス)\n\n計算：－30,000 － 10,000 ＋ 10,000 ＝ －30,000",
  },
  {
    id: 8,
    title: "直接法 人件費支出",
    question: "以下の貸借対照表、損益計算書に基づいて、キャッシュ・フロー計算書（直接法）の人件費支出として、最も適切なものはどれか。",
    tableData: {
      title: "資料（一部）",
      header: ["科目", "前期末", "当期末 / P/L金額"],
      rows: [
        ["未払給料", "100", "400"],
        ["給料", "-", "3,000"]
      ]
    },
    options: [
      "－3,500",
      "－3,100",
      "－2,700",
      "－2,500"
    ],
    correct: 2,
    explanation: "人件費支出 ＝ －給料(P/L) ＋ 未払給料増加高 － 前払給料増加高\n\n給料費用が3,000発生していますが、未払給料が前期100から当期400へ（300増加）しています。つまり、費用のうち300分は「まだ払っていない」ため、キャッシュの流出は抑えられます。\n計算：－3,000 ＋ 300 ＝ －2,700",
  },
  {
    id: 9,
    title: "投資活動の項目",
    question: "キャッシュ・フロー計算書における投資活動によるキャッシュフローの項目として、最も不適切なものはどれか。",
    options: [
      "有形固定資産の売却による収入",
      "有価証券の売却による収入",
      "投資有価証券の売却による収入",
      "貸付金の回収による収入",
      "株式の発行による収入"
    ],
    correct: 4,
    explanation: "「株式の発行による収入」は、資金の調達活動にあたるため「財務活動によるキャッシュ・フロー」に区分されます。\n投資活動CFは、将来成長のために投資したキャッシュ（設備投資、関係会社への投資、貸付など）の増減を表します。取得と売却、貸付と回収は分けて表示するのがポイントです。",
  },
  {
    id: 10,
    title: "投資活動 有形固定資産の売却",
    question: "当期の資産と損益に関する資料（単位：千円）に基づいて、キャッシュ・フロー計算書の「有形固定資産の売却による収入」(A)として最も適切なものを選べ。なお、当期中の有形固定資産の取得はない。",
    data: [
      "・減価償却費200のうち当期売却分に関するものは40である。",
      "・前期末減価償却累計額1,000のうち当期売却分に関するものは100である。"
    ],
    tableData: {
      title: "資料（一部）",
      header: ["科目", "前期末", "当期末 / P/L金額"],
      rows: [
        ["有形固定資産", "6,000", "5,000"],
        ["減価償却累計額", "-1,000", "-1,060"],
        ["減価償却費", "-", "200"],
        ["固定資産売却損", "-", "100"]
      ]
    },
    options: ["500", "650", "760", "800"],
    correct: 2,
    explanation: "売却された有形固定資産の取得原価 ＝ 前期6,000 － 当期5,000 ＝ 1,000\n\n仕訳を考えると：\n(借) 減価償却累計額 100\n(借) 減価償却費(売却分) 40\n(借) 固定資産売却損 100\n(借) 現金（売却収入） XXX\n(貸) 有形固定資産 1,000\n\n現金(A) ＝ 1,000 － 100 － 40 － 100 ＝ 760",
  },
  {
    id: 11,
    title: "財務活動によるCFの項目",
    question: "以下に掲げる当期のキャッシュ・フロー計算書、貸借対照表に基づいて、空欄ＡとＢに入る数値の組み合わせとして、最も適切なものはどれか。",
    tableData: {
      title: "資料（一部） ※当期中の新規貸付・借入はない",
      header: ["科目", "前期末", "当期末"],
      rows: [
        ["長期貸付金", "600", "300"],
        ["長期借入金", "1,000", "500"]
      ]
    },
    options: [
      "Ａ：長期貸付金の回収による収入　Ｂ： 300",
      "Ａ：長期貸付金の貸付による支出　Ｂ：－300",
      "Ａ：長期借入による収入　Ｂ： 500",
      "Ａ：長期借入れの返済による支出　Ｂ：－500"
    ],
    correct: 3,
    explanation: "財務活動CFは、資金の調達・返済（借入、社債、株式、配当）を表します。\n\n●長期借入金：前期1,000 → 当期500（500減少） ⇒ 返済による支出「－500」\nなお、「長期貸付金」は資産の運用（投資活動）に関する項目のため、財務活動CFには含まれません。ここを間違えないようにしましょう。",
  },
  {
    id: 12,
    title: "株式・配当に関するCF",
    question: "以下に掲げる当期の資料（一部）に基づいて、財務活動CFの空欄Ａ～Ｄに入る組み合わせとして、最も適切なものはどれか。",
    tableData: {
      title: "資料（一部）",
      header: ["科目・項目", "前期末 / 条件", "当期末 / 金額"],
      rows: [
        ["資本金", "1,000", "1,500"],
        ["受取利息・配当金", "-", "300"],
        ["配当金の当期支払額", "-", "200"]
      ]
    },
    options: [
      "Ａ：自己株式の取得による支出 Ｂ：－500 Ｃ：配当金の支払額 Ｄ：－100",
      "Ａ：自己株式の取得による支出 Ｂ：－500 Ｃ：配当金の支払額 Ｄ：－200",
      "Ａ：株式の発行による収入 Ｂ： 500 Ｃ：配当金の支払額 Ｄ：－200",
      "Ａ：株式の発行による収入 Ｂ： 500 Ｃ：配当金の支払額 Ｄ：－100"
    ],
    correct: 2,
    explanation: "●株式の発行(A)：資本金が1,000から1,500へ500増加しています。これは株式発行による収入(B) 500です。\n●配当金の支払(C)：資料より200です。これはキャッシュの流出(D) －200です。\n\n※損益計算書上の「受取利息・配当金」は営業活動CF（または小計以降）に影響するもので、財務活動の「配当金の支払額」には影響しません。",
  }
];

// --- デザイン用カラー ---
const COLORS = ['#3b82f6', '#f87171', '#94a3b8'];

// --- メインコンポーネント ---
export default function App() {
  const [screen, setScreen] = useState('menu'); // menu, summary, quiz, result
  const [quizMode, setQuizMode] = useState('all'); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionResults, setSessionResults] = useState({}); 
  const [showExpl, setShowExpl] = useState(false);
  
  // 履歴の永続化
  const [db, setDb] = useState(() => {
    const saved = localStorage.getItem('smart_quiz_2_4_db_v2');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('smart_quiz_2_4_db_v2', JSON.stringify(db));
  }, [db]);

  // モードフィルタリング
  const activeQuizList = useMemo(() => {
    if (quizMode === 'all') return QUIZ_DATA;
    if (quizMode === 'wrong') return QUIZ_DATA.filter(q => db[q.id]?.last === 'incorrect');
    if (quizMode === 'review') return QUIZ_DATA.filter(q => db[q.id]?.review);
    return QUIZ_DATA;
  }, [quizMode, db]);

  const quiz = activeQuizList[currentIdx];

  const handleAnswer = (choice) => {
    if (showExpl) return;
    const isCorrect = choice === quiz.correct;
    setSessionResults({ ...sessionResults, [quiz.id]: { choice, isCorrect } });
    
    setDb(prev => ({
      ...prev,
      [quiz.id]: {
        ...prev[quiz.id],
        last: isCorrect ? 'correct' : 'incorrect',
      }
    }));
    setShowExpl(true);
  };

  const toggleReview = () => {
    setDb(prev => ({
      ...prev,
      [quiz.id]: { ...prev[quiz.id], review: !prev[quiz.id]?.review }
    }));
  };

  const chartData = useMemo(() => {
    const correct = Object.values(db).filter(v => v.last === 'correct').length;
    const wrong = Object.values(db).filter(v => v.last === 'incorrect').length;
    const untouched = QUIZ_DATA.length - (correct + wrong);
    return [
      { name: '正解', value: correct },
      { name: '不正解', value: wrong },
      { name: '未着手', value: untouched },
    ];
  }, [db]);

  // --- UI Parts ---
  const Table = ({ data }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-blue-100 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-blue-50 text-blue-700">
          <tr>{data.header.map((h, i) => <th key={i} className="px-4 py-2 font-bold">{h}</th>)}</tr>
        </thead>
        <tbody className="bg-white">
          {data.rows.map((row, i) => (
            <tr key={i} className="border-t border-blue-50">
              {row.map((cell, j) => <td key={j} className="px-4 py-2 text-gray-700">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (screen === 'menu') return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 flex flex-col items-center">
      <div className="w-full max-w-2xl mt-8 mb-8 text-center">
        <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">スマート問題集 2-4</h1>
        <p className="text-slate-500 font-medium">キャッシュ・フロー計算書 完全攻略</p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {chartData.map((e, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 mt-6">
          <button onClick={() => { setQuizMode('all'); setScreen('summary'); }} className="flex items-center justify-between p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100">
            <div className="flex items-center gap-4"><BookOpen /> <span>全問題に挑戦</span></div>
            <ArrowRight />
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button disabled={!chartData[1].value} onClick={() => { setQuizMode('wrong'); setCurrentIdx(0); setScreen('quiz'); }} className="flex flex-col items-center p-5 bg-red-50 text-red-600 rounded-2xl border-2 border-red-100 hover:bg-red-100 transition-all disabled:opacity-40">
              <XCircle className="mb-2" /> <span className="font-bold text-sm">不正解のみ</span>
            </button>
            <button disabled={!Object.values(db).some(v=>v.review)} onClick={() => { setQuizMode('review'); setCurrentIdx(0); setScreen('quiz'); }} className="flex flex-col items-center p-5 bg-amber-50 text-amber-600 rounded-2xl border-2 border-amber-100 hover:bg-amber-100 transition-all disabled:opacity-40">
              <Bookmark className="mb-2" /> <span className="font-bold text-sm">要復習のみ</span>
            </button>
          </div>
          
          <button onClick={() => setScreen('summary')} className="mt-4 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold">
            <LayoutList size={20} /> 問題一覧と過去の正誤
          </button>
        </div>
      </div>
    </div>
  );

  if (screen === 'summary') return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <button onClick={() => setScreen('menu')} className="mb-6 flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600"><ChevronLeft /> 戻る</button>
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><LayoutList className="text-blue-600" /> 問題一覧・履歴</h2>
        <div className="space-y-3">
          {QUIZ_DATA.map((q, i) => {
            const h = db[q.id];
            return (
              <div key={q.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <span className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg text-sm font-bold">{i+1}</span>
                  <div>
                    <h3 className="font-bold text-slate-700">{q.title}</h3>
                    <div className="flex gap-4 mt-1 text-[10px] font-black uppercase tracking-tighter">
                      {h?.last === 'correct' && <span className="text-blue-500 flex items-center gap-1"><Check size={12}/> 前回正解</span>}
                      {h?.last === 'incorrect' && <span className="text-red-500 flex items-center gap-1"><XCircle size={12}/> 前回不正解</span>}
                      {h?.review && <span className="text-amber-500 flex items-center gap-1"><Bookmark size={12}/> 要復習</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => { setQuizMode('all'); setCurrentIdx(i); setScreen('quiz'); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all">開く</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (screen === 'quiz') return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl mt-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setScreen('menu')} className="p-2 hover:bg-white rounded-xl transition-all"><Home className="text-slate-400" /></button>
          <div className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black">問題 {currentIdx+1} / {activeQuizList.length}</div>
          <div className="w-10"></div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="h-1 bg-slate-100"><div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((currentIdx+1)/activeQuizList.length)*100}%` }} /></div>
          
          <div className="p-6 sm:p-8">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block tracking-tighter">Section: {quiz.title}</span>
            <h2 className="text-xl font-bold text-slate-800 leading-relaxed mb-4">{quiz.question}</h2>
            
            {quiz.data && (
              <ul className="mb-4 space-y-1 bg-slate-50 p-4 rounded-xl text-sm text-slate-600 border border-slate-100">
                {quiz.data.map((d, i) => <li key={i} className="flex gap-2 leading-relaxed"><span>・</span>{d}</li>)}
              </ul>
            )}
            
            {quiz.tableData && <Table data={quiz.tableData} />}

            <div className="grid gap-3 mt-6">
              {quiz.options.map((opt, i) => {
                let s = "p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between font-bold text-sm ";
                if (showExpl) {
                  if (i === quiz.correct) s += "border-blue-500 bg-blue-50 text-blue-700 ";
                  else if (sessionResults[quiz.id]?.choice === i) s += "border-red-500 bg-red-50 text-red-700 ";
                  else s += "border-slate-50 text-slate-300 ";
                } else s += "border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600 ";

                return (
                  <button key={i} onClick={() => handleAnswer(i)} className={s}>
                    <span>{opt}</span>
                    {showExpl && i === quiz.correct && <CheckCircle2 size={18} />}
                    {showExpl && sessionResults[quiz.id]?.choice === i && i !== quiz.correct && <XCircle size={18} />}
                  </button>
                );
              })}
            </div>

            {showExpl && (
              <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-4 rounded-2xl mb-6 flex items-start gap-4 border ${sessionResults[quiz.id]?.isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                  {sessionResults[quiz.id]?.isCorrect ? <CheckCircle2 className="mt-1 shrink-0" /> : <AlertCircle className="mt-1 shrink-0" />}
                  <div>
                    <p className="font-black text-lg">{sessionResults[quiz.id]?.isCorrect ? '正解！' : '不正解...'}</p>
                    <p className="text-sm font-bold opacity-80 mt-1">正答：{quiz.options[quiz.correct]}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-3 text-blue-600"><Calculator size={18}/><h4 className="font-black text-xs uppercase tracking-widest">解説</h4></div>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap font-medium">{quiz.explanation}</p>
                  
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <button onClick={toggleReview} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all border-2 ${db[quiz.id]?.review ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-slate-200 text-slate-400 hover:border-amber-200 hover:text-amber-500'}`}>
                      <Bookmark size={18} fill={db[quiz.id]?.review ? "currentColor" : "none"} /> <span>要復習に追加</span>
                    </button>
                    <button onClick={() => { if(currentIdx < activeQuizList.length - 1) { setCurrentIdx(currentIdx+1); setShowExpl(false); } else setScreen('result'); }} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                      {currentIdx < activeQuizList.length - 1 ? '次へ' : '結果'} <ChevronRight size={18} />
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

  if (screen === 'result') {
    const correct = Object.values(sessionResults).filter(r => r.isCorrect).length;
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center border border-slate-100">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6"><Trophy className="text-blue-600 w-10 h-10" /></div>
          <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tighter">お疲れ様でした！</h2>
          <div className="flex justify-center gap-8 my-8">
            <div><p className="text-5xl font-black text-blue-600">{correct}</p><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">Correct</p></div>
            <div className="w-px bg-slate-100"></div>
            <div><p className="text-5xl font-black text-slate-200">{activeQuizList.length}</p><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">Total</p></div>
          </div>
          <button onClick={() => { setScreen('menu'); setSessionResults({}); setCurrentIdx(0); setShowExpl(false); }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-100">メニューに戻る</button>
        </div>
      </div>
    );
  }
}
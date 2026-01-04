import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  BookOpen, 
  CheckSquare, 
  ArrowRight,
  List,
  Trophy,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

// --- データ定義 (全12問: 2-4 キャッシュ・フロー計算書) ---

const problemData = [
  {
    id: 1,
    category: "キャッシュの範囲",
    question: "キャッシュ・フロー計算書における「現金及び現金同等物」として、最も適切なものはどれか。",
    options: [
      "当座預金",
      "取得日から6ヶ月以内に償還されるコマーシャルペーパー",
      "決算日から3ヶ月以内に満期の来る定期預金",
      "取得日から6ヶ月以内に満期の来る定期預金"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <p class="mb-2">「現金及び現金同等物」の定義を整理しましょう。</p>
      <ul class="list-disc pl-5 space-y-2 text-sm">
        [cite_start]<li><strong>現金：</strong> 手許現金、当座預金、普通預金など（いつでも引き出せるもの）。定期預金はここに含まれません [cite: 2300]。</li>
        [cite_start]<li><strong>現金同等物：</strong> 容易に換金可能で、元本変動リスクが低い短期投資。ポイントは、<strong>「取得日」から満期・償還まで「3ヶ月以内」</strong>であることです [cite: 2300]。</li>
      </ul>
      [cite_start]<p class="mt-2 text-xs text-red-600">※「決算日」から3ヶ月ではなく、「取得日」から3ヶ月である点に注意してください [cite: 2306]。</p>
    `
  },
  {
    id: 2,
    category: "間接法：非資金項目",
    question: "キャッシュ・フロー計算書（間接法）において、空欄ＡとＢに入る数値の組み合わせとして最も適切なものはどれか。（単位：千円）\n\n【営業活動によるC/F】\n・税引前当期純利益： 30,000\n・減価償却費： ( A )\n・貸倒引当金の増加額： ( B )",
    options: [
      "Ａ： 6,000　Ｂ：－500",
      "Ａ：－6,000　Ｂ：－500",
      "Ａ：－6,000　Ｂ： 500",
      "Ａ： 6,000　Ｂ： 500"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      [cite_start]<p class="mb-2">間接法では、損益計算書（P/L）の利益からスタートし、<strong>「お金の動きを伴わない費用（非資金費用）」</strong>を足し戻します [cite: 2318]。</p>
      <div class="bg-blue-50 p-3 rounded text-sm mb-2">
        [cite_start]<p><strong>● 減価償却費：</strong> 費用として利益から引かれていますが、実際にお金は出ていかないため、<strong>プラス</strong>します [cite: 2318]。</p>
        [cite_start]<p><strong>● 貸倒引当金の増加：</strong> 同様に、お金は出ていかないため利益に<strong>プラス</strong>します [cite: 2318]。</p>
      </div>
      <p class="font-bold text-center">A：+6,000 / B：+500</p>
    `
  },
  {
    id: 3,
    category: "間接法：営業外損益",
    question: "キャッシュ・フロー計算書（間接法）において、空欄ＡとＢに入る符号を含めた数値として最も適切なものはどれか。（単位：千円）\n\n・税引前当期純利益： 40,000\n・受取利息及び受取配当金： ( A )\n・支払利息： ( B )\n（小計の上での調整）",
    options: [
      "Ａ： 3,000　Ｂ：－5,000",
      "Ａ：－3,000　Ｂ：－5,000",
      "Ａ：－3,000　Ｂ： 5,000",
      "Ａ： 3,000　Ｂ： 5,000"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      [cite_start]<p class="mb-2">小計より上の段では、<strong>「営業活動以外（投資・財務）の損益」</strong>を一旦リセット（除去）します [cite: 2330]。</p>
      <div class="bg-gray-100 p-3 rounded text-sm mb-2">
        [cite_start]<p><strong>ルール：P/Lの符号を逆にする！</strong> [cite: 2330]</p>
        <ul class="list-disc pl-5 mt-1">
          <li><strong>受取利息（利益）：</strong> 利益に含まれているので、<strong>マイナス(A)</strong>して除去します。</li>
          <li><strong>支払利息（費用）：</strong> 利益から引かれているので、<strong>プラス(B)</strong>して除去します。</li>
        </ul>
      </div>
      [cite_start]<p class="text-xs text-gray-500">※これらは後ほど「小計」の下で、実際の「現金収支額」として再計上されます [cite: 2356]。</p>
    `
  },
  {
    id: 4,
    category: "間接法：資産・負債の増減",
    question: "資料に基づいて、キャッシュ・フロー計算書の空欄Ａ～Ｄに入る組み合わせを選べ。\n\n【B/S一部】\n売上債権： 前期 10,000 → 当期 20,000\n棚卸資産： 前期 12,000 → 当期 6,000\n\n【C/F】\n( A )： ( B )\n( C )： ( D )",
    options: [
      "Ａ：売上債権の増加額　Ｂ：－10,000　Ｃ：棚卸資産の減少額　Ｄ： 6,000",
      "Ａ：売上債権の増加額　Ｂ： 10,000　Ｃ：棚卸資産の減少額　Ｄ： 6,000",
      "Ａ：売上債権の増加額　Ｂ：－10,000　Ｃ：棚卸資産の減少額　Ｄ：－6,000",
      "Ａ：売上債権の減少額　Ｂ：－10,000　Ｃ：棚卸資産の増加額　Ｄ： 6,000"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      <div class="grid grid-cols-2 gap-2 text-xs mb-3">
        <div class="border p-2 bg-blue-50 rounded">
          <p class="font-bold">資産が増加</p>
          <p>＝キャッシュ <span class="text-red-600 font-bold">マイナス</span></p>
        </div>
        <div class="border p-2 bg-orange-50 rounded">
          <p class="font-bold">負債が増加</p>
          <p>＝キャッシュ <span class="text-blue-600 font-bold">プラス</span></p>
        </div>
      </div>
      <ul class="list-disc pl-5 text-sm space-y-1">
        [cite_start]<li><strong>売上債権(1万増)：</strong> 売上はあるがお金をもらっていないため、利益から<strong>10,000をマイナス</strong>します [cite: 2344]。</li>
        [cite_start]<li><strong>棚卸資産(6千減)：</strong> 在庫が減った＝売れてお金になったと考えるため、利益に<strong>6,000をプラス</strong>します [cite: 2346]。</li>
      </ul>
    `
  },
  {
    id: 5,
    category: "間接法：小計以降",
    question: "資料に基づいて、空欄ＡとＢに入る数値の組み合わせを選べ。\n\n【B/S】前受利息：前500→当800、未払利息：前400→当900\n【P/L】受取利息・配当金：5,000、支払利息：7,000\n\n( A ) 利息及び配当金の受取額\n( B ) 利息の支払額",
    options: [
      "Ａ： 5,300　Ｂ：－7,500",
      "Ａ： 5,300　Ｂ：－6,500",
      "Ａ： 4,700　Ｂ：－6,500",
      "Ａ： 4,700　Ｂ：－7,500"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      [cite_start]<p class="text-sm mb-2">「小計」より下では、<strong>「実際に動いた現金の額」</strong>を計算します [cite: 2356]。</p>
      <div class="space-y-2 text-sm">
        <div class="border p-2 rounded">
          <p class="font-bold">A：受取額の計算</p>
          [cite_start]<p>受取利息(5,000) ＋ 前受利息の増加(300) ＝ <strong>5,300</strong> [cite: 2360]</p>
        </div>
        <div class="border p-2 rounded">
          <p class="font-bold">B：支払額の計算</p>
          [cite_start]<p>支払利息(△7,000) ＋ 未払利息の増加(500) ＝ <strong>△6,500</strong> [cite: 2363]</p>
          <p class="text-xs text-gray-500">※未払いが増えた＝その分まだ払っていないので、支出額は減ります(プラス調整)。</p>
        </div>
      </div>
    `
  },
  {
    id: 6,
    category: "直接法：営業収入",
    question: "直接法の「営業収入」の計算式として、最も適切なものはどれか。\n\n売上高：150,000\n売上債権増加額：20,000\n貸倒引当金：前300→当400\n貸倒引当金繰入額：200\n貸倒損失：100",
    options: [
      "150,000 － 20,000 － 200",
      "150,000 － 20,000 － 100",
      "150,000 ＋ 20,000 － 200",
      "150,000 ＋ 20,000 － 100"
    ],
    correctAnswer: 0,
    explanation: `
      <p class="font-bold mb-2">正解：ア</p>
      [cite_start]<p class="text-sm mb-2"><strong>営業収入 ＝ 売上高 － 売上債権増加額 － 当期貸倒高</strong> [cite: 2373]</p>
      <div class="bg-blue-50 p-3 rounded text-sm mb-2">
        <p class="font-bold">当期貸倒高の計算：</p>
        [cite_start]<p>－(引当金増加 100) ＋ 繰入 200 ＋ 損失 100 ＝ <strong>200</strong> [cite: 2375]</p>
      </div>
      [cite_start]<p class="text-sm">よって、150,000 － 20,000 － 200 となります [cite: 2377]。</p>
      <p class="text-xs text-gray-500">※「貸倒れ」はお金が入ってこないことが確定した額なので、収入からマイナスします。</p>
    `
  },
  {
    id: 7,
    category: "直接法：仕入支出",
    question: "直接法の「原材料または商品の仕入支出」として、最も適切なものはどれか。\n\n売上原価：30,000\n棚卸資産：前80,000 → 当90,000\n仕入債務：前40,000 → 当50,000",
    options: [
      "－50,000",
      "－30,000",
      "－20,000",
      "－10,000"
    ],
    correctAnswer: 1,
    explanation: `
      <p class="font-bold mb-2">正解：イ</p>
      [cite_start]<p class="text-sm mb-2"><strong>仕入支出 ＝ －売上原価 － 棚卸資産増加額 ＋ 仕入債務増加額</strong> [cite: 2387]</p>
      <div class="bg-gray-100 p-3 rounded text-sm font-mono">
        <p>－30,000 (売上原価)</p>
        <p>－10,000 (棚卸資産が増えた＝その分買った)</p>
        <p>＋10,000 (仕入債務が増えた＝その分まだ払ってない)</p>
        [cite_start]<p class="border-t mt-1 font-bold">＝ －30,000 [cite: 2391]</p>
      </div>
    `
  },
  {
    id: 8,
    category: "直接法：人件費支出",
    question: "直接法の「人件費支出」として、最も適切なものはどれか。\n\n給料：3,000\n未払給料：前100 → 当400",
    options: [
      "－3,500",
      "－3,100",
      "－2,700",
      "－2,500"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      [cite_start]<p class="text-sm mb-2"><strong>人件費支出 ＝ －人件費項目 ＋ 未払給料増加額 － 前払給料増加額</strong> [cite: 2402]</p>
      <div class="bg-blue-50 p-3 rounded text-sm">
        <p>－3,000 (給料)</p>
        <p>＋300 (未払いが増えた＝その分まだ払っていない)</p>
        [cite_start]<p class="font-bold mt-1">＝ －2,700 [cite: 2405]</p>
      </div>
    `
  },
  {
    id: 9,
    category: "投資活動C/F",
    question: "投資活動によるキャッシュ・フローの項目として、最も不適切なものはどれか。",
    options: [
      "有形固定資産の売却による収入",
      "有価証券の売却による収入",
      "投資有価証券の売却による収入",
      "貸付金の回収による収入",
      "株式の発行による収入"
    ],
    correctAnswer: 4,
    explanation: `
      <p class="font-bold mb-2">正解：オ</p>
      [cite_start]<p class="text-sm mb-2"><strong>投資活動によるC/F：</strong> 将来のために設備投資したり、他社へ貸し付けたりする活動 [cite: 2415]。</p>
      [cite_start]<p class="text-sm text-red-600 font-bold">「株式の発行による収入」は、資金調達の活動なので「財務活動によるC/F」に表示されます [cite: 2425]。</p>
    `
  },
  {
    id: 10,
    category: "投資活動C/F：資産売却",
    question: "資料に基づいて、有形固定資産の売却による収入(A)を求めよ。（単位：千円）\n\n・売却した資産の取得原価： 1,000\n・売却分に関する累計額： 100\n・固定資産売却損： 100\n・売却分に関する減価償却費： 40",
    options: [
      "500",
      "650",
      "760",
      "800"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      [cite_start]<p class="text-sm mb-2">売却した瞬間の簿価を計算し、そこから売却損益と当期償却費を調整して「現金（収入）」を逆算します [cite: 2436]。</p>
      <div class="bg-blue-50 p-3 rounded text-sm space-y-1">
        <p><strong>売却による収入：</strong></p>
        <p>取得原価 1,000</p>
        <p>－ 累計額 100 (これまでの償却)</p>
        <p>－ 売却損 100 (損した分だけ現金が少ない)</p>
        <p>－ 減価償却費 40 (当期分の償却)</p>
        [cite_start]<p class="font-bold text-lg text-blue-700 mt-1">＝ 760 [cite: 2444]</p>
      </div>
    `
  },
  {
    id: 11,
    category: "財務活動C/F",
    question: "資料に基づいて、空欄ＡとＢに入る組み合わせを選べ。\n\n【B/S】長期借入金：前 1,000 → 当 500\n※当期中の新規借入はない。",
    options: [
      "Ａ：長期貸付金の回収による収入　Ｂ： 300",
      "Ａ：長期貸付金の貸付による支出　Ｂ：－300",
      "Ａ：長期借入による収入　Ｂ： 500",
      "Ａ：長期借入れの返済による支出　Ｂ：－500"
    ],
    correctAnswer: 3,
    explanation: `
      <p class="font-bold mb-2">正解：エ</p>
      [cite_start]<p class="text-sm">長期借入金（負債）が1,000から500に減ったということは、500円を返済してお金が出ていったということです [cite: 2458]。</p>
      [cite_start]<p class="text-sm mt-2"><strong>財務活動によるC/F：</strong> 借入(収入)、返済(支出)、株式発行(収入)など、資金の調達・返済に関する項目 [cite: 2456]。</p>
      [cite_start]<p class="text-xs text-gray-500">※「貸付金」は投資活動の項目なので間違いです [cite: 2458]。</p>
    `
  },
  {
    id: 12,
    category: "財務活動C/F：配当と増資",
    question: "資料に基づいて、空欄Ａ～Ｄに入る組み合わせを選べ。\n\n・資本金：前 1,000 → 当 1,500\n・配当金の当期支払額： 200",
    options: [
      "Ａ：自己株式の取得による支出　Ｂ：－500　Ｃ：配当金の支払額　Ｄ：－100",
      "Ａ：自己株式の取得による支出　Ｂ：－500　Ｃ：配当金の支払額　Ｄ：－200",
      "Ａ：株式の発行による収入　Ｂ： 500　Ｃ：配当金の支払額　Ｄ：－200",
      "Ａ：株式の発行による収入　Ｂ： 500　Ｃ：配当金の支払額　Ｄ：－100"
    ],
    correctAnswer: 2,
    explanation: `
      <p class="font-bold mb-2">正解：ウ</p>
      <ul class="list-disc pl-5 text-sm space-y-2">
        [cite_start]<li><strong>株式の発行による収入(A, B)：</strong> 資本金が500増えているため、増資による収入が500あったと考えます [cite: 2470]。</li>
        [cite_start]<li><strong>配当金の支払額(C, D)：</strong> 資料より、実際に支払った200がそのままマイナスとして記載されます [cite: 2472]。</li>
      </ul>
      [cite_start]<p class="text-xs text-gray-500 mt-2">※受取配当金は営業活動C/F（小計より下）に入る項目なので、ここには影響しません [cite: 2472]。</p>
    `
  }
];

// --- コンポーネント実装 ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); 
  const [quizMode, setQuizMode] = useState('all'); 
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [reviewFlags, setReviewFlags] = useState({}); 
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem('app_financial_2_4_answers')) || {};
    const savedReviews = JSON.parse(localStorage.getItem('app_financial_2_4_reviews')) || {};
    setUserAnswers(savedAnswers);
    setReviewFlags(savedReviews);
  }, []);

  useEffect(() => {
    localStorage.setItem('app_financial_2_4_answers', JSON.stringify(userAnswers));
    localStorage.setItem('app_financial_2_4_reviews', JSON.stringify(reviewFlags));
  }, [userAnswers, reviewFlags]);

  const startQuiz = (mode) => {
    let targets = [];
    if (mode === 'all') {
      targets = problemData;
    } else if (mode === 'wrong') {
      targets = problemData.filter(p => {
        const hist = userAnswers[p.id];
        return hist && !hist.isCorrect;
      });
    } else if (mode === 'review') {
      targets = problemData.filter(p => reviewFlags[p.id]);
    }

    if (targets.length === 0) {
      alert("対象となる問題がありません。");
      return;
    }

    setQuizMode(mode);
    setFilteredProblems(targets);
    setCurrentProblemIndex(0);
    setShowExplanation(false);
    setSelectedOption(null);
    setCurrentScreen('quiz');
  };

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    const problem = filteredProblems[currentProblemIndex];
    const isCorrect = optionIndex === problem.correctAnswer;
    
    setUserAnswers(prev => ({
      ...prev,
      [problem.id]: {
        answerIndex: optionIndex,
        isCorrect: isCorrect,
        timestamp: new Date().toISOString()
      }
    }));
    
    setShowExplanation(true);
  };

  const nextProblem = () => {
    if (currentProblemIndex < filteredProblems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      setCurrentScreen('result');
    }
  };

  const toggleReview = (problemId) => {
    setReviewFlags(prev => {
      const newVal = !prev[problemId];
      return { ...prev, [problemId]: newVal };
    });
  };

  const stats = useMemo(() => {
    const total = problemData.length;
    const answeredCount = Object.keys(userAnswers).length;
    const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const reviewCount = Object.values(reviewFlags).filter(Boolean).length;
    return { total, answeredCount, correctCount, reviewCount };
  }, [userAnswers, reviewFlags]);

  if (currentScreen === 'menu') {
    const pieData = [
      { name: '正解', value: stats.correctCount, color: '#4ade80' },
      { name: '未回答', value: stats.total - stats.correctCount, color: '#e2e8f0' },
    ];

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 p-4 font-sans">
        <div className="max-w-xl mx-auto space-y-6">
          <header className="text-center py-6">
            <h1 className="text-2xl font-bold text-slate-700 italic flex items-center justify-center gap-2">
              <ArrowDownCircle className="text-blue-500" /> C/Fマスター 2-4 <ArrowUpCircle className="text-green-500" />
            </h1>
            <p className="text-slate-500 text-sm mt-1">キャッシュ・フロー計算書 徹底攻略</p>
          </header>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4 w-full flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> 学習状況
            </h2>
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-8 text-center mt-2 w-full">
              <div>
                <p className="text-2xl font-bold text-green-500">{stats.correctCount}<span className="text-sm text-gray-400">/{stats.total}</span></p>
                <p className="text-xs text-gray-500 font-bold">正解数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-500">{stats.reviewCount}</p>
                <p className="text-xs text-gray-500 font-bold">要復習</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <button 
              onClick={() => startQuiz('all')}
              className="flex items-center justify-between p-5 bg-slate-800 text-white rounded-2xl shadow-md hover:bg-slate-900 transition active:scale-95"
            >
              <div className="flex items-center gap-3">
                <Play className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">全ての問題を解く</div>
                  <div className="text-xs opacity-70">全12問をマスター</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => startQuiz('wrong')}
                className="flex flex-col items-center justify-center p-4 bg-white border-2 border-red-100 text-red-600 rounded-2xl hover:bg-red-50 transition active:scale-95"
              >
                <RotateCcw className="w-6 h-6 mb-2" />
                <span className="font-bold text-sm">前回 × のみ</span>
              </button>
              <button 
                onClick={() => startQuiz('review')}
                className="flex flex-col items-center justify-center p-4 bg-white border-2 border-orange-100 text-orange-600 rounded-2xl hover:bg-orange-50 transition active:scale-95"
              >
                <CheckSquare className="w-6 h-6 mb-2" />
                <span className="font-bold text-sm">要復習のみ</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b flex items-center gap-2">
              <List className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-slate-700 text-sm">問題一覧</h3>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y">
              {problemData.map((p, idx) => {
                const hist = userAnswers[p.id];
                const isReview = reviewFlags[p.id];
                return (
                  <div key={p.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500 font-mono">
                        {p.id}
                      </span>
                      <span className="truncate max-w-[200px] text-slate-600 font-medium">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isReview && <AlertCircle className="w-4 h-4 text-orange-400" />}
                      {hist ? (
                        hist.isCorrect ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <span className="text-gray-200">-</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'quiz') {
    const problem = filteredProblems[currentProblemIndex];
    const isLast = currentProblemIndex === filteredProblems.length - 1;
    const progress = ((currentProblemIndex + 1) / filteredProblems.length) * 100;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-10">
          <div className="h-1 bg-gray-100 w-full">
            <div className="h-full bg-slate-800 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
            <button onClick={() => setCurrentScreen('menu')} className="text-sm font-bold text-gray-400 hover:text-slate-800 transition">メニューへ</button>
            <span className="font-bold text-slate-700">Q. {currentProblemIndex + 1} / {filteredProblems.length}</span>
            <span className="text-[10px] text-slate-500 font-bold px-2 py-1 bg-slate-100 rounded-full">{problem.category}</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-lg font-bold leading-relaxed whitespace-pre-wrap">{problem.question}</p>
          </div>

          <div className="grid gap-3">
            {problem.options.map((opt, idx) => {
              let btnClass = "p-4 text-left rounded-2xl border-2 transition-all ";
              if (showExplanation) {
                if (idx === problem.correctAnswer) {
                  btnClass += "bg-green-50 border-green-500 text-green-800 font-bold";
                } else if (idx === selectedOption) {
                  btnClass += "bg-red-50 border-red-500 text-red-800";
                } else {
                  btnClass += "bg-white border-transparent shadow-sm opacity-50";
                }
              } else {
                btnClass += "bg-white border-transparent shadow-sm hover:border-slate-200 active:scale-[0.99] font-medium";
              }

              return (
                <button 
                  key={idx}
                  disabled={showExplanation}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                >
                  <div className="flex gap-3">
                    <span className="font-bold font-mono text-slate-300">{['ア','イ','ウ','エ'][idx]}</span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className={`p-4 rounded-2xl mb-4 text-center font-bold text-white shadow-md ${selectedOption === problem.correctAnswer ? 'bg-green-500' : 'bg-red-500'}`}>
                {selectedOption === problem.correctAnswer ? '正解！' : '不正解...'}
              </div>

              <div className="bg-slate-800 p-6 rounded-2xl shadow-sm text-slate-100">
                <div className="flex items-center gap-2 mb-3 text-slate-300 font-bold border-b border-slate-700 pb-2">
                  <BookOpen className="w-5 h-5" /> ポイント解説
                </div>
                <div 
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: problem.explanation }} 
                />
              </div>

              <label className="flex items-center gap-3 p-4 bg-white mt-4 rounded-2xl shadow-sm border border-orange-100 cursor-pointer hover:bg-orange-50 transition">
                <input 
                  type="checkbox" 
                  checked={!!reviewFlags[problem.id]} 
                  onChange={() => toggleReview(problem.id)}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="font-bold text-slate-700">あとで復習（チェック）</span>
              </label>

              <button 
                onClick={nextProblem}
                className="w-full mt-6 py-4 bg-slate-800 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-900 transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isLast ? '結果を見る' : '次の問題へ'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === 'result') {
    const sessionCorrect = filteredProblems.filter(p => userAnswers[p.id]?.isCorrect).length;
    
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">お疲れ様でした！</h2>
            <p className="text-slate-400 mt-2 font-medium">今回の達成度</p>
            <div className="text-6xl font-black text-slate-800 mt-2">
              {Math.round((sessionCorrect / filteredProblems.length) * 100)}<span className="text-2xl">%</span>
            </div>
            <p className="text-sm text-slate-400 mt-2 font-bold">
              {sessionCorrect} / {filteredProblems.length} 問正解
            </p>
          </div>

          <button 
            onClick={() => setCurrentScreen('menu')}
            className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl shadow hover:bg-slate-900 transition"
          >
            メインメニューに戻る
          </button>
        </div>
      </div>
    );
  }

  return null;
}
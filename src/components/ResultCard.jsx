import logo from "../assets/logo_2.jpg";

const ResultCard = ({ result, quizTitle, quizSubtitle, forRef }) => {
  const winners = Array.isArray(result?.winners) ? result.winners : [];

  // Medal emojis and colors for ranks
  const getMedalInfo = (index) => {
    const medals = ["🥇", "🥈", "🥉"];
    const colors = [
      "from-yellow-300 to-yellow-100",
      "from-gray-300 to-gray-100",
      "from-orange-300 to-orange-100",
    ];
    return {
      medal: medals[index] || "➤",
      color: colors[index] || "from-blue-100 to-blue-50",
    };
  };

  return (
    <div
      ref={forRef}
      className="bg-gradient-to-b from-blue-50 to-white p-12 flex flex-col"
      style={{
        width: "940px",
        minHeight: "1000px",
        boxSizing: "border-box",
        fontFamily: '"Hind Siliguri", "Inter", sans-serif',
      }}
    >
      {/* Header with Logo and Title */}
      <div className="text-center mb-8 border-b-4 border-blue-300 pb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg flex items-center justify-center flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h1 className="text-4xl font-black text-blue-900">
              কিশোরকণ্ঠ পাঠক ফোরাম
            </h1>
            <p className="text-lg text-blue-600 font-semibold">
              চট্টগ্রাম মহানগর উত্তর
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mt-4 mb-2">
          {quizTitle}
        </h2>
        {quizSubtitle && (
          <h3 className="text-xl font-bold text-gray-600">{quizSubtitle}</h3>
        )}
        <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-2 rounded-full font-bold text-2xl shadow-lg mt-3">
          🏆 ফলাফল
        </div>
      </div>

      {/* Winners List */}
      <div className="flex-1 w-full mb-8">
        {winners.length > 0 ? (
          <div className="space-y-3">
            {winners.map((winner, index) => {
              const { medal, color } = getMedalInfo(index);
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${color} border-3 border-gray-300 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <div className="flex items-center gap-6">
                    {/* Rank with Medal */}
                    <div className="flex-shrink-0">
                      <div className="text-5xl font-black text-center">
                        {medal}
                      </div>
                      <div className="text-sm font-bold text-gray-700 text-center">
                        তম স্থান
                      </div>
                    </div>

                    {/* Winner Info */}
                    <div className="flex-1">
                      <h4 className="text-2xl font-black text-gray-900 mb-1">
                        {winner.studentName || "—"}
                      </h4>
                      <p className="text-lg text-gray-700 font-semibold mb-2">
                        📚 {winner.schoolName || "—"}
                      </p>
                      <div className="flex gap-8 text-base font-bold text-gray-700">
                        <span>📖 শ্রেণি: {winner.className || "—"}</span>
                        <span>🔢 রোল: {winner.roll || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-500 font-bold">
              কোনো বিজয়ী তালিকাভুক্ত নয়
            </p>
          </div>
        )}
      </div>

      {/* Bottom congratulations message */}
      <div className="mt-auto pt-8 border-t-4 border-blue-300">
        <div className="text-center">
          <p className="text-xl font-bold text-blue-900 mb-2">
            ❤️ আপনাদের সাফল্যের জন্য অভিনন্দন! ❤️
          </p>
          <p className="text-gray-600 text-sm">
            কিশোরকণ্ঠ পাঠক ফোরাম আপনাদের প্রতিভা বিকাশে প্রতিশ্রুতিবদ্ধ
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;

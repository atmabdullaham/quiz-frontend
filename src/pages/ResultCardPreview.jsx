import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import ResultCard from "../components/ResultCard";

const ResultCardPreview = () => {
  const cardRef = useRef(null);
  const [quizTitle, setQuizTitle] = useState("বিজ্ঞান প্রতিযোগিতা ২০২৬");
  const [quizSubtitle, setQuizSubtitle] = useState("চট্টগ্রাম মহানগর উত্তর");
  const [isDownloading, setIsDownloading] = useState(false);

  // Sample data for preview
  const [sampleResult] = useState({
    winners: [
      {
        studentName: "আহমেদ হাসান",
        schoolName: "চট্টগ্রাম মডেল স্কুল",
        className: "নবম",
        roll: "০১",
      },
      {
        studentName: "ফাতিমা বেগম",
        schoolName: "সরকারি উইমেন্স কলেজ",
        className: "দশম",
        roll: "০৫",
      },
      {
        studentName: "করিম শেখ",
        schoolName: "চট্টগ্রাম ইঞ্জিনিয়ারিং কলেজ",
        className: "একাদশ",
        roll: "১২",
      },
    ],
  });

  const downloadAsImage = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `result-card-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-2">
          🎨 Result Card Designer
        </h1>
        <p className="text-gray-600 mb-8">
          Design and preview your result card before downloading
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                📋 Live Preview
              </h2>
              <div
                className="flex justify-center bg-gray-100 p-4 rounded-lg overflow-auto"
                style={{ maxHeight: "900px" }}
              >
                <ResultCard
                  result={sampleResult}
                  quizTitle={quizTitle}
                  quizSubtitle={quizSubtitle}
                  forRef={cardRef}
                />
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                💡 Scroll to see the full result card. Changes will appear in
                real-time.
              </p>
            </div>
          </div>

          {/* Controls Section */}
          <div>
            <div className="bg-white rounded-lg shadow-2xl p-6 sticky top-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                ⚙️ Settings
              </h3>

              <div className="space-y-6">
                {/* Quiz Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📚 Quiz Title
                  </label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                    placeholder="Enter quiz title"
                  />
                </div>

                {/* Quiz Subtitle */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🏫 Subtitle/Location
                  </label>
                  <input
                    type="text"
                    value={quizSubtitle}
                    onChange={(e) => setQuizSubtitle(e.target.value)}
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                    placeholder="Enter subtitle"
                  />
                </div>

                {/* Download Button */}
                <button
                  onClick={downloadAsImage}
                  disabled={isDownloading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg shadow-lg"
                >
                  {isDownloading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Downloading...
                    </>
                  ) : (
                    <>📥 Download as PNG</>
                  )}
                </button>

                {/* Info Box */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-2">💡 Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Edit title and subtitle in real-time</li>
                    <li>✓ See changes instantly</li>
                    <li>✓ Download as high-quality PNG</li>
                    <li>✓ Perfect for printing</li>
                  </ul>
                </div>

                {/* Preview Info */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2">
                    📊 Sample Data:
                  </h4>
                  <p className="text-xs text-gray-600">
                    This preview shows 3 sample winners. Replace with real data
                    when using the actual results page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCardPreview;

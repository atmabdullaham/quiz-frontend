import { FaArrowRight, FaAward, FaTrophy, FaUsers } from "react-icons/fa";
import { MdOutlineMenuBook, MdPeople } from "react-icons/md";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo3.jpg";
import NoticeMarquee from "../components/NoticeMarquee";

const Home = () => {
  const features = [
    {
      icon: <MdOutlineMenuBook className="text-5xl text-blue-600" />,
      title: "মাসিক পত্রিকা বিতরণ",
      description:
        "প্রতি মাসে কিশোরকণ্ঠ পত্রিকা আমাদের সদস্যদের কাছে পৌঁছে দিই",
    },
    {
      icon: <MdPeople className="text-5xl text-purple-600" />,
      title: "সক্রিয় পাঠক সমাজ",
      description: "হাজার হাজার তরুণ পাঠক এবং লেখক একসাথে যুক্ত রয়েছেন",
    },
    {
      icon: <FaTrophy className="text-5xl text-pink-600" />,
      title: "মাসিক প্রশ্নোত্তর প্রতিযোগিতা",
      description:
        "কিশোরকণ্ঠ সামগ্রী ভিত্তিক প্রতিযোগিতায় অংশ নিন এবং পুরস্কার জিতুন",
    },
    {
      icon: <FaAward className="text-5xl text-orange-600" />,
      title: "আকর্ষণীয় পুরস্কার",
      description: "শীর্ষ পারফরমাররা প্রতিমাসে বিশেষ পুরস্কার এবং সম্মাননা পান",
    },
  ];

  const testimonials = [
    {
      name: "আফিয়া খাতুন",
      class: "নবম শ্রেণী",
      comment:
        "কিশোরকণ্ঠ পাঠক ফোরাম আমার পড়ার আগ্রহ বহুগুণ বাড়িয়ে দিয়েছে। প্রতি মাসের প্রতিযোগিতায় অংশ নেওয়া খুবই আনন্দদায়ক।",
      rating: 5,
    },
    {
      name: "করিম আহমেদ",
      class: "দশম শ্রেণী",
      comment:
        "এই ফোরামের মাধ্যমে আমি আমার পড়ার বিষয়বস্তু আরও গভীরভাবে বুঝতে পারি। প্রতিটি প্রশ্নোত্তর প্রতিযোগিতা থেকে কিছু না কিছু শিখি।",
      rating: 5,
    },
    {
      name: "সালমা-ই-মনজিলা",
      class: "অষ্টম শ্রেণী",
      comment:
        "কিশোরকণ্ঠ পত্রিকা এবং এই ফোরামের সমন্বয় অসাধারণ। পুরস্কার জেতা সত্যিই অনুপ্রেরণাদায়ক।",
      rating: 5,
    },
  ];

  const events = [
    {
      id: 1,
      title: "প্রতিযোগিতার আয়োজন",
      date: "প্রতি মাসের প্রথম সপ্তাহ",
      details: `পড়ালেখার পাশাপাশি জ্ঞানের ভাণ্ডারকে আরো সমৃদ্ধ করতে কিশোরকণ্ঠ পাঠক ফোরাম চট্টগ্রাম মহানগর উত্তর প্রতি মাসের শেষ সপ্তাহে মাসিক নতুন কিশোরকন্ঠের উপর "কিশোরকন্ঠ মাসিক পাঠ প্রতিযোগিতা" র আয়োজন করে। যেখানে আকর্ষণীয় পুরস্কারের ব্যবস্থা আছে।
এছাড়াও বিভিন্ন জাতীয় ও আন্তর্জাতিক দিবসকে সামনে রেখে নানাবিধ প্রতিযোগিতামূলক কর্মসূচির আয়োজন থাকে। সাধারণ জ্ঞানের আসর, কুইজ, গল্প লেখা ও রচনা প্রতিযোগিতা প্রভৃতি।`,
      icon: "📖",
    },
    {
      id: 2,
      title: "সাহিত্য আসর",
      date: "প্রতি মাসের মধ্য থেকে শেষ",
      details:
        "আগামী প্রজন্মের জন্য একঝাঁক সাহসী ও দেশপ্রেমিক লেখক-কবি ও সাহিত্যিক তৈরির উদ্দেশে খুদে কবি-সাহিত্যিকদের নিয়ে আয়োজন হয় সাহিত্য আসরের। এখানে তারা তাদের লেখা পাঠ করে এবং অভিজ্ঞ সাহিত্যিকদের কাছ থেকে মূল্যবান পরামর্শ পায়।",
      icon: "✍️",
    },
    {
      id: 3,
      title: "ক্রীড়া কার্যক্রম",
      details:
        " কিশোরকণ্ঠ পাঠক ফোরাম ছাত্রদেরকে পড়ালেখার পাশাপাশি খেলাধুলায় উৎসাহ প্রদান করে থাকে। কেননা, সুস্থ দেহে সুস্থ মন- এ কথা সর্বজনস্বীকৃত। আন্তঃস্কুল ক্রিকেট ও ফুটবল টুর্নামেন্টের আয়োজন নিয়মিত থাকে।",
      icon: "🏆",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/*1.  Hero Section */}
      <div className="hero min-h-[60vh] bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 relative overflow-visible pb-24">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-5 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-10 right-5 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Content */}
        <div className="hero-content relative z-10 w-full text-center md:text-left py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto px-4">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl py-1 md:text-4xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                  কিশোরকণ্ঠ পাঠক ফোরাম
                </h2>
                <p className="text-sm md:text-base font-semibold text-blue-100">
                  চট্টগ্রাম মহানগর উত্তর
                </p>
              </div>

              <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-md">
                পড়ালেখার পাশাপাশি জ্ঞানের ভাণ্ডারকে আরো সমৃদ্ধ করতে কিশোরকণ্ঠ
                পাঠক ফোরাম চট্টগ্রাম মহানগর উত্তর প্রতি মাসের শেষ সপ্তাহে মাসিক
                নতুন কিশোরকন্ঠের উপর "কিশোরকন্ঠ মাসিক পাঠ প্রতিযোগিতা" র আয়োজন
                করে। যেখানে আকর্ষণীয় পুরস্কারের ব্যবস্থা আছে।
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                <Link
                  to="/quizzes"
                  className="btn btn-sm md:btn-lg btn-primary gap-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  কুইজ দাও <FaArrowRight className="text-sm md:text-lg" />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-sm md:btn-lg btn-success gap-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-white"
                >
                  সদস্য হও <FaArrowRight className="text-sm md:text-lg" />
                </Link>
              </div>
            </div>

            {/* Right Content - Illustration */}
            <div className="hidden md:flex justify-center">
              <img
                src={logoImg}
                alt="Logo"
                className="w-48 md:w-56 lg:w-64 h-48 md:h-56 lg:h-64 object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Wave Transition */}
        <div className="absolute -bottom-1 left-0 right-0 w-full h-24 overflow-hidden">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </div>

      {/*2.  Notice Marquee */}
      <NoticeMarquee displayLocation="home" />

      {/*3.  About Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-lg border border-blue-100">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-800 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
            <MdOutlineMenuBook className="text-blue-700" /> আমাদের পরিচয়
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed text-justify">
            বাংলাদেশ! আমাদের প্রিয় জন্মভূমি। মাথার ওপর নীল ছামিয়ানা উঁচিয়ে সদা
            দণ্ডায়মান আসমান। দিগন্ত বিস্তৃত ফসলের মাঠে দোল দিয়ে যায় ঝিরিঝিরি
            বাতাস, অন্তরে বুলিয়ে দেয় প্রশান্তির ছোঁয়া। কুলুকুলু রব তুলে বহমান
            পদ্মা, মেঘনা, যমুনাসহ অজস্র নদী-নালার বুকে বয়ে চলে নৌকা। বাংলার
            দক্ষিণ অঞ্চলকে ঘিরে রেখেছে পৃথিবীর সর্ববৃহৎ ম্যানগ্রোভ সুন্দরবন। এতো
            এতো রূপ-রস-গন্ধে ভরা এই অনিন্দ্য সুন্দর দেশটির প্রতি আকৃষ্ট হয়ে
            সুদূর সাইবেরিয়া থেকে শীতের মৌসুমে অতিথি পাখিরা এসে ভিড় জমায়। কার না
            ভালো লাগে এই দেশ!
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed text-justify">
            তাইতো একেক সময় একেক দেশ তাদের কুনজর নিয়ে শাসন করতে এসেছিল এদেশকে।
            কিন্তু শাসনের নামে তাদের সেই শোষণকে মেনে নিতে পারেনি দেশপ্রেমিক
            মানুষ। বাংলামায়ের দামাল ছেলেরা তাদেরকে রুখে দিয়েছে। তথাপি এখনও থেমে
            নেই বিদেশীদের লোলুপ দৃষ্টি। তাই এই সুজলা-সুফলা-শস্যশ্যামলা
            বাংলাদেশের অপার সম্ভাবনার সম্ভারকে রক্ষা ও তার পরিচর্যার জন্য
            প্রয়োজন একদল সৎ, দক্ষ ও দেশপ্রেমিক মানুষের এবং সেই সাথে প্রয়োজন
            আমাদের গৌরবময় ইতিহাস-ঐতিহ্য তুলে ধরার মতো নির্ভিক কলমসৈনিক। জাতির
            সেই প্রত্যাশা পূরণের জন্য ১৯৮৪ সালের ১৪ ফেব্রুয়ারি প্রথম প্রকাশিত হয়
            কিশোরকণ্ঠ নামক শিশু-কিশোর মাসিক পত্রিকাটি।
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 leading-relaxed text-justify">
            প্রকাশের পর থেকেই পরিণত হয় দেশের অগণন শিশু-কিশোরদের প্রিয় পত্রিকায়।
            ছড়িয়ে পড়ে বাংলাদেশের প্রত্যন্ত অঞ্চলে, এমনকি দেশের গণ্ডি পেরিয়ে
            সার্কভুক্তদেশ তথা ভারত, পাকিস্তান, নেপাল, শ্রীলঙ্কা, মালদ্বীপ,
            ভুটান, আফগানিস্তানসহ সমগ্র এশিয়া মহাদেশ এবং আফ্রিকা, ইউরোপ, ওশেনিয়া
            ও আমেরিকা মহাদেশে। একটি পত্রিকার এতো দ্রুত সম্প্রসারণের ফলে প্রয়োজন
            হয়ে পড়ে একটি ফাউন্ডেশনের ভিত রচনার।
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 leading-relaxed text-justify">
            তারই ফলশ্রুতিতে অনেক চড়াই-উৎরাই পেরিয়ে ২০০২ সালে সরকারি
            রেজিস্ট্রিভুক্ত হয় কিশোরকণ্ঠ ফাউন্ডেশন। আর পত্রিকার রেজিস্ট্রেশন হয়
            ২০০৪ সালের মার্চ মাসে। তবে পত্রিকাটির অফিসিয়াল নাম হয়ে যায় “নতুন
            কিশোরকণ্ঠ”। কিশোরকণ্ঠ ফাউন্ডেশন থেকে ২০০৮ সালে সাধারণ জ্ঞানভিত্তিক
            মাসিক পত্রিকা “কারেন্ট ইস্যু” ও কার্টুন মাসিক “নয়া চাবুক” বের করা
            হয়। পত্রিকা দু’টির প্রকাশনা আপাতত বন্ধ আছে। কিশোরকণ্ঠ আজ শুধু একটি
            পত্রিকার নাম নয়, এটি একটি প্রতিষ্ঠানে রূপ লাভ করেছে। কালের পরিক্রমায়
            আজ এক মহীরুহ রূপ ধারণ করেছে।
          </p>
        </div>
      </div>

      {/* 4. Quick Action Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-12 md:py-24 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                জ্ঞান এবং চরিত্রের নিখুঁত সমন্বয়
              </h2>
              <p className="text-base md:text-lg text-blue-200 max-w-3xl mx-auto">
                আমরা বিশ্বাস করি যে শুধু পড়াশোনা নয়, বরং সার্বিক উন্নয়নই
                প্রকৃত শিক্ষা।
              </p>
            </div>

            {/* Main Content Grid */}

            {/* Key Values */}
            <div className="bg-gradient-to-r from-blue-600/40 to-purple-600/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mb-12 md:mb-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                    ⏰
                  </div>
                  <p className="text-white font-semibold text-sm md:text-base">
                    সময়ানুবর্তিতা
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                    📚
                  </div>
                  <p className="text-white font-semibold text-sm md:text-base">
                    শৃঙ্খলাবোধ
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent mb-2">
                    ✅
                  </div>
                  <p className="text-white font-semibold text-sm md:text-base">
                    দায়বদ্ধতা
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-2">
                    🎯
                  </div>
                  <p className="text-white font-semibold text-sm md:text-base">
                    লক্ষ্যভিত্তিক
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <Link
                to="/quizzes"
                className="group relative px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-base md:text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 md:gap-3 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2 md:gap-3">
                  🚀 কুইজ দাও
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                to="/login"
                className="group relative px-6 md:px-10 py-3 md:py-4 bg-white/10 border-2 border-white/30 text-white font-bold text-base md:text-lg rounded-xl hover:bg-white/20 hover:border-white/60 transition-all duration-300 hover:scale-105 flex items-center gap-2 md:gap-3 backdrop-blur-sm"
              >
                <span className="relative flex items-center gap-2 md:gap-3">
                  👤 সদস্য হও
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-gray-800">
            আমরা কী প্রদান করি
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-gray-800">
            আমাদের কার্যক্রম
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-700"
              >
                <div className="text-5xl md:text-6xl mb-4 md:mb-6">
                  {event.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                  {event.title}
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="text-sm leading-relaxed">{event.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-gray-800 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
          <FaUsers className="text-purple-700" /> সদস্যদের মতামত
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((testimonial, idx) => (
            <a
              key={`${testimonial.name}-${testimonial.class}`}
              href="#"
              className="block rounded-lg md:rounded-xl border border-gray-300 p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              {/* Main Content */}
              <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
                {/* Text Content */}
                <div className="flex-1">
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span
                        key={i}
                        className="text-lg md:text-xl text-yellow-400"
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="line-clamp-3 text-sm md:text-base text-pretty text-gray-700 leading-relaxed">
                    "{testimonial.comment}"
                  </p>

                  {/* Author Name */}
                  <p className="mt-3 md:mt-4 font-bold text-sm md:text-base text-gray-900">
                    {testimonial.name}
                  </p>

                  {/* Class */}
                  <p className="text-xs md:text-sm text-gray-600">
                    {testimonial.class}
                  </p>
                </div>

                {/* Profile Image */}
                <div className="sm:order-last sm:shrink-0 mt-4 sm:mt-0">
                  <div className="size-14 sm:size-16 md:size-18 rounded-full object-cover flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-lg md:text-2xl shadow-md">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Prize Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 md:py-20">
        <div className="px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <FaTrophy className="text-6xl md:text-8xl mx-auto mb-4 md:mb-6" />
            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6">
              পুরস্কার এবং স্বীকৃতি
            </h2>
            <p className="text-base md:text-xl mb-6 md:mb-8 text-white/90 leading-relaxed">
              প্রতি মাসের প্রশ্নোত্তর প্রতিযোগিতায় অংশগ্রহণ করুন এবং আকর্ষণীয়
              পুরস্কার জিতে নাও।
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-2xl p-4 md:p-6 border border-white/30">
                <p className="text-5xl font-bold mb-2">🥇</p>
                <p className="text-lg font-semibold mb-2">প্রথম স্থান</p>
                <p className="text-white/80">বিশেষ সম্মাননা এবং পুরস্কার</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-2xl p-4 md:p-6 border border-white/30">
                <p className="text-5xl font-bold mb-2">🥈</p>
                <p className="text-lg font-semibold mb-2">দ্বিতীয় স্থান</p>
                <p className="text-white/80">মূল্যবান উপহার এবং সম্মাননাপত্র</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-2xl p-4 md:p-6 border border-white/30">
                <p className="text-5xl font-bold mb-2">🥉</p>
                <p className="text-lg font-semibold mb-2">তৃতীয় স্থান</p>
                <p className="text-white/80">পুরস্কার এবং স্মারক</p>
              </div>
            </div>
            <Link
              to="/quizzes"
              className="btn btn-sm md:btn-lg bg-white text-orange-600 hover:bg-gray-100 border-0 shadow-xl gap-2 font-semibold"
            >
              কুইজ দাও <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer is now rendered globally in App.jsx */}
    </div>
  );
};

export default Home;

const OurActivities = () => {
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
  );
};

export default OurActivities;

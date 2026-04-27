const About = () => {
  return (
    <div className="container mx-auto px-2 md:px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            আমাদের পরিচিতি
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ১৯৮৪ সাল থেকে শিক্ষার্থীদের সার্বিক উন্নয়নে
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <div className="border-l-4 border-blue-600 pl-6">
            <p className="text-gray-700 leading-relaxed text-justify">
              বাংলাদেশ! আমাদের প্রিয় জন্মভূমি। মাথার ওপর নীল ছামিয়ানা উঁচিয়ে সদা
              দণ্ডায়মান আসমান। দিগন্ত বিস্তৃত ফসলের মাঠে দোল দিয়ে যায় ঝিরিঝিরি
              বাতাস, অন্তরে বুলিয়ে দেয় প্রশান্তির ছোঁয়া। কুলুকুলু রব তুলে বহমান
              পদ্মা, মেঘনা, যমুনাসহ অজস্র নদী-নালার বুকে বয়ে চলে নৌকা। বাংলার
              দক্ষিণ অঞ্চলকে ঘিরে রেখেছে পৃথিবীর সর্ববৃহৎ ম্যানগ্রোভ সুন্দরবন।
              এতো এতো রূপ-রস-গন্ধে ভরা এই অনিন্দ্য সুন্দর দেশটির প্রতি আকৃষ্ট
              হয়ে সুদূর সাইবেরিয়া থেকে শীতের মৌসুমে অতিথি পাখিরা এসে ভিড় জমায়।
              কার না ভালো লাগে এই দেশ! তাইতো একেক সময় একেক দেশ তাদের কুনজর নিয়ে
              শাসন করতে এসেছিল এদেশকে। কিন্তু শাসনের নামে তাদের সেই শোষণকে মেনে
              নিতে পারেনি দেশপ্রেমিক মানুষ। বাংলামায়ের দামাল ছেলেরা তাদেরকে রুখে
              দিয়েছে। তথাপি এখনও থেমে নেই বিদেশীদের লোলুপ দৃষ্টি। তাই এই
              সুজলা-সুফলা-শস্যশ্যামলা বাংলাদেশের অপার সম্ভাবনার সম্ভারকে রক্ষা ও
              তার পরিচর্যার জন্য প্রয়োজন একদল সৎ, দক্ষ ও দেশপ্রেমিক মানুষের এবং
              সেই সাথে প্রয়োজন আমাদের গৌরবময় ইতিহাস-ঐতিহ্য তুলে ধরার মতো নির্ভিক
              কলমসৈনিক।
            </p>
          </div>

          {/* Timeline */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-bold text-blue-600">১৯৮৪</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">প্রথম প্রকাশ</h4>
                  <p className="text-sm text-gray-600 text-justify">
                    জাতির সেই প্রত্যাশা পূরণের জন্য ১৯৮৪ সালের ১৪ ফেব্রুয়ারি
                    প্রথম প্রকাশিত হয় কিশোরকণ্ঠ। প্রকাশের পর থেকেই পরিণত হয়
                    দেশের অগণন শিশু-কিশোরদের প্রিয় পত্রিকায়।
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-bold text-purple-600">২০০২ </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    কিশোরকণ্ঠ ফাউন্ডেশন
                  </h4>
                  <p className="text-sm text-gray-600 text-justify">
                    একটি পত্রিকার এতো দ্রুত সম্প্রসারণের ফলে প্রয়োজন হয়ে পড়ে
                    একটি ফাউন্ডেশনের ভিত রচনার। তারই ফলশ্রুতিতে অনেক চড়াই-উৎরাই
                    পেরিয়ে ২০০২ সালে সরকারি রেজিস্ট্রিভুক্ত হয় কিশোরকণ্ঠ
                    ফাউন্ডেশন।
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-red-50 p-6 rounded-xl border border-pink-100">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-bold text-pink-600">২০০৪</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    সরকারি রেজিস্ট্রেশন
                  </h4>
                  <p className="text-sm text-gray-600 text-justify">
                    আর পত্রিকার রেজিস্ট্রেশন হয় ২০০৪ সালের মার্চ মাসে। তবে
                    পত্রিকাটির অফিসিয়াল নাম হয়ে যায় “নতুন কিশোরকণ্ঠ”।
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-bold text-green-600">২০০৮</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">প্রকাশনা</h4>
                  <p className="text-sm text-gray-600 text-justify">
                    সাধারণ জ্ঞানভিত্তিক মাসিক পত্রিকা “কারেন্ট ইস্যু” ও কার্টুন
                    মাসিক “নয়া চাবুক” বের করা হয়। পত্রিকা দু’টির প্রকাশনা আপাতত
                    বন্ধ আছে।
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

export default About;

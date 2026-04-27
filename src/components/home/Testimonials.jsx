import { FaUsers } from "react-icons/fa";

const Testimonials = () => {
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

  return (
    <div className="container mx-auto px-2 md:px-4 py-12 md:py-20">
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
  );
};

export default Testimonials;

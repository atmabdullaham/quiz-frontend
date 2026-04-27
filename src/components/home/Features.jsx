import { FaAward, FaTrophy } from "react-icons/fa";
import { MdOutlineMenuBook, MdPeople } from "react-icons/md";

const Features = () => {
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
  return (
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
  );
};

export default Features;

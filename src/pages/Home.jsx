import NoticeMarquee from "../components/NoticeMarquee";
import About from "../components/home/About";
import Features from "../components/home/Features";
import Hero from "../components/home/Hero";
import OurActivities from "../components/home/OurActivities";
import Prize from "../components/home/Prize";
import QuickAction from "../components/home/QuickAction";
import Testimonials from "../components/home/Testimonials";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/*1.Hero Section */}
      <Hero />
      {/*2.Notice Marquee */}
      <NoticeMarquee displayLocation="home" />
      {/*3.About Section */}
      <About />
      {/* 4.Quick Action Section */}
      <QuickAction />
      {/* 5.Features Section */}
      <Features />
      {/*6.Our activities Section */}
      <OurActivities />
      {/*7.Testimonials Section */}
      <Testimonials />
      {/*8.Prize Section */}
      <Prize />
    </div>
  );
};

export default Home;

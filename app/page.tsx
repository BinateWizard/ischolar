"use client";

import { useEffect } from "react";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Scroll container confined to main content area (excludes navbar/footer) */}
  <div id="landing-scroll" className="h-screen overflow-y-auto snap-y snap-mandatory scroll-pt-0 scroll-pb-0">
      {/* Hero Section */}
      <section
        id="intro"
  className="relative h-screen overflow-hidden snap-start snap-always bg-indigo-100"
      >
          {/* Content container to constrain width while the section background stays full-width */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center pt-[5rem]">
            <div className="text-center max-w-3xl mx-auto w-full relative z-10">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
              🎓 AY 2024-2025 Applications Now Open
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Your Path to Educational <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Success</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 animate-fade-in-up animation-delay-200">
              Apply for TES, TDP, and institutional scholarships through our unified scholarship portal.
            </p>
            <div className="flex gap-4 justify-center mb-12 animate-fade-in-up animation-delay-400">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                Apply Now
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-blue-300">
                Learn More
              </button>
            </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 animate-fade-in-up animation-delay-600">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                  <div className="text-sm text-gray-600">Students Funded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">₱50M</div>
                  <div className="text-sm text-gray-600">Disbursed Annually</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-1">98%</div>
                  <div className="text-sm text-gray-600">Approval Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
  </section>

        {/* Features Grid */}
        <section
          id="features"
          className="py-16 snap-start snap-always h-screen flex items-center bg-rose-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 animate-on-scroll fade-up">Why Choose iScholar?</h2>
            <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow animate-on-scroll fade-up">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Application</h3>
              <p className="text-gray-600">
                Submit your scholarship application online with guided steps and document checklist.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow animate-on-scroll fade-up transition-delay-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Monitor your application status from submission to approval with live updates.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow animate-on-scroll fade-up transition-delay-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your documents and personal information are encrypted and protected under Data Privacy Act.
              </p>
            </div>
          </div>
          </div>
  </section>

        {/* Available Programs */}
        <section
          id="programs"
          className="bg-sky-100 py-16 snap-start snap-always h-screen flex items-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 animate-on-scroll fade-up">Available Scholarship Programs</h2>
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              <div className="bg-white p-6 rounded-xl border-2 border-blue-200 animate-on-scroll fade-left flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">TES (Tertiary Education Subsidy)</h3>
                    <p className="text-sm text-blue-600 font-medium">UniFAST Program</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Open</span>
                </div>
                <p className="text-gray-600 mb-4">
                  Financial assistance for qualified students from poor households.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Listahanan 3.0 beneficiaries
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> 4Ps beneficiaries
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Qualified poor students
                  </li>
                </ul>
                <button className="mt-auto w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Apply for TES
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-purple-200 animate-on-scroll fade-right flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">TDP (Tulong Dunong Program)</h3>
                    <p className="text-sm text-purple-600 font-medium">CHED Program</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Open</span>
                </div>
                <p className="text-gray-600 mb-4">
                  Merit-based scholarship for academically outstanding students with financial need.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Academic excellence
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Financial need
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Leadership potential
                  </li>
                </ul>
                <button className="mt-auto w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Apply for TDP
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section
          id="faqs"
          className="py-16 snap-start snap-always h-screen flex items-center bg-amber-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 animate-on-scroll fade-up">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 animate-on-scroll fade-left">
                <h3 className="font-semibold text-gray-900 mb-2">Who can apply?</h3>
                <p className="text-gray-600">Eligible undergraduate students enrolled in accredited institutions. Specific criteria depend on the program (TES, TDP, etc.).</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 animate-on-scroll fade-right">
                <h3 className="font-semibold text-gray-900 mb-2">What documents are required?</h3>
                <p className="text-gray-600">At minimum: COR/Enrollment, valid ID, and program-specific proofs (e.g., 4Ps/Listahanan, PWD ID if applicable).</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 animate-on-scroll fade-left">
                <h3 className="font-semibold text-gray-900 mb-2">When will I know the result?</h3>
                <p className="text-gray-600">Review timelines vary per call. You can track your application anytime on the Status page.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 animate-on-scroll fade-right">
                <h3 className="font-semibold text-gray-900 mb-2">How are priorities determined?</h3>
                <p className="text-gray-600">We follow official program prioritization (e.g., UniFAST Board 2024-019 for TES) and validate proofs submitted.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer as its own snap section to prevent bounce-back and fill the screen */}
  <section id="end" className="snap-start snap-always min-h-[calc(100vh-5rem)] bg-gray-900">
          <Footer forceRender fullScreen />
        </section>
      </div>
    </>
  );
}

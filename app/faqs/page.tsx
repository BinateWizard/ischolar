const faqs = [
  {
    q: "Who can apply for iScholar programs?",
    a: "Eligibility varies by program, but generally undergraduate and senior high students in good academic standing may apply.",
  },
  {
    q: "What documents do I need?",
    a: "Valid ID, latest grades or report card, proof of income (if applicable), and other program-specific requirements.",
  },
  {
    q: "How long does review take?",
    a: "Review typically takes 5–10 business days after submission. We'll notify you by email once there's an update.",
  },
  {
    q: "Can I edit my application?",
    a: "Yes. You can update your details and re-upload documents before final submission.",
  },
];

export default function FAQsPage() {
  return (
    <section className="snap-start min-h-[calc(100vh-5rem)] bg-gradient-to-b from-white to-indigo-50 py-14">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-8">Quick answers to common questions about applying and eligibility.</p>

        <div className="grid gap-4">
          {faqs.map((item, i) => (
            <details key={i} className="group bg-white border border-gray-200 rounded-xl p-5 open:shadow-sm">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                <span className="font-medium text-gray-900">{item.q}</span>
                <span className="mt-1 text-gray-400 group-open:rotate-180 transition-transform">⌄</span>
              </summary>
              <p className="text-gray-600 mt-3">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10">
          <a href="/apply" className="text-blue-600 hover:text-blue-700">Ready to apply? Start here →</a>
        </div>
      </div>
    </section>
  );
}

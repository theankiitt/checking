import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-[#EB6426] hover:underline mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using our website, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Products and Orders</h2>
            <p className="text-gray-600 mb-4">
              All products are subject to availability. We reserve the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Limit quantities of products per order</li>
              <li>Refuse or cancel any order</li>
              <li>Change product prices without notice</li>
              <li>Discontinue products at any time</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Minimum order quantity of 5 kg applies to all food products. Final order confirmation will be done after our sales team contacts you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Pricing and Payment</h2>
            <p className="text-gray-600 mb-4">
              All prices are displayed in the currency of your selected region. We accept various payment methods as indicated during checkout. You agree to provide accurate payment information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Shipping and Delivery</h2>
            <p className="text-gray-600 mb-4">
              Shipping times and costs vary by destination. We are not responsible for delays caused by customs, weather, or other factors beyond our control. Risk of loss passes to you upon delivery to the carrier.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Returns and Refunds</h2>
            <p className="text-gray-600 mb-4">
              Due to the nature of our products, returns are accepted only for damaged or defective items. Please contact us within 7 days of delivery to initiate a return.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              All content on this website, including text, images, logos, and designs, is the property of Gharsamma and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              We are not liable for any indirect, incidental, or consequential damages arising from your use of our products or services. Our total liability shall not exceed the amount you paid for the specific product giving rise to the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These terms shall be governed by and construed in accordance with the laws of Nepal. Any disputes shall be resolved in the courts of Kathmandu, Nepal.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: gharsamma6@gmail.com<br />
              Phone: +977 9814768889
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

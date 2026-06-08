"use client";

import Link from "next/link";

export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "Nordic Pro Laptop",
      price: 1299,
      category: "Computers",
      image: "💻",
      description: "High-performance laptop with Arctic aluminum design",
    },
    {
      id: 2,
      name: "Arctic Wireless Mouse",
      price: 49,
      category: "Peripherals",
      image: "🖱️",
      description: "Precision tracking with minimalist Nordic design",
    },
    {
      id: 3,
      name: "Nordic Mechanical Keyboard",
      price: 189,
      category: "Peripherals",
      image: "⌨️",
      description: "Premium switches with sleek Scandinavian aesthetics",
    },
    {
      id: 4,
      name: "Nordic Studio Monitor",
      price: 599,
      category: "Displays",
      image: "🖥️",
      description: "4K color-accurate monitor for professionals",
    },
    {
      id: 5,
      name: "Arctic USB-C Hub",
      price: 129,
      category: "Accessories",
      image: "🔌",
      description: "7-in-1 connectivity hub with fast data transfer",
    },
    {
      id: 6,
      name: "Nordic Desk Lamp",
      price: 79,
      category: "Accessories",
      image: "💡",
      description: "Adjustable LED lighting with minimalist design",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Nordic Devices
            </Link>
            <div className="flex space-x-6">
              <Link
                href="/products"
                className="text-blue-600 font-medium underline"
              >
                Products
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Nordic Devices Store</h1>
          <p className="text-blue-100 text-lg">
            Premium Scandinavian-designed technology for modern professionals
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 flex-wrap">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              All Products
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition">
              Computers
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition">
              Peripherals
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition">
              Displays
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition">
              Accessories
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
                {product.image}
              </div>
              <div className="p-6">
                <div className="text-sm text-blue-600 font-semibold mb-2">
                  {product.category}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Choose Nordic Devices?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-3">✈️</div>
              <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600">
                Free shipping on orders over $100 within Nordic countries
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-bold text-lg mb-2">2-Year Warranty</h3>
              <p className="text-gray-600">
                All products come with comprehensive 2-year warranty coverage
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-3">💚</div>
              <h3 className="font-bold text-lg mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Sustainable packaging and carbon-neutral shipping available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Not sure what you need?
          </h2>
          <p className="text-gray-600 mb-6">
            Create an account to get personalized recommendations and track your
            orders
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}

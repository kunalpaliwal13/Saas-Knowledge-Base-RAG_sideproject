"use client";
import { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Head from 'next/head';
import Link from 'next/link';


const Page = () => {
  const [file, setFile] = useState<File | null>(null);

  const fileupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      await sendUpload(selectedFile);
    }
    // Reset the input value so the same file can be re-uploaded
    e.target.value = "";
  };

  const sendUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload/123", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload success:", response.data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      <Head>
        <title>KnowledgeBase AI - Your Smart Document Assistant</title>
        <meta name="description" content="Upload, process, and manage your knowledge effortlessly with AI." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      <nav className="container mx-auto p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-700">
          KnowledgeBase AI
        </div>
        <div>
          <Link href="/login" className="mr-4 px-4 py-2 rounded-md text-indigo-600 hover:bg-indigo-50 transition duration-300">
            Log In
          </Link>
          <Link href="/signup" className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
          Unlock the Power of Your Documents
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Effortlessly upload, process, and analyze your files with our intelligent knowledge base.
          Get insights, answer questions, and streamline your workflow.
        </p>
        <div className="space-x-4">
          <Link href="/upload" className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105">
            Get Started Free
          </Link>
          <Link href="#features" className="px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-full shadow-lg border border-indigo-200 hover:bg-indigo-50 transition duration-300 transform hover:scale-105">
            Learn More
          </Link>
        </div>
        <div className="mt-16">
          {/* Placeholder for a screenshot or demo video */}
          <div className="mx-auto w-full max-w-4xl h-80 bg-gray-200 rounded-lg shadow-xl flex items-center justify-center text-gray-500 text-xl">
            [ Screenshot of the app interface or a short demo video ]
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
            Features Designed for You
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
              <div className="text-indigo-500 text-5xl mb-4">📄</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Easy File Upload</h3>
              <p className="text-gray-600">
                Securely upload various document formats – PDFs, Word docs, text files, and more.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
              <div className="text-indigo-500 text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Processing</h3>
              <p className="text-gray-600">
                Our backend intelligently processes your documents, extracting key information and insights.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
              <div className="text-indigo-500 text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Search & Retrieval</h3>
              <p className="text-gray-600">
                Quickly find what you need across all your uploaded documents with advanced search capabilities.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
              <div className="text-indigo-500 text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Interactive Q&A</h3>
              <p className="text-gray-600">
                Ask questions about your documents and get instant, accurate answers powered by AI.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
              <div className="text-indigo-500 text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Data Visualization (Coming Soon)</h3>
              <p className="text-gray-600">
                Visualize trends and patterns within your data for deeper understanding.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
              <div className="text-indigo-500 text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600">
                Your data security and privacy are our top priorities with robust encryption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Placeholder) */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="italic text-gray-700 mb-4">
                &quot;KnowledgeBase AI has revolutionized how we manage our internal documents. The file processing is incredibly fast!&quot;
              </p>
              <p className="font-bold text-indigo-600">- Jane Doe, CEO of InnovateTech</p>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="italic text-gray-700 mb-4">
                &quot;The ability to upload and immediately query our PDFs has saved us countless hours. Highly recommend!&quot;
              </p>
              <p className="font-bold text-indigo-600">- John Smith, Research Analyst</p>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="italic text-gray-700 mb-4">
                &quot;Finally, a knowledge base that truly understands our needs. The AI capabilities are a game-changer.&quot;
              </p>
              <p className="font-bold text-indigo-600">- Emily White, Project Manager</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 bg-indigo-700 text-white text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Ready to Transform Your Knowledge?
        </h2>
        <p className="text-xl max-w-3xl mx-auto mb-10">
          Join thousands of users who are already benefiting from a smarter way to manage their documents.
        </p>
        <Link href="/signup" className="px-10 py-5 bg-white text-indigo-700 text-xl font-semibold rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105">
          Start Your Free Trial
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-white mb-2">KnowledgeBase AI</h3>
            <p className="text-sm">Empowering your document intelligence.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/about" className="hover:text-white transition duration-300">
              About Us
            </Link>
            <Link href="/privacy" className="hover:text-white transition duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition duration-300">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition duration-300">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} KnowledgeBase AI. All rights reserved.
        </div>
      </footer>
      <Navbar />
      <input
        type="file"
        id="txtfile"
        onChange={fileupload}
        className="bg-gray-800"/>
      </div>
    </div>
  );
};

export default Page;

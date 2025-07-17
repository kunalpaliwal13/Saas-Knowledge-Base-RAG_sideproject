"use client";

import Head from 'next/head';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import axios from "axios";

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedDoc, setparsedDoc] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const userId = 123;

  useEffect(() => {
  if (chatEndRef.current) {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [chat]);

const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const userMessage: ChatMessage = { role: 'user', text: input };
  setChat((prev) => [...prev, userMessage]);
  setInput("");

  try {
    const response = await axios.post(`http://localhost:8000/ask/${userId}`, {
      text: input,
    });

    const modelMessage: ChatMessage = {
      role: 'model',
      text: response.data.answer || "No response from AI.",
    };

    setChat((prev) => [...prev, modelMessage]);
  } catch (err) {
    console.error("Error talking to backend:", err);
    setChat((prev) => [
      ...prev,
      { role: 'model', text: "⚠️ Failed to get a response from server." },
    ]);
  }
};

// TEMP: Replace with actual backend call
const fakeResponse = async (query: string): Promise<string> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(`Response to "${query}"`), 600)
  );
};


  const fileupload = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsUploading(!isUploading);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setSelectedFile(selectedFile);
      setFile(selectedFile);
    }
    e.target.value = "";
    setIsUploading(false);
    console.log("uploaded some shi");
  };

  const sendUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("http://127.0.0.1:8000/upload/123", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload success:", response.data);
      alert("successfully processed the file.");
      setparsedDoc(true);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Head>
        <title>Upload & Q&A - KnowledgeBase AI</title>
        <meta name="description" content="Upload your documents and ask questions with AI." />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-key={idx}8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Upload Document & Chat with AI
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Upload Section - smaller */}
          <section className="lg:w-1/3 w-full bg-white border border-gray-200 rounded-lg shadow p-4 h-fit">
            <label htmlFor="file-upload" className="cursor-pointer block">
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={fileupload}
                className="hidden"
                accept="application/pdf, text/plain"
              />
              <div className="flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-md p-6 hover:bg-gray-50">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="text-sm text-gray-700 font-medium text-center">
                  {selectedFile ? selectedFile.name : 'Click to upload your file'}
                </p>
                <p className="text-xs text-gray-500 mt-1">(PDF, TXT up to 10MB)</p>
              </div>
            </label>

            <button
              onClick={() => file ? sendUpload(file) : alert("Please select a valid file.")}
              disabled={!selectedFile || isUploading}
              className={`mt-4 w-full px-4 py-2 rounded-md text-sm font-semibold transition duration-300
                ${selectedFile && !isUploading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
            >
              {isUploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : 'Upload & Process'}
            </button>
          </section>

          {/* Chat Section */}
<section className="lg:w-2/3 w-full bg-white border border-gray-200 rounded-lg shrink-0 h-[540px] shadow flex flex-col">
  {parsedDoc ? (
    <>
      <h2 className="text-2xl font-semibold  text-gray-800 mb-2 text-center pt-4">Ask Questions</h2>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto overflow-auto shrink-0 h-[50px] border-t border-b border-gray-300 p-4 bg-gray-50 space-y-4">
        {chat.map((msg, idx) => (
            <div key={idx}>
             <div ref={chatEndRef} />
             <div  className={`w-full flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`inline-block max-w-[80%] px-4 py-2 rounded-lg shadow ${msg.role === 'user'? 'bg-indigo-100 text-right': 'bg-white border'}`}>
                <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                    {msg.text}
                </p>
                </div>
                </div>
            </div>
        ))}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 p-2 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </>
  ) : (
    <div className="h-full flex items-center justify-center text-gray-400 italic min-h-[20rem]">
      Upload a document to begin chatting...
    </div>
  )}
</section>

        </div>
      </main>
    </div>
  );
}

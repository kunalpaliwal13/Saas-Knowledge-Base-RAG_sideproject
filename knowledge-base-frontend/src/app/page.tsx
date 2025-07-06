"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";



export default function Home() {
  const [file, setFile] = useState(null);

  const fileupload = (e:any)=>{
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        // @ts-ignore
      setFile(selectedFile);
    }
    sendUpload(selectedFile);
  }
    const sendUpload = async(file:any)=>{
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("http://localhost:8000/upload/123", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload success:", response.data);
    } catch (error) {
      console.error("Upload error:", error);
    }
}

  return (
    <div className="flex flex-col jusyify-center items-center">
      Hello
      <input type="file" id="txtfile" onChange={(e) => {fileupload(e); e.target.value = "";}}className="bg-gray-800"/>
    </div>
  );
}

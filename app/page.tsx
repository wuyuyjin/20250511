"use client";
import { useState, useMemo, useCallback } from "react";
import { degrees, PDFDocument } from "pdf-lib";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Header from "./components/header";
import Footer from "./components/footer";

// 修改 worker 配置
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Home = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageRotations, setPageRotations] = useState<{ [key: number]: number }>(
    {}
  );
  const [scale, setScale] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === "application/pdf") {
        setPdfFile(file);
      }
    },
    []
  );

  const handleRotate = useCallback(async () => {
    if (!pdfFile) return;
    
    setLoading(true); // 添加加载状态
    
    try {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const pdfDoc = await PDFDocument.load(fileReader.result as ArrayBuffer);
        const pages = pdfDoc.getPages();

        // 在 handleRotate 函数中
        pages.forEach((page, index) => {
          const rotation: number = pageRotations[index + 1] || 0;
          page.setRotation(degrees(rotation));
        });

        const rotatedPdfBytes = await pdfDoc.save();
        const blob = new Blob([rotatedPdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `rotated-${pdfFile.name}`;
        link.click();
        
        // 清理URL对象
        URL.revokeObjectURL(url);
        setLoading(false);
      };

      fileReader.onerror = () => {
        setError("文件读取失败，请重试");
        setLoading(false);
      };

      fileReader.readAsArrayBuffer(pdfFile);
    } catch (error) {
      console.error("Error rotating PDF:", error);
      setError("PDF处理失败，请重试");
      setLoading(false);
    }
  }, [pdfFile, pageRotations]);

  const handleRotateAll = useCallback(() => {
    const newRotations: { [key: number]: number } = {};
    for (let i = 1; i <= numPages; i++) {
      newRotations[i] = (pageRotations[i] || 0) + 90;
    }
    setPageRotations(newRotations);
  }, [numPages, pageRotations]);

  const handleRemovePDF = useCallback(() => {
    setPdfFile(null);
    setPageRotations({});
    setNumPages(0);
  }, []);

  const handleRotatePage = useCallback((pageNumber: number) => {
    setPageRotations((prev) => ({
      ...prev,
      [pageNumber]: ((prev[pageNumber] || 0) + 90) % 360,
    }));
  }, []);

  const pages = useMemo(() => {
    return Array.from(new Array(numPages), (el, index) => (
      <div key={`page_${index + 1}`} className="relative group">
        <div className="aspect-[3/4] w-full">
          <Page
            renderTextLayer={false}
            pageNumber={index + 1}
            scale={scale}
            rotate={pageRotations[index + 1] || 0}
            className="border border-gray-200 rounded w-full h-full flex items-center justify-center"
            width={200}
          />
        </div>
        <button
          onClick={() => handleRotatePage(index + 1)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full shadow-lg bg-[#ff5c35] flex items-center justify-center text-white hover:scale-125 transition-transform duration-200"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    ));
  }, [numPages, scale, pageRotations, handleRotatePage]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    const file = files[0];
    
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* 导航栏 */}
      <Header />

      {/* 主要内容 */}
      <div className="px-4 py-12 sm:px-6 lg:px-8 bg-[#f7f5ee] text-black">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif">Rotate PDF Pages</h1>
          <p className="mt-2 text-gray-600 max-w-lg mx-auto">
            Simply click on a page to rotate it. You can then download your
            modified PDF.
          </p>
        </div>

        <div className="w-full flex justify-center">
          {!pdfFile && (
            <div 
              className="h-[350px] relative text-center w-[275px] flex items-center justify-center border rounded transition-all bg-white border-dashed border-stone-300 hover:border-[#ff5c35] hover:bg-gray-50"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex flex-col items-center space-y-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  ></path>
                </svg>
                <span className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </span>
              </label>
              {pdfFile && (
                <p className="mt-4 text-sm text-gray-600">
                  {/* 已选择: {pdfFile.name} */}
                </p>
              )}
            </div>
          )}
          {pdfFile && (
            <div className="w-full mt-8">
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={handleRotateAll}
                  className="px-4 py-2 bg-[#ff5c35] text-white rounded hover:bg-[#ff4a1a]"
                >
                  Rotate all
                </button>
                <button
                  onClick={handleRemovePDF}
                  className="px-4 py-2 bg-[#1a2b3b] text-white rounded hover:bg-[#152736]"
                >
                  Remove PDF
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setScale((prev) => Math.max(0.5, prev - 0.2))
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors bg-white shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setScale((prev) => Math.min(2, prev + 0.2))}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors bg-white shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="w-full flex items-center justify-center mt-8">
                {loading && (
                  <div className="text-center">
                    <p>Loading...</p>
                  </div>
                )}
                <Document
                  file={pdfFile}
                  onLoadSuccess={({ numPages }) => {
                    setNumPages(numPages);
                    setError(null);
                    setLoading(false);
                  }}
                  onLoadStart={() => setLoading(true)}
                  onLoadError={(error) => {
                    console.error("Error loading PDF:", error);
                    setError("PDF 加载失败，请重试");
                    setLoading(false);
                  }}
                  className="flex flex-wrap gap-4 justify-center"
                >
                  {error ? (
                    <div className="text-red-500 text-center p-4 w-full">
                      {error}
                    </div>
                  ) : (
                    pages
                  )}
                </Document>
              </div>

              <div className="text-center">
                <button
                  onClick={handleRotate}
                  disabled={loading}
                  className={`px-6 py-3 mt-8 ${
                    loading 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-[#ff5c35] hover:bg-[#ff4a1a]"
                  } text-white rounded-lg`}
                >
                  {loading ? "Loading..." : "Download"}
                </button>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;

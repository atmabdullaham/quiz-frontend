/**
 * Download HTML element as PNG image
 * Requires: npm install html-to-image
 */

const waitForDocumentFonts = async () => {
  if (typeof document === "undefined" || !document.fonts?.ready) return;

  try {
    await document.fonts.ready;
  } catch (error) {
    console.warn("Font loading wait failed:", error);
  }
};

const waitForNextPaint = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined" || typeof window.requestAnimationFrame !== "function") {
      resolve();
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });

export const downloadPNG = async (element, fileName = "result.png") => {
  try {
    // Dynamic import of html-to-image
    const { toPng } = await import("html-to-image");

    // Wait for fonts and next paint
    await waitForDocumentFonts();
    await waitForNextPaint();

    // Convert element to PNG with improved settings
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    // Create blob from data URL and download
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PNG:", error);
    if (
      error.message.includes("Cannot find module") ||
      error.toString().includes("html-to-image")
    ) {
      throw new Error(
        "html-to-image লাইব্রেরি ইনস্টল করতে হবে: npm install html-to-image"
      );
    }
    throw error;
  }
};

/**
 * Download HTML element as PDF
 * Requires: npm install jspdf html-to-image
 */
export const downloadPDF = async (element, fileName = "result.pdf") => {
  try {
    const { toPng } = await import("html-to-image");
    const jsPDF = (await import("jspdf")).jsPDF;

    await waitForDocumentFonts();
    await waitForNextPaint();

    // Convert element to PNG first
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    // Get image dimensions
    const img = new Image();
    img.src = dataUrl;

    img.onload = () => {
      const pdf = new jsPDF({
        orientation: img.width > img.height ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (img.height * pdfWidth) / img.width;

      if (imgHeight > pdfHeight) {
        // Image is taller than page, scale down
        const scale = pdfHeight / imgHeight;
        const scaledWidth = imgWidth * scale;
        const scaledHeight = pdfHeight;
        pdf.addImage(dataUrl, "PNG", (pdfWidth - scaledWidth) / 2, 0, scaledWidth, scaledHeight);
      } else {
        pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);
      }

      pdf.save(fileName);
    };
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
};

/**
 * Download HTML element as PNG image
 * Requires: npm install html2canvas
 */
const FONT_STYLESHEET_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

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

const isFontStylesheet = (href = "") =>
  FONT_STYLESHEET_HOSTS.some((host) => href.includes(host));

const cleanCloneForExport = (clonedDocument) => {
  const links = clonedDocument.querySelectorAll('link[rel="stylesheet"]');
  links.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!isFontStylesheet(href)) {
      link.remove();
    }
  });

  const styles = clonedDocument.querySelectorAll("style");
  styles.forEach((styleTag) => {
    const cssText = styleTag.textContent || "";
    if (
      cssText.includes("oklch(") ||
      cssText.includes("color-mix(") ||
      cssText.includes("lab(") ||
      cssText.includes("lch(")
    ) {
      styleTag.remove();
    }
  });

  const bodyEl = clonedDocument.body;
  if (!bodyEl) return;

  bodyEl.removeAttribute("class");
  bodyEl.removeAttribute("style");

  const walker = clonedDocument.createTreeWalker(
    bodyEl,
    NodeFilter.SHOW_ELEMENT,
    null,
    false,
  );

  let node = walker.nextNode();
  while (node) {
    node.removeAttribute("class");
    node.removeAttribute("data-class");
    node = walker.nextNode();
  }
};

const createCanvasOptions = () => ({
  backgroundColor: "#ffffff",
  scale: 2,
  useCORS: true,
  allowTaint: true,
  logging: false,
  removeContainer: true,
  ignoreElements: (el) => {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    return tag === "script" || tag === "meta" || tag === "noscript";
  },
  onclone: cleanCloneForExport,
});

export const downloadPNG = async (element, fileName = "result.png") => {
  try {
    // Dynamic import of html2canvas
    const html2canvas = (await import("html2canvas")).default;

    await waitForDocumentFonts();
    await waitForNextPaint();

    // Create canvas from element with stable options
    const canvas = await html2canvas(element, createCanvasOptions());

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, "image/png");
  } catch (error) {
    console.error("Error downloading PNG:", error);
    if (
      error.message.includes("Cannot find module") ||
      error.toString().includes("html2canvas")
    ) {
      throw new Error(
        "html2canvas লাইব্রেরি ইনস্টল করতে হবে: npm install html2canvas"
      );
    }
    throw error;
  }
};

/**
 * Download HTML element as PDF
 * Requires: npm install jspdf html2canvas
 */
export const downloadPDF = async (element, fileName = "result.pdf") => {
  try {
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).jsPDF;

    await waitForDocumentFonts();
    await waitForNextPaint();

    const canvas = await html2canvas(element, createCanvasOptions());

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(fileName);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
};

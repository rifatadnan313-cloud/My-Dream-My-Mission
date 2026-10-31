import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Goal {
  id: string;
  text: string;
}

interface SectionData {
  id: string;
  title: string;
  shortName: string;
  intro: string;
  kicker?: string;
  goals: Goal[];
}

interface ExportPDFParams {
  sections: SectionData[];
  checkedState: Record<string, boolean>;
  currentTheme: 'classic-bw' | 'warm-gold' | 'midnight';
  currentLayoutStyle: 'standard' | 'royal' | 'modern' | 'journal';
  currentFont: 'tiro' | 'anek';
  overallPercent: number;
  totalGoalsCount: number;
  doneGoalsCount: number;
}

const toBengaliNumber = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, d => bnDigits[Number(d)]);
};

export const generateAndDownloadPDF = async (params: ExportPDFParams): Promise<void> => {
  const {
    sections,
    checkedState,
    currentTheme,
    currentLayoutStyle,
    currentFont,
    overallPercent,
    totalGoalsCount,
    doneGoalsCount
  } = params;

  // Determine theme styling for the PDF
  const isDark = currentTheme === 'midnight' || currentTheme === 'warm-gold';
  const bgColor = currentTheme === 'warm-gold' 
    ? '#1C1917' 
    : currentTheme === 'midnight' 
    ? '#090D16' 
    : '#FFFFFF';

  const textColor = isDark ? '#F8FAFC' : '#111827';
  const subTextColor = isDark ? '#94A3B8' : '#4B5563';

  const accentColor = currentTheme === 'warm-gold' 
    ? '#F59E0B' 
    : currentTheme === 'midnight' 
    ? '#38BDF8' 
    : '#171717';

  const cardBg = currentTheme === 'warm-gold' 
    ? '#292524' 
    : currentTheme === 'midnight' 
    ? '#111827' 
    : '#F9FAFB';

  const cardBorder = currentTheme === 'warm-gold' 
    ? '#44403C' 
    : currentTheme === 'midnight' 
    ? '#1E293B' 
    : '#E5E7EB';

  const checkedBg = currentTheme === 'warm-gold' 
    ? '#78350F' 
    : currentTheme === 'midnight' 
    ? '#0369A1' 
    : '#111827';

  const fontFamily = currentFont === 'tiro' 
    ? "'Tiro Bangla', 'Times New Roman', serif" 
    : "'Anek Bangla', 'Segoe UI', sans-serif";

  // Create offscreen container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-99999px';
  container.style.left = '-99999px';
  container.style.width = '794px'; // ~A4 width in 96 DPI
  container.style.padding = '40px';
  container.style.backgroundColor = bgColor;
  container.style.color = textColor;
  container.style.fontFamily = fontFamily;
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-1000';

  // Build HTML representation
  const dateStr = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const sectionsHtml = sections.map((sec, secIdx) => {
    const totalSec = sec.goals.length;
    const doneSec = sec.goals.filter(g => checkedState[g.id]).length;
    const secPercent = totalSec > 0 ? Math.round((doneSec / totalSec) * 100) : 0;

    const goalsHtml = sec.goals.map((g, gIdx) => {
      const isChecked = !!checkedState[g.id];
      const serial = toBengaliNumber(String(gIdx + 1).padStart(2, '0'));

      return `
        <div style="display: flex; align-items: flex-start; justify-content: space-between; padding: 10px 14px; margin-bottom: 8px; border-radius: 10px; background-color: ${cardBg}; border: 1px solid ${cardBorder};">
          <div style="display: flex; align-items: flex-start; gap: 12px; flex: 1;">
            <div style="width: 22px; height: 22px; border-radius: 6px; border: 1.5px solid ${isChecked ? accentColor : cardBorder}; background-color: ${isChecked ? checkedBg : 'transparent'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
              ${isChecked ? `<span style="color: #FFFFFF; font-size: 13px; font-weight: bold; line-height: 1;">✓</span>` : ''}
            </div>
            <div style="flex: 1;">
              <span style="font-size: 11px; opacity: 0.6; font-family: monospace; margin-right: 6px;">[${serial}]</span>
              <span style="font-size: 13.5px; line-height: 1.5; ${isChecked ? 'opacity: 0.9;' : 'opacity: 1;'}">
                ${g.text}
              </span>
            </div>
          </div>
          <span style="font-size: 11px; padding: 2px 8px; border-radius: 999px; margin-left: 12px; background-color: ${isChecked ? (isDark ? 'rgba(16,185,129,0.2)' : '#D1FAE5') : (isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6')}; color: ${isChecked ? '#10B981' : subTextColor}; font-weight: 600; flex-shrink: 0;">
            ${isChecked ? 'সম্পন্ন' : 'চলমান'}
          </span>
        </div>
      `;
    }).join('');

    const kickerTitle = currentLayoutStyle === 'royal' 
      ? `✦ সাধনা 0${secIdx + 1} ✦` 
      : currentLayoutStyle === 'modern'
      ? `MODULE // 0${secIdx + 1}`
      : currentLayoutStyle === 'journal'
      ? `অধ্যায় ${toBengaliNumber(secIdx + 1)}`
      : `লক্ষ্য 0${secIdx + 1}`;

    return `
      <div style="margin-bottom: 28px; page-break-inside: avoid; border-radius: 16px; border: 1px solid ${cardBorder}; padding: 20px 24px; background-color: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'};">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid ${cardBorder}; padding-bottom: 12px; margin-bottom: 14px;">
          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${accentColor}; letter-spacing: 0.1em; margin-bottom: 4px;">
              ${kickerTitle} · ${sec.shortName || sec.title}
            </div>
            <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: ${textColor};">
              ${sec.title}
            </h3>
          </div>
          <div style="text-align: right; flex-shrink: 0;">
            <span style="font-size: 13px; font-weight: bold; color: ${accentColor};">
              ${secPercent}%
            </span>
            <div style="font-size: 10px; color: ${subTextColor};">
              ${toBengaliNumber(doneSec)}/${toBengaliNumber(totalSec)}টি ধাপ
            </div>
          </div>
        </div>

        <p style="margin: 0 0 16px 0; font-size: 12.5px; line-height: 1.6; color: ${subTextColor};">
          ${sec.intro}
        </p>

        <div>
          ${goalsHtml}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <!-- Top Header -->
    <div style="border-bottom: 2px solid ${cardBorder}; padding-bottom: 24px; margin-bottom: 28px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; border: 1px solid ${accentColor}; display: flex; align-items: center; justify-content: center; background-color: ${cardBg};">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M3 19C4.8 17.8 7.5 17.5 12 19V5C7.5 3.5 4.8 3.8 3 5V19Z" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 19C19.2 17.8 16.5 17.5 12 19V5C16.5 3.5 19.2 3.8 21 5V19Z" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 5V11" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <h1 style="margin: 0; font-family: 'Cormorant Garamond', 'Cinzel', serif; font-size: 28px; font-weight: 700; letter-spacing: 0.05em; color: ${accentColor};">
              Saiful Islam Rifat
            </h1>
            <div style="font-size: 12px; color: ${subTextColor}; margin-top: 2px;">
              ব্যক্তিগত জীবন রূপরেখা ও সাধনা অ্যালবাম · Lifelong Roadmap
            </div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; color: ${subTextColor};">তারিখ: ${dateStr}</div>
          <div style="font-size: 11px; color: ${accentColor}; font-weight: bold; margin-top: 2px;">
            ডিজাইন: ${currentLayoutStyle} · থিম: ${currentTheme}
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 20px;">
        <div style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px; padding: 10px 14px; text-align: center;">
          <div style="font-size: 10px; text-transform: uppercase; color: ${subTextColor};">মূল লক্ষ্যক্ষেত্র</div>
          <div style="font-size: 18px; font-weight: bold; color: ${textColor}; margin-top: 2px;">${toBengaliNumber(sections.length)}টি</div>
        </div>
        <div style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px; padding: 10px 14px; text-align: center;">
          <div style="font-size: 10px; text-transform: uppercase; color: ${subTextColor};">মোট দক্ষতা ও ধাপ</div>
          <div style="font-size: 18px; font-weight: bold; color: ${textColor}; margin-top: 2px;">${toBengaliNumber(totalGoalsCount)}টি</div>
        </div>
        <div style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px; padding: 10px 14px; text-align: center;">
          <div style="font-size: 10px; text-transform: uppercase; color: ${subTextColor};">সম্পন্ন লক্ষ্য</div>
          <div style="font-size: 18px; font-weight: bold; color: #10B981; margin-top: 2px;">${toBengaliNumber(doneGoalsCount)}টি</div>
        </div>
        <div style="background-color: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 12px; padding: 10px 14px; text-align: center;">
          <div style="font-size: 10px; text-transform: uppercase; color: ${subTextColor};">ব্যক্তিগত অগ্রগতি</div>
          <div style="font-size: 18px; font-weight: bold; color: ${accentColor}; margin-top: 2px;">${toBengaliNumber(overallPercent)}%</div>
        </div>
      </div>
    </div>

    <!-- Sections List -->
    <div>
      ${sectionsHtml}
    </div>

    <!-- Footer -->
    <div style="margin-top: 36px; padding-top: 18px; border-top: 1px solid ${cardBorder}; text-align: center; color: ${subTextColor}; font-size: 11px;">
      <div style="font-weight: 600; color: ${textColor}; margin-bottom: 3px;">Saiful Islam Rifat</div>
      <div>একটি স্বপ্ন। একটি জীবনব্যাপী সাধনা। জ্ঞান, শুদ্ধতা, তিলাওয়াত ও কল্যাণের পথে।</div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Wait for fonts to load properly
    if (document.fonts) {
      await document.fonts.ready;
    }

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: bgColor
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Remaining pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Trigger true file download
    pdf.save('Saiful_Islam_Rifat_Life_Roadmap.pdf');
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};

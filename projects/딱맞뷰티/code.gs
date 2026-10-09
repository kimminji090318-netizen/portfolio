// ⚠️ 본인의 구글 스프레드시트 ID로 변경하세요 (필요 시)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('스마트 퍼스널 컬러 & AI 메이크업')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function analyzeColor(lab, gender) {
  try {
    const L = parseFloat(lab.L);
    const a = parseFloat(lab.a);
    const b = parseFloat(lab.b);

    let personalColor = "봄 웜 (Spring Warm)";
    let colorChips = {
      best: [
        { name: '코랄 핑크', hex: '#FF7F50' },
        { name: '피치', hex: '#FFDAB9' },
        { name: '웜 옐로우', hex: '#FFD700' }
      ],
      worst: [
        { name: '버건디', hex: '#800020' },
        { name: '딥 차콜', hex: '#333333' }
      ]
    };

    let fashionGuide = {
      title: "봄 웜 맞춤 코디북: 생기 넘치는 캐주얼 룩",
      top: { name: "아이보리 / 웜 코랄", hex: "#FFFDD0" },
      bottom: { name: "연청 데님 / 베이지", hex: "#A9C1D9" },
      reason: "따뜻하고 화사한 피부톤을 더욱 생기 있고 맑아 보이게 만들어 줍니다.",
      effect: "얼굴선이 부드러워 보이며 생기 있는 인상을 연출합니다."
    };

    let recommend = {
      cosmetic: "[올리브영] 데일리 피치 블러셔\n[클리오] 코랄 로즈 틴트",
      tip: "1단계(베이스): 촉촉하고 밝은 웜베이스 연출\n2단계(아이): 음영 피치 톤섀도 활용\n3단계(블러셔): 핑크 코랄 톤 블러셔\n4단계(립): 생기 있는 립 틴트"
    };

    if (a > 5 && b > 10) {
      if (L > 62) {
        personalColor = "봄 웜 (Spring Warm)";
      } else {
        personalColor = "가을 웜 (Autumn Warm)";
        colorChips = {
          best: [{ name: '올리브 그린', hex: '#808000' }, { name: '테라코타', hex: '#E2725B' }, { name: '머스타드', hex: '#FFDB58' }],
          worst: [{ name: '파스텔 핑크', hex: '#FFB6C1' }, { name: '마젠타', hex: '#FF00FF' }]
        };
        fashionGuide = {
          title: "가을 웜 맞춤 코디북: 모던 클래식 스타일링",
          top: { name: "소프트 화이트 / 카키", hex: "#F5F5DC" },
          bottom: { name: "애시 그레이 / 브라운", hex: "#8B8589" },
          reason: "깊고 우아한 분위기를 연출하여 피부톤을 한층 더 안정감 있게 잡아줍니다.",
          effect: "세련되고 지적인 이미지를 완성할 수 있습니다."
        };
        recommend = {
          cosmetic: "[올리브영] 페리페라 잉크 무드 글로이 틴트\n[클리오] 프로 아이 팔레트 (브릭 톤)",
          tip: "1단계(베이스): 맑고 투명한 웜톤 베이스 연출\n2단계(아이): 차분한 음영 브라운 사용\n3단계(블러셔): 딥 로즈빛 블러셔\n4단계(립): 체리 브릭 칠리 틴트"
        };
      }
    } else {
      if (L > 62) {
        personalColor = "여름 쿨 (Summer Cool)";
        colorChips = {
          best: [{ name: '파스텔 블루', hex: '#AEC6CF' }, { name: '라벤더', hex: '#E6E6FA' }, { name: '민트', hex: '#98FF98' }],
          worst: [{ name: '카키', hex: '#F0E68C' }, { name: '오렌지', hex: '#FFA500' }]
        };
        fashionGuide = {
          title: "여름 쿨 맞춤 코디북: 청량한 쿨톤 스타일링",
          top: { name: "크리스탈 화이트", hex: "#FFFFFF" },
          bottom: { name: "라이트 블루 데님", hex: "#ADD8E6" },
          reason: "맑고 깨끗한 쿨톤 특유의 피부결을 돋보이게 합니다.",
          effect: "화사하고 청초한 이미지를 줍니다."
        };
      } else {
        personalColor = "겨울 쿨 (Winter Cool)";
        colorChips = {
          best: [{ name: '로열 블루', hex: '#4169E1' }, { name: '버건디', hex: '#800020' }, { name: '퓨어 화이트', hex: '#FFFFFF' }],
          worst: [{ name: '코랄 오렌지', hex: '#FF7F50' }, { name: '골드 베이지', hex: '#F5F5DC' }]
        };
        fashionGuide = {
          title: "겨울 쿨 맞춤 코디북: 모던 엣지 스타일링",
          top: { name: "선명한 로열 블루 / 블랙", hex: "#000000" },
          bottom: { name: "슬레이트 그레이", hex: "#708090" },
          reason: "선명한 대비감을 선사하여 카리스마 있는 스타일을 만들어줍니다.",
          effect: "도시적이고 시크한 분위기를 극대화합니다."
        };
      }
    }

    return {
      success: true,
      personalColor: personalColor,
      L: L.toFixed(2),
      a: a.toFixed(2),
      b: b.toFixed(2),
      colorChips: colorChips,
      fashionGuide: fashionGuide,
      recommend: recommend
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function logResult(data) {
  try {
    let ss;
    if (SPREADSHEET_ID && SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE') {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }

    let sheet = ss.getActiveSheet();
    if (!sheet) sheet = ss.getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["진단일시", "이름", "성별", "나이", "Lab_L", "Lab_a", "Lab_b", "진단결과"]);
    }

    const timestamp = Utilities.formatDate(new Date(), "GMT+9", "yyyy-MM-dd HH:mm:ss");
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.gender || '',
      data.age || '',
      data.L || '',
      data.a || '',
      data.b || '',
      data.personalColor || ''
    ]);

    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

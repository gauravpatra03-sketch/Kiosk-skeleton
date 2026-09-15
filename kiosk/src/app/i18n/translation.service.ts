import { Injectable } from '@angular/core';

/** The two supported interface languages. */
export type Language = 'en' | 'hi';

/** A single translated string. */
export interface Entry {
  en: string;
  hi: string;
}

/**
 * Runtime EN/HIN translation for the kiosk. Uses a flat dictionary and a
 * session-persisted language choice so the toggle survives a refresh.
 * Intentionally dependency-free (no ngx-translate) for a 7-day demo.
 */
@Injectable()
export class TranslationService {
  private static readonly LANG_KEY = 'kiosk-lang';

  private _lang: Language;

  private readonly dict: Record<string, Entry> = {
    // ---- header / navbar ----
    'header.brandName': { en: 'City Care Clinic', hi: 'सिटी केयर क्लिनिक' },
    'header.brandTag': { en: 'Self Check-in Kiosk', hi: 'सेल्फ चेक-इन कियोस्क' },
    'header.home': { en: 'Home', hi: 'होम' },
    'header.help': { en: 'Staff can help', hi: 'स्टाफ मदद कर सकता है' },
    'header.step.start': { en: 'Start', hi: 'शुरू' },
    'header.step.details': { en: 'Details', hi: 'विवरण' },
    'header.step.clinic': { en: 'Clinic', hi: 'क्लिनिक' },
    'header.step.documents': { en: 'Documents', hi: 'दस्तावेज़' },
    'header.step.queue': { en: 'Queue', hi: 'कतार' },

    // ---- welcome ----
    'welcome.title': { en: 'Welcome', hi: 'स्वागत है' },
    'welcome.subtitle': {
      en: 'Tap the big button below to check in. It only takes about a minute.',
      hi: 'चेक-इन करने के लिए नीचे बड़े बटन पर टैप करें। इसमें बस एक मिनट लगता है।',
    },
    'welcome.begin': { en: 'Tap here to begin', hi: 'शुरू करने के लिए यहाँ टैप करें' },
    'welcome.help': {
      en: 'Need help? Just ask a member of our staff — we are happy to assist you.',
      hi: 'मदद चाहिए? हमारे स्टाफ से पूछें — हम आपकी मदद करने मे खुश हंै।',
    },

    // ---- details ----
    'details.title': { en: 'Your details', hi: 'आपकी जानकारी' },
    'details.subtitle': {
      en: 'Please enter your name and mobile number below.',
      hi: 'कृपया नीचे अपननाम और मोबाइल नंबर दर्ज करें।',
    },
    'details.nameLabel': { en: 'Your full name', hi: 'आपका पूरा नाम' },
    'details.namePh': { en: 'Type your name here', hi: 'यहाँ अपना नाम लिखें' },
    'details.phoneLabel': { en: 'Mobile number (10 digits)', hi: 'मोबाइल नंबर (10 अंक)' },
    'details.phonePh': { en: 'e.g. 9876543210', hi: 'जैसे 9876543210' },
    'details.error': {
      en: 'Please enter your name and a 10-digit mobile number.',
      hi: 'कृपया अपना नाम और 10 अंकों का मोबाइल नंबर दर्ज करें।',
    },
    'common.next': { en: 'Next', hi: 'आगे' },
    'common.back': { en: 'Back', hi: 'वापस' },

    // ---- department ----
    'department.title': { en: 'Which clinic do you need?', hi: 'आपको कौन सा क्लिनिक चाहिए?' },
    'department.subtitle': {
      en: 'Please tap one of the options below.',
      hi: 'कृपया नीचे दिए गए विकल्पों में से एक पर टैप करें।',
    },
    'dept.general.name': { en: 'General Check-up', hi: 'जनरल चेक-अप' },
    'dept.general.blurb': { en: 'Normal check-up and follow-up', hi: 'सामान् चेक-अप और फॉलो-अप' },
    'dept.heart.name': { en: 'Heart Clinic', hi: 'हृदय क्लिनिक' },
    'dept.heart.blurb': { en: 'Heart and blood pressure', hi: 'हृदय और रकतचाप' },
    'dept.bones.name': { en: 'Bones & Joints', hi: 'हड्डियाँ और जोड़' },
    'dept.bones.blurb': { en: 'Bones, knees and joints', hi: 'हड्डियाँ, घुटने और जोड़' },
    'dept.eye.name': { en: 'Eye Clinic', hi: 'नेत्र क्लिनिक' },
    'dept.eye.blurb': { en: 'Eyes and vision', hi: 'आँखें और दृष्टि' },
// ---- documents / upload ----
    'documents.title': { en: 'Previous medical documents', hi: 'पिछले चिकित्सा दस्तावेज़' },
    'documents.subtitle': {
      en:
        'Add your prescription, lab report or discharge summary so the doctor can review them. You can skip this step if you have nothing to upload.',
      hi:
        'अपना पर्चा, लैब रिपोर्ट या डिस्चार्ज सारांश जोड़ें ताकि डॉक्टर उन्हें देख सकें। यदि कुछ भी अपलोड नहीं है तो इस चरण को छोड़ा जा सकता है।',
    },
    'documents.fileAttached': { en: 'file attached', hi: 'फ़ाइल जुड़ी' },
    'documents.filesAttached': { en: 'files attached', hi: 'फ़ाइलें जुड़ी' },
    'documents.dropDrag': { en: 'Drag & drop', hi: 'यहाँ खींचें और छोड़ें' },
    'documents.attached': { en: 'Attached', hi: 'जुड़ा हुआ' },
    'documents.chooseFile': { en: 'Choose file', hi: 'फ़ाइल चुनें' },
    'documents.addMore': { en: 'Add more', hi: 'और जोड़ें' },
    'documents.orTap': { en: 'or tap the box above', hi: 'या ऊपर बॉक्स पर टैप करें' },
    'documents.ready': {
      en: 'Ready for processing — the clinic will review your documents.',
      hi: 'प्रोसेसिंग के लिए तैयार — क्लिनिक आपके दस्तावेज़ों की समीक्षा करेगा।',
    },
    'documents.continue': { en: 'Continue', hi: 'जारी रखें' },
    'documents.skip': { en: 'Skip for now', hi: 'अभी छोड़ें' },
    'documents.previewAlt': { en: 'Preview of', hi: 'का पूर्वावलोकन' },
    'documents.removeFile': { en: 'Remove', hi: 'हटाएँ' },
    'documents.slot.prescription.label': { en: 'Prescription', hi: 'पर्चा' },
    'documents.slot.prescription.hint': { en: 'A previous prescription', hi: 'पिछला पर्चा' },
    'documents.slot.lab.label': { en: 'Lab report', hi: 'लैब रिपोर्ट' },
    'documents.slot.lab.hint': { en: 'Blood work, urine, etc.', hi: 'रक्त जाँच, मूत्र आदि' },
    'documents.slot.discharge.label': { en: 'Discharge summary', hi: 'डिस्चार्ज सारांश' },
    'documents.slot.discharge.hint': { en: 'A past hospital stay', hi: 'पिछला अस्पताल प्रवास' },

    // ---- session restart ----
    'session.title': { en: 'Session ended', hi: 'सत्र समाप्त' },
    'session.subtitle': {
      en: "Your check-in was interrupted or has timed out. That's fine — just start over.",
      hi: 'आपका चेक-इन बाधित हुआ या समय समाप्त हो गया। कोई बात नहीं — बस फिर से शुरू करें।',
    },
    'session.startOver': { en: 'Start over', hi: 'फिर से शुरू करें' },

    // ---- queue / ticket ----
    'queue.ticketLabel': { en: 'Your queue number', hi: 'आपका कतार नंबर' },
    'queue.nameKey': { en: 'Name:', hi: 'नाम:' },
    'queue.clinicKey': { en: 'Clinic:', hi: 'क्लिनिक:' },
    'queue.note': {
      en: 'Please take a seat and keep an eye on the screen. We will call your number soon.',
      hi: 'कृपया बैठें और स्क्रीन पर ध्यान दें। हम जल्द ही आपका नंबर बुलाएँगे।',
    },
    'queue.printReceipt': { en: 'Print your receipt', hi: 'अपनी रसीद प्रिंट करें' },
    'queue.done': { en: 'I am done', hi: 'मैंने पूरा कर लिया' },

    // ---- receipt (print) ----
    'receipt.brand': { en: 'City Care Clinic', hi: 'सिटी केयर क्लिनिक' },
    'receipt.sub': { en: 'Self Check-in Kiosk', hi: 'सेल्फ चेक-इन कियोस्क' },
    'receipt.queueLabel': { en: 'Queue Number', hi: 'कतार नंबर' },
    'receipt.patient': { en: 'Patient', hi: 'रोगी' },
    'receipt.clinic': { en: 'Clinic', hi: 'क्लिनिक' },
    'receipt.time': { en: 'Time', hi: 'समय' },
    'receipt.foot': {
      en: "Please wait — we'll call your number on the screen.",
      hi: 'कृपया प्रतीक्षा करें — हम स्क्रीन पर आपका नंबर बुलाएँगे।',
    },
  };

  constructor() {
    this._lang = this.loadLang();
  }

  get lang(): Language {
    return this._lang;
  }

  /** Switch the interface language and keep it for future loads. */
  setLang(lang: Language): void {
    this._lang = lang;
    try {
      window.sessionStorage.setItem(TranslationService.LANG_KEY, lang);
    } catch {
      /* storage unavailable — language just won't persist */
    }
  }

  /** Look up a key in the current language; returns the key itself if unknown. */
  translate(key: string): string {
    const entry = this.dict[key];
    return entry ? entry[this._lang] : key;
  }

  /** Restore the persisted language (defaults to English). */
  private loadLang(): Language {
    try {
      const saved = window.sessionStorage.getItem(TranslationService.LANG_KEY);
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  }
}
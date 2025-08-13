// AI Chatbot simulation with context-aware responses
import type { Language } from "@/lib/translations"

export interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  language: Language
}

export interface ChatbotContext {
  userRole: "super_admin" | "org_admin" | "survey_conductor" | "guest"
  currentPage: string
  language: Language
}

// Predefined responses in multiple languages
const responses: Record<Language, Record<string, string[]>> = {
  en: {
    greeting: [
      "Hello! I'm your TakeSurvey AI assistant. How can I help you today?",
      "Hi there! I'm here to help you with TakeSurvey. What would you like to know?",
      "Welcome to TakeSurvey! I can help you navigate the platform and answer your questions.",
    ],
    survey_creation: [
      "To create a survey, you can either upload a document for AI extraction or create one from scratch using the 'Create Survey' button.",
      "You can create surveys by uploading PDF, DOCX, or TXT files, and our AI will extract relevant questions for you.",
      "Survey creation is easy! Use the upload feature to extract questions from documents or build custom surveys with our editor.",
    ],
    survey_management: [
      "You can edit, preview, publish, and assign surveys from your dashboard. Each survey can be customized with different question types.",
      "Survey management includes editing questions, assigning to conductors, tracking progress, and viewing responses.",
      "From your dashboard, you can manage all aspects of your surveys including publication, assignment, and response tracking.",
    ],
    responses_viewing: [
      "To view survey responses, click the 'View Responses' button on any survey card. You can see individual responses and export data.",
      "Survey responses can be viewed in detail, exported to CSV, and analyzed with our built-in analytics tools.",
      "Response viewing includes individual response details, location data, and comprehensive analytics.",
    ],
    conductor_management: [
      "Conductors can be managed from the 'Manage Conductors' section where you can add, edit, and assign surveys to field workers.",
      "You can add new conductors, track their performance, and assign specific surveys to them for data collection.",
      "Conductor management includes adding team members, tracking assignments, and monitoring collection progress.",
    ],
    risk_monitoring: [
      "Risk monitoring helps identify duplicate responses, location mismatches, and suspicious patterns in your survey data.",
      "Our risk system automatically flags potential issues like duplicate submissions and unusual response patterns.",
      "Risk alerts help maintain data quality by identifying potential fraud or data collection issues.",
    ],
    language_help: [
      "You can change the language using the language selector in the top-right corner. We support English, Hindi, and Telugu.",
      "TakeSurvey supports multiple languages. Use the language dropdown to switch between English, Hindi, and Telugu.",
      "Language settings can be changed anytime using the language selector. Your preference will be saved automatically.",
    ],
    navigation: [
      "Use the sidebar or dashboard tabs to navigate between different sections like surveys, analytics, and settings.",
      "Navigation is easy with our dashboard layout. Each role has access to relevant features and tools.",
      "You can access different features through the main dashboard tabs and quick action buttons.",
    ],
    default: [
      "I'm here to help with TakeSurvey! You can ask me about creating surveys, managing responses, or using any platform features.",
      "I can help you with survey creation, data collection, response analysis, and platform navigation. What would you like to know?",
      "Feel free to ask me about any TakeSurvey features including survey management, conductor assignment, or data analysis.",
    ],
  },
  hi: {
    greeting: [
      "नमस्ते! मैं आपका TakeSurvey AI सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      "हैलो! मैं TakeSurvey के साथ आपकी मदद के लिए यहां हूं। आप क्या जानना चाहते हैं?",
      "TakeSurvey में आपका स्वागत है! मैं प्लेटफॉर्म नेविगेट करने और आपके सवालों के जवाब देने में मदद कर सकता हूं।",
    ],
    survey_creation: [
      "सर्वेक्षण बनाने के लिए, आप AI निष्कर्षण के लिए दस्तावेज़ अपलोड कर सकते हैं या 'सर्वेक्षण बनाएं' बटन का उपयोग करके शुरू से बना सकते हैं।",
      "आप PDF, DOCX, या TXT फाइलें अपलोड करके सर्वेक्षण बना सकते हैं, और हमारा AI आपके लिए प्रासंगिक प्रश्न निकालेगा।",
      "सर्वेक्षण बनाना आसान है! दस्तावेजों से प्रश्न निकालने के लिए अपलोड सुविधा का उपयोग करें या हमारे एडिटर के साथ कस्टम सर्वेक्षण बनाएं।",
    ],
    survey_management: [
      "आप अपने डैशबोर्ड से सर्वेक्षण संपादित, पूर्वावलोकन, प्रकाशित और असाइन कर सकते हैं। प्रत्येक सर्वेक्षण को विभिन्न प्रश्न प्रकारों के साथ अनुकूलित किया जा सकता है।",
      "सर्वेक्षण प्रबंधन में प्रश्न संपादन, संचालकों को असाइन करना, प्रगति ट्रैकिंग और प्रतिक्रियाएं देखना शामिल है।",
      "अपने डैशबोर्ड से, आप प्रकाशन, असाइनमेंट और प्रतिक्रिया ट्रैकिंग सहित अपने सर्वेक्षणों के सभी पहलुओं को प्रबंधित कर सकते हैं।",
    ],
    responses_viewing: [
      "सर्वेक्षण प्रतिक्रियाएं देखने के लिए, किसी भी सर्वेक्षण कार्ड पर 'प्रतिक्रियाएं देखें' बटन पर क्लिक करें। आप व्यक्तिगत प्रतिक्रियाएं देख सकते हैं और डेटा निर्यात कर सकते हैं।",
      "सर्वेक्षण प्रतिक्रियाओं को विस्तार से देखा जा सकता है, CSV में निर्यात किया जा सकता है, और हमारे अंतर्निहित एनालिटिक्स टूल्स के साथ विश्लेषण किया जा सकता है।",
      "प्रतिक्रिया देखने में व्यक्तिगत प्रतिक्रिया विवरण, स्थान डेटा और व्यापक एनालिटिक्स शामिल हैं।",
    ],
    conductor_management: [
      "संचालकों को 'संचालक प्रबंधन' अनुभाग से प्रबंधित किया जा सकता है जहां आप फील्ड वर्कर्स को जोड़, संपादित और सर्वेक्षण असाइन कर सकते हैं।",
      "आप नए संचालक जोड़ सकते हैं, उनके प्रदर्शन को ट्रैक कर सकते हैं, और डेटा संग्रह के लिए उन्हें विशिष्ट सर्वेक्षण असाइन कर सकते हैं।",
      "संचालक प्रबंधन में टीम सदस्यों को जोड़ना, असाइनमेंट ट्रैकिंग और संग्रह प्रगति की निगरानी शामिल है।",
    ],
    risk_monitoring: [
      "जोखिम निगरानी आपके सर्वेक्षण डेटा में डुप्लिकेट प्रतिक्रियाओं, स्थान बेमेल और संदिग्ध पैटर्न की पहचान करने में मदद करती है।",
      "हमारा जोखिम सिस्टम स्वचालित रूप से डुप्लिकेट सबमिशन और असामान्य प्रतिक्रिया पैटर्न जैसी संभावित समस्याओं को फ्लैग करता है।",
      "जोखिम अलर्ट संभावित धोखाधड़ी या डेटा संग्रह समस्याओं की पहचान करके डेटा गुणवत्ता बनाए रखने में मदद करते हैं।",
    ],
    language_help: [
      "आप ऊपरी-दाएं कोने में भाषा चयनकर्ता का उपयोग करके भाषा बदल सकते हैं। हम अंग्रेजी, हिंदी और तेलुगु का समर्थन करते हैं।",
      "TakeSurvey कई भाषाओं का समर्थन करता है। अंग्रेजी, हिंदी और तेलुगु के बीच स्विच करने के लिए भाषा ड्रॉपडाउन का उपयोग करें।",
      "भाषा सेटिंग्स को भाषा चयनकर्ता का उपयोग करके कभी भी बदला जा सकता है। आपकी प्राथमिकता स्वचालित रूप से सहेजी जाएगी।",
    ],
    navigation: [
      "सर्वेक्षण, एनालिटिक्स और सेटिंग्स जैसे विभिन्न अनुभागों के बीच नेविगेट करने के लिए साइडबार या डैशबोर्ड टैब का उपयोग करें।",
      "हमारे डैशबोर्ड लेआउट के साथ नेविगेशन आसान है। प्रत्येक भूमिका के पास प्रासंगिक सुविधाओं और उपकरणों तक पहुंच है।",
      "आप मुख्य डैशबोर्ड टैब और त्वरित कार्य बटन के माध्यम से विभिन्न सुविधाओं तक पहुंच सकते हैं।",
    ],
    default: [
      "मैं TakeSurvey के साथ मदद के लिए यहां हूं! आप मुझसे सर्वेक्षण बनाने, प्रतिक्रियाओं का प्रबंधन करने, या किसी भी प्लेटफॉर्म सुविधाओं के बारे में पूछ सकते हैं।",
      "मैं सर्वेक्षण निर्माण, डेटा संग्रह, प्रतिक्रिया विश्लेषण और प्लेटफॉर्म नेविगेशन में आपकी मदद कर सकता हूं। आप क्या जानना चाहते हैं?",
      "TakeSurvey की किसी भी सुविधा के बारे में मुझसे पूछने में संकोच न करें जिसमें सर्वेक्षण प्रबंधन, संचालक असाइनमेंट या डेटा विश्लेषण शामिल है।",
    ],
  },
  te: {
    greeting: [
      "నమస్కారం! నేను మీ TakeSurvey AI సహాయకుడిని. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
      "హలో! TakeSurvey తో మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
      "TakeSurvey కు స్వాగతం! ప్లాట్‌ఫారమ్‌ను నావిగేట్ చేయడంలో మరియు మీ ప్రశ్నలకు సమాధానం ఇవ్వడంలో నేను సహాయం చేయగలను.",
    ],
    survey_creation: [
      "సర్వే సృష్టించడానికి, మీరు AI వెలికితీత కోసం డాక్యుమెంట్‌ను అప్‌లోడ్ చేయవచ్చు లేదా 'సర్వే సృష్టించండి' బటన్‌ను ఉపయోగించి మొదటి నుండి సృష్టించవచ్చు.",
      "మీరు PDF, DOCX, లేదా TXT ఫైల్‌లను అప్‌లోడ్ చేయడం ద్వారా సర్వేలను సృష్టించవచ్చు, మరియు మా AI మీ కోసం సంబంధిత ప్రశ్నలను వెలికితీస్తుంది.",
      "సర్వే సృష్టించడం సులభం! డాక్యుమెంట్‌ల నుండి ప్రశ్నలను వెలికితీయడానికి అప్‌లోడ్ ఫీచర్‌ను ఉపయోగించండి లేదా మా ఎడిటర్‌తో కస్టమ్ సర్వేలను నిర్మించండి.",
    ],
    survey_management: [
      "మీరు మీ డాష్‌బోర్డ్ నుండి సర్వేలను సవరించవచ్చు, ప్రివ్యూ చేయవచ్చు, ప్రచురించవచ్చు మరియు కేటాయించవచ్చు. ప్రతి సర్వేను వివిధ ప్రశ్న రకాలతో అనుకూలీకరించవచ్చు.",
      "సర్వే నిర్వహణలో ప్రశ్నల సవరణ, కండక్టర్‌లకు కేటాయించడం, పురోగతి ట్రాకింగ్ మరియు ప్రతిస్పందనలను చూడటం ఉంటుంది.",
      "మీ డాష్‌బోర్డ్ నుండి, మీరు ప్రచురణ, కేటాయింపు మరియు ప్రతిస్పందన ట్రాకింగ్‌తో సహా మీ సర్వేల అన్ని అంశాలను నిర్వహించవచ్చు.",
    ],
    responses_viewing: [
      "సర్వే ప్రతిస్పందనలను చూడటానికి, ఏదైనా సర్వే కార్డ్‌లో 'ప్రతిస్పందనలను చూడండి' బటన్‌పై క్లిక్ చేయండి. మీరు వ్యక్తిగత ప్రతిస్పందనలను చూడవచ్చు మరియు డేటాను ఎగుమతి చేయవచ్చు.",
      "సర్వే ప్రతిస్పందనలను వివరంగా చూడవచ్చు, CSV కు ఎగుమతి చేయవచ్చు మరియు మా అంతర్నిర్మిత అనలిటిక్స్ టూల్స్‌తో విశ్లేషించవచ్చు.",
      "ప్రతిస్పందన వీక్షణలో వ్యక్తిగత ప్రతిస్పందన వివరాలు, స్థాన డేటా మరియు సమగ్ర అనలిటిక్స్ ఉంటాయి.",
    ],
    conductor_management: [
      "కండక్టర్‌లను 'కండక్టర్ నిర్వహణ' విభాగం నుండి నిర్వహించవచ్చు, ఇక్కడ మీరు ఫీల్డ్ వర్కర్‌లను జోడించవచ్చు, సవరించవచ్చు మరియు సర్వేలను కేటాయించవచ్చు.",
      "మీరు కొత్త కండక్టర్‌లను జోడించవచ్చు, వారి పనితీరును ట్రాక్ చేయవచ్చు మరియు డేటా సేకరణ కోసం వారికి నిర్దిష్ట సర్వేలను కేటాయించవచ్చు.",
      "కండక్టర్ నిర్వహణలో టీమ్ సభ్యులను జోడించడం, కేటాయింపుల ట్రాకింగ్ మరియు సేకరణ పురోగతిని పర్యవేక్షించడం ఉంటుంది.",
    ],
    risk_monitoring: [
      "రిస్క్ మానిటరింగ్ మీ సర్వే డేటాలో డూప్లికేట్ ప్రతిస్పందనలు, స్థాన అసమానతలు మరియు అనుమానాస్పద నమూనాలను గుర్తించడంలో సహాయపడుతుంది.",
      "మా రిస్క్ సిస్టమ్ డూప్లికేట్ సబ్మిషన్‌లు మరియు అసాధారణ ప్రతిస్పందన నమూనాలు వంటి సంభావిత సమస్యలను స్వయంచాలకంగా ఫ్లాగ్ చేస్తుంది.",
      "రిస్క్ అలర్ట్‌లు సంభావిత మోసం లేదా డేటా సేకరణ సమస్యలను గుర్తించడం ద్వారా డేటా నాణ్యతను నిర్వహించడంలో సహాయపడతాయి.",
    ],
    language_help: [
      "మీరు ఎగువ-కుడి మూలలో ఉన్న భాష ఎంపికను ఉపయోగించి భాషను మార్చవచ్చు. మేము ఇంగ్లీష్, హిందీ మరియు తెలుగుకు మద్దతు ఇస్తాము.",
      "TakeSurvey బహుళ భాషలకు మద్దతు ఇస్తుంది. ఇంగ్లీష్, హిందీ మరియు తెలుగు మధ్య మారడానికి భాష డ్రాప్‌డౌన్‌ను ఉపయోగించండి.",
      "భాష సెట్టింగ్‌లను భాష ఎంపికను ఉపయోగించి ఎప్పుడైనా మార్చవచ్చు. మీ ప్రాధాన్యత స్వయంచాలకంగా సేవ్ చేయబడుతుంది.",
    ],
    navigation: [
      "సర్వేలు, అనలిటిక్స్ మరియు సెట్టింగ్‌లు వంటి వివిధ విభాగాల మధ్య నావిగేట్ చేయడానికి సైడ్‌బార్ లేదా డాష్‌బోర్డ్ ట్యాబ్‌లను ఉపయోగించండి.",
      "మా డాష్‌బోర్డ్ లేఅవుట్‌తో నావిగేషన్ సులభం. ప్రతి పాత్రకు సంబంధిత ఫీచర్లు మరియు టూల్స్‌కు యాక్సెస్ ఉంటుంది.",
      "మీరు ప్రధాన డాష్‌బోర్డ్ ట్యాబ్‌లు మరియు త్వరిత చర్య బటన్‌ల ద్వారా వివిధ ఫీచర్లను యాక్సెస్ చేయవచ్చు.",
    ],
    default: [
      "నేను TakeSurvey తో సహాయం చేయడానికి ఇక్కడ ఉన్నాను! మీరు సర్వేలను సృష్టించడం, ప్రతిస్పందనలను నిర్వహించడం లేదా ఏదైనా ప్లాట్‌ఫారమ్ ఫీచర్‌ల గురించి నన్ను అడగవచ్చు.",
      "నేను సర్వే సృష్టి, డేటా సేకరణ, ప్రతిస్పందన విశ్లేషణ మరియు ప్లాట్‌ఫారమ్ నావిగేషన్‌లో మీకు సహాయం చేయగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
      "సర్వే నిర్వహణ, కండక్టర్ కేటాయింపు లేదా డేటా విశ్లేషణతో సహా ఏదైనా TakeSurvey ఫీచర్‌ల గురించి నన్ను అడగడానికి సంకోచించకండి.",
    ],
  },
}

export class ChatbotAI {
  private context: ChatbotContext

  constructor(context: ChatbotContext) {
    this.context = context
  }

  updateContext(context: Partial<ChatbotContext>) {
    this.context = { ...this.context, ...context }
  }

  generateResponse(userMessage: string): string {
    const message = userMessage.toLowerCase()
    const { language } = this.context

    // Determine response category based on keywords
    let category = "default"

    if (message.includes("hello") || message.includes("hi") || message.includes("help")) {
      category = "greeting"
    } else if (message.includes("create") || message.includes("survey") || message.includes("upload")) {
      category = "survey_creation"
    } else if (message.includes("manage") || message.includes("edit") || message.includes("publish")) {
      category = "survey_management"
    } else if (message.includes("response") || message.includes("view") || message.includes("export")) {
      category = "responses_viewing"
    } else if (message.includes("conductor") || message.includes("assign") || message.includes("team")) {
      category = "conductor_management"
    } else if (message.includes("risk") || message.includes("monitor") || message.includes("alert")) {
      category = "risk_monitoring"
    } else if (
      message.includes("language") ||
      message.includes("translate") ||
      message.includes("hindi") ||
      message.includes("telugu")
    ) {
      category = "language_help"
    } else if (message.includes("navigate") || message.includes("menu") || message.includes("dashboard")) {
      category = "navigation"
    }

    // Get responses for the category and language
    const categoryResponses = responses[language]?.[category] || responses.en[category] || responses.en.default

    // Return a random response from the category
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
  }

  getContextualGreeting(): string {
    const { userRole, language } = this.context
    const greetings = responses[language]?.greeting || responses.en.greeting

    let roleSpecific = ""
    switch (userRole) {
      case "super_admin":
        roleSpecific =
          language === "hi"
            ? " आप सुपर एडमिन के रूप में सभी सुविधाओं तक पहुंच सकते हैं।"
            : language === "te"
              ? " మీరు సూపర్ అడ్మిన్‌గా అన్ని ఫీచర్లను యాక్సెస్ చేయవచ్చు।"
              : " As a Super Admin, you have access to all platform features."
        break
      case "org_admin":
        roleSpecific =
          language === "hi"
            ? " संगठन एडमिन के रूप में, आप सर्वेक्षण बना सकते हैं और संचालकों को प्रबंधित कर सकते हैं।"
            : language === "te"
              ? " సంస్థ అడ్మిన్‌గా, మీరు సర్వేలను సృష్టించవచ్చు మరియు కండక్టర్‌లను నిర్వహించవచ్చు।"
              : " As an Organization Admin, you can create surveys and manage conductors."
        break
      case "survey_conductor":
        roleSpecific =
          language === "hi"
            ? " सर्वेक्षण संचालक के रूप में, आप असाइन किए गए सर्वेक्षण कर सकते हैं और प्रतिक्रियाएं एकत्र कर सकते हैं।"
            : language === "te"
              ? " సర్వే కండక్టర్‌గా, మీరు కేటాయించిన సర్వేలను నిర్వహించవచ్చు మరియు ప్రతిస్పందనలను సేకరించవచ్చు।"
              : " As a Survey Conductor, you can conduct assigned surveys and collect responses."
        break
    }

    return greetings[0] + roleSpecific
  }
}

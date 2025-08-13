// Multi-language translation system
export type Language = "en" | "hi" | "te"

export interface Translations {
  // Navigation and Common
  home: string
  login: string
  logout: string
  dashboard: string
  surveys: string
  settings: string
  profile: string
  loading: string
  save: string
  cancel: string
  delete: string
  edit: string
  create: string
  submit: string
  back: string
  next: string
  previous: string
  close: string
  search: string
  filter: string
  export: string
  import: string
  refresh: string
  activeOrganizations: string
  acrossOrganizations: string
  requireAttention: string
  riskMap: string
  coveragePercentage: string
  avgResponseTime: string
  riskAlertTriggered: string
  surveyCompleted: string
  newConductorAssigned: string
  addOrganization: string
  manageUsers: string
  assignedTo: string
  completion: string
  activeAlerts: string
  automatedRiskDetection: string
  multipleResponsesDetected: string
  highPriority: string
  assignedSurveys: string
  startSurvey: string
  conductSurvey: string
  priority: string
  surveyDetails: string
  add: string
  questions: string
  addQuestion: string
  updateSurvey: string
  users: string
  created: string
  assigned: string
  progress: string
  viewLocations: string

  // Authentication
  email: string
  password: string
  signIn: string
  signOut: string
  welcomeBack: string
  loginToAccount: string
  demoAccounts: string
  superAdmin: string
  organizationAdmin: string
  surveyConductor: string

  // Dashboard
  totalSurveys: string
  activeSurveys: string
  draftSurveys: string
  completedSurveys: string
  totalResponses: string
  conductors: string
  organizations: string
  quickActions: string
  recentActivity: string

  // Survey Management
  createSurvey: string
  editSurvey: string
  deleteSurvey: string
  publishSurvey: string
  previewSurvey: string
  assignSurvey: string
  viewResponses: string
  uploadDocument: string
  extractQuestions: string
  manageConductors: string
  viewAnalytics: string

  // Survey Form
  surveyTitle: string
  surveyDescription: string
  questionText: string
  questionType: string
  required: string
  optional: string
  multipleChoice: string
  textInput: string
  rating: string
  yesNo: string

  // Responses
  responseCount: string
  submittedAt: string
  location: string
  deviceInfo: string
  exportResponses: string

  // Risk Monitoring
  riskMonitoring: string
  investigate: string
  markResolved: string
  viewDetails: string
  riskLevel: string
  high: string
  medium: string
  low: string

  // Messages
  success: string
  error: string
  warning: string
  info: string
  confirmDelete: string
  dataLoaded: string
  dataSaved: string

  // Branding
  appName: string
  appDescription: string
  poweredBy: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation and Common
    home: "Home",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    surveys: "Surveys",
    settings: "Settings",
    profile: "Profile",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    submit: "Submit",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
    refresh: "Refresh",
    activeOrganizations: "Active organizations",
    acrossOrganizations: "Across all organizations",
    requireAttention: "Require attention",
    riskMap: "Risk Map",
    coveragePercentage: "Coverage Percentage",
    avgResponseTime: "Avg Response Time",
    riskAlertTriggered: "Risk alert triggered",
    surveyCompleted: "Survey completed",
    newConductorAssigned: "New conductor assigned",
    addOrganization: "Add Organization",
    manageUsers: "Manage Users",
    assignedTo: "Assigned to",
    completion: "Completion",
    activeAlerts: "Active Alerts",
    automatedRiskDetection:
      "Automated risk detection is active. Review flagged items below and take appropriate action.",
    multipleResponsesDetected: "Multiple responses detected from same device in Water Access Survey",
    highPriority: "high priority",
    assignedSurveys: "Assigned Surveys",
    startSurvey: "Start Survey",
    conductSurvey: "Conduct Survey",
    priority: "Priority",
    surveyDetails: "Survey Details",
    add: "Add",
    questions: "Questions",
    addQuestion: "Add Question",
    updateSurvey: "Update Survey",
    users: "Users",
    created: "Created",
    assigned: "Assigned",
    progress: "Progress",
    viewLocations: "View Locations",

    // Authentication
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signOut: "Sign Out",
    welcomeBack: "Welcome Back",
    loginToAccount: "Login to your account",
    demoAccounts: "Demo Accounts",
    superAdmin: "Super Admin",
    organizationAdmin: "Organization Admin",
    surveyConductor: "Survey Conductor",

    // Dashboard
    totalSurveys: "Total Surveys",
    activeSurveys: "Active Surveys",
    draftSurveys: "Draft Surveys",
    completedSurveys: "Completed Surveys",
    totalResponses: "Total Responses",
    conductors: "Conductors",
    organizations: "Organizations",
    quickActions: "Quick Actions",
    recentActivity: "Recent Activity",

    // Survey Management
    createSurvey: "Create Survey",
    editSurvey: "Edit Survey",
    deleteSurvey: "Delete Survey",
    publishSurvey: "Publish Survey",
    previewSurvey: "Preview Survey",
    assignSurvey: "Assign Survey",
    viewResponses: "View Responses",
    uploadDocument: "Upload Document",
    extractQuestions: "Extract Questions",
    manageConductors: "Manage Conductors",
    viewAnalytics: "View Analytics",

    // Survey Form
    surveyTitle: "Survey Title",
    surveyDescription: "Survey Description",
    questionText: "Question Text",
    questionType: "Question Type",
    required: "Required",
    optional: "Optional",
    multipleChoice: "Multiple Choice",
    textInput: "Text Input",
    rating: "Rating",
    yesNo: "Yes/No",

    // Responses
    responseCount: "Response Count",
    submittedAt: "Submitted At",
    location: "Location",
    deviceInfo: "Device Info",
    exportResponses: "Export Responses",

    // Risk Monitoring
    riskMonitoring: "Risk Monitoring",
    investigate: "Investigate",
    markResolved: "Mark Resolved",
    viewDetails: "View Details",
    riskLevel: "Risk Level",
    high: "High",
    medium: "Medium",
    low: "Low",

    // Messages
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
    confirmDelete: "Are you sure you want to delete this item?",
    dataLoaded: "Data loaded successfully",
    dataSaved: "Data saved successfully",

    // Branding
    appName: "TakeSurvey",
    appDescription: "AI-Powered Smart Survey Tool for Data Collection and Analysis",
    poweredBy: "Powered by TakeSurvey",
  },

  hi: {
    // Navigation and Common
    home: "होम",
    login: "लॉगिन",
    logout: "लॉगआउट",
    dashboard: "डैशबोर्ड",
    surveys: "सर्वेक्षण",
    settings: "सेटिंग्स",
    profile: "प्रोफाइल",
    loading: "लोड हो रहा है...",
    save: "सेव करें",
    cancel: "रद्द करें",
    delete: "डिलीट करें",
    edit: "संपादित करें",
    create: "बनाएं",
    submit: "जमा करें",
    back: "वापस",
    next: "अगला",
    previous: "पिछला",
    close: "बंद करें",
    search: "खोजें",
    filter: "फिल्टर",
    export: "निर्यात",
    import: "आयात",
    refresh: "रीफ्रेश",
    activeOrganizations: "सक्रिय संगठन",
    acrossOrganizations: "सभी संगठनों में",
    requireAttention: "ध्यान देने की आवश्यकता",
    riskMap: "जोखिम मानचित्र",
    coveragePercentage: "कवरेज प्रतिशत",
    avgResponseTime: "औसत प्रतिक्रिया समय",
    riskAlertTriggered: "जोखिम अलर्ट ट्रिगर हुआ",
    surveyCompleted: "सर्वेक्षण पूर्ण",
    newConductorAssigned: "नया संचालक असाइन किया गया",
    addOrganization: "संगठन जोड़ें",
    manageUsers: "उपयोगकर्ता प्रबंधन",
    assignedTo: "को असाइन किया गया",
    completion: "पूर्णता",
    activeAlerts: "सक्रिय अलर्ट",
    automatedRiskDetection: "स्वचालित जोखिम पहचान सक्रिय है। नीचे दिए गए फ्लैग किए गए आइटम की समीक्षा करें और उचित कार्रवाई करें।",
    multipleResponsesDetected: "वाटर एक्सेस सर्वे में एक ही डिवाइस से कई प्रतिक्रियाएं मिलीं",
    highPriority: "उच्च प्राथमिकता",
    assignedSurveys: "असाइन किए गए सर्वेक्षण",
    startSurvey: "सर्वेक्षण शुरू करें",
    conductSurvey: "सर्वेक्षण संचालित करें",
    priority: "प्राथमिकता",
    surveyDetails: "सर्वेक्षण विवरण",
    add: "जोड़ें",
    questions: "प्रश्न",
    addQuestion: "प्रश्न जोड़ें",
    updateSurvey: "सर्वेक्षण अपडेट करें",
    users: "उपयोगकर्ता",
    created: "बनाया गया",
    assigned: "असाइन किया गया",
    progress: "प्रगति",
    viewLocations: "स्थान देखें",

    // Authentication
    email: "ईमेल",
    password: "पासवर्ड",
    signIn: "साइन इन",
    signOut: "साइन आउट",
    welcomeBack: "वापस स्वागत है",
    loginToAccount: "अपने खाते में लॉगिन करें",
    demoAccounts: "डेमो खाते",
    superAdmin: "सुपर एडमिन",
    organizationAdmin: "संगठन एडमिन",
    surveyConductor: "सर्वेक्षण संचालक",

    // Dashboard
    totalSurveys: "कुल सर्वेक्षण",
    activeSurveys: "सक्रिय सर्वेक्षण",
    draftSurveys: "ड्राफ्ट सर्वेक्षण",
    completedSurveys: "पूर्ण सर्वेक्षण",
    totalResponses: "कुल प्रतिक्रियाएं",
    conductors: "संचालक",
    organizations: "संगठन",
    quickActions: "त्वरित कार्य",
    recentActivity: "हाल की गतिविधि",

    // Survey Management
    createSurvey: "सर्वेक्षण बनाएं",
    editSurvey: "सर्वेक्षण संपादित करें",
    deleteSurvey: "सर्वेक्षण डिलीट करें",
    publishSurvey: "सर्वेक्षण प्रकाशित करें",
    previewSurvey: "सर्वेक्षण पूर्वावलोकन",
    assignSurvey: "सर्वेक्षण असाइन करें",
    viewResponses: "प्रतिक्रियाएं देखें",
    uploadDocument: "दस्तावेज़ अपलोड करें",
    extractQuestions: "प्रश्न निकालें",
    manageConductors: "संचालक प्रबंधन",
    viewAnalytics: "एनालिटिक्स देखें",

    // Survey Form
    surveyTitle: "सर्वेक्षण शीर्षक",
    surveyDescription: "सर्वेक्षण विवरण",
    questionText: "प्रश्न पाठ",
    questionType: "प्रश्न प्रकार",
    required: "आवश्यक",
    optional: "वैकल्पिक",
    multipleChoice: "बहुविकल्पीय",
    textInput: "टेक्स्ट इनपुट",
    rating: "रेटिंग",
    yesNo: "हां/नहीं",

    // Responses
    responseCount: "प्रतिक्रिया संख्या",
    submittedAt: "जमा किया गया",
    location: "स्थान",
    deviceInfo: "डिवाइस जानकारी",
    exportResponses: "प्रतिक्रियाएं निर्यात करें",

    // Risk Monitoring
    riskMonitoring: "जोखिम निगरानी",
    investigate: "जांच करें",
    markResolved: "हल के रूप में चिह्नित करें",
    viewDetails: "विवरण देखें",
    riskLevel: "जोखिम स्तर",
    high: "उच्च",
    medium: "मध्यम",
    low: "कम",

    // Messages
    success: "सफलता",
    error: "त्रुटि",
    warning: "चेतावनी",
    info: "जानकारी",
    confirmDelete: "क्या आप वाकई इस आइटम को डिलीट करना चाहते हैं?",
    dataLoaded: "डेटा सफलतापूर्वक लोड हुआ",
    dataSaved: "डेटा सफलतापूर्वक सेव हुआ",

    // Branding
    appName: "टेकसर्वे",
    appDescription: "डेटा संग्रह और विश्लेषण के लिए AI-संचालित स्मार्ट सर्वेक्षण उपकरण",
    poweredBy: "टेकसर्वे द्वारा संचालित",
  },

  te: {
    // Navigation and Common
    home: "హోమ్",
    login: "లాగిన్",
    logout: "లాగౌట్",
    dashboard: "డాష్‌బోర్డ్",
    surveys: "సర్వేలు",
    settings: "సెట్టింగ్స్",
    profile: "ప్రొఫైల్",
    loading: "లోడ్ అవుతోంది...",
    save: "సేవ్ చేయండి",
    cancel: "రద్దు చేయండి",
    delete: "తొలగించండి",
    edit: "సవరించండి",
    create: "సృష్టించండి",
    submit: "సమర్పించండి",
    back: "వెనుకకు",
    next: "తదుపరి",
    previous: "మునుపటి",
    close: "మూసివేయండి",
    search: "వెతకండి",
    filter: "ఫిల్టర్",
    export: "ఎగుమతి",
    import: "దిగుమతి",
    refresh: "రిఫ్రెష్",
    activeOrganizations: "క్రియాశీల సంస్థలు",
    acrossOrganizations: "అన్ని సంస్థలలో",
    requireAttention: "దృష్టి అవసరం",
    riskMap: "రిస్క్ మ్యాప్",
    coveragePercentage: "కవరేజ్ శాతం",
    avgResponseTime: "సగటు ప్రతిస్పందన సమయం",
    riskAlertTriggered: "రిస్క్ అలర్ట్ ట్రిగ్గర్ అయింది",
    surveyCompleted: "సర్వే పూర్తయింది",
    newConductorAssigned: "కొత్త కండక్టర్ కేటాయించబడింది",
    addOrganization: "సంస్థను జోడించండి",
    manageUsers: "వినియోగదారుల నిర్వహణ",
    assignedTo: "కు కేటాయించబడింది",
    completion: "పూర్తి",
    activeAlerts: "క్రియాశీల అలర్ట్‌లు",
    automatedRiskDetection: "ఆటోమేటెడ్ రిస్క్ డిటెక్షన్ క్రియాశీలంగా ఉంది. దిగువ ఫ్లాగ్ చేయబడిన అంశాలను సమీక్షించండి మరియు తగిన చర్య తీసుకోండి।",
    multipleResponsesDetected: "వాటర్ యాక్సెస్ సర్వేలో అదే పరికరం నుండి బహుళ ప్రతిస్పందనలు గుర్తించబడ్డాయి",
    highPriority: "అధిక ప్రాధాన్యత",
    assignedSurveys: "కేటాయించిన సర్వేలు",
    startSurvey: "సర్వే ప్రారంభించండి",
    conductSurvey: "సర్వే నిర్వహించండి",
    priority: "ప్రాధాన్యత",
    surveyDetails: "సర్వే వివరాలు",
    add: "జోడించండి",
    questions: "ప్రశ్నలు",
    addQuestion: "ప్రశ్న జోడించండి",
    updateSurvey: "సర్వే అప్‌డేట్ చేయండి",
    users: "వినియోగదారులు",
    created: "సృష్టించబడింది",
    assigned: "కేటాయించబడింది",
    progress: "పురోగతి",
    viewLocations: "స్థానాలు చూడండి",

    // Authentication
    email: "ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    signIn: "సైన్ ఇన్",
    signOut: "సైన్ అవుట్",
    welcomeBack: "తిరిగి స్వాగతం",
    loginToAccount: "మీ ఖాతాలోకి లాగిన్ చేయండి",
    demoAccounts: "డెమో ఖాతాలు",
    superAdmin: "సూపర్ అడ్మిన్",
    organizationAdmin: "సంస్థ అడ్మిన్",
    surveyConductor: "సర్వే కండక్టర్",

    // Dashboard
    totalSurveys: "మొత్తం సర్వేలు",
    activeSurveys: "క్రియాశీల సర్వేలు",
    draftSurveys: "డ్రాఫ్ట్ సర్వేలు",
    completedSurveys: "పూర్తయిన సర్వేలు",
    totalResponses: "మొత్తం ప్రతిస్పందనలు",
    conductors: "కండక్టర్లు",
    organizations: "సంస్థలు",
    quickActions: "త్వరిత చర్యలు",
    recentActivity: "ఇటీవలి కార్యకలాపాలు",

    // Survey Management
    createSurvey: "సర్వే సృష్టించండి",
    editSurvey: "సర్వే సవరించండి",
    deleteSurvey: "సర్వే తొలగించండి",
    publishSurvey: "సర్వే ప్రచురించండి",
    previewSurvey: "సర్వే ప్రివ్యూ",
    assignSurvey: "సర్వే కేటాయించండి",
    viewResponses: "ప్రతిస్పందనలు చూడండి",
    uploadDocument: "డాక్యుమెంట్ అప్‌లోడ్ చేయండి",
    extractQuestions: "ప్రశ్నలు వెలికితీయండి",
    manageConductors: "కండక్టర్ల నిర్వహణ",
    viewAnalytics: "అనలిటిక్స్ చూడండి",

    // Survey Form
    surveyTitle: "సర్వే శీర్షిక",
    surveyDescription: "సర్వే వివరణ",
    questionText: "ప్రశ్న వచనం",
    questionType: "ప్రశ్న రకం",
    required: "అవసరం",
    optional: "ఐచ్ఛికం",
    multipleChoice: "బహుళ ఎంపిక",
    textInput: "టెక్స్ట్ ఇన్‌పుట్",
    rating: "రేటింగ్",
    yesNo: "అవును/కాదు",

    // Responses
    responseCount: "ప్రతిస్పందన సంఖ్య",
    submittedAt: "సమర్పించిన సమయం",
    location: "స్థానం",
    deviceInfo: "పరికర సమాచారం",
    exportResponses: "ప్రతిస్పందనలను ఎగుమతి చేయండి",

    // Risk Monitoring
    riskMonitoring: "రిస్క్ మానిటరింగ్",
    investigate: "దర్యాప్తు చేయండి",
    markResolved: "పరిష్కరించినట్లు గుర్తించండి",
    viewDetails: "వివరాలు చూడండి",
    riskLevel: "రిస్క్ స్థాయి",
    high: "అధిక",
    medium: "మధ్యస్థ",
    low: "తక్కువ",

    // Messages
    success: "విజయం",
    error: "లోపం",
    warning: "హెచ్చరిక",
    info: "సమాచారం",
    confirmDelete: "మీరు నిజంగా ఈ అంశాన్ని తొలగించాలనుకుంటున్నారా?",
    dataLoaded: "డేటా విజయవంతంగా లోడ్ అయింది",
    dataSaved: "డేటా విజయవంతంగా సేవ్ అయింది",

    // Branding
    appName: "టేక్‌సర్వే",
    appDescription: "డేటా సేకరణ మరియు విశ్లేషణ కోసం AI-శక్తితో కూడిన స్మార్ట్ సర్వే టూల్",
    poweredBy: "టేక్‌సర్వే ద్వారా శక్తివంతం",
  },
}

export function getTranslation(language: Language, key: keyof Translations): string {
  return translations[language][key] || translations.en[key] || key
}

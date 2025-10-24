import {
  LayoutDashboard,
  User,
  Activity,
  GraduationCap,
  Brain,
  ShieldAlert,
  Briefcase,
  MessageCircle,
  Bot,
  Heart,
  Sparkles,
  Target,
  TrendingUp,
  ClipboardList,
  BookOpen,
  Trophy,
  PieChart,
  Shield,
  AlertTriangle,
  Users,
  Home,
  Calendar,
  Mail,
  FileText,
  Info,
} from "lucide-react";

/**
 * Modern Student Profile Navigation Structure
 * 8 Ana Sekme + Alt Sekmeler
 * Bilgi tekrarı yok, her veri sadece bir yerde
 */

// 8 ANA SEKME - Basitleştirilmiş ve Organize
export const MAIN_TABS = [
  {
    value: "dashboard",
    label: "📊 Özet",
    icon: LayoutDashboard,
    description: "AI-destekli özet, risk durumu ve hızlı aksiyonlar"
  },
  {
    value: "kimlik",
    label: "👤 Kimlik & İletişim",
    icon: User,
    description: "Temel bilgiler, veli iletişim, adres bilgileri"
  },
  {
    value: "saglik",
    label: "🏥 Sağlık & Güvenlik",
    icon: Activity,
    description: "Sağlık profili, acil durumlar, tıbbi öykü"
  },
  {
    value: "akademik",
    label: "🎓 Akademik",
    icon: GraduationCap,
    description: "Performans, sınavlar, çalışma programı, ilerleme"
  },
  {
    value: "gelisim",
    label: "💡 Gelişim & Kişilik",
    icon: Brain,
    description: "Sosyal-duygusal, çoklu zeka, yetenekler, motivasyon"
  },
  {
    value: "risk",
    label: "⚠️ Risk & Müdahale",
    icon: ShieldAlert,
    description: "Risk analizi, davranış takibi, müdahale planları"
  },
  {
    value: "kariyer",
    label: "💼 Kariyer & Gelecek",
    icon: Briefcase,
    description: "Kariyer analizi, yol haritası, hedefler"
  },
  {
    value: "iletisim",
    label: "💬 İletişim Merkezi",
    icon: MessageCircle,
    description: "Tüm görüşmeler, ev ziyaretleri, iletişim geçmişi"
  },
  {
    value: "ai-hub",
    label: "🤖 AI Araçları",
    icon: Bot,
    description: "AI müdahale önerileri, rapor üretimi, veli iletişimi"
  },
] as const;

// KİMLİK & İLETİŞİM ALT SEKMELERİ (Basitleştirilmiş)
export const KIMLIK_TABS = [
  {
    value: "temel-bilgiler",
    label: "Temel Bilgiler",
    icon: User,
  },
  {
    value: "iletisim",
    label: "İletişim & Adres",
    icon: Mail,
  },
  {
    value: "veli-bilgiler",
    label: "Veli Bilgileri",
    icon: Users,
  },
  {
    value: "ozel-gereksinimler",
    label: "Özel Gereksinimler",
    icon: Info,
  },
] as const;

// SAĞLIK & GÜVENLİK ALT SEKMELERİ
export const SAGLIK_TABS = [
  {
    value: "saglik-profili",
    label: "Sağlık Profili",
    icon: Activity,
  },
  {
    value: "acil-durumlar",
    label: "Acil İletişim",
    icon: AlertTriangle,
  },
  {
    value: "tibbi-okyu",
    label: "Tıbbi Öykü",
    icon: FileText,
  },
] as const;

// AKADEMİK ALT SEKMELERİ
export const AKADEMIK_TABS = [
  {
    value: "performans",
    label: "Akademik Performans",
    icon: TrendingUp,
  },
  {
    value: "sinavlar",
    label: "Sınavlar & Değerlendirme",
    icon: ClipboardList,
  },
  {
    value: "calisma-programi",
    label: "Çalışma Programı",
    icon: BookOpen,
  },
  {
    value: "ilerleme",
    label: "İlerleme & Başarılar",
    icon: Trophy,
  },
  {
    value: "anketler",
    label: "Anketler",
    icon: PieChart,
  },
] as const;

// GELİŞİM & KİŞİLİK ALT SEKMELERİ
export const GELISIM_TABS = [
  {
    value: "sosyal-duygusal",
    label: "Sosyal-Duygusal",
    icon: Heart,
  },
  {
    value: "coklu-zeka",
    label: "Çoklu Zeka",
    icon: Brain,
  },
  {
    value: "yetenekler",
    label: "Yetenekler & İlgiler",
    icon: Sparkles,
  },
  {
    value: "motivasyon",
    label: "Motivasyon",
    icon: Target,
  },
] as const;

// RİSK & MÜDAHALE ALT SEKMELERİ
export const RISK_TABS = [
  {
    value: "risk-analizi",
    label: "Risk Analizi",
    icon: Shield,
  },
  {
    value: "davranis-takibi",
    label: "Davranış Takibi",
    icon: AlertTriangle,
  },
  {
    value: "koruyucu-faktorler",
    label: "Koruyucu Faktörler",
    icon: Heart,
  },
  {
    value: "mudahale-planlari",
    label: "Müdahale Planları",
    icon: Target,
  },
] as const;

// KARİYER & GELECEK ALT SEKMELERİ
export const KARIYER_TABS = [
  {
    value: "kariyer-analizi",
    label: "Kariyer Analizi",
    icon: Briefcase,
  },
  {
    value: "yol-haritasi",
    label: "Yol Haritası",
    icon: TrendingUp,
  },
  {
    value: "hedefler",
    label: "Hedefler & Planlama",
    icon: Target,
  },
] as const;

// İLETİŞİM MERKEZİ ALT SEKMELERİ
export const ILETISIM_TABS = [
  {
    value: "tum-gorusmeler",
    label: "Tüm Görüşmeler",
    icon: MessageCircle,
  },
  {
    value: "ev-ziyaretleri",
    label: "Ev Ziyaretleri",
    icon: Home,
  },
  {
    value: "aile-katilimi",
    label: "Aile Katılımı",
    icon: Users,
  },
  {
    value: "gecmis",
    label: "İletişim Geçmişi",
    icon: Calendar,
  },
] as const;

// AI ARAÇLARI ALT SEKMELERİ
export const AI_TOOLS_TABS = [
  {
    value: "mudahale",
    label: "Müdahale Önerileri",
    icon: Sparkles,
  },
  {
    value: "raporlar",
    label: "Otomatik Raporlar",
    icon: FileText,
  },
  {
    value: "veli-iletisim",
    label: "Veli İletişimi",
    icon: Mail,
  },
  {
    value: "sesli-not",
    label: "Sesli Not",
    icon: Activity,
  },
] as const;

/**
 * Semantic Color System
 * Her sekme için anlamlı renk paleti
 */
export const TAB_COLORS = {
  dashboard: {
    gradient: "from-primary via-purple-500 to-primary",
    bg: "bg-gradient-to-r from-primary/10 to-purple-500/10",
    border: "border-primary/20",
  },
  kimlik: {
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    border: "border-blue-200/50 dark:border-blue-800/50",
  },
  saglik: {
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    border: "border-green-200/50 dark:border-green-800/50",
  },
  akademik: {
    gradient: "from-blue-500 to-indigo-500",
    bg: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    border: "border-blue-200/50 dark:border-blue-800/50",
  },
  gelisim: {
    gradient: "from-pink-500 to-purple-500",
    bg: "bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20",
    border: "border-pink-200/50 dark:border-pink-800/50",
  },
  risk: {
    gradient: "from-red-500 to-orange-500",
    bg: "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20",
    border: "border-red-200/50 dark:border-red-800/50",
  },
  kariyer: {
    gradient: "from-amber-500 to-yellow-500",
    bg: "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
    border: "border-amber-200/50 dark:border-amber-800/50",
  },
  iletisim: {
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
    border: "border-violet-200/50 dark:border-violet-800/50",
  },
  ai: {
    gradient: "from-indigo-500 to-purple-500",
    bg: "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20",
    border: "border-indigo-200/50 dark:border-indigo-800/50",
  },
} as const;

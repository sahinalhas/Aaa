import {
  User,
  GraduationCap,
  Brain,
  MessageCircle,
  Heart,
  Activity,
  BookOpen,
  TrendingUp,
  ShieldAlert,
  Target,
  Users,
  Trophy,
  PieChart,
  Star,
  FileText,
  AlertTriangle,
  ClipboardList,
  BarChart2,
  Briefcase,
  Sparkles,
  Database,
  Shield,
  Mail,
  Bot,
  LayoutDashboard,
  Settings,
  Home,
} from "lucide-react";

// MODERN & BASİTLEŞTİRİLMİŞ ANA SEKMELER (10'dan 5'e indirildi)
export const MAIN_TABS = [
  {
    value: "dashboard",
    label: "📊 Özet",
    icon: LayoutDashboard,
    description: "Öğrenci özeti ve önemli göstergeler"
  },
  {
    value: "akademik",
    label: "🎓 Akademik Profil",
    icon: GraduationCap,
    description: "Performans, sınavlar, çalışma programı ve ilerleme"
  },
  {
    value: "kisisel-sosyal",
    label: "💭 Kişisel & Sosyal",
    icon: Brain,
    description: "Kimlik, sağlık, sosyal-duygusal gelişim ve yetenekler"
  },
  {
    value: "rehberlik-destek",
    label: "🎯 Rehberlik & Destek",
    icon: Target,
    description: "Risk yönetimi, aile iletişimi, mesleki rehberlik ve AI araçları"
  },
  {
    value: "sistem",
    label: "⚙️ Sistem",
    icon: Settings,
    description: "Profil geçmişi ve teknik ayarlar"
  },
] as const;

// KİŞİSEL & SOSYAL PROFİL ALT SEKMELERİ (Kimlik + Sosyal birleştirildi)
export const KISISEL_SOSYAL_TABS_NEW = [
  {
    value: "kimlik-bilgiler",
    label: "Kimlik & Temel Bilgiler",
    icon: User,
  },
  {
    value: "saglik",
    label: "Sağlık Profili",
    icon: Activity,
  },
  {
    value: "sosyal-duygusal",
    label: "Sosyal-Duygusal Gelişim",
    icon: Heart,
  },
  {
    value: "kisilik-yetenek",
    label: "Kişilik & Yetenek",
    icon: Sparkles,
  },
  {
    value: "motivasyon",
    label: "Motivasyon",
    icon: Target,
  },
] as const;

// KİMLİK & TEMEL BİLGİLER ALT SEKMELERİ (ESKİ - Geriye dönük uyumluluk için)
export const KIMLIK_TABS = [
  {
    value: "kisisel",
    label: "Kişisel Bilgiler",
    icon: User,
  },
  {
    value: "saglik",
    label: "Sağlık Profili",
    icon: Activity,
  },
  {
    value: "ozel-durum",
    label: "Özel Durum",
    icon: FileText,
  },
] as const;

// AKADEMİK PROFİL ALT SEKMELERİ (Genişletildi)
export const AKADEMIK_TABS_NEW = [
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

// AKADEMİK PROFİL ALT SEKMELERİ (ESKİ)
export const AKADEMIK_TABS = [
  {
    value: "performans",
    label: "Akademik Performans",
    icon: TrendingUp,
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

// KİŞİSEL & SOSYAL ALT SEKMELERİ
export const KISISEL_SOSYAL_TABS = [
  {
    value: "sosyal-duygusal",
    label: "Sosyal-Duygusal",
    icon: Heart,
  },
  {
    value: "kisilik",
    label: "Kişilik Profili",
    icon: Brain,
  },
  {
    value: "yetenek-ilgi",
    label: "Yetenek & İlgi",
    icon: Sparkles,
  },
  {
    value: "motivasyon",
    label: "Motivasyon",
    icon: Target,
  },
  {
    value: "360-degerlendirme",
    label: "360° Değerlendirme",
    icon: Users,
  },
] as const;

// RİSK & MÜDAHALE ALT SEKMELERİ
export const RISK_MUDAHALE_TABS = [
  {
    value: "risk-degerlendirme",
    label: "Risk Değerlendirme",
    icon: AlertTriangle,
  },
  {
    value: "davranis-takip",
    label: "Davranış Takibi",
    icon: ClipboardList,
  },
  {
    value: "koruyucu-faktorler",
    label: "Koruyucu Faktörler",
    icon: Shield,
  },
  {
    value: "mudahale-plani",
    label: "Müdahale Planı",
    icon: FileText,
  },
] as const;

// AİLE & İLETİŞİM ALT SEKMELERİ
export const AILE_ILETISIM_TABS = [
  {
    value: "gorusmeler",
    label: "Tüm Görüşmeler",
    icon: MessageCircle,
  },
  {
    value: "ev-ziyaretleri",
    label: "Ev Ziyaretleri",
    icon: Home,
  },
  {
    value: "aile-katilim",
    label: "Aile Katılımı",
    icon: Star,
  },
] as const;

// MESLEKİ REHBERLİK ALT SEKMELERİ
export const MESLEKI_TABS = [
  {
    value: "hedefler",
    label: "Hedefler & Motivasyon",
    icon: Target,
  },
  {
    value: "kariyer",
    label: "Kariyer Planı",
    icon: Star,
  },
] as const;

// AI ARAÇLARI ALT SEKMELERİ
export const AI_TOOLS_TABS = [
  {
    value: "ai-asistan",
    label: "AI Asistan",
    icon: Bot,
  },
  {
    value: "risk-analiz",
    label: "Risk Analizi",
    icon: ShieldAlert,
  },
  {
    value: "mudahale-onerileri",
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
    label: "Veli İletişim Asistanı",
    icon: Mail,
  },
  {
    value: "sesli-not",
    label: "Sesli Not & Analiz",
    icon: Activity,
  },
] as const;

// REHBERLİK & DESTEK ALT SEKMELERİ (Risk, Aile, Mesleki, AI birleştirildi)
export const REHBERLIK_DESTEK_TABS = [
  {
    value: "risk-mudahale",
    label: "Risk & Müdahale",
    icon: ShieldAlert,
  },
  {
    value: "aile-iletisim",
    label: "Aile & İletişim",
    icon: Heart,
  },
  {
    value: "mesleki-rehberlik",
    label: "Mesleki Rehberlik",
    icon: Briefcase,
  },
  {
    value: "ai-destegi",
    label: "AI Desteği",
    icon: Bot,
  },
] as const;

// SİSTEM ALT SEKMELERİ (Teknik kullanıcılar için)
export const SISTEM_TABS = [
  {
    value: "profil-gecmisi",
    label: "Profil Geçmişi",
    icon: Database,
  },
  {
    value: "manuel-duzeltme",
    label: "Manuel Düzeltme",
    icon: Settings,
  },
  {
    value: "celiski-cozum",
    label: "Çelişki Çözümü",
    icon: AlertTriangle,
  },
] as const;

// ESKI SEKMELER - GERIYE DÖNÜK UYUMLULUK İÇİN (Yavaşça kaldırılacak)
export const GENEL_TABS = KIMLIK_TABS;
export const EGITSEL_TABS = AKADEMIK_TABS;
export const KISISEL_GELISIM_TABS = KISISEL_SOSYAL_TABS;
export const AILE_TABS = AILE_ILETISIM_TABS;

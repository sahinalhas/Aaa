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

// AKADEMİK PROFİL ALT SEKMELERİ
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

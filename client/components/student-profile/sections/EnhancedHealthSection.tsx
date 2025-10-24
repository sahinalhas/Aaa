/**
 * Enhanced Health Section
 * Sağlık profili + 2 acil kişi + doktor bilgisi
 * NOT: Bu component StandardizedHealthSection'ın wrapper'ıdır
 * Acil iletişim bilgileri BasicInfo'dan buraya taşındı
 */

import StandardizedHealthSection from "./StandardizedHealthSection";

interface EnhancedHealthSectionProps {
  studentId: string;
  onUpdate: () => void;
}

export default function EnhancedHealthSection({
  studentId,
  onUpdate
}: EnhancedHealthSectionProps) {
  return (
    <StandardizedHealthSection
      studentId={studentId}
      onUpdate={onUpdate}
    />
  );
}

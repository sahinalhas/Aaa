import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, GraduationCap, ShieldAlert, Sparkles, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Student } from "@/lib/storage";
import { RiskPill } from "./RiskPill";

interface StudentHeaderProps {
  student: Student;
}

export function StudentHeader({ student }: StudentHeaderProps) {
  const fullName = `${student.ad} ${student.soyad}`;
  const currentYear = new Date().getFullYear();

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-2 border-primary/20 shadow-lg">
      <CardHeader className="pb-4 md:pb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1 space-y-3 md:space-y-4">
            <div>
              <CardTitle className="flex items-center gap-2 md:gap-3 text-2xl md:text-3xl font-bold mb-2">
                <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg">
                  <User className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </div>
                <span className="break-words">{fullName}</span>
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-3">
                <Badge variant="secondary" className="text-xs md:text-sm font-medium py-1 px-2 md:px-3">
                  <GraduationCap className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-1.5" />
                  {student.class}
                </Badge>
                <Badge variant="outline" className="text-xs md:text-sm font-medium py-1 px-2 md:px-3">
                  {student.cinsiyet}
                </Badge>
                <Badge variant="outline" className="text-xs md:text-sm font-medium py-1 px-2 md:px-3">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-1.5" />
                  {currentYear - new Date(student.dogumTarihi).getFullYear()} yaşında
                </Badge>
                <div className="inline-flex items-center gap-1.5 md:gap-2">
                  <ShieldAlert className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <span className="text-xs md:text-sm text-muted-foreground">Risk:</span>
                  <RiskPill risk={student.risk} />
                </div>
              </div>
            </div>
          </div>
          <Button asChild size="lg" className="gap-2 shadow-md hover:shadow-lg transition-all w-full lg:w-auto">
            <Link to={`/ogrenci/${student.id}/gelismis-analiz`}>
              <Sparkles className="h-4 w-4" />
              Gelişmiş Analiz
            </Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

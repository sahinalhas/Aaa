import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, GraduationCap, ShieldAlert, Sparkles, Calendar, Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Student } from "@/lib/storage";
import { RiskPill } from "./RiskPill";

interface StudentHeaderProps {
  student: Student;
}

export function StudentHeader({ student }: StudentHeaderProps) {
  const fullName = `${student.ad} ${student.soyad}`;
  const currentYear = new Date().getFullYear();
  const birthYear = new Date(student.dogumTarihi).getFullYear();
  const age = currentYear - birthYear;
  
  const initials = `${student.ad.charAt(0)}${student.soyad.charAt(0)}`.toUpperCase();
  
  const getGenderColor = (gender: string) => {
    if (gender === "Kız") return "from-pink-500 to-purple-500";
    if (gender === "Erkek") return "from-blue-500 to-cyan-500";
    return "from-gray-500 to-slate-500";
  };

  return (
    <>
      {/* Back Button */}
      <Button 
        asChild 
        variant="ghost" 
        className="mb-3 hover:bg-primary/10 transition-colors"
      >
        <Link to="/ogrenci" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Öğrenci Listesine Dön
        </Link>
      </Button>

      {/* Hero Section with Glassmorphism */}
      <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -z-10 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl -z-10 opacity-20"></div>
        
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center lg:items-start gap-3">
              <Avatar className={`h-28 w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 border-4 border-white shadow-2xl bg-gradient-to-br ${getGenderColor(student.cinsiyet)}`}>
                <AvatarFallback className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-primary/10">
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Risk:</span>
                <RiskPill risk={student.risk} />
              </div>
            </div>

            {/* Student Info Section */}
            <div className="flex-1 space-y-4">
              {/* Name and Primary Info */}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {fullName}
                </h1>
                
                {/* Quick Info Badges */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Badge 
                    variant="secondary" 
                    className="text-sm md:text-base font-semibold py-1.5 px-3 md:px-4 shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
                  >
                    <GraduationCap className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
                    {student.class}
                  </Badge>
                  
                  <Badge 
                    variant="outline" 
                    className="text-sm md:text-base font-medium py-1.5 px-3 md:px-4 shadow-sm hover:shadow-md transition-all"
                  >
                    {student.cinsiyet}
                  </Badge>
                  
                  <Badge 
                    variant="outline" 
                    className="text-sm md:text-base font-medium py-1.5 px-3 md:px-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
                    {age} yaşında
                  </Badge>

                  {student.okulNo && (
                    <Badge 
                      variant="outline" 
                      className="text-sm md:text-base font-medium py-1.5 px-3 md:px-4 shadow-sm hover:shadow-md transition-all"
                    >
                      <User className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
                      No: {student.okulNo}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Contact Information (if available) */}
              {(student.eposta || student.telefon || student.adres) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 pt-2">
                  {student.eposta && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="truncate">{student.eposta}</span>
                    </div>
                  )}
                  {student.telefon && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/10">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{student.telefon}</span>
                    </div>
                  )}
                  {student.adres && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/10 md:col-span-2 lg:col-span-1">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="truncate">{student.adres}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex lg:flex-col gap-3 lg:justify-start">
              <Button 
                asChild 
                size="lg" 
                className="flex-1 lg:flex-none gap-2 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Link to={`/ogrenci/${student.id}/gelismis-analiz`}>
                  <Sparkles className="h-5 w-5" />
                  Gelişmiş Analiz
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  );
}

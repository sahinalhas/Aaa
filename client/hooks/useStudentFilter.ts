import { useMemo } from 'react';

interface Student {
  id: string;
  name?: string;
  ad?: string;
  soyad?: string;
}

export function useStudentFilter(students: Student[], searchQuery: string) {
  return useMemo(() => {
    if (!searchQuery) return students;
    
    const query = searchQuery.toLowerCase();
    
    return students.filter((student) => {
      const name = student.name?.toLowerCase() || '';
      const fullName = `${student.ad || ''} ${student.soyad || ''}`.toLowerCase();
      const id = student.id.toLowerCase();
      
      return (
        name.includes(query) ||
        fullName.includes(query) ||
        id.includes(query)
      );
    });
  }, [students, searchQuery]);
}

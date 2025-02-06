export interface Course {
  courseId: string;
  courseName: string;
  courseCategory: string;
  courseDurationInMonths: number;
  instructor: string | null; 
  startDate: string;
  endDate: string;
  id: string;
  openForEnrollment:true|false; 
  assessmentDate:string;
  status: string;
  noOfEnrollments: number;  
  seatsLeft: number; 
  enableAssessment:true|false;       
}

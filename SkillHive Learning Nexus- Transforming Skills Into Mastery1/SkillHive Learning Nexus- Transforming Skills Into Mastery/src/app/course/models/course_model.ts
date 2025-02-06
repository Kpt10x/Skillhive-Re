export interface Course {
  id: string; // The unique identifier for the course
  courseName: string;
  courseCategory: string;
  description: string; 
  courseDurationMonths: number;
  instructor: string;
  startDate: string | Date;
  endDate: string | Date;
  assessmentDate: string | Date;
  status: string;
  noOfEnrollments: number;  // Ensure this is a number
  seatsLeft: number;        // Ensure this is a number
  contentUploaded: boolean ; // Default to false, content hasn't been uploaded yet
  openForEnrollment: boolean ; // Default to false, enrollment closed until content is uploaded
  // totalSeats?: number; // Optional: Total seats available for the course
  // enrolledCandidates?: string[]; // Optional: List of candidate IDs enrolled in the course
}

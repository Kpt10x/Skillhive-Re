import { Instructor } from './../../instructor/models/instructor.model';
export interface Course {
  id: string; // The unique identifier for the course
  courseId: string;
  courseName: string;
  courseCategory: string;
  description: string;
  courseDurationMonths: number;
  instructor: string;
  instructorId: string;
  startDate: string | Date;
  endDate: string | Date;
  assessmentDate: string | Date;
  status: string;
  noOfEnrollments: number; // Ensure this is a number
  seatsLeft: number; // Ensure this is a number
  contentUploaded: boolean; // Default to false, content hasn't been uploaded yet
  openForEnrollment: boolean; // Default to false, enrollment closed until content is uploaded
  enableAssessment: boolean; // Default to false, assessment not enabled yet

  totalSeats?: number; // Optional: Total seats available for the course
  enrolledCandidates?: string[]; // Optional: List of candidate IDs enrolled in the course

}

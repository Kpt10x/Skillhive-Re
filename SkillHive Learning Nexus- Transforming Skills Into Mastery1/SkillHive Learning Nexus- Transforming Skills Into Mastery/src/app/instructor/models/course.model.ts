export interface Course {
  courseId: string;
  courseName: string;
  courseCategory: string;
  courseDurationInMonths: number;
  instructorId: string | null; // Updated to allow null values
  startDate: string;
  endDate: string;
  id: string;
}

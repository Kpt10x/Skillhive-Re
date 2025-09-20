// candidate.model.ts

export interface Candidate {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  enrolledCourses: any[];  // Add enrolledCourses as an array of course objects
}

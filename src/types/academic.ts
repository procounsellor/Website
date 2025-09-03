export interface ExamApiResponse {
  examId: string;
  examName: string;
  examLevel: string;
  examType: string;
  iconUrl: string;
  bannerUrl: string;
  popularityCount: number;
}

export interface Exam {
  id: string;
  name: string;
  level: string;
  type: string;
  iconUrl: string;
  bannerUrl: string;
  popularity: number;
}

export interface CourseApiResponse {
  courseId: string;
  courseName: string;
  courseType: string;
  streamLevel: string;
  coursePhotoUrl: string;
  duration: string;
  popularityCount: number;
  courseIconUrl: string;
}

export interface Course {
  id: string;
  name: string;
  type: string;
  level: string;
  photoUrl: string;
  duration: string;
  popularity: number;
  iconUrl: string;
}

export interface CollegeApiResponse {
  collegeId: string;
  collegeName: string;
  collegesLocationCity: string;
  collegesLocationState: string;
  logoUrl: string;
  establishedYear: string;
  accreditation: string;
  coursesOffered: CourseOffered[];
  collegeType: string;
  popularityCount: number;
}

export interface CourseOffered {
  courseType: string;
  nirfRank: string;
  eligibility: string;
  rankingBodies: string;
  branches: Branch[];
  generalFees: string;
  globalRecruiters: string;
  duration: string;
  examsAccepted: ExamAccepted[];
  courseName: string;
  courseLevel: string;
  placementCellContact: string;
  approvals: string;
  highestSalary: string;
  averageSalary: string;
  courseId: string;
}

export interface Branch {
  seat: string;
  branchId: string;
  topRecruiters: string;
  headOfDepartment: string;
  facultyCount: string;
  labsAvailable: string;
  highestSalary: string;
  branchName: string;
  averageSalary: string;
}

export interface ExamAccepted {
  examName: string;
  fee: string;
  examId: string;
}

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  logoUrl: string;
  establishedYear: string;
  accreditation: string;
  type: string;
  popularity: number;
  coursesOffered: CourseOffered[];
}

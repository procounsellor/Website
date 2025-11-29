import { API_CONFIG } from './config';

export type CourseData = {
  counsellorId: string;
  courseName: string;
  description: string;
  category: string;
  courseTimeHours: number;
  courseTimeMinutes: number;
  courseDurationType: string;
  coursePrice: number;
  discount: number;
  coursePriceAfterDiscount: number;
};

export type UploadCourseResponse = {
  message: string;
  status: boolean;
  courseId: string;
};

export async function uploadCourseData(
  courseData: CourseData,
  thumbnail: File
): Promise<UploadCourseResponse> {
  const formData = new FormData();
  formData.append('counsellorId', courseData.counsellorId);
  formData.append('courseData', JSON.stringify(courseData));
  formData.append('thumbnail', thumbnail);
  const token = localStorage.getItem('jwt')

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorCourses/uploadCourseData`,
    {
      method: 'POST',
      headers:{
        'Authorization':`Bearer ${token}`,
        Accept:'application/json'
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload course data');
  }

  return response.json();
}

export type AddFolderRequest = {
  counsellorId: string;
  courseId: string;
  name: string;
  parentPath: string;
};

export type AddFolderResponse = {
  message: string;
  status: boolean;
};

export async function addFolder(
  data: AddFolderRequest
): Promise<AddFolderResponse> {
  const token = localStorage.getItem('jwt');

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorCourses/addFolder`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create folder');
  }

  return response.json();
}

export type AddFileResponse = {
  message: string;
  status: boolean;
};

export async function addFile(
  counsellorId: string,
  courseId: string,
  parentPath: string,
  file: File
): Promise<AddFileResponse> {
  const formData = new FormData();
  formData.append('counsellorId', counsellorId);
  formData.append('courseId', courseId);
  formData.append('parentPath', parentPath);
  formData.append('file', file);

  const token = localStorage.getItem('jwt');

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorCourses/addFile`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
}

export type PublishCourseRequest = {
  counsellorId: string;
  courseId: string;
};

export type PublishCourseResponse = {
  message: string;
  status: boolean;
};

export async function publishCourse(
  data: PublishCourseRequest
): Promise<string> {
  const token = localStorage.getItem('jwt');

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorCourses/publishCourse`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to publish course');
  }

  return response.text();
}

export type CounsellorCourse = {
  courseId: string;
  courseName: string;
  courseThumbnailUrl: string;
  category: string;
  rating: number | null;
  coursePrice: number;
  discount: number;
  coursePriceAfterDiscount: number;
};

export type GetCoursesResponse = {
  data: CounsellorCourse[];
  message: string;
};

export async function getCoursesForCounsellorByCounsellorId(
  counsellorId: string
): Promise<GetCoursesResponse> {
  const token = localStorage.getItem('jwt');

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorCourses/getCoursesForCounsellorByCounsellorId?counsellorId=${counsellorId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }

  return response.json();
}

export async function getCoursesForUserByCounsellorId(
  userId: string,
  counsellorId: string
): Promise<GetCoursesResponse> {
  const token = localStorage.getItem('jwt');

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorCourses/getCoursesForUserByCounsellorId?userId=${userId}&counsellorId=${counsellorId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }

  return response.json();
}

export type CourseContent = {
  courseContentId: string;
  type: 'folder' | 'image' | 'video' | 'doc';
  name: string;
  path: string;
  parentPath: string;
  documentUrl: string | null;
  fileSize: number | null;
  uploadedAt: string;
};

export type CourseDetails = {
  courseId: string;
  courseName: string;
  description: string;
  courseThumbnailUrl: string;
  category: string;
  courseTimeHours: number;
  courseTimeMinutes: number;
  courseDurationType: string;
  coursePrice: number;
  discount: number;
  coursePriceAfterDiscount: number;
  soldCount: number;
  courseContents: CourseContent[];
  rating: number | null;
  counsellorCourseReviewResponse: any[];
  createdAt: {
    seconds: number;
    nanos: number;
  };
  updatedAt: {
    seconds: number;
    nanos: number;
  };
  isPublished: boolean;
  counsellorId?: string;
  bookmarkedByMe?: boolean;
  purchasedByMe?: boolean;
  userWalletAmount?: number;
};

export async function getCounsellorCourseByCourseId(
  counsellorId: string,
  courseId: string
): Promise<CourseDetails> {
  const token = localStorage.getItem('jwt');
  const url = `${API_CONFIG.baseUrl}/api/counsellorCourses/getCounsellorCourseByCourseId?counsellorId=${counsellorId}&courseId=${courseId}`;
  
  console.log('API Call (Counselor):', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(`Failed to fetch course details: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function getCounsellorCourseForUserByCourseId(
  userId: string,
  courseId: string
): Promise<CourseDetails> {
  const token = localStorage.getItem('jwt');
  const url = `${API_CONFIG.baseUrl}/api/counsellorCourses/getCounsellorCourseForUserByCourseId?userId=${userId}&courseId=${courseId}`;
  
  console.log('API Call:', url);
  console.log('Token:', token ? 'Present' : 'Missing');

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(`Failed to fetch course details: ${response.status} ${errorText}`);
  }

  const responseData = await response.json();
  console.log('API Response Data:', responseData);
  console.log('Counsellor ID in response:', responseData.data?.counsellorId);
  return responseData.data;
}

export type BookmarkCourseRequest = {
  userId: string;
  courseId: string;
};

export type BookmarkCourseResponse = {
  message: string;
  status: boolean;
};

export async function bookmarkCourse(
  data: BookmarkCourseRequest
): Promise<BookmarkCourseResponse> {
  const token = localStorage.getItem('jwt');

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorCourses/bookmarkCourse`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to bookmark course');
  }

  return response.json();
}

export async function getBoughtCourses(
  userId: string
): Promise<GetCoursesResponse> {
  const token = localStorage.getItem('jwt');

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorCourses/getBoughtCourses?userId=${userId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch purchased courses');
  }

  return response.json();
}

export async function getBookmarkedCourses(
  userId: string
): Promise<GetCoursesResponse> {
  const token = localStorage.getItem('jwt');

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorCourses/getBookmarkedCourses?userId=${userId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch bookmarked courses');
  }

  return response.json();
}

export type BuyCourseRequest = {
  userId: string;
  courseId: string;
  counsellorId: string;
  price: number;
};

export type BuyCourseResponse = {
  message: string;
  status: boolean;
};

export async function buyCourse(
  data: BuyCourseRequest
): Promise<BuyCourseResponse> {
  const token = localStorage.getItem('jwt');
  // data.counsellorId = '0000000091'

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorCourses/buyCourse`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to purchase course');
  }

  return response.json();
}

export type AddCourseReviewRequest = {
  userId: string;
  courseId: string;
  rating: number;
  reviewText: string;
};

export type AddCourseReviewResponse = {
  message: string;
  status: boolean;
};

export async function addCourseReview(
  data: AddCourseReviewRequest
): Promise<AddCourseReviewResponse> {
  const token = localStorage.getItem('jwt');

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorCourses/addReview`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit review');
  }

  return response.json();
}

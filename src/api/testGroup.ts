import { API_CONFIG } from "./config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

export const createTestGroup = async (
  counsellorId: string,
  testGroupData: {
    testGroupName: string;
    testGroupDescription: string;
    testType: string;
    courseIdAttached: string | null;
    priceType: string;
    price: number;
  },
  bannerImage: File | null
) => {
  const formData = new FormData();
  formData.append("request", JSON.stringify({
    counsellorId,
    ...testGroupData,
  }));
  if (bannerImage) {
    formData.append("bannerImage", bannerImage);
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/createTestGroup`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    }
  );
  return response.json();
};

export const getAllTestGroups = async (counsellorId: string) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/getAllTestGroupsOfACounsellor?counsellorId=${counsellorId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};

export const getTestGroupById = async (
  counsellorId: string,
  testGroupId: string
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/getTestGroupByIdForCounsellor?counsellorId=${counsellorId}&testGroupId=${testGroupId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};

export const getAllTestSeriesOfTestGroupForCounselor = async (
  counsellorId: string,
  testGroupId: string
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/getAllTestSeriesOfATestGroup?counsellorId=${counsellorId}&testGroupId=${testGroupId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};

export const getAllTestSeriesOfTestGroupForUser = async (userId: string, testGroupId: string) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/userTestSeries/getAllTestSeriesOfATestGroup?userId=${userId}&testGroupId=${testGroupId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};

export const deleteTestGroup = async (
  counsellorId: string,
  testGroupId: string
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/deleteTestGroup`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        counsellorId,
        testGroupId,
      }),
    }
  );
  return response.json();
};

export const publishUnpublishTestGroup = async (
  counsellorId: string,
  testGroupId: string,
  published: boolean
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/publishUnpublishTestGroup`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        counsellorId,
        testGroupId,
        published,
      }),
    }
  );
  return response.json();
};

export const updateTestGroup = async (
  counsellorId: string,
  testGroupId: string,
  testGroupData: {
    testGroupName: string;
    testGroupDescription: string;
    testType: string;
    courseIdAttached: string | null;
    priceType: string;
    price: number;
  },
  bannerImage: File | null
) => {
  const formData = new FormData();
  formData.append("request", JSON.stringify({
    counsellorId,
    testGroupId,
    ...testGroupData,
  }));
  if (bannerImage) {
    formData.append("bannerImage", bannerImage);
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/updateTestGroup`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    }
  );
  return response.json();
};

// Test Series APIs (for managing test series within test groups)
export const deleteTestSeries = async (
  counsellorId: string,
  testSeriesId: string
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/testSeries/deleteTestSeries?counsellorId=${counsellorId}&testSeriesId=${testSeriesId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: new FormData(),
    }
  );
  return response.json();
};

export const removeSectionsFromTestSeries = async (
  counsellorId: string,
  testSeriesId: string,
  removedSectionNames: string[]
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/testSeries/removeSection`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        counsellorId,
        testSeriesId,
        removedSectionName: removedSectionNames,
      }),
    }
  );
  return response.json();
};


export const publishTestSeries = async (
  counsellorId: string,
  testSeriesId: string,
  published: boolean
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/testSeries/publishUnpublishTestSeries`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        counsellorId,
        testSeriesId,
        published,
      }),
    }
  );
  return response.json();
};

// User-side APIs
export const getAllTestGroupsForUser = async (userId: string, counsellorId: string) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/userTestSeries/getAllTestGroupsOfACounsellor?userId=${userId}&counsellorId=${counsellorId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};

export const buyTestGroup = async (
  userId: string,
  counsellorId: string,
  testGroupId: string,
  price: number,
  couponCode: string | null = null
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/buyTestGroup`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        counsellorId,
        testGroupId,
        price,
        couponCode,
      }),
    }
  );
  return response.json();
};

export const bookmarkTestGroup = async (userId: string, testGroupId: string) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/bookmarkTestGroup`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        testGroupId,
      }),
    }
  );
  return response.json();
};

// User-side APIs
export const getAllTestGroupsOfCounsellorForUser = async (userId: string, counsellorId: string) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/userTestSeries/getAllTestGroupsOfACounsellor?userId=${userId}&counsellorId=${counsellorId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};

export const getTestGroupByIdForUser = async (userId: string, testGroupId: string) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/getTestGroupByIdForUser?userId=${userId}&testGroupId=${testGroupId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};

export const addReviewToTestGroup = async (
  userId: string,
  testGroupId: string,
  rating: number,
  reviewText: string
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/addReviewToTestGroup`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        testGroupId,
        rating,
        reviewText,
      }),
    }
  );
  return response.json();
};

export const updateReviewToTestGroup = async (
  userId: string,
  reviewId: string,
  testGroupId: string,
  rating: number,
  reviewText: string
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/updateReviewToTestGroup`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        reviewId,
        testGroupId,
        rating,
        reviewText,
      }),
    }
  );
  return response.json();
};

export const deleteReviewFromTestGroup = async (
  userId: string,
  reviewId: string,
  testGroupId: string
) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/deleteTestGroupReview`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        reviewId,
        testGroupId,
      }),
    }
  );
  return response.json();
};

export const getUserBoughtTestGroups = async (userId: string) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/getUserBoughtTestGroups?userId=${userId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};

export const getUserBookmarkedTestGroups = async (userId: string) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/counsellorTestGroup/getUserBookmarkedTestGroups?userId=${userId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};

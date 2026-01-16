import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createTestGroup, updateTestGroup, getTestGroupById } from "@/api/testGroup";
import { getCoursesForCounsellorByCounsellorId } from "@/api/course";
import { Input } from "@/components/create-test/components/Input";
import { Textarea } from "@/components/create-test/components/Textarea";
import { Dropdown } from "@/components/create-test/components/Dropdown";
import { Radio } from "@/components/create-test/components/InputRadio";
import UploadBox from "@/components/create-test/components/UploadBox";
import { ImageCropper } from "@/components/common/ImageCropper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateEditTestGroup() {
  const navigate = useNavigate();
  const { testGroupId } = useParams();
  const isEditMode = !!testGroupId;
  const counsellorId = localStorage.getItem("phone") || "";

  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    testGroupName: "",
    testGroupDescription: "",
    testType: "STANDALONE",
    courseIdAttached: "",
    priceType: "FREE",
    price: 0,
  });
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (isEditMode && testGroupId) {
      fetchTestGroupData();
    }
  }, [testGroupId]);

  useEffect(() => {
    if (formData.testType === "COURSE_ATTACHED") {
      setLoadingCourses(true);
      getCoursesForCounsellorByCounsellorId(counsellorId)
        .then((response) => {
          if (response?.data) {
            setCourses(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch courses:", error);
          setCourses([]);
        })
        .finally(() => {
          setLoadingCourses(false);
        });
    }
  }, [formData.testType, counsellorId]);

  const fetchTestGroupData = async () => {
    try {
      setLoading(true);
      const response = await getTestGroupById(counsellorId, testGroupId!);
      if (response.status && response.data.testGroup) {
        const group = response.data.testGroup;
        setFormData({
          testGroupName: group.testGroupName,
          testGroupDescription: group.testGroupDescription || "",
          testType: group.testType,
          courseIdAttached: group.courseIdAttached || "",
          priceType: group.priceType,
          price: group.price,
        });
        if (group.bannerImagUrl) {
          setBannerPreview(group.bannerImagUrl);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch test group data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {

    if (!formData.testGroupName.trim()) {
      toast.error("Please enter test group name");
      return;
    }

    if (!isEditMode && !bannerImage) {
      toast.error("Please upload a banner image");
      return;
    }

    if (formData.testType === "COURSE_ATTACHED" && !formData.courseIdAttached) {
      toast.error("Please select a course");
      return;
    }

    if (formData.priceType === "PAID" && formData.price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setLoading(true);
      const testGroupData = {
        testGroupName: formData.testGroupName,
        testGroupDescription: formData.testGroupDescription,
        testType: formData.testType,
        courseIdAttached: formData.testType === "COURSE_ATTACHED" ? formData.courseIdAttached : null,
        priceType: formData.priceType,
        price: formData.priceType === "FREE" ? 0 : formData.price,
      };

      const response = isEditMode
        ? await updateTestGroup(counsellorId, testGroupId!, testGroupData, bannerImage)
        : await createTestGroup(counsellorId, testGroupData, bannerImage);

      if (response.status) {
        toast.success(isEditMode ? "Test group updated successfully" : "Test group created successfully");
        navigate("/counsellor-dashboard", { state: { activeTab: "courses" } });
      } else {
        toast.error("Failed to save test group");
      }
    } catch (error) {
      toast.error("Failed to save test group");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-8 w-full mx-auto max-w-7xl min-h-screen flex flex-col gap-4">
      {/* Top header */}
      <div className="p-5 bg-[#f8faf9] max-w-[1200px] text-(--text-app-primary) font-semibold text-[1.5rem] rounded-2xl">
        {isEditMode ? "Edit Test Group" : "Create Test Group"}
      </div>

      <Dropdown label="Test Group Details" defaultOpen={true}>
        <div className="flex flex-col gap-4">
          <Input
            label="Test Group Name *"
            placeholder="e.g., JEE Main Mock Test Series"
            value={formData.testGroupName}
            onChange={(value) => setFormData({ ...formData, testGroupName: value })}
          />
          <Textarea
            label="Description"
            placeholder="Describe what this test group contains..."
            value={formData.testGroupDescription}
            onChange={(value) => setFormData({ ...formData, testGroupDescription: value })}
          />
          <UploadBox 
            file={bannerImage} 
            setFile={setBannerImage} 
            existingImageUrl={bannerPreview}
            onImageSelect={(imageUrl) => {
              setImageToCrop(imageUrl);
              setShowCropper(true);
            }}
          />
        </div>
      </Dropdown>

      <Dropdown label="Test Type & Pricing" defaultOpen={true}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-col">
            <label htmlFor="testType" className="text-[1rem] font-normal cursor-pointer">
              Test Type *
            </label>
            <Select
              value={formData.testType}
              onValueChange={(value) => setFormData({ ...formData, testType: value })}
            >
              <SelectTrigger className="border-[1.5px] border-[#D6D6D6] h-[52px] text-[1rem] font-normal cursor-pointer">
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STANDALONE" className="cursor-pointer">Standalone</SelectItem>
                <SelectItem value="COURSE_ATTACHED" className="cursor-pointer">Course Attached</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.testType === "COURSE_ATTACHED" && (
            <div className="flex gap-2 flex-col">
              <label htmlFor="course" className="text-[1rem] font-normal cursor-pointer">
                Select Course *
              </label>
              {loadingCourses ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-(--btn-primary)" />
                </div>
              ) : (
                <Select
                  value={formData.courseIdAttached}
                  onValueChange={(value) => setFormData({ ...formData, courseIdAttached: value })}
                >
                  <SelectTrigger className="border-[1.5px] border-[#D6D6D6] h-[52px] text-[1rem] font-normal cursor-pointer">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <SelectItem key={course.courseId} value={course.courseId} className="cursor-pointer">
                          {course.courseName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-courses" disabled className="cursor-not-allowed">
                        No courses available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          <div className="flex gap-2 flex-col">
            <label className="text-[1rem] font-normal cursor-pointer">Price Type *</label>
            <div className="flex gap-6">
              <Radio
                label="Free"
                name="priceType"
                value="FREE"
                checked={formData.priceType === "FREE"}
                onChange={(value) => setFormData({ ...formData, priceType: value, price: 0 })}
              />
              <Radio
                label="Paid"
                name="priceType"
                value="PAID"
                checked={formData.priceType === "PAID"}
                onChange={(value) => setFormData({ ...formData, priceType: value })}
              />
            </div>
          </div>

          {formData.priceType === "PAID" && (
            <div className="flex flex-col gap-2">
              <label htmlFor="price" className="text-[1rem] font-normal">
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="Enter price"
                className="border border-[#13097D66] py-3 px-4 rounded-[12px] w-full placeholder:text-(--text-muted) placeholder:font-medium cursor-pointer"
                min="0"
                step="0.01"
              />
            </div>
          )}
        </div>
      </Dropdown>

      {/* Submit Buttons */}
      <div className="flex gap-4 max-w-[1200px]">
        <button
          type="button"
          onClick={() => navigate("/counsellor-dashboard", { state: { activeTab: "courses" } })}
          disabled={loading}
          className="flex-1 py-3 px-6 border-2 border-gray-300 text-(--text-app-primary) rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-3 px-6 bg-(--btn-primary) text-white rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? "Saving..." : isEditMode ? "Update Test Group" : "Create Test Group"}
        </button>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          aspectRatio={1}
          onCropComplete={(croppedImage) => {
            setBannerImage(croppedImage);
            setBannerPreview(URL.createObjectURL(croppedImage));
            setShowCropper(false);
            setImageToCrop(null);
          }}
          onCancel={() => {
            // Clear the temporary image selection
            setShowCropper(false);
            setImageToCrop(null);
            // Don't set banner image or preview on cancel
          }}
        />
      )}
    </div>
  );
}

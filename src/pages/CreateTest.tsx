import { Checkbox } from "@/components/create-test/components/Checkbox";
import { Dropdown } from "@/components/create-test/components/Dropdown";
import { Input } from "@/components/create-test/components/Input";
import { Radio } from "@/components/create-test/components/InputRadio";
import { Textarea } from "@/components/create-test/components/Textarea";
import UploadBox from "@/components/create-test/components/UploadBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { getCoursesForCounsellorByCounsellorId } from "@/api/course";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EventFormData {
  name: string;
  description: string;
  stream: string;
  course: string;
  duration: string;
  correctPoints: string;
  wrongPoints: string;
  paidAmount: string;
  instructions: string;
}

interface Section {
  sectionName: string;
  totalQuestionsSupposedToBeAdded: number;
  sectionDurationInMinutes: number;
}

interface SectionInput {
  sectionName: string;
  totalQuestions: string;
  sectionDuration: string;
}

const STREAMS = [
  { value: "ENGINEERING", label: "Engineering" },
  { value: "MEDICAL", label: "Medical" },
  { value: "COMMERCE", label: "Commerce" },
];

export function CreateTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, isAuthenticated } = useAuthStore();
  
  const editMode = location.state?.editMode || false;
  const existingTestData = location.state?.testData || null;
  
  // Check if user is authenticated and is a counselor
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    if (role !== "counselor") {
      navigate("/");
      return;
    }
  }, [isAuthenticated, role, navigate]);

  const [file, setFile] = useState<File | null>(null);
  const [existingBannerUrl, setExistingBannerUrl] = useState<string | null>(null);
  const [type, setType] = useState<"course" | "standalone" | null>(null);
  const [cost, setCost] = useState<"free" | "paid">("free");
  const [enableNegativeMarking, setEnableNegativeMarking] =
    useState<boolean>(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testSeriesId, setTestSeriesId] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionInput>({
    sectionName: "",
    totalQuestions: "",
    sectionDuration: "",
  });
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    stream: "",
    course: "",
    duration: "",
    correctPoints: "",
    wrongPoints: "",
    paidAmount: "",
    instructions: "",
  });

  // Prefill data in edit mode
  useEffect(() => {
    if (editMode && existingTestData) {
      setTestSeriesId(existingTestData.testSeriesId);
      setFormData({
        name: existingTestData.testName || "",
        description: existingTestData.testDescription || "",
        stream: existingTestData.stream || "",
        course: existingTestData.courseIdAttached || "",
        duration: existingTestData.durationInMinutes?.toString() || "",
        correctPoints: existingTestData.pointsForCorrectAnswer?.toString() || "",
        wrongPoints: existingTestData.negativeMarks?.toString() || "",
        paidAmount: existingTestData.price?.toString() || "",
        instructions: existingTestData.testInstructuctions || "",
      });
      setType(existingTestData.testType === "COURSE" ? "course" : "standalone");
      setCost(existingTestData.priceType?.toLowerCase() === "paid" ? "paid" : "free");
      setEnableNegativeMarking(existingTestData.negativeMarkingEnabled || false);
      setSections(existingTestData.listOfSection || []);
      if (existingTestData.bannerImagUrl) {
        setExistingBannerUrl(existingTestData.bannerImagUrl);
      }
    }
  }, [editMode, existingTestData]);

  const handleInputChange = (
    field: keyof EventFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fetch courses when type is set to 'course'
  useEffect(() => {
    if (type === "course" && user?.phoneNumber) {
      setLoadingCourses(true);
      getCoursesForCounsellorByCounsellorId(user.phoneNumber)
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
    } else {
      setCourses([]);
    }
  }, [type, user?.phoneNumber]);

  const handleSectionInputChange = (
    field: keyof SectionInput,
    value: string
  ) => {
    setCurrentSection((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSection = () => {
    if (currentSection.sectionName && currentSection.totalQuestions && currentSection.sectionDuration) {
      const newSection: Section = {
        sectionName: currentSection.sectionName,
        totalQuestionsSupposedToBeAdded: parseInt(currentSection.totalQuestions),
        sectionDurationInMinutes: parseInt(currentSection.sectionDuration),
      };
      setSections([...sections, newSection]);
      setCurrentSection({
        sectionName: "",
        totalQuestions: "",
        sectionDuration: "",
      });
    }
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    // Get counsellorId from authenticated user
    if (!user?.phoneNumber) {
      console.error("No counselor ID found");
      toast.error("Unable to identify counselor. Please login again.");
      return;
    }

    setIsSubmitting(true);
    const counsellorId = user.phoneNumber;

    const requestData: any = {
      counsellorId,
      testName: formData.name,
      testDescription: formData.description,
      stream: formData.stream,
      testType: type === "standalone" ? "STANDALONE" : "COURSE",
      courseIdAttached: type === "course" ? formData.course : null,
      priceType: cost.toUpperCase(),
      price: cost === "paid" ? parseFloat(formData.paidAmount) : 0,
      durationInMinutes: parseInt(formData.duration),
      pointsForCorrectAnswer: parseInt(formData.correctPoints),
      negativeMarkingEnabled: enableNegativeMarking,
      negativeMarks: enableNegativeMarking ? parseFloat(formData.wrongPoints) : 0,
      testInstructuctions: formData.instructions,
      sections: sections,
    };

    // Add testSeriesId for update
    if (editMode && testSeriesId) {
      requestData.testSeriesId = testSeriesId;
    }

    const myHeaders = new Headers();
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("No authentication token found");
      toast.error("Authentication required. Please login again.");
      setIsSubmitting(false);
      return;
    }
    
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Accept", "application/json");

    const formdata = new FormData();
    formdata.append("request", JSON.stringify(requestData));
    if (file) {
      formdata.append("bannerImage", file);
    }

    const apiUrl = editMode
      ? "https://procounsellor-backend-1000407154647.asia-south1.run.app/api/testSeries/updateTestSeries"
      : "https://procounsellor-backend-1000407154647.asia-south1.run.app/api/testSeries/createTestSeries";

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const result = await response.json();
      console.log(result);
      
      if (result.status && result.data?.testSeriesId) {
        toast.success(editMode ? "Test series updated successfully!" : "Test series created successfully!");
        // Navigate to AddQuestion page with testSeriesId and pass test data
        navigate(`/add-question/${result.data.testSeriesId}`, {
          state: { testData: result.data }
        });
      } else {
        toast.error(result.message || (editMode ? "Failed to update test series" : "Failed to create test series"));
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };
  return (
    <div className="pt-28 pb-8 w-full mx-auto max-w-7xl  min-h-screen flex flex-col gap-4">
      {/* top header title here */}
      <div className="p-5 bg-[#f8faf9] max-w-[1200px] text-(--text-app-primary) font-semibold text-[1.5rem] rounded-2xl">
        Create New Test
      </div>

      <Dropdown label="Test Name">
        <div className="flex flex-col gap-4">
          <Input 
            label="Test Name *" 
            placeholder="eg . Physics test" 
            value={formData.name}
            onChange={(value) => handleInputChange("name", value)}
          />
          <Textarea
            label="Description *"
            placeholder="eg. Explain what this test is about"
            value={formData.description}
            onChange={(value) => handleInputChange("description", value)}
          />
          <UploadBox file={file} setFile={setFile} existingImageUrl={existingBannerUrl} />

          <div className="grid grid-cols-2 gap-6">
            <div className="flex gap-2 flex-col ">
              <label htmlFor={"stream"} className="text-[1rem] font-normal">
                Stream *
              </label>
              <Select
                value={formData.stream}
                onValueChange={(value) => handleInputChange("stream", value)}
              >
                <SelectTrigger className="border border-[#13097D66] !py-3 !px-4 rounded-[12px] w-full text-[1rem] font-normal !h-auto">
                  <SelectValue
                    placeholder="Select stream"
                    className="placeholder:font-medium"
                  />
                </SelectTrigger>
                <SelectContent>
                  {STREAMS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-[1rem] font-medium"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 flex-col">
              <label htmlFor={"stream"} className="text-[1rem] font-normal">
                Test Type *
              </label>

              <div className="flex items-center gap-6 pt-3">
                <Radio
                  label="Standalone"
                  name="confirm"
                  value="yes"
                  checked={type === "standalone"}
                  onChange={() => setType("standalone")}
                />

                <Radio
                  label="course"
                  name="confirm"
                  value="yes"
                  checked={type === "course"}
                  onChange={() => setType("course")}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-col">
            <label
              htmlFor="stream"
              className={`text-[1rem] font-normal ${
                type !== "course" ? "text-(--text-muted)" : ""
              }`}
            >
              Choose course *
            </label>

            <Select
              value={formData.course}
              onValueChange={(value) => handleInputChange("course", value)}
              disabled={type !== "course"} // ✅ only enable for course
            >
              <SelectTrigger
                className={`border rounded-[12px] w-full text-[1rem] font-normal
        !py-3 !px-4 !h-auto
        ${
          type === "course"
            ? "border-[#13097D66] bg-white"
            : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
        }`}
              >
                <SelectValue
                  placeholder={loadingCourses ? "Loading courses..." : "Choose"}
                  className="placeholder:font-medium"
                />
              </SelectTrigger>

              <SelectContent>
                {loadingCourses ? (
                  <SelectItem value="loading" disabled className="text-[1rem] font-medium">
                    Loading courses...
                  </SelectItem>
                ) : courses.length > 0 ? (
                  courses.map((course) => (
                    <SelectItem
                      key={course.courseId}
                      value={course.courseId}
                      className="text-[1rem] font-medium"
                    >
                      {course.courseName}
                    </SelectItem>
                  ))
                ) : type === "course" ? (
                  <SelectItem value="no-courses" disabled className="text-[1rem] font-medium">
                    No courses available
                  </SelectItem>
                ) : (
                  <SelectItem value="placeholder" disabled className="text-[1rem] font-medium">
                    Select course type first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Dropdown>

      <Dropdown label="Sections">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input 
                label="Section Name *" 
                placeholder="eg. Physics" 
                value={currentSection.sectionName}
                onChange={(value) => handleSectionInputChange("sectionName", value)}
              />
            </div>
            <div className="flex-1">
              <Input 
                label="Total Questions *" 
                placeholder="eg. 25" 
                value={currentSection.totalQuestions}
                onChange={(value) => handleSectionInputChange("totalQuestions", value)}
              />
            </div>
            <div className="flex-1">
              <Input 
                label="Duration (minutes) *" 
                placeholder="eg. 60" 
                value={currentSection.sectionDuration}
                onChange={(value) => handleSectionInputChange("sectionDuration", value)}
              />
            </div>
            <button
              onClick={handleAddSection}
              className="mt-6 flex items-center justify-center
                 py-2.5 px-10 bg-(--btn-primary)
                 text-white text-[1rem] font-medium
                 shadow-[0px_4px_12px_rgba(250,102,15,0.2)]
                 rounded-2xl whitespace-nowrap hover:cursor-pointer"
            >
              Add
            </button>
          </div>

          {sections.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              <h3 className="text-[1rem] font-semibold text-(--text-app-primary)">Added Sections:</h3>
              {sections.map((section, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#f8faf9] rounded-lg">
                  <div className="flex gap-6">
                    <span className="text-[0.875rem]"><strong>Name:</strong> {section.sectionName}</span>
                    <span className="text-[0.875rem]"><strong>Questions:</strong> {section.totalQuestionsSupposedToBeAdded}</span>
                    <span className="text-[0.875rem]"><strong>Duration:</strong> {section.sectionDurationInMinutes} min</span>
                  </div>
                  <button
                    onClick={() => handleRemoveSection(index)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Dropdown>

      <Dropdown label="Pricing & Duration">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-col">
            <label htmlFor={"stream"} className="text-[1rem] font-normal">
              Test Type *
            </label>

            <div className="flex items-center gap-6 pt-3">
              <Radio
                label="Free"
                name="confirm"
                value="free"
                checked={cost === "free"}
                onChange={() => setCost("free")}
              />

              <Radio
                label="Paid"
                name="confirm"
                value="paid"
                checked={cost === "paid"}
                onChange={() => setCost("paid")}
              />

              {cost === "paid" && (
                <input
                  type="text"
                  placeholder="0"
                  value={formData.paidAmount}
                  onChange={(e) => handleInputChange("paidAmount", e.target.value)}
                  className="border border-[#13097D66] disabled:border-[#6B7280] disabled:cursor-not-allowed placeholder:disabled:#6B7280 py-3 px-4 rounded-[12px] w-1/12 placeholder:text-(--text-muted) placeholder:font-medium"
                />
              )}
            </div>
          </div>

          <div>
            <Input 
              label="Duration (in minutes) *" 
              placeholder="eg. 120" 
              value={formData.duration}
              onChange={(value) => handleInputChange("duration", value)}
            />
          </div>
        </div>
      </Dropdown>

      <Dropdown label="Scoring System">
        <div className="flex flex-col gap-4">
          <Input 
            label="Points for Correct Answer*" 
            placeholder="1" 
            value={formData.correctPoints}
            onChange={(value) => handleInputChange("correctPoints", value)}
          />
          <Checkbox
            label="Enable Negative Marking"
            checked={enableNegativeMarking}
            onChange={setEnableNegativeMarking}
          />
          <Input
            label="Points for Wrong Answer"
            placeholder="0"
            value={formData.wrongPoints}
            onChange={(value) => handleInputChange("wrongPoints", value)}
            disabled={!enableNegativeMarking}
          />
        </div>
      </Dropdown>

      <Dropdown label="Instruction">
        <Textarea
          label="Test Instructions"
          placeholder="Provide clear instructions for test takers. E.g , Choose the correct answer, Do not use external resources etc"
          value={formData.instructions}
          onChange={(value) => handleInputChange("instructions", value)}
        />
      </Dropdown>

      <div className=" w-full bg-white shadow-[0_0_4px_0_#00000026] hover:cursor-pointer rounded-2xl p-5 max-w-[1200px] flex flex-col gap-4">
        <div className="flex gap-10">
          <h1 className="text-(--text-app-primary) font-medium text-[1.125rem]">
            Test Name:{" "}
            <span className="text-(--text-muted)">
              {formData.name ? formData.name : "Not set"}
            </span>
          </h1>
          <h1 className="text-(--text-app-primary) font-medium text-[1.125rem]">
            Total Section: <span className="text-(--text-muted)">{sections.length}</span>
          </h1>
          <h1 className="text-(--text-app-primary) font-medium text-[1.125rem]">
            Duration: <span className="text-(--text-muted)">{formData.duration || "0"}</span>
          </h1>
          <h1 className="text-(--text-app-primary) font-medium text-[1.125rem]">
            Test Type: <span className="text-(--text-muted)">{cost}</span>
          </h1>
        </div>

        <div className="flex gap-6 justify-end">
          <button
            onClick={handleSaveDraft}
            className="mt-6 flex items-center justify-center
               py-2.5 px-10 text-(--btn-primary)
               bg-white text-[1rem] font-medium
               shadow-[0px_4px_12px_rgba(250,102,15,0.2)]
               rounded-2xl whitespace-nowrap hover:cursor-pointer border border-(--btn-primary)"
          >
            Save As Draft
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="mt-6 flex items-center justify-center gap-2
               py-2.5 px-10 bg-(--btn-primary)
               text-white text-[1rem] font-medium
               shadow-[0px_4px_12px_rgba(250,102,15,0.2)]
               rounded-2xl whitespace-nowrap hover:cursor-pointer
               disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {editMode ? "Updating Test..." : "Creating Test..."}
              </>
            ) : (
              editMode ? "Update Test" : "Next: Upload Question"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}



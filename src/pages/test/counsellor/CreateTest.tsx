import { Checkbox } from "@/components/create-test/components/Checkbox";
import { Dropdown } from "@/components/create-test/components/Dropdown";
import { Input } from "@/components/create-test/components/Input";
import { Textarea } from "@/components/create-test/components/Textarea";
import UploadBox from "@/components/create-test/components/UploadBox";
import { ImageCropper } from "@/components/common/ImageCropper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/AuthStore";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
  pointsForCorrectAnswer: number;
  negativeMarks: number;
}

interface SectionInput {
  sectionName: string;
  totalQuestions: string;
  sectionDuration: string;
  correctPoints: string;
  negativeMarks: string;
}

const STREAMS = [
  { value: "ENGINEERING", label: "Engineering" },
  { value: "MEDICAL", label: "Medical" },
  { value: "COMMERCE", label: "Commerce" },
];

export function CreateTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const { testGroupId: routeTestGroupId } = useParams<{ testGroupId: string }>();
  const { user, role, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  
  const editMode = location.state?.editMode || false;
  const existingTestData = location.state?.testData || null;
  const testGroupId = routeTestGroupId || location.state?.testGroupId || existingTestData?.testGroupId || null;
  
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
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [enableNegativeMarking, setEnableNegativeMarking] =
    useState<boolean>(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testSeriesId, setTestSeriesId] = useState<string | null>(null);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionInput>({
    sectionName: "",
    totalQuestions: "",
    sectionDuration: "",
    correctPoints: "",
    negativeMarks: "",
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
  const [sectionSwitchingAllowed, setSectionSwitchingAllowed] = useState<boolean>(false);

  // Prefill data in edit mode
  useEffect(() => {
    if (editMode && existingTestData) {
      setTestSeriesId(existingTestData.testSeriesId);
      setFormData({
        name: existingTestData.testName || "",
        description: existingTestData.testDescription || "",
        stream: existingTestData.stream || "",
        course: "",
        duration: existingTestData.durationInMinutes?.toString() || "",
        correctPoints: existingTestData.pointsForCorrectAnswer?.toString() || "",
        wrongPoints: existingTestData.negativeMarks?.toString() || "",
        paidAmount: "",
        instructions: existingTestData.testInstructuctions || "",
      });
      setSectionSwitchingAllowed(existingTestData.sectionSwitchingAllowed || false);
      setEnableNegativeMarking(existingTestData.negativeMarkingEnabled || false);
      // Map sections with default values for new fields
      const mappedSections = (existingTestData.listOfSection || []).map((section: any) => ({
        sectionName: section.sectionName,
        totalQuestionsSupposedToBeAdded: section.totalQuestionsSupposedToBeAdded,
        sectionDurationInMinutes: section.sectionDurationInMinutes,
        pointsForCorrectAnswer: section.pointsForCorrectAnswer ?? 0,
        negativeMarks: section.negativeMarks ?? 0,
      }));
      setSections(mappedSections);
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

  // Auto-calculate total duration from sections
  useEffect(() => {
    if (sections.length > 0) {
      const totalDuration = sections.reduce((sum, section) => sum + section.sectionDurationInMinutes, 0);
      setFormData(prev => ({
        ...prev,
        duration: totalDuration.toString()
      }));
    } else if (sections.length === 0 && !editMode) {
      setFormData(prev => ({
        ...prev,
        duration: "0"
      }));
    }
  }, [sections, editMode]);

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
    if (currentSection.sectionName && currentSection.totalQuestions && currentSection.sectionDuration && 
        currentSection.correctPoints && currentSection.negativeMarks) {
      const newSection: Section = {
        sectionName: currentSection.sectionName,
        totalQuestionsSupposedToBeAdded: parseInt(currentSection.totalQuestions),
        sectionDurationInMinutes: parseInt(currentSection.sectionDuration),
        pointsForCorrectAnswer: parseFloat(currentSection.correctPoints),
        negativeMarks: parseFloat(currentSection.negativeMarks),
      };
      
      if (editingSectionIndex !== null) {
        // Check if anything changed
        const existingSection = sections[editingSectionIndex];
        const hasChanges = 
          existingSection.sectionName !== newSection.sectionName ||
          existingSection.totalQuestionsSupposedToBeAdded !== newSection.totalQuestionsSupposedToBeAdded ||
          existingSection.sectionDurationInMinutes !== newSection.sectionDurationInMinutes ||
          existingSection.pointsForCorrectAnswer !== newSection.pointsForCorrectAnswer ||
          existingSection.negativeMarks !== newSection.negativeMarks;
        
        if (!hasChanges) {
          toast.error("No changes made to the section");
          return;
        }
        
        // Update existing section
        const updatedSections = [...sections];
        updatedSections[editingSectionIndex] = newSection;
        setSections(updatedSections);
        setEditingSectionIndex(null);
        toast.success("Section updated");
      } else {
        // Add new section
        setSections([...sections, newSection]);
        toast.success("Section added");
      }
      
      setCurrentSection({
        sectionName: "",
        totalQuestions: "",
        sectionDuration: "",
        correctPoints: "",
        negativeMarks: "",
      });
      // Duration will be auto-calculated by useEffect
    } else {
      toast.error("Please fill all section fields");
    }
  };

  const handleEditSection = (index: number) => {
    console.log('Editing section at index:', index, 'Section data:', sections[index]);
    const section = sections[index];
    setCurrentSection({
      sectionName: section.sectionName,
      totalQuestions: section.totalQuestionsSupposedToBeAdded.toString(),
      sectionDuration: section.sectionDurationInMinutes.toString(),
      correctPoints: (section.pointsForCorrectAnswer ?? 0).toString(),
      negativeMarks: (section.negativeMarks ?? 0).toString(),
    });
    setEditingSectionIndex(index);
    toast.info('Editing section: ' + section.sectionName);
  };

  const handleCancelEdit = () => {
    setCurrentSection({
      sectionName: "",
      totalQuestions: "",
      sectionDuration: "",
      correctPoints: "",
      negativeMarks: "",
    });
    setEditingSectionIndex(null);
  };

  const handleRemoveSection = (index: number) => {
    if (editingSectionIndex === index) {
      toast.error("Cannot remove section while editing. Cancel edit first.");
      return;
    }
    setSections(sections.filter((_, i) => i !== index));
    // If removing a section before the one being edited, adjust the index
    if (editingSectionIndex !== null && index < editingSectionIndex) {
      setEditingSectionIndex(editingSectionIndex - 1);
    }
    // Duration will be auto-calculated by useEffect
  };

  const handleSaveDraft = async () => {
    // Get counsellorId from authenticated user
    if (!user?.phoneNumber) {
      console.error("No counselor ID found");
      toast.error("Unable to identify counselor. Please login again.");
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter test name");
      return;
    }

    if (!formData.stream) {
      toast.error("Please select a stream");
      return;
    }

    if (sections.length === 0) {
      toast.error("Please add at least one section");
      return;
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast.error("Please enter a valid duration");
      return;
    }

    if (!formData.correctPoints || parseInt(formData.correctPoints) <= 0) {
      toast.error("Please enter points for correct answer");
      return;
    }

    if (enableNegativeMarking && (!formData.wrongPoints || parseFloat(formData.wrongPoints) < 0)) {
      toast.error("Please enter valid negative marks");
      return;
    }

    setIsSubmitting(true);
    const counsellorId = user.phoneNumber;

    let requestData: any;

    if (editMode && testSeriesId) {
      // For update, send ALL editable fields
      requestData = {
        counsellorId,
        testSeriesId: testSeriesId,
        testName: formData.name,
        testDescription: formData.description,
        stream: formData.stream,
        testType: null,
        courseIdAttached: null,
        priceType: null,
        price: null,
        sectionSwitchingAllowed: sectionSwitchingAllowed,
        durationInMinutes: parseInt(formData.duration),
        pointsForCorrectAnswer: parseInt(formData.correctPoints),
        negativeMarkingEnabled: enableNegativeMarking,
        negativeMarks: enableNegativeMarking ? parseFloat(formData.wrongPoints) : 0,
        testInstructuctions: formData.instructions,
        sections: sections.map(section => ({
          sectionName: section.sectionName,
          totalQuestionsSupposedToBeAdded: section.totalQuestionsSupposedToBeAdded,
          sectionDurationInMinutes: section.sectionDurationInMinutes,
          pointsForCorrectAnswer: section.pointsForCorrectAnswer ?? 0,
          negativeMarks: section.negativeMarks ?? 0
        })),
        testGroupId: testGroupId,
      };
    } else {
      // For create, send all fields
      requestData = {
        counsellorId,
        testName: formData.name,
        testDescription: formData.description,
        stream: formData.stream,
        testType: null,
        courseIdAttached: null,
        priceType: null,
        price: null,
        sectionSwitchingAllowed: sectionSwitchingAllowed,
        durationInMinutes: parseInt(formData.duration),
        pointsForCorrectAnswer: parseInt(formData.correctPoints),
        negativeMarkingEnabled: enableNegativeMarking,
        negativeMarks: enableNegativeMarking ? parseFloat(formData.wrongPoints) : 0,
        testInstructuctions: formData.instructions,
        sections: sections,
        testGroupId: testGroupId,
      };
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
      ? `${import.meta.env.VITE_API_BASE_URL}/api/testSeries/updateTestSeries`
      : `${import.meta.env.VITE_API_BASE_URL}/api/testSeries/createTestSeries`;

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
        if (editMode) {
          // For edit mode, invalidate cache and navigate back
          toast.success("Test series updated successfully!");
          // Invalidate the test series cache so it refetches only the updated data
          queryClient.invalidateQueries({ queryKey: ["counsellorTestSeries", user.phoneNumber] });
          setTimeout(() => {
            // Navigate back to test group details if testGroupId exists, otherwise go to dashboard
            if (testGroupId) {
              navigate(`/counselor/test-groups/${testGroupId}`, { replace: true });
            } else {
              navigate("/counsellor-dashboard", {
                state: { activeTab: "courses" },
                replace: true
              });
            }
          }, 600);
        } else {
          // For create mode, navigate back to test group details
          toast.success("Test series created successfully!");
          if (testGroupId) {
            navigate(`/counselor/test-groups/${testGroupId}`, { replace: true });
          } else {
            navigate("/counsellor-dashboard", {
              state: { activeTab: "courses" },
              replace: true
            });
          }
        }
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

  // Check if form is valid for submission
  const isFormValid = 
    formData.name.trim() && 
    formData.stream && 
    sections.length > 0 && 
    formData.duration && 
    parseInt(formData.duration) > 0 &&
    formData.correctPoints && 
    parseInt(formData.correctPoints) > 0 &&
    (!enableNegativeMarking || (formData.wrongPoints && parseFloat(formData.wrongPoints) >= 0)) &&
    (editMode || file);

  return (
    <div className="pt-28 pb-8 w-full mx-auto max-w-7xl  min-h-screen flex flex-col gap-4">
      {/* Back button and title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            if (testGroupId) {
              navigate(`/counselor/test-groups/${testGroupId}`, { replace: true });
            } else {
              navigate("/counsellor-dashboard", {
                state: { activeTab: "courses" },
                replace: true
              });
            }
          }}
          className="flex items-center gap-2 text-(--text-app-primary) hover:text-(--btn-primary) transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{testGroupId ? "Back to Test Group" : "Back to Test Groups"}</span>
        </button>
      </div>
      
      {/* top header title here */}
      <div className="p-5 bg-[#f8faf9] max-w-[1200px] text-(--text-app-primary) font-semibold text-[1.5rem] rounded-2xl">
        {editMode ? "Edit Test Series" : "Create New Test"}
      </div>

      <Dropdown label="Test Name" defaultOpen={true}>
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
          <UploadBox 
            file={file} 
            setFile={setFile} 
            existingImageUrl={existingBannerUrl}
            onImageSelect={(imageUrl) => {
              setImageToCrop(imageUrl);
              setShowCropper(true);
            }}
          />

          <div className="flex gap-2 flex-col">
            <label htmlFor={"stream"} className="text-[1rem] font-normal cursor-pointer">
              Stream *
            </label>
            <Select
              value={formData.stream}
              onValueChange={(value) => handleInputChange("stream", value)}
            >
              <SelectTrigger className="border border-[#13097D66] !py-3 !px-4 rounded-[12px] w-full text-[1rem] font-normal !h-auto cursor-pointer">
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
                    className="text-[1rem] font-medium cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Dropdown>

      <Dropdown label="Sections">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Input 
                label="Section Name *" 
                placeholder="eg. Physics" 
                value={currentSection.sectionName}
                onChange={(value) => handleSectionInputChange("sectionName", value)}
              />
            </div>
            <div>
              <Input 
                label="Total Questions *" 
                placeholder="eg. 25" 
                value={currentSection.totalQuestions}
                onChange={(value) => handleSectionInputChange("totalQuestions", value)}
              />
            </div>
            <div>
              <Input 
                label="Duration (minutes) *" 
                placeholder="eg. 60" 
                value={currentSection.sectionDuration}
                onChange={(value) => handleSectionInputChange("sectionDuration", value)}
              />
            </div>
            <div>
              <Input 
                label="Points for Correct *" 
                placeholder="eg. 4" 
                value={currentSection.correctPoints}
                onChange={(value) => handleSectionInputChange("correctPoints", value)}
              />
            </div>
            <div>
              <Input 
                label="Negative Marks *" 
                placeholder="eg. 1 (or 0 for no negative)" 
                value={currentSection.negativeMarks}
                onChange={(value) => handleSectionInputChange("negativeMarks", value)}
              />
            </div>
            <div className="flex items-end gap-2">
              {editingSectionIndex !== null && (
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 flex items-center justify-center
                     py-2.5 px-4 bg-gray-500
                     text-white text-[1rem] font-medium
                     rounded-2xl hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleAddSection}
                className="flex-1 flex items-center justify-center
                   py-2.5 px-4 bg-(--btn-primary)
                   text-white text-[1rem] font-medium
                   shadow-[0px_4px_12px_rgba(250,102,15,0.2)]
                   rounded-2xl hover:cursor-pointer"
              >
                {editingSectionIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>

          {sections.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              <h3 className="text-[1rem] font-semibold text-(--text-app-primary)">Added Sections:</h3>
              {sections.map((section, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#f8faf9] rounded-lg">
                  <div className="grid grid-cols-5 gap-3 flex-1 items-center">
                    <span className="text-[0.875rem]"><strong className="inline-block w-14">Name:</strong> {section.sectionName}</span>
                    <span className="text-[0.875rem]"><strong className="inline-block w-20">Questions:</strong> {section.totalQuestionsSupposedToBeAdded}</span>
                    <span className="text-[0.875rem]"><strong className="inline-block w-18 px-1">Duration:</strong> {section.sectionDurationInMinutes} min</span>
                    <span className="text-[0.875rem]"><strong className="inline-block w-28">Correct Points:</strong> {section.pointsForCorrectAnswer}</span>
                    <span className="text-[0.875rem]"><strong className="inline-block w-32">Negative Marks:</strong> {section.negativeMarks}</span>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSection(index);
                      }}
                      className="text-blue-500 hover:text-blue-700 font-medium cursor-pointer px-3 py-1 hover:bg-blue-50 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSection(index);
                      }}
                      className="text-red-500 hover:text-red-700 font-medium cursor-pointer px-3 py-1 hover:bg-red-50 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Dropdown>

      <Dropdown label="Test Settings">
        <div className="flex flex-col gap-4">
          <Checkbox
            label="Allow Section Switching"
            checked={sectionSwitchingAllowed}
            onChange={setSectionSwitchingAllowed}
          />
          <div>
            <label className="text-[1rem] font-normal mb-2 block">
              Duration (in minutes) * <span className="text-(--text-muted) text-sm">(Auto-calculated from sections)</span>
            </label>
            <input
              type="text"
              value={formData.duration || "0"}
              readOnly
              className="border border-[#13097D66] bg-gray-50 py-3 px-4 rounded-[12px] w-full placeholder:text-(--text-muted) placeholder:font-medium cursor-not-allowed"
              placeholder="Add sections to calculate duration"
            />
          </div>
        </div>
      </Dropdown>

      <Dropdown label="Scoring System (Default)">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Set default scoring. Each section can have custom points and negative marks.
          </p>
          <Input 
            label="Default Points for Correct Answer*" 
            placeholder="4" 
            value={formData.correctPoints}
            onChange={(value) => handleInputChange("correctPoints", value)}
          />
          <Checkbox
            label="Enable Negative Marking"
            checked={enableNegativeMarking}
            onChange={setEnableNegativeMarking}
          />
          <Input
            label="Default Negative Marks"
            placeholder="1"
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
            Duration: <span className="text-(--text-muted)">{formData.duration || "0"} minutes</span>
          </h1>
        </div>

        <div className="flex gap-6 justify-end">
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting || !isFormValid}
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

      {/* Image Cropper Modal */}
      {showCropper && imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          aspectRatio={1}
          onCropComplete={(croppedImage) => {
            setFile(croppedImage);
            setExistingBannerUrl(URL.createObjectURL(croppedImage));
            setShowCropper(false);
            setImageToCrop(null);
          }}
          onCancel={() => {
            // Clear the temporary image selection
            setShowCropper(false);
            setImageToCrop(null);
            // Don't set file or banner URL on cancel
          }}
        />
      )}
    </div>
  );
}



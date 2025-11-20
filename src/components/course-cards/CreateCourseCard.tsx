import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Stepper from "./StepCounter";
import Step1Card from "./Step1Card";
import { useState, type JSX } from "react";
import Step2Card from "./Step2Card";
import Step3Card from "./Step3Card";


export default function CreateCourseCard({onClose}:any){
  const [step, setStep] = useState<number>(1)


  const currentCard = ():JSX.Element => {
    switch(step){
      case 1:
        return <Step1Card/>
      case 2:
        return  <Step2Card/>
      case 3:
        return <Step3Card/>
      default:
        return <Step1Card/>
    }
  }
    return (
        <div className="fixed inset-0 z-70 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
        <div 
        className="hidden md:flex items-center flex-col gap-8 w-full max-w-250 max-h-fit bg-[#F5F7FA] rounded-2xl shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={20} />
        </button>

        <h1 className="text-[#343C6A] text-2xl font-semibold">Create Course</h1>
        <Stepper currentStep={step}/>

        {currentCard()}
        
       
         <div className="flex justify-between w-full">
            <button 
              onClick={()=>{
               if(step>1){
                setStep(prev => prev-1)
              }
            }
          }
            className='flex gap-3 items-center py-2 px-6 border rounded-[12px] font-semibold text-[#655E95] border-[#655E95] '>
                <ChevronLeft/>
                Prev
            </button>

            <button 
            onClick={()=>{
               if(step<3){
                setStep(prev => prev+1)
              }
            }
            }
            className='flex items-center gap-3 py-2 px-6 border bg-[#655E95] font-semibold rounded-[12px] text-[1rem] text-white'>
                Next
                <ChevronRight/>
            </button>
        </div>
      </div>
        </div>
    );
}


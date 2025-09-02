import Header from './components/Header'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { CourseExamSection } from './components/CourseExamSection'
import { ExamSection } from './components/ExamSection'
import { CollegeSection } from './components/CollegeSection'

export default function App(){
  return(
    <BrowserRouter>
          <Header/>
          <AppRoutes/>
          <CourseExamSection/>
          <ExamSection/>
          <CollegeSection/>
         
    </BrowserRouter>
  )
}

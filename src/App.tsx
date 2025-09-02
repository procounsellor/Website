import { CounselorSection } from "./components/CounselorSection";
import { DiscoverSection } from "./components/DiscoverSection";
import Header from "./components/Header";
import Hero from "./components/Hero";


export default function App(){
  return(
    <div>
      <Header/>
      <Hero/>
      <CounselorSection/>
      <DiscoverSection/>
    </div>
  )
}

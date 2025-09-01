import { Navbar } from "./components/Header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card";


export default function App(){
  return(
    <div>
         <Navbar/>
         <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>
              anything
            </CardTitle>
           
          </CardHeader>
           <CardContent>
              <p>my content</p>
            </CardContent>

            <CardFooter>
              <p>card footer</p>
            </CardFooter>
         </Card>
    </div>
  )
}

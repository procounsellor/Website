export interface CourseType{
    id:string,
    image:string,
    reviews?:string| null,
    rating?:string | null,
    name:string,
    counselorName?: string | null,
    counsellorName?: string | null,
    subject:string,
    price:string,
    isBookmarked?:boolean
     courseTimeHours: number,
    courseTimeMinutes: number,
}
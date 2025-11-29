export interface CourseType{
    id:string,
    image:string,
    reviews?:string| null,
    rating?:string | null,
    name:string,
    subject:string,
    price:string,
    isBookmarked?:boolean
}
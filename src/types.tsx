export interface NewsType{
    id?: string,
    story_date?: string, 
    title?: string,
    excerpt?: string,
    story_content?: string,
    author?: Author,
    ratings?: Rating,
}

interface Author{
    name: string,
    email: string,
    phone: string,
}

export interface Rating{
    upvotes: number,
    downvotes: number,
    rating: number,
}

export interface RatingUpdate{
    vote: string,
    userId: string,
    newsId: string,
}
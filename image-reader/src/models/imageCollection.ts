import { Category } from "./category";

export interface ImageCollection {
    id: string
    name: string
    description?: string
    category: Category
    createdAt: string
    userId: string
}
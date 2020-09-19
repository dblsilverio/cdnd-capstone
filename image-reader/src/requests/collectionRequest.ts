import { Category } from "../models/category";

/**
 * A request for creating and updating image collections
 */
export interface CollectionRequest {
    name: string
    description?: string
    category: Category
}
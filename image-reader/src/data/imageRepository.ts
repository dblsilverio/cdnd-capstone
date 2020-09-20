import { Image } from "../models/image";

export interface ImageRepository {
    create(i: Image): Promise<Image>
}
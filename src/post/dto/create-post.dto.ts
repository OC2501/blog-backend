import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from "class-validator";


export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    excerpt: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    featuredImage: string;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    viewCount: number;

    @IsArray()
    @IsNotEmpty()
    categoryId: string[];

    @IsArray()
    @IsNotEmpty()
    tagId: string[];

    @IsString()
    @IsNotEmpty()
    userId: string;
 

}

import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";


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

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsString()
    @IsNotEmpty()
    tagId:string[];

    @IsString()
    @IsNotEmpty()
    userId: string;
 

}

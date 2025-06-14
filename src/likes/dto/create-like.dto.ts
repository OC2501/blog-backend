import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateLikeDto {

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    postId: string;
}

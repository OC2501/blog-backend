import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    
        @IsString()
        @IsNotEmpty()
        name: string;

        @IsString()
        @IsNotEmpty()
        @IsEmail()
        email: string;
    
        @IsString()
        @IsNotEmpty()
        password: string;
    
        @IsString()
        @IsNotEmpty()
        bio: string;
    
        @IsString()
        @IsNotEmpty()
        position: string;
    
        @IsString()
        @IsNotEmpty()
        department: string;
    
        @IsString()
        @IsOptional()
        avatar?: string;
    
        @IsString()
        @IsOptional()
        facebook?: string;
    
        @IsString()
        @IsOptional()
        twitter?: string;
    
        @IsString()
        @IsOptional()
        instagram?: string;
    
        @IsString()
        @IsOptional()
        linkedin?: string;
}

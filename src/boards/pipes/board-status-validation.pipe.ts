import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../board.enum";

export class BoardStatusValidationPipe implements PipeTransform{
    
    
    readonly confirm = [
        BoardStatus.PRIVATE,
        BoardStatus.PUBLIC
    ]

    transform(value: any, metadata: ArgumentMetadata) {
        
        value = value.toUpperCase();

        if(!this.isValidation(value)){
            throw new BadRequestException();
        }

        return value;
    }


    isValidation(value:any){
        const index = this.confirm.indexOf(value);
        return index !== -1;
    }
}
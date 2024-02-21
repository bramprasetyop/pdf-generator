import { IsNotEmpty, IsString } from 'class-validator';

export class PdfGeneratorCreateRequest {
  @IsString()
  @IsNotEmpty()
  fileRoute: string;
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseServiceService } from './firebase-service.service';

@Controller('firebase-service')
export class FirebaseServiceController {
  constructor(private readonly firebaseServiceService: FirebaseServiceService) {}

  @Post('/sendimg')
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File): Promise<any> {
    try {
      if (!file) {
        throw new HttpException('No se ha proporcionado ningún archivo', HttpStatus.BAD_REQUEST);
      }

      // Subir el archivo a Firebase y obtener la URL
      const imageUrl = await this.firebaseServiceService.uploadFile(file.buffer, file.originalname, file.mimetype);

      // Devuelve la URL de la imagen como parte de un objeto JSON
      return { url: imageUrl };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error al procesar la imagen',
        error: error.message,
      };
    }
  }
 
}

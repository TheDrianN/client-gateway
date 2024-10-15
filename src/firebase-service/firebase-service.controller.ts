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

  @Post('/deleteimg')
  async delete(@Body('url') url: string): Promise<any> {
    try {
      // Eliminar el archivo en Firebase utilizando el servicio
      await this.firebaseServiceService.deleteFile(url);
  
      // Devuelve una respuesta indicando que el archivo fue eliminado
      return { status: 'success', message: 'Imagen eliminada con éxito' };
    } catch (error) {
      // Manejo de errores y respuesta con un estado HTTP apropiado
      return {
        statusCode: 500,
        message: 'Error al eliminar la imagen',
        error: error.message,
      };
    }
  }
 
}

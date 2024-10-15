import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FirebaseServiceService {
  private bucket = admin.storage().bucket();

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const uniqueFileName = `${uuidv4()}-${fileName}`;  // Genera un nombre único para el archivo
    const fileUpload = this.bucket.file(uniqueFileName);

    // Subir el archivo a Firebase
    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: mimeType,
      },
    });

    // Hacer el archivo público
    await fileUpload.makePublic();

    // Devolver la URL pública del archivo
    const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${uniqueFileName}`;
    return publicUrl;
  }
}

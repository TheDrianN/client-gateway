import { Module } from '@nestjs/common';
import { FirebaseServiceController } from './firebase-service.controller';
import {  envs } from 'src/config';
import * as admin from 'firebase-admin';
import { join } from 'path';
import { FirebaseServiceService } from './firebase-service.service';
import * as fs from 'fs';

@Module({
  controllers: [FirebaseServiceController],
  providers: [FirebaseServiceService],
 
})
export class FirebaseServiceModule {
  constructor() {
    const serviceAccountPath = join(
      process.cwd(), // El directorio raíz del proyecto
      envs.firebase // La ruta dinámica desde el .env
    );

    if (fs.existsSync(serviceAccountPath)) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        storageBucket: 'cip-img.appspot.com', // Reemplaza por el nombre de tu bucket de Firebase
      });
      console.log('Firebase initialized successfully.');
    } else {
      console.warn(
        `Firebase credentials not found at ${serviceAccountPath}. Skipping Firebase initialization.`
      );
    }
  }
}

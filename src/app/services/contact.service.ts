import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

export interface ContactForm {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly firestore = inject(Firestore);

  async submitContact(form: ContactForm): Promise<void> {
    const ref = collection(this.firestore, 'contacts');
    await addDoc(ref, { ...form, createdAt: serverTimestamp() });
  }
}

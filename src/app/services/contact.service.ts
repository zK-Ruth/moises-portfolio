import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface ContactForm {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  /** Sends the inquiry to the Cloud Function, which emails a formatted message. */
  async submitContact(form: ContactForm): Promise<void> {
    const response = await fetch(environment.contactEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error((detail as { error?: string }).error ?? 'Failed to send message.');
    }
  }
}


import React from 'react';

export enum AppRoutes {
  HOME = '/',
  AI_ASSISTANT = '/ai-assistant',
  CREATE_POST = '/create-post',
  PET_PROFILE = '/pet-profile',
  HEALTH_CHECKUP = '/health-checkup',
  PET_CARE = '/pet-care',
  SETTINGS = '/settings',
  TERMS = '/terms',
  PRIVACY = '/privacy',
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface WeightRecord {
  date: string;
  weight: number;
}

export interface VaccinationRecord {
  name: string;
  date: string;
  nextDueDate: string;
}

export interface PetProfile {
  name: string;
  species: string;
  breed: string;
  birthday: string;
  bio: string;
  avatarUrl?: string;
  ageYears?: string;
  ageMonths?: string;
  healthNotes?: string;
  weightHistory: WeightRecord[];
  vaccinations: VaccinationRecord[];
}

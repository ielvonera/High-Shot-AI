
export type BrandStyle = 'Minimal' | 'Luxury' | 'Streetwear' | 'Corporate' | 'Youth' | 'Bold';
export type TargetPlatform = 'Instagram Post' | 'Facebook Ad' | 'Website Product Page' | 'Banner' | 'Story';
export type BackgroundPreference = 'Studio' | 'Lifestyle Urban' | 'Lifestyle Outdoor' | 'Lifestyle Office' | 'Branded AI';
export type ImageResolution = 'Standard' | 'HD';
export type ImageFormat = 'JPG' | 'PNG' | 'WebP';

export type ViewType = 
  | 'landing' 
  | 'how-it-works' 
  | 'features' 
  | 'use-cases' 
  | 'about' 
  | 'contact' 
  | 'login'
  | 'signup'
  | 'generator' 
  | 'gallery' 
  | 'profile'
  | 'enhancer'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'commercial-use';

export interface GenerationSettings {
  brandStyle: BrandStyle;
  brandColor: string;
  useLogo: boolean;
  platform: TargetPlatform;
  background: BackgroundPreference;
  quantity: number;
  resolution: ImageResolution;
  format: ImageFormat;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  platform: TargetPlatform;
  style: BrandStyle;
  resolution: ImageResolution;
  format: ImageFormat;
  isFavorite: boolean;
}

// Added Campaign interface for campaign projects
export interface Campaign {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  imageCount: number;
}

export interface AppState {
  currentView: ViewType;
  modelImage: string | null;
  productImages: string[];
  settings: GenerationSettings;
  results: GeneratedImage[];
  isGenerating: boolean;
  error: string | null;
  credits: number;
}
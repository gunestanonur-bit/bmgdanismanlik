import { getServiceHeroImage } from './consultingPageVisuals'

/** Eğitim listesi hero — sınıf / öğrenme ortamı */
export const TRAINING_HUB_HERO =
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=2400&q=85'

export const TRAINING_HUB_SECONDARY =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=85'

export function getTrainingHeroImage(slug: string): string {
  return getServiceHeroImage(slug)
}

export interface AppState {
  regenerate: boolean;
  isGenerating: boolean;
  imageLastGenerated: number;
  currentTimeViewIndex: number;
  currentImage: 'a' | 'b';
  generationPromise?: Promise<void>;
}

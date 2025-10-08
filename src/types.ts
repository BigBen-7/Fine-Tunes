export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
}

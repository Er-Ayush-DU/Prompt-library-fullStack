export interface Like {
  postId: string;
  userId: string;
  createdAt: Date;
}

export interface Comment {
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface DashboardStats {
  likesCount: number;
  commentsCount: number;
  promptsCount: number;
}

export interface IPrompt {
  title: string;
  description: string;
  category: "image" | "video_noaudio" | "video_audio" | "audio" | "webapp" | "mobileapp" | "webgame" | "ui_design" | "text";
  contentType: string; // e.g. image/png, video/mp4
  tags: string[];
  price: number;
  createdBy: string; // Assuming ObjectId as string for simplicity
  s3Key: string;
  previewUrl: string;
  likesCount: number;
  commentsCount: number;
  modifiedAfterGeneration: boolean;
}
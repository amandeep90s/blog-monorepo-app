export type SignUpFromState =
  | {
      data: {
        name?: string;
        email?: string;
        password?: string;
      };
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export type SignInFormState =
  | {
      data: {
        email?: string;
        password?: string;
      };
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export type CommentFormState =
  | {
      data?: {
        content?: string;
        postId?: string;
      };
      errors?: {
        content?: string[];
      };
      message?: string;
      ok?: boolean;
      open?: boolean;
    }
  | undefined;

export type PostFormState =
  | {
      data?: {
        postId?: string;
        title?: string;
        content?: string;
        thumbnail?: File | null;
        tags?: string;
        published?: string;
        previousThumbnailUrl?: string;
      };
      errors?: {
        title?: string[];
        content?: string[];
        thumbnail?: string[];
        tags?: string[];
        isPublished?: string[];
      };
      message?: string;
      ok?: boolean;
    }
  | undefined;

export type ProfileFormState =
  | {
      data?: {
        name?: string;
        bio?: string;
      };
      errors?: {
        name?: string[];
        bio?: string[];
      };
      message?: string;
      ok?: boolean;
    }
  | undefined;

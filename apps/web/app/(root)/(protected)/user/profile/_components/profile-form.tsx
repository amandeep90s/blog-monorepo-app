"use client";

import { useActionState, useEffect } from "react";
import { Save, User } from "lucide-react";
import { toast } from "sonner";

import { updateProfile } from "@/lib/actions/user";
import { SessionUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/ui/user-avatar";

type Props = {
  user: SessionUser;
};

const ProfileForm = ({ user }: Props) => {
  const [state, action, isPending] = useActionState(updateProfile, undefined);

  useEffect(() => {
    if (state?.message) {
      if (state?.ok) {
        toast.success(state?.message);
      } else {
        toast.error(state?.message);
      }
    }
  }, [state]);

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-linear-to-br">
      <div className="mx-auto max-w-2xl space-y-8 p-6">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <User className="text-primary h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Edit Profile</h1>
            <p className="text-muted-foreground text-lg">Update your profile information</p>
          </div>
        </div>

        <form action={action} className="space-y-8">
          {/* Profile Section */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <User className="text-primary h-5 w-5" />
                <div>
                  <CardTitle className="text-xl">Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Preview */}
              <div className="flex flex-col items-center space-y-4">
                <UserAvatar className="size-20" src={user.avatar || ""} alt={user.name || "User avatar"} />
                <div className="text-center">
                  <p className="text-sm text-gray-600">Current avatar</p>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  defaultValue={user.name || ""}
                  className={`text-lg ${state?.errors?.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  disabled={isPending}
                />
                {state?.errors?.name && (
                  <p className="text-destructive animate-in slide-in-from-left-1 text-sm">{state.errors.name[0]}</p>
                )}
              </div>

              {/* Bio Field */}
              <div className="space-y-3">
                <Label htmlFor="bio" className="text-sm font-semibold">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us a bit about yourself..."
                  defaultValue={user.bio || ""}
                  className={`min-h-[120px] resize-none text-base leading-relaxed ${
                    state?.errors?.bio ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                  disabled={isPending}
                />
                {state?.errors?.bio && (
                  <p className="text-destructive animate-in slide-in-from-left-1 text-sm">{state.errors.bio[0]}</p>
                )}
                <p className="text-muted-foreground text-xs">Share a brief description about yourself (optional)</p>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {state?.message && !state?.ok && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="p-4">
                <div className="text-destructive flex items-center gap-2">
                  <div className="bg-destructive h-2 w-2 rounded-full" />
                  <p className="text-sm font-medium">{state.message}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="min-w-[200px] text-base font-semibold shadow-lg transition-all hover:shadow-xl"
            >
              {isPending ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Update Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ChangePasswordRequest, UpdateProfileRequest, profileApi } from '../api/profileApi';

import useAuthStore from '@/features/auth/stores/authStore';
import { User } from '@/features/auth/types/auth.type';
import { useToast } from '@/hooks/use-toast';

export const useProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser, setCurrentUser } = useAuthStore();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser?.avatar || null);

  // Cập nhật thông tin người dùng
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      return profileApi.updateProfile(data, avatarFile);
    },
    onSuccess: (updatedUser) => {
      setCurrentUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast({
        title: "Cập nhật thông tin thành công",
        description: "Thông tin của bạn đã được cập nhật thành công.",
      });
      
      // Reset avatar file sau khi cập nhật thành công
      setAvatarFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Cập nhật thất bại",
        description: error.message || "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  });

  // Đổi mật khẩu
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileApi.changePassword(data),
    onSuccess: () => {
      toast({
        title: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được đổi thành công.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Đổi mật khẩu thất bại",
        description: error.message || "Không thể đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại.",
        variant: "destructive",
      });
    }
  });

  // Xử lý thay đổi avatar
  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(currentUser?.avatar || null);
    }
  };

  return {
    user: currentUser as User,
    isLoading: updateProfileMutation.isPending || changePasswordMutation.isPending,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    avatarPreview,
    handleAvatarChange,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
}; 
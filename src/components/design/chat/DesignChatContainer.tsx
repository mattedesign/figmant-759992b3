
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileDesignChatLayout } from './layouts/MobileDesignChatLayout';
import { DesktopDesignChatLayout } from './layouts/DesktopDesignChatLayout';

export const DesignChatContainer = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileDesignChatLayout />;
  }

  return <DesktopDesignChatLayout />;
};

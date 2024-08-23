import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getConfigDefaults, PermissionTypes, Permissions } from 'librechat-data-provider';
import { useGetStartupConfig } from 'librechat-data-provider/react-query';
import type { ContextType } from '~/common';
import { EndpointsMenu, ModelSpecsMenu, PresetsMenu, HeaderNewChat } from './Menus';
import ExportAndShareMenu from './ExportAndShareMenu';
import { useMediaQuery, useHasAccess } from '~/hooks';
import BookmarkMenu from './Menus/BookmarkMenu';
import AddMultiConvo from './AddMultiConvo';
import HeaderOptions from './Input/HeaderOptions';

const Roles = {
  ADMIN: 'admin',
  DEVELOPER: 'developer',
  USER: 'user',
};

const rolePermissions = {
  [Roles.ADMIN]: {
    canAccessSettings: true,
    canManageUsers: true,
    canUseAdvancedFeatures: true,
  },
  [Roles.DEVELOPER]: {
    canAccessSettings: true,
    canManageUsers: false,
    canUseAdvancedFeatures: true,
  },
  [Roles.USER]: {
    canAccessSettings: false,
    canManageUsers: false,
    canUseAdvancedFeatures: false,
  },
};

const defaultInterface = { ...getConfigDefaults().interface, plugin: true };

export default function Header() {
  const { data: startupConfig } = useGetStartupConfig();
  const { navVisible } = useOutletContext<ContextType>();
  const modelSpecs = useMemo(() => startupConfig?.modelSpecs?.list ?? [], [startupConfig]);
  const interfaceConfig = useMemo(
    () => startupConfig?.interface ?? defaultInterface,
    [startupConfig],
  );

  const hasAccessToBookmarks = useHasAccess({
    permissionType: PermissionTypes.BOOKMARKS,
    permission: Permissions.USE,
  });

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  // Predefinir el rol del usuario como USER
  const userRole = Roles.USER;
  const userPermissions = rolePermissions[userRole];

  return (
    <div className="sticky top-0 z-10 flex h-14 w-full items-center justify-between bg-white p-2 font-semibold dark:bg-gray-800 dark:text-white">
      <div className="hide-scrollbar flex w-full items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          {!navVisible && <HeaderNewChat />}
          {interfaceConfig.endpointsMenu === true && <EndpointsMenu />}
          {modelSpecs.length > 0 && <ModelSpecsMenu modelSpecs={modelSpecs} />}
          {userPermissions.canAccessSettings && <HeaderOptions interfaceConfig={interfaceConfig} />}
          {interfaceConfig.presets === true && <PresetsMenu />}
          {hasAccessToBookmarks === true && <BookmarkMenu />}
          <AddMultiConvo />
          {isSmallScreen && (
            <ExportAndShareMenu
              isSharedButtonEnabled={startupConfig?.sharedLinksEnabled ?? false}
            />
          )}
        </div>
        {!isSmallScreen && (
          <ExportAndShareMenu isSharedButtonEnabled={startupConfig?.sharedLinksEnabled ?? false} />
        )}
      </div>
      {/* Empty div for spacing */}
      <div />
    </div>
  );
}

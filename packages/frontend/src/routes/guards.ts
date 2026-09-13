import { getOAuthAuthorizeUrl } from '@/api/mcp';
import { useAuthStore, useCurrenciesStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { NavigationGuard } from 'vue-router';

export const authPageGuard: NavigationGuard = async (to, from, next): Promise<void> => {
  next('/dashboard');
};

export const baseCurrencyExists: NavigationGuard = (to, from, next): void => {
  const { isBaseCurrencyExists } = storeToRefs(useCurrenciesStore());

  if (!isBaseCurrencyExists.value) {
    next('/welcome');
  } else {
    next();
  }
};

export const redirectRouteGuard: NavigationGuard = async (to, from, next): Promise<void> => {
  const authStore = useAuthStore();
  const { useUserStore } = await import('@/stores/user');
  const userStore = useUserStore();

  authStore.isSessionChecked = true;
  // @ts-ignore - bypass for dev
  authStore.isLoggedIn = true;
  
  if (!userStore.user) {
    userStore.user = {
      id: 1,
      email: 'test@example.com',
      username: 'TestUser',
      role: 'user',
      avatar: null,
      defaultCurrency: 'USD',
    } as any;
  }

  next();
};

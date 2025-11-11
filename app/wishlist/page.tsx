import AppLayout from '@/components/AppLayout';
import WishlistPage from '@/components/sections/WishlistPage';

export const metadata = {
  title: 'المفضلة | My Wishlist - Luna Caftan',
  description: 'قائمة القفاطين المفضلة لديك | Your favorite caftans wishlist',
};

export default function Wishlist() {
  return (
    <AppLayout>
      <WishlistPage />
    </AppLayout>
  );
}
